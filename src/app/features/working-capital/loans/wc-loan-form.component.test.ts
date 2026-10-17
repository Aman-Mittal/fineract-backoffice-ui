/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
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

import { WcLoanFormComponent } from './wc-loan-form.component';

import { WorkingCapitalLoansService, WorkingCapitalNearBreachService } from '../../../api';

import { ActivatedRoute, Router, convertToParamMap } from '@angular/router';

import { of } from 'rxjs';

import { provideTranslateTesting } from '../../../testing/i18n-testing';

import { provideNoopAnimations } from '@angular/platform-browser/animations';

/** The application the edit-mode suite modifies. Shaped as the loan resource returns it. */
const EDIT_LOAN = {
  id: 42,
  clientId: 7,
  loanProductId: 1,
  fundId: 3,
  externalId: 'WC-42',
  principal: 5000,
  totalPaymentVolume: 60_000,
  paymentRate: 5,
  repaymentEvery: 1,
  repaymentFrequencyType: { id: '0', code: 'DAYS', value: 'Days' },
  breach: { id: 2, name: 'Covenant A' },
  nearBreach: { id: 8, name: 'Near A' },
  delinquencyBucket: { id: 4, name: 'Bucket' },
  timeline: { submittedOnDate: '15 January 2026', expectedDisbursementDate: '20 January 2026' },
};

