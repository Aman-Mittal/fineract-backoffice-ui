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
import { TaxComponentFormComponent } from './tax-component-form.component';
import { TaxComponentsService } from '../../../api';
import { ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { of } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { provideNoopAnimations } from '@angular/platform-browser/animations';

describe('TaxComponentFormComponent', () => {
  let component: TaxComponentFormComponent;
  let fixture: ComponentFixture<TaxComponentFormComponent>;
  let serviceSpy: jasmine.SpyObj<TaxComponentsService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    serviceSpy = jasmine.createSpyObj('TaxComponentsService', [
      'getTaxesComponentTaxComponentId',
      'postTaxesComponent',
      'putTaxesComponentTaxComponentId',
    ]);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [TaxComponentFormComponent, TranslateModule.forRoot()],
      providers: [
        { provide: TaxComponentsService, useValue: serviceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: { paramMap: of(convertToParamMap({})) } },
        provideNoopAnimations(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TaxComponentFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create in add mode', () => {
    expect(component).toBeTruthy();
    expect(component.isEditMode).toBeFalse();
  });

  it('should post a tax component with a start date on create', () => {
    serviceSpy.postTaxesComponent.and.returnValue(
      of({}) as unknown as ReturnType<TaxComponentsService['postTaxesComponent']>,
    );
    component.component = { name: 'GST', percentage: 18 };
    component.startDate = new Date(2026, 0, 1);

    component.onSubmit();

    expect(serviceSpy.postTaxesComponent).toHaveBeenCalledWith(
      jasmine.objectContaining({ name: 'GST', percentage: 18, locale: 'en' }),
    );
    const arg = serviceSpy.postTaxesComponent.calls.mostRecent().args[0];
    expect(arg.startDate).toBeTruthy();
  });
});
