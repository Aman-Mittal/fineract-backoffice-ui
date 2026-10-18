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
import { of, throwError } from 'rxjs';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';

import { createSpyObj, SpyObj } from '../../../testing/mocks';
import { FixedDepositProductsListComponent } from './fixed-deposit-products-list.component';
import { DEPOSIT_PRODUCT_API } from '../../../core/adapters';
import { mapDepositProductSummary } from '../../../core/adapters/api/fineract-deposit-product.api';
import { provideTranslateTesting } from '../../../testing/i18n-testing';

describe('FixedDepositProductsListComponent', () => {
  let component: FixedDepositProductsListComponent;
  let fixture: ComponentFixture<FixedDepositProductsListComponent>;
  let products: Record<string, ReturnType<typeof vi.fn>>;
  let routerSpy: SpyObj<Router>;

  /**
   * A list row as the platform sends one, mapped by the adapter's own mapper.
   *
   * `nominalAnnualInterestRate: 0` is not an accident of the fixture: that is what the endpoint
   * answers for every deposit product, including this one, whose chart pays 7%. The column bound
   * to it is gone — see the component.
   */
  const ROW = {
    id: 789,
    name: 'Product A',
    shortName: 'PA',
    currency: { code: 'USD', decimalPlaces: 2 },
    depositAmount: 1000,
    minDepositTerm: 6,
    minDepositTermType: { id: 2, value: 'Months' },
    nominalAnnualInterestRate: 0,
  };

  beforeEach(async () => {
    products = { list: vi.fn().mockReturnValue(of([])) };
    routerSpy = createSpyObj(['navigate']);

    await TestBed.configureTestingModule({
      imports: [FixedDepositProductsListComponent],
      providers: [
        ...provideTranslateTesting(),
        provideNoopAnimations(),
        { provide: DEPOSIT_PRODUCT_API, useValue: products },
        { provide: Router, useValue: routerSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FixedDepositProductsListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('asks the adapter for fixed deposit products, by kind', () => {
    products['list'].mockReturnValue(of([mapDepositProductSummary(ROW)]));

    fixture.detectChanges();

    // The generated method's name is no longer this screen's business — only the kind is.
    expect(products['list']).toHaveBeenCalledWith('fixed');
    expect(component.products()).toHaveLength(1);
    expect(component.isLoading()).toBe(false);
  });

  it('shows the figures the endpoint actually answers, and no rate', () => {
    products['list'].mockReturnValue(of([mapDepositProductSummary(ROW)]));

    fixture.detectChanges();

    const [row] = component.products();
    expect(row.depositAmount).toBe(1000);
    expect(row.minDepositTerm).toBe(6);
    expect(row.minDepositTermUnit).toBe('Months');
    // A rate column read `0.00 %` against every product on this screen. There is no rate here
    // to bind one to, which is the fix: the model cannot offer a figure the payload does not
    // have.
    expect('nominalAnnualInterestRate' in row).toBe(false);
    expect(component.columns.map((column) => column.key)).not.toContain(
      'nominalAnnualInterestRate',
    );
  });

  it('offers a retry rather than an empty list when the load fails', () => {
    products['list'].mockReturnValue(throwError(() => new Error('API Error')));

    fixture.detectChanges();

    expect(component.products()).toEqual([]);
    expect(component.hasError()).toBe(true);
    expect(component.isLoading()).toBe(false);
  });

  it('should navigate to create product form', () => {
    component.onCreate();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/products/fixed/create']);
  });

  it('should navigate to edit product form', () => {
    component.onEdit(mapDepositProductSummary(ROW));
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/products/fixed/edit', 789]);
  });
});
