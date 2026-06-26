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
import { FloatingRateFormComponent } from './floating-rate-form.component';
import { FloatingRatesService } from '../../../api';
import { ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { of } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { provideNoopAnimations } from '@angular/platform-browser/animations';

describe('FloatingRateFormComponent', () => {
  let component: FloatingRateFormComponent;
  let fixture: ComponentFixture<FloatingRateFormComponent>;
  let serviceSpy: jasmine.SpyObj<FloatingRatesService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    serviceSpy = jasmine.createSpyObj('FloatingRatesService', [
      'getFloatingratesFloatingRateId',
      'postFloatingrates',
      'putFloatingratesFloatingRateId',
    ]);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [FloatingRateFormComponent, TranslateModule.forRoot()],
      providers: [
        { provide: FloatingRatesService, useValue: serviceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: { paramMap: of(convertToParamMap({})) } },
        provideNoopAnimations(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FloatingRateFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create in add mode', () => {
    expect(component).toBeTruthy();
    expect(component.isEditMode).toBeFalse();
  });

  it('should add and remove rate periods', () => {
    expect(component.periods.length).toBe(0);
    component.addPeriod();
    component.addPeriod();
    expect(component.periods.length).toBe(2);
    component.removePeriod(0);
    expect(component.periods.length).toBe(1);
  });

  it('should post a floating rate with mapped rate periods', () => {
    serviceSpy.postFloatingrates.and.returnValue(
      of({}) as unknown as ReturnType<FloatingRatesService['postFloatingrates']>,
    );
    component.rate = { name: 'BLR', isBaseLendingRate: true, isActive: true };
    component.periods = [
      { fromDate: new Date(2026, 0, 1), interestRate: 9.5, isDifferentialToBaseLendingRate: false },
    ];

    component.onSubmit();

    const arg = serviceSpy.postFloatingrates.calls.mostRecent().args[0];
    expect(arg.name).toBe('BLR');
    expect(arg.ratePeriods?.length).toBe(1);
    expect(arg.ratePeriods?.[0].interestRate).toBe(9.5);
    expect(arg.ratePeriods?.[0].fromDate).toBeTruthy();
  });
});
