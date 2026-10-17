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

import { FineractDepositAccountApi } from './fineract-deposit-account.api';

/**
 * Which kind of term deposit. Fineract gives the two their own endpoints and their own generated
 * services, and the screens serve both, so every operation here takes it.
 */
export type DepositType = 'fixed' | 'recurring';

/**
 * A term deposit account, as the application understands one.
 *
 * ## Why this model exists
 *
 * Four separate defects in this module came from reading a field that is not where it looks like
 * it should be, and three of them had unit tests that passed against invented fixtures. Each one
 * is a statement about the wire that was made at the call site instead of once:
 *
 * | Read                                   | What the payload actually does                    |
 * | -------------------------------------- | ------------------------------------------------- |
 * | `accountBalance`                       | absent; the balance is `summary.accountBalance`   |
 * | `savingsProductId`                     | absent; a deposit answers `depositProductId`      |
 * | template's `nominalAnnualInterestRate` | sent as `0`; the rate is in the chart's slabs     |
 * | template's `depositAmount`             | absent; it is on the *product*                    |
 *
 * All four were measured against a running Fineract. Stated here, they are stated once, and the
 * next screen to read a deposit cannot get them wrong — which is what ADR 0006's boundary is
 * for.
 *
 * ## `raw`
 *
 * The deposit account view still binds most of its template through an untyped record, so the
 * mapped account carries the payload with it. That is migration debt, named rather than hidden:
 * the next pass over that screen replaces each `raw['field']` binding with a field above, and
 * `raw` goes. Nothing new should read it.
 */
export interface DepositAccount {
  readonly id: number;
  readonly accountNo: string;
  readonly clientId: number | null;
  /** `depositProductId` on a deposit account; `savingsProductId` is the savings response's name. */
  readonly productId: number | null;
  /** `summary.accountBalance`. `null` when the payload states none, never 0 — see below. */
  readonly balance: number | null;
  readonly depositAmount: number | null;
  readonly depositPeriod: number | null;
  /** The unit the period is in ("Months"), from `depositPeriodFrequency`. */
  readonly depositPeriodUnit: string | null;
  readonly maturityAmount: number | null;
  /** ISO `YYYY-MM-DD`, converted from Fineract's `[year, month, day]`. */
  readonly maturityDate: string | null;
  readonly nominalAnnualInterestRate: number | null;
  /** The account number of the savings account that *funded* this deposit, if one did. */
  readonly linkedAccountNo: string | null;
  readonly transferInterestToSavings: boolean;
  /**
   * The charges on this account.
   *
   * Present because {@link DepositAccountApi.get} asks for `associations=all`. The screen used
   * to fetch the account twice — once through the generated client without associations, then
   * again by hand with them — to get this list.
   */
  readonly charges: readonly DepositAccountCharge[];
  /**
   * The payload, for bindings not yet migrated off it. Migration debt — see the class note.
   *
   * The interest-rate-chart tab still reads `accountChart.chartSlabs` through this, because it
   * displays more of a slab than {@link DepositRateSlab} carries — incentives, amount bands and
   * the period type's label. That richer display shape is the next thing to model.
   */
  readonly raw: Record<string, unknown>;
}

/** A charge on a deposit account, as the charges tab shows one. */
export interface DepositAccountCharge {
  readonly id: number | null;
  readonly name: string;
  readonly amount: number | null;
  readonly amountOutstanding: number | null;
}

/**
 * What opening a deposit account offers, from `GET /{type}depositaccounts/template`.
 *
 * `rate` is deliberately absent: the template's own `nominalAnnualInterestRate` is `0` even for a
 * product whose chart pays 7%, so a rate here would be a lie. The caller reads it out of
 * {@link chartSlabs} for the term it is opening, which is what `rateForTerm` does.
 */
export interface DepositAccountTemplate {
  /** The product's minimum term, which is the sensible default for a new account. */
  readonly minDepositTerm: number | null;
  /** The unit of that term, as a period-frequency id. */
  readonly minDepositTermTypeId: number | null;
  readonly chartSlabs: readonly DepositRateSlab[];
  readonly savingsAccounts: readonly DepositSavingsAccount[];
  readonly maturityInstructions: readonly DepositEnumOption[];
  readonly chargeOptions: readonly DepositChargeOption[];
  /** The products this client may open an account under. */
  readonly productOptions: readonly DepositProductOption[];
}

/** A deposit product, as the account template's picker lists one. */
export interface DepositProductOption {
  readonly id: number;
  readonly name: string;
}

/** One band of a product's rate chart, flattened out of its enum wrappers. */
export interface DepositRateSlab {
  readonly periodTypeId: number | null;
  readonly fromPeriod: number | null;
  /** Absent on an open-ended last band, which is how "12 months and over" is written. */
  readonly toPeriod: number | null;
  readonly annualInterestRate: number | null;
}

