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
import { GroupFormComponent } from './group-form.component';
import { GroupsService, OfficesService } from '../../api';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatNativeDateModule } from '@angular/material/core';

describe('GroupFormComponent', () => {
  let component: GroupFormComponent;
  let fixture: ComponentFixture<GroupFormComponent>;
  let groupsServiceSpy: jasmine.SpyObj<GroupsService>;
  let officesServiceSpy: jasmine.SpyObj<OfficesService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    groupsServiceSpy = jasmine.createSpyObj('GroupsService', [
      'retrieveOne15',
      'create8',
      'update13',
    ]);
    officesServiceSpy = jasmine.createSpyObj('OfficesService', ['retrieveOffices']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [
        GroupFormComponent,
        TranslateModule.forRoot(),
        NoopAnimationsModule,
        MatNativeDateModule,
      ],
      providers: [
        { provide: GroupsService, useValue: groupsServiceSpy },
        { provide: OfficesService, useValue: officesServiceSpy },
        { provide: Router, useValue: routerSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of({ get: () => null }),
          },
        },
      ],
    }).compileComponents();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    officesServiceSpy.retrieveOffices.and.returnValue(of([]) as any);
    fixture = TestBed.createComponent(GroupFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load offices on init', () => {
    expect(officesServiceSpy.retrieveOffices).toHaveBeenCalledWith(true);
  });

  it('should format activationDate correctly on submit in create mode', () => {
    component.isEditMode = false;
    component.group = { name: 'Test Group', officeId: 1, active: true };
    const testDate = new Date(2026, 4, 9); // May 9, 2026
    component.activationDate = testDate;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    groupsServiceSpy.create8.and.returnValue(of({}) as any);

    component.onSubmit();

    const expectedPayload = jasmine.objectContaining({
      name: 'Test Group',
      officeId: 1,
      active: true,
      activationDate: '2026-05-09',
      dateFormat: 'yyyy-MM-dd',
      locale: 'en',
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(groupsServiceSpy.create8).toHaveBeenCalledWith(expectedPayload as any);
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/groups']);
  });

  it('should handle error on submit', () => {
    component.isEditMode = false;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    groupsServiceSpy.create8.and.returnValue(throwError(() => new Error('API Error')) as any);

    component.onSubmit();

    expect(component.isSaving).toBeFalse();
  });
});
