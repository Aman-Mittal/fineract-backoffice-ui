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

import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import {
  FineractDepositProductApi,
  mapDepositProduct,
  mapDepositProductSummary,
  mapDepositProductTemplate,
  mapProductChart,
} from './fineract-deposit-product.api';

/**
 * The deposit product adapter.
 *
 * The fixtures are the payloads a running Fineract answered, kept as sent. Two of them say
 * something the screens were getting wrong:
 *
 * - a list row's `nominalAnnualInterestRate` is `0`, for every product, and the row carries no
 *   chart — so a rate column on the list could only ever print `0.00 %`
 * - a recurring product reports no `recurringDepositFrequency`, not even one created with it a
 *   moment earlier
 */
describe('mapDepositProductSummary', () => {
  /** `GET /fixeddepositproducts`, one row, as sent. */
  const ROW = {
    preClosurePenalApplicable: false,
    minDepositTerm: 1,
    minDepositTermType: {
      id: 2,
      code: 'deposit.term.savingsPeriodFrequencyType.months',
      value: 'Months',
    },
    minDepositAmount: 100,
    depositAmount: 1000,
    maxDepositAmount: 100_000,
    id: 64,
    name: 'E2E FD 12m',
    shortName: '77FP',
    description: 'Seeded',
    currency: { code: 'USD', decimalPlaces: 2, inMultiplesOf: 0, displaySymbol: '$' },
    nominalAnnualInterestRate: 0,
    withHoldTax: false,
    accountingRule: { id: 1, value: 'NONE' },
  };

  it('takes the figures the list endpoint actually answers', () => {
    expect(mapDepositProductSummary(ROW)).toEqual({
      id: 64,
      name: 'E2E FD 12m',
      shortName: '77FP',
      currencyCode: 'USD',
      depositAmount: 1000,
      minDepositTerm: 1,
      minDepositTermUnit: 'Months',
    });
  });

  it('offers no rate, because the list endpoint has none to offer', () => {
    // Asserted against the fixture as well as the model: the payload really does send 0 here,
    // on a product whose chart pays 5%. A column bound to it read `0.00 %` for every product.
    expect(ROW.nominalAnnualInterestRate).toBe(0);
    expect('nominalAnnualInterestRate' in mapDepositProductSummary(ROW)).toBe(false);
  });

  it('answers empty rather than undefined for the strings a table prints', () => {
    const empty = mapDepositProductSummary({});
    expect(empty.name).toBe('');
    expect(empty.currencyCode).toBe('');
    expect(empty.minDepositTermUnit).toBe('');
    expect(empty.depositAmount).toBeNull();
  });
});

