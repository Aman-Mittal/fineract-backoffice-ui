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
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { provideNoopAnimations } from '@angular/platform-browser/animations';

import { RecurringDepositTransactionFormComponent } from './recurring-deposit-transaction-form.component';
import { DEPOSIT_ACCOUNT_API } from '../../../core/adapters';
import { provideTranslateTesting } from '../../../testing/i18n-testing';
import { FakeOverlayAdapter, provideFakeAdapters } from '../../../testing/adapters';

describe('RecurringDepositTransactionFormComponent', () => {
  let component: RecurringDepositTransactionFormComponent;
  let fixture: ComponentFixture<RecurringDepositTransactionFormComponent>;
  let deposits: Record<string, ReturnType<typeof vi.fn>>;
  let routerSpy: SpyObj<Router>;
  let overlay: FakeOverlayAdapter;
  let commandParam: 'deposit' | 'withdrawal';

  beforeEach(async () => {
    const fakes = provideFakeAdapters();
    overlay = fakes.overlay;
    commandParam = 'deposit';
    deposits = {
      transactionTemplate: vi.fn().mockReturnValue(
        of({
          paymentTypes: [
            { id: 1, name: 'Money Transfer' },
            { id: 2, name: 'Cash' },
          ],
        }),
      ),
      postTransaction: vi.fn().mockReturnValue(of({ resourceId: 308 })),
    };
    routerSpy = createSpyObj(['navigate']);

    await TestBed.configureTestingModule({
      imports: [RecurringDepositTransactionFormComponent],
      providers: [
        ...fakes.providers,
        ...provideTranslateTesting(),
        { provide: DEPOSIT_ACCOUNT_API, useValue: deposits },
        { provide: Router, useValue: routerSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: (key: string) => (key === 'accountId' ? '1' : commandParam),
              },
            },
          },
        },
        provideNoopAnimations(),
      ],
    }).compileComponents();
  });

  function createComponent(): void {
    fixture = TestBed.createComponent(RecurringDepositTransactionFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  /**
   * The command is part of the template request, not an optional extra: measured against a
   * running Fineract, `GET /recurringdepositaccounts/{id}/transactions/template` answers `400`
   * `error.msg.query.parameter.value.unsupported` without one, so this list was empty on every
   * load while the call omitted it.
   */
  it('asks for the template of the command it is posting', () => {
    createComponent();

    expect(deposits['transactionTemplate']).toHaveBeenCalledWith('recurring', 1, 'deposit');
    expect(component.paymentTypeOptions()).toHaveLength(2);
  });

  it('asks for the withdrawal template when that is the command', () => {
    commandParam = 'withdrawal';

    createComponent();

    expect(deposits['transactionTemplate']).toHaveBeenCalledWith('recurring', 1, 'withdrawal');
  });

  /** The generated model types these as `Array<number>`; the platform sends objects. */
  it('renders each payment channel by name, not as an object', () => {
    createComponent();

    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(text).toContain('Money Transfer');
    expect(text).not.toContain('[object Object]');
  });

  it('posts a deposit and returns to the account', () => {
    createComponent();
    component.transactionAmount = 500;
    component.paymentTypeId = 1;

    component.onSubmit();

    expect(deposits['postTransaction']).toHaveBeenCalledWith(
      'recurring',
      1,
      'deposit',
      expect.objectContaining({ transactionAmount: 500, paymentTypeId: 1 }),
    );
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/products/recurring-deposits/view', 1]);
    expect(overlay.lastToast?.message).toBe('SAVINGS.TRANSACTION_SUCCESS');
  });

  it('posts a withdrawal when that is the route', () => {
    commandParam = 'withdrawal';
    createComponent();
    component.transactionAmount = 200;

    component.onSubmit();

    expect(component.command()).toBe('withdrawal');
    expect(deposits['postTransaction']).toHaveBeenCalledWith(
      'recurring',
      1,
      'withdrawal',
      expect.objectContaining({ transactionAmount: 200 }),
    );
  });

  it('re-enables the form when the post fails', () => {
    createComponent();
    deposits['postTransaction'].mockReturnValue(throwError(() => new Error('rejected')));
    component.transactionAmount = 100;

    component.onSubmit();

    expect(component.isSaving()).toBe(false);
    expect(routerSpy.navigate).not.toHaveBeenCalled();
  });
});
