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

import { createSpyObj, SpyObj } from '../../../testing/mocks';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FixedDepositAccountFormComponent } from './fixed-deposit-form.component';
import { BUSINESS_DATE_API, DEPOSIT_ACCOUNT_API } from '../../../core/adapters';
import { mapDepositAccount } from '../../../core/adapters/api/fineract-deposit-account.api';
import { Observable, of, throwError } from 'rxjs';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { provideTranslateTesting } from '../../../testing/i18n-testing';

const SUBMITTED_ON = '2026-06-11';

describe('FixedDepositAccountFormComponent', () => {
  let component: FixedDepositAccountFormComponent;
  let fixture: ComponentFixture<FixedDepositAccountFormComponent>;
  let deposits: Record<string, ReturnType<typeof vi.fn>>;
  let routerSpy: SpyObj<Router>;
  let activatedRouteStub: {
    queryParams: Observable<Record<string, unknown>>;
    paramMap: Observable<{ get: (key: string) => string | null }>;
  };

  /**
   * The template as the adapter reports it.
   *
   * Model-shaped, not payload-shaped. What the payload does — no `depositAmount`, no
   * `depositPeriod`, and `nominalAnnualInterestRate: 0` on a product whose chart pays 7% — is
   * pinned in `fineract-deposit-account.api.test.ts`, which is where that knowledge now lives.
   * Note what this model has no field for: a rate. There is nowhere for the template's zero to
   * come through, which is the point of the boundary.
   */
  const TEMPLATE = {
    minDepositTerm: 12,
    minDepositTermTypeId: 2,
    chartSlabs: [{ periodTypeId: 2, fromPeriod: 1, toPeriod: 12, annualInterestRate: 7 }],
    savingsAccounts: [{ id: 5, accountNo: '000000005' }],
    maturityInstructions: [
      { id: 100, value: 'Withdraw Deposit' },
      { id: 200, value: 'Transfer to Savings' },
    ],
    chargeOptions: [],
    productOptions: [{ id: 101, name: 'FD' }],
  };

  /** An existing account, as the adapter reports one for the edit path. */
  /**
   * An account as the adapter answers one.
   *
   * Written as the payload Fineract sends and put through the adapter's own mapper, rather than
   * hand-built in model shape: a hand-built double drifts from what the adapter can actually
   * produce, and one of those — a template of `{}` — is what hid an unhandled error here before.
   */
  const ACCOUNT = mapDepositAccount({
    id: 123,
    accountNo: '000000123',
    clientId: 1,
    depositProductId: 101,
    depositAmount: 5000,
    depositPeriod: 12,
    depositPeriodFrequency: { id: 2, value: 'Months' },
    maturityAmount: 5350,
    maturityDate: [2027, 10, 17],
    nominalAnnualInterestRate: 7,
    summary: { accountBalance: 5000 },
    timeline: { submittedOnDate: [2026, 10, 17] },
  });

  /**
   * A template offering nothing.
   *
   * Every list present and empty, every scalar null — which is what the adapter returns, because
   * it maps each one with a default. A double of `{}` is not a template the adapter can produce,
   * and one caused an unhandled `chartSlabs.map` on an undefined array.
   */
  const EMPTY_TEMPLATE = {
    minDepositTerm: null,
    minDepositTermTypeId: null,
    chartSlabs: [],
    savingsAccounts: [],
    maturityInstructions: [],
    chargeOptions: [],
    productOptions: [],
  };

  /** The same, with two rate bands, the second open-ended. */
  const TIERED = {
    ...TEMPLATE,
    minDepositTerm: 6,
    chartSlabs: [
      { periodTypeId: 2, fromPeriod: 1, toPeriod: 11, annualInterestRate: 5 },
      { periodTypeId: 2, fromPeriod: 12, toPeriod: null, annualInterestRate: 9 },
    ],
  };

  const FIXED_DEPOSITS_PATH = '/products/fixed-deposits';
  const API_ERROR = 'API Error';

  beforeEach(async () => {
    // One fake adapter in place of two generated services. The form no longer knows what
    // Fineract calls these operations, nor where in a payload each field sits.
    deposits = {
      get: vi.fn().mockReturnValue(of(ACCOUNT)),
      transactions: vi.fn().mockReturnValue(of([])),
      template: vi.fn().mockReturnValue(of(TEMPLATE)),
      productDepositAmount: vi.fn().mockReturnValue(of(1000)),
      closureTemplate: vi
        .fn()
        .mockReturnValue(of({ options: [], transferTargets: [], defaultTransferTargetId: null })),
      prematureAmount: vi.fn().mockReturnValue(of(null)),
      create: vi.fn().mockReturnValue(of(undefined)),
      update: vi.fn().mockReturnValue(of(undefined)),
      command: vi.fn().mockReturnValue(of(undefined)),
      transactionCommand: vi.fn().mockReturnValue(of(undefined)),
      addCharge: vi.fn().mockReturnValue(of(undefined)),
    };

    routerSpy = createSpyObj(['navigate']);
    activatedRouteStub = {
      queryParams: of({}),
      paramMap: of({ get: () => null }),
    };

    await TestBed.configureTestingModule({
      imports: [FixedDepositAccountFormComponent],
      providers: [
        {
          // A tenant without the business-date feature: `PlatformDateService` then seeds this
          // form's dates from the platform's clock and asks the backend nothing. Without it the
          // service reaches the generated client, and the request would need answering here.
          provide: BUSINESS_DATE_API,
          useValue: {
            getBusinessDates: () => of([]),
            isBusinessDateEnabled: () => of(false),
          },
        },
        ...provideTranslateTesting(),
        provideNoopAnimations(),
        { provide: DEPOSIT_ACCOUNT_API, useValue: deposits },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: activatedRouteStub },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FixedDepositAccountFormComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    deposits['template'].mockReturnValue(of(EMPTY_TEMPLATE));
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should initialize with clientId from query parameters', () => {
    activatedRouteStub.queryParams = of({ clientId: '123' });
    deposits['template'].mockReturnValue(of(EMPTY_TEMPLATE));

    component.ngOnInit();

    expect(component.account()['clientId']).toBe(123);
    expect(deposits['template']).toHaveBeenCalledWith('fixed', 123);
  });

  it('should load product options on client selection', () => {
    deposits['template'].mockReturnValue(
      of({ ...TEMPLATE, productOptions: [{ id: 1, name: 'Product 1' }] }),
    );

    component.onClientSelected(456);

    expect(component.account()['clientId']).toBe(456);
    expect(deposits['template']).toHaveBeenCalledWith('fixed', 456);
    expect(component.products()).toHaveLength(1);
  });

  it('should handle missing product options in template', () => {
    deposits['template'].mockReturnValue(of(EMPTY_TEMPLATE));

    (component as unknown as Record<string, () => void>)['loadProducts']();

    expect(component.products()).toEqual([]);
  });

  /**
   * #766. Choosing a product filled nothing in, and the original test was part of why it
   * shipped: its fixture invented a template shape the platform does not send.
   *
   * It cannot invent one now. The adapter's model has no `depositAmount`, no
   * `depositPeriodFrequency` and no rate field at all, so there is nothing here for a wrong
   * guess about the wire to hide in. What the payload really does — and that its
   * `nominalAnnualInterestRate` is 0 on a product paying 7% — is pinned in
   * `fineract-deposit-account.api.test.ts`.
   */
  it('fills the term, its unit and the rate the adapter reported', () => {
    deposits['template'].mockReturnValue(of(TEMPLATE));
    component.account()['clientId'] = 1;

    component.onProductSelected(101);

    expect(deposits['template']).toHaveBeenCalledWith('fixed', 1, 101);
    expect(component.account()['depositPeriod']).toBe(12);
    expect(component.account()['depositPeriodFrequencyId']).toBe(2);
    // From the chart, not from the template's own zero.
    expect(component.account()['nominalAnnualInterestRate']).toBe(7);
  });

  it('takes the deposit amount from the product, which is the only place it is', () => {
    // `productOptions` on the template lists `{id, name, withHoldTax}` and nothing else, so
    // there is no avoiding the second request.
    deposits['template'].mockReturnValue(of(TEMPLATE));
    component.account()['clientId'] = 1;

    component.onProductSelected(101);

    expect(deposits['productDepositAmount']).toHaveBeenCalledWith('fixed', 101);
    expect(component.account()['depositAmount']).toBe(1000);
  });

  it('recomputes the rate when the term moves to another slab', () => {
    // A tiered product pays differently for 6 and 24 months. A rate left at the first slab's
    // would disagree with the product, which is the defect #761 reports for savings.
    deposits['template'].mockReturnValue(of(TIERED));
    component.account()['clientId'] = 1;
    component.onProductSelected(101);

    expect(component.account()['nominalAnnualInterestRate']).toBe(5);

    component.account.update((account) => ({ ...account, depositPeriod: 24 }));
    component.onTermChanged();

    expect(component.account()['nominalAnnualInterestRate']).toBe(9);
  });

  it('treats an open-ended last band as covering any longer term', () => {
    // A tiered chart's final slab usually has no `toPeriod`, which is how "12 months and over"
    // is written. Reading that as a bounded range would leave long deposits with no rate.
    deposits['template'].mockReturnValue(of(TIERED));
    component.account()['clientId'] = 1;
    component.onProductSelected(101);

    component.account.update((account) => ({ ...account, depositPeriod: 999 }));
    component.onTermChanged();

    expect(component.account()['nominalAnnualInterestRate']).toBe(9);
  });

  it('leaves the rate alone when no slab covers the term at all', () => {
    // Better a rate the user can see and correct than a blank the platform will refuse.
    deposits['template'].mockReturnValue(
      of({
        ...TEMPLATE,
        minDepositTerm: 6,
        chartSlabs: [{ periodTypeId: 2, fromPeriod: 1, toPeriod: 11, annualInterestRate: 5 }],
      }),
    );
    component.account()['clientId'] = 1;
    component.onProductSelected(101);

    component.account.update((account) => ({ ...account, depositPeriod: 999 }));
    component.onTermChanged();

    expect(component.account()['nominalAnnualInterestRate']).toBe(5);
  });

  it('notifies readers of the prefill instead of mutating the model in place', () => {
    // The old prefill assigned to `account()`'s properties, which changes the object without
    // telling anything that reads the signal — so a resolved field could still fail to render.
    deposits['template'].mockReturnValue(of(TEMPLATE));
    component.account()['clientId'] = 1;
    const before = component.account();

    component.onProductSelected(101);

    expect(component.account()).not.toBe(before);
  });

  describe('the frequency that went invalid after choosing a product', () => {
    /*
     * #766's second half: "Frequency shows a preselected value, but the form control is invalid
     * until the user opens the select and picks Months again", with Save disabled and nothing
     * saying why.
     *
     * The cause was the prefill, not the select. The account template carries no
     * `depositPeriodFrequency`, so the old code assigned `undefined` to the model property that
     * `[(ngModel)]` is bound to. That emptied the control — failing its `required` validator —
     * while the Ionic select went on displaying Months. It only showed up *after* choosing a
     * product, which is why the issue's reproduction hits it at step 4 rather than step 1.
     */
    it('starts valid, with months selected', () => {
      expect(component.account()['depositPeriodFrequencyId']).toBe(2);
    });

    it('is not blanked by a template that states no term unit', () => {
      deposits['template'].mockReturnValue(of({ ...TEMPLATE, minDepositTermTypeId: null }));
      component.account()['clientId'] = 1;

      component.onProductSelected(101);

      expect(component.account()['depositPeriodFrequencyId']).toBe(2);
    });

    it('is not blanked by a template that states nothing at all', () => {
      // The degenerate case, and the one the old code hit on every product: every field it read
      // was absent, so every assignment wrote `undefined`. Stated as the empty *model* — the
      // adapter cannot answer `{}`, and a double that does throws on `chartSlabs.map`.
      deposits['template'].mockReturnValue(of(EMPTY_TEMPLATE));
      component.account()['clientId'] = 1;

      component.onProductSelected(101);

      expect(component.account()['depositPeriodFrequencyId']).toBe(2);
    });
  });

  it('should handle error when loading product defaults', () => {
    vi.spyOn(console, 'error');
    deposits['template'].mockReturnValue(throwError(() => new Error(API_ERROR)));
    component.account()['clientId'] = 1;

    component.onProductSelected(101);

    expect(console.error).toHaveBeenCalled();
  });

  it('should load existing account data in edit mode', () => {
    deposits['get'].mockReturnValue(
      of(
        mapDepositAccount({
          id: 123,
          clientId: 1,
          // The adapter resolves which of the two product-id names the payload used, which is
          // what left the product unselected on every edit before.
          depositProductId: 101,
          depositAmount: 1000,
          depositPeriod: 6,
          depositPeriodFrequency: { id: 2, value: 'Months' },
          nominalAnnualInterestRate: 4.5,
          timeline: { submittedOnDate: [2026, 6, 11] },
        }),
      ),
    );
    component.accountId = 123;
    component.isEditMode.set(true);

    (component as unknown as Record<string, () => void>)['loadAccountData']();

    expect(deposits['get']).toHaveBeenCalledWith('fixed', 123);
    expect(component.account()['clientId']).toBe(1);
    expect(component.account()['productId']).toBe(101);
    expect(component.account()['nominalAnnualInterestRate']).toBe(4.5);
    expect(component.submittedOnDate()).toEqual(SUBMITTED_ON);
  });

  it('should handle error when loading account data', () => {
    vi.spyOn(console, 'error');
    deposits['get'].mockReturnValue(throwError(() => new Error(API_ERROR)));
    component.accountId = 123;

    (component as unknown as Record<string, () => void>)['loadAccountData']();

    expect(console.error).toHaveBeenCalled();
  });

  it('should submit application in create mode', () => {
    deposits['template'].mockReturnValue(of(EMPTY_TEMPLATE));
    deposits['create'].mockReturnValue(of(undefined));
    fixture.detectChanges();

    component.account.set({
      clientId: 1,
      productId: 101,
      depositAmount: 1000,
      depositPeriod: 12,
      depositPeriodFrequencyId: 2,
      nominalAnnualInterestRate: 5,
    });
    component.submittedOnDate.set(SUBMITTED_ON);

    component.onSubmit();

    expect(deposits['create']).toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledWith([FIXED_DEPOSITS_PATH]);
  });

  it('should update application in edit mode', () => {
    deposits['update'].mockReturnValue(of(undefined));
    component.accountId = 123;
    component.isEditMode.set(true);
    component.account.set({
      depositAmount: 2000,
      depositPeriod: 24,
      depositPeriodFrequencyId: 2,
      nominalAnnualInterestRate: 6,
    });
    component.submittedOnDate.set(SUBMITTED_ON);

    component.onSubmit();

    expect(deposits['update']).toHaveBeenCalledWith('fixed', 123, expect.any(Object));
    expect(routerSpy.navigate).toHaveBeenCalledWith([FIXED_DEPOSITS_PATH]);
  });

  it('should handle submission error', () => {
    deposits['create'].mockReturnValue(throwError(() => new Error(API_ERROR)));
    component.onSubmit();
    expect(component.isSaving()).toBe(false);
  });

  it('should navigate on cancel', () => {
    component.onCancel();
    expect(routerSpy.navigate).toHaveBeenCalledWith([FIXED_DEPOSITS_PATH]);
  });

  it('should navigate to create client', () => {
    component.onCreateClient();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/clients/create']);
  });

  it('should navigate to create product', () => {
    component.onCreateProduct();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/products/fixed/create']);
  });

  it('should return clientId from account', () => {
    component.account()['clientId'] = 789;
    expect(component.getClientId()).toBe(789);
  });

  it('should return null if clientId is missing', () => {
    component.account()['clientId'] = undefined;
    expect(component.getClientId()).toBeNull();
  });

  /**
   * #783's half of this form: what happens at maturity, and which savings account funds the
   * deposit.
   *
   * The second one is where the issue was wrong about the platform, and getting it wrong in the
   * UI would move a customer's money. #783 describes `linkAccountId` as "the customer's savings
   * account" for the maturity payout. It is not: activation **debits** the linked account by the
   * deposit amount. Measured — a savings account holding 20,000 went to 15,000 when a 5,000
   * deposit linked to it was activated, and an unfunded linked account makes activation fail
   * with 403 "Insufficient account balance." The payout target is `transferToSavingsId`, which
   * goes with the maturity instruction.
   */
  describe('maturity instruction and funding account', () => {
    beforeEach(() => {
      deposits['template'].mockReturnValue(of(TEMPLATE));
      component.account()['clientId'] = 1;
      component.onProductSelected(101);
    });

    it('offers the instructions and savings accounts the template returned', () => {
      expect(component.maturityInstructions().map((option) => option.id)).toEqual([100, 200]);
      expect(component.savingsAccounts().map((savings) => savings.accountNo)).toEqual([
        '000000005',
      ]);
    });

    it('asks for a transfer target only when the instruction is to transfer', () => {
      component.account.update((account) => ({ ...account, maturityInstructionId: 100 }));
      expect(component.transfersAtMaturity()).toBe(false);

      component.account.update((account) => ({ ...account, maturityInstructionId: 200 }));
      expect(component.transfersAtMaturity()).toBe(true);
    });

    it('sends the instruction, the transfer target and the funding account on create', () => {
      component.account.update((account) => ({
        ...account,
        depositAmount: 5000,
        depositPeriod: 12,
        maturityInstructionId: 200,
        transferToSavingsId: 5,
        linkAccountId: 5,
        transferInterestToSavings: true,
      }));
      deposits['create'].mockReturnValue(of({}));

      component.onSubmit();

      const payload = deposits['create'].mock.calls[0][1] as Record<string, unknown>;
      expect(payload['maturityInstructionId']).toBe(200);
      expect(payload['transferToSavingsId']).toBe(5);
      expect(payload['linkAccountId']).toBe(5);
      expect(payload['transferInterestToSavings']).toBe(true);
    });

    it('carries them through an update, which names its fields one by one', () => {
      // The update builds an explicit payload, so a field not named here is a field the update
      // silently drops — the same trap the product form documents.
      component.accountId = 7;
      component.isEditMode.set(true);
      component.account.update((account) => ({
        ...account,
        depositAmount: 5000,
        depositPeriod: 12,
        maturityInstructionId: 200,
        transferToSavingsId: 5,
        linkAccountId: 5,
      }));
      deposits['update'].mockReturnValue(of({}));

      component.onSubmit();

      const payload = deposits['update'].mock.calls[0][2] as Record<string, unknown>;
      expect(payload['maturityInstructionId']).toBe(200);
      expect(payload['transferToSavingsId']).toBe(5);
      expect(payload['linkAccountId']).toBe(5);
    });

    it('omits the transfer target when the instruction is not to transfer', () => {
      // Sending one with instruction 100 describes a transfer that is not going to happen.
      component.accountId = 7;
      component.isEditMode.set(true);
      component.account.update((account) => ({
        ...account,
        maturityInstructionId: 100,
        transferToSavingsId: 5,
      }));
      deposits['update'].mockReturnValue(of({}));

      component.onSubmit();

      const payload = deposits['update'].mock.calls[0][2] as Record<string, unknown>;
      expect(payload['transferToSavingsId']).toBeUndefined();
    });
  });
});
