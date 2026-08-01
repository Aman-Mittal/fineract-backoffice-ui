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
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonInput,
  IonItem,
  IonLabel,
  IonSelect,
  IonSelectOption,
  IonSpinner,
  IonTextarea,
} from '@ionic/angular/standalone';
import {
  FixedDepositProductService,
  PostFixedDepositProductsRequest,
  PutFixedDepositProductsProductIdRequest,
  GetFixedDepositProductsProductIdResponse,
} from '../../../api';

const DEFAULT_CURRENCY = 'USD';
const DEFAULT_LOCALE = 'en';
const DEFAULT_DATE_FORMAT = 'yyyy-MM-dd';
const FIXED_PRODUCTS_PATH = '/products/fixed';

@Component({
  selector: 'app-fixed-deposit-product-form',
  standalone: true,
  imports: [
    FormsModule,
    TranslateModule,
    IonButton,
    IonSpinner,
    IonInput,
    IonTextarea,
    IonItem,
    IonLabel,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonCard,
    IonSelectOption,
    IonSelect,
  ],
  template: `
    <div class="form-container">
      <ion-card>
        <ion-card-header>
          <ion-card-title>
            {{
              isEditMode
                ? ('PRODUCTS.EDIT_FIXED_DEPOSIT_PRODUCT' | translate)
                : ('PRODUCTS.CREATE_FIXED_DEPOSIT_PRODUCT' | translate)
            }}
          </ion-card-title>
        </ion-card-header>

        <ion-card-content>
          <form #productForm="ngForm" (ngSubmit)="onSubmit()" class="product-form">
            <div class="form-grid">
              <ion-item fill="outline">
                <ion-label position="stacked">{{ 'COMMON.NAME' | translate }}</ion-label>
                <ion-input
                  [attr.aria-label]="'COMMON.NAME' | translate"
                  name="name"
                  [(ngModel)]="product['name']"
                  required
                ></ion-input>
              </ion-item>

              <ion-item fill="outline">
                <ion-label position="stacked">{{ 'PRODUCTS.SHORT_NAME' | translate }}</ion-label>
                <ion-input
                  [attr.aria-label]="'PRODUCTS.SHORT_NAME' | translate"
                  name="shortName"
                  [(ngModel)]="product['shortName']"
                  required
                  maxlength="4"
                ></ion-input>
              </ion-item>

              <ion-item fill="outline" class="full-width">
                <ion-label position="stacked">{{ 'PRODUCTS.DESCRIPTION' | translate }}</ion-label>
                <ion-textarea
                  [attr.aria-label]="'PRODUCTS.DESCRIPTION' | translate"
                  name="description"
                  [(ngModel)]="product['description']"
                  rows="2"
                ></ion-textarea>
              </ion-item>

              <ion-item fill="outline">
                <ion-label position="stacked">{{ 'PRODUCTS.CURRENCY' | translate }}</ion-label>
                <ion-select
                  [attr.aria-label]="'PRODUCTS.CURRENCY' | translate"
                  interface="popover"
                  name="currencyCode"
                  [(ngModel)]="product['currencyCode']"
                  required
                >
                  <ion-select-option [value]="DEFAULT_CURRENCY">{{
                    DEFAULT_CURRENCY
                  }}</ion-select-option>
                  <ion-select-option value="EUR">EUR</ion-select-option>
                  <ion-select-option value="INR">INR</ion-select-option>
                </ion-select>
              </ion-item>

              <ion-item fill="outline">
                <ion-label position="stacked">{{
                  'PRODUCTS.DECIMAL_PLACES' | translate
                }}</ion-label>
                <ion-input
                  [attr.aria-label]="'PRODUCTS.DECIMAL_PLACES' | translate"
                  type="number"
                  name="digitsAfterDecimal"
                  [(ngModel)]="product['digitsAfterDecimal']"
                  required
                ></ion-input>
              </ion-item>

              <ion-item fill="outline">
                <ion-label position="stacked">{{ 'COMMON.AMOUNT' | translate }}</ion-label>
                <ion-input
                  [attr.aria-label]="'COMMON.AMOUNT' | translate"
                  type="number"
                  name="depositAmount"
                  [(ngModel)]="product['depositAmount']"
                  required
                ></ion-input>
              </ion-item>

              <ion-item fill="outline">
                <ion-label position="stacked">{{
                  'PRODUCTS.MIN_DEPOSIT_TERM' | translate
                }}</ion-label>
                <ion-input
                  [attr.aria-label]="'PRODUCTS.MIN_DEPOSIT_TERM' | translate"
                  type="number"
                  name="minDepositTerm"
                  [(ngModel)]="product['minDepositTerm']"
                  required
                ></ion-input>
              </ion-item>

              <ion-item fill="outline">
                <ion-label position="stacked">{{ 'PRODUCTS.MIN_TERM_TYPE' | translate }}</ion-label>
                <ion-select
                  [attr.aria-label]="'PRODUCTS.MIN_TERM_TYPE' | translate"
                  interface="popover"
                  name="minDepositTermTypeId"
                  [(ngModel)]="product['minDepositTermTypeId']"
                  required
                >
                  <ion-select-option [value]="0">{{ 'COMMON.DAYS' | translate }}</ion-select-option>
                  <ion-select-option [value]="1">{{
                    'COMMON.WEEKS' | translate
                  }}</ion-select-option>
                  <ion-select-option [value]="2">{{
                    'COMMON.MONTHS' | translate
                  }}</ion-select-option>
                  <ion-select-option [value]="3">{{
                    'COMMON.YEARS' | translate
                  }}</ion-select-option>
                </ion-select>
              </ion-item>
            </div>

            <div class="form-actions">
              <ion-button fill="clear" type="button" (click)="onCancel()" [disabled]="isSaving">
                {{ 'COMMON.CANCEL' | translate }}
              </ion-button>
              <ion-button
                color="primary"
                type="submit"
                [disabled]="productForm.invalid || isSaving"
              >
                @if (isSaving) {
                  <ion-spinner name="crescent"></ion-spinner>
                  {{ 'COMMON.SAVING' | translate }}
                } @else {
                  {{ 'COMMON.SAVE' | translate }}
                }
              </ion-button>
            </div>
          </form>
        </ion-card-content>
      </ion-card>
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
export class FixedDepositProductFormComponent implements OnInit {
  private readonly productService = inject(FixedDepositProductService);
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
    minDepositTerm: 1,
    minDepositTermTypeId: 2, // Months
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
      .getFixeddepositproductsProductId(this.productId)
      .subscribe((data: GetFixedDepositProductsProductIdResponse) => {
        this.product = {
          name: data.name,
          shortName: data.shortName,
          description: data.description,
          currencyCode: data.currency?.code,
          digitsAfterDecimal: data.currency?.decimalPlaces,
          minDepositTerm: data.minDepositTerm,
          minDepositTermTypeId: data.minDepositTermType?.id,
          depositAmount: 1000, // Fallback
          accountingRule: 1,
        };
      });
  }

  onSubmit() {
    this.isSaving = true;
    this.product['locale'] = DEFAULT_LOCALE;

    // Add a default chart as it is mandatory
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

    if (this.isEditMode && this.productId) {
      this.productService
        .putFixeddepositproductsProductId(
          this.productId,
          payload as PutFixedDepositProductsProductIdRequest,
        )
        .subscribe({
          next: () => this.router.navigate([FIXED_PRODUCTS_PATH]),
          error: () => (this.isSaving = false),
        });
    } else {
      this.productService
        .postFixeddepositproducts(payload as unknown as PostFixedDepositProductsRequest)
        .subscribe({
          next: () => this.router.navigate([FIXED_PRODUCTS_PATH]),
          error: () => (this.isSaving = false),
        });
    }
  }

  onCancel() {
    this.router.navigate([FIXED_PRODUCTS_PATH]);
  }
}
