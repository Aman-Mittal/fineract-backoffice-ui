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

import {
  chartForRequest,
  chartFromProduct,
  emptySlab,
  rateForTerm,
  slabsFromProduct,
} from './deposit-chart';
import type { DepositProductChart } from '../../core/adapters';

/** A product's own chart, as `FineractDepositProductApi` models one. */
const PRODUCT_CHART: DepositProductChart = {
  id: 4,
  slabs: [
    {
      id: 9,
      periodTypeId: 2,
      fromPeriod: 1,
      toPeriod: 12,
      annualInterestRate: 7,
      description: 'First year',
    },
    {
      id: 10,
      periodTypeId: 2,
      fromPeriod: 13,
      toPeriod: null,
      annualInterestRate: 8,
      description: '',
    },
  ],
};

/**
 * The chart envelope the deposit product forms send.
 *
 * The date is the point of most of this. A chart's `fromDate` is judged by the platform's
 * reckoning of today — the business date when one governs — so these helpers take it rather than
 * reading the browser's clock, which is what they used to do (#758).
 */
describe('chartFromProduct', () => {
  it('dates the chart from the day it is given, not from the browser', () => {
    expect(chartFromProduct(PRODUCT_CHART, '2026-10-19')?.fromDate).toBe('19 October 2026');
  });

  it('carries the chart and slab ids, without which the platform answers 500', () => {
    const chart = chartFromProduct(PRODUCT_CHART, '2026-10-19');

    expect(chart?.id).toBe(4);
    expect(chart?.chartSlabs.map((slab) => slab.id)).toEqual([9, 10]);
  });

  it('gives a slab with no description the one the platform insists on', () => {
    const chart = chartFromProduct(PRODUCT_CHART, '2026-10-19');

    expect(chart?.chartSlabs[1].description).toBe('Interest rate');
  });

  it('answers null for a product with no chart, which has nothing to resend', () => {
    expect(chartFromProduct(null, '2026-10-19')).toBeNull();
    expect(chartFromProduct({ id: 1, slabs: [] }, '2026-10-19')).toBeNull();
  });
});

describe('slabsFromProduct', () => {
  it('hands the editor the product rates, so an edit shows what it will send', () => {
    expect(slabsFromProduct(PRODUCT_CHART).map((slab) => slab.annualInterestRate)).toEqual([7, 8]);
  });

  it('answers an empty list for a product with no chart', () => {
    expect(slabsFromProduct(null)).toEqual([]);
  });
});

describe('chartForRequest', () => {
  it('keeps the existing chart date, which the platform already accepted', () => {
    const existing = chartFromProduct(PRODUCT_CHART, '2026-01-02');

    const request = chartForRequest(existing!.chartSlabs, '2026-10-19', existing);

    expect(request.fromDate).toBe('02 January 2026');
    expect(request.id).toBe(4);
  });

  it('dates a brand new chart from the day it is given', () => {
    const request = chartForRequest([{ ...emptySlab(), annualInterestRate: 7 }], '2026-10-19');

    expect(request.fromDate).toBe('19 October 2026');
    expect(request.id).toBeUndefined();
  });

  it('drops a slab with no rate rather than sending it as zero', () => {
    const request = chartForRequest([emptySlab()], '2026-10-19');

    expect(request.chartSlabs).toEqual([]);
  });
});

describe('rateForTerm', () => {
  const slabs = slabsFromProduct(PRODUCT_CHART);

  it('reads the rate for a term inside a band', () => {
    expect(rateForTerm(slabs, 12, 2)).toBe(7);
  });

  it('reads the open-ended last band, which is how "and over" is written', () => {
    expect(rateForTerm(slabs, 36, 2)).toBe(8);
  });

  it('offers nothing when the term is in another unit', () => {
    expect(rateForTerm(slabs, 12, 1)).toBeUndefined();
  });

  it('offers nothing when no term has been entered', () => {
    expect(rateForTerm(slabs, undefined, 2)).toBeUndefined();
  });
});
