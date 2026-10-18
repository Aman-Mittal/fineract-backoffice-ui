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
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';

import { SavingsAccountFormComponent } from './savings-account-form.component';
import { provideIonicTesting } from '../../testing/ionic-testing';
import { provideTranslateTesting } from '../../testing/i18n-testing';
import { BUSINESS_DATE_API } from '../../core/adapters';

/**
 * A tenant without the business-date feature, so `PlatformDateService` resolves today from the
 * platform's clock and makes no request of its own — these cases are about the rate, and an
 * unflushed configuration read would fail them for an unrelated reason.
 */
const NO_BUSINESS_DATE = {
  provide: BUSINESS_DATE_API,
  useValue: { getBusinessDates: () => of([]), isBusinessDateEnabled: () => of(false) },
};

/**
 * #761. Every savings account opened through this form earned 0%.
 *
 * The form started its Interest Rate field at `0` and sent it on every submit. Fineract reads a
 * rate in the request as an account-level override, so the product's rate was discarded — a 5%
 * product opened an account paying nothing, and the depositor would only find out at interest
 * posting.
 *
 * These assert the **payload**, through `HttpTestingController`, because that is where the defect
 * was: the rendered form looked the same either way. The fixtures are what
 * `GET /savingsproducts` actually answers — a list row carries the product's own
 * `nominalAnnualInterestRate`, measured as 3.75 for a product configured at 3.75%.
 */
describe('SavingsAccountFormComponent interest rate', () => {
  let fixture: ComponentFixture<SavingsAccountFormComponent>;
  let component: SavingsAccountFormComponent;
  let http: HttpTestingController;

  const PRODUCT = {
    id: 42,
    name: 'Probe Savings 3.75%',
    shortName: 'P375',
    nominalAnnualInterestRate: 3.75,
    currency: { code: 'USD', decimalPlaces: 2 },
  };

  async function setup(): Promise<void> {
    TestBed.resetTestingModule();
    await TestBed.configureTestingModule({
      imports: [SavingsAccountFormComponent],
      providers: [
        provideNoopAnimations(),
        provideIonicTesting(),
        ...provideTranslateTesting(),
        provideHttpClient(),
        provideHttpClientTesting(),
        NO_BUSINESS_DATE,
        { provide: Router, useValue: { navigate: () => undefined, url: '' } },
        {
          provide: ActivatedRoute,
          useValue: { queryParams: of({}), paramMap: of({ get: () => null }) },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SavingsAccountFormComponent);
    component = fixture.componentInstance;
    http = TestBed.inject(HttpTestingController);
    fixture.detectChanges();

    // The product list the form loads on init — and the only source the rate prefill needs.
    http
      .expectOne((request) => request.method === 'GET' && request.url.endsWith('/savingsproducts'))
      .flush([PRODUCT]);
    fixture.detectChanges();
  }

  /** The body of the create request, after a submit. */
  function submitted(): Record<string, unknown> {
    const request = http.expectOne(
      (candidate) => candidate.method === 'POST' && candidate.url.endsWith('/savingsaccounts'),
    );
    const body = request.request.body as Record<string, unknown>;
    request.flush({ resourceId: 1 });
    return body;
  }

  it('takes the rate from the product the user chose', async () => {
    await setup();

    component.onProductChanged(42);

    expect(component.interestRate()).toBe(3.75);
  });

  it('sends the product rate, so the account is not opened at zero', async () => {
    await setup();
    component.onProductChanged(42);

    component.onSubmit();

    expect(submitted()['nominalAnnualInterestRate']).toBe(3.75);
  });

  it('omits the rate entirely when no product rate is known', async () => {
    // Omission is how the platform is asked to apply the product's own rate. Sending `0` is the
    // bug: it is a valid override, and it overrides with nothing.
    await setup();

    component.onSubmit();

    const body = submitted();
    expect('nominalAnnualInterestRate' in body).toBe(false);
  });

  it('keeps a rate the user typed, including a deliberate zero', async () => {
    // 0% is a rate an institution may mean, so it cannot double as "not filled in" — which is
    // why the field starts empty rather than at zero.
    await setup();
    component.onProductChanged(42);

    component.onInterestRateChanged(0);
    component.onSubmit();

    expect(submitted()['nominalAnnualInterestRate']).toBe(0);
  });

  it('treats a cleared field as not stated, rather than as zero', async () => {
    await setup();
    component.onProductChanged(42);

    component.onInterestRateChanged('');

    expect(component.interestRate()).toBeNull();
    component.onSubmit();
    expect('nominalAnnualInterestRate' in submitted()).toBe(false);
  });

  it('prefills the rate when the product was chosen before the list arrived', async () => {
    // A client-scoped route pre-selects the product id, and the list lands afterwards.
    TestBed.resetTestingModule();
    await TestBed.configureTestingModule({
      imports: [SavingsAccountFormComponent],
      providers: [
        provideNoopAnimations(),
        provideIonicTesting(),
        ...provideTranslateTesting(),
        provideHttpClient(),
        provideHttpClientTesting(),
        NO_BUSINESS_DATE,
        { provide: Router, useValue: { navigate: () => undefined, url: '' } },
        {
          provide: ActivatedRoute,
          useValue: { queryParams: of({ clientId: '7' }), paramMap: of({ get: () => null }) },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SavingsAccountFormComponent);
    component = fixture.componentInstance;
    http = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
    component.account.update((account) => ({ ...account, productId: 42 }));

    http
      .expectOne((request) => request.method === 'GET' && request.url.endsWith('/savingsproducts'))
      .flush([PRODUCT]);

    expect(component.interestRate()).toBe(3.75);

    // The client search reads the pre-selected client; answered so the verify below is clean.
    for (const request of http.match((candidate) => candidate.url.includes('/clients/'))) {
      request.flush({ id: 7, displayName: 'Probe Client' });
    }
  });

  afterEach(() => http.verify());
});
