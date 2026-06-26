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
import { CashierJournalsListComponent } from './cashier-journals-list.component';
import { CashierJournalsService } from '../../../api';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { of } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { provideNoopAnimations } from '@angular/platform-browser/animations';

describe('CashierJournalsListComponent', () => {
  let component: CashierJournalsListComponent;
  let fixture: ComponentFixture<CashierJournalsListComponent>;
  let serviceSpy: jasmine.SpyObj<CashierJournalsService>;

  beforeEach(async () => {
    serviceSpy = jasmine.createSpyObj('CashierJournalsService', ['getCashiersjournal']);
    serviceSpy.getCashiersjournal.and.returnValue(
      of([{ tellerId: 1, day: '2026-01-15', closingBalance: 100 }]) as unknown as ReturnType<
        CashierJournalsService['getCashiersjournal']
      >,
    );

    await TestBed.configureTestingModule({
      imports: [CashierJournalsListComponent, TranslateModule.forRoot()],
      providers: [
        { provide: CashierJournalsService, useValue: serviceSpy },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { queryParamMap: convertToParamMap({}) } },
        },
        provideNoopAnimations(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CashierJournalsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not load without teller and cashier ids', () => {
    component.tellerId = null;
    component.cashierId = null;
    component.load();
    expect(serviceSpy.getCashiersjournal).not.toHaveBeenCalled();
  });

  it('should load journals for the given teller and cashier ids', () => {
    component.tellerId = 1;
    component.cashierId = 2;
    component.load();
    expect(serviceSpy.getCashiersjournal).toHaveBeenCalledWith(undefined, 1, 2);
    expect(component.journals.length).toBe(1);
  });
});
