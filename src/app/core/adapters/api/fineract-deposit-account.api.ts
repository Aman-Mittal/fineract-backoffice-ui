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

import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { map } from 'rxjs/operators';
import type { Observable } from 'rxjs';

import {
  BASE_PATH,
  FixedDepositAccountService,
  FixedDepositAccountTransactionsService,
  RecurringDepositAccountTransactionsService,
  FixedDepositProductService,
  RecurringDepositAccountService,
  RecurringDepositProductService,
  SavingsChargesService,
} from '../../../api';
import { toIsoFineractDate } from './fineract-date';
import type {
  DepositAccount,
  DepositAccountApi,
  DepositAccountTemplate,
  DepositChargeOption,
  DepositChargeRequest,
  DepositClosureTemplate,
  DepositEnumOption,
  DepositRateSlab,
  DepositSavingsAccount,
  DepositType,
} from './deposit-account.api';

/** Fineract's wire format for the dates this adapter sends. */
const DATE_FORMAT = 'yyyy-MM-dd';
const LOCALE = 'en';

/** An enum option as Fineract sends one, before it is flattened. */
interface EnumPayload {
  readonly id?: number;
  readonly value?: string;
}

/** A rate slab as the payload nests it. */
interface SlabPayload {
  readonly periodType?: EnumPayload;
  readonly fromPeriod?: number;
  readonly toPeriod?: number;
  readonly annualInterestRate?: number;
}

/** The parts of a deposit account payload this adapter reads. */
interface AccountPayload {
  readonly id?: number;
  readonly accountNo?: string;
  readonly clientId?: number;
  /** What a deposit account calls its product. */
  readonly depositProductId?: number;
  /** What a savings account calls it; declared by the generated type, absent on deposits. */
  readonly savingsProductId?: number;
  /** Absent on a deposit account — the balance is under `summary`. */
  readonly accountBalance?: number;
  readonly summary?: { readonly accountBalance?: number };
  readonly depositAmount?: number;
  readonly depositPeriod?: number;
  readonly depositPeriodFrequency?: EnumPayload;
  readonly maturityAmount?: number;
  readonly maturityDate?: string | number[];
  readonly nominalAnnualInterestRate?: number;
  readonly linkedAccount?: { readonly accountNo?: string };
  readonly transferInterestToSavings?: boolean;
  readonly charges?: {
    id?: number;
    name?: string;
    amount?: number;
    amountOutstanding?: number;
  }[];
}

/** The parts of an account template this adapter reads. */
interface TemplatePayload {
  readonly productOptions?: { id?: number; name?: string }[];
  readonly minDepositTerm?: number;
  readonly minDepositTermType?: EnumPayload;
  readonly accountChart?: { readonly chartSlabs?: SlabPayload[] };
  readonly savingsAccounts?: { id?: number; accountNo?: string }[];
  readonly maturityInstructionOptions?: EnumPayload[];
  readonly chargeOptions?: { id?: number; name?: string }[];
}

/** The parts of a close template this adapter reads. */
interface ClosureTemplatePayload {
  readonly onAccountClosureOptions?: EnumPayload[];
  readonly savingsAccounts?: { id?: number; accountNo?: string }[];
  readonly transferToSavingsId?: number;
}

/**
 * Maps one deposit account payload onto the application model.
 *
 * Exported for its own test. This is where an upstream shape change is meant to surface, and
 * where the four field positions issue #764 and #766 turned on are stated:
 *
 * - the balance is `summary.accountBalance`; the top level carries none
 * - the product is `depositProductId`; `savingsProductId` is the savings response's name
 *
 * The balance maps to `null` rather than 0 when neither is present. A zero balance and an
 * unknown one are different facts, and reporting the second as the first is how a wrong figure
 * gets quoted to a customer.
 */
export function mapDepositAccount(payload: AccountPayload): DepositAccount {
  const balance = payload.summary?.accountBalance ?? payload.accountBalance;

  return {
    id: payload.id ?? 0,
    accountNo: payload.accountNo ?? '',
    clientId: payload.clientId ?? null,
    productId: payload.depositProductId ?? payload.savingsProductId ?? null,
    balance: balance ?? null,
    depositAmount: payload.depositAmount ?? null,
    depositPeriod: payload.depositPeriod ?? null,
    depositPeriodUnit: payload.depositPeriodFrequency?.value ?? null,
    maturityAmount: payload.maturityAmount ?? null,
    maturityDate: toIsoFineractDate(payload.maturityDate),
    nominalAnnualInterestRate: payload.nominalAnnualInterestRate ?? null,
    linkedAccountNo: payload.linkedAccount?.accountNo ?? null,
    transferInterestToSavings: payload.transferInterestToSavings === true,
    charges: (payload.charges ?? []).map((charge) => ({
      id: charge.id ?? null,
      name: charge.name ?? '',
      amount: charge.amount ?? null,
      amountOutstanding: charge.amountOutstanding ?? null,
    })),
    raw: payload as unknown as Record<string, unknown>,
  };
}

