/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import { Injectable, inject } from '@angular/core';
import { map } from 'rxjs/operators';
import type { Observable } from 'rxjs';

import { FixedDepositProductService, RecurringDepositProductService } from '../../../api';
import type { DepositType } from './deposit-account.api';
import type {
  DepositGlAccount,
  DepositGlAccountOptions,
  DepositProduct,
  DepositProductApi,
  DepositProductChart,
  DepositProductChartSlab,
  DepositProductOptionLabel,
  DepositProductSummary,
  DepositProductTemplate,
} from './deposit-product.api';

/** An enum option as Fineract sends one, before it is flattened. */
interface EnumPayload {
  readonly id?: number;
  readonly value?: string;
}

/** A GL account option as the accounting template lists one. */
interface GlAccountPayload {
  readonly id?: number;
  readonly name?: string;
  readonly glCode?: string;
}

/** A product's chart slab, as the response nests it. */
interface ChartSlabPayload {
  readonly id?: number;
  readonly periodType?: EnumPayload;
  readonly fromPeriod?: number;
  readonly toPeriod?: number;
  readonly annualInterestRate?: number;
  readonly description?: string;
}

/** The parts of a product list row this adapter reads. */
interface SummaryPayload {
  readonly id?: number;
  readonly name?: string;
  readonly shortName?: string;
  readonly currency?: { readonly code?: string };
  readonly depositAmount?: number;
  readonly minDepositTerm?: number;
  readonly minDepositTermType?: EnumPayload;
}

/**
 * The parts of a product response this adapter reads.
 *
 * Several are fields the generated `GetFixedDepositProductsProductIdResponse` does not declare
 * at all — `inMultiplesOf`, `maxDepositTermType`, `depositAmount`, `minDepositAmount`,
 * `maxDepositAmount`, `preClosurePenalApplicable`, `accountingRule`, `activeChart` — which is
 * why both forms were reading their own product through a cast to `Record<string, unknown>`.
 * Declared here once, against what the platform actually sends.
 */
interface ProductPayload extends SummaryPayload {
  readonly description?: string;
  readonly currency?: {
    readonly code?: string;
    readonly decimalPlaces?: number;
    readonly inMultiplesOf?: number;
  };
  readonly maxDepositTerm?: number;
  readonly maxDepositTermType?: EnumPayload;
  readonly minDepositAmount?: number;
  readonly maxDepositAmount?: number;
  readonly recurringDepositFrequency?: number;
  readonly recurringDepositFrequencyType?: EnumPayload;
  readonly interestCompoundingPeriodType?: EnumPayload;
  readonly interestPostingPeriodType?: EnumPayload;
  readonly interestCalculationType?: EnumPayload;
  readonly interestCalculationDaysInYearType?: EnumPayload;
  readonly preClosurePenalApplicable?: boolean;
  readonly accountingRule?: EnumPayload;
  readonly activeChart?: { readonly id?: number; readonly chartSlabs?: ChartSlabPayload[] };
  readonly accountingMappings?: Record<string, unknown>;
}

/** The parts of a product template this adapter reads. */
interface TemplatePayload {
  readonly accountingRuleOptions?: EnumPayload[];
  readonly accountingMappingOptions?: {
    readonly assetAccountOptions?: GlAccountPayload[];
    readonly liabilityAccountOptions?: GlAccountPayload[];
    readonly equityAccountOptions?: GlAccountPayload[];
    readonly incomeAccountOptions?: GlAccountPayload[];
    readonly expenseAccountOptions?: GlAccountPayload[];
  };
  readonly chartTemplate?: { readonly periodTypes?: EnumPayload[] };
  readonly interestCompoundingPeriodTypeOptions?: EnumPayload[];
  readonly interestPostingPeriodTypeOptions?: EnumPayload[];
  readonly interestCalculationTypeOptions?: EnumPayload[];
  readonly interestCalculationDaysInYearTypeOptions?: EnumPayload[];
}

/**
 * Maps a product list row. Exported for its own test.
 *
 * No rate. The list endpoint answers `nominalAnnualInterestRate: 0` for every deposit product
 * it has ever been asked about — see {@link DepositProductSummary} — so there is nothing
 * truthful to map it to, and a column bound to it printed `0.00 %` against products paying 5%
 * and 7%.
 */
