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
import { ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { of, throwError } from 'rxjs';

import { FixedDepositTransactionFormComponent } from './fixed-deposit-transaction-form.component';
import { DEPOSIT_ACCOUNT_API } from '../../../core/adapters';
import { provideIonicTesting } from '../../../testing/ionic-testing';
import { provideTranslateTesting } from '../../../testing/i18n-testing';

describe('FixedDepositTransactionFormComponent', () => {
  let component: FixedDepositTransactionFormComponent;
  let fixture: ComponentFixture<FixedDepositTransactionFormComponent>;
  let deposits: Record<string, ReturnType<typeof vi.fn>>;
  let routerSpy: SpyObj<Router>;

  beforeEach(async () => {
    deposits = {
      transactionTemplate: vi.fn().mockReturnValue(
        of({
          paymentTypes: [
            { id: 1, name: 'Money Transfer' },
            { id: 2, name: 'Cash' },
          ],
        }),
      ),
      postTransaction: vi.fn().mockReturnValue(of({ resourceId: 307 })),
    };
    routerSpy = createSpyObj(['navigate']);

    await TestBed.configureTestingModule({
      imports: [FixedDepositTransactionFormComponent],
      providers: [
        provideNoopAnimations(),
        provideIonicTesting(),
        ...provideTranslateTesting(),
        { provide: DEPOSIT_ACCOUNT_API, useValue: deposits },
        { provide: Router, useValue: routerSpy },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: convertToParamMap({ accountId: '7' }) } },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FixedDepositTransactionFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('asks for the deposit template of this account', () => {
    expect(deposits['transactionTemplate']).toHaveBeenCalledWith('fixed', 7, 'deposit');
    expect(component.paymentTypeOptions()).toEqual([
      { id: 1, name: 'Money Transfer' },
      { id: 2, name: 'Cash' },
    ]);
  });

  it('renders each payment channel by name, not as an object', () => {
    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(text).toContain('Money Transfer');
    expect(text).not.toContain('[object Object]');
  });

  /**
   * `paymentTypeId` is not in the documented request and the platform accepts it anyway —
   * measured, it comes back under `changes` — so dropping it would quietly lose the teller's
   * choice of payment channel. How the request is carried is the adapter's business; this only
   * pins what the screen sends.
   */
  it('sends the date, the amount and the chosen payment channel', () => {
    component.transactionAmount = 500;
    component.paymentTypeId = 2;
    component.transactionDate = '2026-08-09';

    component.onSubmit();

    expect(deposits['postTransaction']).toHaveBeenCalledWith(
      'fixed',
      7,
      'deposit',
      expect.objectContaining({
        transactionAmount: 500,
        paymentTypeId: 2,
        transactionDate: '09 August 2026',
      }),
    );
  });

  it('returns to the account once the deposit is recorded', () => {
    component.transactionAmount = 100;

    component.onSubmit();

    expect(routerSpy.navigate).toHaveBeenCalledWith(['/products/fixed-deposits/view', 7]);
  });

  it('re-enables the form when the post fails', () => {
    deposits['postTransaction'].mockReturnValue(throwError(() => new Error('rejected')));
    component.transactionAmount = 100;

    component.onSubmit();

    expect(component.isSaving()).toBe(false);
    expect(routerSpy.navigate).not.toHaveBeenCalled();
  });

  it('shows no payment channels when the template read fails', async () => {
    deposits['transactionTemplate'].mockReturnValue(throwError(() => new Error('failed')));

    component.ngOnInit();

    expect(component.paymentTypeOptions()).toEqual([]);
  });
});
