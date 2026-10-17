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

import { WcLoanActionFormComponent } from './wc-loan-action-form.component';

import {
  WorkingCapitalLoanProductsService,
  WorkingCapitalLoansService,
  WorkingCapitalLoanTransactionsService,
} from '../../../api';

import { ActivatedRoute, Router } from '@angular/router';

import { of, throwError } from 'rxjs';

import { provideTranslateTesting } from '../../../testing/i18n-testing';

import { provideNoopAnimations } from '@angular/platform-browser/animations';

describe('WcLoanActionFormComponent', () => {
  let component: WcLoanActionFormComponent;

  let fixture: ComponentFixture<WcLoanActionFormComponent>;

  let loansSpy: SpyObj<WorkingCapitalLoansService>;

  let txSpy: SpyObj<WorkingCapitalLoanTransactionsService>;

  let productsSpy: SpyObj<WorkingCapitalLoanProductsService>;

  let routerSpy: SpyObj<Router>;

  function createComponent(command: string) {
    loansSpy = createSpyObj([
      'postWorkingCapitalLoansLoanId',
      'putWorkingCapitalLoansLoanIdMarkAsFraud',
      'putWorkingCapitalLoansLoanIdDiscount',
      'putWorkingCapitalLoansLoanIdPaymentRate',
    ]);

    txSpy = createSpyObj([
      'postWorkingCapitalLoansLoanIdTransactions',
      'getWorkingCapitalLoansLoanIdTransactionsTemplate',
    ]);

    productsSpy = createSpyObj(['getWorkingCapitalLoanProductsTemplate']);

    routerSpy = createSpyObj(['navigate']);

    loansSpy.postWorkingCapitalLoansLoanId.mockReturnValue(
      of({}) as ReturnType<WorkingCapitalLoansService['postWorkingCapitalLoansLoanId']>,
    );

    loansSpy.putWorkingCapitalLoansLoanIdMarkAsFraud.mockReturnValue(
      of({}) as ReturnType<WorkingCapitalLoansService['putWorkingCapitalLoansLoanIdMarkAsFraud']>,
    );

    loansSpy.putWorkingCapitalLoansLoanIdDiscount.mockReturnValue(
      of({}) as ReturnType<WorkingCapitalLoansService['putWorkingCapitalLoansLoanIdDiscount']>,
    );

    loansSpy.putWorkingCapitalLoansLoanIdPaymentRate.mockReturnValue(
      of({}) as ReturnType<WorkingCapitalLoansService['putWorkingCapitalLoansLoanIdPaymentRate']>,
    );

    txSpy.postWorkingCapitalLoansLoanIdTransactions.mockReturnValue(
      of({}) as ReturnType<
        WorkingCapitalLoanTransactionsService['postWorkingCapitalLoansLoanIdTransactions']
      >,
    );

    txSpy.getWorkingCapitalLoansLoanIdTransactionsTemplate.mockReturnValue(
      of({
        expectedAmount: 7500,
        transactionDate: '20 January 2026',
        chargeOffDate: '20 January 2026',
        chargeOffReasonOptions: [{ id: 11, name: 'Insolvency' }],
      }) as unknown as ReturnType<
        WorkingCapitalLoanTransactionsService['getWorkingCapitalLoansLoanIdTransactionsTemplate']
      >,
    );

    productsSpy.getWorkingCapitalLoanProductsTemplate.mockReturnValue(
      of({
        writeOffReasonOptions: [{ id: 21, name: 'Uncollectible' }],
      }) as unknown as ReturnType<
        WorkingCapitalLoanProductsService['getWorkingCapitalLoanProductsTemplate']
      >,
    );

    TestBed.configureTestingModule({
      imports: [WcLoanActionFormComponent],

      providers: [
        ...provideTranslateTesting(),
        { provide: WorkingCapitalLoansService, useValue: loansSpy },

        {
          provide: WorkingCapitalLoanTransactionsService,
          useValue: txSpy,
        },

        {
          provide: WorkingCapitalLoanProductsService,
          useValue: productsSpy,
        },

        { provide: Router, useValue: routerSpy },

        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: (k: string) => (k === 'id' ? '42' : command),
              },
            },
          },
        },

        provideNoopAnimations(),
      ],
    });

    fixture = TestBed.createComponent(WcLoanActionFormComponent);

    component = fixture.componentInstance;

    fixture.detectChanges();
  }

  it('should parse loanId and command from route', () => {
    createComponent('approve');

    expect(component.loanId).toBe(42);

    expect(component.command).toBe('approve');
  });

  it('should call postWorkingCapitalLoansLoanId for approve command', () => {
    createComponent('approve');

    component.approvedOnDate = '2026-01-15';

    component.onSubmit();

    expect(loansSpy.postWorkingCapitalLoansLoanId).toHaveBeenCalledWith(
      42,
      'approve',
      expect.any(Object),
    );
  });

  it('should call postWorkingCapitalLoansLoanId for disburse command', () => {
    createComponent('disburse');

    component.actualDisbursementDate = '2026-01-20';

    component.lifecycle.transactionAmount = 5000;

    component.onSubmit();

    expect(loansSpy.postWorkingCapitalLoansLoanId).toHaveBeenCalledWith(
      42,
      'disburse',
      expect.any(Object),
    );
  });

  it('should call postWorkingCapitalLoanTransactions for repayment command', () => {
    createComponent('repayment');

    component.transactionDate = '2026-02-01';

    component.repayment.transactionAmount = 1000;

    component.onSubmit();

    expect(txSpy.postWorkingCapitalLoansLoanIdTransactions).toHaveBeenCalledWith(
      42,
      'repayment',
      expect.any(Object),
    );
  });

  it('should call putWorkingCapitalLoansLoanIdMarkAsFraud for markasfraud command', () => {
    createComponent('markasfraud');

    component.fraud = true;

    component.onSubmit();

    expect(loansSpy.putWorkingCapitalLoansLoanIdMarkAsFraud).toHaveBeenCalledWith(42, {
      fraud: true,
    });

    expect(routerSpy.navigate).toHaveBeenCalledWith(['/working-capital/loans/view/42']);
  });

  it('should call putWorkingCapitalLoansLoanIdDiscount for discount command', () => {
    createComponent('discount');

    component.discount.discountAmount = 50;

    component.onSubmit();

    expect(loansSpy.putWorkingCapitalLoansLoanIdDiscount).toHaveBeenCalledWith(
      42,
      expect.objectContaining({ discountAmount: 50 }),
    );

    expect(routerSpy.navigate).toHaveBeenCalledWith(['/working-capital/loans/view/42']);
  });

  it('should call putWorkingCapitalLoansLoanIdPaymentRate for paymentrate command, and route to the rate-changes tab', () => {
    createComponent('paymentrate');

    component.paymentRateEffectiveDate = '2026-03-01';

    component.paymentRate.periodPaymentRate = 8;

    component.onSubmit();

    expect(loansSpy.putWorkingCapitalLoansLoanIdPaymentRate).toHaveBeenCalledWith(
      42,
      expect.objectContaining({
        periodPaymentRate: 8,
        effectiveDate: expect.any(String),
      }),
    );

    expect(routerSpy.navigate).toHaveBeenCalledWith(['/working-capital/loans/view/42'], {
      queryParams: { tab: 'rateChanges' },
    });
  });

  /**
   * Issues #771 and #772: repayment was the only transaction the UI could post. The rest of what
   * Fineract accepts on a Working Capital loan — the credits, the two loss actions and their
   * undos, and the recovery — was unreachable.
   *
   * What these pin is the part a reviewer cannot check by reading: the command string each form
   * posts, and that each body carries only the fields its command takes. Fineract rejects a
   * request with a parameter the command does not support, so a stray amount on an undo is a 400
   * rather than a cosmetic slip.
   */
  describe('transaction commands', () => {
    function post() {
      return txSpy.postWorkingCapitalLoansLoanIdTransactions.mock.lastCall!;
    }

    it.each([
      ['goodwillCredit', 'goodwillCredit'],
      ['payoutRefund', 'payoutRefund'],
      ['creditBalanceRefund', 'creditBalanceRefund'],
      ['recoveryPayment', 'recoveryPayment'],
      ['chargeOff', 'chargeOff'],
      ['undoChargeOff', 'undoChargeOff'],
      ['writeOff', 'writeOff'],
      ['undoWriteOff', 'undoWriteOff'],
    ])('posts %s under its own command name', (command, posted) => {
      createComponent(command);

      component.onSubmit();

      expect(post()[0]).toBe(42);
      expect(post()[1]).toBe(posted);
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/working-capital/loans/view/42']);
    });

    it('posts a prepayment as a repayment, which is the only command Fineract has for it', () => {
      createComponent('prepay');

      component.onSubmit();

      expect(post()[1]).toBe('repayment');
    });

    it('offers the payoff figure from the prepay template rather than asking for it', () => {
      createComponent('prepay');

      expect(txSpy.getWorkingCapitalLoansLoanIdTransactionsTemplate).toHaveBeenCalledWith(
        42,
        'prepayLoan',
      );
      expect(component.transaction.transactionAmount).toBe(7500);
    });

    it('prefills the recovery amount with what is still recoverable', () => {
      // The template caps it at totalWrittenOff - totalRecovered, so the figure it offers is one
      // the API will accept; the gross written-off amount would be rejected.
      createComponent('recoveryPayment');

      expect(component.transaction.transactionAmount).toBe(7500);
    });

    it('loads charge-off reasons from the transaction template', () => {
      createComponent('chargeOff');

      expect(component.chargeOffReasonOptions()).toEqual([{ id: 11, name: 'Insolvency' }]);
    });

    it('loads write-off reasons from the product template, which is where they live', () => {
      // Fineract assembles writeOffReasonOptions in the loan product read service; the
      // transaction template carries only the charge-off ones.
      createComponent('writeOff');

      expect(productsSpy.getWorkingCapitalLoanProductsTemplate).toHaveBeenCalled();
      expect(component.writeOffReasonOptions()).toEqual([{ id: 21, name: 'Uncollectible' }]);
    });

    it('sends the amount and date on a dated, amount-bearing command', () => {
      createComponent('goodwillCredit');
      component.transaction.transactionAmount = 250;
      component.transactionDate = '2026-01-15T12:00:00';

      component.onSubmit();

      expect(post()[2]).toMatchObject({
        transactionAmount: 250,
        transactionDate: '15 January 2026',
        locale: 'en',
      });
    });

    it('sends neither amount nor date on an undo', () => {
      createComponent('undoWriteOff');
      // Left over from another branch of the same form; it must not reach the request.
      component.transaction.transactionAmount = 999;
      component.transactionDate = '2026-01-15T12:00:00';
      component.transaction.reversalExternalId = 'WC-WO-REV-1';

      component.onSubmit();

      const body = post()[2];
      expect(body.transactionAmount).toBeUndefined();
      expect(body.transactionDate).toBeUndefined();
      expect(body.reversalExternalId).toBe('WC-WO-REV-1');
    });

    it('sends the charge-off reason only for charge-off', () => {
      createComponent('writeOff');
      component.transaction.chargeOffReasonId = 11;
      component.transaction.writeoffReasonId = 21;
      component.transactionDate = '2026-01-15T12:00:00';

      component.onSubmit();

      const body = post()[2];
      expect(body.writeoffReasonId).toBe(21);
      expect(body.chargeOffReasonId).toBeUndefined();
    });

    it('omits the note on undoChargeOff, which documents no note parameter', () => {
      createComponent('undoChargeOff');
      component.transaction.note = 'applied in error';

      component.onSubmit();

      expect(post()[2].note).toBeUndefined();
    });

    it('keeps the loan on screen when the post fails', () => {
      createComponent('chargeOff');
      txSpy.postWorkingCapitalLoansLoanIdTransactions.mockReturnValue(
        throwError(() => new Error('refused')) as ReturnType<
          WorkingCapitalLoanTransactionsService['postWorkingCapitalLoansLoanIdTransactions']
        >,
      );

      component.onSubmit();

      expect(component.isSaving()).toBe(false);
      expect(routerSpy.navigate).not.toHaveBeenCalled();
    });
  });
});
