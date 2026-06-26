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
import { OfficeFormComponent } from './office-form.component';
import { OfficesService } from '../../../api';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError, Observable } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { MatNativeDateModule } from '@angular/material/core';

describe('OfficeFormComponent', () => {
  let component: OfficeFormComponent;
  let fixture: ComponentFixture<OfficeFormComponent>;
  let officesServiceSpy: jasmine.SpyObj<OfficesService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let activatedRouteParams: Observable<unknown>;

  const OFFICES_PATH = '/organization/offices';
  const NEW_OFFICE = 'New Office';
  const TEST_OFFICE = 'Test Office';

  beforeEach(async () => {
    officesServiceSpy = jasmine.createSpyObj('OfficesService', [
      'getOffices',
      'getOfficesOfficeId',
      'putOfficesOfficeId',
      'postOffices',
    ]);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    officesServiceSpy.getOffices.and.returnValue(of([]) as unknown as Observable<never>);
    officesServiceSpy.getOfficesOfficeId.and.returnValue(
      of({
        id: 12,
        name: TEST_OFFICE,
        externalId: 'ext12',
        openingDate: [2026, 6, 16] as unknown as number[],
      }) as unknown as Observable<never>,
    );

    activatedRouteParams = of({
      get: () => null,
    });

    await TestBed.configureTestingModule({
      imports: [OfficeFormComponent, TranslateModule.forRoot(), MatNativeDateModule],
      providers: [
        { provide: OfficesService, useValue: officesServiceSpy },
        { provide: Router, useValue: routerSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: activatedRouteParams,
          },
        },
        provideNoopAnimations(),
      ],
    }).compileComponents();
  });

  describe('Create Mode', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(OfficeFormComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should create and load offices', () => {
      expect(component).toBeTruthy();
      expect(officesServiceSpy.getOffices).toHaveBeenCalledWith(true);
      expect(component.isEditMode).toBeFalse();
    });

    it('should submit form in create mode', () => {
      officesServiceSpy.postOffices.and.returnValue(of({}) as unknown as Observable<never>);
      component.office = {
        name: NEW_OFFICE,
        parentId: 1,
        externalId: 'extNew',
      };
      component.openingDate = new Date(2026, 5, 15);

      component.onSubmit();

      expect(component.isSaving).toBeTrue();
      expect(officesServiceSpy.postOffices).toHaveBeenCalledWith({
        name: NEW_OFFICE,
        parentId: 1,
        externalId: 'extNew',
        openingDate: '2026-06-15',
        dateFormat: 'yyyy-MM-dd',
        locale: 'en',
      });
      expect(routerSpy.navigate).toHaveBeenCalledWith([OFFICES_PATH]);
    });

    it('should handle error in create mode', () => {
      officesServiceSpy.postOffices.and.returnValue(
        throwError(() => new Error('Error')) as unknown as Observable<never>,
      );
      component.office = {
        name: NEW_OFFICE,
      };
      component.onSubmit();
      expect(component.isSaving).toBeFalse();
    });

    it('should navigate away on cancel', () => {
      component.onCancel();
      expect(routerSpy.navigate).toHaveBeenCalledWith([OFFICES_PATH]);
    });
  });

  describe('Edit Mode', () => {
    beforeEach(() => {
      // Re-configure module to provide activated route parameter for edit mode
      TestBed.resetTestingModule();
    });

    it('should load office details and support update', async () => {
      const editParams = of({
        get: (key: string) => (key === 'id' ? '12' : null),
      });

      await TestBed.configureTestingModule({
        imports: [OfficeFormComponent, TranslateModule.forRoot(), MatNativeDateModule],
        providers: [
          { provide: OfficesService, useValue: officesServiceSpy },
          { provide: Router, useValue: routerSpy },
          {
            provide: ActivatedRoute,
            useValue: {
              paramMap: editParams,
            },
          },
          provideNoopAnimations(),
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(OfficeFormComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();

      expect(component.isEditMode).toBeTrue();
      expect(component.officeId).toBe(12);
      expect(officesServiceSpy.getOfficesOfficeId).toHaveBeenCalledWith(12);
      expect(component.office.name).toBe(TEST_OFFICE);

      officesServiceSpy.putOfficesOfficeId.and.returnValue(of({}) as unknown as Observable<never>);
      component.openingDate = new Date(2026, 5, 16);
      component.onSubmit();

      expect(officesServiceSpy.putOfficesOfficeId).toHaveBeenCalledWith(
        12,
        jasmine.objectContaining({
          name: TEST_OFFICE,
          openingDate: '2026-06-16',
        }),
      );
    });
  });
});
