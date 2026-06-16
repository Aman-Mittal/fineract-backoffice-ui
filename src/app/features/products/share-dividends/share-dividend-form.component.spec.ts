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
import { ShareDividendFormComponent } from './share-dividend-form.component';
import { SelfDividendService } from '../../../api';
import { ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { of } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { provideNoopAnimations } from '@angular/platform-browser/animations';

describe('ShareDividendFormComponent', () => {
  let component: ShareDividendFormComponent;
  let fixture: ComponentFixture<ShareDividendFormComponent>;
  let serviceSpy: jasmine.SpyObj<SelfDividendService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    serviceSpy = jasmine.createSpyObj('SelfDividendService', ['postShareproductProductIdDividend']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [ShareDividendFormComponent, TranslateModule.forRoot()],
      providers: [
        { provide: SelfDividendService, useValue: serviceSpy },
        { provide: Router, useValue: routerSpy },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: convertToParamMap({ productId: '1' }) } },
        },
        provideNoopAnimations(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ShareDividendFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should read the product id on init', () => {
    expect(component).toBeTruthy();
    expect(component.productId).toBe(1);
  });

  it('should post on create and navigate to the list', () => {
    serviceSpy.postShareproductProductIdDividend.and.returnValue(
      of('') as unknown as ReturnType<SelfDividendService['postShareproductProductIdDividend']>,
    );
    component.dividendAmount = 100;
    component.dividendPeriodStartDate = new Date(2026, 0, 1);
    component.dividendPeriodEndDate = new Date(2026, 11, 31);
    component.onSubmit();

    expect(serviceSpy.postShareproductProductIdDividend).toHaveBeenCalled();
    const [productId, body] = serviceSpy.postShareproductProductIdDividend.calls.mostRecent().args;
    expect(productId).toBe(1);
    const parsed = JSON.parse(body as string);
    expect(parsed.dividendAmount).toBe(100);
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/products/shares', 1, 'dividends']);
  });
});
