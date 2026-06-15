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
import { StaffFormComponent } from './staff-form.component';
import { StaffService, OfficesService } from '../../../api';
import { ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { of } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { MatNativeDateModule } from '@angular/material/core';
import {
  formatDateToFineract,
  FINERACT_DATE_FORMAT,
  FINERACT_LOCALE,
} from '../../../core/utils/date-formatter';

describe('StaffFormComponent', () => {
  let component: StaffFormComponent;
  let fixture: ComponentFixture<StaffFormComponent>;
  let staffServiceSpy: jasmine.SpyObj<StaffService>;
  let officesServiceSpy: jasmine.SpyObj<OfficesService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    staffServiceSpy = jasmine.createSpyObj('StaffService', [
      'getStaffStaffId',
      'putStaffStaffId',
      'postStaff',
    ]);
    officesServiceSpy = jasmine.createSpyObj('OfficesService', ['getOffices']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    officesServiceSpy.getOffices.and.returnValue(
      of([]) as unknown as ReturnType<OfficesService['getOffices']>,
    );

    await TestBed.configureTestingModule({
      imports: [StaffFormComponent, TranslateModule.forRoot(), MatNativeDateModule],
      providers: [
        { provide: StaffService, useValue: staffServiceSpy },
        { provide: OfficesService, useValue: officesServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: convertToParamMap({}) } } },
        provideNoopAnimations(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(StaffFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load offices on init', () => {
    expect(officesServiceSpy.getOffices).toHaveBeenCalled();
  });

  it('should create staff with a StaffCreateRequest payload on submit', () => {
    staffServiceSpy.postStaff.and.returnValue(
      of({}) as unknown as ReturnType<StaffService['postStaff']>,
    );
    component.staff = { officeId: 1, firstname: 'Ada', lastname: 'Lovelace', isLoanOfficer: true };
    component.joiningDate = new Date(2026, 0, 15);

    component.onSubmit();

    expect(staffServiceSpy.postStaff).toHaveBeenCalledWith(
      jasmine.objectContaining({
        officeId: 1,
        firstname: 'Ada',
        lastname: 'Lovelace',
        joiningDate: formatDateToFineract(new Date(2026, 0, 15)),
        dateFormat: FINERACT_DATE_FORMAT,
        locale: FINERACT_LOCALE,
      }),
    );
    expect(staffServiceSpy.putStaffStaffId).not.toHaveBeenCalled();
  });
});