describe('mapDepositProduct', () => {
  /** `GET /fixeddepositproducts/{id}`, as sent, chart included. */
  const PRODUCT = {
    id: 1,
    name: 'E2E FD 12m',
    shortName: 'FD12',
    description: 'Seeded for deposit coverage',
    currency: { code: 'USD', decimalPlaces: 2, inMultiplesOf: 0 },
    minDepositTerm: 1,
    minDepositTermType: { id: 2, value: 'Months' },
    maxDepositTerm: 60,
    maxDepositTermType: { id: 2, value: 'Months' },
    depositAmount: 1000,
    minDepositAmount: 100,
    maxDepositAmount: 100_000,
    interestCompoundingPeriodType: { id: 4, value: 'Monthly' },
    interestPostingPeriodType: { id: 4, value: 'Monthly' },
    interestCalculationType: { id: 1, value: 'Daily Balance' },
    interestCalculationDaysInYearType: { id: 365, value: '365 Days' },
    preClosurePenalApplicable: false,
    accountingRule: { id: 1, value: 'NONE' },
    activeChart: {
      id: 1,
      fromDate: [2026, 10, 17],
      chartSlabs: [
        {
          id: 1,
          description: 'Seeded slab',
          periodType: { id: 2, value: 'Months' },
          fromPeriod: 1,
          toPeriod: 60,
          annualInterestRate: 5,
        },
      ],
    },
  };

  it('reads every field an update has to send back', () => {
    const product = mapDepositProduct(PRODUCT);

    // Eight of these are undeclared by the generated response model, which is why both forms
    // were reading their own product through a cast. Named here, against what is sent.
    expect(product.inMultiplesOf).toBe(0);
    expect(product.maxDepositTermTypeId).toBe(2);
    expect(product.depositAmount).toBe(1000);
    expect(product.minDepositAmount).toBe(100);
    expect(product.maxDepositAmount).toBe(100_000);
    expect(product.preClosurePenalApplicable).toBe(false);
    expect(product.accountingRuleId).toBe(1);
    expect(product.chart?.id).toBe(1);
  });

  it('flattens each enum to the id the form submits', () => {
    const product = mapDepositProduct(PRODUCT);

    expect(product.minDepositTermTypeId).toBe(2);
    expect(product.interestCompoundingPeriodTypeId).toBe(4);
    expect(product.interestPostingPeriodTypeId).toBe(4);
    expect(product.interestCalculationTypeId).toBe(1);
    expect(product.interestCalculationDaysInYearTypeId).toBe(365);
  });

  it('answers null for a figure the product does not state, not zero', () => {
    // A product with no cap and a product capped at nothing are different products, and the
    // form resends whatever it is handed.
    const bare = mapDepositProduct({ id: 2 });
    expect(bare.maxDepositAmount).toBeNull();
    expect(bare.maxDepositTerm).toBeNull();
    expect(bare.accountingRuleId).toBeNull();
    expect(bare.chart).toBeNull();
  });

  it('reports no recurrence for a recurring product, because the platform reports none', () => {
    // Measured: a recurring deposit product created with `recurringFrequency: 1` answers
    // neither `recurringDepositFrequency` nor `recurringDepositFrequencyType` on its own read,
    // and the account template for it answers null for both. The form falls back to its
    // default, and says so.
    const recurring = mapDepositProduct({ id: 67, name: 'E2E RD' });
    expect(recurring.recurringFrequency).toBeNull();
    expect(recurring.recurringFrequencyTypeId).toBeNull();
  });

  it('still maps a recurrence if one is ever sent', () => {
    const recurring = mapDepositProduct({
      recurringDepositFrequency: 3,
      recurringDepositFrequencyType: { id: 2, value: 'Months' },
    });
    expect(recurring.recurringFrequency).toBe(3);
    expect(recurring.recurringFrequencyTypeId).toBe(2);
  });

  it('keeps the accounting mappings whole, for the shared accounting section to read', () => {
    const mapped = mapDepositProduct({
      accountingMappings: { savingsReferenceAccount: { id: 4, name: 'Cash' } },
    });
    expect(mapped.accountingMappings).toEqual({ savingsReferenceAccount: { id: 4, name: 'Cash' } });
    // `null`, not `{}`: a product posting to no accounts and a product whose mappings were not
    // asked for read the same otherwise.
    expect(mapDepositProduct({ id: 1 }).accountingMappings).toBeNull();
  });
});

describe('mapProductChart', () => {
  it('carries the chart and slab ids, which is what keeps an update off a 500', () => {
    const chart = mapProductChart({
      id: 9,
      chartSlabs: [
        {
          id: 4,
          periodType: { id: 2 },
          fromPeriod: 1,
          toPeriod: 24,
          annualInterestRate: 7,
          description: 'Interest rate',
        },
      ],
    });

    expect(chart).toEqual({
      id: 9,
      slabs: [
        {
          id: 4,
          periodTypeId: 2,
          fromPeriod: 1,
          toPeriod: 24,
          annualInterestRate: 7,
          description: 'Interest rate',
        },
      ],
    });
  });

  it('keeps an open-ended last band open-ended', () => {
    // "12 months and over" is written with no `toPeriod`, and a 0 there would cap it at nothing.
    const chart = mapProductChart({ id: 9, chartSlabs: [{ fromPeriod: 12 }] });
    expect(chart?.slabs[0].toPeriod).toBeNull();
  });

  it('answers null for a product with no chart at all', () => {
    expect(mapProductChart(undefined)).toBeNull();
    expect(mapProductChart({ id: 9, chartSlabs: [] })).toBeNull();
  });
});

