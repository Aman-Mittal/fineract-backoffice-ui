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
import { ProductMixComponent } from './product-mix.component';
import { ProductMixService } from '../../../api';
import { ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { of } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { provideNoopAnimations } from '@angular/platform-browser/animations';

describe('ProductMixComponent', () => {
  let component: ProductMixComponent;
  let fixture: ComponentFixture<ProductMixComponent>;
  let serviceSpy: jasmine.SpyObj<ProductMixService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    serviceSpy = jasmine.createSpyObj('ProductMixService', [
      'getLoanproductsProductIdProductmix',
      'postLoanproductsProductIdProductmix',
      'putLoanproductsProductIdProductmix',
      'deleteLoanproductsProductIdProductmix',
    ]);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    serviceSpy.getLoanproductsProductIdProductmix.and.returnValue(
      of({
        productOptions: [{ id: 2, name: 'Product B' }],
        restrictedProducts: [],
      }) as unknown as ReturnType<ProductMixService['getLoanproductsProductIdProductmix']>,
    );

    await TestBed.configureTestingModule({
      imports: [ProductMixComponent, TranslateModule.forRoot()],
      providers: [
        { provide: ProductMixService, useValue: serviceSpy },
        { provide: Router, useValue: routerSpy },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: convertToParamMap({ productId: '1' }) } },
        },
        provideNoopAnimations(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductMixComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should load product mix options on init', () => {
    expect(component).toBeTruthy();
    expect(serviceSpy.getLoanproductsProductIdProductmix).toHaveBeenCalledWith(1);
    expect(component.productOptions.length).toBe(1);
    expect(component.hasMix).toBeFalse();
  });

  it('should post when no mix exists and navigate to the list', () => {
    serviceSpy.postLoanproductsProductIdProductmix.and.returnValue(
      of({}) as unknown as ReturnType<ProductMixService['postLoanproductsProductIdProductmix']>,
    );
    component.restrictedProducts = [2];
    component.onSubmit();
    expect(serviceSpy.postLoanproductsProductIdProductmix).toHaveBeenCalledWith(1, {
      productId: 1,
      restrictedProducts: [2],
    });
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/products/loan']);
  });

  it('should put when a mix already exists', () => {
    component.hasMix = true;
    serviceSpy.putLoanproductsProductIdProductmix.and.returnValue(
      of({}) as unknown as ReturnType<ProductMixService['putLoanproductsProductIdProductmix']>,
    );
    component.restrictedProducts = [2];
    component.onSubmit();
    expect(serviceSpy.putLoanproductsProductIdProductmix).toHaveBeenCalledWith(1, {
      productId: 1,
      restrictedProducts: [2],
    });
  });

  it('should delete after confirmation and navigate to the list', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    serviceSpy.deleteLoanproductsProductIdProductmix.and.returnValue(
      of({}) as unknown as ReturnType<ProductMixService['deleteLoanproductsProductIdProductmix']>,
    );
    component.onDelete();
    expect(serviceSpy.deleteLoanproductsProductIdProductmix).toHaveBeenCalledWith(1);
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/products/loan']);
  });
});
