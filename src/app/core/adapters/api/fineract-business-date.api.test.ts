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

import { HttpContext } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { vi } from 'vitest';

import { BusinessDateManagementService, GlobalConfigurationService } from '../../../api';
import { FineractBusinessDateApi } from './fineract-business-date.api';
import { RETRY, SKIP_ERROR_TOAST } from '../../http/http-context';

describe('FineractBusinessDateApi', () => {
  let serviceMock: {
    getBusinessdate: ReturnType<typeof vi.fn>;
  };
  let configurationsMock: {
    getConfigurationsNameName: ReturnType<typeof vi.fn>;
  };
  let api: FineractBusinessDateApi;

  beforeEach(() => {
    serviceMock = {
      getBusinessdate: vi.fn(),
    };
    configurationsMock = {
      getConfigurationsNameName: vi.fn().mockReturnValue(of({ enabled: true })),
    };
    TestBed.configureTestingModule({
      providers: [
        { provide: BusinessDateManagementService, useValue: serviceMock },
        { provide: GlobalConfigurationService, useValue: configurationsMock },
      ],
    });
    api = TestBed.inject(FineractBusinessDateApi);
  });

  /**
   * Whether the feature is on has to be asked separately, because `GET /businessdate` answers
   * either way: measured, a tenant with the feature disabled still reported
   * `BUSINESS_DATE 2026-10-17` on the 18th, and `POST /businessdate` refused to move it with
   * `business.date.is.not.enabled`.
   */
  describe('isBusinessDateEnabled', () => {
    it('reads the tenant setting by name, quietly and without retrying', async () => {
      const enabled = await new Promise((resolve) =>
        api.isBusinessDateEnabled().subscribe(resolve),
      );

      const call = configurationsMock.getConfigurationsNameName.mock.lastCall as [
        string,
        unknown,
        unknown,
        { context: HttpContext },
      ];
      const options = call[3];
      expect(call[0]).toBe('enable-business-date');
      expect(enabled).toBe(true);

      // Asked on behalf of a date default, with a safe answer when it fails: three retries and
      // an error toast for a tenant setting is noise on every screen that seeds a date.
      expect(options.context.get(SKIP_ERROR_TOAST)).toBe(true);
      expect(options.context.get(RETRY)).toBe(0);
    });

    it('answers false for a disabled setting', async () => {
      configurationsMock.getConfigurationsNameName.mockReturnValue(of({ enabled: false }));

      expect(await new Promise((resolve) => api.isBusinessDateEnabled().subscribe(resolve))).toBe(
        false,
      );
    });

    it('answers false when the setting cannot be read', async () => {
      // Not being able to read the setting is not evidence that a stored date governs, and the
      // caller's fallback — the platform's own clock — is the safer of the two answers.
      configurationsMock.getConfigurationsNameName.mockReturnValue(
        throwError(() => new Error('403')),
      );

      expect(await new Promise((resolve) => api.isBusinessDateEnabled().subscribe(resolve))).toBe(
        false,
      );
    });
  });

  it('maps business dates from generated service', async () => {
    serviceMock.getBusinessdate.mockReturnValue(
      of([
        { type: 'BUSINESS_DATE', date: '2026-10-08' },
        { type: 'COB_DATE', date: '2026-10-07' },
      ]),
    );

    const dates = await new Promise((resolve) => api.getBusinessDates().subscribe(resolve));
    expect(dates).toEqual([
      { type: 'BUSINESS_DATE', date: '2026-10-08' },
      { type: 'COB_DATE', date: '2026-10-07' },
    ]);
  });

  it('handles null dates or empty response gracefully', async () => {
    serviceMock.getBusinessdate.mockReturnValue(of(null));

    const dates = await new Promise((resolve) => api.getBusinessDates().subscribe(resolve));
    expect(dates).toEqual([]);
  });

  it('defaults missing type or date to fallback values', async () => {
    serviceMock.getBusinessdate.mockReturnValue(of([{ type: undefined, date: undefined }]));

    const dates = await new Promise((resolve) => api.getBusinessDates().subscribe(resolve));
    expect(dates).toEqual([{ type: '', date: null }]);
  });
});
