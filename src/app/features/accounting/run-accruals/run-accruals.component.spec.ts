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
import { RunAccrualsComponent } from './run-accruals.component';
import { PeriodicAccrualAccountingService } from '../../../api';
import { of } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { provideNoopAnimations } from '@angular/platform-browser/animations';

describe('RunAccrualsComponent', () => {
  let component: RunAccrualsComponent;
  let fixture: ComponentFixture<RunAccrualsComponent>;
  let serviceSpy: jasmine.SpyObj<PeriodicAccrualAccountingService>;

  beforeEach(async () => {
    serviceSpy = jasmine.createSpyObj('PeriodicAccrualAccountingService', ['postRunaccruals']);

    await TestBed.configureTestingModule({
      imports: [RunAccrualsComponent, TranslateModule.forRoot()],
      providers: [
        { provide: PeriodicAccrualAccountingService, useValue: serviceSpy },
        provideNoopAnimations(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RunAccrualsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call postRunaccruals with the chosen till date and show a success message', () => {
    serviceSpy.postRunaccruals.and.returnValue(
      of({}) as unknown as ReturnType<PeriodicAccrualAccountingService['postRunaccruals']>,
    );

    component.tillDate = new Date(2026, 0, 15);
    component.onSubmit();

    expect(serviceSpy.postRunaccruals).toHaveBeenCalled();
    const arg = serviceSpy.postRunaccruals.calls.mostRecent().args[0];
    expect(arg.tillDate).toBe('15 January 2026');
    expect(component.successMessage).toBeTruthy();
  });

  it('should not call postRunaccruals when no date is selected', () => {
    component.tillDate = null;
    component.onSubmit();
    expect(serviceSpy.postRunaccruals).not.toHaveBeenCalled();
  });
});
