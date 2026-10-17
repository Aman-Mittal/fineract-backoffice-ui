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
import { provideNoopAnimations } from '@angular/platform-browser/animations';

import { of, throwError } from 'rxjs';
import { signal } from '@angular/core';

import { LOAN_TRANSACTION_API } from '../../core/adapters';
import { LoanChargebackDialogComponent } from './loan-chargeback-dialog.component';
import { LoanDisburseToSavingsDialogComponent } from './loan-disburse-to-savings-dialog.component';
import { LoanUnassignOfficerDialogComponent } from './loan-unassign-officer-dialog.component';
import { TransactionDetailDialogComponent } from './transaction-detail-dialog.component';
import { AuthService } from '../../core/services/auth.service';
import { DialogService } from '../../core/services/dialog.service';
import { provideFakeAdapters, FakeOverlayAdapter } from '../../testing/adapters';
import { provideIonicTesting } from '../../testing/ionic-testing';

const DISBURSEMENT_DATE = '2026-08-08';

describe('LoanDisburseToSavingsDialogComponent', () => {
  let fixture: ComponentFixture<LoanDisburseToSavingsDialogComponent>;
  let component: LoanDisburseToSavingsDialogComponent;
  let overlay: FakeOverlayAdapter;

  async function setup(amount?: number): Promise<void> {
    const adapters = provideFakeAdapters();
    overlay = adapters.overlay;

    await TestBed.configureTestingModule({
      imports: [LoanDisburseToSavingsDialogComponent],
      providers: [provideNoopAnimations(), ...adapters.providers],
    }).compileComponents();

    fixture = TestBed.createComponent(LoanDisburseToSavingsDialogComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('data', { amount });
    fixture.detectChanges();
    await fixture.whenStable();
  }

  it('offers the loan principal as the amount, without demanding it', async () => {
    await setup(1000);

    expect(component.amount()).toBe(1000);
    expect(component.isValid()).toBe(true);
  });

  it('refuses to submit an amount of zero', async () => {
    await setup(1000);
    component.amount.set(0);

    // A disbursement of nothing is not a disbursement, and the platform would reject it after
    // a round trip. Better to not send it.
    expect(component.isValid()).toBe(false);
    component.onConfirm();
    expect(overlay.dismissals).toEqual([]);
  });

  it('sends the date and amount, and omits an empty note', async () => {
    await setup(1000);
    component.disbursementDate.set(DISBURSEMENT_DATE);

    component.onConfirm();

    expect(overlay.dismissals).toEqual([
      { actualDisbursementDate: DISBURSEMENT_DATE, transactionAmount: 1000 },
    ]);
  });

  it('carries a note when one was written', async () => {
    await setup(500);
    component.disbursementDate.set(DISBURSEMENT_DATE);
    component.note.set('  paid into the group account  ');

    component.onConfirm();

    expect(overlay.dismissals).toEqual([
      {
        actualDisbursementDate: DISBURSEMENT_DATE,
        transactionAmount: 500,
        note: 'paid into the group account',
      },
    ]);
  });
});

describe('LoanUnassignOfficerDialogComponent', () => {
  let fixture: ComponentFixture<LoanUnassignOfficerDialogComponent>;
  let component: LoanUnassignOfficerDialogComponent;
  let overlay: FakeOverlayAdapter;

  beforeEach(async () => {
    const adapters = provideFakeAdapters();
    overlay = adapters.overlay;

    await TestBed.configureTestingModule({
      imports: [LoanUnassignOfficerDialogComponent],
      providers: [provideNoopAnimations(), ...adapters.providers],
    }).compileComponents();

    fixture = TestBed.createComponent(LoanUnassignOfficerDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('sends the date the officer stopped being responsible', () => {
    component.unassignedDate.set('2026-07-31');

    component.onConfirm();

    expect(overlay.dismissals).toEqual([{ unassignedDate: '2026-07-31' }]);
  });

  it('sends nothing when cancelled, so no command is issued', () => {
    component.onCancel();

    expect(overlay.dismissals).toEqual([undefined]);
  });

  it('will not submit without a date', () => {
    component.unassignedDate.set('');

    component.onConfirm();

    // The date is the substance of this command — it decides which officer the loan counts
    // against for the period — so there is no sensible default to fall back on.
    expect(overlay.dismissals).toEqual([]);
  });
});

describe('LoanChargebackDialogComponent', () => {
  let component: LoanChargebackDialogComponent;
  let overlay: FakeOverlayAdapter;

  // `PaymentTypeOption` as the adapter maps it: `codeName` is `null` on the types Fineract
  // does not define itself, which is how the real payload distinguishes them.
  const PAYMENT_TYPES = [
    { id: 1, name: 'Money Transfer', codeName: null, isSystemDefined: false },
    {
      id: 2,
      name: 'Repayment Adjustment Chargeback',
      codeName: 'REPAYMENT_ADJUSTMENT_CHARGEBACK',
      isSystemDefined: true,
    },
  ];

  const DEFAULT_TEMPLATE = { paymentTypeOptions: PAYMENT_TYPES };

  async function setup(template: unknown = DEFAULT_TEMPLATE): Promise<void> {
    const adapters = provideFakeAdapters();
    overlay = adapters.overlay;
    const transactions = {
      template: vi
        .fn()
        .mockReturnValue(template instanceof Error ? throwError(() => template) : of(template)),
    };

    await TestBed.configureTestingModule({
      imports: [LoanChargebackDialogComponent],
      providers: [
        provideNoopAnimations(),
        ...adapters.providers,
        { provide: LOAN_TRANSACTION_API, useValue: transactions },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(LoanChargebackDialogComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('data', { loanId: 21, transactionId: 43, amount: 100 });
    fixture.detectChanges();
    await fixture.whenStable();
  }

  it('offers the whole repayment as the amount, and the shipped chargeback payment type', async () => {
    await setup();

    expect(component.amount()).toBe(100);
    expect(component.paymentTypeId()).toBe(2);
  });

  it('sends the amount and payment type it was given', async () => {
    await setup();
    component.amount.set(40);

    component.onConfirm();

    expect(overlay.dismissals).toEqual([{ transactionAmount: 40, paymentTypeId: 2 }]);
  });

  it('omits the payment type when the deployment has none to offer', async () => {
    await setup({ paymentTypeOptions: [] });

    component.onConfirm();

    expect(overlay.dismissals).toEqual([{ transactionAmount: 100 }]);
  });

  it('still works when the payment types cannot be loaded', async () => {
    await setup(new Error('boom'));

    expect(component.isValid()).toBe(true);
  });

  it('refuses an amount above the repayment and says why', async () => {
    await setup();
    component.amount.set(100.01);

    component.onConfirm();

    expect(component.exceedsRepayment()).toBe(true);
    expect(component.isValid()).toBe(false);
    expect(overlay.dismissals).toEqual([]);
  });

  it('accepts exactly the repayment amount', async () => {
    await setup();
    component.amount.set(100);

    expect(component.exceedsRepayment()).toBe(false);
    expect(component.isValid()).toBe(true);
  });

  it('refuses an amount of zero', async () => {
    await setup();
    component.amount.set(0);

    component.onConfirm();

    expect(component.isValid()).toBe(false);
    expect(overlay.dismissals).toEqual([]);
  });

  it('sends nothing when cancelled, so no command is issued', async () => {
    await setup();

    component.onCancel();

    expect(overlay.dismissals).toEqual([undefined]);
  });
});

/**
 * The transaction detail dialog's three write paths.
 *
 * It has always offered the generic adjustment. #779 adds the two typed ones, where the command
 * and the permission change together, and #754 adds reversing a waived charge — which is a
 * `PUT` with an empty body rather than a command, on a code neither of the others carries.
 */
describe('TransactionDetailDialogComponent', () => {
  let component: TransactionDetailDialogComponent;
  let fixture: ComponentFixture<TransactionDetailDialogComponent>;
  let transactions: {
    get: ReturnType<typeof vi.fn>;
    adjust: ReturnType<typeof vi.fn>;
    undoWaiveCharge: ReturnType<typeof vi.fn>;
  };
  let dialogService: { confirm: ReturnType<typeof vi.fn> };

  const TRANSACTION = {
    id: 43,
    type: { id: 40, code: 'loanTransactionType.buyDownFee', displayName: 'Buy-down Fee' },
    date: '2026-10-02',
    amount: 300,
    principalPortion: 0,
    interestPortion: 0,
    feeChargesPortion: 0,
    penaltyChargesPortion: 0,
    manuallyReversed: false,
    receiptNumber: null,
  };

  async function setup(data: Record<string, unknown>): Promise<void> {
    const adapters = provideFakeAdapters();
    transactions = {
      get: vi.fn().mockReturnValue(of(TRANSACTION)),
      adjust: vi.fn().mockReturnValue(of(undefined)),
      undoWaiveCharge: vi.fn().mockReturnValue(of(undefined)),
    };
    dialogService = { confirm: vi.fn().mockResolvedValue(true) };

    const authService = {
      hasPermission: vi.fn().mockReturnValue(true),
      currentUser: signal({
        username: 'mifos',
        base64EncodedAuthenticationKey: 'key',
        authenticated: true,
        officeId: 1,
        officeName: 'Head Office',
        userId: 1,
        permissions: ['ALL_FUNCTIONS'],
      }),
    };

    await TestBed.configureTestingModule({
      imports: [TransactionDetailDialogComponent],
      providers: [
        provideNoopAnimations(),
        // The dialog dismisses itself through `ModalController`, which the fake adapters do not
        // stand in for: they replace the overlay the application opens dialogs *with*.
        provideIonicTesting(),
        ...adapters.providers,
        { provide: LOAN_TRANSACTION_API, useValue: transactions },
        { provide: DialogService, useValue: dialogService },
        { provide: AuthService, useValue: authService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TransactionDetailDialogComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('data', { loanId: 21, transactionId: 43, ...data });
    fixture.detectChanges();
    await fixture.whenStable();
  }

  const BUY_DOWN_FEE_ADJUSTMENT = {
    command: 'buyDownFeeAdjustment',
    permission: 'BUYDOWNFEEADJUSTMENT_LOAN',
    labelKey: 'LOANS.ACTIONS.ADJUST_BUY_DOWN_FEE',
    confirmKey: 'LOANS.CONFIRM_ADJUST_BUY_DOWN_FEE',
  };

  it('sends no command for the generic adjustment', async () => {
    await setup({ adjustable: true });
    component.showAdjustForm.set(true);
    component.adjustAmount.set(275);

    component.onConfirmAdjust();
    await fixture.whenStable();

    expect(transactions.adjust).toHaveBeenCalledWith(
      21,
      43,
      expect.objectContaining({ amount: 275 }),
      undefined,
    );
  });

  it('gates the generic adjustment on ADJUST_LOAN', async () => {
    await setup({ adjustable: true });

    expect(component.adjustPermission).toBe('ADJUST_LOAN');
  });

  it('sends the variant command and gates on the variant code', async () => {
    await setup({ adjustable: true, adjustment: BUY_DOWN_FEE_ADJUSTMENT });

    expect(component.adjustPermission).toBe('BUYDOWNFEEADJUSTMENT_LOAN');
    expect(component.adjustLabelKey).toBe('LOANS.ACTIONS.ADJUST_BUY_DOWN_FEE');

    component.showAdjustForm.set(true);
    component.onConfirmAdjust();
    await fixture.whenStable();

    expect(transactions.adjust).toHaveBeenCalledWith(
      21,
      43,
      expect.anything(),
      'buyDownFeeAdjustment',
    );
  });

  it("asks for confirmation in the variant's own words", async () => {
    // Generic wording in front of a deferred-income adjustment would describe the wrong
    // consequence: it moves recognised income rather than correcting a payment.
    await setup({ adjustable: true, adjustment: BUY_DOWN_FEE_ADJUSTMENT });
    component.showAdjustForm.set(true);

    component.onConfirmAdjust();
    await fixture.whenStable();

    expect(dialogService.confirm).toHaveBeenCalledWith(
      expect.objectContaining({ destructive: true }),
    );
  });

  it('posts nothing when the adjustment is declined', async () => {
    await setup({ adjustable: true, adjustment: BUY_DOWN_FEE_ADJUSTMENT });
    dialogService.confirm.mockResolvedValue(false);
    component.showAdjustForm.set(true);

    component.onConfirmAdjust();
    await fixture.whenStable();

    expect(transactions.adjust).not.toHaveBeenCalled();
  });

  it('offers no undo unless the caller says the waiver can be reversed', async () => {
    await setup({ adjustable: true });

    expect(
      fixture.nativeElement.querySelector('[data-testid="transaction-undo-waive-charge"]'),
    ).toBeNull();
  });

  it('reverses a waived charge with an empty body, after confirming', async () => {
    await setup({ adjustable: false, undoableWaiveCharge: true });

    expect(component.undoWaivePermission).toBe('UNDO_WAIVECHARGE');
    expect(
      fixture.nativeElement.querySelector('[data-testid="transaction-undo-waive-charge"]'),
    ).not.toBeNull();

    await component.onUndoWaiveCharge();

    expect(dialogService.confirm).toHaveBeenCalled();
    expect(transactions.undoWaiveCharge).toHaveBeenCalledWith(21, 43);
  });

  it('does not reverse a waiver that was not confirmed', async () => {
    await setup({ adjustable: false, undoableWaiveCharge: true });
    dialogService.confirm.mockResolvedValue(false);

    await component.onUndoWaiveCharge();

    expect(transactions.undoWaiveCharge).not.toHaveBeenCalled();
  });
});
