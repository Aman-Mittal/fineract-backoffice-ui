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

import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { ConfigService } from '../../core/services/config.service';
import { ReportExecutionService } from './report-execution.service';

describe('ReportExecutionService', () => {
  const REPORT_NAME = 'Client Listing';
  const OUTPUT_TYPE = 'output-type';
  let service: ReportExecutionService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ReportExecutionService,
        { provide: ConfigService, useValue: { apiUrl: '/api/v1' } },
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(ReportExecutionService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('discovers parameters and loads each select parameter from its own lookup', () => {
    let discovered = false;
    service.getReportParameters('Portfolio at Risk').subscribe((parameters) => {
      discovered = true;
      expect(parameters).toHaveSize(2);
      expect(parameters[0].queryParameter).toBe('R_officeId');
      expect(parameters[0].options).toEqual([
        { id: 1, name: 'Head Office' },
        { id: '-1', name: '', isAll: true },
      ]);
      expect(parameters[1].displayType).toBe('date');
    });

    const template = http.expectOne(
      (request) => request.url === '/api/v1/runreports/FullParameterList',
    );
    expect(template.request.params.get('R_reportListing')).toBe('Portfolio at Risk');
    expect(template.request.params.get('parameterType')).toBe('true');
    template.flush({
      data: [
        {
          row: [
            'OfficeIdSelectAll',
            'officeId',
            'Office',
            'select',
            'number',
            '0',
            null,
            'Y',
            null,
          ],
        },
        {
          row: [
            'startDateSelect',
            'startDate',
            'From Date',
            'date',
            'date',
            'today',
            null,
            null,
            null,
          ],
        },
      ],
    });

    const lookup = http.expectOne(
      (request) => request.url === '/api/v1/runreports/OfficeIdSelectAll',
    );
    expect(lookup.request.params.get('parameterType')).toBe('true');
    lookup.flush({ data: [{ row: [1, 'Head Office'] }] });
    expect(discovered).toBeTrue();
  });

  it('sends every named report parameter without relying on positional arguments', () => {
    service
      .runReport(REPORT_NAME, {
        R_officeId: 1,
        R_loanOfficerId: 42,
        R_accountNo: '000123',
      })
      .subscribe();

    const request = http.expectOne(
      (candidate) => candidate.url === '/api/v1/runreports/Client%20Listing',
    );
    expect(request.request.method).toBe('GET');
    expect(request.request.params.keys().sort()).toEqual([
      'R_accountNo',
      'R_loanOfficerId',
      'R_officeId',
      'exportCSV',
      OUTPUT_TYPE,
    ]);
    expect(request.request.params.get('R_officeId')).toBe('1');
    expect(request.request.params.get('R_loanOfficerId')).toBe('42');
    expect(request.request.params.get('R_accountNo')).toBe('000123');
    expect(request.request.params.get('exportCSV')).toBe('false');
    expect(request.request.params.get(OUTPUT_TYPE)).toBe('HTML');
    request.flush({ columnHeaders: [], data: [] });
  });

  it('requests CSV output while preserving the same dynamic parameter map', () => {
    service.downloadCsv(REPORT_NAME, { R_officeId: 2 }).subscribe((csv) => {
      expect(csv).toContain('Client ID');
    });

    const request = http.expectOne(
      (candidate) => candidate.url === '/api/v1/runreports/Client%20Listing',
    );
    expect(request.request.responseType).toBe('text');
    expect(request.request.params.get('R_officeId')).toBe('2');
    expect(request.request.params.get('exportCSV')).toBe('true');
    expect(request.request.params.get(OUTPUT_TYPE)).toBe('CSV');
    request.flush('Client ID,Display Name');
  });

  it('fails closed when the parameter template is malformed', () => {
    let message = '';
    service.getReportParameters('Broken Report').subscribe({
      error: (error: Error) => {
        message = error.message;
      },
    });

    http
      .expectOne((request) => request.url === '/api/v1/runreports/FullParameterList')
      .flush({ data: [{ row: ['missing-fields'] }] });
    expect(message).toContain('invalid row');
  });
});
