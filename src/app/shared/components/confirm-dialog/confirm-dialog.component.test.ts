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

import { ConfirmDialogComponent } from './confirm-dialog.component';
import type { ConfirmDialogData } from './confirm-dialog.component';
import { provideTranslateTesting } from '../../../testing/i18n-testing';
import { provideIonicTesting } from '../../../testing/ionic-testing';

/**
 * The confirm dialog's optional fields (#754).
 *
 * It had none until the charge servicing needed them: pay, waive and adjust are issued from
 * list rows, and two of the three need a value first. Putting them here rather than in six
 * dialogs of their own is explained on `ConfirmDialogData.fields` — in short, ADR 0005 forbids
 * a new file importing Ionic and `src/app/ui` has no form primitive yet (#287, #684).
 *
 * What matters is that adding fields did not change what a plain confirmation resolves to:
 * `DialogService.confirm` still reads `=== true`.
 */
describe('ConfirmDialogComponent', () => {
  let fixture: ComponentFixture<ConfirmDialogComponent>;
  let component: ConfirmDialogComponent;
  let dismissed: unknown;

  async function setup(data: Partial<ConfirmDialogData> = {}): Promise<void> {
    await TestBed.configureTestingModule({
      imports: [ConfirmDialogComponent],
      providers: [...provideTranslateTesting(), provideIonicTesting(), provideNoopAnimations()],
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmDialogComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('data', { title: 'T', message: 'M', ...data });
    fixture.detectChanges();
    await fixture.whenStable();

    dismissed = undefined;
    const modal = component as unknown as { modalController: { dismiss(value: unknown): void } };
    modal.modalController = { dismiss: (value: unknown) => (dismissed = value) };
  }

  const AMOUNT_AND_DATE: ConfirmDialogData['fields'] = [
    { name: 'amount', label: 'Amount', type: 'number', value: 60 },
    { name: 'transactionDate', label: 'Date', type: 'date', value: '2026-10-02' },
  ];

  describe('without fields', () => {
    it('still dismisses with a boolean, which is what confirm() reads', async () => {
      await setup();

      component.dismiss(true);

      expect(dismissed).toBe(true);
    });

    it('dismisses false on cancel', async () => {
      await setup();

      component.dismiss(false);

      expect(dismissed).toBe(false);
    });

    it('renders no field inputs', async () => {
      await setup();

      expect(fixture.nativeElement.querySelectorAll('ion-input')).toHaveLength(0);
      expect(component.isComplete()).toBe(true);
    });
  });

  describe('with fields', () => {
    it('renders one input per field, each addressable in a test', async () => {
      await setup({ fields: AMOUNT_AND_DATE });

      expect(
        fixture.nativeElement.querySelector('[data-testid="dialog-field-amount"]'),
      ).not.toBeNull();
      expect(
        fixture.nativeElement.querySelector('[data-testid="dialog-field-transactionDate"]'),
      ).not.toBeNull();
    });

    it('seeds each value from the field, so an unedited submit sends the default', async () => {
      await setup({ fields: AMOUNT_AND_DATE });

      expect(component.values()).toEqual({ amount: 60, transactionDate: '2026-10-02' });
    });

    it('dismisses with the values rather than with true', async () => {
      await setup({ fields: AMOUNT_AND_DATE });
      component.setValue('amount', 25);

      component.dismiss(true);

      expect(dismissed).toEqual({ amount: 25, transactionDate: '2026-10-02' });
    });

    it('dismisses false on cancel even with fields, so a caller cannot read a blank answer', async () => {
      await setup({ fields: AMOUNT_AND_DATE });

      component.dismiss(false);

      expect(dismissed).toBe(false);
    });

    it('keeps an edited value rather than re-seeding it', async () => {
      await setup({ fields: AMOUNT_AND_DATE });
      component.setValue('amount', 25);

      fixture.detectChanges();
      await fixture.whenStable();

      expect(component.values()['amount']).toBe(25);
    });

    it('refuses to confirm while a required field is blank', async () => {
      // Checked here rather than left to the platform: the alternative is a round-trip that
      // answers `validation.msg....cannot.be.blank` as a toast, which is #753's complaint.
      await setup({ fields: [{ name: 'amount', label: 'Amount', type: 'number' }] });

      expect(component.isComplete()).toBe(false);

      component.setValue('amount', 10);

      expect(component.isComplete()).toBe(true);
    });

    it('treats whitespace as blank', async () => {
      await setup({ fields: [{ name: 'note', label: 'Note', type: 'text' }] });
      component.setValue('note', ' '.repeat(3));

      expect(component.isComplete()).toBe(false);
    });

    it('does not hold up a confirmation on an optional field', async () => {
      await setup({ fields: [{ name: 'note', label: 'Note', type: 'text', optional: true }] });

      expect(component.isComplete()).toBe(true);
    });

    it('disables the confirm button while a required field is blank', async () => {
      await setup({ fields: [{ name: 'amount', label: 'Amount', type: 'number' }] });

      const confirm = fixture.nativeElement.querySelector('[data-testid="confirm-dialog-confirm"]');
      expect(confirm.disabled).toBe(true);
    });
  });
});