export function mapDepositProductSummary(payload: SummaryPayload): DepositProductSummary {
  return {
    id: payload.id ?? 0,
    name: payload.name ?? '',
    shortName: payload.shortName ?? '',
    currencyCode: payload.currency?.code ?? '',
    depositAmount: payload.depositAmount ?? null,
    minDepositTerm: payload.minDepositTerm ?? null,
    minDepositTermUnit: payload.minDepositTermType?.value ?? '',
  };
}

/**
 * Maps a product. Exported for its own test.
 *
 * Numbers map to `null` rather than 0 when the payload omits them, because a product with no
 * maximum deposit and a product capped at nothing are different products, and the form resends
 * what it is given.
 */
export function mapDepositProduct(payload: ProductPayload): DepositProduct {
  return {
    ...mapDepositProductSummary(payload),
    description: payload.description ?? '',
    decimalPlaces: payload.currency?.decimalPlaces ?? null,
    inMultiplesOf: payload.currency?.inMultiplesOf ?? null,
    minDepositTermTypeId: payload.minDepositTermType?.id ?? null,
    maxDepositTerm: payload.maxDepositTerm ?? null,
    maxDepositTermTypeId: payload.maxDepositTermType?.id ?? null,
    minDepositAmount: payload.minDepositAmount ?? null,
    maxDepositAmount: payload.maxDepositAmount ?? null,
    // Never reported by the platform — see `DepositProduct.recurringFrequency`.
    recurringFrequency: payload.recurringDepositFrequency ?? null,
    recurringFrequencyTypeId: payload.recurringDepositFrequencyType?.id ?? null,
    interestCompoundingPeriodTypeId: payload.interestCompoundingPeriodType?.id ?? null,
    interestPostingPeriodTypeId: payload.interestPostingPeriodType?.id ?? null,
    interestCalculationTypeId: payload.interestCalculationType?.id ?? null,
    interestCalculationDaysInYearTypeId: payload.interestCalculationDaysInYearType?.id ?? null,
    preClosurePenalApplicable: payload.preClosurePenalApplicable === true,
    accountingRuleId: payload.accountingRule?.id ?? null,
    chart: mapProductChart(payload.activeChart),
    accountingMappings: payload.accountingMappings ?? null,
  };
}

/**
 * Maps a product's active chart, ids and all. Exported for its own test.
 *
 * The ids are the whole point: a chart sent back without them reads as a brand new chart, and
 * the platform answers `500 Internal Server Error` rather than a validation message — which is
 * what made a fixed deposit product impossible to edit at all.
 *
 * `null` for a chart with no slabs, so a caller can tell "this product has a chart to resend"
 * from "it has none" without inspecting an empty array.
 */
export function mapProductChart(
  chart: { readonly id?: number; readonly chartSlabs?: ChartSlabPayload[] } | undefined,
): DepositProductChart | null {
  if (!chart?.chartSlabs?.length) return null;
  return {
    id: chart.id ?? null,
    slabs: chart.chartSlabs.map(mapProductChartSlab),
  };
}

function mapProductChartSlab(slab: ChartSlabPayload): DepositProductChartSlab {
  return {
    id: slab.id ?? null,
    periodTypeId: slab.periodType?.id ?? null,
    fromPeriod: slab.fromPeriod ?? null,
    toPeriod: slab.toPeriod ?? null,
    annualInterestRate: slab.annualInterestRate ?? null,
    description: slab.description ?? '',
  };
}

/** Drops options with no id: one that cannot be submitted should not be offered. */
function mapOptions(options: readonly EnumPayload[] | undefined): DepositProductOptionLabel[] {
  return (options ?? [])
    .filter((option): option is { id: number; value?: string } => option.id !== undefined)
    .map((option) => ({ id: option.id, value: option.value ?? String(option.id) }));
}

function mapGlAccounts(accounts: readonly GlAccountPayload[] | undefined): DepositGlAccount[] {
  return (accounts ?? [])
    .filter((account): account is { id: number } & GlAccountPayload => account.id !== undefined)
    .map((account) => ({
      id: account.id,
      name: account.name ?? String(account.id),
      glCode: account.glCode ?? '',
    }));
}

