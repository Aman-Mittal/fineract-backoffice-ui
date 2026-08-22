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

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WcLoanActionFormComponent } from './wc-loan-action-form.component';
import { WorkingCapitalLoansService, WorkingCapitalLoanTransactionsService } from '../../../api';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { provideNoopAnimations } from '@angular/platform-browser/animations';

describe('WcLoanActionFormComponent', () => {
  let component: WcLoanActionFormComponent;
  let fixture: ComponentFixture<WcLoanActionFormComponent>;
  let loansSpy: jasmine.SpyObj<WorkingCapitalLoansService>;
  let txSpy: jasmine.SpyObj<WorkingCapitalLoanTransactionsService>;
  let routerSpy: jasmine.SpyObj<Router>;

  function createComponent(command: string) {
    loansSpy = jasmine.createSpyObj('WorkingCapitalLoansService', [
      'postWorkingCapitalLoansLoanId',
      'putWorkingCapitalLoansLoanIdMarkAsFraud',
      'putWorkingCapitalLoansLoanIdDiscount',
      'putWorkingCapitalLoansLoanIdPaymentRate',
    ]);
    txSpy = jasmine.createSpyObj('WorkingCapitalLoanTransactionsService', [
      'postWorkingCapitalLoansLoanIdTransactions',
    ]);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    loansSpy.postWorkingCapitalLoansLoanId.and.returnValue(
      of({}) as ReturnType<WorkingCapitalLoansService['postWorkingCapitalLoansLoanId']>,
    );
    loansSpy.putWorkingCapitalLoansLoanIdMarkAsFraud.and.returnValue(
      of({}) as ReturnType<WorkingCapitalLoansService['putWorkingCapitalLoansLoanIdMarkAsFraud']>,
    );
    loansSpy.putWorkingCapitalLoansLoanIdDiscount.and.returnValue(
      of({}) as ReturnType<WorkingCapitalLoansService['putWorkingCapitalLoansLoanIdDiscount']>,
    );
    loansSpy.putWorkingCapitalLoansLoanIdPaymentRate.and.returnValue(
      of({}) as ReturnType<WorkingCapitalLoansService['putWorkingCapitalLoansLoanIdPaymentRate']>,
    );
    txSpy.postWorkingCapitalLoansLoanIdTransactions.and.returnValue(
      of({}) as ReturnType<
        WorkingCapitalLoanTransactionsService['postWorkingCapitalLoansLoanIdTransactions']
      >,
    );

    TestBed.configureTestingModule({
      imports: [WcLoanActionFormComponent, TranslateModule.forRoot()],
      providers: [
        { provide: WorkingCapitalLoansService, useValue: loansSpy },
        { provide: WorkingCapitalLoanTransactionsService, useValue: txSpy },
        { provide: Router, useValue: routerSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { paramMap: { get: (k: string) => (k === 'id' ? '42' : command) } },
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
      jasmine.any(Object),
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
      jasmine.any(Object),
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
      jasmine.any(Object),
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
      jasmine.objectContaining({ discountAmount: 50 }),
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
      jasmine.objectContaining({ periodPaymentRate: 8, effectiveDate: jasmine.any(String) }),
    );
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/working-capital/loans/view/42'], {
      queryParams: { tab: 'rateChanges' },
    });
  });
});
