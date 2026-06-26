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
import { MeetingFormComponent } from './meeting-form.component';
import { MeetingsService } from '../../api';
import { ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { of } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { provideNoopAnimations } from '@angular/platform-browser/animations';

describe('MeetingFormComponent', () => {
  let component: MeetingFormComponent;
  let fixture: ComponentFixture<MeetingFormComponent>;
  let serviceSpy: jasmine.SpyObj<MeetingsService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    serviceSpy = jasmine.createSpyObj('MeetingsService', [
      'getEntityTypeEntityIdMeetingsTemplate',
      'getEntityTypeEntityIdMeetingsMeetingId',
      'postEntityTypeEntityIdMeetings',
      'putEntityTypeEntityIdMeetingsMeetingId',
    ]);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    serviceSpy.getEntityTypeEntityIdMeetingsTemplate.and.returnValue(
      of({ calendarData: { id: 7 } }) as unknown as ReturnType<
        MeetingsService['getEntityTypeEntityIdMeetingsTemplate']
      >,
    );

    await TestBed.configureTestingModule({
      imports: [MeetingFormComponent, TranslateModule.forRoot()],
      providers: [
        { provide: MeetingsService, useValue: serviceSpy },
        { provide: Router, useValue: routerSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { paramMap: convertToParamMap({ entityType: 'groups', entityId: '1' }) },
          },
        },
        provideNoopAnimations(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MeetingFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should default the calendar id from the template', () => {
    expect(component).toBeTruthy();
    expect(serviceSpy.getEntityTypeEntityIdMeetingsTemplate).toHaveBeenCalledWith('groups', 1);
    expect(component.calendarId).toBe(7);
  });

  it('should post on create and navigate to the list', () => {
    serviceSpy.postEntityTypeEntityIdMeetings.and.returnValue(
      of({}) as unknown as ReturnType<MeetingsService['postEntityTypeEntityIdMeetings']>,
    );
    component.meetingDate = new Date(2026, 0, 15);
    component.calendarId = 7;
    component.onSubmit();
    expect(serviceSpy.postEntityTypeEntityIdMeetings).toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/meetings', 'groups', 1]);
  });
});
