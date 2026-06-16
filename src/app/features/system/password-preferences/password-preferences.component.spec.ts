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
import { PasswordPreferencesComponent } from './password-preferences.component';
import { PasswordPreferencesService } from '../../../api';
import { of } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { provideNoopAnimations } from '@angular/platform-browser/animations';

describe('PasswordPreferencesComponent', () => {
  let component: PasswordPreferencesComponent;
  let fixture: ComponentFixture<PasswordPreferencesComponent>;
  let serviceSpy: jasmine.SpyObj<PasswordPreferencesService>;

  beforeEach(async () => {
    serviceSpy = jasmine.createSpyObj('PasswordPreferencesService', [
      'getPasswordpreferences',
      'putPasswordpreferences',
    ]);
    serviceSpy.getPasswordpreferences.and.returnValue(
      of([
        { id: 1, key: 'simple', description: 'Simple', active: false },
        { id: 2, key: 'strong', description: 'Strong', active: true },
      ]) as unknown as ReturnType<PasswordPreferencesService['getPasswordpreferences']>,
    );

    await TestBed.configureTestingModule({
      imports: [PasswordPreferencesComponent, TranslateModule.forRoot()],
      providers: [
        { provide: PasswordPreferencesService, useValue: serviceSpy },
        provideNoopAnimations(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PasswordPreferencesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should select the active policy on load', () => {
    expect(component.policies.length).toBe(2);
    expect(component.selectedPolicyId).toBe(2);
  });

  it('should put the selected policy on save', () => {
    serviceSpy.putPasswordpreferences.and.returnValue(
      of({}) as unknown as ReturnType<PasswordPreferencesService['putPasswordpreferences']>,
    );
    component.selectedPolicyId = 1;
    component.onSave();
    expect(serviceSpy.putPasswordpreferences).toHaveBeenCalledWith({ validationPolicyId: 1 });
  });
});
