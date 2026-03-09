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
import { HttpRequest, HttpHandlerFn, HttpResponse } from '@angular/common/http';
import { authInterceptor } from './auth.interceptor';
import { AuthService } from '../services/auth.service';
import { signal } from '@angular/core';
import { of } from 'rxjs';

describe('authInterceptor', () => {
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  const testUrl = '/test';
  const testTenant = 'test-tenant';

  beforeEach(() => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['getAuthToken'], {
      currentTenantId: signal(testTenant),
    });

    TestBed.configureTestingModule({
      providers: [{ provide: AuthService, useValue: authServiceSpy }],
    });
  });

  it('should add tenant headers to all requests', (done) => {
    authServiceSpy.getAuthToken.and.returnValue(null);
    const request = new HttpRequest('GET', testUrl);
    const next: HttpHandlerFn = (req) => {
      expect(req.headers.get('Fineract-Platform-TenantId')).toBe(testTenant);
      expect(req.headers.get('X-Mifos-Platform-TenantId')).toBe(testTenant);
      return of(new HttpResponse({ status: 200 }));
    };

    TestBed.runInInjectionContext(() => {
      authInterceptor(request, next).subscribe(() => done());
    });
  });

  it('should add Authorization header when token is present', (done) => {
    authServiceSpy.getAuthToken.and.returnValue('mock-token');
    const request = new HttpRequest('GET', testUrl);
    const next: HttpHandlerFn = (req) => {
      expect(req.headers.get('Authorization')).toBe('Basic mock-token');
      return of(new HttpResponse({ status: 200 }));
    };

    TestBed.runInInjectionContext(() => {
      authInterceptor(request, next).subscribe(() => done());
    });
  });
});
