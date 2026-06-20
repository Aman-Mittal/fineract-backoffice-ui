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
import { AccountActionFormComponent } from './account-action-form.component';
import {
  SavingsAccountService,
  FixedDepositAccountService,
  RecurringDepositAccountService,
  LoansService,
  StaffService,
  ChargesService,
  LoanChargesService,
} from '../../api';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError, Observable } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { MatNativeDateModule } from '@angular/material/core';

describe('AccountActionFormComponent', () => {
  const SAVINGS_PATH = '/products/savings-accounts';
  const LOAN_PATH_PREFIX = '/loans/view/';

  let component: AccountActionFormComponent;
  let fixture: ComponentFixture<AccountActionFormComponent>;

  let savingsSpy: jasmine.SpyObj<SavingsAccountService>;
  let fixedSpy: jasmine.SpyObj<FixedDepositAccountService>;
  let recurringSpy: jasmine.SpyObj<RecurringDepositAccountService>;
  let loansSpy: jasmine.SpyObj<LoansService>;
  let staffSpy: jasmine.SpyObj<StaffService>;
  let chargesSpy: jasmine.SpyObj<ChargesService>;
  let loanChargesSpy: jasmine.SpyObj<LoanChargesService>;
  let routerSpy: jasmine.SpyObj<Router>;

  let routeParams: Record<string, string>;

  beforeEach(async () => {
    routeParams = {
      ['accountId']: '123',
      ['accountType']: 'loan',
      ['command']: 'approve',
    };

    savingsSpy = jasmine.createSpyObj('SavingsAccountService', [
      'getSavingsaccountsAccountId',
      'postSavingsaccountsAccountId',
    ]);
    fixedSpy = jasmine.createSpyObj('FixedDepositAccountService', [
      'getFixeddepositaccountsAccountId',
      'postFixeddepositaccountsAccountId',
    ]);
    recurringSpy = jasmine.createSpyObj('RecurringDepositAccountService', [
      'getRecurringdepositaccountsAccountId',
      'postRecurringdepositaccountsAccountId',
    ]);
    loansSpy = jasmine.createSpyObj('LoansService', ['getLoansLoanId', 'postLoansLoanId']);
    staffSpy = jasmine.createSpyObj('StaffService', ['getStaff']);
    chargesSpy = jasmine.createSpyObj('ChargesService', ['getCharges']);
    loanChargesSpy = jasmine.createSpyObj('LoanChargesService', ['postLoansLoanIdCharges']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    // Mock initial returns
    loansSpy.getLoansLoanId.and.returnValue(
      of({
        id: 123,
        accountNo: 'L001',
        principal: 1000,
        timeline: {
          expectedDisbursementDate: [2026, 6, 16],
          submittedOnDate: [2026, 6, 1],
        },
      }) as unknown as Observable<never>,
    );
    savingsSpy.getSavingsaccountsAccountId.and.returnValue(
      of({ id: 123, accountNo: 'S001' }) as unknown as Observable<never>,
    );
    fixedSpy.getFixeddepositaccountsAccountId.and.returnValue(
      of({ id: 123, accountNo: 'F001' }) as unknown as Observable<never>,
    );
    recurringSpy.getRecurringdepositaccountsAccountId.and.returnValue(
      of({ id: 123, accountNo: 'R001' }) as unknown as Observable<never>,
    );

    staffSpy.getStaff.and.returnValue(
      of([{ id: 1, displayName: 'John Staff' }]) as unknown as Observable<never>,
    );
    chargesSpy.getCharges.and.returnValue(
      of([
        {
          id: 5,
          name: 'Fee',
          amount: 50,
          active: true,
          chargeAppliesTo: { id: 1, value: 'Loan' },
        },
      ]) as unknown as Observable<never>,
    );

    await TestBed.configureTestingModule({
      imports: [AccountActionFormComponent, TranslateModule.forRoot(), MatNativeDateModule],
      providers: [
        { provide: SavingsAccountService, useValue: savingsSpy },
        { provide: FixedDepositAccountService, useValue: fixedSpy },
        { provide: RecurringDepositAccountService, useValue: recurringSpy },
        { provide: LoansService, useValue: loansSpy },
        { provide: StaffService, useValue: staffSpy },
        { provide: ChargesService, useValue: chargesSpy },
        { provide: LoanChargesService, useValue: loanChargesSpy },
        { provide: Router, useValue: routerSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            params: of(routeParams),
          },
        },
        provideNoopAnimations(),
      ],
    }).compileComponents();
  });

  const createComponent = () => {
    fixture = TestBed.createComponent(AccountActionFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  };

  it('should initialize and load loan details for approve command', () => {
    createComponent();
    expect(component).toBeTruthy();
    expect(loansSpy.getLoansLoanId).toHaveBeenCalledWith(123);
    expect(component.title).toBe('ACTIONS.APPROVE_ACCOUNT');
    expect(component.dateLabel).toBe('ACTIONS.APPROVAL_DATE');
  });

  it('should format arrays and strings into Dates correctly via getFineractDate', () => {
    createComponent();
    const date1 = component.getFineractDate([2026, 6, 16]);
    expect(date1?.getFullYear()).toBe(2026);
    expect(date1?.getMonth()).toBe(5); // 0-indexed

    const date2 = component.getFineractDate('2026-06-16');
    expect(date2?.getFullYear()).toBe(2026);
  });

  it('should handle cancel redirects correctly for each accountType', () => {
    createComponent();
    component.accountType = 'savings';
    component.onCancel();
    expect(routerSpy.navigate).toHaveBeenCalledWith([SAVINGS_PATH]);

    component.accountType = 'fixed';
    component.onCancel();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/products/fixed-deposits']);

    component.accountType = 'recurring';
    component.onCancel();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/products/recurring-deposits']);

    component.accountType = 'loan';
    component.onCancel();
    expect(routerSpy.navigate).toHaveBeenCalledWith([`${LOAN_PATH_PREFIX}123`]);

    component.accountType = 'unknown';
    component.onCancel();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/dashboard']);
  });

  it('should submit approve loan action successfully', () => {
    loansSpy.postLoansLoanId.and.returnValue(of({}) as unknown as Observable<never>);
    createComponent();

    component.note = 'Approving loan';
    component.actionDate = new Date(2026, 5, 16);
    component.onSubmit();

    expect(loansSpy.postLoansLoanId).toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledWith([`${LOAN_PATH_PREFIX}123`]);
  });

  it('should submit disburse loan action successfully', () => {
    routeParams['command'] = 'disburse';
    loansSpy.postLoansLoanId.and.returnValue(of({}) as unknown as Observable<never>);
    createComponent();

    component.note = 'Disbursing';
    component.onSubmit();

    expect(loansSpy.postLoansLoanId).toHaveBeenCalled();
  });

  it('should load staff options for assignloanofficer command', () => {
    routeParams['command'] = 'assignloanofficer';
    createComponent();

    expect(staffSpy.getStaff).toHaveBeenCalled();
    expect(component.staffOptions.length).toBe(1);

    loansSpy.postLoansLoanId.and.returnValue(of({}) as unknown as Observable<never>);
    component.toLoanOfficerId = 1;
    component.onSubmit();
    expect(loansSpy.postLoansLoanId).toHaveBeenCalled();
  });

  it('should submit unassignloanofficer successfully', () => {
    routeParams['command'] = 'unassignloanofficer';
    loansSpy.postLoansLoanId.and.returnValue(of({}) as unknown as Observable<never>);
    createComponent();

    component.onSubmit();
    expect(loansSpy.postLoansLoanId).toHaveBeenCalled();
  });

  it('should load charge options and submit applycharges successfully', () => {
    routeParams['command'] = 'applycharges';
    loanChargesSpy.postLoansLoanIdCharges.and.returnValue(of({}) as unknown as Observable<never>);
    createComponent();

    expect(chargesSpy.getCharges).toHaveBeenCalled();
    component.onChargeSelected(5);
    expect(component.amount).toBe(50);

    component.chargeId = 5;
    component.onSubmit();
    expect(loanChargesSpy.postLoansLoanIdCharges).toHaveBeenCalled();
  });

  it('should submit deposit account actions for savings, fixed and recurring', () => {
    routeParams['accountType'] = 'savings';
    routeParams['command'] = 'approve';
    savingsSpy.postSavingsaccountsAccountId.and.returnValue(of({}) as unknown as Observable<never>);

    createComponent();
    expect(savingsSpy.getSavingsaccountsAccountId).toHaveBeenCalledWith(123);

    component.onSubmit();
    expect(savingsSpy.postSavingsaccountsAccountId).toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledWith([SAVINGS_PATH]);
  });

  it('should submit fixed deposit approve action successfully', () => {
    routeParams['accountType'] = 'fixed';
    routeParams['command'] = 'approve';
    fixedSpy.postFixeddepositaccountsAccountId.and.returnValue(
      of({}) as unknown as Observable<never>,
    );

    createComponent();
    expect(fixedSpy.getFixeddepositaccountsAccountId).toHaveBeenCalledWith(123);

    component.onSubmit();
    expect(fixedSpy.postFixeddepositaccountsAccountId).toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/products/fixed-deposits']);
  });

  it('should submit recurring deposit approve action successfully', () => {
    routeParams['accountType'] = 'recurring';
    routeParams['command'] = 'approve';
    recurringSpy.postRecurringdepositaccountsAccountId.and.returnValue(
      of({}) as unknown as Observable<never>,
    );

    createComponent();
    expect(recurringSpy.getRecurringdepositaccountsAccountId).toHaveBeenCalledWith(123);

    component.onSubmit();
    expect(recurringSpy.postRecurringdepositaccountsAccountId).toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/products/recurring-deposits']);
  });

  it('should handle API errors and toggle isSaving flag', () => {
    routeParams['accountType'] = 'savings';
    routeParams['command'] = 'approve';
    savingsSpy.postSavingsaccountsAccountId.and.returnValue(
      throwError(() => new Error('API Error')) as unknown as Observable<never>,
    );

    createComponent();
    component.onSubmit();

    expect(component.isSaving).toBeFalse();
  });

  it('should extract currency code and frequency value safely', () => {
    createComponent();
    expect(component.getCurrencyCode({ code: 'USD' })).toBe('USD');
    expect(component.getCurrencyCode(null)).toBeUndefined();

    expect(component.getFrequencyValue({ value: 'Monthly' })).toBe('Monthly');
    expect(component.getFrequencyValue(null)).toBeUndefined();

    expect(component.getTimelineSubmittedOnDate({ submittedOnDate: [2026, 6, 16] })).toEqual([
      2026, 6, 16,
    ]);
    expect(component.getTimelineSubmittedOnDate(null)).toBeUndefined();

    expect(component.getAmount(100, 200)).toBe(100);
    expect(component.getAmount(0, 200)).toBe(200);
  });
});
