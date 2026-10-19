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
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { provideNoopAnimations } from '@angular/platform-browser/animations';

import { RecurringDepositsListComponent } from './recurring-deposits-list.component';
import { DEPOSIT_ACCOUNT_API } from '../../../core/adapters';
import { mapDepositAccount } from '../../../core/adapters/api/fineract-deposit-account.api';
import { createSpyObj, SpyObj } from '../../../testing/mocks';
import { provideTranslateTesting } from '../../../testing/i18n-testing';

/**
 * A row as `GET /recurringdepositaccounts` really answers it, measured against a running
 * Fineract on an active account.
 *
 * `recurringDepositAmount` — which this screen's Amount column rendered — is not a field of
 * this response. What it sends is `mandatoryRecommendedDepositAmount`, the sum collected each
 * period, so the column was empty on every row.
 */
const ACTIVE_ACCOUNT = {
  id: 119,
  accountNo: '000000119',
  clientId: 1,
  clientName: 'Tester',
  depositProductId: 3,
  depositProductName: 'RD monthly',
  mandatoryRecommendedDepositAmount: 500,
  depositAmount: 6000,
  maturityAmount: 6165.05,
  currency: { code: 'USD', displaySymbol: '$' },
  status: {
    id: 300,
    code: 'savingsAccountStatusType.active',
    value: 'Active',
    submittedAndPendingApproval: false,
    approved: false,
    active: true,
  },
};

const PENDING_ACCOUNT = {
  ...ACTIVE_ACCOUNT,
  id: 120,
  status: {
    id: 100,
    code: 'savingsAccountStatusType.submittedAndPendingApproval',
    value: 'Submitted and pending approval',
    submittedAndPendingApproval: true,
    approved: false,
    active: false,
  },
};

describe('RecurringDepositsListComponent', () => {
  let component: RecurringDepositsListComponent;
  let fixture: ComponentFixture<RecurringDepositsListComponent>;
  let deposits: Record<string, ReturnType<typeof vi.fn>>;
  let routerSpy: SpyObj<Router>;

  async function setup(payloads: object[] = [ACTIVE_ACCOUNT]): Promise<void> {
    TestBed.resetTestingModule();
    deposits = { list: vi.fn().mockReturnValue(of(payloads.map(mapDepositAccount))) };
    routerSpy = createSpyObj(['navigate']);

    await TestBed.configureTestingModule({
      imports: [RecurringDepositsListComponent],
      providers: [
        ...provideTranslateTesting(),
        provideNoopAnimations(),
        { provide: DEPOSIT_ACCOUNT_API, useValue: deposits },
        { provide: Router, useValue: routerSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RecurringDepositsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  it('asks the adapter for the recurring deposit accounts', async () => {
    await setup();

    expect(deposits['list']).toHaveBeenCalledWith('recurring');
    expect(component.accounts()).toHaveLength(1);
  });

  it('shows the amount collected each period, which the response does send', async () => {
    await setup();

    expect(component.accounts()[0].recurringDepositAmount).toBe(500);
    expect((fixture.nativeElement as HTMLElement).textContent).toContain('500');
  });

  it('offers Approve only on a pending account', async () => {
    await setup([PENDING_ACCOUNT]);
    expect(approveButtons()).toHaveLength(1);

    await setup([ACTIVE_ACCOUNT]);
    expect(approveButtons()).toHaveLength(0);
  });

  it('empties the list when the read fails', async () => {
    await setup();
    deposits['list'].mockReturnValue(throwError(() => new Error('API Error')));

    component.ngOnInit();

    expect(component.accounts()).toEqual([]);
  });

  it('navigates to create, edit and approve', async () => {
    await setup();
    const [account] = component.accounts();

    component.onCreateAccount();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/products/recurring-deposits/create']);

    component.onEditAccount(account);
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/products/recurring-deposits/edit', 119]);

    component.onApprove(account);
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/products/recurring/119/action/approve']);
  });

  /** The Approve action, found by its accessible name — which under test is the key. */
  function approveButtons(): Element[] {
    return Array.from(
      (fixture.nativeElement as HTMLElement).querySelectorAll('[aria-label="LOANS.APPROVE"]'),
    );
  }
});
