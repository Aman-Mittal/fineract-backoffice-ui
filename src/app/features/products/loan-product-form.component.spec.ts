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

/* eslint-disable @typescript-eslint/no-explicit-any */

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { provideNoopAnimations } from '@angular/platform-browser/animations';

import { LoanProductFormComponent } from './loan-product-form.component';
import {
  LoanProductsService,
  FundsService,
  DelinquencyRangeAndBucketsManagementService,
} from '../../api';
import { provideIonicTesting } from '../../testing/ionic-testing';
import {
  ADVANCED_PAYMENT_ALLOCATION_STRATEGY,
  DEFAULT_TRANSACTION_PROCESSING_STRATEGY,
  LOAN_SCHEDULE_TYPE,
} from './loan-schedule-type';

const TEMPLATE = {
  loanScheduleTypeOptions: [
    { id: 1, code: LOAN_SCHEDULE_TYPE.CUMULATIVE, value: 'Cumulative' },
    { id: 2, code: LOAN_SCHEDULE_TYPE.PROGRESSIVE, value: 'Progressive' },
  ],
  loanScheduleProcessingTypeOptions: [{ id: 1, code: 'HORIZONTAL', value: 'Horizontal' }],
  transactionProcessingStrategyOptions: [
    { id: 1, code: DEFAULT_TRANSACTION_PROCESSING_STRATEGY, name: 'Standard' },
    { id: 2, code: ADVANCED_PAYMENT_ALLOCATION_STRATEGY, name: 'Advanced payment allocation' },
  ],
  advancedPaymentAllocationTypes: [{ id: 1, code: 'PAST_DUE_PENALTY', value: 'Past due penalty' }],
  advancedPaymentAllocationTransactionTypes: [{ id: 1, code: 'DEFAULT', value: 'Default' }],
  advancedPaymentAllocationFutureInstallmentAllocationRules: [
    { id: 1, code: 'NEXT_INSTALLMENT', value: 'Next installment' },
  ],
  creditAllocationAllocationTypes: [],
  creditAllocationTransactionTypes: [],
  currencyOptions: [{ code: 'USD', name: 'US Dollar', decimalPlaces: 2 }],
};

