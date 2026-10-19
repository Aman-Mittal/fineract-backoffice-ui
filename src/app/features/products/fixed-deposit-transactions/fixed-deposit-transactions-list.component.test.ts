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
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { of, throwError } from 'rxjs';
import { provideNoopAnimations } from '@angular/platform-browser/animations';

import { FixedDepositTransactionsListComponent } from './fixed-deposit-transactions-list.component';
import { DEPOSIT_ACCOUNT_API } from '../../../core/adapters';
import { mapDepositTransaction } from '../../../core/adapters/api/fineract-deposit-account.api';
import { provideTranslateTesting } from '../../../testing/i18n-testing';

/**
 * One row as `GET /fixeddepositaccounts/{id}/transactions` really answers it, measured against a
 * running Fineract: the date is `[year, month, day]`, and the type carries both a dotted `code`
 * and a human `value`. The fixture that used to stand here said `date: '01 January 2024'` and
 * gave the type only a `code`, so it could not have caught either of the two defects this screen
 * had — a date rendered "2026,10,18" and a type rendered
 * "savingsAccountTransactionType.payCharge".
 */
const PAY_CHARGE_ROW = {
  id: 209,
  date: [2026, 10, 18],
  amount: 25,
  entryType: 'DEBIT',
  reversed: false,
  runningBalance: 975,
  transactionType: {
    id: 7,
    code: 'savingsAccountTransactionType.payCharge',
    value: 'Pay Charge',
  },
  currency: { code: 'USD', displaySymbol: '$' },
};

describe('FixedDepositTransactionsListComponent', () => {
  let component: FixedDepositTransactionsListComponent;
  let fixture: ComponentFixture<FixedDepositTransactionsListComponent>;
  let deposits: Record<string, ReturnType<typeof vi.fn>>;

  async function setup(rows: object[] = [PAY_CHARGE_ROW]): Promise<void> {
    TestBed.resetTestingModule();
    deposits = {
      // Mapped by the adapter's own mapper rather than by a copy of it written for this test,
      // so the component is exercised against the shape the adapter really produces.
      transactions: vi.fn().mockReturnValue(of(rows.map(mapDepositTransaction))),
    };

    await TestBed.configureTestingModule({
      imports: [FixedDepositTransactionsListComponent],
      providers: [
        ...provideTranslateTesting(),
        provideNoopAnimations(),
        { provide: DEPOSIT_ACCOUNT_API, useValue: deposits },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: convertToParamMap({ accountId: '41' }) } },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FixedDepositTransactionsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  it('asks the adapter for the transactions of this account', async () => {
    await setup();

    expect(deposits['transactions']).toHaveBeenCalledWith('fixed', 41);
    expect(component.transactions()).toHaveLength(1);
  });

  it('renders the date as a date and the type as its label, not as the wire', async () => {
    await setup();

    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(text).toContain('Pay Charge');
    expect(text).not.toContain('savingsAccountTransactionType');
    // Whatever the runner's locale, a rendered date is not the array literal.
    expect(text).not.toContain('2026,10,18');
    expect(component.transactions()[0].date).toBe('2026-10-18');
  });

  it('shows the amount with its currency symbol and two decimals', async () => {
    await setup();

    expect((fixture.nativeElement as HTMLElement).textContent).toContain('$ 25.00');
  });

  it('empties the list when the read fails', async () => {
    await setup();
    deposits['transactions'].mockReturnValue(throwError(() => new Error('failed')));

    component.load();

    expect(component.transactions()).toEqual([]);
  });
});
