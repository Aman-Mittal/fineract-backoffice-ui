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
import { LoanProductDetailsComponent } from './loan-product-details.component';
import { LoanProductsDetailsService } from '../../../api';
import { of } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { provideNoopAnimations } from '@angular/platform-browser/animations';

describe('LoanProductDetailsComponent', () => {
  let component: LoanProductDetailsComponent;
  let fixture: ComponentFixture<LoanProductDetailsComponent>;
  let serviceSpy: jasmine.SpyObj<LoanProductsDetailsService>;

  beforeEach(async () => {
    serviceSpy = jasmine.createSpyObj('LoanProductsDetailsService', [
      'getLoanproductsBasicDetails',
    ]);
    serviceSpy.getLoanproductsBasicDetails.and.returnValue(
      of([{ id: 1, name: 'Standard Loan', shortName: 'STD' }]) as unknown as ReturnType<
        LoanProductsDetailsService['getLoanproductsBasicDetails']
      >,
    );

    await TestBed.configureTestingModule({
      imports: [LoanProductDetailsComponent, TranslateModule.forRoot()],
      providers: [
        { provide: LoanProductsDetailsService, useValue: serviceSpy },
        provideNoopAnimations(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoanProductDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should load loan product basic details on init', () => {
    expect(component).toBeTruthy();
    expect(serviceSpy.getLoanproductsBasicDetails).toHaveBeenCalled();
    expect(component.details.length).toBe(1);
  });
});
