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

import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import {
  FineractDepositAccountApi,
  mapChartRows,
  mapDepositAccount,
  mapDepositTransaction,
  mapOnHoldTransaction,
  mapRateSlabs,
} from './fineract-deposit-account.api';

/**
 * The deposit account adapter.
 *
 * This is where the four field positions the deposits module kept getting wrong are pinned. Each
 * was measured against a running Fineract, and each had been stated at a call site instead of
 * once — which is how three of them shipped with unit tests that passed against invented
 * fixtures:
 *
 * | Read                                   | What the payload actually does                    |
 * | -------------------------------------- | ------------------------------------------------- |
 * | `accountBalance`                       | absent; the balance is `summary.accountBalance`   |
 * | `savingsProductId`                     | absent; a deposit answers `depositProductId`      |
 * | template's `nominalAnnualInterestRate` | sent as `0`; the rate is in the chart's slabs     |
 * | template's `depositAmount`             | absent; it is on the *product*                    |
 * | `productName`                          | absent; a deposit answers `depositProductName`    |
 *
 * The fixtures below are the real payloads. One that invented `accountBalance` would pass
 * against the code these replaced, which is the whole reason the boundary is worth having.
 */
describe('mapDepositAccount', () => {
  /** `GET /fixeddepositaccounts/{id}?associations=all` on an active account, as sent. */
  const ACTIVE = {
    id: 7,
    accountNo: '000000007',
    clientId: 42,
    depositProductId: 21,
    depositAmount: 5000,
    depositPeriod: 12,
    depositPeriodFrequency: { id: 2, value: 'Months' },
    maturityAmount: 5350.03,
    maturityDate: [2027, 10, 17],
    nominalAnnualInterestRate: 7,
    linkedAccount: { id: 11, accountNo: '000000011' },
    transferInterestToSavings: true,
    summary: { accountBalance: 5000 },
    charges: [{ id: 3, name: 'Withdrawal Fee', amount: 5, amountOutstanding: 5 }],
    // As measured: the product's name arrives under `depositProductName`, and `productName` —
    // which the account view used to bind — is not a key of the response at all.
    depositProductName: 'E2E FD 12m',
    clientName: 'Dep Probe',
    status: {
      id: 300,
      code: 'savingsAccountStatusType.active',
      value: 'Active',
      submittedAndPendingApproval: false,
      approved: false,
      active: true,
    },
    currency: { code: 'USD', displaySymbol: '$', decimalPlaces: 2 },
    timeline: {
      submittedOnDate: [2026, 10, 18],
      approvedOnDate: [2026, 10, 18],
      activatedOnDate: [2026, 10, 18],
    },
  };

  it('reads the balance from summary, which is the only place it is', () => {
    expect(mapDepositAccount(ACTIVE).balance).toBe(5000);
    // And the payload really does not carry it at the top level.
    expect((ACTIVE as { accountBalance?: number }).accountBalance).toBeUndefined();
  });

  it('still reads a top-level balance when one is sent', () => {
    // Not dropped: the savings responses carry it there, and a payload that does should not be
    // ignored.
    expect(mapDepositAccount({ accountBalance: 1234 }).balance).toBe(1234);
  });

  it('prefers summary when both are present', () => {
    expect(mapDepositAccount({ accountBalance: 1, summary: { accountBalance: 2 } }).balance).toBe(
      2,
    );
  });

  it('answers null for an absent balance rather than zero', () => {
    // A zero balance and an unknown one are different facts, and reporting the second as the
    // first is how a wrong figure gets quoted to a customer.
    expect(mapDepositAccount({ id: 7 }).balance).toBeNull();
  });

  it('reads the product from depositProductId, not savingsProductId', () => {
    expect(mapDepositAccount(ACTIVE).productId).toBe(21);
  });

  it('falls back to savingsProductId, which the savings responses use', () => {
    expect(mapDepositAccount({ savingsProductId: 9 }).productId).toBe(9);
  });

  it('answers null when neither product id is present', () => {
    // Which is what a caller needs in order not to request a template for product `undefined`.
    expect(mapDepositAccount({ id: 7 }).productId).toBeNull();
  });

  it('converts the maturity date out of Fineract array form', () => {
    expect(mapDepositAccount(ACTIVE).maturityDate).toBe('2027-10-17');
  });

  it('flattens the term unit out of its enum wrapper', () => {
    expect(mapDepositAccount(ACTIVE).depositPeriod).toBe(12);
    expect(mapDepositAccount(ACTIVE).depositPeriodUnit).toBe('Months');
  });

  it('flattens the funding account to its number', () => {
    // The account that *funded* the deposit: activation debits it. Not the maturity payout.
    expect(mapDepositAccount(ACTIVE).linkedAccountNo).toBe('000000011');
  });

  it('carries the charges the associations read brought with it', () => {
    expect(mapDepositAccount(ACTIVE).charges).toEqual([
      { id: 3, name: 'Withdrawal Fee', amount: 5, amountOutstanding: 5 },
    ]);
  });

  it('answers an empty charge list rather than undefined', () => {
    expect(mapDepositAccount({ id: 7 }).charges).toEqual([]);
  });

  it('reads the product name from depositProductName, which is where it is', () => {
    // The account view bound `productName` and so showed no heading on any deposit account.
    // The payload has no such key — asserted, because that absence is the bug.
    expect('productName' in ACTIVE).toBe(false);
    expect(mapDepositAccount(ACTIVE).productName).toBe('E2E FD 12m');
  });

  it('answers an empty name rather than undefined, so a heading renders blank not "undefined"', () => {
    expect(mapDepositAccount({ id: 7 }).productName).toBe('');
    expect(mapDepositAccount({ id: 7 }).clientName).toBe('');
  });

  it('carries the status flags the actions gate on, and the label they do not', () => {
    const status = mapDepositAccount(ACTIVE).status;
    expect(status).toEqual({
      value: 'Active',
      submittedAndPendingApproval: false,
      approved: false,
      active: true,
    });
  });

  it('reads an absent status as no flags set, rather than throwing on the screen', () => {
    expect(mapDepositAccount({ id: 7 }).status.active).toBe(false);
    expect(mapDepositAccount({ id: 7 }).status.value).toBe('');
  });

  it('converts every stamped date out of Fineract array form', () => {
    // The commands are floored on these, and a floor in `[y, m, d]` form compares as an array.
    expect(mapDepositAccount(ACTIVE).timeline).toEqual({
      submittedOnDate: '2026-10-18',
      approvedOnDate: '2026-10-18',
      activatedOnDate: '2026-10-18',
    });
  });

  it('answers null for a date the account has not reached yet', () => {
    const pending = mapDepositAccount({ timeline: { submittedOnDate: [2026, 10, 18] } });
    expect(pending.timeline.submittedOnDate).toBe('2026-10-18');
    expect(pending.timeline.approvedOnDate).toBeNull();
    expect(pending.timeline.activatedOnDate).toBeNull();
  });

  it('takes the display symbol, which is what the screens print beside a figure', () => {
    expect(mapDepositAccount(ACTIVE).currencySymbol).toBe('$');
    expect(mapDepositAccount({ id: 7 }).currencySymbol).toBe('');
  });

  it('answers null for minRequiredOpeningBalance, a savings field a deposit omits', () => {
    // Measured: the key is absent from a term deposit response. Mapped to 0 it would render as
    // a requirement of nothing rather than as not applicable.
    expect('minRequiredOpeningBalance' in ACTIVE).toBe(false);
    expect(mapDepositAccount(ACTIVE).minRequiredOpeningBalance).toBeNull();
    expect(mapDepositAccount({ minRequiredOpeningBalance: 0 }).minRequiredOpeningBalance).toBe(0);
  });
});

