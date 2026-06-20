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
import { StaffListComponent } from './staff-list.component';
import { StaffService, StaffData } from '../../../api';
import { of, throwError, Observable } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';
import { provideNoopAnimations } from '@angular/platform-browser/animations';

describe('StaffListComponent', () => {
  let component: StaffListComponent;
  let fixture: ComponentFixture<StaffListComponent>;
  let staffServiceSpy: jasmine.SpyObj<StaffService>;

  beforeEach(async () => {
    staffServiceSpy = jasmine.createSpyObj('StaffService', ['getStaff']);
    staffServiceSpy.getStaff.and.returnValue(of([]) as unknown as Observable<never>);

    await TestBed.configureTestingModule({
      imports: [StaffListComponent, TranslateModule.forRoot()],
      providers: [
        { provide: StaffService, useValue: staffServiceSpy },
        { provide: ActivatedRoute, useValue: {} },
        provideNoopAnimations(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(StaffListComponent);
    component = fixture.componentInstance;
  });

  it('should create and load staff', () => {
    const mockStaff = [
      {
        id: 1,
        displayName: 'Staff 1',
        officeName: 'Head Office',
        isLoanOfficer: true,
        isActive: true,
      },
      {
        id: 2,
        displayName: 'Staff 2',
        officeName: 'Branch 1',
        isLoanOfficer: false,
        isActive: false,
      },
    ];
    staffServiceSpy.getStaff.and.returnValue(of(mockStaff) as unknown as Observable<never>);

    fixture.detectChanges();

    expect(component).toBeTruthy();
    expect(staffServiceSpy.getStaff).toHaveBeenCalledWith(undefined, undefined, undefined, 'all');
    expect(component.staff()).toEqual(mockStaff as unknown as StaffData[]);
    expect(component.isLoading()).toBeFalse();
  });

  it('should handle error when loading staff', () => {
    staffServiceSpy.getStaff.and.returnValue(
      throwError(() => new Error('Error loading staff')) as unknown as Observable<never>,
    );
    spyOn(console, 'error');

    fixture.detectChanges();

    expect(component.isLoading()).toBeFalse();
    expect(console.error).toHaveBeenCalledWith('Failed to load staff', jasmine.any(Error));
  });
});
