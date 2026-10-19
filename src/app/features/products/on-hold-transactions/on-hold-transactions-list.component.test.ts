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

import { OnHoldTransactionsListComponent } from './on-hold-transactions-list.component';
import { DEPOSIT_ACCOUNT_API } from '../../../core/adapters';
import { mapOnHoldTransaction } from '../../../core/adapters/api/fineract-deposit-account.api';
import { provideTranslateTesting } from '../../../testing/i18n-testing';

/**
 * One row as `GET /savingsaccounts/{id}/onholdtransactions` really answers it, measured against
 * a running Fineract with a hold in place.
 *
 * Note what is *not* here: `loanClientName`, which this screen rendered in its "reason" column.
 * The response carries `savingsClientName`, `savingsAccountNo` and `loanId` instead, so that
 * column was blank on every row — and the fixture that used to stand here invented the field,
 * which is why its test passed anyway.
 */
const HOLD_ROW = {
  id: 1,
  amount: 50,
  transactionType: { id: 1, code: 'deposutAccountOnHoldTransactionType.hold', value: 'hold' },
  transactionDate: [2026, 10, 19],
  reversed: false,
  savingsId: 112,
  savingsAccountNo: '000000112',
  savingsClientName: 'Tester',
  loanId: 0,
};

describe('OnHoldTransactionsListComponent', () => {
  let component: OnHoldTransactionsListComponent;
  let fixture: ComponentFixture<OnHoldTransactionsListComponent>;
  let deposits: Record<string, ReturnType<typeof vi.fn>>;

  async function setup(rows: object[] = [HOLD_ROW]): Promise<void> {
    TestBed.resetTestingModule();
    deposits = {
      onHoldTransactions: vi.fn().mockReturnValue(of(rows.map(mapOnHoldTransaction))),
    };

    await TestBed.configureTestingModule({
      imports: [OnHoldTransactionsListComponent],
      providers: [
        ...provideTranslateTesting(),
        provideNoopAnimations(),
        { provide: DEPOSIT_ACCOUNT_API, useValue: deposits },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: convertToParamMap({ savingsId: '112' }) } },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(OnHoldTransactionsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  it('asks the adapter for the holds on this savings account', async () => {
    await setup();

    expect(deposits['onHoldTransactions']).toHaveBeenCalledWith(112);
    expect(component.transactions()).toHaveLength(1);
  });

  it('renders the date as a date and the type as its label', async () => {
    await setup();

    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(text).toContain('hold');
    expect(text).not.toContain('deposutAccountOnHoldTransactionType');
    expect(text).not.toContain('2026,10,19');
    expect(component.transactions()[0].date).toBe('2026-10-19');
  });

  it('reads no loan as no loan rather than as loan 0', async () => {
    await setup();

    expect(component.transactions()[0].loanId).toBeNull();
    expect((fixture.nativeElement as HTMLElement).textContent).toContain('—');
  });

  it('carries the loan a guarantee holds the funds for', async () => {
    await setup([{ ...HOLD_ROW, loanId: 88 }]);

    expect(component.transactions()[0].loanId).toBe(88);
    expect((fixture.nativeElement as HTMLElement).textContent).toContain('88');
  });

  it('empties the list when the read fails', async () => {
    await setup();
    deposits['onHoldTransactions'].mockReturnValue(throwError(() => new Error('failed')));

    component.load();

    expect(component.transactions()).toEqual([]);
  });
});
