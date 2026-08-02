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
import { LoanViewComponent } from './loan-view.component';
import {
  LoansService,
  LoanBuyDownFeesService,
  LoanCapitalizedIncomeService,
  BASE_PATH,
} from '../../api';
import { AuthService } from '../../core/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { signal } from '@angular/core';
import { provideIonicTesting } from '../../testing/ionic-testing';
import { LOAN_SCHEDULE_TYPE } from '../products/loan-schedule-type';

const PRODUCT_NAME = 'Micro Loan Product';
const EXTERNAL_ID = 'ext-456';

describe('LoanViewComponent', () => {
  let component: LoanViewComponent;
  let fixture: ComponentFixture<LoanViewComponent>;
  let loansServiceSpy: jasmine.SpyObj<LoansService>;
  let buyDownFeesSpy: jasmine.SpyObj<LoanBuyDownFeesService>;
  let capitalizedIncomeSpy: jasmine.SpyObj<LoanCapitalizedIncomeService>;
  let routerSpy: jasmine.SpyObj<Router>;

  /** A cumulative loan, i.e. one that can carry none of the progressive-only features. */
  const cumulativeLoan = {
    id: 456,
    accountNo: 'L000456',
    loanProductName: PRODUCT_NAME,
    clientName: 'Jane Smith',
    principal: 5000,
    annualInterestRate: 12,
    externalId: EXTERNAL_ID,
    loanScheduleType: { code: LOAN_SCHEDULE_TYPE.CUMULATIVE, value: 'Cumulative' },
    status: { value: 'Active' },
    repaymentSchedule: { periods: [] },
    transactions: [],
    charges: [],
  };

  async function setup(loanOverrides: Record<string, unknown> = {}): Promise<void> {
    TestBed.resetTestingModule();

    loansServiceSpy = jasmine.createSpyObj('LoansService', ['getLoansLoanId']);
    buyDownFeesSpy = jasmine.createSpyObj('LoanBuyDownFeesService', [
      'getLoansExternalIdLoanExternalIdBuydownFees',
    ]);
    capitalizedIncomeSpy = jasmine.createSpyObj('LoanCapitalizedIncomeService', [
      'getLoansExternalIdLoanExternalIdCapitalizedIncomes',
    ]);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    const authServiceSpy = jasmine.createSpyObj('AuthService', ['hasPermission'], {
      currentUser: signal({
        username: 'mifos',
        base64EncodedAuthenticationKey: 'key',
        authenticated: true,
        officeId: 1,
        officeName: 'Head Office',
        userId: 1,
        permissions: ['ALL_FUNCTIONS'],
      }),
    });

    loansServiceSpy.getLoansLoanId.and.returnValue(
      of({ ...cumulativeLoan, ...loanOverrides }) as any,
    );
    buyDownFeesSpy.getLoansExternalIdLoanExternalIdBuydownFees.and.returnValue(of([]) as any);
    capitalizedIncomeSpy.getLoansExternalIdLoanExternalIdCapitalizedIncomes.and.returnValue(
      of([]) as any,
    );

    await TestBed.configureTestingModule({
      imports: [LoanViewComponent, TranslateModule.forRoot()],
      providers: [
        provideNoopAnimations(),
        provideIonicTesting(),
        { provide: LoansService, useValue: loansServiceSpy },
        { provide: LoanBuyDownFeesService, useValue: buyDownFeesSpy },
        { provide: LoanCapitalizedIncomeService, useValue: capitalizedIncomeSpy },
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: BASE_PATH, useValue: 'https://example.com/fineract-provider/api' },
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of({ get: (key: string) => (key === 'id' ? '456' : null) }),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoanViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  beforeEach(async () => {
    await setup();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load loan details on init', () => {
    expect(loansServiceSpy.getLoansLoanId).toHaveBeenCalledWith(456, false, 'all');
    expect(component.loan()?.loanProductName).toBe(PRODUCT_NAME);
  });

  /**
   * Buy-down fees and capitalised income are capabilities of the progressive engine. On a
   * cumulative loan the tabs could never hold anything, and an empty table gives the user no way
   * to tell "none recorded" from "not applicable" — so they must be absent, not merely empty.
   */
  describe('progressive-only tabs on a loan that cannot have them', () => {
    it('hides both tabs', () => {
      expect(component.showBuyDownFees()).toBeFalse();
      expect(component.showCapitalizedIncome()).toBeFalse();

      const labels = fixture.nativeElement.textContent as string;
      expect(labels).not.toContain('LOANS.BUY_DOWN_FEES');
      expect(labels).not.toContain('LOANS.CAPITALIZED_INCOME');
    });

    it('does not request data it knows cannot exist', () => {
      expect(buyDownFeesSpy.getLoansExternalIdLoanExternalIdBuydownFees).not.toHaveBeenCalled();
      expect(
        capitalizedIncomeSpy.getLoansExternalIdLoanExternalIdCapitalizedIncomes,
      ).not.toHaveBeenCalled();
    });

    it('falls back to the overview if such a tab is somehow selected', () => {
      component.activeTab.set('7');
      fixture.detectChanges();

      expect(component.activeTab()).toBe('0');
    });
  });

  describe('when the loan reports the capability', () => {
    it('shows the buy-down tab and fetches it', async () => {
      await setup({
        loanScheduleType: { code: LOAN_SCHEDULE_TYPE.PROGRESSIVE, value: 'Progressive' },
        enableBuyDownFee: true,
      });

      expect(component.showBuyDownFees()).toBeTrue();
      expect(component.showCapitalizedIncome()).toBeFalse();
      expect(buyDownFeesSpy.getLoansExternalIdLoanExternalIdBuydownFees).toHaveBeenCalledWith(
        EXTERNAL_ID,
      );
      expect(
        capitalizedIncomeSpy.getLoansExternalIdLoanExternalIdCapitalizedIncomes,
      ).not.toHaveBeenCalled();
    });

    it('shows the capitalised income tab and fetches it', async () => {
      await setup({
        loanScheduleType: { code: LOAN_SCHEDULE_TYPE.PROGRESSIVE, value: 'Progressive' },
        enableIncomeCapitalization: true,
      });

      expect(component.showCapitalizedIncome()).toBeTrue();
      expect(component.showBuyDownFees()).toBeFalse();
      expect(
        capitalizedIncomeSpy.getLoansExternalIdLoanExternalIdCapitalizedIncomes,
      ).toHaveBeenCalledWith(EXTERNAL_ID);
    });

    it('keeps the tab selectable once it is available', async () => {
      await setup({
        loanScheduleType: { code: LOAN_SCHEDULE_TYPE.PROGRESSIVE, value: 'Progressive' },
        enableBuyDownFee: true,
      });

      component.activeTab.set('7');
      fixture.detectChanges();

      expect(component.activeTab()).toBe('7');
    });

    it('still skips the request when the loan has no external id to fetch by', async () => {
      await setup({ enableBuyDownFee: true, externalId: undefined });

      expect(component.showBuyDownFees()).toBeTrue();
      expect(buyDownFeesSpy.getLoansExternalIdLoanExternalIdBuydownFees).not.toHaveBeenCalled();
    });
  });
});