/** A savings account of the same client. */
export interface DepositSavingsAccount {
  readonly id: number;
  readonly accountNo: string;
}

/** An id-and-label option, as Fineract's enum lists give one. */
export interface DepositEnumOption {
  readonly id: number;
  readonly value: string;
}

/** A charge the product allows on its accounts. */
export interface DepositChargeOption {
  readonly id: number;
  readonly name: string;
}

/**
 * What closing a deposit offers, from the account's own `?command=close` template.
 *
 * The options are returned unfiltered. Which of them the platform will actually accept depends
 * on the command — measured, `prematureClose` refuses the two re-investment options with
 * `reinvest.not.allowed` while the template offers them for both — and that is a rule about the
 * *operation*, so the dialog applies it rather than this adapter pretending the template said so.
 */
export interface DepositClosureTemplate {
  readonly options: readonly DepositEnumOption[];
  readonly transferTargets: readonly DepositSavingsAccount[];
  /** The account this deposit already pays into, when it has one. */
  readonly defaultTransferTargetId: number | null;
}

/** A charge to attach to a deposit account. The date is ISO; the adapter adds the format. */
export interface DepositChargeRequest {
  readonly chargeId: number;
  readonly amount: number;
  readonly dueDate: string;
}

/**
 * Term deposit accounts, stated as application operations.
 *
 * One token for both kinds. Every method takes the {@link DepositType} rather than there being
 * two tokens, because the screens are one screen: a caller that had to pick an adapter would be
 * making the same `isRD ? … : …` choice this hides.
 */
export interface DepositAccountApi {
  /** One account, with its charges and rate chart. */
  get(type: DepositType, accountId: number): Observable<DepositAccount>;

  /**
   * The account's transactions.
   *
   * Returned as payload records rather than a model, which is the one unmodelled return here and
   * is deliberate: the transactions table formats Fineract's `[year, month, day]` dates itself,
   * so converting them in the adapter would change what the table renders. The *request* is
   * what this hides, and it is worth hiding — the two deposit types disagree about it, which the
   * implementation documents.
   */
  transactions(type: DepositType, accountId: number): Observable<Record<string, unknown>[]>;

  /** What opening an account under this product offers. */
  template(
    type: DepositType,
    clientId: number,
    productId?: number,
  ): Observable<DepositAccountTemplate>;

  /** The deposit amount the product defaults to, which the account template does not carry. */
  productDepositAmount(type: DepositType, productId: number): Observable<number | null>;

  /** What closing this account offers. */
  closureTemplate(type: DepositType, accountId: number): Observable<DepositClosureTemplate>;

  /**
   * What the client would receive if the deposit were closed today.
   *
   * A `POST` that changes nothing — it prices the closure — and the difference between a teller
   * quoting a figure and guessing one. `null` when the platform does not answer with one.
   */
  prematureAmount(
    type: DepositType,
    accountId: number,
    closedOnDate: string,
  ): Observable<number | null>;

  /** Opens an account. The caller builds the body, which differs by deposit type and product. */
  create(type: DepositType, body: Record<string, unknown>): Observable<void>;

  /**
   * Changes an open application.
   *
   * The caller names the fields: an update must not resend the client and product, and every
   * field it leaves out is a field the platform drops.
   */
  update(type: DepositType, accountId: number, body: Record<string, unknown>): Observable<void>;

  /**
   * Issues a command against one transaction — `undo` being the one the screens use.
   *
   * Separate from {@link command} because the URL carries the transaction id, and because the
   * two deposit types have differently-named generated methods for it that take the body as a
   * required positional argument even when the command ignores it.
   */
  transactionCommand(
    type: DepositType,
    accountId: number,
    transactionId: number,
    command: string,
  ): Observable<void>;

  /** Issues a lifecycle or servicing command. The caller builds the body; the platform varies. */
  command(
    type: DepositType,
    accountId: number,
    command: string,
    body: Record<string, unknown>,
  ): Observable<void>;

  /**
   * Attaches a charge.
   *
   * A deposit account is a savings-type account, and `POST /savingsaccounts/{id}/charges` is the
   * only endpoint the platform exposes for charging one — there is no deposit-specific path.
   */
  addCharge(accountId: number, charge: DepositChargeRequest): Observable<void>;
}

/**
 * Injection token for the active {@link DepositAccountApi}. Defaults to the Fineract
 * implementation.
 */
export const DEPOSIT_ACCOUNT_API = new InjectionToken<DepositAccountApi>('DepositAccountApi', {
  providedIn: 'root',
  factory: () => inject(FineractDepositAccountApi),
});