/**
 * The chart tab's rows.
 *
 * A displayed slab carries more than a submitted one — the amount band, the description and the
 * incentives, none of which the generated slab models declare. Flattened here so the tab prints
 * labels rather than reaching through `periodType.value` in a template.
 */
describe('mapChartRows', () => {
  /** One slab of `accountChart.chartSlabs`, as measured, with an incentive added. */
  const SLAB = {
    id: 51,
    description: 'Base rate',
    periodType: { id: 2, code: 'periodFrequencyType.months', value: 'Months' },
    fromPeriod: 1,
    toPeriod: 60,
    annualInterestRate: 5,
    amountRangeFrom: 0,
    amountRangeTo: 10_000,
    currency: { code: 'USD', displaySymbol: '$' },
    incentives: [
      {
        entityType: { id: 2, value: 'Customer' },
        attributeName: { id: 2, value: 'Gender' },
        conditionType: { id: 2, value: 'Equals' },
        attributeValueDesc: 'Female',
        incentiveType: { id: 2, value: 'Rate' },
        amount: 0.5,
      },
    ],
  };

  it('flattens a slab and its incentives down to the labels the tab prints', () => {
    expect(mapChartRows([SLAB])).toEqual([
      {
        fromPeriod: 1,
        toPeriod: 60,
        periodTypeLabel: 'Months',
        amountRangeFrom: 0,
        amountRangeTo: 10_000,
        annualInterestRate: 5,
        description: 'Base rate',
        incentives: [
          {
            entityType: 'Customer',
            attributeName: 'Gender',
            conditionType: 'Equals',
            attributeValue: 'Female',
            incentiveType: 'Rate',
            amount: 0.5,
          },
        ],
      },
    ]);
  });

  it('keeps an absent amount band null, so it reads as blank rather than as zero to zero', () => {
    const [row] = mapChartRows([{ fromPeriod: 1, toPeriod: 12, annualInterestRate: 4 }]);
    expect(row.amountRangeFrom).toBeNull();
    expect(row.amountRangeTo).toBeNull();
    expect(row.incentives).toEqual([]);
    expect(row.periodTypeLabel).toBe('');
  });

  it('answers an empty list for an account with no chart', () => {
    expect(mapChartRows(undefined)).toEqual([]);
    expect(mapDepositAccount({ id: 7 }).chartRows).toEqual([]);
  });

  it('reads the rows off the account read, which already asked for associations', () => {
    expect(mapDepositAccount({ accountChart: { chartSlabs: [SLAB] } }).chartRows).toHaveLength(1);
  });
});

