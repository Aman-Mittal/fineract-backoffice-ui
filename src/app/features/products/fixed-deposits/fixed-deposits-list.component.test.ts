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

import { FixedDepositAccountsListComponent } from './fixed-deposits-list.component';
import { DEPOSIT_ACCOUNT_API } from '../../../core/adapters';
import { mapDepositAccount } from '../../../core/adapters/api/fineract-deposit-account.api';
import { createSpyObj, SpyObj } from '../../../testing/mocks';
import { provideTranslateTesting } from '../../../testing/i18n-testing';

/**
 * Two rows as `GET /fixeddepositaccounts` really answers them, measured against a running
 * Fineract: the list sends the whole account payload minus its associations, so the product is
 * `depositProductName`, the currency is an object, and the status carries booleans beside its
 * English label.
 *
 * Put through the adapter's own mapper rather than hand-shaped here, so this spec cannot pass
 * over a shape the adapter never produces.
 */
const PENDING_ACCOUNT = {
  id: 1,
  accountNo: '000000001',
  clientId: 9,
  clientName: 'Tester',
  depositProductId: 1,
  depositProductName: 'FD 12 months',
  depositAmount: 1000,
  maturityAmount: 1065,
  currency: { code: 'USD', displaySymbol: '$' },
  status: {
    id: 100,
    code: 'savingsAccountStatusType.submittedAndPendingApproval',
    value: 'Submitted and pending approval',
    submittedAndPendingApproval: true,
    approved: false,
    active: false,
  },
};

const ACTIVE_ACCOUNT = {
  ...PENDING_ACCOUNT,
  id: 2,
  accountNo: '000000002',
  status: {
    id: 300,
    code: 'savingsAccountStatusType.active',
    value: 'Active',
    submittedAndPendingApproval: false,
    approved: false,
    active: true,
  },
};

describe('FixedDepositAccountsListComponent', () => {
  let component: FixedDepositAccountsListComponent;
  let fixture: ComponentFixture<FixedDepositAccountsListComponent>;
  let deposits: Record<string, ReturnType<typeof vi.fn>>;
  let routerSpy: SpyObj<Router>;

  async function setup(payloads: object[] = [PENDING_ACCOUNT]): Promise<void> {
    TestBed.resetTestingModule();
    deposits = { list: vi.fn().mockReturnValue(of(payloads.map(mapDepositAccount))) };
    routerSpy = createSpyObj(['navigate']);

    await TestBed.configureTestingModule({
      imports: [FixedDepositAccountsListComponent],
      providers: [
        ...provideTranslateTesting(),
        provideNoopAnimations(),
        { provide: DEPOSIT_ACCOUNT_API, useValue: deposits },
        { provide: Router, useValue: routerSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FixedDepositAccountsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  it('asks the adapter for the fixed deposit accounts', async () => {
    await setup();

    expect(deposits['list']).toHaveBeenCalledWith('fixed');
    expect(component.accounts()).toHaveLength(1);
    expect(component.accounts()[0].accountNo).toBe('000000001');
  });

  it('shows the product and the client the payload really names', async () => {
    await setup();

    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(text).toContain('Tester');
    expect(component.accounts()[0].productName).toBe('FD 12 months');
  });

  it('offers Approve on a pending account', async () => {
    await setup([PENDING_ACCOUNT]);

    expect(approveButtons()).toHaveLength(1);
  });

  it('withholds Approve on an account the platform would refuse it for', async () => {
    await setup([ACTIVE_ACCOUNT]);

    expect(approveButtons()).toHaveLength(0);
  });

  it('empties the list when the read fails', async () => {
    await setup();
    deposits['list'].mockReturnValue(throwError(() => new Error('API Error')));

    fixture.componentInstance.ngOnInit();

    expect(component.accounts()).toEqual([]);
  });

  it('navigates to the create form', async () => {
    await setup();

    component.onCreateAccount();

    expect(routerSpy.navigate).toHaveBeenCalledWith(['/products/fixed-deposits/create']);
  });

  it('navigates to the edit form and to the approve action', async () => {
    await setup();
    const [account] = component.accounts();

    component.onEditAccount(account);
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/products/fixed-deposits/edit', 1]);

    component.onApprove(account);
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/products/fixed/1/action/approve']);
  });

  /**
   * The row's Approve action, found by its accessible name.
   *
   * The translation under test returns the key, so the name is the key — which is also what
   * every label-scoped locator in the e2e suite matches on.
   */
  function approveButtons(): Element[] {
    return Array.from(
      (fixture.nativeElement as HTMLElement).querySelectorAll('[aria-label="LOANS.APPROVE"]'),
    );
  }
});
