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
import { ClientChargesListComponent } from './client-charges-list.component';
import { ClientChargesService } from '../../../api';
import { ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { of, throwError } from 'rxjs';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { DialogService } from '../../../core/services/dialog.service';
import { NotificationService } from '../../../core/services/notification.service';
import { provideTranslateTesting } from '../../../testing/i18n-testing';

describe('ClientChargesListComponent', () => {
  let component: ClientChargesListComponent;
  let fixture: ComponentFixture<ClientChargesListComponent>;
  let serviceSpy: SpyObj<ClientChargesService>;
  let routerSpy: SpyObj<Router>;
  let dialogService: SpyObj<DialogService>;
  let notifications: SpyObj<NotificationService>;

  beforeEach(async () => {
    serviceSpy = createSpyObj([
      'getClientsClientIdCharges',
      'deleteClientsClientIdChargesChargeId',
      'postClientsClientIdChargesChargeId',
    ]);
    routerSpy = createSpyObj(['navigate']);
    dialogService = createSpyObj(['confirm', 'prompt']);
    dialogService.confirm.mockResolvedValue(true);
    notifications = createSpyObj(['success', 'error']);
    serviceSpy.getClientsClientIdCharges.mockReturnValue(
      of({
        pageItems: [{ id: 1, name: 'Fee', amount: 100 }],
      }) as unknown as ReturnType<ClientChargesService['getClientsClientIdCharges']>,
    );

    await TestBed.configureTestingModule({
      imports: [ClientChargesListComponent],
      providers: [
        ...provideTranslateTesting(),
        { provide: ClientChargesService, useValue: serviceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: DialogService, useValue: dialogService },
        { provide: NotificationService, useValue: notifications },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: convertToParamMap({ clientId: '1' }) } },
        },
        provideNoopAnimations(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ClientChargesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should load client charges on init', () => {
    expect(component).toBeTruthy();
    expect(serviceSpy.getClientsClientIdCharges).toHaveBeenCalledWith(1);
    expect(component.charges()).toHaveLength(1);
  });

  it('should delete after confirmation and reload', async () => {
    serviceSpy.deleteClientsClientIdChargesChargeId.mockReturnValue(
      of({}) as unknown as ReturnType<ClientChargesService['deleteClientsClientIdChargesChargeId']>,
    );

    component.onDelete({ id: 5, name: 'X' });
    await fixture.whenStable();

    expect(serviceSpy.deleteClientsClientIdChargesChargeId).toHaveBeenCalledWith(1, 5);
    expect(serviceSpy.getClientsClientIdCharges).toHaveBeenCalledTimes(2);
  });

  it('should not delete when cancelled', async () => {
    dialogService.confirm.mockResolvedValue(false);
    component.onDelete({ id: 5, name: 'X' });
    await fixture.whenStable();
    expect(serviceSpy.deleteClientsClientIdChargesChargeId).not.toHaveBeenCalled();
  });

  it('sets hasError to true when loading client charges fails', () => {
    serviceSpy.getClientsClientIdCharges.mockReturnValue(
      throwError(() => new Error('Network error')) as unknown as ReturnType<
        ClientChargesService['getClientsClientIdCharges']
      >,
    );
    const failedFixture = TestBed.createComponent(ClientChargesListComponent);
    failedFixture.detectChanges();

    expect(failedFixture.componentInstance.hasError()).toBe(true);
  });

  it('retries loading client charges and resets hasError on retry', () => {
    serviceSpy.getClientsClientIdCharges.mockReturnValue(
      throwError(() => new Error('Network error')) as unknown as ReturnType<
        ClientChargesService['getClientsClientIdCharges']
      >,
    );
    const failedFixture = TestBed.createComponent(ClientChargesListComponent);
    failedFixture.detectChanges();

    expect(failedFixture.componentInstance.hasError()).toBe(true);

    serviceSpy.getClientsClientIdCharges.mockReturnValue(
      of({
        pageItems: [{ id: 1, name: 'Fee', amount: 100 }],
      }) as unknown as ReturnType<ClientChargesService['getClientsClientIdCharges']>,
    );
    failedFixture.componentInstance.onRetry();

    expect(failedFixture.componentInstance.hasError()).toBe(false);
    expect(failedFixture.componentInstance.charges()).toHaveLength(1);
  });

  /**
   * #754. A client charge could be added and deleted but never paid or waived, so there was no
   * remedy for one applied in error — and a delete, where the platform allows it at all, leaves
   * no record that the fee was forgiven.
   *
   * The bodies here were measured, not inferred. `paycharge` is the platform's spelling (a loan
   * charge is paid with `pay`), and it demands `amount` and `transactionDate` together:
   * `validation.msg.CLIENTCHARGE.amount.cannot.be.blank`.
   */
  describe('paying and waiving', () => {
    const OUTSTANDING = { id: 5, name: 'Processing Fee', amount: 100, amountOutstanding: 40 };

    beforeEach(() => {
      serviceSpy.postClientsClientIdChargesChargeId.mockReturnValue(
        of({}) as unknown as ReturnType<ClientChargesService['postClientsClientIdChargesChargeId']>,
      );
    });

    it('offers the actions only while something is outstanding', () => {
      expect(component.isOutstanding(OUTSTANDING)).toBe(true);
      expect(component.isOutstanding({ id: 6, amountOutstanding: 0 })).toBe(false);
      // A charge whose outstanding the payload omits is treated as settled rather than as
      // unknown: offering a payment that answers 403 is the worse of the two failures.
      expect(component.isOutstanding({ id: 7 })).toBe(false);
    });

    it('pays with the amount and date it collected, under the platform spelling', async () => {
      dialogService.prompt.mockResolvedValue({ amount: 40, transactionDate: '2026-10-02' });

      await component.onPay(OUTSTANDING);

      expect(serviceSpy.postClientsClientIdChargesChargeId).toHaveBeenCalledWith(
        1,
        5,
        {
          amount: 40,
          transactionDate: '2026-10-02',
          dateFormat: 'yyyy-MM-dd',
          locale: 'en',
        },
        'paycharge',
      );
    });

    it('offers the outstanding balance as the amount, not the original charge', async () => {
      // 40 of a 100 charge is left; defaulting to 100 would overpay on an unedited submit.
      dialogService.prompt.mockResolvedValue({ amount: 40, transactionDate: '2026-10-02' });

      await component.onPay(OUTSTANDING);

      const fields = dialogService.prompt.mock.calls[0][0].fields ?? [];
      expect(fields.find((field) => field.name === 'amount')?.value).toBe(40);
    });

    it('asks for a date rather than assuming today', async () => {
      // The tenant's business date can be behind the browser's, which the platform rejects as
      // "in the future" — issue #758. An editable date is the user's way out of that.
      dialogService.prompt.mockResolvedValue({ amount: 40, transactionDate: '2026-10-02' });

      await component.onPay(OUTSTANDING);

      const fields = dialogService.prompt.mock.calls[0][0].fields ?? [];
      expect(fields.map((field) => field.name)).toEqual(['amount', 'transactionDate']);
      expect(fields.find((field) => field.name === 'transactionDate')?.type).toBe('date');
    });

    it('posts nothing when the payment dialog is dismissed', async () => {
      dialogService.prompt.mockResolvedValue(undefined);

      await component.onPay(OUTSTANDING);

      expect(serviceSpy.postClientsClientIdChargesChargeId).not.toHaveBeenCalled();
    });

    it('waives with an empty body, after a destructive confirmation', async () => {
      await component.onWaive(OUTSTANDING);

      expect(dialogService.confirm).toHaveBeenCalledWith(
        expect.objectContaining({ destructive: true }),
      );
      expect(serviceSpy.postClientsClientIdChargesChargeId).toHaveBeenCalledWith(1, 5, {}, 'waive');
    });

    it('does not waive when the confirmation is declined', async () => {
      dialogService.confirm.mockResolvedValue(false);

      await component.onWaive(OUTSTANDING);

      expect(serviceSpy.postClientsClientIdChargesChargeId).not.toHaveBeenCalled();
    });

    it('reloads the list after a command, so the row stops offering what it cannot do', async () => {
      await component.onWaive(OUTSTANDING);

      expect(serviceSpy.getClientsClientIdCharges).toHaveBeenCalledTimes(2);
      expect(notifications.success).toHaveBeenCalled();
    });

    it('says so when the platform refuses the command', async () => {
      serviceSpy.postClientsClientIdChargesChargeId.mockReturnValue(
        throwError(() => new Error('403')) as unknown as ReturnType<
          ClientChargesService['postClientsClientIdChargesChargeId']
        >,
      );

      await component.onWaive(OUTSTANDING);

      expect(notifications.error).toHaveBeenCalled();
    });

    it('gates each action on its own code, never on UPDATE_CLIENT', () => {
      // Measured: UPDATE_CLIENT authorises neither command. Falling back to it would admit
      // users the platform refuses and refuse users it would have allowed.
      expect(component.permissions.paycharge).toBe('PAY_CLIENTCHARGE');
      expect(component.permissions.waive).toBe('WAIVE_CLIENTCHARGE');
      expect(Object.values(component.permissions)).not.toContain('UPDATE_CLIENT');
    });
  });
});