/** Flattens a rate chart's slabs out of their enum wrappers. Exported for its own test. */
export function mapRateSlabs(slabs: readonly SlabPayload[] | undefined): DepositRateSlab[] {
  return (slabs ?? []).map((slab) => ({
    periodTypeId: slab.periodType?.id ?? null,
    fromPeriod: slab.fromPeriod ?? null,
    toPeriod: slab.toPeriod ?? null,
    annualInterestRate: slab.annualInterestRate ?? null,
  }));
}

/** Drops options with no id: one that cannot be submitted should not be offered. */
function mapEnumOptions(options: readonly EnumPayload[] | undefined): DepositEnumOption[] {
  return (options ?? [])
    .filter((option): option is { id: number; value?: string } => option.id !== undefined)
    .map((option) => ({ id: option.id, value: option.value ?? String(option.id) }));
}

function mapSavingsAccounts(
  accounts: readonly { id?: number; accountNo?: string }[] | undefined,
): DepositSavingsAccount[] {
  return (accounts ?? [])
    .filter((account): account is { id: number; accountNo?: string } => account.id !== undefined)
    .map((account) => ({ id: account.id, accountNo: account.accountNo ?? String(account.id) }));
}

function mapChargeOptions(
  options: readonly { id?: number; name?: string }[] | undefined,
): DepositChargeOption[] {
  return (options ?? [])
    .filter((option): option is { id: number; name?: string } => option.id !== undefined)
    .map((option) => ({ id: option.id, name: option.name ?? String(option.id) }));
}

/**
 * {@link DepositAccountApi} over the generated OpenAPI client.
 *
 * One of the few places allowed to import `src/app/api` — see ADR 0006 and the `files` override
 * in `eslint.config.js`. The `isRD ? … : …` branching that used to sit in three screens lives
 * here instead, once per operation.
 */
@Injectable({ providedIn: 'root' })
export class FineractDepositAccountApi implements DepositAccountApi {
  private readonly fixedAccounts = inject(FixedDepositAccountService);
  private readonly fixedTransactions = inject(FixedDepositAccountTransactionsService);
  private readonly recurringTransactions = inject(RecurringDepositAccountTransactionsService);
  private readonly recurringAccounts = inject(RecurringDepositAccountService);
  private readonly fixedProducts = inject(FixedDepositProductService);
  private readonly recurringProducts = inject(RecurringDepositProductService);
  private readonly savingsCharges = inject(SavingsChargesService);
  private readonly http = inject(HttpClient);
  /**
   * The API root, for the one request that cannot go through the generated client.
   *
   * Optional, defaulting to a relative path, so a TestBed that provides `HttpClient` can
   * exercise this adapter without also providing the generated client's configuration — which a
   * test outside `src/app/api`'s boundary is not allowed to import.
   */
  private readonly basePath = inject(BASE_PATH, { optional: true }) ?? '';

  /**
   * One account, with its charges and rate chart.
   *
   * Issued through `HttpClient` rather than the generated service, which is the one place in this
   * adapter that does so. `GET /{type}depositaccounts/{id}` only returns `charges` and
   * `accountChart` when asked with `associations=all`, and the generated client has no parameter
   * for it — upstream documents the query in a comment and omits it from the operation, so the
   * method simply cannot express the request. That is issue #653's class of problem.
   *
   * The screens used to hand-build these URLs themselves, in four places. Behind the boundary it
   * is one, with the reason written down, which is what ADR 0003 asks of a workaround.
   */
  get(type: DepositType, accountId: number): Observable<DepositAccount> {
    const resource = type === 'recurring' ? 'recurringdepositaccounts' : 'fixeddepositaccounts';
    return this.http
      .get<AccountPayload>(`${this.basePath}/v1/${resource}/${accountId}`, {
        params: { associations: 'all' },
      })
      .pipe(map((payload) => mapDepositAccount(payload)));
  }

  /**
   * The account's transactions, where the two deposit types disagree about how to get them.
   *
   * **Fixed deposit** has a list endpoint, `GET /fixeddepositaccounts/{id}/transactions`, with a
   * generated method. That is the typed path and it is used.
   *
   * **Recurring deposit** has no such endpoint — it answers `405`. Its transactions come from
   * `?associations=transactions` on the account, which the generated client cannot send because
   * the upstream document describes no `associations` parameter for either deposit type (it does
   * for `/savingsaccounts/{accountId}`). Hence the `HttpClient` branch. Delete it once upstream
   * describes the parameter.
   *
   * This divergence used to sit in the account view. It is a fact about the platform, not about
   * that screen, which is why it belongs here.
   */
  transactions(type: DepositType, accountId: number): Observable<Record<string, unknown>[]> {
    if (type === 'recurring') {
      return this.http
        .get<{
          transactions?: Record<string, unknown>[];
        }>(`${this.basePath}/v1/recurringdepositaccounts/${accountId}`, {
          params: { associations: 'transactions' },
        })
        .pipe(map((account) => account.transactions ?? []));
    }
    return this.fixedTransactions
      .getFixeddepositaccountsFixedDepositAccountIdTransactions(accountId)
      .pipe(map((list) => (list ?? []) as unknown as Record<string, unknown>[]));
  }

