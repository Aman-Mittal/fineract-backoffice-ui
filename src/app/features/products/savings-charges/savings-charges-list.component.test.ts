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
import { SavingsChargesListComponent } from './savings-charges-list.component';
import { SavingsChargesService } from '../../../api';
import { ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { of, throwError } from 'rxjs';
import { provideTranslateTesting } from '../../../testing/i18n-testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { DialogService } from '../../../core/services/dialog.service';
import { NotificationService } from '../../../core/services/notification.service';

describe('SavingsChargesListComponent', () => {
  let component: SavingsChargesListComponent;
  let fixture: ComponentFixture<SavingsChargesListComponent>;
  let serviceSpy: SpyObj<SavingsChargesService>;
  let routerSpy: SpyObj<Router>;
  let dialogService: SpyObj<DialogService>;
  let notifications: SpyObj<NotificationService>;

  beforeEach(async () => {
    serviceSpy = createSpyObj([
      'getSavingsaccountsSavingsAccountIdCharges',
      'deleteSavingsaccountsSavingsAccountIdChargesSavingsAccountChargeId',
      'postSavingsaccountsSavingsAccountIdChargesSavingsAccountChargeId',
    ]);
    routerSpy = createSpyObj(['navigate']);
    dialogService = createSpyObj(['confirm', 'prompt']);
    dialogService.confirm.mockResolvedValue(true);
    notifications = createSpyObj(['success', 'error']);
    serviceSpy.getSavingsaccountsSavingsAccountIdCharges.mockReturnValue(
      of([{ id: 1, name: 'Withdrawal Fee', amount: 10 }]) as unknown as ReturnType<
        SavingsChargesService['getSavingsaccountsSavingsAccountIdCharges']
      >,
    );

    await TestBed.configureTestingModule({
      imports: [SavingsChargesListComponent],
      providers: [
        ...provideTranslateTesting(),
        { provide: SavingsChargesService, useValue: serviceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: DialogService, useValue: dialogService },
        { provide: NotificationService, useValue: notifications },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: convertToParamMap({ savingsAccountId: '1' }) } },
        },
        provideNoopAnimations(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SavingsChargesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should load charges on init', () => {
    expect(component).toBeTruthy();
    expect(serviceSpy.getSavingsaccountsSavingsAccountIdCharges).toHaveBeenCalledWith(1);
    expect(component.charges()).toHaveLength(1);
  });

  it('should delete after confirmation and reload', async () => {
    serviceSpy.deleteSavingsaccountsSavingsAccountIdChargesSavingsAccountChargeId.mockReturnValue(
      of({}) as unknown as ReturnType<
        SavingsChargesService['deleteSavingsaccountsSavingsAccountIdChargesSavingsAccountChargeId']
      >,
    );

    component.onDelete({ id: 5, name: 'Y' });

    await fixture.whenStable();

    expect(
      serviceSpy.deleteSavingsaccountsSavingsAccountIdChargesSavingsAccountChargeId,
    ).toHaveBeenCalledWith(1, 5);
    expect(serviceSpy.getSavingsaccountsSavingsAccountIdCharges).toHaveBeenCalledTimes(2);
  });

  it('should not delete when cancelled', async () => {
    dialogService.confirm.mockResolvedValue(false);
    component.onDelete({ id: 5, name: 'Y' });
    await fixture.whenStable();
    expect(
      serviceSpy.deleteSavingsaccountsSavingsAccountIdChargesSavingsAccountChargeId,
    ).not.toHaveBeenCalled();
  });

  /**
   * #754. A savings charge could be added and deleted and nothing else, so an annual fee
   * applied in error had no remedy — a delete is refused once anything has been collected.
   *
   * Three commands, and the spellings are the platform's: `paycharge` (not `pay`, which is how
   * a loan charge is paid), `waive` and `inactivate`.
   */
  describe('paying, waiving and inactivating', () => {
    const OUTSTANDING = {
      id: 5,
      name: 'Account Maintenance',
      amount: 50,
      amountOutstanding: 50,
      isActive: true,
      // Specified due date: payable and waivable, but it does not recur, so not inactivatable.
      chargeTimeType: {
        id: 2,
        code: 'chargeTimeType.specifiedDueDate',
        value: 'Specified due date',
      },
    };

    beforeEach(() => {
      serviceSpy.postSavingsaccountsSavingsAccountIdChargesSavingsAccountChargeId.mockReturnValue(
        of({}) as unknown as ReturnType<
          SavingsChargesService['postSavingsaccountsSavingsAccountIdChargesSavingsAccountChargeId']
        >,
      );
    });

    it('pays with the amount and due date the platform demands together', async () => {
      // `validation.msg.savingsaccountcharge.amount.cannot.be.blank` names both parameters, so
      // sending either alone is a round-trip wasted.
      dialogService.prompt.mockResolvedValue({ amount: 50, dueDate: '2026-10-02' });

      await component.onPay(OUTSTANDING);

      expect(
        serviceSpy.postSavingsaccountsSavingsAccountIdChargesSavingsAccountChargeId,
      ).toHaveBeenCalledWith(
        1,
        5,
        { amount: 50, dueDate: '2026-10-02', dateFormat: 'yyyy-MM-dd', locale: 'en' },
        'paycharge',
      );
    });

    it('uses the platform spelling, which is not the loan charge one', async () => {
      dialogService.prompt.mockResolvedValue({ amount: 50, dueDate: '2026-10-02' });

      await component.onPay(OUTSTANDING);

      const command =
        serviceSpy.postSavingsaccountsSavingsAccountIdChargesSavingsAccountChargeId.mock
          .calls[0][3];
      expect(command).toBe('paycharge');
      expect(command).not.toBe('pay');
    });

    it('waives with an empty body after a destructive confirmation', async () => {
      await component.onWaive(OUTSTANDING);

      expect(dialogService.confirm).toHaveBeenCalledWith(
        expect.objectContaining({ destructive: true }),
      );
      expect(
        serviceSpy.postSavingsaccountsSavingsAccountIdChargesSavingsAccountChargeId,
      ).toHaveBeenCalledWith(1, 5, {}, 'waive');
    });

    it('inactivates a charge, which is neither a waiver nor a delete', async () => {
      // A waiver settles what is outstanding now; this stops the charge being applied again.
      await component.onInactivate(OUTSTANDING);

      expect(
        serviceSpy.postSavingsaccountsSavingsAccountIdChargesSavingsAccountChargeId,
      ).toHaveBeenCalledWith(1, 5, {}, 'inactivate');
    });

    it('offers pay and waive only while something is outstanding', () => {
      expect(component.isOutstanding(OUTSTANDING)).toBe(true);
      expect(component.isOutstanding({ id: 6, amountOutstanding: 0 })).toBe(false);
    });

    describe('which rows can be inactivated', () => {
      const ANNUAL = {
        id: 7,
        name: 'Annual Fee',
        amount: 50,
        isActive: true,
        chargeTimeType: { id: 6, code: 'chargeTimeType.annualFee', value: 'Annual Fee' },
      };

      it('offers it on a recurring charge that is still active', () => {
        expect(component.canInactivate(ANNUAL)).toBe(true);
      });

      it('withdraws it once the charge is inactive', () => {
        // `isActive` is absent from the generated response type and present in the payload —
        // measured, and pinned in `e2e/charge-servicing-backend.spec.ts`.
        expect(component.canInactivate({ ...ANNUAL, isActive: false })).toBe(false);
      });

      it('does not offer it on a charge that does not recur', () => {
        // Measured: `charge.inactivation.allowed.only.for.recurring.charges`. A
        // specified-due-date fee is most of them, so gating on the active flag alone would put
        // a button that can only fail on nearly every row.
        expect(component.canInactivate(OUTSTANDING)).toBe(false);
      });

      it('treats a missing active flag as active, keeping a working control', () => {
        const { isActive, ...withoutFlag } = ANNUAL;
        expect(isActive).toBe(true);
        expect(component.canInactivate(withoutFlag)).toBe(true);
      });
    });

    it('posts nothing when a dialog is dismissed', async () => {
      dialogService.prompt.mockResolvedValue(undefined);
      dialogService.confirm.mockResolvedValue(false);

      await component.onPay(OUTSTANDING);
      await component.onWaive(OUTSTANDING);
      await component.onInactivate(OUTSTANDING);

      expect(
        serviceSpy.postSavingsaccountsSavingsAccountIdChargesSavingsAccountChargeId,
      ).not.toHaveBeenCalled();
    });

    it('reloads and reports, or reports the failure', async () => {
      await component.onWaive(OUTSTANDING);
      expect(serviceSpy.getSavingsaccountsSavingsAccountIdCharges).toHaveBeenCalledTimes(2);
      expect(notifications.success).toHaveBeenCalled();

      serviceSpy.postSavingsaccountsSavingsAccountIdChargesSavingsAccountChargeId.mockReturnValue(
        throwError(() => new Error('403')) as unknown as ReturnType<
          SavingsChargesService['postSavingsaccountsSavingsAccountIdChargesSavingsAccountChargeId']
        >,
      );
      await component.onWaive(OUTSTANDING);
      expect(notifications.error).toHaveBeenCalled();
    });

    it('gates each action on its own code, never on UPDATE_SAVINGSACCOUNT', () => {
      // The list's own create button still declares UPDATE_SAVINGSACCOUNT, which is a separate
      // question; measured, that code authorises none of these three commands.
      expect(component.permissions.paycharge).toBe('PAY_SAVINGSACCOUNTCHARGE');
      expect(component.permissions.waive).toBe('WAIVE_SAVINGSACCOUNTCHARGE');
      expect(component.permissions.inactivate).toBe('INACTIVATE_SAVINGSACCOUNTCHARGE');
      expect(Object.values(component.permissions)).not.toContain('UPDATE_SAVINGSACCOUNT');
    });
  });
});
