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
import { FieldConfigurationComponent } from './field-configuration.component';
import { EntityFieldConfigurationService } from '../../../api';
import { of } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { provideNoopAnimations } from '@angular/platform-browser/animations';

describe('FieldConfigurationComponent', () => {
  let component: FieldConfigurationComponent;
  let fixture: ComponentFixture<FieldConfigurationComponent>;
  let serviceSpy: jasmine.SpyObj<EntityFieldConfigurationService>;

  beforeEach(async () => {
    serviceSpy = jasmine.createSpyObj('EntityFieldConfigurationService', [
      'getFieldconfigurationEntity',
    ]);
    serviceSpy.getFieldconfigurationEntity.and.returnValue(
      of([{ entity: 'CLIENT', field: 'firstname', isEnabled: true }]) as unknown as ReturnType<
        EntityFieldConfigurationService['getFieldconfigurationEntity']
      >,
    );

    await TestBed.configureTestingModule({
      imports: [FieldConfigurationComponent, TranslateModule.forRoot()],
      providers: [
        { provide: EntityFieldConfigurationService, useValue: serviceSpy },
        provideNoopAnimations(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FieldConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should load field config for the default entity', () => {
    expect(component).toBeTruthy();
    expect(serviceSpy.getFieldconfigurationEntity).toHaveBeenCalledWith('CLIENT');
    expect(component.fields.length).toBe(1);
  });

  it('should reload when the entity changes', () => {
    component.entity = 'ADDRESS';
    component.load();
    expect(serviceSpy.getFieldconfigurationEntity).toHaveBeenCalledWith('ADDRESS');
  });
});
