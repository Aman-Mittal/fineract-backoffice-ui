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
import { PaymentTypesListComponent } from './payment-types-list.component';
import { PaymentTypeService } from '../../../api';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { provideNoopAnimations } from '@angular/platform-browser/animations';

describe('PaymentTypesListComponent', () => {
  let component: PaymentTypesListComponent;
  let fixture: ComponentFixture<PaymentTypesListComponent>;
  let paymentTypeServiceSpy: jasmine.SpyObj<PaymentTypeService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    paymentTypeServiceSpy = jasmine.createSpyObj('PaymentTypeService', [
      'getPaymenttypes',
      'deletePaymenttypesPaymentTypeId',
    ]);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    paymentTypeServiceSpy.getPaymenttypes.and.returnValue(
      of([
        { id: 1, name: 'Cash', isCashPayment: true, isSystemDefined: false },
      ]) as unknown as ReturnType<PaymentTypeService['getPaymenttypes']>,
    );

    await TestBed.configureTestingModule({
      imports: [PaymentTypesListComponent, TranslateModule.forRoot()],
      providers: [
        { provide: PaymentTypeService, useValue: paymentTypeServiceSpy },
        { provide: Router, useValue: routerSpy },
        provideNoopAnimations(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PaymentTypesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should load payment types on init', () => {
    expect(component).toBeTruthy();
    expect(paymentTypeServiceSpy.getPaymenttypes).toHaveBeenCalled();
    expect(component.paymentTypes.length).toBe(1);
  });

  it('should delete after confirmation and reload', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    paymentTypeServiceSpy.deletePaymenttypesPaymentTypeId.and.returnValue(
      of({}) as unknown as ReturnType<PaymentTypeService['deletePaymenttypesPaymentTypeId']>,
    );

    component.onDelete({ id: 5, name: 'Cheque' });

    expect(paymentTypeServiceSpy.deletePaymenttypesPaymentTypeId).toHaveBeenCalledWith(5);
    expect(paymentTypeServiceSpy.getPaymenttypes).toHaveBeenCalledTimes(2);
  });

  it('should not delete when cancelled', () => {
    spyOn(window, 'confirm').and.returnValue(false);
    component.onDelete({ id: 5, name: 'Cheque' });
    expect(paymentTypeServiceSpy.deletePaymenttypesPaymentTypeId).not.toHaveBeenCalled();
  });
});
