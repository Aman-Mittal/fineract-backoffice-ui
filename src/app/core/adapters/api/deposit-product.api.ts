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

import { InjectionToken, inject } from '@angular/core';
import type { Observable } from 'rxjs';

import type { DepositType } from './deposit-account.api';
import { FineractDepositProductApi } from './fineract-deposit-product.api';

/**
 * Fixed and recurring deposit *products*, stated as application operations.
 *
 * The account side of this module is already behind {@link DepositAccountApi}; this is the other
 * half. The two product screens were the same screen written twice — the fixed and recurring
 * forms differ in three fields and nothing else — and each read its product through an untyped
 * record because the generated response models leave out fields the platform sends. Two copies
 * of a payload read is two places for a field position to be wrong, which is how this module
 * earned its model in the first place.
 *
 * ## What was measured
 *
 * | Read                                        | What the payload actually does                 |
 * | ------------------------------------------- | ---------------------------------------------- |
 * | list row's `nominalAnnualInterestRate`      | always `0`; the rate lives in the chart        |
 * | `recurringDepositFrequency` on a product     | never reported, even when created with one     |
 * | `maxDepositTermType`, `inMultiplesOf`, …    | sent, but absent from the generated model      |
 *
 * The first is why the deposit product lists showed `0.00 %` against every product, and is
 * modelled out of existence here: a summary carries no rate, because no rate is what the list
 * endpoint answers. See {@link DepositProductSummary}.
 */
export interface DepositProductApi {
  /**
   * Every product of this kind, as the list screens show them.
   *
   * Deliberately **not** paged: `GET /{type}depositproducts` answers a bare array, with no
   * `pageItems` envelope and no offset parameters, and the tables page and sort in the browser.
   */
  list(type: DepositType): Observable<DepositProductSummary[]>;

  /** One product, with everything an edit has to send back. */
  get(type: DepositType, productId: number): Observable<DepositProduct>;

  /** What creating a product of this kind offers. */
  template(type: DepositType): Observable<DepositProductTemplate>;

  /** Creates a product. The caller builds the body, which differs by deposit type. */
  create(type: DepositType, body: Record<string, unknown>): Observable<void>;

  /**
   * Changes a product.
   *
   * Every field the body omits is a field the platform leaves alone — except `charts`, which is
   * mandatory on an update and has to be *this product's* chart, ids included. A freshly built
   * one answers `500`, which is what made a deposit product uneditable.
   */
  update(type: DepositType, productId: number, body: Record<string, unknown>): Observable<void>;
}

/**
 * A deposit product as its list screen shows one.
 *
 * There is no interest rate here, on purpose. The list endpoint answers
 * `nominalAnnualInterestRate: 0` for every product — measured across 59 fixed and 3 recurring
 * deposit products on a running Fineract, including products whose charts pay 5% and 7% — and
 * it carries no chart to read the real figure from. A deposit product's rate is a chart of bands
 * by term, not one number, so the list states the figures it does have: the deposit amount and
 * the minimum term.
 */
export interface DepositProductSummary {
  readonly id: number;
  readonly name: string;
  readonly shortName: string;
  readonly currencyCode: string;
  readonly depositAmount: number | null;
  readonly minDepositTerm: number | null;
  /** The unit that term is in ("Months"), for display beside it. */
  readonly minDepositTermUnit: string;
}

/**
 * A deposit product, as its form edits one.
 *
 * Every field here is one the form sends back on an update, because an update drops what it
 * omits: reading six fields and hardcoding the rest is what used to reset a product's deposit
 * amount to 1,000 and strip its accounting rule along with every GL mapping under it.
 */
