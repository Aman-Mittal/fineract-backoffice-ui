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
import { CenterFormComponent } from './center-form.component';
import { CentersService, OfficesService } from '../../api';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { MatNativeDateModule } from '@angular/material/core';

describe('CenterFormComponent', () => {
  let component: CenterFormComponent;
  let fixture: ComponentFixture<CenterFormComponent>;
  let centersServiceSpy: jasmine.SpyObj<CentersService>;
  let officesServiceSpy: jasmine.SpyObj<OfficesService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    centersServiceSpy = jasmine.createSpyObj('CentersService', [
      'getCentersCenterId',
      'postCenters',
      'putCentersCenterId',
    ]);
    officesServiceSpy = jasmine.createSpyObj('OfficesService', ['getOffices']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [CenterFormComponent, TranslateModule.forRoot(), MatNativeDateModule],
      providers: [
        provideNoopAnimations(),
        { provide: CentersService, useValue: centersServiceSpy },
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
    officesServiceSpy.getOffices.and.returnValue(of([]) as any);
    fixture = TestBed.createComponent(CenterFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load offices on init', () => {
    expect(officesServiceSpy.getOffices).toHaveBeenCalledWith(true);
  });

  it('should format activationDate correctly on submit in create mode', () => {
    component.isEditMode = false;
    component.center = { name: 'Test Center', officeId: 1, active: true };
    const testDate = new Date(2026, 4, 9); // May 9, 2026
    component.activationDate = testDate;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    centersServiceSpy.postCenters.and.returnValue(of({}) as any);

    component.onSubmit();

    const expectedPayload = jasmine.objectContaining({
      name: 'Test Center',
      officeId: 1,
      active: true,
      activationDate: '2026-05-09',
      dateFormat: 'yyyy-MM-dd',
      locale: 'en',
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(centersServiceSpy.postCenters).toHaveBeenCalledWith(expectedPayload as any);
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/centers']);
  });

  it('should handle error on submit', () => {
    component.isEditMode = false;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    centersServiceSpy.postCenters.and.returnValue(throwError(() => new Error('API Error')) as any);

    component.onSubmit();

    expect(component.isSaving).toBeFalse();
  });

  it('should navigate to edit mode if id is present in route', () => {
    // Re-configure for edit mode test
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [CenterFormComponent, TranslateModule.forRoot(), MatNativeDateModule],
      providers: [
        provideNoopAnimations(),
        { provide: CentersService, useValue: centersServiceSpy },
        { provide: OfficesService, useValue: officesServiceSpy },
        { provide: Router, useValue: routerSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of({ get: (key: string) => (key === 'id' ? '123' : null) }),
          },
        },
      ],
    });

    const mockCenter = { id: 123, name: 'Existing Center', officeId: 1, active: true };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    centersServiceSpy.getCentersCenterId.and.returnValue(of(mockCenter) as any);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    officesServiceSpy.getOffices.and.returnValue(of([]) as any);

    const editFixture = TestBed.createComponent(CenterFormComponent);
    const editComponent = editFixture.componentInstance;
    editFixture.detectChanges();

    expect(editComponent.isEditMode).toBeTrue();
    expect(editComponent.centerId).toBe(123);
    expect(centersServiceSpy.getCentersCenterId).toHaveBeenCalledWith(123);
  });
});
