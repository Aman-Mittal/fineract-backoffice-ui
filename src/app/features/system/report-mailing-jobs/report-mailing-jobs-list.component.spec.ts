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
import { ReportMailingJobsListComponent } from './report-mailing-jobs-list.component';
import { ReportMailingJobsService } from '../../../api';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { provideNoopAnimations } from '@angular/platform-browser/animations';

describe('ReportMailingJobsListComponent', () => {
  let component: ReportMailingJobsListComponent;
  let fixture: ComponentFixture<ReportMailingJobsListComponent>;
  let serviceSpy: jasmine.SpyObj<ReportMailingJobsService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    serviceSpy = jasmine.createSpyObj('ReportMailingJobsService', [
      'getReportmailingjobs',
      'deleteReportmailingjobsEntityId',
    ]);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    serviceSpy.getReportmailingjobs.and.returnValue(
      of([{ id: 1, name: 'Job', emailRecipients: 'a@b.c' }]) as unknown as ReturnType<
        ReportMailingJobsService['getReportmailingjobs']
      >,
    );

    await TestBed.configureTestingModule({
      imports: [ReportMailingJobsListComponent, TranslateModule.forRoot()],
      providers: [
        { provide: ReportMailingJobsService, useValue: serviceSpy },
        { provide: Router, useValue: routerSpy },
        provideNoopAnimations(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ReportMailingJobsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should load jobs on init', () => {
    expect(component).toBeTruthy();
    expect(serviceSpy.getReportmailingjobs).toHaveBeenCalled();
    expect(component.jobs.length).toBe(1);
  });

  it('should navigate to edit with the job id', () => {
    component.onEdit({ id: 3, name: 'X' });
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/system/report-mailing-jobs/edit', 3]);
  });

  it('should delete after confirmation and reload', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    serviceSpy.deleteReportmailingjobsEntityId.and.returnValue(
      of({}) as unknown as ReturnType<ReportMailingJobsService['deleteReportmailingjobsEntityId']>,
    );

    component.onDelete({ id: 5, name: 'Y' });

    expect(serviceSpy.deleteReportmailingjobsEntityId).toHaveBeenCalledWith(5);
    expect(serviceSpy.getReportmailingjobs).toHaveBeenCalledTimes(2);
  });

  it('should not delete when cancelled', () => {
    spyOn(window, 'confirm').and.returnValue(false);
    component.onDelete({ id: 5, name: 'Y' });
    expect(serviceSpy.deleteReportmailingjobsEntityId).not.toHaveBeenCalled();
  });
});
