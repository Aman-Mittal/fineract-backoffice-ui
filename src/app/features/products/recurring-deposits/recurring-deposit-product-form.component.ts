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

import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {
  RecurringDepositProductService,
  GetRecurringDepositProductsProductIdResponse,
  PutRecurringDepositProductsRequest,
  PostRecurringDepositProductsRequest,
} from '../../../api';

const DEFAULT_CURRENCY = 'USD';
const DEFAULT_LOCALE = 'en';
const DEFAULT_DATE_FORMAT = 'yyyy-MM-dd';
const REDIRECT_URL = '/products/recurring';

@Component({
  selector: 'app-recurring-deposit-product-form',
  standalone: true,
  imports: [
    FormsModule,
    TranslateModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
  ],
  template: `
    <div class="form-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>
            {{
              isEditMode
                ? ('PRODUCTS.EDIT_RECURRING_DEPOSIT_PRODUCT' | translate)
                : ('PRODUCTS.CREATE_RECURRING_DEPOSIT_PRODUCT' | translate)
            }}
          </mat-card-title>
        </mat-card-header>

        <mat-card-content>
          <form #productForm="ngForm" (ngSubmit)="onSubmit()" class="product-form">
            <div class="form-grid">
              <mat-form-field appearance="outline">
                <mat-label>{{ 'COMMON.NAME' | translate }}</mat-label>
                <input matInput name="name" [(ngModel)]="product['name']" required />
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>{{ 'PRODUCTS.SHORT_NAME' | translate }}</mat-label>
                <input
                  matInput
                  name="shortName"
                  [(ngModel)]="product['shortName']"
                  required
                  maxlength="4"
                />
              </mat-form-field>

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>{{ 'PRODUCTS.DESCRIPTION' | translate }}</mat-label>
                <textarea
                  matInput
                  name="description"
                  [(ngModel)]="product['description']"
                  rows="2"
                ></textarea>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>{{ 'PRODUCTS.CURRENCY' | translate }}</mat-label>
                <mat-select name="currencyCode" [(ngModel)]="product['currencyCode']" required>
                  <mat-option [value]="DEFAULT_CURRENCY">{{ DEFAULT_CURRENCY }}</mat-option>
                  <mat-option value="EUR">EUR</mat-option>
                  <mat-option value="INR">INR</mat-option>
                </mat-select>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>{{ 'PRODUCTS.DECIMAL_PLACES' | translate }}</mat-label>
                <input
                  matInput
                  type="number"
                  name="digitsAfterDecimal"
                  [(ngModel)]="product['digitsAfterDecimal']"
                  required
                />
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>{{ 'PRODUCTS.RECURRING_FREQUENCY' | translate }}</mat-label>
                <input
                  matInput
                  type="number"
                  name="recurringEvery"
                  [(ngModel)]="product['recurringEvery']"
                  required
                />
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>{{ 'PRODUCTS.FREQUENCY_TYPE' | translate }}</mat-label>
                <mat-select
                  name="recurringFrequencyType"
                  [(ngModel)]="product['recurringFrequencyType']"
                  required
                >
                  <mat-option [value]="0">{{ 'COMMON.DAYS' | translate }}</mat-option>
                  <mat-option [value]="1">{{ 'COMMON.WEEKS' | translate }}</mat-option>
                  <mat-option [value]="2">{{ 'COMMON.MONTHS' | translate }}</mat-option>
                  <mat-option [value]="3">{{ 'COMMON.YEARS' | translate }}</mat-option>
                </mat-select>
              </mat-form-field>
            </div>

            <div class="form-actions">
              <button mat-button type="button" (click)="onCancel()" [disabled]="isSaving">
                {{ 'COMMON.CANCEL' | translate }}
              </button>
              <button
                mat-raised-button
                color="primary"
                type="submit"
                [disabled]="productForm.invalid || isSaving"
              >
                @if (isSaving) {
                  <mat-spinner
                    diameter="20"
                    style="margin-right: 8px; display: inline-block; vertical-align: middle;"
                  ></mat-spinner>
                  {{ 'COMMON.SAVING' | translate }}
                } @else {
                  {{ 'COMMON.SAVE' | translate }}
                }
              </button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [
    `
      .form-container {
        padding: 24px;
        max-width: 900px;
        margin: 0 auto;
      }
      .product-form {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }
      .form-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 16px;
      }
    `,
  ],
})
export class RecurringDepositProductFormComponent implements OnInit {
  private readonly productService = inject(RecurringDepositProductService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  protected readonly DEFAULT_CURRENCY = DEFAULT_CURRENCY;

  productId: number | null = null;
  isEditMode = false;
  isSaving = false;

  product: Record<string, unknown> = {
    currencyCode: DEFAULT_CURRENCY,
    digitsAfterDecimal: 2,
    inMultiplesOf: 0,
    interestCompoundingPeriodType: 4, // Monthly
    interestPostingPeriodType: 4, // Monthly
    interestCalculationType: 1, // Daily
    interestCalculationDaysInYearType: 365,
    accountingRule: 1, // NONE
    recurringEvery: 1,
    recurringFrequencyType: 2, // Months
    minDepositTerm: 1,
    minDepositTermTypeId: 2,
    depositAmount: 1000,
  };

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.productId = +id;
        this.isEditMode = true;
        this.loadProductData();
      }
    });
  }

  loadProductData() {
    if (!this.productId) return;
    this.productService
      .getRecurringdepositproductsProductId(this.productId)
      .subscribe((data: GetRecurringDepositProductsProductIdResponse) => {
        this.product = {
          name: data.name,
          shortName: data.shortName,
          description: data.description,
          currencyCode: data.currency?.code,
          digitsAfterDecimal: data.currency?.decimalPlaces,
          recurringEvery: data.recurringDepositFrequency,
          recurringFrequencyType: data.recurringDepositFrequencyType?.id,
          accountingRule: 1,
          depositAmount: 1000, // Fallback
        };
      });
  }

  onSubmit() {
    this.isSaving = true;
    this.product['locale'] = DEFAULT_LOCALE;

    const payload = {
      ...this.product,
      charts: [
        {
          fromDate: new Date().toISOString().split('T')[0],
          dateFormat: DEFAULT_DATE_FORMAT,
          locale: DEFAULT_LOCALE,
          chartSlabs: [
            {
              periodType: 2, // Months
              fromPeriod: 1,
              annualInterestRate: 5,
            },
          ],
        },
      ],
    };
    delete (payload as Record<string, unknown>)['recurringEvery'];
    delete (payload as Record<string, unknown>)['recurringFrequencyType'];
    delete (payload as Record<string, unknown>)['recurringDepositFrequency'];
    delete (payload as Record<string, unknown>)['recurringDepositFrequencyTypeId'];

    if (this.isEditMode && this.productId) {
      this.productService
        .putRecurringdepositproductsProductId(
          this.productId,
          payload as unknown as PutRecurringDepositProductsRequest,
        )
        .subscribe({
          next: () => this.router.navigate([REDIRECT_URL]),
          error: () => (this.isSaving = false),
        });
    } else {
      this.productService
        .postRecurringdepositproducts(payload as unknown as PostRecurringDepositProductsRequest)
        .subscribe({
          next: () => this.router.navigate([REDIRECT_URL]),
          error: () => (this.isSaving = false),
        });
    }
  }

  onCancel() {
    this.router.navigate([REDIRECT_URL]);
  }
}