describe('LoanProductFormComponent', () => {
  let component: LoanProductFormComponent;
  let fixture: ComponentFixture<LoanProductFormComponent>;
  let productServiceSpy: jasmine.SpyObj<LoanProductsService>;

  async function setup(productId: string | null = null): Promise<void> {
    TestBed.resetTestingModule();

    productServiceSpy = jasmine.createSpyObj('LoanProductsService', [
      'getLoanproductsTemplate',
      'getLoanproductsProductId',
      'postLoanproducts',
      'putLoanproductsProductId',
    ]);
    productServiceSpy.getLoanproductsTemplate.and.returnValue(of(TEMPLATE) as any);

    const fundsSpy = jasmine.createSpyObj('FundsService', ['getFunds']);
    fundsSpy.getFunds.and.returnValue(of([]) as any);
    const delinquencySpy = jasmine.createSpyObj('DelinquencyRangeAndBucketsManagementService', [
      'getDelinquencyBuckets',
    ]);
    delinquencySpy.getDelinquencyBuckets.and.returnValue(of([]) as any);

    await TestBed.configureTestingModule({
      imports: [LoanProductFormComponent, TranslateModule.forRoot()],
      providers: [
        provideNoopAnimations(),
        provideIonicTesting(),
        { provide: LoanProductsService, useValue: productServiceSpy },
        { provide: FundsService, useValue: fundsSpy },
        {
          provide: DelinquencyRangeAndBucketsManagementService,
          useValue: delinquencySpy,
        },
        { provide: Router, useValue: jasmine.createSpyObj('Router', ['navigate']) },
        {
          provide: ActivatedRoute,
          useValue: { paramMap: of({ get: () => productId }) },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoanProductFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  beforeEach(async () => {
    await setup();
  });

  it('creates, defaulting to a cumulative product', () => {
    expect(component).toBeTruthy();
    expect(component.product().loanScheduleType).toBe(LOAN_SCHEDULE_TYPE.CUMULATIVE);
    expect(component.isProgressive()).toBeFalse();
  });

  describe('down payment', () => {
    /**
     * Down payment is a progressive-engine capability. Hiding the controls on a cumulative
     * product is not enough — a value left behind would still be in the payload, describing a
     * product the cumulative engine cannot honour.
     */
    it('is cleared when the product is switched back to cumulative', () => {
      component.onLoanScheduleTypeChange(LOAN_SCHEDULE_TYPE.PROGRESSIVE);
      component.onEnableDownPaymentChange(true);
      component.product().disbursedAmountPercentageForDownPayment = 20;
      component.product().enableAutoRepaymentForDownPayment = true;

      component.onLoanScheduleTypeChange(LOAN_SCHEDULE_TYPE.CUMULATIVE);

      expect(component.product().enableDownPayment).toBeUndefined();
      expect(component.product().disbursedAmountPercentageForDownPayment).toBeUndefined();
      expect(component.product().enableAutoRepaymentForDownPayment).toBeUndefined();
    });

    it('drops its dependent settings when it is turned off directly', () => {
      component.onLoanScheduleTypeChange(LOAN_SCHEDULE_TYPE.PROGRESSIVE);
      component.onEnableDownPaymentChange(true);
      component.product().disbursedAmountPercentageForDownPayment = 25;

      component.onEnableDownPaymentChange(false);

      expect(component.product().enableDownPayment).toBeUndefined();
      expect(component.product().disbursedAmountPercentageForDownPayment).toBeUndefined();
    });

    it('is offered only on a progressive product', async () => {
      expect(
        fixture.nativeElement.querySelector('[data-testid="down-payment-unavailable-note"]'),
      ).not.toBeNull();
      expect(
        fixture.nativeElement.querySelector('[data-testid="loan-product-enable-down-payment"]'),
      ).toBeNull();

      component.onLoanScheduleTypeChange(LOAN_SCHEDULE_TYPE.PROGRESSIVE);
      fixture.detectChanges();

      expect(
        fixture.nativeElement.querySelector('[data-testid="loan-product-enable-down-payment"]'),
      ).not.toBeNull();
    });
  });

  describe('multi-tranche disbursement', () => {
    it('drops the tranche settings when it is turned off', () => {
      component.onMultiDisburseChange(true);
      component.product().maxTrancheCount = 4;
      component.product().disallowExpectedDisbursements = true;
      component.product().allowFullTermForTranche = true;

      component.onMultiDisburseChange(false);

      expect(component.product().multiDisburseLoan).toBeFalse();
      expect(component.product().maxTrancheCount).toBeUndefined();
      expect(component.product().disallowExpectedDisbursements).toBeUndefined();
      // Only ever reachable through multi-disbursement, so it must not outlive it.
      expect(component.product().allowFullTermForTranche).toBeUndefined();
    });

    it('reveals the tranche count once it is on', () => {
      expect(
        fixture.nativeElement.querySelector('[data-testid="loan-product-max-tranche-count"]'),
      ).toBeNull();

      component.onMultiDisburseChange(true);
      fixture.detectChanges();

      expect(
        fixture.nativeElement.querySelector('[data-testid="loan-product-max-tranche-count"]'),
      ).not.toBeNull();
    });

    it('is available regardless of schedule type', () => {
      expect(component.isProgressive()).toBeFalse();
      expect(
        fixture.nativeElement.querySelector('[data-testid="loan-product-multi-disburse"]'),
      ).not.toBeNull();
    });
  });

  describe('editing an existing product', () => {
    /**
     * The payload is rebuilt field by field, so anything the form does not name is dropped on
     * save. Opening a product configured with tranches or a down payment and pressing Save used
     * to remove both silently.
     */
    it('carries the disbursement and down payment settings through the load', async () => {
      await setup('7');
      productServiceSpy.getLoanproductsProductId.and.returnValue(
        of({
          name: 'Asset Finance',
          shortName: 'AF',
          currency: { code: 'USD', decimalPlaces: 2 },
          loanScheduleType: { code: LOAN_SCHEDULE_TYPE.PROGRESSIVE, value: 'Progressive' },
          transactionProcessingStrategyCode: ADVANCED_PAYMENT_ALLOCATION_STRATEGY,
          multiDisburseLoan: true,
          maxTrancheCount: 3,
          disallowExpectedDisbursements: true,
          allowFullTermForTranche: true,
          enableDownPayment: true,
          disbursedAmountPercentageForDownPayment: 20,
          enableAutoRepaymentForDownPayment: true,
        }) as any,
      );

      component.loadProductData();

      const product = component.product();
      expect(product.multiDisburseLoan).toBeTrue();
      expect(product.maxTrancheCount).toBe(3);
      expect(product.disallowExpectedDisbursements).toBeTrue();
      expect(product.allowFullTermForTranche).toBeTrue();
      expect(product.enableDownPayment).toBeTrue();
      expect(product.disbursedAmountPercentageForDownPayment).toBe(20);
      expect(product.enableAutoRepaymentForDownPayment).toBeTrue();
    });
  });
});
