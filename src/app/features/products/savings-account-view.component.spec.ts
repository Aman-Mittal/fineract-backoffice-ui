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

/* eslint-disable @typescript-eslint/no-explicit-any */

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SavingsAccountViewComponent } from './savings-account-view.component';
import { SavingsAccountService } from '../../api';
import { AuthService } from '../../core/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { signal } from '@angular/core';
import { provideIonicTesting } from '../../testing/ionic-testing';

describe('SavingsAccountViewComponent', () => {
  let component: SavingsAccountViewComponent;
  let fixture: ComponentFixture<SavingsAccountViewComponent>;
  let savingsServiceSpy: jasmine.SpyObj<SavingsAccountService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    savingsServiceSpy = jasmine.createSpyObj('SavingsAccountService', [
      'getSavingsaccountsAccountId',
    ]);
    authServiceSpy = jasmine.createSpyObj('AuthService', ['hasPermission'], {
      currentUser: signal({
        username: 'mifos',
        base64EncodedAuthenticationKey: 'key',
        authenticated: true,
        officeId: 1,
        officeName: 'Head Office',
        userId: 1,
        permissions: ['ALL_FUNCTIONS'],
      }),
    });
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [SavingsAccountViewComponent, TranslateModule.forRoot()],
      providers: [
        provideIonicTesting(),
        provideNoopAnimations(),
        { provide: SavingsAccountService, useValue: savingsServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of({
              get: (key: string) => (key === 'id' ? '789' : null),
            }),
          },
        },
      ],
    }).compileComponents();

    savingsServiceSpy.getSavingsaccountsAccountId.and.returnValue(
      of({
        id: 789,
        accountNo: 'SA000789',
        savingsProductName: 'Regular Savings',
        clientName: 'Jane Smith',
        nominalAnnualInterestRate: 4,
        status: { value: 'Active' },
        transactions: [],
        charges: [],
      }) as any,
    );

    fixture = TestBed.createComponent(SavingsAccountViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load savings details on init', () => {
    expect(savingsServiceSpy.getSavingsaccountsAccountId).toHaveBeenCalledWith(
      789,
      false,
      undefined,
      'all',
    );
    expect(component.account()?.savingsProductName).toBe('Regular Savings');
  });

  /**
   * Fineract records a block in `subStatus` and leaves `status` as `Active`, so the status badge
   * cannot distinguish a frozen account from a healthy one. It also rejects each reversal unless
   * the matching block is actually in force — `unblockDebit` answers "debits.are.not.blocked" —
   * so each is offered only in the state that permits it.
   */
  describe('block state', () => {
    function withSubStatus(subStatus: Record<string, boolean>): void {
      component.account.set({
        ...(component.account() ?? {}),
        status: { active: true },
        subStatus,
      } as never);
    }

    it('reports no block on a healthy account', () => {
      withSubStatus({ block: false, blockDebit: false, blockCredit: false });

      expect(component.isBlocked()).toBeFalse();
      expect(component.isDebitBlocked()).toBeFalse();
      expect(component.isCreditBlocked()).toBeFalse();
      expect(component.blockLabelKey()).toBeNull();
    });

    it('distinguishes a debit block from a credit block', () => {
      withSubStatus({ block: false, blockDebit: true, blockCredit: false });
      expect(component.blockLabelKey()).toBe('SAVINGS.DEBITS_BLOCKED');

      withSubStatus({ block: false, blockDebit: false, blockCredit: true });
      expect(component.blockLabelKey()).toBe('SAVINGS.CREDITS_BLOCKED');
    });

    it('treats a full block, and both partial blocks together, as frozen', () => {
      withSubStatus({ block: true, blockDebit: false, blockCredit: false });
      expect(component.blockLabelKey()).toBe('SAVINGS.BLOCKED');

      withSubStatus({ block: false, blockDebit: true, blockCredit: true });
      expect(component.blockLabelKey()).toBe('SAVINGS.BLOCKED');
    });
  });

  /**
   * Each command is offered only in the state that permits it. Fineract enforces these too, but a
   * menu that offers an action only to have it rejected is a worse experience than one that does
   * not offer it.
   */
  describe('officer assignment', () => {
    it('reports no officer when Fineract returns the zero sentinel', () => {
      component.account.set({
        ...(component.account() ?? {}),
        status: { active: true },
        fieldOfficerId: 0,
      } as never);

      // Fineract reports "unassigned" as 0 rather than omitting the field, so a plain
      // truthiness check on the id would be right by accident and a `!= null` check wrong.
      expect(component.hasOfficer()).toBeFalse();
    });

    it('reports an officer once one is assigned', () => {
      component.account.set({
        ...(component.account() ?? {}),
        status: { active: true },
        fieldOfficerId: 7,
      } as never);

      expect(component.hasOfficer()).toBeTrue();
    });
  });
});
