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

import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { serverClockInterceptor } from './server-clock.interceptor';
import { PlatformDateService } from '../services/platform-date.service';
import { BUSINESS_DATE_API } from '../adapters/api/business-date.api';
import { ConfigService } from '../services/config.service';
import { createSpyObj } from '../../testing/mocks';
import { of } from 'rxjs';

/**
 * The platform's clock, learned from traffic the application already makes.
 *
 * #758: a browser ahead of the tenant seeds a date the platform refuses as "in the future". The
 * `Date` header is on every response and needs no request of its own.
 */
describe('serverClockInterceptor', () => {
  let http: HttpClient;
  let backend: HttpTestingController;
  let platformDate: PlatformDateService;

  beforeEach(() => {
    const businessDateApi = createSpyObj(['getBusinessDates', 'isBusinessDateEnabled']);
    businessDateApi.getBusinessDates.mockReturnValue(of([]));
    businessDateApi.isBusinessDateEnabled.mockReturnValue(of(false));

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([serverClockInterceptor])),
        provideHttpClientTesting(),
        { provide: BUSINESS_DATE_API, useValue: businessDateApi },
        // No tenant timezone configured, so the recorded instant is read as it comes.
        { provide: ConfigService, useValue: { config: () => ({}) } },
      ],
    });
    http = TestBed.inject(HttpClient);
    backend = TestBed.inject(HttpTestingController);
    platformDate = TestBed.inject(PlatformDateService);
  });

  afterEach(() => backend.verify());

  it('takes the date from any response and makes it the platform today', () => {
    http.get('/clients').subscribe();

    backend.expectOne('/clients').flush([], { headers: { Date: 'Thu, 15 Oct 2026 09:00:00 GMT' } });

    expect(platformDate.today()).toBe('2026-10-15');
  });

  it('keeps the latest response, so a long session does not drift', () => {
    http.get('/clients').subscribe();
    backend.expectOne('/clients').flush([], { headers: { Date: 'Thu, 15 Oct 2026 09:00:00 GMT' } });

    http.get('/loans').subscribe();
    backend.expectOne('/loans').flush([], { headers: { Date: 'Fri, 16 Oct 2026 09:00:00 GMT' } });

    expect(platformDate.today()).toBe('2026-10-16');
  });

  it('leaves the date alone when a response carries no usable header', () => {
    http.get('/clients').subscribe();
    backend.expectOne('/clients').flush([], { headers: { Date: 'not a date' } });

    // Falls through to the browser's date rather than to `Invalid Date`.
    expect(platformDate.today()).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it('does not swallow the response', () => {
    let body: unknown;
    http.get('/clients').subscribe((result) => (body = result));
    backend.expectOne('/clients').flush([{ id: 1 }]);

    expect(body).toEqual([{ id: 1 }]);
  });
});
