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
import { AccountingClosureFormComponent } from './accounting-closure-form.component';
import {
  AccountingClosureService,
  OfficesService,
  GetOfficesResponse,
  PostGlClosuresResponse,
} from '../../api';
import { Router } from '@angular/router';
import { of, Observable } from 'rxjs';
import { HttpEvent } from '@angular/common/http';
import { TranslateModule } from '@ngx-translate/core';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { MatNativeDateModule } from '@angular/material/core';

describe('AccountingClosureFormComponent', () => {
  let component: AccountingClosureFormComponent;
  let fixture: ComponentFixture<AccountingClosureFormComponent>;
  let closureServiceSpy: jasmine.SpyObj<AccountingClosureService>;
  let officeServiceSpy: jasmine.SpyObj<OfficesService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    closureServiceSpy = jasmine.createSpyObj('AccountingClosureService', ['createGLClosure']);
    officeServiceSpy = jasmine.createSpyObj('OfficesService', ['retrieveOffices']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [
        AccountingClosureFormComponent,
        TranslateModule.forRoot(),
        MatNativeDateModule,
      ],
      providers: [
        { provide: AccountingClosureService, useValue: closureServiceSpy },
        { provide: OfficesService, useValue: officeServiceSpy },
        { provide: Router, useValue: routerSpy },
        provideNoopAnimations(),
      ],
    }).compileComponents();
    officeServiceSpy.retrieveOffices.and.returnValue(
      of([]) as unknown as Observable<HttpEvent<GetOfficesResponse[]>>,
    );
    fixture = TestBed.createComponent(AccountingClosureFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should format payload correctly on submission', () => {
    component.request.officeId = 1;
    component.closingDate = new Date(2026, 4, 31);
    component.request.comments = 'Monthly closure';

    closureServiceSpy.createGLClosure.and.returnValue(
      of({}) as unknown as Observable<HttpEvent<PostGlClosuresResponse>>,
    );

    component.onSubmit();

    expect(closureServiceSpy.createGLClosure).toHaveBeenCalledWith(
      jasmine.objectContaining({
        officeId: 1,
        closingDate: '2026-05-31',
        comments: 'Monthly closure',
        dateFormat: 'yyyy-MM-dd',
        locale: 'en',
      }),
    );
  });
});
