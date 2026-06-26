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
import { ProvisioningEntriesFormComponent } from './provisioning-entries-form.component';
import { ProvisioningEntriesService } from '../../../api';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { provideNoopAnimations } from '@angular/platform-browser/animations';

describe('ProvisioningEntriesFormComponent', () => {
  let component: ProvisioningEntriesFormComponent;
  let fixture: ComponentFixture<ProvisioningEntriesFormComponent>;
  let serviceSpy: jasmine.SpyObj<ProvisioningEntriesService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    serviceSpy = jasmine.createSpyObj('ProvisioningEntriesService', ['postProvisioningentries']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [ProvisioningEntriesFormComponent, TranslateModule.forRoot()],
      providers: [
        { provide: ProvisioningEntriesService, useValue: serviceSpy },
        { provide: Router, useValue: routerSpy },
        provideNoopAnimations(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProvisioningEntriesFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should post on submit and navigate to the list', () => {
    serviceSpy.postProvisioningentries.and.returnValue(
      of({}) as unknown as ReturnType<ProvisioningEntriesService['postProvisioningentries']>,
    );
    component.date = new Date('2026-06-15');
    component.createjournalentries = true;
    component.onSubmit();
    expect(serviceSpy.postProvisioningentries).toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/accounting/provisioning-entries']);
  });

  it('should not post when no date selected', () => {
    component.date = null;
    component.onSubmit();
    expect(serviceSpy.postProvisioningentries).not.toHaveBeenCalled();
  });
});
