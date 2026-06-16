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
import { SchedulerJobsListComponent } from './scheduler-jobs-list.component';
import { SCHEDULERJOBService, SchedulerService } from '../../../api';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { provideNoopAnimations } from '@angular/platform-browser/animations';

describe('SchedulerJobsListComponent', () => {
  let component: SchedulerJobsListComponent;
  let fixture: ComponentFixture<SchedulerJobsListComponent>;
  let jobSpy: jasmine.SpyObj<SCHEDULERJOBService>;
  let schedulerSpy: jasmine.SpyObj<SchedulerService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    jobSpy = jasmine.createSpyObj('SCHEDULERJOBService', ['getJobs', 'postJobsJobId']);
    schedulerSpy = jasmine.createSpyObj('SchedulerService', ['getScheduler', 'postScheduler']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    jobSpy.getJobs.and.returnValue(
      of([{ jobId: 1, displayName: 'Job A', active: true }]) as unknown as ReturnType<
        SCHEDULERJOBService['getJobs']
      >,
    );
    jobSpy.postJobsJobId.and.returnValue(
      of({}) as unknown as ReturnType<SCHEDULERJOBService['postJobsJobId']>,
    );
    schedulerSpy.getScheduler.and.returnValue(
      of({ active: true }) as unknown as ReturnType<SchedulerService['getScheduler']>,
    );
    schedulerSpy.postScheduler.and.returnValue(
      of({}) as unknown as ReturnType<SchedulerService['postScheduler']>,
    );

    await TestBed.configureTestingModule({
      imports: [SchedulerJobsListComponent, TranslateModule.forRoot()],
      providers: [
        { provide: SCHEDULERJOBService, useValue: jobSpy },
        { provide: SchedulerService, useValue: schedulerSpy },
        { provide: Router, useValue: routerSpy },
        provideNoopAnimations(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SchedulerJobsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should load jobs and scheduler status on init', () => {
    expect(component).toBeTruthy();
    expect(jobSpy.getJobs).toHaveBeenCalled();
    expect(component.jobs.length).toBe(1);
    expect(component.schedulerActive).toBeTrue();
  });

  it('should run a job now with executeJob command', () => {
    component.onRunNow({ jobId: 7 });
    expect(jobSpy.postJobsJobId).toHaveBeenCalledWith(7, 'executeJob');
  });

  it('should start the scheduler when toggled on', () => {
    component.onToggleScheduler(true);
    expect(schedulerSpy.postScheduler).toHaveBeenCalledWith('start');
  });

  it('should stop the scheduler when toggled off', () => {
    component.onToggleScheduler(false);
    expect(schedulerSpy.postScheduler).toHaveBeenCalledWith('stop');
  });

  it('should navigate to history', () => {
    component.onHistory({ jobId: 9 });
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/system/scheduler-jobs', 9, 'history']);
  });
});
