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
import { ClientViewComponent } from './client-view.component';
import { ClientService } from '../../api';
import { AuthService } from '../../core/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { signal } from '@angular/core';

describe('ClientViewComponent', () => {
  let component: ClientViewComponent;
  let fixture: ComponentFixture<ClientViewComponent>;
  let clientServiceSpy: jasmine.SpyObj<ClientService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    clientServiceSpy = jasmine.createSpyObj('ClientService', [
      'retrieveOne11',
      'retrieveAssociatedAccounts']);
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
      imports: [ClientViewComponent, TranslateModule.forRoot()],
      providers: [provideNoopAnimations(), 
        { provide: ClientService, useValue: clientServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of({
              get: (key: string) => (key === 'id' ? '123' : null),
            }),
          },
        }],
    }).compileComponents();

    clientServiceSpy.retrieveOne11.and.returnValue(
      of({
        id: 123,
        accountNo: 'CL00123',
        displayName: 'John Doe',
        firstname: 'John',
        lastname: 'Doe',
        officeName: 'Head Office',
        activationDate: [2026, 5, 30] as any,
      }) as any,
    );

    clientServiceSpy.retrieveAssociatedAccounts.and.returnValue(
      of({
        loanAccounts: [] as any,
        savingsAccounts: [] as any,
      }) as any,
    );

    fixture = TestBed.createComponent(ClientViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load client details and accounts on init', () => {
    expect(clientServiceSpy.retrieveOne11).toHaveBeenCalledWith(123);
    expect(clientServiceSpy.retrieveAssociatedAccounts).toHaveBeenCalledWith(123);
    expect(component.client()?.displayName).toBe('John Doe');
  });
});
