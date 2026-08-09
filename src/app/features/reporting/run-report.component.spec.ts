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
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';

import { NotificationService } from '../../core/services/notification.service';
import { provideIonicTesting } from '../../testing/ionic-testing';
import { ReportExecutionService, ReportParameter, ReportResult } from './report-execution.service';
import { RunReportComponent } from './run-report.component';

describe('RunReportComponent', () => {
  const REPORT_NAME = 'Active Clients';
  let component: RunReportComponent;
  let fixture: ComponentFixture<RunReportComponent>;
  let reportExecutionSpy: jasmine.SpyObj<ReportExecutionService>;

  const parameter = (
    variable: string,
    label: string,
    displayType: string,
    options: ReportParameter['options'] = [],
  ): ReportParameter => ({
    name: `${variable}Parameter`,
    variable,
    label,
    displayType,
    formatType: displayType === 'date' ? 'date' : 'string',
    defaultValue: displayType === 'none' ? 'hidden-value' : null,
    selectOne: null,
    selectAll: null,
    parentParameterName: null,
    queryParameter: `R_${variable}`,
    options,
  });

  const office = parameter('officeId', 'Office', 'select', [{ id: 1, name: 'Head Office' }]);
  const loanOfficer = parameter('loanOfficerId', 'Loan Officer', 'select', [
    { id: 42, name: 'Ada Officer' },
  ]);
  const fromDate = parameter('fromDate', 'From Date', 'date');
  const toDate = parameter('toDate', 'To Date', 'date');
  const accountNumber = parameter('accountNo', 'Account Number', 'text');

  beforeEach(async () => {
    reportExecutionSpy = jasmine.createSpyObj('ReportExecutionService', [
      'getReportParameters',
      'runReport',
      'downloadCsv',
    ]);

    await TestBed.configureTestingModule({
      imports: [RunReportComponent, TranslateModule.forRoot()],
      providers: [
        { provide: ReportExecutionService, useValue: reportExecutionSpy },
        { provide: Router, useValue: jasmine.createSpyObj('Router', ['navigate']) },
        {
          provide: NotificationService,
          useValue: jasmine.createSpyObj('NotificationService', ['error']),
        },
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of(convertToParamMap({ reportName: REPORT_NAME })),
            queryParamMap: of(convertToParamMap({ type: 'Table' })),
          },
        },
        provideIonicTesting(),
        provideNoopAnimations(),
      ],
    }).compileComponents();
  });

  function create(parameters: ReportParameter[]): void {
    reportExecutionSpy.getReportParameters.and.returnValue(of(parameters));
    fixture = TestBed.createComponent(RunReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  it('should create and read the report name from the route', () => {
    create([office]);

    expect(component).toBeTruthy();
    expect(component.reportName()).toBe(REPORT_NAME);
    expect(reportExecutionSpy.getReportParameters).toHaveBeenCalledOnceWith(REPORT_NAME);
  });

  it('renders all five declared visible parameters using their display types', () => {
    create([office, loanOfficer, fromDate, toDate, accountNumber]);

    const controls = fixture.nativeElement.querySelectorAll(
      'ion-item[data-testid^="report-parameter-"]',
    );
    expect(controls).toHaveSize(5);
    expect(
      fixture.nativeElement.querySelector('[data-testid="report-parameter-officeId"]'),
    ).not.toBeNull();
    expect(
      fixture.nativeElement.querySelector('[data-testid="report-parameter-fromDate"]'),
    ).not.toBeNull();
    expect(
      fixture.nativeElement.querySelector('[data-testid="report-parameter-accountNo"]'),
    ).not.toBeNull();
  });

  it('renders only Office when it is the only declared parameter', () => {
    create([office]);

    expect(
      fixture.nativeElement.querySelectorAll('[data-testid="report-parameter-officeId"]'),
    ).toHaveSize(1);
    expect(
      fixture.nativeElement.querySelectorAll('ion-item[data-testid^="report-parameter-"]'),
    ).toHaveSize(1);
  });

  it('passes hidden defaults without rendering a control', () => {
    const hidden = parameter('tenantScope', 'Tenant Scope', 'none');
    reportExecutionSpy.runReport.and.returnValue(of({ columnHeaders: [], data: [] }));
    create([hidden]);

    expect(
      fixture.nativeElement.querySelector('[data-testid="report-parameter-tenantScope"]'),
    ).toBeNull();
    expect(component.canRun()).toBeTrue();
    component.onRun();
    expect(reportExecutionSpy.runReport).toHaveBeenCalledOnceWith(REPORT_NAME, {
      R_tenantScope: 'hidden-value',
    });
  });

  it('passes the full collected value map to the report call', () => {
    const result: ReportResult = { columnHeaders: [], data: [] };
    reportExecutionSpy.runReport.and.returnValue(of(result));
    create([office, loanOfficer, fromDate, toDate, accountNumber]);

    component.setParameterValue(office, 1);
    component.setParameterValue(loanOfficer, 42);
    component.setParameterValue(fromDate, '2026-08-01T00:00:00.000Z');
    component.setParameterValue(toDate, '2026-08-09T00:00:00.000Z');
    component.setParameterValue(accountNumber, '000123');
    component.onRun();

    expect(reportExecutionSpy.runReport).toHaveBeenCalledOnceWith(REPORT_NAME, {
      R_officeId: 1,
      R_loanOfficerId: 42,
      R_fromDate: '2026-08-01',
      R_toDate: '2026-08-09',
      R_accountNo: '000123',
    });
  });

  it('blocks a report that declares an unsupported display type', () => {
    create([parameter('customFilter', 'Custom Filter', 'range')]);

    expect(component.canRun()).toBeFalse();
    expect(
      fixture.nativeElement.querySelector('[data-testid="report-parameters-unsupported"]')
        .textContent,
    ).toContain('Custom Filter (range)');
  });
});
