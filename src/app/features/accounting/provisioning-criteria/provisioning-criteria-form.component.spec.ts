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
import { ProvisioningCriteriaFormComponent } from './provisioning-criteria-form.component';
import { ProvisioningCriteriaService } from '../../../api';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { convertToParamMap } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { provideNoopAnimations } from '@angular/platform-browser/animations';

describe('ProvisioningCriteriaFormComponent', () => {
  let component: ProvisioningCriteriaFormComponent;
  let fixture: ComponentFixture<ProvisioningCriteriaFormComponent>;
  let serviceSpy: jasmine.SpyObj<ProvisioningCriteriaService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    serviceSpy = jasmine.createSpyObj('ProvisioningCriteriaService', [
      'getProvisioningcriteriaCriteriaId',
      'postProvisioningcriteria',
      'putProvisioningcriteriaCriteriaId',
    ]);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [ProvisioningCriteriaFormComponent, TranslateModule.forRoot()],
      providers: [
        { provide: ProvisioningCriteriaService, useValue: serviceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: { paramMap: of(convertToParamMap({})) } },
        provideNoopAnimations(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProvisioningCriteriaFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create in create mode', () => {
    expect(component).toBeTruthy();
    expect(component.isEditMode).toBeFalse();
  });

  it('should post on create and navigate to the list', () => {
    serviceSpy.postProvisioningcriteria.and.returnValue(
      of({}) as unknown as ReturnType<ProvisioningCriteriaService['postProvisioningcriteria']>,
    );
    component.criteria = { criteriaName: 'New' };
    component.onSubmit();
    expect(serviceSpy.postProvisioningcriteria).toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/accounting/provisioning-criteria']);
  });
});
