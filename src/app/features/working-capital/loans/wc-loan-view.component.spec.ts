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
  WorkingCapitalLoanBreachActionsService,
  WorkingCapitalLoanNearBreachActionsService,
  WorkingCapitalLoanOriginatorsService,
  LoanOriginatorsService,
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
  let breachActionsSpy: jasmine.SpyObj<WorkingCapitalLoanBreachActionsService>;
  let nearBreachActionsSpy: jasmine.SpyObj<WorkingCapitalLoanNearBreachActionsService>;
  let wcOriginatorsSpy: jasmine.SpyObj<WorkingCapitalLoanOriginatorsService>;
  let originatorsSpy: jasmine.SpyObj<LoanOriginatorsService>;
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
    breachActionsSpy = jasmine.createSpyObj('WorkingCapitalLoanBreachActionsService', [
      'getWorkingCapitalLoansLoanIdBreachActions',
    ]);
    nearBreachActionsSpy = jasmine.createSpyObj('WorkingCapitalLoanNearBreachActionsService', [
      'getWorkingCapitalLoansLoanIdNearBreachActions',
    ]);
    wcOriginatorsSpy = jasmine.createSpyObj('WorkingCapitalLoanOriginatorsService', [
      'getWorkingCapitalLoansLoanIdOriginators',
      'postWorkingCapitalLoansLoanIdOriginatorsOriginatorId',
      'deleteWorkingCapitalLoansLoanIdOriginatorsOriginatorId',
    ]);
    originatorsSpy = jasmine.createSpyObj('LoanOriginatorsService', ['getLoanOriginators']);
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
    breachActionsSpy.getWorkingCapitalLoansLoanIdBreachActions.and.returnValue(
      of([{ id: 1, action: 'PAUSE' }]) as unknown as ReturnType<
        WorkingCapitalLoanBreachActionsService['getWorkingCapitalLoansLoanIdBreachActions']
      >,
    );
    nearBreachActionsSpy.getWorkingCapitalLoansLoanIdNearBreachActions.and.returnValue(
      of([{ id: 1, action: 'RESCHEDULE', threshold: 80 }]) as unknown as ReturnType<
        WorkingCapitalLoanNearBreachActionsService['getWorkingCapitalLoansLoanIdNearBreachActions']
      >,
    );
    wcOriginatorsSpy.getWorkingCapitalLoansLoanIdOriginators.and.returnValue(
      of({ originators: [{ id: 5, name: 'Acme Originator' }] }) as unknown as ReturnType<
        WorkingCapitalLoanOriginatorsService['getWorkingCapitalLoansLoanIdOriginators']
      >,
    );
    wcOriginatorsSpy.postWorkingCapitalLoansLoanIdOriginatorsOriginatorId.and.returnValue(
      of({}) as unknown as ReturnType<
        WorkingCapitalLoanOriginatorsService['postWorkingCapitalLoansLoanIdOriginatorsOriginatorId']
      >,
    );
    wcOriginatorsSpy.deleteWorkingCapitalLoansLoanIdOriginatorsOriginatorId.and.returnValue(
      of({}) as unknown as ReturnType<
        WorkingCapitalLoanOriginatorsService['deleteWorkingCapitalLoansLoanIdOriginatorsOriginatorId']
      >,
    );
    originatorsSpy.getLoanOriginators.and.returnValue(
      of([
        { id: 5, name: 'Acme Originator' },
        { id: 6, name: 'Other Originator' },
      ]) as unknown as ReturnType<LoanOriginatorsService['getLoanOriginators']>,
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
        { provide: WorkingCapitalLoanBreachActionsService, useValue: breachActionsSpy },
        { provide: WorkingCapitalLoanNearBreachActionsService, useValue: nearBreachActionsSpy },
        { provide: WorkingCapitalLoanOriginatorsService, useValue: wcOriginatorsSpy },
        { provide: LoanOriginatorsService, useValue: originatorsSpy },
        { provide: Router, useValue: routerSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap({ id: '1' }),
              queryParamMap: convertToParamMap({}),
            },
          },
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
    expect(component.charges()).toHaveSize(1);
    expect(component.transactions()).toHaveSize(1);
    expect(component.delinquencyActions()).toHaveSize(1);
    expect(component.delinquencyRangeSchedule()).toHaveSize(1);
    expect(component.breachSchedule()).toHaveSize(1);
    expect(component.breachActions()).toHaveSize(1);
    expect(component.nearBreachActions()).toHaveSize(1);
    expect(component.originators()).toEqual([{ id: 5, name: 'Acme Originator' }]);
  });

  it('should navigate back to the list', () => {
    component.onBack();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/working-capital/loans']);
  });

  it('should navigate to the delinquency-action form', () => {
    component.onNewDelinquencyAction();
    expect(routerSpy.navigate).toHaveBeenCalledWith([
      '/working-capital/loans/1/delinquency-action',
    ]);
  });

  it('should navigate to the breach-action form', () => {
    component.onNewBreachAction();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/working-capital/loans/1/breach-action']);
  });

  it('should navigate to the near-breach-action form', () => {
    component.onNewNearBreachAction();
    expect(routerSpy.navigate).toHaveBeenCalledWith([
      '/working-capital/loans/1/near-breach-action',
    ]);
  });

  it('preselects the tab named in the ?tab query param', async () => {
    TestBed.resetTestingModule();
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
        { provide: WorkingCapitalLoanBreachActionsService, useValue: breachActionsSpy },
        { provide: WorkingCapitalLoanNearBreachActionsService, useValue: nearBreachActionsSpy },
        { provide: WorkingCapitalLoanOriginatorsService, useValue: wcOriginatorsSpy },
        { provide: LoanOriginatorsService, useValue: originatorsSpy },
        { provide: Router, useValue: routerSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap({ id: '1' }),
              queryParamMap: convertToParamMap({ tab: 'originators' }),
            },
          },
        },
        provideNoopAnimations(),
      ],
    }).compileComponents();

    const taggedFixture = TestBed.createComponent(WcLoanViewComponent);
    taggedFixture.detectChanges();
    expect(taggedFixture.componentInstance.activeTab()).toBe('originators');
  });

  it('attaches the selected originator and reloads the attached list', () => {
    component.originatorToAttach.set(6);
    component.onAttachOriginator();

    expect(
      wcOriginatorsSpy.postWorkingCapitalLoansLoanIdOriginatorsOriginatorId,
    ).toHaveBeenCalledWith(1, 6);
    expect(component.originatorToAttach()).toBeNull();
    expect(wcOriginatorsSpy.getWorkingCapitalLoansLoanIdOriginators).toHaveBeenCalledTimes(2);
  });

  it('does nothing when attaching without a selection', () => {
    component.originatorToAttach.set(null);
    component.onAttachOriginator();

    expect(
      wcOriginatorsSpy.postWorkingCapitalLoansLoanIdOriginatorsOriginatorId,
    ).not.toHaveBeenCalled();
  });

  it('detaches an originator after confirmation', () => {
    spyOn(window, 'confirm').and.returnValue(true);

    component.onDetachOriginator({ id: 5, name: 'Acme Originator' });

    expect(
      wcOriginatorsSpy.deleteWorkingCapitalLoansLoanIdOriginatorsOriginatorId,
    ).toHaveBeenCalledWith(1, 5);
  });

  it('does not detach an originator when the confirmation is declined', () => {
    spyOn(window, 'confirm').and.returnValue(false);

    component.onDetachOriginator({ id: 5, name: 'Acme Originator' });

    expect(
      wcOriginatorsSpy.deleteWorkingCapitalLoansLoanIdOriginatorsOriginatorId,
    ).not.toHaveBeenCalled();
  });

  it('excludes already-attached originators from the attachable list', () => {
    // The master list has originators 5 and 6; 5 is already attached (per the default mock),
    // so only 6 should be offered.
    expect(component.attachableOriginators()).toEqual([{ id: 6, name: 'Other Originator' }]);
  });
});
