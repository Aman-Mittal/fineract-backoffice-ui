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

import { initializeApp, appConfig } from './app.config';
import { BASE_PATH } from './api/variables';

describe('AppConfig', () => {
  const API_URL = 'http://localhost/fineract-provider/api';

  it('should initialize app config by calling loadConfig', () => {
    const configServiceSpy = jasmine.createSpyObj('ConfigService', ['loadConfig']);
    const initFn = initializeApp(configServiceSpy);
    initFn();
    expect(configServiceSpy.loadConfig).toHaveBeenCalled();
  });

  it('should provide BASE_PATH from ConfigService', () => {
    const basePathProvider = (appConfig.providers as unknown as Record<string, unknown>[]).find(
      (p) => p && p['provide'] === BASE_PATH,
    );

    expect(basePathProvider).toBeTruthy();

    const configServiceSpy = jasmine.createSpyObj('ConfigService', [], {
      apiUrl: `${API_URL}/v1`,
    });
    const result = (basePathProvider!['useFactory'] as (...args: unknown[]) => unknown)(
      configServiceSpy,
    );
    expect(result).toBe(API_URL);
  });

  it('should not trim /v1 if apiUrl does not end with /v1', () => {
    const basePathProvider = (appConfig.providers as unknown as Record<string, unknown>[]).find(
      (p) => p && p['provide'] === BASE_PATH,
    );

    const configServiceSpy = jasmine.createSpyObj('ConfigService', [], {
      apiUrl: API_URL,
    });
    const result = (basePathProvider!['useFactory'] as (...args: unknown[]) => unknown)(
      configServiceSpy,
    );
    expect(result).toBe(API_URL);
  });
});
