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

describe('SavingsAccountViewComponent', () => {
  let component: SavingsAccountViewComponent;
  let fixture: ComponentFixture<SavingsAccountViewComponent>;
  let savingsServiceSpy: jasmine.SpyObj<SavingsAccountService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    savingsServiceSpy = jasmine.createSpyObj('SavingsAccountService', ['retrieveOne25']);
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

    savingsServiceSpy.retrieveOne25.and.returnValue(
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
    expect(savingsServiceSpy.retrieveOne25).toHaveBeenCalledWith(789, false, undefined, 'all');
    expect(component.account()?.savingsProductName).toBe('Regular Savings');
  });
});
