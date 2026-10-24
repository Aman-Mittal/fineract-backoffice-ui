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
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { NgModel } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { provideFakeAdapters } from '../../testing/adapters';
import { provideTranslateTesting } from '../../testing/i18n-testing';
import { provideIonicTesting } from '../../testing/ionic-testing';
import { LoanFormComponent } from './loan-form.component';

describe('LoanFormComponent optional repayment date', () => {
  let fixture: ComponentFixture<LoanFormComponent>;
  let component: LoanFormComponent;
  let http: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoanFormComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        ...provideFakeAdapters().providers,
        ...provideTranslateTesting(),
        provideIonicTesting(),
        { provide: Router, useValue: { navigate: vi.fn() } },
        {
          provide: ActivatedRoute,
          useValue: { queryParams: of({}), paramMap: of({ get: () => null }) },
        },
      ],
    }).compileComponents();
    http = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(LoanFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    http.expectOne((request) => request.url.endsWith('/loanproducts')).flush([]);
    await fixture.whenStable();
    fixture.detectChanges();
  });
  afterEach(() => http.verify());

  async function chooseDate() {
    const control = fixture.debugElement
      .query(By.css('ion-datetime[name="repaymentsStartingFromDate"]'))
      .injector.get(NgModel);
    control.control.setValue('2026-11-05');
    await fixture.whenStable();
    fixture.detectChanges();
    expect(component.repaymentsStartingFromDate).toBe('2026-11-05');
  }
  async function clearDate() {
    const clear = fixture.nativeElement.querySelector('[data-testid="clear-repayment-start-date"]');
    expect(clear).not.toBeNull();
    clear.click();
    await fixture.whenStable();
    fixture.detectChanges();
  }
  const takeCreate = () =>
    http.expectOne((request) => request.method === 'POST' && request.url.endsWith('/loans'));

  it('shows an unset placeholder instead of a fabricated date', () => {
    expect(component.repaymentsStartingFromDate).toBeNull();
    const button = fixture.nativeElement.querySelector(
      'ion-datetime-button[datetime="repaymentsStartingFromDate-picker"]',
    );
    expect(button.querySelector('[slot="date-target"]')?.textContent ?? '').toContain(
      'LOANS.REPAYMENT_START_DATE_NOT_SET',
    );
  });
  it('clears without submitting and omits the optional field', async () => {
    await chooseDate();
    await clearDate();
    expect(component.repaymentsStartingFromDate).toBeNull();
    http.expectNone((request) => request.method === 'POST');
    component.onSubmit();
    const request = takeCreate();
    expect(request.request.body).not.toHaveProperty('repaymentsStartingFromDate');
    request.flush({ loanId: 7 });
  });
  it('preserves a chosen calendar day in the existing payload format', async () => {
    await chooseDate();
    component.onSubmit();
    const request = takeCreate();
    expect(request.request.body).toHaveProperty('repaymentsStartingFromDate', '05 November 2026');
    request.flush({ loanId: 7 });
  });
  it('omits stale date data when cleared after a rejected create', async () => {
    await chooseDate();
    component.onSubmit();
    const rejected = takeCreate();
    expect(rejected.request.body).toHaveProperty('repaymentsStartingFromDate', '05 November 2026');
    rejected.flush(
      { defaultUserMessage: 'Synthetic failure' },
      { status: 400, statusText: 'Bad Request' },
    );
    expect(component.isSaving()).toBe(false);
    await clearDate();
    component.onSubmit();
    const retry = takeCreate();
    expect(retry.request.body).not.toHaveProperty('repaymentsStartingFromDate');
    retry.flush({ loanId: 7 });
  });
  it('does not introduce a clearing operation for an existing loan', async () => {
    component.isEditMode.set(true);
    await chooseDate();
    expect(
      fixture.nativeElement.querySelector('[data-testid="clear-repayment-start-date"]'),
    ).toBeNull();
  });
});
