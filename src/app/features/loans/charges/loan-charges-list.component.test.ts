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
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { provideNoopAnimations } from '@angular/platform-browser/animations';

import { LoanChargesListComponent } from './loan-charges-list.component';
import { DialogService } from '../../../core/services/dialog.service';
import { NotificationService } from '../../../core/services/notification.service';
import { provideTranslateTesting } from '../../../testing/i18n-testing';

/**
 * #754. A loan charge could be added or deleted and nothing else: no pay, no waive, no
 * adjustment. Deletion is refused once the charge has been paid or partly paid, and it leaves
 * no record that a fee was forgiven — so a wrongly applied charge had no honest remedy.
 *
 * Every body below was measured against a running Fineract rather than inferred, because the
 * three commands take three different shapes on the same endpoint: `pay` wants a
 * `transactionDate`, `adjustment` wants an `amount`, and `waive` wants neither.
 *
 * Asserted through `HttpTestingController` rather than a spy on the generated service, for two
 * reasons. A new file may not import `src/app/api` (ADR 0006), and the request is the thing
 * worth pinning anyway: these commands differ from each other only by a query parameter whose
 * spelling is the platform's, so a test that sees the URL catches what a mocked method cannot.
 */
describe('LoanChargesListComponent', () => {
  let component: LoanChargesListComponent;
  let fixture: ComponentFixture<LoanChargesListComponent>;
  let http: HttpTestingController;
  let dialogService: SpyObj<DialogService>;
  let notifications: SpyObj<NotificationService>;

  /**
   * A partly paid charge in the account-transfer payment mode, which is the only mode the
   * platform will accept a payment for — so this is the one row that offers all three actions.
   */
  const OUTSTANDING = {
    id: 5,
    name: 'Late Payment Penalty',
    amount: 100,
    amountOutstanding: 60,
    amountPaid: 40,
    paid: false,
    chargePayable: true,
  };

  /** The charge list request, answered with one partly paid charge. */
  function flushLoad(charges: unknown[] = [OUTSTANDING]): void {
    http
      .expectOne((request) => request.method === 'GET' && request.url.endsWith('/loans/7/charges'))
      .flush(charges);
  }

  /** The one command request in flight, by the `command` parameter it carries. */
  function expectCommand(command: string) {
    return http.expectOne(
      (request) =>
        request.method === 'POST' &&
        request.url.endsWith('/loans/7/charges/5') &&
        request.params.get('command') === command,
    );
  }

  beforeEach(async () => {
    dialogService = createSpyObj(['confirm', 'prompt']);
    dialogService.confirm.mockResolvedValue(true);
    notifications = createSpyObj(['success', 'error']);

    await TestBed.configureTestingModule({
      imports: [LoanChargesListComponent],
      providers: [
        ...provideTranslateTesting(),
        provideNoopAnimations(),
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: DialogService, useValue: dialogService },
        { provide: NotificationService, useValue: notifications },
        { provide: Router, useValue: createSpyObj<Router>(['navigate']) },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: convertToParamMap({ loanId: '7' }) } },
        },
      ],
    }).compileComponents();

    http = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(LoanChargesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    flushLoad();
  });

  afterEach(() => {
    http.verify();
  });

  it('loads the loan charges on init', () => {
    expect(component.charges()).toHaveLength(1);
  });

  describe('which rows offer servicing', () => {
    it('offers the actions on a partly paid charge', () => {
      // The interesting case, and the one `paid` gets wrong: 40 of 100 is collected, so the
      // charge is neither paid nor settled — and it is exactly the one worth waiving.
      expect(component.isOutstanding(OUTSTANDING)).toBe(true);
    });

    it('withdraws them once nothing is outstanding', () => {
      expect(component.isOutstanding({ id: 6, amountOutstanding: 0 })).toBe(false);
    });

    it('treats a charge with no outstanding field as settled', () => {
      // Offering a payment the platform refuses is the worse of the two failures.
      expect(component.isOutstanding({ id: 7 })).toBe(false);
    });

    it('offers Pay only on a charge the platform says is payable', () => {
      // Measured: a charge whose payment mode is not account transfer is refused with
      // `validation.msg.domain.rule.violation` — "This loan charge cannot be paid as the charge
      // payment mode is not account transfer". Most charges are the regular mode, so gating Pay
      // on the outstanding amount alone would put a button that can only fail on nearly every
      // row. `chargePayable` is the platform's own answer, so it is the one asked.
      expect(component.isPayable(OUTSTANDING)).toBe(true);
      expect(component.isPayable({ ...OUTSTANDING, chargePayable: false })).toBe(false);
      // Absent, not false: an older payload that omits the flag is treated as not payable.
      expect(component.isPayable({ id: 8, amountOutstanding: 60 })).toBe(false);
    });

    it('still offers Waive and Adjustment on a charge that cannot be paid', () => {
      // The narrower rule is Pay's alone: a regular-mode charge is waivable and adjustable.
      const regular = { ...OUTSTANDING, chargePayable: false };

      expect(component.isPayable(regular)).toBe(false);
      expect(component.isOutstanding(regular)).toBe(true);
    });
  });

  describe('pay', () => {
    it('sends the date it collected, with the format the platform parses it against', async () => {
      // Measured: `validation.msg.loan.charge.payment.transaction.transactionDate.cannot.be.blank`
      // — the date is demanded, and Fineract parses it strictly against `dateFormat`.
      dialogService.prompt.mockResolvedValue({ transactionDate: '2026-10-02' });

      await component.onPay(OUTSTANDING);

      const request = expectCommand('pay');
      expect(request.request.body).toEqual({
        transactionDate: '2026-10-02',
        dateFormat: 'yyyy-MM-dd',
        locale: 'en',
      });
      request.flush({});
      flushLoad();
    });

    it('asks for the date and nothing else', async () => {
      // No amount: the platform pays the charge off and refuses a body that says otherwise.
      dialogService.prompt.mockResolvedValue({ transactionDate: '2026-10-02' });

      await component.onPay(OUTSTANDING);

      const fields = dialogService.prompt.mock.calls[0][0].fields ?? [];
      expect(fields.map((field) => field.name)).toEqual(['transactionDate']);
      expectCommand('pay').flush({});
      flushLoad();
    });

    it('posts nothing when dismissed', async () => {
      dialogService.prompt.mockResolvedValue(undefined);

      await component.onPay(OUTSTANDING);

      http.expectNone(() => true);
    });
  });

  describe('waive', () => {
    it('sends an empty body after a destructive confirmation', async () => {
      await component.onWaive(OUTSTANDING);

      expect(dialogService.confirm).toHaveBeenCalledWith(
        expect.objectContaining({ destructive: true }),
      );
      const request = expectCommand('waive');
      expect(request.request.body).toEqual({});
      request.flush({});
      flushLoad();
    });

    it('does not waive when declined', async () => {
      dialogService.confirm.mockResolvedValue(false);

      await component.onWaive(OUTSTANDING);

      http.expectNone(() => true);
    });
  });

  describe('adjustment', () => {
    it('sends the amount and literally nothing else', async () => {
      // Not even `locale` and `dateFormat`, which every other command here requires: this one
      // rejects parameters it does not support, and answers 400 for both. Measured.
      dialogService.prompt.mockResolvedValue({ amount: 25 });

      await component.onAdjust(OUTSTANDING);

      const request = expectCommand('adjustment');
      expect(request.request.body).toEqual({ amount: 25 });
      request.flush({});
      flushLoad();
    });

    it('offers the outstanding balance rather than the original amount', async () => {
      dialogService.prompt.mockResolvedValue({ amount: 60 });

      await component.onAdjust(OUTSTANDING);

      const fields = dialogService.prompt.mock.calls[0][0].fields ?? [];
      expect(fields.find((field) => field.name === 'amount')?.value).toBe(60);
      expectCommand('adjustment').flush({});
      flushLoad();
    });
  });

  describe('after a command', () => {
    it('reloads, so the row stops offering what the platform has just refused', async () => {
      await component.onWaive(OUTSTANDING);
      expectCommand('waive').flush({});

      // The reload is the assertion: `flushLoad` fails if no second GET was issued.
      flushLoad([{ ...OUTSTANDING, amountOutstanding: 0 }]);
      expect(notifications.success).toHaveBeenCalled();
      expect(component.isOutstanding(component.charges()[0])).toBe(false);
    });

    it('says so when the command fails, rather than leaving the row looking unchanged', async () => {
      await component.onWaive(OUTSTANDING);

      expectCommand('waive').flush(
        { errors: [{ userMessageGlobalisationCode: 'error.msg.not.authorized' }] },
        { status: 403, statusText: 'Forbidden' },
      );

      expect(notifications.error).toHaveBeenCalled();
      // No reload: there is nothing new to show, and a second GET would hide the failure.
      http.expectNone((request) => request.method === 'GET');
    });
  });

  it('gates each action on its own code, never on UPDATE_LOAN', () => {
    // Measured for all three: UPDATE_LOAN authorises none of them. This is #691's defect one
    // layer down — the portfolio write code does not carry the charge operations.
    expect(component.permissions.pay).toBe('PAY_LOANCHARGE');
    expect(component.permissions.waive).toBe('WAIVE_LOANCHARGE');
    expect(component.permissions.adjustment).toBe('ADJUSTMENT_LOANCHARGE');
    expect(Object.values(component.permissions)).not.toContain('UPDATE_LOAN');
  });
});
