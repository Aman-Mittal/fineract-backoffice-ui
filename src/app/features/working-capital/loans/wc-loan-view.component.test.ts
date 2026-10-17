/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
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

import { provideTranslateTesting } from '../../../testing/i18n-testing';

import { provideNoopAnimations } from '@angular/platform-browser/animations';

import { createSpyObj, SpyObj } from '../../../testing/mocks';

import { AuthService } from '../../../core/services/auth.service';

import { signal } from '@angular/core';

describe('WcLoanViewComponent', () => {
  let component: WcLoanViewComponent;
  let fixture: ComponentFixture<WcLoanViewComponent>;

  let loansSpy: SpyObj<WorkingCapitalLoansService>;
  let chargesSpy: SpyObj<WorkingCapitalLoanChargesService>;
  let transactionsSpy: SpyObj<WorkingCapitalLoanTransactionsService>;
  let delinquencyActionsSpy: SpyObj<WorkingCapitalLoanDelinquencyActionsService>;
  let delinquencyRangeSpy: SpyObj<WorkingCapitalLoanDelinquencyRangeScheduleService>;
  let breachScheduleSpy: SpyObj<WorkingCapitalLoanBreachScheduleService>;
  let breachActionsSpy: SpyObj<WorkingCapitalLoanBreachActionsService>;
  let nearBreachActionsSpy: SpyObj<WorkingCapitalLoanNearBreachActionsService>;
  let wcOriginatorsSpy: SpyObj<WorkingCapitalLoanOriginatorsService>;
  let originatorsSpy: SpyObj<LoanOriginatorsService>;
  let routerSpy: SpyObj<Router>;

  let authSpy: SpyObj<AuthService>;

  beforeEach(async () => {
    loansSpy = createSpyObj<WorkingCapitalLoansService>([
      'getWorkingCapitalLoansLoanId',
      'getWorkingCapitalLoansLoanIdRateChanges',
      'getWorkingCapitalLoansLoanIdAmortizationSchedule',
      'getWorkingCapitalLoansLoanIdDelinquencyrangetags',
    ]);

    chargesSpy = createSpyObj<WorkingCapitalLoanChargesService>([
      'getWorkingCapitalLoansLoanIdCharges',
    ]);

    transactionsSpy = createSpyObj<WorkingCapitalLoanTransactionsService>([
      'getWorkingCapitalLoansLoanIdTransactions',
    ]);

    delinquencyActionsSpy = createSpyObj<WorkingCapitalLoanDelinquencyActionsService>([
      'getWorkingCapitalLoansLoanIdDelinquencyActions',
    ]);

    delinquencyRangeSpy = createSpyObj<WorkingCapitalLoanDelinquencyRangeScheduleService>([
      'getWorkingCapitalLoansLoanIdDelinquencyRangeSchedule',
    ]);

    breachScheduleSpy = createSpyObj<WorkingCapitalLoanBreachScheduleService>([
      'getWorkingCapitalLoansLoanIdBreachSchedule',
    ]);

    breachActionsSpy = createSpyObj<WorkingCapitalLoanBreachActionsService>([
      'getWorkingCapitalLoansLoanIdBreachActions',
    ]);

    nearBreachActionsSpy = createSpyObj<WorkingCapitalLoanNearBreachActionsService>([
      'getWorkingCapitalLoansLoanIdNearBreachActions',
    ]);

    wcOriginatorsSpy = createSpyObj<WorkingCapitalLoanOriginatorsService>([
      'getWorkingCapitalLoansLoanIdOriginators',
      'postWorkingCapitalLoansLoanIdOriginatorsOriginatorId',
      'deleteWorkingCapitalLoansLoanIdOriginatorsOriginatorId',
    ]);

    originatorsSpy = createSpyObj<LoanOriginatorsService>(['getLoanOriginators']);

    routerSpy = createSpyObj<Router>(['navigate']);

    // An administrator by default, so the existing expectations describe an unrestricted user;
    // the gating suite below narrows it per test.
    authSpy = Object.assign(createSpyObj<AuthService>(['hasPermission']), {
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
    authSpy.hasPermission.mockReturnValue(true);

    loansSpy.getWorkingCapitalLoansLoanId.mockReturnValue(
      of({
        id: 1,
        accountNo: '000001',
        client: {
          id: 7,
          displayName: 'Acme Ltd',
        },
        status: {
          value: 'Active',
        },
      }) as unknown as ReturnType<WorkingCapitalLoansService['getWorkingCapitalLoansLoanId']>,
    );

    loansSpy.getWorkingCapitalLoansLoanIdRateChanges.mockReturnValue(
      of([
        {
          id: 1,
          effectiveDate: '01 January 2026',
          previousRate: 5,
          newRate: 6,
        },
      ]) as unknown as ReturnType<
        WorkingCapitalLoansService['getWorkingCapitalLoansLoanIdRateChanges']
      >,
    );

    loansSpy.getWorkingCapitalLoansLoanIdAmortizationSchedule.mockReturnValue(
      of({
        periodPaymentRate: 5,
        netDisbursementAmount: 9800,
        payments: [],
      }) as unknown as ReturnType<
        WorkingCapitalLoansService['getWorkingCapitalLoansLoanIdAmortizationSchedule']
      >,
    );

    loansSpy.getWorkingCapitalLoansLoanIdDelinquencyrangetags.mockReturnValue(
      of([
        {
          id: 1,
          periodNumber: 1,
          delinquentDays: 5,
        },
      ]) as unknown as ReturnType<
        WorkingCapitalLoansService['getWorkingCapitalLoansLoanIdDelinquencyrangetags']
      >,
    );

    chargesSpy.getWorkingCapitalLoansLoanIdCharges.mockReturnValue(
      of([
        {
          id: 1,
          name: 'Fee',
          amount: 100,
        },
      ]) as unknown as ReturnType<
        WorkingCapitalLoanChargesService['getWorkingCapitalLoansLoanIdCharges']
      >,
    );

    transactionsSpy.getWorkingCapitalLoansLoanIdTransactions.mockReturnValue(
      of({
        content: [
          {
            id: 1,
            transactionAmount: 500,
          },
        ],
      }) as unknown as ReturnType<
        WorkingCapitalLoanTransactionsService['getWorkingCapitalLoansLoanIdTransactions']
      >,
    );

    delinquencyActionsSpy.getWorkingCapitalLoansLoanIdDelinquencyActions.mockReturnValue(
      of([
        {
          id: 1,
          action: 'PAUSE',
        },
      ]) as unknown as ReturnType<
        WorkingCapitalLoanDelinquencyActionsService['getWorkingCapitalLoansLoanIdDelinquencyActions']
      >,
    );

    delinquencyRangeSpy.getWorkingCapitalLoansLoanIdDelinquencyRangeSchedule.mockReturnValue(
      of([
        {
          id: 1,
          periodNumber: 1,
        },
      ]) as unknown as ReturnType<
        WorkingCapitalLoanDelinquencyRangeScheduleService['getWorkingCapitalLoansLoanIdDelinquencyRangeSchedule']
      >,
    );

    breachScheduleSpy.getWorkingCapitalLoansLoanIdBreachSchedule.mockReturnValue(
      of([
        {
          id: 1,
          periodNumber: 1,
          breach: true,
        },
      ]) as unknown as ReturnType<
        WorkingCapitalLoanBreachScheduleService['getWorkingCapitalLoansLoanIdBreachSchedule']
      >,
    );

    breachActionsSpy.getWorkingCapitalLoansLoanIdBreachActions.mockReturnValue(
      of([
        {
          id: 1,
          action: 'PAUSE',
        },
      ]) as unknown as ReturnType<
        WorkingCapitalLoanBreachActionsService['getWorkingCapitalLoansLoanIdBreachActions']
      >,
    );

    nearBreachActionsSpy.getWorkingCapitalLoansLoanIdNearBreachActions.mockReturnValue(
      of([
        {
          id: 1,
          action: 'RESCHEDULE',
          threshold: 80,
        },
      ]) as unknown as ReturnType<
        WorkingCapitalLoanNearBreachActionsService['getWorkingCapitalLoansLoanIdNearBreachActions']
      >,
    );

    wcOriginatorsSpy.getWorkingCapitalLoansLoanIdOriginators.mockReturnValue(
      of({
        originators: [
          {
            id: 5,
            name: 'Acme Originator',
          },
        ],
      }) as unknown as ReturnType<
        WorkingCapitalLoanOriginatorsService['getWorkingCapitalLoansLoanIdOriginators']
      >,
    );

    wcOriginatorsSpy.postWorkingCapitalLoansLoanIdOriginatorsOriginatorId.mockReturnValue(
      of({}) as unknown as ReturnType<
        WorkingCapitalLoanOriginatorsService['postWorkingCapitalLoansLoanIdOriginatorsOriginatorId']
      >,
    );

    wcOriginatorsSpy.deleteWorkingCapitalLoansLoanIdOriginatorsOriginatorId.mockReturnValue(
      of({}) as unknown as ReturnType<
        WorkingCapitalLoanOriginatorsService['deleteWorkingCapitalLoansLoanIdOriginatorsOriginatorId']
      >,
    );

    originatorsSpy.getLoanOriginators.mockReturnValue(
      of([
        {
          id: 5,
          name: 'Acme Originator',
        },
        {
          id: 6,
          name: 'Other Originator',
        },
      ]) as unknown as ReturnType<LoanOriginatorsService['getLoanOriginators']>,
    );

    await TestBed.configureTestingModule({
      imports: [WcLoanViewComponent],
      providers: [
        ...provideTranslateTesting(),
        {
          provide: WorkingCapitalLoansService,
          useValue: loansSpy,
        },
        {
          provide: AuthService,
          useValue: authSpy,
        },
        {
          provide: WorkingCapitalLoanChargesService,
          useValue: chargesSpy,
        },
        {
          provide: WorkingCapitalLoanTransactionsService,
          useValue: transactionsSpy,
        },
        {
          provide: WorkingCapitalLoanDelinquencyActionsService,
          useValue: delinquencyActionsSpy,
        },
        {
          provide: WorkingCapitalLoanDelinquencyRangeScheduleService,
          useValue: delinquencyRangeSpy,
        },
        {
          provide: WorkingCapitalLoanBreachScheduleService,
          useValue: breachScheduleSpy,
        },
        {
          provide: WorkingCapitalLoanBreachActionsService,
          useValue: breachActionsSpy,
        },
        {
          provide: WorkingCapitalLoanNearBreachActionsService,
          useValue: nearBreachActionsSpy,
        },
        {
          provide: WorkingCapitalLoanOriginatorsService,
          useValue: wcOriginatorsSpy,
        },
        {
          provide: LoanOriginatorsService,
          useValue: originatorsSpy,
        },
        {
          provide: Router,
          useValue: routerSpy,
        },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap({
                id: '1',
              }),
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
    expect(component.charges()).toHaveLength(1);
    expect(component.transactions()).toHaveLength(1);
    expect(component.delinquencyActions()).toHaveLength(1);
    expect(component.delinquencyRangeSchedule()).toHaveLength(1);
    expect(component.breachSchedule()).toHaveLength(1);
    expect(component.breachActions()).toHaveLength(1);
    expect(component.nearBreachActions()).toHaveLength(1);

    expect(component.originators()).toEqual([
      {
        id: 5,
        name: 'Acme Originator',
      },
    ]);
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
      imports: [WcLoanViewComponent],
      providers: [
        ...provideTranslateTesting(),
        {
          provide: WorkingCapitalLoansService,
          useValue: loansSpy,
        },
        {
          provide: WorkingCapitalLoanChargesService,
          useValue: chargesSpy,
        },
        {
          provide: WorkingCapitalLoanTransactionsService,
          useValue: transactionsSpy,
        },
        {
          provide: WorkingCapitalLoanDelinquencyActionsService,
          useValue: delinquencyActionsSpy,
        },
        {
          provide: WorkingCapitalLoanDelinquencyRangeScheduleService,
          useValue: delinquencyRangeSpy,
        },
        {
          provide: WorkingCapitalLoanBreachScheduleService,
          useValue: breachScheduleSpy,
        },
        {
          provide: WorkingCapitalLoanBreachActionsService,
          useValue: breachActionsSpy,
        },
        {
          provide: WorkingCapitalLoanNearBreachActionsService,
          useValue: nearBreachActionsSpy,
        },
        {
          provide: WorkingCapitalLoanOriginatorsService,
          useValue: wcOriginatorsSpy,
        },
        {
          provide: LoanOriginatorsService,
          useValue: originatorsSpy,
        },
        {
          provide: Router,
          useValue: routerSpy,
        },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap({
                id: '1',
              }),
              queryParamMap: convertToParamMap({
                tab: 'originators',
              }),
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
    vi.spyOn(window, 'confirm').mockReturnValue(true);

    component.onDetachOriginator({
      id: 5,
      name: 'Acme Originator',
    });

    expect(
      wcOriginatorsSpy.deleteWorkingCapitalLoansLoanIdOriginatorsOriginatorId,
    ).toHaveBeenCalledWith(1, 5);
  });

  it('does not detach an originator when the confirmation is declined', () => {
    vi.spyOn(window, 'confirm').mockReturnValue(false);

    component.onDetachOriginator({
      id: 5,
      name: 'Acme Originator',
    });

    expect(
      wcOriginatorsSpy.deleteWorkingCapitalLoansLoanIdOriginatorsOriginatorId,
    ).not.toHaveBeenCalled();
  });

  it('excludes already-attached originators from the attachable list', () => {
    // The master list has originators 5 and 6; 5 is already attached
    // (per the default mock), so only 6 should be offered.
    expect(component.attachableOriginators()).toEqual([
      {
        id: 6,
        name: 'Other Originator',
      },
    ]);
  });

  describe('teardown', () => {
    it('dismisses popovers when destroyed', () => {
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

  /**
   * Issue #777: every action on this screen was rendered unconditionally and every action route
   * was gated on `UPDATE_WORKINGCAPITALLOAN`, a code Fineract accepts for none of them. So the
   * screen both refused an approver who held `APPROVE_WORKINGCAPITALLOAN` and offered Approve to
   * someone who could only ever get a 403 for it.
   */
  describe('permission gating', () => {
    /** Renders the loan in a status, so the status-gated controls exist to be asserted on. */
    function showLoanWith(status: Record<string, boolean>) {
      component.loan.set({ id: 1, status } as never);
      fixture.detectChanges();
    }

    function control(permission: string): HTMLElement | null {
      return fixture.nativeElement.querySelector(
        `[appRequiresPermission="${CSS.escape(permission)}"]`,
      );
    }

    it('gates Approve on APPROVE_WORKINGCAPITALLOAN, not on UPDATE', () => {
      showLoanWith({ pendingApproval: true });

      expect(control('APPROVE_WORKINGCAPITALLOAN')).not.toBeNull();
      expect(control('UPDATE_WORKINGCAPITALLOAN')).toBeNull();
      expect(authSpy.hasPermission).toHaveBeenCalledWith('APPROVE_WORKINGCAPITALLOAN', false);
    });

    it('lets an approver who lacks UPDATE use it', () => {
      authSpy.hasPermission.mockImplementation(
        (permission: string | string[]) => permission === 'APPROVE_WORKINGCAPITALLOAN',
      );
      showLoanWith({ pendingApproval: true });

      const approve = control('APPROVE_WORKINGCAPITALLOAN');
      expect(approve!.getAttribute('aria-disabled')).toBeNull();
    });

    it('disables the control, and says which permission is missing', () => {
      authSpy.hasPermission.mockReturnValue(false);
      showLoanWith({ pendingApproval: true });

      const approve = control('APPROVE_WORKINGCAPITALLOAN');
      expect(approve!.getAttribute('aria-disabled')).toBe('true');
      // A refused control carries a hint naming the permission, so the user can ask an
      // administrator for exactly that one. The text itself is the directive's own test's
      // business; here the i18n stub answers with the key.
      expect(approve!.getAttribute('title')).toBeTruthy();
      expect(approve!.getAttribute('aria-label')).toBeTruthy();
    });

    it('leaves a read-only user no enabled write control on an active loan', () => {
      authSpy.hasPermission.mockReturnValue(false);
      showLoanWith({ active: true });

      const gated = fixture.nativeElement.querySelectorAll('[appRequiresPermission]');
      expect(gated.length).toBeGreaterThan(0);
      for (const element of gated) {
        expect(
          element.getAttribute('aria-disabled'),
          `${element.getAttribute('appRequiresPermission')} is still enabled`,
        ).toBe('true');
      }
    });

    it('gates Disburse and Repayment on their own codes', () => {
      showLoanWith({ waitingForDisbursal: true });
      expect(control('DISBURSE_WORKINGCAPITALLOAN')).not.toBeNull();

      showLoanWith({ active: true });
      expect(control('REPAYMENT_WORKINGCAPITALLOAN')).not.toBeNull();
    });
  });

  /**
   * Issues #771 and #772: which loss and credit actions the screen offers, and when.
   *
   * Asserted on the predicates rather than the menu markup because the actions live inside an
   * `ion-popover`, whose template Ionic only renders once the popover is presented. The statuses
   * come from the Working Capital module's own documentation — a loan written off is locked to
   * everything but a recovery, and undoing the write-off is refused while a recovery stands.
   */
  describe('action availability by loan state', () => {
    function withLoan(loan: Record<string, unknown>) {
      component.loan.set(loan as never);
    }

    it('accepts credits while active, closed-obligations-met or overpaid', () => {
      withLoan({ status: { active: true } });
      expect(component.acceptsCredits).toBe(true);

      withLoan({ status: { closedObligationsMet: true } });
      expect(component.acceptsCredits).toBe(true);

      withLoan({ status: { overpaid: true } });
      expect(component.acceptsCredits).toBe(true);

      withLoan({ status: { closedWrittenOff: true } });
      expect(component.acceptsCredits).toBe(false);
    });

    it('offers a credit balance refund only when there is an overpayment to refund', () => {
      withLoan({ status: { overpaid: true }, balance: { overpaymentAmount: 250 } });
      expect(component.hasCreditBalance).toBe(true);

      withLoan({ status: { overpaid: true }, balance: { overpaymentAmount: 0 } });
      expect(component.hasCreditBalance).toBe(false);

      withLoan({ status: { active: true }, balance: { overpaymentAmount: 250 } });
      expect(component.hasCreditBalance).toBe(false);
    });

    it('separates charged off from written off', () => {
      withLoan({ status: { active: true }, chargedOff: true });
      expect(component.isLoanChargedOff).toBe(true);
      // Charge-off is a non-monetary tag: the loan stays active and still takes repayments.
      expect(component.isLoanActive).toBe(true);
      expect(component.isLoanWrittenOff).toBe(false);

      withLoan({ status: { closedWrittenOff: true } });
      expect(component.isLoanWrittenOff).toBe(true);
      expect(component.isLoanActive).toBe(false);
    });

    it('offers a recovery payment only while something is still recoverable', () => {
      withLoan({ status: { closedWrittenOff: true }, balance: { writtenOffOutstanding: 70 } });
      expect(component.canRecordRecovery).toBe(true);

      withLoan({ status: { closedWrittenOff: true }, balance: { writtenOffOutstanding: 0 } });
      expect(component.canRecordRecovery).toBe(false);

      withLoan({ status: { active: true }, balance: { writtenOffOutstanding: 70 } });
      expect(component.canRecordRecovery).toBe(false);
    });

    it('withholds undo write-off while a recovery stands', () => {
      // Restoring the balance would replay money already booked as recovery income against it,
      // so Fineract refuses until the recoveries are reversed.
      withLoan({ status: { closedWrittenOff: true }, balance: { totalRecovered: 0 } });
      expect(component.canUndoWriteOff).toBe(true);

      withLoan({ status: { closedWrittenOff: true }, balance: { totalRecovered: 30 } });
      expect(component.canUndoWriteOff).toBe(false);
    });
  });
});
