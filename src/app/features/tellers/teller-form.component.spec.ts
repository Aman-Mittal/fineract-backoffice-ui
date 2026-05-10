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
import { TellerFormComponent } from './teller-form.component';
import { TellerCashManagementService, OfficesService, PostTellersRequest } from '../../api';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatNativeDateModule } from '@angular/material/core';

describe('TellerFormComponent', () => {
  let component: TellerFormComponent;
  let fixture: ComponentFixture<TellerFormComponent>;
  let tellerServiceSpy: jasmine.SpyObj<TellerCashManagementService>;
  let officesServiceSpy: jasmine.SpyObj<OfficesService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    tellerServiceSpy = jasmine.createSpyObj('TellerCashManagementService', [
      'findTeller',
      'createTeller',
      'updateTeller',
      'template12',
    ]);
    officesServiceSpy = jasmine.createSpyObj('OfficesService', ['retrieveOffices']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [
        TellerFormComponent,
        TranslateModule.forRoot(),
        NoopAnimationsModule,
        MatNativeDateModule,
      ],
      providers: [
        { provide: TellerCashManagementService, useValue: tellerServiceSpy },
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
    fixture = TestBed.createComponent(TellerFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should format payload with numeric status and yyyy-MM-dd date', () => {
    component.isEditMode = false;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    component.teller = { name: 'Test Teller', officeId: 1, status: 'ACTIVE' as any };
    component.startDate = new Date(2026, 4, 9);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    tellerServiceSpy.createTeller.and.returnValue(of({}) as any);

    component.onSubmit();

    const expectedPayload = jasmine.objectContaining({
      name: 'Test Teller',
      officeId: 1,
      status: 300, // Numeric for Active
      startDate: '2026-05-09',
      dateFormat: 'yyyy-MM-dd',
      locale: 'en',
    });

    expect(tellerServiceSpy.createTeller).toHaveBeenCalledWith(
      expectedPayload as PostTellersRequest,
    );
  });
});
