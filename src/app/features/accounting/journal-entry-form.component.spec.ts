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
import { JournalEntryFormComponent } from './journal-entry-form.component';
import {
  JournalEntriesService,
  GeneralLedgerAccountService,
  OfficesService,
  CurrencyService,
  GetOfficesResponse,
  CurrencyConfigurationData,
  GetGLAccountsResponse,
  PostJournalEntriesResponse,
} from '../../api';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatNativeDateModule } from '@angular/material/core';
import { HttpEvent } from '@angular/common/http';

describe('JournalEntryFormComponent', () => {
  let component: JournalEntryFormComponent;
  let fixture: ComponentFixture<JournalEntryFormComponent>;
  let journalServiceSpy: jasmine.SpyObj<JournalEntriesService>;
  let glAccountServiceSpy: jasmine.SpyObj<GeneralLedgerAccountService>;
  let officeServiceSpy: jasmine.SpyObj<OfficesService>;
  let currencyServiceSpy: jasmine.SpyObj<CurrencyService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    journalServiceSpy = jasmine.createSpyObj('JournalEntriesService', ['createGLJournalEntry']);
    glAccountServiceSpy = jasmine.createSpyObj('GeneralLedgerAccountService', [
      'retrieveAllAccounts',
    ]);
    officeServiceSpy = jasmine.createSpyObj('OfficesService', ['retrieveOffices']);
    currencyServiceSpy = jasmine.createSpyObj('CurrencyService', ['retrieveCurrencies']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [
        JournalEntryFormComponent,
        TranslateModule.forRoot(),
        NoopAnimationsModule,
        MatNativeDateModule,
      ],
      providers: [
        { provide: JournalEntriesService, useValue: journalServiceSpy },
        { provide: GeneralLedgerAccountService, useValue: glAccountServiceSpy },
        { provide: OfficesService, useValue: officeServiceSpy },
        { provide: CurrencyService, useValue: currencyServiceSpy },
        { provide: Router, useValue: routerSpy },
      ],
    }).compileComponents();

    officeServiceSpy.retrieveOffices.and.returnValue(
      of([]) as unknown as Observable<HttpEvent<GetOfficesResponse[]>>,
    );
    currencyServiceSpy.retrieveCurrencies.and.returnValue(
      of({ selectedCurrencyOptions: [] }) as unknown as Observable<
        HttpEvent<CurrencyConfigurationData>
      >,
    );
    glAccountServiceSpy.retrieveAllAccounts.and.returnValue(
      of([]) as unknown as Observable<HttpEvent<GetGLAccountsResponse[]>>,
    );

    fixture = TestBed.createComponent(JournalEntryFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should validate balance', () => {
    component.debits = [{ glAccountId: 1, amount: 100 }];
    component.credits = [{ glAccountId: 2, amount: 100 }];
    expect(component.isBalanced()).toBeTrue();

    component.credits[0].amount = 50;
    expect(component.isBalanced()).toBeFalse();
  });

  it('should format payload correctly on submission', () => {
    component.command.officeId = 1;
    component.command.currencyCode = 'USD';
    component.transactionDate = new Date(2026, 4, 15);
    component.debits = [{ glAccountId: 10, amount: 500 }];
    component.credits = [{ glAccountId: 20, amount: 500 }];

    journalServiceSpy.createGLJournalEntry.and.returnValue(
      of({}) as unknown as Observable<HttpEvent<PostJournalEntriesResponse>>,
    );

    component.onSubmit();

    expect(journalServiceSpy.createGLJournalEntry).toHaveBeenCalledWith(
      undefined,
      jasmine.objectContaining({
        officeId: 1,
        currencyCode: 'USD',
        transactionDate: '2026-05-15',
        debits: component.debits,
        credits: component.credits,
      }),
    );
  });
});
