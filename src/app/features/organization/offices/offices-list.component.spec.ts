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
import { OfficesListComponent } from './offices-list.component';
import { OfficesService, GetOfficesResponse } from '../../../api';
import { Router } from '@angular/router';
import { of, throwError, Observable } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { provideNoopAnimations } from '@angular/platform-browser/animations';

describe('OfficesListComponent', () => {
  let component: OfficesListComponent;
  let fixture: ComponentFixture<OfficesListComponent>;
  let officesServiceSpy: jasmine.SpyObj<OfficesService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    officesServiceSpy = jasmine.createSpyObj('OfficesService', ['getOffices']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    officesServiceSpy.getOffices.and.returnValue(of([]) as unknown as Observable<never>);

    await TestBed.configureTestingModule({
      imports: [OfficesListComponent, TranslateModule.forRoot()],
      providers: [
        { provide: OfficesService, useValue: officesServiceSpy },
        { provide: Router, useValue: routerSpy },
        provideNoopAnimations(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(OfficesListComponent);
    component = fixture.componentInstance;
  });

  it('should create and load offices list', () => {
    const mockOffices = [
      {
        id: 1,
        name: 'Head Office',
        externalId: 'H1',
        openingDate: [2026, 6, 16] as unknown as number[],
      },
      {
        id: 2,
        name: 'Branch Office',
        externalId: 'B1',
        openingDate: [2026, 6, 17] as unknown as number[],
      },
    ];
    officesServiceSpy.getOffices.and.returnValue(of(mockOffices) as unknown as Observable<never>);

    fixture.detectChanges();

    expect(component).toBeTruthy();
    expect(officesServiceSpy.getOffices).toHaveBeenCalledWith(true);
    expect(component.offices).toEqual(mockOffices as unknown as GetOfficesResponse[]);
  });

  it('should handle error when loading offices', () => {
    officesServiceSpy.getOffices.and.returnValue(
      throwError(() => new Error('Error')) as unknown as Observable<never>,
    );
    spyOn(console, 'error');

    fixture.detectChanges();

    expect(component.offices).toEqual([]);
    expect(console.error).toHaveBeenCalledWith('Failed to load offices', jasmine.any(Error));
  });

  it('should navigate to create office page', () => {
    component.onCreateOffice();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/organization/offices/create']);
  });

  it('should navigate to edit office page', () => {
    const mockOffice = { id: 45, name: 'Edit Office' };
    component.onEditOffice(mockOffice);
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/organization/offices/edit', 45]);
  });

  it('should format array date correctly', () => {
    expect(component.formatArrayDate([2026, 5, 23])).toBe('2026-05-23');
    expect(component.formatArrayDate([2026, 12, 5])).toBe('2026-12-05');
    expect(component.formatArrayDate(null)).toBe('-');
    expect(component.formatArrayDate([])).toBe('-');
    expect(component.formatArrayDate([2026, 5])).toBe('-');
  });
});
