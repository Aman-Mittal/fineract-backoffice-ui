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
import { MixReportComponent } from './mix-report.component';
import { MixReportService } from '../../../api';
import { of } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { provideNoopAnimations } from '@angular/platform-browser/animations';

describe('MixReportComponent', () => {
  let component: MixReportComponent;
  let fixture: ComponentFixture<MixReportComponent>;
  let serviceSpy: jasmine.SpyObj<MixReportService>;

  beforeEach(async () => {
    serviceSpy = jasmine.createSpyObj('MixReportService', ['getMixreport']);
    serviceSpy.getMixreport.and.returnValue(
      of('<xbrl></xbrl>') as unknown as ReturnType<MixReportService['getMixreport']>,
    );

    await TestBed.configureTestingModule({
      imports: [MixReportComponent, TranslateModule.forRoot()],
      providers: [{ provide: MixReportService, useValue: serviceSpy }, provideNoopAnimations()],
    }).compileComponents();

    fixture = TestBed.createComponent(MixReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should generate the report and store the result', () => {
    component.startDate = '2026-01-01';
    component.endDate = '2026-12-31';
    component.currency = 'USD';
    component.onGenerate();
    expect(serviceSpy.getMixreport).toHaveBeenCalledWith('2026-01-01', '2026-12-31', 'USD');
    expect(component.report).toBe('<xbrl></xbrl>');
    expect(component.isLoading).toBeFalse();
  });
});
