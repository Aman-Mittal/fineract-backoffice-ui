/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  See the License for the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
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
import { HolidaysListComponent } from './holidays-list.component';
import { HolidaysService, OfficesService, GetHolidaysResponse } from '../../api';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of, throwError, Observable } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { provideNoopAnimations } from '@angular/platform-browser/animations';

describe('HolidaysListComponent', () => {
  let component: HolidaysListComponent;
  let fixture: ComponentFixture<HolidaysListComponent>;
  let holidaysServiceSpy: jasmine.SpyObj<HolidaysService>;
  let officesServiceSpy: jasmine.SpyObj<OfficesService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let dialogSpy: jasmine.SpyObj<MatDialog>;
  let snackBarSpy: jasmine.SpyObj<MatSnackBar>;

  beforeEach(async () => {
    holidaysServiceSpy = jasmine.createSpyObj('HolidaysService', [
      'getHolidays',
      'postHolidaysHolidayId',
    ]);
    officesServiceSpy = jasmine.createSpyObj('OfficesService', ['getOffices']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
    snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);

    officesServiceSpy.getOffices.and.returnValue(
      of([{ id: 1, name: 'Head Office' }]) as unknown as Observable<never>,
    );
    holidaysServiceSpy.getHolidays.and.returnValue(of([]) as unknown as Observable<never>);

    await TestBed.configureTestingModule({
      imports: [HolidaysListComponent, TranslateModule.forRoot()],
      providers: [
        { provide: HolidaysService, useValue: holidaysServiceSpy },
        { provide: OfficesService, useValue: officesServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: MatDialog, useValue: dialogSpy },
        { provide: MatSnackBar, useValue: snackBarSpy },
        provideNoopAnimations(),
      ],
    })
      .overrideComponent(HolidaysListComponent, {
        add: {
          providers: [
            { provide: MatDialog, useValue: dialogSpy },
            { provide: MatSnackBar, useValue: snackBarSpy },
          ],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(HolidaysListComponent);
    component = fixture.componentInstance;
  });

  it('should create and load offices and holidays on init', () => {
    const mockHolidays = [
      {
        id: 1,
        name: 'New Year',
        fromDate: [2026, 1, 1] as unknown as number[],
        toDate: [2026, 1, 1] as unknown as number[],
        status: { code: 'holidayStatusType.active' },
      },
    ];
    holidaysServiceSpy.getHolidays.and.returnValue(
      of(mockHolidays) as unknown as Observable<never>,
    );

    fixture.detectChanges();

    expect(component).toBeTruthy();
    expect(officesServiceSpy.getOffices).toHaveBeenCalledWith(true);
    expect(holidaysServiceSpy.getHolidays).toHaveBeenCalledWith(1);
    expect(component.holidays).toEqual(mockHolidays as unknown as GetHolidaysResponse[]);
  });

  it('should load holidays for a different office on change', () => {
    fixture.detectChanges();
    component.onOfficeChange(5);
    expect(component.selectedOfficeId).toBe(5);
    expect(holidaysServiceSpy.getHolidays).toHaveBeenCalledWith(5);
  });

  it('should navigate to create holiday page', () => {
    component.onCreateHoliday();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/settings/holidays/create']);
  });

  it('should format array date correctly', () => {
    expect(component.formatArrayDate([2026, 10, 5])).toBe('2026-10-05');
    expect(component.formatArrayDate(null)).toBe('-');
  });

  it('should activate holiday on dialog confirmation', () => {
    fixture.detectChanges();
    const holiday = {
      id: 10,
      name: 'Holiday to activate',
      status: { code: 'holidayStatusType.pending.for.activation' },
    };
    const dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['afterClosed']);
    dialogRefSpy.afterClosed.and.returnValue(of(true));
    dialogSpy.open.and.returnValue(dialogRefSpy);
    holidaysServiceSpy.postHolidaysHolidayId.and.returnValue(
      of({}) as unknown as Observable<never>,
    );

    component.onActivateHoliday(holiday);

    expect(dialogSpy.open).toHaveBeenCalled();
    expect(holidaysServiceSpy.postHolidaysHolidayId).toHaveBeenCalledWith(10, {}, 'activate');
    expect(snackBarSpy.open).toHaveBeenCalledWith(
      'Holiday activated successfully',
      'Close',
      jasmine.any(Object),
    );
  });

  it('should handle activation error', () => {
    fixture.detectChanges();
    const holiday = {
      id: 10,
      name: 'Holiday to activate',
      status: { code: 'holidayStatusType.pending.for.activation' },
    };
    const dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['afterClosed']);
    dialogRefSpy.afterClosed.and.returnValue(of(true));
    dialogSpy.open.and.returnValue(dialogRefSpy);
    holidaysServiceSpy.postHolidaysHolidayId.and.returnValue(
      throwError(() => new Error('Error')) as unknown as Observable<never>,
    );
    spyOn(console, 'error');

    component.onActivateHoliday(holiday);

    expect(console.error).toHaveBeenCalled();
    expect(snackBarSpy.open).toHaveBeenCalledWith(
      'Failed to activate holiday',
      'Close',
      jasmine.any(Object),
    );
  });
});