describe('mapRateSlabs', () => {
  it('flattens the period type out of its enum wrapper', () => {
    expect(
      mapRateSlabs([
        {
          periodType: { id: 2, value: 'Months' },
          fromPeriod: 1,
          toPeriod: 12,
          annualInterestRate: 7,
        },
      ]),
    ).toEqual([{ periodTypeId: 2, fromPeriod: 1, toPeriod: 12, annualInterestRate: 7 }]);
  });

  it('keeps an open-ended band open-ended', () => {
    // A tiered chart's last slab usually has no `toPeriod` — "12 months and over". Defaulting it
    // to 0 or to `fromPeriod` would leave long deposits with no rate.
    expect(mapRateSlabs([{ periodType: { id: 2 }, fromPeriod: 12 }])[0]).toEqual({
      periodTypeId: 2,
      fromPeriod: 12,
      toPeriod: null,
      annualInterestRate: null,
    });
  });

  it('answers an empty list for a product with no chart', () => {
    expect(mapRateSlabs(undefined)).toEqual([]);
  });
});

/**
 * The transaction rows, where two screens printed the wire instead of the fact.
 *
 * Both fixtures are real rows from `GET /fixeddepositaccounts/{id}/transactions`, measured
 * against a running Fineract.
 */
describe('mapDepositTransaction', () => {
  const PAY_CHARGE = {
    id: 209,
    transactionType: {
      id: 7,
      code: 'savingsAccountTransactionType.payCharge',
      value: 'Pay Charge',
      feeDeduction: true,
    },
    entryType: 'DEBIT',
    accountId: 41,
    accountNo: '000000041',
    date: [2026, 10, 18],
    currency: { code: 'USD', displaySymbol: '$' },
    amount: 25,
    runningBalance: 975,
    reversed: false,
  };

  it('converts the date out of Fineract array form', () => {
    expect(mapDepositTransaction(PAY_CHARGE).date).toBe('2026-10-18');
  });

  it('takes the type label, not the dotted code the lists used to print', () => {
    expect(mapDepositTransaction(PAY_CHARGE).typeLabel).toBe('Pay Charge');
  });

  it('keeps the entry type the platform states, which is what colours a row', () => {
    expect(mapDepositTransaction(PAY_CHARGE).entryType).toBe('DEBIT');
  });

  it('answers null for an absent amount rather than zero', () => {
    expect(mapDepositTransaction({ id: 1 }).amount).toBeNull();
    expect(mapDepositTransaction({ id: 1 }).runningBalance).toBeNull();
  });

  it('reads an absent reversal flag as not reversed', () => {
    expect(mapDepositTransaction({ id: 1 }).reversed).toBe(false);
  });
});