describe('mapDepositProductTemplate', () => {
  /** `GET /fixeddepositproducts/template`, trimmed to what the form reads. */
  const TEMPLATE = {
    accountingRuleOptions: [
      { id: 1, value: 'NONE' },
      { id: 2, value: 'CASH BASED' },
    ],
    accountingMappingOptions: {
      assetAccountOptions: [{ id: 1, name: 'Cash', glCode: '10100' }],
      incomeAccountOptions: [{ id: 2, name: 'Interest', glCode: '40100' }],
    },
    chartTemplate: {
      periodTypes: [
        { id: 0, value: 'Days' },
        { id: 2, value: 'Months' },
      ],
    },
    interestCompoundingPeriodTypeOptions: [{ id: 4, value: 'Monthly' }],
    interestPostingPeriodTypeOptions: [{ id: 4, value: 'Monthly' }],
    interestCalculationTypeOptions: [{ id: 1, value: 'Daily Balance' }],
    interestCalculationDaysInYearTypeOptions: [{ id: 365, value: '365 Days' }],
  };

  it('finds the chart period types where they live, under chartTemplate', () => {
    expect(mapDepositProductTemplate(TEMPLATE).chartPeriodTypes).toEqual([
      { id: 0, value: 'Days' },
      { id: 2, value: 'Months' },
    ]);
  });

  it('offers every interest option the template carries', () => {
    const template = mapDepositProductTemplate(TEMPLATE);
    expect(template.interestCompoundingPeriodTypes).toHaveLength(1);
    expect(template.interestPostingPeriodTypes).toHaveLength(1);
    expect(template.interestCalculationTypes).toHaveLength(1);
    expect(template.interestCalculationDaysInYearTypes).toHaveLength(1);
    expect(template.accountingRuleOptions).toHaveLength(2);
  });

  it('presents every GL account list, empty ones included', () => {
    // Every list present rather than absent: a template with no equity accounts configured
    // should read as none offered, not as a template that failed to load.
    const options = mapDepositProductTemplate(TEMPLATE).accountingMappingOptions;
    expect(options.assetAccountOptions).toEqual([{ id: 1, name: 'Cash', glCode: '10100' }]);
    expect(options.equityAccountOptions).toEqual([]);
    expect(options.liabilityAccountOptions).toEqual([]);
    expect(options.expenseAccountOptions).toEqual([]);
  });

  it('drops an option with no id, which could not be submitted anyway', () => {
    const template = mapDepositProductTemplate({
      accountingRuleOptions: [{ value: 'NONE' }, { id: 2, value: 'CASH BASED' }],
    });
    expect(template.accountingRuleOptions).toEqual([{ id: 2, value: 'CASH BASED' }]);
  });

  it('answers an empty template rather than throwing when the platform sends nothing', () => {
    // The generated getter is typed `Observable<string>` for this JSON object — issue #653 —
    // so nothing upstream guarantees its shape.
    const template = mapDepositProductTemplate({});
    expect(template.chartPeriodTypes).toEqual([]);
    expect(template.accountingMappingOptions.assetAccountOptions).toEqual([]);
  });
});

/**
 * Which endpoint each operation reaches.
 *
 * Asserted through `HttpTestingController` rather than by spying on the generated services: the
 * URL is the contract with the platform, and a renamed generated method should surface as a
 * compile error here rather than as a request to the wrong resource.
 */
describe('FineractDepositProductApi', () => {
  let api: FineractDepositProductApi;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    api = TestBed.inject(FineractDepositProductApi);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  function expectRequest(method: string, suffix: string) {
    return http.expectOne(
      (candidate) => candidate.method === method && candidate.url.endsWith(suffix),
    );
  }

  it('lists fixed and recurring products from their own resources', () => {
    api.list('fixed').subscribe();
    expectRequest('GET', '/v1/fixeddepositproducts').flush([{ id: 1 }]);

    api.list('recurring').subscribe();
    expectRequest('GET', '/v1/recurringdepositproducts').flush([{ id: 2 }]);
  });

  it('answers an empty list when the platform sends no body', () => {
    let products: unknown[] | undefined;
    api.list('fixed').subscribe((result) => (products = result));
    expectRequest('GET', '/v1/fixeddepositproducts').flush(null);
    expect(products).toEqual([]);
  });

  it('reads one product by kind and id', () => {
    api.get('fixed', 7).subscribe();
    expectRequest('GET', '/v1/fixeddepositproducts/7').flush({ id: 7 });

    api.get('recurring', 8).subscribe();
    expectRequest('GET', '/v1/recurringdepositproducts/8').flush({ id: 8 });
  });

  it('reads the create template by kind', () => {
    api.template('fixed').subscribe();
    expectRequest('GET', '/v1/fixeddepositproducts/template').flush({});

    api.template('recurring').subscribe();
    expectRequest('GET', '/v1/recurringdepositproducts/template').flush({});
  });

  it('posts a create to the resource, body and all', () => {
    api.create('recurring', { name: 'New', charts: [] }).subscribe();

    const request = expectRequest('POST', '/v1/recurringdepositproducts');
    expect(request.request.body).toEqual({ name: 'New', charts: [] });
    request.flush({ resourceId: 1 });
  });

  it('puts an update at the product, body and all', () => {
    api.update('fixed', 12, { name: 'Edited', charts: [{ id: 9 }] }).subscribe();

    const request = expectRequest('PUT', '/v1/fixeddepositproducts/12');
    expect(request.request.body).toEqual({ name: 'Edited', charts: [{ id: 9 }] });
    request.flush({ resourceId: 12 });
  });
});