  template(
    type: DepositType,
    clientId: number,
    productId?: number,
  ): Observable<DepositAccountTemplate> {
    const request$ =
      type === 'recurring'
        ? this.recurringAccounts.getRecurringdepositaccountsTemplate(clientId, undefined, productId)
        : this.fixedAccounts.getFixeddepositaccountsTemplate(clientId, undefined, productId);

    return request$.pipe(
      map((payload) => {
        const raw = payload as TemplatePayload;
        return {
          minDepositTerm: raw.minDepositTerm ?? null,
          minDepositTermTypeId: raw.minDepositTermType?.id ?? null,
          chartSlabs: mapRateSlabs(raw.accountChart?.chartSlabs),
          savingsAccounts: mapSavingsAccounts(raw.savingsAccounts),
          maturityInstructions: mapEnumOptions(raw.maturityInstructionOptions),
          chargeOptions: mapChargeOptions(raw.chargeOptions),
          productOptions: mapChargeOptions(raw.productOptions),
        };
      }),
    );
  }

  productDepositAmount(type: DepositType, productId: number): Observable<number | null> {
    // Annotated rather than inferred: each generated method is overloaded on `observe`, and a
    // ternary over two of them gives TypeScript a union of overload sets it resolves to the
    // wrong member ("Expected 0 arguments, but got 1").
    const request$: Observable<unknown> =
      type === 'recurring'
        ? this.recurringProducts.getRecurringdepositproductsProductId(productId)
        : this.fixedProducts.getFixeddepositproductsProductId(productId);
    return request$.pipe(
      map((product) => (product as { depositAmount?: number }).depositAmount ?? null),
    );
  }

  closureTemplate(type: DepositType, accountId: number): Observable<DepositClosureTemplate> {
    const request$ =
      type === 'recurring'
        ? this.recurringAccounts.getRecurringdepositaccountsAccountIdTemplate(accountId, 'close')
        : this.fixedAccounts.getFixeddepositaccountsAccountIdTemplate(accountId, 'close');

    return request$.pipe(
      map((payload) => {
        const raw = payload as ClosureTemplatePayload;
        return {
          options: mapEnumOptions(raw.onAccountClosureOptions),
          transferTargets: mapSavingsAccounts(raw.savingsAccounts),
          defaultTransferTargetId: raw.transferToSavingsId ?? null,
        };
      }),
    );
  }

  prematureAmount(
    type: DepositType,
    accountId: number,
    closedOnDate: string,
  ): Observable<number | null> {
    const body = { closedOnDate, locale: LOCALE, dateFormat: DATE_FORMAT };
    return this.post(type, accountId, 'calculatePrematureAmount', body).pipe(
      map((result) => (result as { maturityAmount?: number }).maturityAmount ?? null),
    );
  }

  create(type: DepositType, body: Record<string, unknown>): Observable<void> {
    const request$: Observable<unknown> =
      type === 'recurring'
        ? this.recurringAccounts.postRecurringdepositaccounts(body)
        : this.fixedAccounts.postFixeddepositaccounts(body);
    return request$.pipe(map(() => undefined));
  }

  update(type: DepositType, accountId: number, body: Record<string, unknown>): Observable<void> {
    const request$: Observable<unknown> =
      type === 'recurring'
        ? this.recurringAccounts.putRecurringdepositaccountsAccountId(accountId, body)
        : this.fixedAccounts.putFixeddepositaccountsAccountId(accountId, body);
    return request$.pipe(map(() => undefined));
  }

  transactionCommand(
    type: DepositType,
    accountId: number,
    transactionId: number,
    command: string,
  ): Observable<void> {
    // The body is unused by `undo` but is a required positional argument on both twins.
    const request$: Observable<unknown> =
      type === 'recurring'
        ? this.recurringTransactions.postRecurringdepositaccountsRecurringDepositAccountIdTransactionsTransactionId(
            accountId,
            transactionId,
            {},
            command,
          )
        : this.fixedTransactions.postFixeddepositaccountsFixedDepositAccountIdTransactionsTransactionId(
            accountId,
            transactionId,
            {},
            command,
          );
    return request$.pipe(map(() => undefined));
  }

  command(
    type: DepositType,
    accountId: number,
    command: string,
    body: Record<string, unknown>,
  ): Observable<void> {
    return this.post(type, accountId, command, body).pipe(map(() => undefined));
  }

  addCharge(accountId: number, charge: DepositChargeRequest): Observable<void> {
    return this.savingsCharges
      .postSavingsaccountsSavingsAccountIdCharges(accountId, {
        chargeId: charge.chargeId,
        amount: charge.amount,
        dueDate: charge.dueDate,
        dateFormat: DATE_FORMAT,
        locale: LOCALE,
      })
      .pipe(map(() => undefined));
  }

  private post(
    type: DepositType,
    accountId: number,
    command: string,
    body: Record<string, unknown>,
  ): Observable<unknown> {
    return type === 'recurring'
      ? this.recurringAccounts.postRecurringdepositaccountsAccountId(accountId, body, command)
      : this.fixedAccounts.postFixeddepositaccountsAccountId(accountId, body, command);
  }
}
