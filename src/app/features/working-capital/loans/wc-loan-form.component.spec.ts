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
import { WcLoanFormComponent } from './wc-loan-form.component';
import { WorkingCapitalLoansService } from '../../../api';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { provideNoopAnimations } from '@angular/platform-browser/animations';

describe('WcLoanFormComponent', () => {
  let component: WcLoanFormComponent;
  let fixture: ComponentFixture<WcLoanFormComponent>;
  let serviceSpy: jasmine.SpyObj<WorkingCapitalLoansService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    serviceSpy = jasmine.createSpyObj('WorkingCapitalLoansService', [
      'getWorkingCapitalLoansTemplate',
      'postWorkingCapitalLoans',
    ]);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    serviceSpy.getWorkingCapitalLoansTemplate.and.returnValue(
      of({
        productOptions: [{ id: 1, name: 'WC Product' }],
        breachOptions: [{ id: 2, name: 'Covenant A' }],
        periodFrequencyTypeOptions: [{ id: '0', code: 'DAYS', value: 'Days' }],
      }) as unknown as ReturnType<WorkingCapitalLoansService['getWorkingCapitalLoansTemplate']>,
    );

    await TestBed.configureTestingModule({
      imports: [WcLoanFormComponent, TranslateModule.forRoot()],
      providers: [
        { provide: WorkingCapitalLoansService, useValue: serviceSpy },
        { provide: Router, useValue: routerSpy },
        provideNoopAnimations(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(WcLoanFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should load template options on init', () => {
    expect(component).toBeTruthy();
    expect(serviceSpy.getWorkingCapitalLoansTemplate).toHaveBeenCalled();
    expect(component.productOptions.length).toBe(1);
    expect(component.breachOptions.length).toBe(1);
    expect(component.repaymentFrequencyTypeOptions.length).toBe(1);
  });

  it('should post on submit and navigate to the list', () => {
    serviceSpy.postWorkingCapitalLoans.and.returnValue(
      of({}) as unknown as ReturnType<WorkingCapitalLoansService['postWorkingCapitalLoans']>,
    );
    component.loan = { clientId: 7, productId: 1, principalAmount: 5000 };
    component.onSubmit();
    expect(serviceSpy.postWorkingCapitalLoans).toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/working-capital/loans']);
  });

  it('should format provided dates into the request', () => {
    serviceSpy.postWorkingCapitalLoans.and.returnValue(
      of({}) as unknown as ReturnType<WorkingCapitalLoansService['postWorkingCapitalLoans']>,
    );
    component.loan = { clientId: 7, productId: 1, principalAmount: 5000 };
    component.submittedOnDate = new Date(2026, 0, 15);
    component.onSubmit();
    const arg = serviceSpy.postWorkingCapitalLoans.calls.mostRecent().args[0];
    expect(arg.submittedOnDate).toBe('15 January 2026');
    expect(arg.locale).toBe('en');
  });
});
