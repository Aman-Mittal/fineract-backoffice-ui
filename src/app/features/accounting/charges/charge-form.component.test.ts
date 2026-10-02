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

import { createSpyObj } from '../../../testing/mocks';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { ChargesService, CurrencyService } from '../../../api';
import { provideTranslateTesting } from '../../../testing/i18n-testing';
import { expectLookedUp } from '../../../testing/translated-text';
import { ChargeFormComponent } from './charge-form.component';

describe('ChargeFormComponent', () => {
  let fixture: ComponentFixture<ChargeFormComponent>;

  beforeEach(async () => {
    const chargesService = createSpyObj<ChargesService>(['getChargesTemplate']);
    chargesService.getChargesTemplate.mockReturnValue(
      of({}) as unknown as ReturnType<ChargesService['getChargesTemplate']>,
    );
    const currencyService = createSpyObj<CurrencyService>(['getCurrencies']);
    currencyService.getCurrencies.mockReturnValue(
      of({ selectedCurrencyOptions: [] }) as unknown as ReturnType<
        CurrencyService['getCurrencies']
      >,
    );

    await TestBed.configureTestingModule({
      imports: [ChargeFormComponent],
      providers: [
        ...provideTranslateTesting(),
        provideNoopAnimations(),
        { provide: ChargesService, useValue: chargesService },
        { provide: CurrencyService, useValue: currencyService },
        { provide: Router, useValue: createSpyObj<Router>(['navigate']) },
        { provide: ActivatedRoute, useValue: { paramMap: of(convertToParamMap({})) } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ChargeFormComponent);
    fixture.detectChanges();
  });

  it('renders its field labels through the translation adapter', () => {
    expectLookedUp(fixture.nativeElement, [
      'CHARGES.APPLIES_TO',
      'CHARGES.TIME_TYPE',
      'CHARGES.CALCULATION_TYPE',
    ]);
  });
});
