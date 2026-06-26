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
import { OnHoldTransactionsListComponent } from './on-hold-transactions-list.component';
import { DepositAccountOnHoldFundTransactionsService } from '../../../api';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { of } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { provideNoopAnimations } from '@angular/platform-browser/animations';

describe('OnHoldTransactionsListComponent', () => {
  let component: OnHoldTransactionsListComponent;
  let fixture: ComponentFixture<OnHoldTransactionsListComponent>;
  let serviceSpy: jasmine.SpyObj<DepositAccountOnHoldFundTransactionsService>;

  beforeEach(async () => {
    serviceSpy = jasmine.createSpyObj('DepositAccountOnHoldFundTransactionsService', [
      'getSavingsaccountsSavingsIdOnholdtransactions',
    ]);
    serviceSpy.getSavingsaccountsSavingsIdOnholdtransactions.and.returnValue(
      of(
        JSON.stringify([
          {
            id: 1,
            transactionDate: '01 January 2024',
            amount: 250,
            transactionType: { value: 'Hold' },
            loanClientName: 'John Doe',
          },
        ]),
      ) as unknown as ReturnType<
        DepositAccountOnHoldFundTransactionsService['getSavingsaccountsSavingsIdOnholdtransactions']
      >,
    );

    await TestBed.configureTestingModule({
      imports: [OnHoldTransactionsListComponent, TranslateModule.forRoot()],
      providers: [
        { provide: DepositAccountOnHoldFundTransactionsService, useValue: serviceSpy },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: convertToParamMap({ savingsId: '1' }) } },
        },
        provideNoopAnimations(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(OnHoldTransactionsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should load and parse on-hold transactions on init', () => {
    expect(component).toBeTruthy();
    expect(serviceSpy.getSavingsaccountsSavingsIdOnholdtransactions).toHaveBeenCalledWith(1);
    expect(component.transactions.length).toBe(1);
    expect(component.transactions[0].loanClientName).toBe('John Doe');
  });
});