export interface DepositProduct {
  readonly id: number;
  readonly name: string;
  readonly shortName: string;
  readonly description: string;
  readonly currencyCode: string;
  readonly decimalPlaces: number | null;
  readonly inMultiplesOf: number | null;
  readonly minDepositTerm: number | null;
  readonly minDepositTermTypeId: number | null;
  readonly maxDepositTerm: number | null;
  readonly maxDepositTermTypeId: number | null;
  readonly depositAmount: number | null;
  readonly minDepositAmount: number | null;
  readonly maxDepositAmount: number | null;
  /**
   * How often a recurring deposit is paid into, and in what unit.
   *
   * `null` on every recurring product measured, including one created with a recurrence a moment
   * earlier: `GET /recurringdepositproducts/{id}` does not report `recurringDepositFrequency` at
   * all, and neither does the account template for that product. The form therefore falls back
   * to its own default rather than showing the product's real recurrence — stated here so the
   * next reader does not take the blank for "none".
   */
  readonly recurringFrequency: number | null;
  readonly recurringFrequencyTypeId: number | null;
  readonly interestCompoundingPeriodTypeId: number | null;
  readonly interestPostingPeriodTypeId: number | null;
  readonly interestCalculationTypeId: number | null;
  readonly interestCalculationDaysInYearTypeId: number | null;
  readonly preClosurePenalApplicable: boolean;
  readonly accountingRuleId: number | null;
  /** The product's active chart, ids included, because an update has to send it back. */
  readonly chart: DepositProductChart | null;
  /**
   * The GL accounts this product posts to, keyed as the response keys them.
   *
   * Left as a record because the accounting section is shared by the loan, savings, share and
   * deposit product forms and reads it by its own field list — a model here would be a fifth
   * statement of the same mapping. `null` when the product posts to none.
   */
  readonly accountingMappings: Record<string, unknown> | null;
}

/** A product's interest rate chart, with the ids that make an update a change rather than a new one. */
export interface DepositProductChart {
  readonly id: number | null;
  readonly slabs: readonly DepositProductChartSlab[];
}

/** One band of a product's chart, flattened out of its enum wrappers. */
export interface DepositProductChartSlab {
  readonly id: number | null;
  readonly periodTypeId: number | null;
  readonly fromPeriod: number | null;
  /** Absent on an open-ended last band, which is how "12 months and over" is written. */
  readonly toPeriod: number | null;
  readonly annualInterestRate: number | null;
  readonly description: string;
}

/**
 * What creating a deposit product offers, from `GET /{type}depositproducts/template`.
 *
 * The same shape for both kinds. The fixed and recurring templates differ only in the three
 * recurring-specific flags, none of which these forms edit.
 */
export interface DepositProductTemplate {
  readonly accountingRuleOptions: readonly DepositProductOptionLabel[];
  readonly accountingMappingOptions: DepositGlAccountOptions;
  /** The period units a chart slab may be expressed in, from `chartTemplate.periodTypes`. */
  readonly chartPeriodTypes: readonly DepositProductOptionLabel[];
  readonly interestCompoundingPeriodTypes: readonly DepositProductOptionLabel[];
  readonly interestPostingPeriodTypes: readonly DepositProductOptionLabel[];
  readonly interestCalculationTypes: readonly DepositProductOptionLabel[];
  readonly interestCalculationDaysInYearTypes: readonly DepositProductOptionLabel[];
}

/** An id-and-label option. Options with no id are dropped: one that cannot be sent is not offered. */
export interface DepositProductOptionLabel {
  readonly id: number;
  readonly value: string;
}

/**
 * The GL accounts a product may post to, by kind.
 *
 * Structurally what the shared accounting section expects, so the form hands it straight on.
 * Every list is present and empty rather than absent, which is what stops a template with no
 * accounts configured from reading as a template that failed to load.
 */
export interface DepositGlAccountOptions {
  readonly assetAccountOptions: readonly DepositGlAccount[];
  readonly liabilityAccountOptions: readonly DepositGlAccount[];
  readonly equityAccountOptions: readonly DepositGlAccount[];
  readonly incomeAccountOptions: readonly DepositGlAccount[];
  readonly expenseAccountOptions: readonly DepositGlAccount[];
}

/** One GL account, as a picker lists it. */
export interface DepositGlAccount {
  readonly id: number;
  readonly name: string;
  readonly glCode: string;
}

/**
 * Injection token for the active {@link DepositProductApi}. Defaults to the Fineract
 * implementation.
 */
export const DEPOSIT_PRODUCT_API = new InjectionToken<DepositProductApi>('DepositProductApi', {
  providedIn: 'root',
  factory: () => inject(FineractDepositProductApi),
});
