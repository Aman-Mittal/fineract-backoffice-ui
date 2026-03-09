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
import { ConfigService, AppConfig } from './config.service';

describe('ConfigService', () => {
  let service: ConfigService;
  let httpMock: HttpTestingController;

  const mockConfig: AppConfig = {
    fineractApiUrl: 'https://test-api.com',
    defaultTenant: 'test-tenant',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ConfigService, provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(ConfigService);
    httpMock = TestBed.inject(HttpTestingController);
    localStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should load config from http', async () => {
    const loadPromise = service.loadConfig();

    const req = httpMock.expectOne((request) => request.url.includes('config.json'));
    req.flush(mockConfig);

    await loadPromise;
    expect(service.apiUrl).toBe(mockConfig.fineractApiUrl);
  });

  it('should set and persist API URL', () => {
    const newUrl = 'https://new-api.com';
    service.setApiUrl(newUrl);

    expect(service.apiUrl).toBe(newUrl);
    const stored = JSON.parse(localStorage.getItem('fineract_runtime_config')!);
    expect(stored.fineractApiUrl).toBe(newUrl);
  });
});
