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
import { RatesListComponent } from './rates-list.component';
import { RateService } from '../../../api';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { provideNoopAnimations } from '@angular/platform-browser/animations';

describe('RatesListComponent', () => {
  let component: RatesListComponent;
  let fixture: ComponentFixture<RatesListComponent>;
  let serviceSpy: jasmine.SpyObj<RateService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    serviceSpy = jasmine.createSpyObj('RateService', ['getRates']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    serviceSpy.getRates.and.returnValue(
      of([{ id: 1, name: 'Base Rate', percentage: 5, active: true }]) as unknown as ReturnType<
        RateService['getRates']
      >,
    );

    await TestBed.configureTestingModule({
      imports: [RatesListComponent, TranslateModule.forRoot()],
      providers: [
        { provide: RateService, useValue: serviceSpy },
        { provide: Router, useValue: routerSpy },
        provideNoopAnimations(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RatesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should load rates on init', () => {
    expect(component).toBeTruthy();
    expect(serviceSpy.getRates).toHaveBeenCalled();
    expect(component.rates.length).toBe(1);
  });

  it('should navigate to create', () => {
    component.onCreate();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/products/rates/create']);
  });

  it('should navigate to edit with the rate id', () => {
    component.onEdit({ id: 3, name: 'X' });
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/products/rates/edit', 3]);
  });
});
