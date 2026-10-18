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

import { createSpyObj, SpyObj } from '../../../testing/mocks';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FixedDepositProductFormComponent } from './fixed-deposit-product-form.component';
import { of, throwError } from 'rxjs';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { provideTranslateTesting } from '../../../testing/i18n-testing';
import { DEPOSIT_PRODUCT_API } from '../../../core/adapters';
import {
  mapDepositProduct,
  mapDepositProductTemplate,
} from '../../../core/adapters/api/fineract-deposit-product.api';

/**
 * A fake {@link DepositProductApi}.
 *
 * The template and the product go through the adapter's own mappers, so the fixtures stay the
 * payloads the platform sends while the component sees exactly what the adapter would hand it.
 * The screen itself no longer knows what any of these operations is called — which is why this
 * file no longer imports `src/app/api`.
 */
type FakeProducts = Record<string, ReturnType<typeof vi.fn>>;

describe('FixedDepositProductFormComponent', () => {
  let component: FixedDepositProductFormComponent;
  let fixture: ComponentFixture<FixedDepositProductFormComponent>;
  let products: FakeProducts;
  let routerSpy: SpyObj<Router>;

  const PRODUCTS_FIXED_PATH = '/products/fixed';
  const API_ERROR = 'API Error';

  beforeEach(async () => {
    products = {
      // The accounting section reads its rule labels and account options from the template.
      template: vi.fn().mockReturnValue(of(mapDepositProductTemplate({}))),
      // Stubbed even though this route carries no id: an unstubbed spy answers `undefined`, and
      // a component that subscribes to it throws an unhandled error that lands on another file.
      get: vi.fn().mockReturnValue(of(mapDepositProduct({}))),
      create: vi.fn().mockReturnValue(of(undefined)),
      update: vi.fn().mockReturnValue(of(undefined)),
    };
    routerSpy = createSpyObj(['navigate']);

    await TestBed.configureTestingModule({
      imports: [FixedDepositProductFormComponent],
      providers: [
        ...provideTranslateTesting(),
        provideNoopAnimations(),
        { provide: DEPOSIT_PRODUCT_API, useValue: products },
        { provide: Router, useValue: routerSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of({ get: () => null }),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FixedDepositProductFormComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should load product data in edit mode', () => {
    products['get'].mockReturnValue(
      of(
        mapDepositProduct({
          id: 1,
          name: 'Fixed Deposit A',
          shortName: 'FDA',
          currency: { code: 'USD', decimalPlaces: 2 },
          minDepositTerm: 6,
          minDepositTermType: { id: 2 },
        }),
      ),
    );
    component.productId = 1;
    component.isEditMode.set(true);

    component.loadProductData();

    // By kind and id: which generated method that is, is the adapter's business.
    expect(products['get']).toHaveBeenCalledWith('fixed', 1);
    expect(component.product()['name']).toBe('Fixed Deposit A');
    expect(component.product()['minDepositTerm']).toBe(6);
  });

  it('should create product on submit', () => {
    component.product.set({
      name: 'New Product',
      shortName: 'NP',
      currencyCode: 'USD',
      digitsAfterDecimal: 2,
    });

    component.onSubmit();

    expect(products['create']).toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledWith([PRODUCTS_FIXED_PATH]);
  });

  it('should update product on submit in edit mode', () => {
    component.productId = 123;
    component.isEditMode.set(true);
    component.product.set({
      name: 'Updated Product',
      shortName: 'UP',
    });

    component.onSubmit();

    expect(products['update']).toHaveBeenCalledWith('fixed', 123, expect.any(Object));
    expect(routerSpy.navigate).toHaveBeenCalledWith([PRODUCTS_FIXED_PATH]);
  });

  it('should handle submission error', () => {
    products['create'].mockReturnValue(throwError(() => new Error(API_ERROR)));
    component.onSubmit();
    expect(component.isSaving()).toBe(false);
  });

  it('should navigate on cancel', () => {
    component.onCancel();
    expect(routerSpy.navigate).toHaveBeenCalledWith([PRODUCTS_FIXED_PATH]);
  });
});

/**
 * #765. The create form showed no interest fields at all and sent a chart anyway: a single slab
 * at **5% for 1–60 months**, from the browser's today. An administrator configuring a 7%
 * two-year product got a 5% five-year one, and every account opened under it inherited that
 * rate. Nothing on screen said so.
 *
 * The fix is not a better default. The rate is the product, so these assert that the form sends
 * what the user entered and refuses to submit until they enter something.
 */
describe('FixedDepositProductFormComponent interest rate chart', () => {
  let component: FixedDepositProductFormComponent;
  let fixture: ComponentFixture<FixedDepositProductFormComponent>;
  let products: FakeProducts;

  /** The product template, as the platform sends it. */
  const TEMPLATE = {
    chartTemplate: {
      periodTypes: [
        { id: 0, code: 'periodFrequencyType.days', value: 'Days' },
        { id: 2, code: 'periodFrequencyType.months', value: 'Months' },
      ],
    },
    interestCompoundingPeriodTypeOptions: [
      { id: 1, value: 'Daily' },
      { id: 4, value: 'Monthly' },
    ],
    interestPostingPeriodTypeOptions: [{ id: 4, value: 'Monthly' }],
    interestCalculationTypeOptions: [{ id: 1, value: 'Daily Balance' }],
    interestCalculationDaysInYearTypeOptions: [{ id: 365, value: '365 Days' }],
  };

  /**
   * @param product - what the product read answers with. Stubbed **before** the component is
   *   created, because `ngOnInit` reads the route and loads the product itself: a spy stubbed
   *   afterwards returns `undefined` for that first call, and the component subscribes to it.
   *
   *   That is not a hypothetical. It threw `Cannot read properties of undefined (reading
   *   'subscribe')` as an *unhandled* error, which vitest attributes to whichever file is
   *   running when it surfaces — so it failed `client-form.component.test.ts` instead, and only
   *   in the timezone pass, where the timing differed. Two full-suite runs looked like flakes.
   */
  async function setup(
    paramMap: { get: (key: string) => string | null },
    product: object = {},
  ): Promise<void> {
    TestBed.resetTestingModule();
    products = {
      template: vi.fn().mockReturnValue(of(mapDepositProductTemplate(TEMPLATE))),
      get: vi.fn().mockReturnValue(of(mapDepositProduct(product))),
      create: vi.fn().mockReturnValue(of(undefined)),
      update: vi.fn().mockReturnValue(of(undefined)),
    };

    await TestBed.configureTestingModule({
      imports: [FixedDepositProductFormComponent],
      providers: [
        ...provideTranslateTesting(),
        provideNoopAnimations(),
        { provide: DEPOSIT_PRODUCT_API, useValue: products },
        { provide: Router, useValue: createSpyObj<Router>(['navigate']) },
        { provide: ActivatedRoute, useValue: { paramMap: of(paramMap) } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FixedDepositProductFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  }

  const CREATE = { get: () => null };

  /** The charts on the body the create sent — `create(type, body)`. */
  function sentCharts(): Record<string, unknown>[] {
    const payload = products['create'].mock.calls[0][1] as Record<string, unknown>;
    return payload['charts'] as Record<string, unknown>[];
  }

  /** The body the update sent — `update(type, productId, body)`. */
  function updatedBody(): Record<string, unknown> {
    return products['update'].mock.calls[0][2] as Record<string, unknown>;
  }

  it('starts with one empty slab rather than a 5% one', async () => {
    await setup(CREATE);

    expect(component.chartSlabs()).toHaveLength(1);
    expect(component.chartSlabs()[0].annualInterestRate).toBeUndefined();
  });

  it('will not submit until a rate is entered', async () => {
    // The whole point of the issue: a product with no stated rate should be unsaveable, not
    // silently saved at 5%.
    await setup(CREATE);

    const submit = fixture.nativeElement.querySelector('[data-testid="product-submit"]');
    expect(submit.disabled).toBe(true);
    expect(
      fixture.nativeElement.querySelector('[data-testid="product-submit-hint"]'),
    ).not.toBeNull();
  });

  it('sends the rate the user entered, and the period range with it', async () => {
    await setup(CREATE);
    component.chartSlabs.set([
      { periodType: 2, fromPeriod: 1, toPeriod: 24, annualInterestRate: 7, locale: 'en' },
    ]);

    component.onSubmit();

    const [chart] = sentCharts();
    const slabs = chart['chartSlabs'] as Record<string, unknown>[];
    expect(slabs).toHaveLength(1);
    expect(slabs[0]['annualInterestRate']).toBe(7);
    expect(slabs[0]['fromPeriod']).toBe(1);
    expect(slabs[0]['toPeriod']).toBe(24);
    // The platform rejects a slab with no description, so one is supplied rather than demanded.
    expect(slabs[0]['description']).toBe('Interest rate');
  });

  it('sends every slab, so a tiered product is not flattened to its first rate', async () => {
    await setup(CREATE);
    component.chartSlabs.set([
      { periodType: 2, fromPeriod: 1, toPeriod: 11, annualInterestRate: 5, locale: 'en' },
      { periodType: 2, fromPeriod: 12, toPeriod: 24, annualInterestRate: 7, locale: 'en' },
    ]);

    component.onSubmit();

    const slabs = sentCharts()[0]['chartSlabs'] as Record<string, unknown>[];
    expect(slabs.map((slab) => slab['annualInterestRate'])).toEqual([5, 7]);
  });

  it('drops a slab with no rate rather than sending it as zero', async () => {
    // Zero is a rate an institution might mean, so it cannot double as "not filled in".
    await setup(CREATE);
    component.chartSlabs.set([
      { periodType: 2, fromPeriod: 1, toPeriod: 11, annualInterestRate: 5, locale: 'en' },
      { periodType: 2, fromPeriod: 12, locale: 'en' },
    ]);

    component.onSubmit();

    const slabs = sentCharts()[0]['chartSlabs'] as Record<string, unknown>[];
    expect(slabs).toHaveLength(1);
  });

  it('offers the period and interest options the template returns', async () => {
    // All four were hard-coded and invisible, so a product's interest behaviour was whatever
    // the form defaulted to.
    await setup(CREATE);

    expect(component.chartPeriodTypes().map((option) => option.value)).toEqual(['Days', 'Months']);
    expect(component.compoundingOptions()).toHaveLength(2);
    expect(component.postingOptions()).toHaveLength(1);
    expect(component.calculationOptions()).toHaveLength(1);
    expect(component.daysInYearOptions()).toHaveLength(1);
  });

  describe('on edit', () => {
    const EXISTING = {
      id: 1,
      name: 'Fixed Deposit A',
      shortName: 'FDA',
      description: 'A product',
      currency: { code: 'USD', decimalPlaces: 2 },
      minDepositTerm: 6,
      minDepositTermType: { id: 2 },
      activeChart: {
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
      },
    };

    async function setupEdit(): Promise<void> {
      // The route carries the id, so `ngOnInit` puts the form in edit mode and loads the
      // product. Nothing here repeats that by hand.
      await setup({ get: () => '1' }, EXISTING);
      fixture.detectChanges();
      await fixture.whenStable();
    }

    it('shows the product rates it actually carries', async () => {
      await setupEdit();

      expect(component.chartSlabs()).toHaveLength(1);
      expect(component.chartSlabs()[0].annualInterestRate).toBe(7);
      expect(component.chartSlabs()[0].toPeriod).toBe(24);
    });

    it('round-trips the chart with its ids, which is what keeps the update from a 500', async () => {
      // A chart without its ids reads as a brand new one and the platform answers 500 rather
      // than a validation message — the defect `chartFromProduct` was written for.
      await setupEdit();

      component.onSubmit();

      const [chart] = updatedBody()['charts'] as Record<string, unknown>[];
      expect(chart['id']).toBe(9);
      const slabs = chart['chartSlabs'] as Record<string, unknown>[];
      expect(slabs[0]['id']).toBe(4);
    });

    it('sends an edited rate, not the one it was given', async () => {
      await setupEdit();
      component.chartSlabs.update((slabs) =>
        slabs.map((slab) => ({ ...slab, annualInterestRate: 8.5 })),
      );

      component.onSubmit();

      const slabs = (updatedBody()['charts'] as Record<string, unknown>[])[0][
        'chartSlabs'
      ] as Record<string, unknown>[];
      expect(slabs[0]['annualInterestRate']).toBe(8.5);
      // Still the same chart and slab, so the platform treats it as a change rather than a new one.
      expect(slabs[0]['id']).toBe(4);
    });
  });
});