/**
 * The on-hold rows.
 *
 * Measured with a hold in place: the response carries `savingsClientName`, `savingsAccountNo`
 * and `loanId` — and not `loanClientName`, which the screen rendered, so its "reason" column
 * was blank on every row.
 */
describe('mapOnHoldTransaction', () => {
  const HOLD = {
    id: 1,
    amount: 50,
    transactionType: { id: 1, code: 'deposutAccountOnHoldTransactionType.hold', value: 'hold' },
    transactionDate: [2026, 10, 19],
    reversed: false,
    savingsId: 112,
    savingsAccountNo: '000000112',
    savingsClientName: 'Dep Probe',
    loanId: 0,
  };

  it('converts the date out of Fineract array form', () => {
    expect(mapOnHoldTransaction(HOLD).date).toBe('2026-10-19');
  });

  it('reads loanId 0 as no loan, because 0 is not a loan', () => {
    expect(mapOnHoldTransaction(HOLD).loanId).toBeNull();
    expect(mapOnHoldTransaction({ ...HOLD, loanId: 88 }).loanId).toBe(88);
  });

  it('takes the client name the response really carries', () => {
    expect(mapOnHoldTransaction(HOLD).clientName).toBe('Dep Probe');
    // And the field the screen used to read is not a key of the response at all.
    expect((HOLD as { loanClientName?: string }).loanClientName).toBeUndefined();
  });
});

