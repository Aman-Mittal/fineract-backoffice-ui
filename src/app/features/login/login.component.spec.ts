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
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { LoginComponent } from './login.component';
import { AuthService, UserSession } from '../../core/services/auth.service';
import { ConfigService } from '../../core/services/config.service';
import { TranslateModule } from '@ngx-translate/core';
import { WritableSignal } from '@angular/core';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let configServiceSpy: jasmine.SpyObj<ConfigService>;
  let routerSpy: jasmine.SpyObj<Router>;
  const mockApiUrl = 'https://localhost:8443/fineract-provider/api/v1';

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['login', 'currentTenantId']);
    authServiceSpy.currentTenantId.and.returnValue('default');

    configServiceSpy = jasmine.createSpyObj('ConfigService', ['setApiUrl'], {
      apiUrl: mockApiUrl,
    });

    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, TranslateModule.forRoot(), LoginComponent],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: ConfigService, useValue: configServiceSpy },
        { provide: Router, useValue: routerSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should be invalid when empty', () => {
    expect(component['loginForm'].valid).toBeFalse();
  });

  it('should call login and navigate on success', () => {
    authServiceSpy.login.and.returnValue(of({} as UserSession));

    component['loginForm'].setValue({
      serverUrl: mockApiUrl,
      customUrl: '',
      tenantId: 'default',
      username: 'mifos',
      // eslint-disable-next-line sonarjs/no-hardcoded-passwords
      password: 'password123',
    });

    component.onSubmit();

    expect(authServiceSpy.login).toHaveBeenCalledWith('mifos', 'password123', 'default');
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should set error on login failure', () => {
    authServiceSpy.login.and.returnValue(
      throwError(() => ({ error: { defaultUserMessage: 'Failed' } })),
    );

    component['loginForm'].setValue({
      serverUrl: mockApiUrl,
      customUrl: '',
      tenantId: 'default',
      username: 'mifos',
      // eslint-disable-next-line sonarjs/no-hardcoded-passwords
      password: 'wrongpassword',
    });

    component.onSubmit();

    expect((component as unknown as { error: WritableSignal<string | null> }).error()).toBe(
      'Failed',
    );
    expect(
      (component as unknown as { isLoading: WritableSignal<boolean> }).isLoading(),
    ).toBeFalse();
  });
});