describe('WcLoanFormComponent', () => {
  let component: WcLoanFormComponent;

  let fixture: ComponentFixture<WcLoanFormComponent>;

  let serviceSpy: SpyObj<WorkingCapitalLoansService>;

  let nearBreachServiceSpy: SpyObj<WorkingCapitalNearBreachService>;

  let routerSpy: SpyObj<Router>;

  /** Mutated by the edit suite before the shared `beforeEach` builds the TestBed. */
  let routeParams: Record<string, string>;

  beforeEach(async () => {
    routeParams ??= {};
    serviceSpy = createSpyObj([
      'getWorkingCapitalLoansTemplate',
      'postWorkingCapitalLoans',
      'getWorkingCapitalLoansLoanId',
      'putWorkingCapitalLoansLoanId',
    ]);

    nearBreachServiceSpy = createSpyObj(['getWorkingCapitalNearBreach']);

    routerSpy = createSpyObj(['navigate']);

    serviceSpy.getWorkingCapitalLoansTemplate.mockReturnValue(
      of({
        productOptions: [{ id: 1, name: 'WC Product' }],
        breachOptions: [{ id: 2, name: 'Covenant A' }],
        periodFrequencyTypeOptions: [{ id: '0', code: 'DAYS', value: 'Days' }],
      }) as unknown as ReturnType<WorkingCapitalLoansService['getWorkingCapitalLoansTemplate']>,
    );

    nearBreachServiceSpy.getWorkingCapitalNearBreach.mockReturnValue(
      of([]) as unknown as ReturnType<
        WorkingCapitalNearBreachService['getWorkingCapitalNearBreach']
      >,
    );

    // Stubbed for both suites: in edit mode `ngOnInit` loads the loan during the first change
    // detection below, which is before any inner hook could set this up.
    serviceSpy.getWorkingCapitalLoansLoanId.mockReturnValue(
      of(EDIT_LOAN) as unknown as ReturnType<
        WorkingCapitalLoansService['getWorkingCapitalLoansLoanId']
      >,
    );
    serviceSpy.putWorkingCapitalLoansLoanId.mockReturnValue(
      of({}) as unknown as ReturnType<WorkingCapitalLoansService['putWorkingCapitalLoansLoanId']>,
    );

    await TestBed.configureTestingModule({
      imports: [WcLoanFormComponent],

      providers: [
        ...provideTranslateTesting(),
        { provide: WorkingCapitalLoansService, useValue: serviceSpy },

        {
          provide: WorkingCapitalNearBreachService,
          useValue: nearBreachServiceSpy,
        },

        { provide: Router, useValue: routerSpy },

        {
          // `loans/create` carries no :id; the edit suite below supplies one.
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: convertToParamMap(routeParams) } },
        },

        provideNoopAnimations(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(WcLoanFormComponent);

    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should load template options on init', () => {
    expect(component).toBeTruthy();

    expect(serviceSpy.getWorkingCapitalLoansTemplate).toHaveBeenCalled();

    expect(component.productOptions()).toHaveLength(1);

    expect(component.breachOptions()).toHaveLength(1);

    expect(component.repaymentFrequencyTypeOptions()).toHaveLength(1);
  });

  it('should post on submit and navigate to the list', () => {
    serviceSpy.postWorkingCapitalLoans.mockReturnValue(
      of({}) as unknown as ReturnType<WorkingCapitalLoansService['postWorkingCapitalLoans']>,
    );

    component.loan = {
      clientId: 7,
      productId: 1,
      principalAmount: 5000,
    };

    component.onSubmit();

    expect(serviceSpy.postWorkingCapitalLoans).toHaveBeenCalled();

    expect(routerSpy.navigate).toHaveBeenCalledWith(['/working-capital/loans']);
  });

  it('should format provided dates into the request', () => {
    serviceSpy.postWorkingCapitalLoans.mockReturnValue(
      of({}) as unknown as ReturnType<WorkingCapitalLoansService['postWorkingCapitalLoans']>,
    );

    component.loan = {
      clientId: 7,
      productId: 1,
      principalAmount: 5000,
    };

    component.submittedOnDate = '2026-01-15T12:00:00';

    component.onSubmit();

    const arg = serviceSpy.postWorkingCapitalLoans.mock.lastCall![0];

    expect(arg.submittedOnDate).toBe('15 January 2026');

    expect(arg.locale).toBe('en');
  });

  /**
   * Issue #770: the loan screen offered Edit and navigated to a route that did not exist, and no
   * screen could modify a submitted application although Fineract supports it. The same form
   * serves both modes, so these tests pin the half that is not shared: what it loads, what it
   * sends, and that it sends only what changed.
   */
  describe('in edit mode', () => {
    beforeAll(() => {
      routeParams = { id: '42' };
    });

    afterAll(() => {
      routeParams = {};
    });

    it('prefills the form from the loan being modified', () => {
      expect(component.isEdit()).toBe(true);
      expect(component.loanId()).toBe(42);
      // The response and the request body name several of these differently; a mismatch here
      // silently blanks a field, which PUT would then read as "cleared".
      expect(component.loan.principalAmount).toBe(5000);
      expect(component.loan.periodPaymentRate).toBe(5);
      expect(component.loan.breachId).toBe(2);
      expect(component.loan.nearBreachId).toBe(8);
      expect(component.loan.delinquencyBucketId).toBe(4);
      expect(component.loan.repaymentFrequencyType).toBe('DAYS');
      expect(component.submittedOnDate).not.toBeNull();
    });

    it('puts to the loan and returns to it, rather than posting a second application', () => {
      component.onSubmit();

      expect(serviceSpy.putWorkingCapitalLoansLoanId).toHaveBeenCalled();
      expect(serviceSpy.postWorkingCapitalLoans).not.toHaveBeenCalled();
      expect(serviceSpy.putWorkingCapitalLoansLoanId.mock.lastCall![0]).toBe(42);
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/working-capital/loans/view/42']);
    });

    it('sends only the fields the user changed', () => {
      component.loan.principalAmount = 6000;

      component.onSubmit();

      const body = serviceSpy.putWorkingCapitalLoansLoanId.mock.lastCall![1];
      expect(body.principalAmount).toBe(6000);
      // Untouched fields are absent: PUT is a modification command, and Fineract audits every
      // field it is handed as a change.
      expect(body.clientId).toBeUndefined();
      expect(body.productId).toBeUndefined();
      expect(body.locale).toBe('en');
    });

    it('cancels back to the loan instead of the list', () => {
      component.onCancel();

      expect(routerSpy.navigate).toHaveBeenCalledWith(['/working-capital/loans/view/42']);
    });
  });
});
