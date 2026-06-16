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
import { GuarantorsListComponent } from './guarantors-list.component';
import { GuarantorsService } from '../../../api';
import { ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { of } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { provideNoopAnimations } from '@angular/platform-browser/animations';

describe('GuarantorsListComponent', () => {
  let component: GuarantorsListComponent;
  let fixture: ComponentFixture<GuarantorsListComponent>;
  let serviceSpy: jasmine.SpyObj<GuarantorsService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    serviceSpy = jasmine.createSpyObj('GuarantorsService', [
      'getLoansLoanIdGuarantors',
      'deleteLoansLoanIdGuarantorsGuarantorId',
    ]);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    serviceSpy.getLoansLoanIdGuarantors.and.returnValue(
      of([{ id: 1, firstname: 'John', lastname: 'Doe', status: true }]) as unknown as ReturnType<
        GuarantorsService['getLoansLoanIdGuarantors']
      >,
    );

    await TestBed.configureTestingModule({
      imports: [GuarantorsListComponent, TranslateModule.forRoot()],
      providers: [
        { provide: GuarantorsService, useValue: serviceSpy },
        { provide: Router, useValue: routerSpy },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: convertToParamMap({ loanId: '1' }) } },
        },
        provideNoopAnimations(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(GuarantorsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should load guarantors on init', () => {
    expect(component).toBeTruthy();
    expect(serviceSpy.getLoansLoanIdGuarantors).toHaveBeenCalledWith(1);
    expect(component.guarantors.length).toBe(1);
  });

  it('should delete after confirmation and reload', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    serviceSpy.deleteLoansLoanIdGuarantorsGuarantorId.and.returnValue(
      of({}) as unknown as ReturnType<GuarantorsService['deleteLoansLoanIdGuarantorsGuarantorId']>,
    );

    component.onDelete({ id: 5, firstname: 'Y' });

    expect(serviceSpy.deleteLoansLoanIdGuarantorsGuarantorId).toHaveBeenCalledWith(1, 5);
    expect(serviceSpy.getLoansLoanIdGuarantors).toHaveBeenCalledTimes(2);
  });

  it('should not delete when cancelled', () => {
    spyOn(window, 'confirm').and.returnValue(false);
    component.onDelete({ id: 5, firstname: 'Y' });
    expect(serviceSpy.deleteLoansLoanIdGuarantorsGuarantorId).not.toHaveBeenCalled();
  });
});
