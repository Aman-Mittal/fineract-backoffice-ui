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

import { createSpyObj, SpyObj } from '../../testing/mocks';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { of, throwError } from 'rxjs';

import { DepositAccountViewComponent } from './deposit-account-view.component';
import { DEPOSIT_ACCOUNT_API } from '../../core/adapters';
import { DialogService } from '../../core/services/dialog.service';
import { provideIonicTesting } from '../../testing/ionic-testing';
import { provideTranslateTesting } from '../../testing/i18n-testing';
import { toIsoDate } from '../../core/utils/date-formatter';

const PENDING = {
  id: 100,
  value: 'Submitted and pending approval',
  submittedAndPendingApproval: true,
  approved: false,
  active: false,
};

describe('DepositAccountViewComponent', () => {
  let fixture: ComponentFixture<DepositAccountViewComponent>;
  let component: DepositAccountViewComponent;
  let deposits: Record<string, ReturnType<typeof vi.fn>>;
  let dialogService: SpyObj<DialogService>;

  /** Shared, and only ever read: the submitted-on date the commands are floored on. */
  const SUBMITTED_TIMELINE = { submittedOnDate: [2026, 8, 9] };

  /** The account as the platform returns it, with the timeline the commands are floored on. */
  /** What the adapter answers for an account with no template or closure options to offer. */
  const EMPTY_TEMPLATE = {
    minDepositTerm: null,
    minDepositTermTypeId: null,
    chartSlabs: [],
    savingsAccounts: [],
    maturityInstructions: [],
    chargeOptions: [],
  };
  const EMPTY_CLOSURE_TEMPLATE = {
    options: [],
    transferTargets: [],
    defaultTransferTargetId: null,
  };

  /**
   * The payload mapped the way the adapter maps it.
   *
   * These tests give the fake adapter a payload and let this stand in for the mapping, so they
   * exercise the same field positions the real adapter resolves — `summary.accountBalance`,
   * `depositProductId` — without restating them. `fineract-deposit-account.api.test.ts` is where
   * the mapping itself is pinned.
   */
  function mapped(payload: object): Record<string, unknown> {
    const raw = payload as Record<string, unknown>;
    const summary = raw['summary'] as { accountBalance?: number } | undefined;
    const frequency = raw['depositPeriodFrequency'] as { value?: string } | undefined;
    const linked = raw['linkedAccount'] as { accountNo?: string } | undefined;
    return {
      id: (raw['id'] as number) ?? 0,
      accountNo: (raw['accountNo'] as string) ?? '',
      clientId: (raw['clientId'] as number) ?? null,
      productId: (raw['depositProductId'] ?? raw['savingsProductId'] ?? null) as number | null,
      balance: (summary?.accountBalance ?? raw['accountBalance'] ?? null) as number | null,
      depositAmount: (raw['depositAmount'] ?? null) as number | null,
      depositPeriod: (raw['depositPeriod'] ?? null) as number | null,
      depositPeriodUnit: frequency?.value ?? null,
      maturityAmount: (raw['maturityAmount'] ?? null) as number | null,
      maturityDate: raw['maturityDate'] === undefined ? null : '2027-10-17',
      nominalAnnualInterestRate: (raw['nominalAnnualInterestRate'] ?? null) as number | null,
      linkedAccountNo: linked?.accountNo ?? null,
      transferInterestToSavings: raw['transferInterestToSavings'] === true,
      charges: (raw['charges'] ?? []) as unknown[],
      raw,
    };
  }

  function account(status: object, timeline: object = SUBMITTED_TIMELINE): object {
    return { id: 7, clientId: 42, status, timeline, currency: { displaySymbol: '$' } };
  }

  async function setup(
    data: object,
    transactions: object[] = [],
    url = '/products/fixed-deposits/view/7',
  ): Promise<void> {
    TestBed.resetTestingModule();

    // One fake adapter in place of four generated services. The screen no longer knows what
    // Fineract calls any of these operations, which is the point of ADR 0006's boundary — and
    // the reason this file no longer imports `src/app/api` at all.
    deposits = {
      get: vi.fn().mockReturnValue(of(mapped(data))),
      transactions: vi.fn().mockReturnValue(of(transactions as Record<string, unknown>[])),
      template: vi.fn().mockReturnValue(of(EMPTY_TEMPLATE)),
      productDepositAmount: vi.fn().mockReturnValue(of(null)),
      closureTemplate: vi.fn().mockReturnValue(of(EMPTY_CLOSURE_TEMPLATE)),
      prematureAmount: vi.fn().mockReturnValue(of(null)),
      command: vi.fn().mockReturnValue(of(undefined)),
      transactionCommand: vi.fn().mockReturnValue(of(undefined)),
      addCharge: vi.fn().mockReturnValue(of(undefined)),
    };

    dialogService = createSpyObj(['confirm', 'open', 'prompt']);
    dialogService.confirm.mockResolvedValue(true);

    await TestBed.configureTestingModule({
      imports: [DepositAccountViewComponent],
      providers: [
        provideNoopAnimations(),
        provideIonicTesting(),
        ...provideTranslateTesting(),
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: DEPOSIT_ACCOUNT_API, useValue: deposits },
        { provide: DialogService, useValue: dialogService },
        { provide: Router, useValue: { url, navigate: () => undefined } },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => '7' } } } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DepositAccountViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  /** The body of the most recent command, and the command name. */
  function lastCommand(): { command: string; body: Record<string, unknown> } {
    // (type, accountId, command, body) — the adapter's order, which names its arguments rather
    // than relying on the generated method's positional (accountId, body, command).
    const args = deposits['command'].mock.lastCall!;
    return { command: args[2] as string, body: args[3] as Record<string, unknown> };
  }

  it('loads the account through the adapter, for the kind of deposit it is showing', async () => {
    await setup(account(PENDING));

    // The regression this originally guarded was a screen that looked its method up as
    // `service['retrieveOne14']` — absent from both generated services — and so threw out of
    // ngOnInit and rendered nothing. The method name is no longer this screen's business; what
    // is, is asking for the right deposit type. `fineract-deposit-account.api.test.ts` pins the
    // names on the other side of the boundary.
    expect(deposits['get']).toHaveBeenCalledWith('fixed', 7);
    expect(component.account()).toBeTruthy();
    expect(component.deposit()).toBeTruthy();
  });

  it('offers only the actions the account status allows', async () => {
    await setup(account(PENDING));
    expect(component.isPending()).toBe(true);
    expect(component.isApproved()).toBe(false);
    expect(component.isActive()).toBe(false);

    await setup(account({ id: 300, value: 'Active', active: true }));
    expect(component.isActive()).toBe(true);
    expect(component.isPending()).toBe(false);
  });

  it('sends undoapproval with an empty body', async () => {
    await setup(account({ id: 200, value: 'Approved', approved: true }));

    component.onUndoApproval();
    await fixture.whenStable();

    // The command refuses `locale` and `dateFormat` outright, which every other command here
    // requires — so a uniformly built payload makes exactly this one fail.
    const { command, body } = lastCommand();
    expect(command).toBe('undoapproval');
    expect(body).toEqual({});
  });

  it('floors a command date at the date the platform stamped', async () => {
    // A tenant whose timezone is already on tomorrow: approving "today" by the browser's clock
    // would be approving before submission, which the platform refuses.
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const [year, month, day] = toIsoDate(tomorrow).split('-').map(Number);
    await setup(account(PENDING, { submittedOnDate: [year, month, day] }));

    component.onApprove();
    await fixture.whenStable();

    const { body } = lastCommand();
    expect(body['approvedOnDate']).toContain(String(year));
    expect(body['approvedOnDate']).toContain(String(day).padStart(2, '0'));
  });

  it('keeps today when the stamped date is already behind it', async () => {
    await setup(account(PENDING, { submittedOnDate: [2020, 1, 2] }));

    component.onApprove();
    await fixture.whenStable();

    const today = new Date();
    expect(lastCommand().body['approvedOnDate']).toContain(String(today.getFullYear()));
  });

  it('closes with the closure type the dialog collected, and no withdrawBalance', async () => {
    await setup(
      account({ id: 300, value: 'Active', active: true }, { activatedOnDate: [2026, 1, 1] }),
    );
    dialogService.open.mockResolvedValue({ onAccountClosureId: 100 });

    component.onPrematureClose();
    await fixture.whenStable();
    await fixture.whenStable();

    const { command, body } = lastCommand();
    expect(command).toBe('prematureClose');
    // `onAccountClosureId` is mandatory; `withdrawBalance` — which the savings screens send — is
    // not a parameter these commands accept at all.
    expect(body['onAccountClosureId']).toBe(100);
    expect('withdrawBalance' in body).toBe(false);
  });

  it('sends nothing when the closure dialog is dismissed', async () => {
    await setup(account({ id: 300, value: 'Active', active: true }));
    dialogService.open.mockResolvedValue(undefined);

    component.onClose();
    await fixture.whenStable();

    expect(deposits['command']).not.toHaveBeenCalled();
  });

  /**
   * The account response carries no `transactions` key unless asked for one, and the generated
   * getter has no parameter to ask with. The tab therefore read `undefined` on every account and
   * was empty by construction — these cases pin the separate read that fixes it.
   */
  /**
   * #764. The Overview showed "Balance $" with no amount on every deposit account, and none of
   * the figures that define a term deposit.
   *
   * The fixture below is the real payload, copied from `GET /fixeddepositaccounts/{id}` on a
   * running Fineract: there is **no** top-level `accountBalance`, and the balance is under
   * `summary`. That is the whole bug — the component read the top level, got `undefined`, and
   * rendered a currency symbol with nothing after it. A fixture that invented
   * `accountBalance: 5000` would have passed against the broken code, which is why the issue
   * asks for this shape specifically.
   */
  describe('the figures that define a term deposit', () => {
    const ACTIVE_FD = {
      id: 7,
      accountNo: '000000007',
      clientId: 3,
      clientName: 'Dep Probe',
      status: { id: 300, code: 'savingsAccountStatusType.active', value: 'Active', active: true },
      currency: { code: 'USD', displaySymbol: '$', decimalPlaces: 2 },
      timeline: { activatedOnDate: [2026, 10, 17] },
      nominalAnnualInterestRate: 7,
      depositAmount: 5000,
      depositPeriod: 12,
      depositPeriodFrequency: {
        id: 2,
        code: 'deposit.period.savingsPeriodFrequencyType.months',
        value: 'Months',
      },
      maturityAmount: 5350.03,
      maturityDate: [2027, 10, 17],
      summary: { accountBalance: 5000, totalDeposits: 5000 },
    };

    function text(testId: string): string {
      const element = fixture.nativeElement.querySelector(`[data-testid="${CSS.escape(testId)}"]`);
      return (element?.textContent ?? '').replaceAll(/\s+/g, ' ').trim();
    }

    it('reads the balance from summary, where the payload actually carries it', async () => {
      await setup(ACTIVE_FD);

      expect(component.getAccountBalance()).toBe(5000);
    });

    it('still reads a top-level balance when one is sent', async () => {
      // Not dropped: the savings screens share this component's shape, and a payload that does
      // carry the field should not be ignored.
      await setup({ ...ACTIVE_FD, summary: undefined, accountBalance: 1234 });

      expect(component.getAccountBalance()).toBe(1234);
    });

    it('answers null when neither is present, rather than rendering a zero', async () => {
      // A zero balance and an unknown one are different facts, and showing 0 for the second is
      // what makes a wrong closure amount plausible.
      await setup({ ...ACTIVE_FD, summary: undefined });

      expect(component.getAccountBalance()).toBeNull();
    });

    it('shows the deposit amount, term, maturity amount and maturity date', async () => {
      await setup(ACTIVE_FD);

      expect(text('deposit-amount')).toContain('5,000.00');
      expect(text('deposit-term')).toContain('12 Months');
      expect(text('deposit-maturity-amount')).toContain('5,350.03');
      expect(text('deposit-maturity-date')).not.toBe('');
    });

    it('names the term unit rather than showing a bare number', async () => {
      // 12 days, 12 months and 12 years are not interchangeable in a conversation with a
      // customer, and the payload sends the unit as an enum object beside the count.
      await setup(ACTIVE_FD);

      expect(component.getDepositTerm()).toBe('12 Months');
    });

    it('falls back to the bare period when the payload sends no unit', async () => {
      await setup({ ...ACTIVE_FD, depositPeriodFrequency: undefined });

      expect(component.getDepositTerm()).toBe('12');
    });

    it('omits the term-deposit rows on an account that has none', async () => {
      // A savings account reaches this view through the same component. Blank rows there would
      // read as missing data rather than as not applicable.
      await setup({
        id: 7,
        status: { value: 'Active', active: true },
        currency: { displaySymbol: '$' },
        timeline: {},
        summary: { accountBalance: 200 },
      });

      expect(text('deposit-amount')).toBe('');
      expect(text('deposit-term')).toBe('');
      expect(text('deposit-maturity-amount')).toBe('');
    });
  });

  describe('transactions', () => {
    const ACTIVE = { id: 300, value: 'Active', active: true };
    const deposit = { id: 11, amount: 500, reversed: false, entryType: 'CREDIT' };
    const reversedDeposit = { id: 12, amount: 300, reversed: true, entryType: 'CREDIT' };

    it('reads a fixed deposit list from its own endpoint, not from the account', async () => {
      await setup(account(ACTIVE), [deposit]);

      expect(deposits['transactions']).toHaveBeenCalledWith('fixed', 7);
      expect(component.transactions()).toHaveLength(1);
    });

    it('offers undo on a live row and not on a reversed one', async () => {
      await setup(account(ACTIVE), [deposit, reversedDeposit]);

      expect(component.canUndo(deposit)).toBe(true);
      expect(component.canUndo(reversedDeposit)).toBe(false);
    });

    it('withholds undo entirely once the account is no longer active', async () => {
      await setup(account(PENDING), [deposit]);

      expect(component.canUndo(deposit)).toBe(false);
    });

    it('undoes through the transaction endpoint and re-reads the account', async () => {
      await setup(account(ACTIVE), [deposit]);

      component.onUndoTransaction(deposit);
      await fixture.whenStable();

      // (type, accountId, transactionId, command)
      expect(deposits['transactionCommand']).toHaveBeenCalledWith('fixed', 7, 11, 'undo');
      // A reversal moves the balance, so the screen re-reads rather than patching the row.
      expect(deposits['get']).toHaveBeenCalledTimes(2);
    });

    it('posts nothing when the confirmation is declined', async () => {
      await setup(account(ACTIVE), [deposit]);
      dialogService.confirm.mockResolvedValue(false);

      component.onUndoTransaction(deposit);
      await fixture.whenStable();

      expect(deposits['transactionCommand']).not.toHaveBeenCalled();
    });

    it('leaves the account on screen when the transaction read fails', async () => {
      await setup(account(ACTIVE));
      deposits['transactions'].mockReturnValue(throwError(() => new Error('unavailable')) as never);

      component.loadData();

      expect(component.transactions()).toEqual([]);
      expect(component.hasError()).toBe(false);
      expect(component.account()).toBeTruthy();
    });
  });

  /**
   * A recurring deposit reaches its transactions differently from a fixed one. That divergence
   * used to live here; it now lives in `FineractDepositAccountApi`, which is a fact about the
   * platform rather than about this screen, and is pinned in that adapter's own test. What is
   * left for the screen is asking for the right kind.
   */
  it('asks for the recurring deposit kind when that is what it is showing', async () => {
    await setup(
      account({ id: 300, value: 'Active', active: true }),
      [{ id: 21, amount: 100, reversed: false }],
      '/products/recurring-deposits/view/7',
    );

    expect(component.isRD).toBe(true);
    expect(deposits['transactions']).toHaveBeenCalledWith('recurring', 7);
    expect(deposits['get']).toHaveBeenCalledWith('recurring', 7);
    expect(component.transactions()).toHaveLength(1);
  });

  /**
   * Standing instructions target deposit accounts the same way they target ordinary savings —
   * Fineract has no separate portfolio account type for a recurring or fixed deposit — so this
   * reuses `app-savings-standing-instructions-tab` rather than a bespoke deposit version.
   */
  describe('standing instructions tab', () => {
    it('passes this account and its client through to the shared standing instructions tab', async () => {
      await setup(account({ id: 300, value: 'Active', active: true }));

      component.activeTab.set('standingInstructions');
      fixture.detectChanges();

      // The tab is a child component with its own service; that it fetches at all is what
      // matters here, and the request is the observable side of it.
      expect(
        TestBed.inject(HttpTestingController).match((request) =>
          request.url.includes('standinginstructions'),
        ).length,
      ).toBeGreaterThan(0);
      const tabElement = fixture.nativeElement.querySelector(
        'app-savings-standing-instructions-tab',
      );
      expect(tabElement).not.toBeNull();
    });
  });

  /**
   * `GET /fixeddepositaccounts/{id}` and `GET /recurringdepositaccounts/{id}` both omit
   * `charges` unless asked with `?associations=all` — the same class of gap `loadTransactions`
   * already works around for a recurring deposit's transaction list.
   */
  describe('charges tab', () => {
    it('renders the charges the account read carried', async () => {
      // One read, not two. The screen used to fetch the account through the generated client and
      // then fetch it again by hand with `associations=all` to get this list; the adapter asks
      // once, with the associations, and the charges arrive with the account.
      await setup({
        ...account({ id: 300, value: 'Active', active: true }),
        charges: [{ id: 3, name: 'Withdrawal Fee', amount: 5, amountOutstanding: 5 }],
      });

      expect(deposits['get']).toHaveBeenCalledTimes(1);
      expect(component.charges()).toHaveLength(1);
      expect(component.charges()[0].name).toBe('Withdrawal Fee');
    });

    it('shows no charges rather than failing the screen when the account carries none', async () => {
      await setup(account({ id: 300, value: 'Active', active: true }));

      expect(component.charges()).toEqual([]);
      expect(component.hasError()).toBe(false);
    });
  });

  /**
   * `accountChart.chartSlabs` comes off the exact same `associations=all` response the charges
   * tab reads — one request answers both tabs, not two.
   */
  describe('interest rate chart tab', () => {
    const SLAB = {
      fromPeriod: 0,
      toPeriod: 6,
      periodType: { value: 'Months' },
      amountRangeFrom: 0,
      amountRangeTo: 10_000,
      annualInterestRate: 5,
      description: 'Base rate',
      incentives: [
        {
          entityType: { value: 'Client' },
          attributeName: { value: 'Gender' },
          conditionType: { value: 'Equals' },
          attributeValueDesc: 'Female',
          incentiveType: { value: 'Rate' },
          amount: 0.5,
        },
      ],
    };

    it('reads the chart slabs off the same account read as the charges', async () => {
      // Still read through the payload rather than a model: this tab displays more of a slab
      // than `DepositRateSlab` carries — incentives, amount bands, the period label — and that
      // richer shape is named as the next thing to model on `DepositAccount.raw`.
      await setup({
        ...account({ id: 300, value: 'Active', active: true }),
        accountChart: { chartSlabs: [SLAB] },
      });

      expect(component.chartSlabs()).toEqual([SLAB] as never);
    });

    it('toggles a slab open and closed rather than opening every slab at once', async () => {
      await setup({
        ...account({ id: 300, value: 'Active', active: true }),
        accountChart: { chartSlabs: [SLAB, SLAB] },
      });

      expect(component.expandedSlabIndex()).toBeNull();

      component.onToggleIncentives(0);
      expect(component.expandedSlabIndex()).toBe(0);

      component.onToggleIncentives(1);
      expect(component.expandedSlabIndex()).toBe(1);

      component.onToggleIncentives(1);
      expect(component.expandedSlabIndex()).toBeNull();
    });

    it('shows no chart rather than failing the screen when the account read fails', async () => {
      await setup(account({ id: 300, value: 'Active', active: true }));
      deposits['get'].mockReturnValue(throwError(() => new Error('unavailable')) as never);

      component.loadData();

      expect(component.chartSlabs()).toEqual([]);
      // The account read failing *is* an error for this screen, unlike the separate reads.
      expect(component.hasError()).toBe(true);
    });
  });

  describe('teardown', () => {
    it('dismisses popovers when destroyed', async () => {
      await setup(account({ id: 100, value: 'Active', active: true }));

      const withPopovers = component as unknown as {
        popovers: () => readonly { dismiss: () => Promise<boolean> }[];
      };
      const popovers = withPopovers.popovers();
      expect(popovers.length).toBeGreaterThan(0);
      const dismissSpies = popovers.map((popover) =>
        vi.spyOn(popover, 'dismiss').mockResolvedValue(true),
      );

      fixture.destroy();

      for (const spy of dismissSpies) {
        expect(spy).toHaveBeenCalled();
      }
    });
  });
});
