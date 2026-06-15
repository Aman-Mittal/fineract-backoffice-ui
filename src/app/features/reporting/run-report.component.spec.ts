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
import { RunReportComponent } from './run-report.component';
import { RunReportsService, OfficesService } from '../../api';
import { ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { of } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { MatNativeDateModule } from '@angular/material/core';

describe('RunReportComponent', () => {
  const REPORT_NAME = 'Active Clients';
  let component: RunReportComponent;
  let fixture: ComponentFixture<RunReportComponent>;
  let runReportsServiceSpy: jasmine.SpyObj<RunReportsService>;
  let officesServiceSpy: jasmine.SpyObj<OfficesService>;

  beforeEach(async () => {
    runReportsServiceSpy = jasmine.createSpyObj('RunReportsService', ['getRunreportsReportName']);
    officesServiceSpy = jasmine.createSpyObj('OfficesService', ['getOffices']);
    officesServiceSpy.getOffices.and.returnValue(
      of([]) as unknown as ReturnType<OfficesService['getOffices']>,
    );

    await TestBed.configureTestingModule({
      imports: [RunReportComponent, TranslateModule.forRoot(), MatNativeDateModule],
      providers: [
        { provide: RunReportsService, useValue: runReportsServiceSpy },
        { provide: OfficesService, useValue: officesServiceSpy },
        { provide: Router, useValue: jasmine.createSpyObj('Router', ['navigate']) },
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of(convertToParamMap({ reportName: REPORT_NAME })),
            queryParamMap: of(convertToParamMap({ type: 'Table' })),
          },
        },
        provideNoopAnimations(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RunReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create and read the report name from the route', () => {
    expect(component).toBeTruthy();
    expect(component.reportName).toBe(REPORT_NAME);
  });

  it('should run the report with positionally-correct arguments (no self-service flag)', () => {
    runReportsServiceSpy.getRunreportsReportName.and.returnValue(
      of({ columnHeaders: [], data: [] }) as unknown as ReturnType<
        RunReportsService['getRunreportsReportName']
      >,
    );

    component.onRun();

    expect(runReportsServiceSpy.getRunreportsReportName).toHaveBeenCalled();
    const args = runReportsServiceSpy.getRunreportsReportName.calls.mostRecent().args;
    // reportName, exportCSV, parameterType, outputType, ...
    expect(args[0]).toBe(REPORT_NAME);
    expect(args[3]).toBe('HTML'); // outputType lands in the right slot after the param fix
  });
});
