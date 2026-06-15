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
import { WorkingDaysComponent } from './working-days.component';
import { WorkingDaysService } from '../../api';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { provideNoopAnimations } from '@angular/platform-browser/animations';

describe('WorkingDaysComponent', () => {
  let component: WorkingDaysComponent;
  let fixture: ComponentFixture<WorkingDaysComponent>;
  let workingDaysServiceSpy: jasmine.SpyObj<WorkingDaysService>;

  beforeEach(async () => {
    workingDaysServiceSpy = jasmine.createSpyObj('WorkingDaysService', [
      'getWorkingdays',
      'getWorkingdaysTemplate',
      'putWorkingdays',
    ]);
    workingDaysServiceSpy.getWorkingdays.and.returnValue(
      of({
        repaymentRescheduleType: { id: 1 },
        extendTermForDailyRepayments: false,
        recurrence: 'FREQ=WEEKLY;INTERVAL=1;BYDAY=MO,TU,WE,TH,FR',
      }) as unknown as ReturnType<WorkingDaysService['getWorkingdays']>,
    );
    workingDaysServiceSpy.getWorkingdaysTemplate.and.returnValue(
      of({ repaymentRescheduleOptions: [] }) as unknown as ReturnType<
        WorkingDaysService['getWorkingdaysTemplate']
      >,
    );

    await TestBed.configureTestingModule({
      imports: [WorkingDaysComponent, TranslateModule.forRoot()],
      providers: [
        { provide: WorkingDaysService, useValue: workingDaysServiceSpy },
        { provide: MatSnackBar, useValue: jasmine.createSpyObj('MatSnackBar', ['open']) },
        provideNoopAnimations(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(WorkingDaysComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create and load working days on init', () => {
    expect(component).toBeTruthy();
    expect(workingDaysServiceSpy.getWorkingdays).toHaveBeenCalled();
  });

  it('should submit a WorkingDaysUpdateRequest on save', () => {
    workingDaysServiceSpy.putWorkingdays.and.returnValue(
      of({}) as unknown as ReturnType<WorkingDaysService['putWorkingdays']>,
    );

    component.onSubmit();

    expect(workingDaysServiceSpy.putWorkingdays).toHaveBeenCalledWith(
      jasmine.objectContaining({ locale: 'en' }),
    );
  });
});
