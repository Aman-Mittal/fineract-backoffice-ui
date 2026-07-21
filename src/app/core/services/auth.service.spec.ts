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

import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { AuthService, UserSession } from './auth.service';
import { ConfigService } from './config.service';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  const mockSession: UserSession = {
    username: 'mifos',
    userId: 1,
    base64EncodedAuthenticationKey: 'bWlmb3M6cGFzc3dvcmQ=',
    authenticated: true,
    officeId: 1,
    officeName: 'Head Office',
    permissions: ['ALL_FUNCTIONS'],
  };

  beforeEach(() => {
    sessionStorage.clear();
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [AuthService, ConfigService, provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should login successfully and set state', () => {
    service.login('mifos', 'password', 'default').subscribe((session) => {
      expect(session).toEqual(mockSession);
      expect(service.isAuthenticated()).toBeTrue();
      expect(service.username()).toBe('mifos');
    });

    const req = httpMock.expectOne((request) => request.url.includes('/authentication'));
    expect(req.request.method).toBe('POST');
    expect(req.request.headers.get('Fineract-Platform-TenantId')).toBe('default');
    req.flush(mockSession);
  });

  it('should logout and clear state', () => {
    // Access private setSession for testing
    (service as unknown as { setSession: (s: UserSession) => void }).setSession(mockSession);
    expect(service.isAuthenticated()).toBeTrue();

    service.logout();
    expect(service.isAuthenticated()).toBeFalse();
    expect(service.currentUser()).toBeNull();
    expect(sessionStorage.getItem('fineract_session')).toBeNull();
  });

  describe('hasPermission', () => {
    it('should return false if user is not authenticated', () => {
      expect(service.hasPermission('CREATE_CLIENT')).toBeFalse();
    });

    it('should return true for any permission if user is superuser', () => {
      (service as unknown as { setSession: (s: UserSession) => void }).setSession({
        ...mockSession,
        permissions: ['ALL_FUNCTIONS'],
      });
      expect(service.hasPermission('CREATE_CLIENT')).toBeTrue();
      expect(service.hasPermission('DELETE_LOAN')).toBeTrue();
    });

    it('should correctly evaluate single and multiple permissions', () => {
      (service as unknown as { setSession: (s: UserSession) => void }).setSession({
        ...mockSession,
        permissions: ['READ_CLIENT', 'CREATE_CLIENT'],
      });
      expect(service.hasPermission('READ_CLIENT')).toBeTrue();
      expect(service.hasPermission('DELETE_LOAN')).toBeFalse();

      // Check any matching permission (matchAll = false)
      expect(service.hasPermission(['READ_CLIENT', 'DELETE_LOAN'])).toBeTrue();

      // Check all matching permissions (matchAll = true)
      expect(service.hasPermission(['READ_CLIENT', 'CREATE_CLIENT'], true)).toBeTrue();
      expect(service.hasPermission(['READ_CLIENT', 'DELETE_LOAN'], true)).toBeFalse();
    });

    describe('ALL_FUNCTIONS_READ shortcut', () => {
      beforeEach(() => {
        (service as unknown as { setSession: (s: UserSession) => void }).setSession({
          ...mockSession,
          permissions: ['ALL_FUNCTIONS_READ'],
        });
      });

      it('grants any single READ_* permission', () => {
        expect(service.hasPermission('READ_CLIENT')).toBeTrue();
        expect(service.hasPermission('READ_LOAN')).toBeTrue();
      });

      it('denies a single non-READ_* permission', () => {
        expect(service.hasPermission('CREATE_CLIENT')).toBeFalse();
        expect(service.hasPermission('DELETE_LOAN')).toBeFalse();
        expect(service.hasPermission('APPROVE_LOAN')).toBeFalse();
      });

      it('grants an array made up entirely of READ_* permissions', () => {
        expect(service.hasPermission(['READ_CLIENT', 'READ_LOAN'])).toBeTrue();
        expect(service.hasPermission(['READ_CLIENT', 'READ_LOAN'], true)).toBeTrue();
      });

      it('does not grant a mixed array via the shortcut, falling back to real permissions', () => {
        expect(service.hasPermission(['READ_CLIENT', 'CREATE_CLIENT'])).toBeFalse();
        expect(service.hasPermission(['READ_CLIENT', 'CREATE_CLIENT'], true)).toBeFalse();
      });
    });

    it('ALL_FUNCTIONS still bypasses non-READ permissions (unlike ALL_FUNCTIONS_READ)', () => {
      (service as unknown as { setSession: (s: UserSession) => void }).setSession({
        ...mockSession,
        permissions: ['ALL_FUNCTIONS'],
      });
      expect(service.hasPermission(['READ_CLIENT', 'CREATE_CLIENT'], true)).toBeTrue();
    });
  });

  describe('permission normalization (trailing-space backend duplicates)', () => {
    it('trims a trailing-space permission on setSession so a clean check matches', () => {
      (service as unknown as { setSession: (s: UserSession) => void }).setSession({
        ...mockSession,
        permissions: ['READ_STANDINGINSTRUCTION '],
      });
      expect(service.hasPermission('READ_STANDINGINSTRUCTION')).toBeTrue();
    });

    it('dedupes a clean/trailing-space duplicate pair into a single entry on setSession', () => {
      (service as unknown as { setSession: (s: UserSession) => void }).setSession({
        ...mockSession,
        permissions: ['READ_CLIENT ', 'READ_CLIENT'],
      });
      expect(service.currentUser()?.permissions).toEqual(['READ_CLIENT']);
      expect(service.hasPermission('READ_CLIENT')).toBeTrue();
    });

    it('normalizes a dirty session read back from sessionStorage on init', () => {
      sessionStorage.setItem(
        'fineract_session',
        JSON.stringify({
          ...mockSession,
          permissions: ['CREATE_STANDINGINSTRUCTION', 'CREATE_STANDINGINSTRUCTION ', 'READ_X '],
        }),
      );

      // Reset and reconfigure the testing module so AuthService is
      // constructed fresh, reading the dirty sessionStorage entry above via
      // getStoredSession() during its signal initialization.
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        providers: [AuthService, ConfigService, provideHttpClient(), provideHttpClientTesting()],
      });
      const freshService = TestBed.inject(AuthService);

      expect(freshService.currentUser()?.permissions).toEqual([
        'CREATE_STANDINGINSTRUCTION',
        'READ_X',
      ]);
      expect(freshService.hasPermission('READ_X')).toBeTrue();
    });
  });
});
