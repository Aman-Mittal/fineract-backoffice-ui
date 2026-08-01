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
import { SKIP_ERROR_TOAST, SKIP_LOADING } from '../http/http-context';

const STORAGE_KEY = 'fineract_runtime_config';
const TEST_TENANT = 'test-tenant';
const CONFIG_FILE = 'config.json';

describe('ConfigService', () => {
  let service: ConfigService;
  let httpMock: HttpTestingController;

  const mockConfig: AppConfig = {
    fineractApiUrl: 'https://test-api.com',
    defaultTenant: TEST_TENANT,
    rbacEnabled: true,
    institutionType: 'universal',
  };

  /** Rebuilds the service so its constructor re-reads whatever local storage now holds. */
  function create(): void {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [ConfigService, provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(ConfigService);
    httpMock = TestBed.inject(HttpTestingController);
  }

  /** Runs a full load cycle, serving `body` as the contents of config.json. */
  async function load(body: Partial<AppConfig>): Promise<void> {
    const loading = service.loadConfig();
    httpMock.expectOne((request) => request.url.includes(CONFIG_FILE)).flush(body);
    await loading;
  }

  beforeEach(() => {
    localStorage.clear();
    create();
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should load config from http', async () => {
    await load(mockConfig);

    expect(service.apiUrl).toBe(mockConfig.fineractApiUrl);
    expect(service.config().defaultTenant).toBe(TEST_TENANT);
  });

  it('should keep defaults for keys config.json leaves out', async () => {
    // A deployment writes only what it is changing; the rest must not be blanked out.
    await load({ rbacEnabled: false });

    expect(service.rbacEnabled()).toBeFalse();
    expect(service.config().institutionType).toBe('universal');
    expect(service.config().defaultTenant).toBe('default');
  });

  it('should fall back to defaults when config.json cannot be read', async () => {
    const loading = service.loadConfig();
    httpMock
      .expectOne((request) => request.url.includes(CONFIG_FILE))
      .flush(null, { status: 404, statusText: 'Not Found' });
    await loading;

    // Bootstrap must not depend on the file being present.
    expect(service.rbacEnabled()).toBeTrue();
    expect(service.config().defaultTenant).toBe('default');
  });

  it('should not raise a toast or a progress bar while bootstrapping', () => {
    void service.loadConfig();

    const req = httpMock.expectOne((request) => request.url.includes(CONFIG_FILE));
    // There is no route to show a toast on and no progress bar to drive yet.
    expect(req.request.context.get(SKIP_LOADING)).toBeTrue();
    expect(req.request.context.get(SKIP_ERROR_TOAST)).toBeTrue();
    req.flush(mockConfig);
  });

  it('should set and persist API URL', () => {
    const newUrl = 'https://new-api.com';
    service.setApiUrl(newUrl);

    expect(service.apiUrl).toBe(newUrl);
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY)!).fineractApiUrl).toBe(newUrl);
  });

  it("should apply the user's stored endpoint on top of the loaded config", async () => {
    service.setApiUrl('https://my-server.example');
    create();

    await load(mockConfig);

    // The user's choice wins for the endpoint...
    expect(service.apiUrl).toBe('https://my-server.example');
    // ...and for nothing else. An endpoint override that froze the whole object would mean a
    // deployment turning RBAC off never reached anyone who had ever changed their endpoint.
    expect(service.config().defaultTenant).toBe(TEST_TENANT);
  });

  it('should ignore stale deployment settings left in local storage by earlier versions', async () => {
    // Older builds wrote the entire config object under this key.
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ fineractApiUrl: 'https://old.example', rbacEnabled: false }),
    );
    create();

    await load({ rbacEnabled: true });

    expect(service.apiUrl).toBe('https://old.example');
    expect(service.rbacEnabled()).toBeTrue();
  });

  it('should expose the navigation entries a deployment hides', async () => {
    await load({ nav: { hidden: ['nav.groups'] } });

    expect(service.hiddenNavKeys().has('nav.groups')).toBeTrue();
    expect(service.hiddenNavKeys().has('nav.clients')).toBeFalse();
  });
});