describe('FineractDepositAccountApi', () => {
  let api: FineractDepositAccountApi;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    api = TestBed.inject(FineractDepositAccountApi);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  /**
   * The account read asks for associations, which the generated client cannot.
   *
   * `GET /{type}depositaccounts/{id}` returns `charges` and `accountChart` only when asked with
   * `associations=all`, and the upstream document describes no such parameter for either deposit
   * type — it is in a doc comment and nowhere else. So this one request goes out through
   * `HttpClient`, and asserting the query here is what keeps that from silently regressing to a
   * read that returns neither.
   */
  it('asks for associations on the account read', () => {
    api.get('fixed', 7).subscribe();

    const request = http.expectOne(
      (candidate) =>
        candidate.method === 'GET' && candidate.url.endsWith('/v1/fixeddepositaccounts/7'),
    );
    expect(request.request.params.get('associations')).toBe('all');
    request.flush({ id: 7, summary: { accountBalance: 10 } });
  });

  it('reads a recurring deposit from its own resource', () => {
    api.get('recurring', 7).subscribe();

    http
      .expectOne((candidate) => candidate.url.endsWith('/v1/recurringdepositaccounts/7'))
      .flush({ id: 7 });
  });

  /**
   * The transaction list, where the two deposit types disagree.
   *
   * A recurring deposit has no list endpoint — `GET .../transactions` answers 405 — so its
   * transactions come from `?associations=transactions` on the account. A fixed deposit has one,
   * and uses it. This divergence used to live in the account view.
   */
  it('reads fixed deposit transactions from the list endpoint', () => {
    api.transactions('fixed', 7).subscribe();

    http
      .expectOne(
        (candidate) =>
          candidate.method === 'GET' &&
          candidate.url.endsWith('/v1/fixeddepositaccounts/7/transactions'),
      )
      .flush([{ id: 21 }]);
  });

  it('reads recurring deposit transactions off the account instead', () => {
    api.transactions('recurring', 7).subscribe();

    const request = http.expectOne(
      (candidate) =>
        candidate.method === 'GET' && candidate.url.endsWith('/v1/recurringdepositaccounts/7'),
    );
    expect(request.request.params.get('associations')).toBe('transactions');
    request.flush({ transactions: [{ id: 21 }] });
  });

  it('answers an empty list when a recurring account carries no transactions', () => {
    let result: unknown;
    api.transactions('recurring', 7).subscribe((value) => (result = value));

    http.expectOne((candidate) => candidate.url.includes('recurringdepositaccounts')).flush({});

    expect(result).toEqual([]);
  });

  it('asks the close template by command, which is what enumerates the options', () => {
    api.closureTemplate('fixed', 7).subscribe();

    const request = http.expectOne((candidate) =>
      candidate.url.endsWith('/v1/fixeddepositaccounts/7/template'),
    );
    expect(request.request.params.get('command')).toBe('close');
    request.flush({ onAccountClosureOptions: [{ id: 100, value: 'Withdraw Deposit' }] });
  });

  it('reports the close options unfiltered, because the rule belongs to the operation', () => {
    // `prematureClose` refuses the two re-investment options the template offers for both
    // commands. That is a fact about the command, so the dialog applies it — the adapter does
    // not pretend the template said so.
    let template: { options: readonly { id: number }[] } | undefined;
    api.closureTemplate('fixed', 7).subscribe((value) => (template = value));

    http
      .expectOne((candidate) => candidate.url.includes('/template'))
      .flush({
        onAccountClosureOptions: [
          { id: 100, value: 'Withdraw Deposit' },
          { id: 200, value: 'Transfer to Savings' },
          { id: 300, value: 'Re-Invest Maturity Amount' },
          { id: 400, value: 'Re-Invest Principal Only' },
        ],
      });

    expect(template!.options.map((option) => option.id)).toEqual([100, 200, 300, 400]);
  });

  it('defaults the transfer target to the account the deposit already pays into', () => {
    let template: { defaultTransferTargetId: number | null } | undefined;
    api.closureTemplate('fixed', 7).subscribe((value) => (template = value));

    http
      .expectOne((candidate) => candidate.url.includes('/template'))
      .flush({ transferToSavingsId: 6, savingsAccounts: [{ id: 6, accountNo: '000000006' }] });

    expect(template!.defaultTransferTargetId).toBe(6);
  });

  it('offers no rate from the account template, which sends zero', () => {
    // The template answers `nominalAnnualInterestRate: 0` for a product whose chart pays 7%, so
    // the model deliberately has no rate field: the caller reads it from the slabs for the term.
    let template: { chartSlabs: readonly { annualInterestRate: number | null }[] } | undefined;
    api.template('fixed', 42, 21).subscribe((value) => (template = value));

    http
      .expectOne((candidate) => candidate.url.endsWith('/v1/fixeddepositaccounts/template'))
      .flush({
        nominalAnnualInterestRate: 0,
        accountChart: {
          chartSlabs: [
            { periodType: { id: 2 }, fromPeriod: 1, toPeriod: 12, annualInterestRate: 7 },
          ],
        },
      });

    expect(template!.chartSlabs[0].annualInterestRate).toBe(7);
    expect(template as unknown as Record<string, unknown>).not.toHaveProperty(
      'nominalAnnualInterestRate',
    );
  });

  it('takes the deposit amount from the product, which the template does not carry', () => {
    let amount: number | null | undefined;
    api.productDepositAmount('fixed', 21).subscribe((value) => (amount = value));

    http
      .expectOne((candidate) => candidate.url.endsWith('/v1/fixeddepositproducts/21'))
      .flush({ depositAmount: 1000 });

    expect(amount).toBe(1000);
  });

  it('issues a command against the account, by deposit type', () => {
    api.command('recurring', 7, 'approve', { approvedOnDate: '17 October 2026' }).subscribe();

    const request = http.expectOne(
      (candidate) =>
        candidate.method === 'POST' && candidate.url.endsWith('/v1/recurringdepositaccounts/7'),
    );
    expect(request.request.params.get('command')).toBe('approve');
    expect(request.request.body).toEqual({ approvedOnDate: '17 October 2026' });
    request.flush({});
  });

  it('issues a command against one transaction', () => {
    api.transactionCommand('fixed', 7, 11, 'undo').subscribe();

    const request = http.expectOne((candidate) =>
      candidate.url.endsWith('/v1/fixeddepositaccounts/7/transactions/11'),
    );
    expect(request.request.params.get('command')).toBe('undo');
    request.flush({});
  });

  it('charges a deposit through the savings endpoint, the only one there is', () => {
    // A deposit account is a savings-type account and the platform exposes no deposit-specific
    // charge path.
    api.addCharge(7, { chargeId: 3, amount: 25, dueDate: '2026-10-17' }).subscribe();

    const request = http.expectOne(
      (candidate) =>
        candidate.method === 'POST' && candidate.url.endsWith('/v1/savingsaccounts/7/charges'),
    );
    expect(request.request.body).toEqual({
      chargeId: 3,
      amount: 25,
      dueDate: '2026-10-17',
      dateFormat: 'yyyy-MM-dd',
      locale: 'en',
    });
    request.flush({});
  });

  /**
   * The list, which answers the same payload the account read does.
   *
   * Measured: `GET /{type}depositaccounts` carries every field of the single-account response
   * except its associations, so one mapper serves both — which is what gives a list row its
   * status flags and its `depositProductName`.
   */
  it('reads the fixed deposit list and maps it like an account', () => {
    let accounts: { productName: string; status: { submittedAndPendingApproval: boolean } }[] = [];
    api.list('fixed').subscribe((value) => (accounts = value));

    http
      .expectOne(
        (candidate) =>
          candidate.method === 'GET' && candidate.url.endsWith('/v1/fixeddepositaccounts'),
      )
      .flush([
        {
          id: 1,
          depositProductName: 'FD 12m',
          status: { value: 'Submitted and pending approval', submittedAndPendingApproval: true },
        },
      ]);

    expect(accounts[0].productName).toBe('FD 12m');
    expect(accounts[0].status.submittedAndPendingApproval).toBe(true);
  });

  it('reads the recurring deposit list from its own resource', () => {
    let accounts: { recurringDepositAmount: number | null }[] = [];
    api.list('recurring').subscribe((value) => (accounts = value));

    http
      .expectOne(
        (candidate) =>
          candidate.method === 'GET' && candidate.url.endsWith('/v1/recurringdepositaccounts'),
      )
      .flush([{ id: 1, mandatoryRecommendedDepositAmount: 500 }]);

    // `recurringDepositAmount`, which the list rendered, is not sent at all — see the model.
    expect(accounts[0].recurringDepositAmount).toBe(500);
  });

  it('answers an empty list rather than undefined', () => {
    let accounts: unknown = undefined;
    api.list('fixed').subscribe((value) => (accounts = value));

    http.expectOne((candidate) => candidate.url.endsWith('/v1/fixeddepositaccounts')).flush(null);

    expect(accounts).toEqual([]);
  });

  /**
   * The transaction template, where the two types disagree about the command.
   *
   * Measured, the recurring path answers `400 error.msg.query.parameter.value.unsupported`
   * without `?command=`, which left the recurring form's payment-type list empty on every load.
   */
  it('sends the command when asking for a recurring transaction template', () => {
    api.transactionTemplate('recurring', 7, 'withdrawal').subscribe();

    const request = http.expectOne((candidate) =>
      candidate.url.endsWith('/v1/recurringdepositaccounts/7/transactions/template'),
    );
    expect(request.request.params.get('command')).toBe('withdrawal');
    request.flush({ paymentTypeOptions: [{ id: 1, name: 'Money Transfer' }] });
  });

  it('flattens the payment channels the template really sends', () => {
    let template: { paymentTypes: readonly { id: number; name: string }[] } | undefined;
    api.transactionTemplate('fixed', 7, 'deposit').subscribe((value) => (template = value));

    http
      .expectOne((candidate) =>
        candidate.url.endsWith('/v1/fixeddepositaccounts/7/transactions/template'),
      )
      // As measured — objects, although the generated model types this `Array<number>`.
      .flush({
        paymentTypeOptions: [
          { id: 1, name: 'Money Transfer', isCashPayment: false },
          { id: 2, name: 'Cash', isCashPayment: true },
        ],
      });

    expect(template?.paymentTypes).toEqual([
      { id: 1, name: 'Money Transfer' },
      { id: 2, name: 'Cash' },
    ]);
  });

  it('answers no payment channels when the template carries none', () => {
    let template: { paymentTypes: readonly unknown[] } | undefined;
    api.transactionTemplate('fixed', 7, 'deposit').subscribe((value) => (template = value));

    http.expectOne((candidate) => candidate.url.includes('transactions/template')).flush({});

    expect(template?.paymentTypes).toEqual([]);
  });

  /**
   * The post, whose two generated methods take their arguments in different orders — the trap
   * this boundary exists to hold. A call copied from one to the other binds the request object
   * to `command` and still compiles.
   */
  it('posts a fixed deposit transaction with the command in the query and a string body', () => {
    api
      .postTransaction('fixed', 7, 'deposit', { transactionAmount: 500, paymentTypeId: 2 })
      .subscribe();

    const request = http.expectOne(
      (candidate) =>
        candidate.method === 'POST' &&
        candidate.url.endsWith('/v1/fixeddepositaccounts/7/transactions'),
    );
    expect(request.request.params.get('command')).toBe('deposit');
    expect(JSON.parse(request.request.body as string)).toEqual({
      transactionAmount: 500,
      paymentTypeId: 2,
    });
    request.flush({ resourceId: 307 });
  });

  it('posts a recurring deposit transaction with the body as an object', () => {
    api.postTransaction('recurring', 7, 'withdrawal', { transactionAmount: 500 }).subscribe();

    const request = http.expectOne(
      (candidate) =>
        candidate.method === 'POST' &&
        candidate.url.endsWith('/v1/recurringdepositaccounts/7/transactions'),
    );
    expect(request.request.params.get('command')).toBe('withdrawal');
    expect(request.request.body).toEqual({ transactionAmount: 500 });
    request.flush({ resourceId: 308 });
  });

  it('hands the post response back, which is what finds the new resource id', () => {
    let response: unknown;
    api.postTransaction('recurring', 7, 'deposit', {}).subscribe((value) => (response = value));

    http.expectOne((candidate) => candidate.method === 'POST').flush({ resourceId: 308 });

    expect(response).toEqual({ resourceId: 308 });
  });

  /**
   * The template read, where absent and zero are not the same thing.
   *
   * Measured, `?clientId=0` answers `404` "Client not found with valuer 0" while omitting the
   * parameter serves the generic template with every product listed — so a caller that sent
   * `clientId ?? 0` before a client was chosen got no products at all.
   */
  it('omits clientId entirely when there is no client yet', () => {
    api.template('fixed').subscribe();

    const request = http.expectOne((candidate) =>
      candidate.url.endsWith('/v1/fixeddepositaccounts/template'),
    );
    expect(request.request.params.has('clientId')).toBe(false);
    request.flush({ productOptions: [{ id: 1, name: 'FD 12m' }] });
  });

  it('reads the on-hold funds of a savings account out of its paged envelope', () => {
    let holds: { loanId: number | null; date: string | null }[] = [];
    api.onHoldTransactions(112).subscribe((value) => (holds = value));

    http
      .expectOne(
        (candidate) =>
          candidate.method === 'GET' &&
          candidate.url.endsWith('/v1/savingsaccounts/112/onholdtransactions'),
      )
      .flush({
        totalFilteredRecords: 1,
        pageItems: [{ id: 1, transactionDate: [2026, 10, 19], loanId: 88 }],
      });

    expect(holds).toHaveLength(1);
    expect(holds[0].date).toBe('2026-10-19');
    expect(holds[0].loanId).toBe(88);
  });

  it('answers an empty hold list when the envelope carries no items', () => {
    let holds: unknown = undefined;
    api.onHoldTransactions(112).subscribe((value) => (holds = value));

    http
      .expectOne((candidate) => candidate.url.includes('onholdtransactions'))
      .flush({
        totalFilteredRecords: 0,
      });

    expect(holds).toEqual([]);
  });

  it('prices a premature closure without changing anything', () => {
    let amount: number | null | undefined;
    api.prematureAmount('fixed', 7, '2026-10-17').subscribe((value) => (amount = value));

    const request = http.expectOne((candidate) => candidate.method === 'POST');
    expect(request.request.params.get('command')).toBe('calculatePrematureAmount');
    request.flush({ maturityAmount: 5100 });

    expect(amount).toBe(5100);
  });

  it('answers null when the platform prices nothing', () => {
    let amount: number | null | undefined = 1;
    api.prematureAmount('fixed', 7, '2026-10-17').subscribe((value) => (amount = value));

    http.expectOne((candidate) => candidate.method === 'POST').flush({});

    expect(amount).toBeNull();
  });
});
