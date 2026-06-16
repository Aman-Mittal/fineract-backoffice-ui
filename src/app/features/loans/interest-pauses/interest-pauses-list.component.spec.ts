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
import { InterestPausesListComponent } from './interest-pauses-list.component';
import { LoanInterestPauseService } from '../../../api';
import { ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { of } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { provideNoopAnimations } from '@angular/platform-browser/animations';

describe('InterestPausesListComponent', () => {
  let component: InterestPausesListComponent;
  let fixture: ComponentFixture<InterestPausesListComponent>;
  let serviceSpy: jasmine.SpyObj<LoanInterestPauseService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    serviceSpy = jasmine.createSpyObj('LoanInterestPauseService', [
      'getLoansLoanIdInterestPauses',
      'deleteLoansLoanIdInterestPausesVariationId',
    ]);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    serviceSpy.getLoansLoanIdInterestPauses.and.returnValue(
      of([
        { id: 1, startDate: '1 January 2026', endDate: '1 February 2026' },
      ]) as unknown as ReturnType<LoanInterestPauseService['getLoansLoanIdInterestPauses']>,
    );

    await TestBed.configureTestingModule({
      imports: [InterestPausesListComponent, TranslateModule.forRoot()],
      providers: [
        { provide: LoanInterestPauseService, useValue: serviceSpy },
        { provide: Router, useValue: routerSpy },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: convertToParamMap({ loanId: '1' }) } },
        },
        provideNoopAnimations(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(InterestPausesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should load interest pauses on init', () => {
    expect(component).toBeTruthy();
    expect(component.loanId).toBe(1);
    expect(serviceSpy.getLoansLoanIdInterestPauses).toHaveBeenCalledWith(1);
    expect(component.pauses.length).toBe(1);
  });

  it('should navigate to create', () => {
    component.onCreate();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/loans', 1, 'interest-pauses', 'create']);
  });

  it('should delete after confirmation and reload', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    serviceSpy.deleteLoansLoanIdInterestPausesVariationId.and.returnValue(
      of({}) as unknown as ReturnType<
        LoanInterestPauseService['deleteLoansLoanIdInterestPausesVariationId']
      >,
    );

    component.onDelete({ id: 5 });

    expect(serviceSpy.deleteLoansLoanIdInterestPausesVariationId).toHaveBeenCalledWith(1, 5);
    expect(serviceSpy.getLoansLoanIdInterestPauses).toHaveBeenCalledTimes(2);
  });

  it('should not delete when cancelled', () => {
    spyOn(window, 'confirm').and.returnValue(false);
    component.onDelete({ id: 5 });
    expect(serviceSpy.deleteLoansLoanIdInterestPausesVariationId).not.toHaveBeenCalled();
  });
});
