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
import { WcLoanViewComponent } from './wc-loan-view.component';
import {
  WorkingCapitalLoansService,
  WorkingCapitalLoanChargesService,
  WorkingCapitalLoanTransactionsService,
  WorkingCapitalLoanDelinquencyActionsService,
  WorkingCapitalLoanDelinquencyRangeScheduleService,
  WorkingCapitalLoanBreachScheduleService,
} from '../../../api';
import { ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { of } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { provideNoopAnimations } from '@angular/platform-browser/animations';

describe('WcLoanViewComponent', () => {
  let component: WcLoanViewComponent;
  let fixture: ComponentFixture<WcLoanViewComponent>;
  let loansSpy: jasmine.SpyObj<WorkingCapitalLoansService>;
  let chargesSpy: jasmine.SpyObj<WorkingCapitalLoanChargesService>;
  let transactionsSpy: jasmine.SpyObj<WorkingCapitalLoanTransactionsService>;
  let delinquencyActionsSpy: jasmine.SpyObj<WorkingCapitalLoanDelinquencyActionsService>;
  let delinquencyRangeSpy: jasmine.SpyObj<WorkingCapitalLoanDelinquencyRangeScheduleService>;
  let breachScheduleSpy: jasmine.SpyObj<WorkingCapitalLoanBreachScheduleService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    loansSpy = jasmine.createSpyObj('WorkingCapitalLoansService', ['getWorkingCapitalLoansLoanId']);
    chargesSpy = jasmine.createSpyObj('WorkingCapitalLoanChargesService', [
      'getWorkingCapitalLoansLoanIdCharges',
    ]);
    transactionsSpy = jasmine.createSpyObj('WorkingCapitalLoanTransactionsService', [
      'getWorkingCapitalLoansLoanIdTransactions',
    ]);
    delinquencyActionsSpy = jasmine.createSpyObj('WorkingCapitalLoanDelinquencyActionsService', [
      'getWorkingCapitalLoansLoanIdDelinquencyActions',
    ]);
    delinquencyRangeSpy = jasmine.createSpyObj(
      'WorkingCapitalLoanDelinquencyRangeScheduleService',
      ['getWorkingCapitalLoansLoanIdDelinquencyRangeSchedule'],
    );
    breachScheduleSpy = jasmine.createSpyObj('WorkingCapitalLoanBreachScheduleService', [
      'getWorkingCapitalLoansLoanIdBreachSchedule',
    ]);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    loansSpy.getWorkingCapitalLoansLoanId.and.returnValue(
      of({
        id: 1,
        accountNo: '000001',
        client: { id: 7, displayName: 'Acme Ltd' },
        status: { value: 'Active' },
      }) as unknown as ReturnType<WorkingCapitalLoansService['getWorkingCapitalLoansLoanId']>,
    );
    chargesSpy.getWorkingCapitalLoansLoanIdCharges.and.returnValue(
      of([{ id: 1, name: 'Fee', amount: 100 }]) as unknown as ReturnType<
        WorkingCapitalLoanChargesService['getWorkingCapitalLoansLoanIdCharges']
      >,
    );
    transactionsSpy.getWorkingCapitalLoansLoanIdTransactions.and.returnValue(
      of({ content: [{ id: 1, transactionAmount: 500 }] }) as unknown as ReturnType<
        WorkingCapitalLoanTransactionsService['getWorkingCapitalLoansLoanIdTransactions']
      >,
    );
    delinquencyActionsSpy.getWorkingCapitalLoansLoanIdDelinquencyActions.and.returnValue(
      of([{ id: 1, action: 'PAUSE' }]) as unknown as ReturnType<
        WorkingCapitalLoanDelinquencyActionsService['getWorkingCapitalLoansLoanIdDelinquencyActions']
      >,
    );
    delinquencyRangeSpy.getWorkingCapitalLoansLoanIdDelinquencyRangeSchedule.and.returnValue(
      of([{ id: 1, periodNumber: 1 }]) as unknown as ReturnType<
        WorkingCapitalLoanDelinquencyRangeScheduleService['getWorkingCapitalLoansLoanIdDelinquencyRangeSchedule']
      >,
    );
    breachScheduleSpy.getWorkingCapitalLoansLoanIdBreachSchedule.and.returnValue(
      of([{ id: 1, periodNumber: 1, breach: true }]) as unknown as ReturnType<
        WorkingCapitalLoanBreachScheduleService['getWorkingCapitalLoansLoanIdBreachSchedule']
      >,
    );

    await TestBed.configureTestingModule({
      imports: [WcLoanViewComponent, TranslateModule.forRoot()],
      providers: [
        { provide: WorkingCapitalLoansService, useValue: loansSpy },
        { provide: WorkingCapitalLoanChargesService, useValue: chargesSpy },
        { provide: WorkingCapitalLoanTransactionsService, useValue: transactionsSpy },
        { provide: WorkingCapitalLoanDelinquencyActionsService, useValue: delinquencyActionsSpy },
        {
          provide: WorkingCapitalLoanDelinquencyRangeScheduleService,
          useValue: delinquencyRangeSpy,
        },
        { provide: WorkingCapitalLoanBreachScheduleService, useValue: breachScheduleSpy },
        { provide: Router, useValue: routerSpy },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: convertToParamMap({ id: '1' }) } },
        },
        provideNoopAnimations(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(WcLoanViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should load the loan and all tab data on init', () => {
    expect(component).toBeTruthy();
    expect(component.loanId).toBe(1);
    expect(loansSpy.getWorkingCapitalLoansLoanId).toHaveBeenCalledWith(1);
    expect(component.loan()?.accountNo).toBe('000001');
    expect(component.charges().length).toBe(1);
    expect(component.transactions().length).toBe(1);
    expect(component.delinquencyActions().length).toBe(1);
    expect(component.delinquencyRangeSchedule().length).toBe(1);
    expect(component.breachSchedule().length).toBe(1);
  });

  it('should navigate back to the list', () => {
    component.onBack();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/working-capital/loans']);
  });
});
