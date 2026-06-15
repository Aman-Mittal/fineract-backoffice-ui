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
import { TaxGroupFormComponent } from './tax-group-form.component';
import { TaxGroupService } from '../../../api';
import { ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { of } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { provideNoopAnimations } from '@angular/platform-browser/animations';

describe('TaxGroupFormComponent', () => {
  let component: TaxGroupFormComponent;
  let fixture: ComponentFixture<TaxGroupFormComponent>;
  let serviceSpy: jasmine.SpyObj<TaxGroupService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    serviceSpy = jasmine.createSpyObj('TaxGroupService', [
      'getTaxesGroupTemplate',
      'getTaxesGroupTaxGroupId',
      'postTaxesGroup',
      'putTaxesGroupTaxGroupId',
    ]);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    serviceSpy.getTaxesGroupTemplate.and.returnValue(
      of({ taxComponents: [{ id: 1, name: 'VAT' }] }) as unknown as ReturnType<
        TaxGroupService['getTaxesGroupTemplate']
      >,
    );

    await TestBed.configureTestingModule({
      imports: [TaxGroupFormComponent, TranslateModule.forRoot()],
      providers: [
        { provide: TaxGroupService, useValue: serviceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: { paramMap: of(convertToParamMap({})) } },
        provideNoopAnimations(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TaxGroupFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should load the component template on init', () => {
    expect(component).toBeTruthy();
    expect(serviceSpy.getTaxesGroupTemplate).toHaveBeenCalled();
    expect(component.availableComponents.length).toBe(1);
  });

  it('should post a tax group with selected components as an array', () => {
    serviceSpy.postTaxesGroup.and.returnValue(
      of({}) as unknown as ReturnType<TaxGroupService['postTaxesGroup']>,
    );
    component.name = 'Standard';
    component.selectedComponentIds = [1, 2];

    component.onSubmit();

    const arg = serviceSpy.postTaxesGroup.calls.mostRecent().args[0] as Record<string, unknown>;
    expect(arg['name']).toBe('Standard');
    expect(arg['taxComponents']).toEqual([{ taxComponentId: 1 }, { taxComponentId: 2 }]);
  });
});