function mapGlAccountOptions(
  options: TemplatePayload['accountingMappingOptions'],
): DepositGlAccountOptions {
  return {
    assetAccountOptions: mapGlAccounts(options?.assetAccountOptions),
    liabilityAccountOptions: mapGlAccounts(options?.liabilityAccountOptions),
    equityAccountOptions: mapGlAccounts(options?.equityAccountOptions),
    incomeAccountOptions: mapGlAccounts(options?.incomeAccountOptions),
    expenseAccountOptions: mapGlAccounts(options?.expenseAccountOptions),
  };
}

/** Maps a product template. Exported for its own test. */
export function mapDepositProductTemplate(payload: TemplatePayload): DepositProductTemplate {
  return {
    accountingRuleOptions: mapOptions(payload.accountingRuleOptions),
    accountingMappingOptions: mapGlAccountOptions(payload.accountingMappingOptions),
    // Nested under `chartTemplate`, not at the top level: the period units belong to the chart.
    chartPeriodTypes: mapOptions(payload.chartTemplate?.periodTypes),
    interestCompoundingPeriodTypes: mapOptions(payload.interestCompoundingPeriodTypeOptions),
    interestPostingPeriodTypes: mapOptions(payload.interestPostingPeriodTypeOptions),
    interestCalculationTypes: mapOptions(payload.interestCalculationTypeOptions),
    interestCalculationDaysInYearTypes: mapOptions(
      payload.interestCalculationDaysInYearTypeOptions,
    ),
  };
}

/**
 * {@link DepositProductApi} over the generated OpenAPI client.
 *
 * One of the few places allowed to import `src/app/api` — see ADR 0006 and the `files` override
 * in `eslint.config.js`. The `isRD ? … : …` choice the two product screens made at four call
 * sites each lives here instead, once per operation.
 *
 * Every mapper takes the payload shape rather than the generated response type on purpose: the
 * generated template getter is declared `Observable<string>` for a JSON object, and the product
 * response model omits eight of the fields the form has to resend. Issue #653 is the general
 * case; this adapter is where it stops being the screens' problem.
 */
@Injectable({ providedIn: 'root' })
export class FineractDepositProductApi implements DepositProductApi {
  private readonly fixed = inject(FixedDepositProductService);
  private readonly recurring = inject(RecurringDepositProductService);

  list(type: DepositType): Observable<DepositProductSummary[]> {
    // Annotated rather than inferred: each generated method is overloaded on `observe`, and a
    // ternary over two of them gives TypeScript a union of overload sets it resolves to the
    // wrong member ("Expected 0 arguments, but got 1").
    const request$: Observable<unknown> =
      type === 'recurring'
        ? this.recurring.getRecurringdepositproducts()
        : this.fixed.getFixeddepositproducts();
    return request$.pipe(
      map((products) => (products as SummaryPayload[]) ?? []),
      map((products) => products.map(mapDepositProductSummary)),
    );
  }

  get(type: DepositType, productId: number): Observable<DepositProduct> {
    const request$: Observable<unknown> =
      type === 'recurring'
        ? this.recurring.getRecurringdepositproductsProductId(productId)
        : this.fixed.getFixeddepositproductsProductId(productId);
    return request$.pipe(map((product) => mapDepositProduct(product as ProductPayload)));
  }

  template(type: DepositType): Observable<DepositProductTemplate> {
    const request$: Observable<unknown> =
      type === 'recurring'
        ? this.recurring.getRecurringdepositproductsTemplate()
        : this.fixed.getFixeddepositproductsTemplate();
    return request$.pipe(map((template) => mapDepositProductTemplate(template as TemplatePayload)));
  }

  create(type: DepositType, body: Record<string, unknown>): Observable<void> {
    const request$: Observable<unknown> =
      type === 'recurring'
        ? this.recurring.postRecurringdepositproducts(body)
        : this.fixed.postFixeddepositproducts(body);
    return request$.pipe(map(() => undefined));
  }

  update(type: DepositType, productId: number, body: Record<string, unknown>): Observable<void> {
    const request$: Observable<unknown> =
      type === 'recurring'
        ? this.recurring.putRecurringdepositproductsProductId(productId, body)
        : this.fixed.putFixeddepositproductsProductId(productId, body);
    return request$.pipe(map(() => undefined));
  }
}
