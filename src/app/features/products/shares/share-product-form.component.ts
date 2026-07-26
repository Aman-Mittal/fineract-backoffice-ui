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
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonItem,
  IonLabel,
  IonInput,
  IonTextarea,
  IonSelect,
  IonSelectOption,
  IonButton,
  IonSpinner,
  IonGrid,
  IonRow,
  IonCol,
} from '@ionic/angular/standalone';
import { ProductsService, PostProductsTypeRequest } from '../../../api';

const DEFAULT_CURRENCY = 'USD';
const DEFAULT_LOCALE = 'en';
const REDIRECT_URL = '/products/share';
const PRODUCT_TYPE = 'share';

@Component({
  selector: 'app-share-product-form',
  standalone: true,
  imports: [
    FormsModule,
    TranslateModule,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonItem,
    IonLabel,
    IonInput,
    IonTextarea,
    IonSelect,
    IonSelectOption,
    IonButton,
    IonSpinner,
    IonGrid,
    IonRow,
    IonCol,
  ],
  template: `
    <div class="form-container">
      <ion-card>
        <ion-card-header>
          <ion-card-title>
            {{
              isEditMode
                ? ('PRODUCTS.EDIT_SHARE_PRODUCT' | translate)
                : ('PRODUCTS.CREATE_SHARE_PRODUCT' | translate)
            }}
          </ion-card-title>
        </ion-card-header>

        <ion-card-content>
          <form #productForm="ngForm" (ngSubmit)="onSubmit()" class="product-form">
            <ion-grid>
              <ion-row>
                <ion-col size="12" size-md="6">
                  <ion-item fill="outline" class="form-item">
                    <ion-label position="stacked">{{ 'COMMON.NAME' | translate }}</ion-label>
                    <ion-input
                      id="share-product-name"
                      data-testid="share-product-name"
                      name="name"
                      [(ngModel)]="product.name"
                      required
                    ></ion-input>
                  </ion-item>
                </ion-col>

                <ion-col size="12" size-md="6">
                  <ion-item fill="outline" class="form-item">
                    <ion-label position="stacked">{{
                      'PRODUCTS.SHORT_NAME' | translate
                    }}</ion-label>
                    <ion-input
                      id="share-product-short-name"
                      data-testid="share-product-short-name"
                      name="shortName"
                      [(ngModel)]="product.shortName"
                      required
                      maxlength="4"
                    ></ion-input>
                  </ion-item>
                </ion-col>

                <ion-col size="12">
                  <ion-item fill="outline" class="form-item">
                    <ion-label position="stacked">{{
                      'PRODUCTS.DESCRIPTION' | translate
                    }}</ion-label>
                    <ion-textarea
                      id="share-product-description"
                      data-testid="share-product-description"
                      name="description"
                      [(ngModel)]="product.description"
                      rows="2"
                    ></ion-textarea>
                  </ion-item>
                </ion-col>

                <ion-col size="12" size-md="6">
                  <ion-item fill="outline" class="form-item">
                    <ion-label position="stacked">{{ 'PRODUCTS.CURRENCY' | translate }}</ion-label>
                    <ion-select
                      interface="popover"
                      id="share-product-currency-code"
                      data-testid="share-product-currency-code"
                      name="currencyCode"
                      [(ngModel)]="product.currencyCode"
                      required
                    >
                      <ion-select-option [value]="DEFAULT_CURRENCY">{{
                        DEFAULT_CURRENCY
                      }}</ion-select-option>
                      <ion-select-option value="EUR">EUR</ion-select-option>
                      <ion-select-option value="INR">INR</ion-select-option>
                    </ion-select>
                  </ion-item>
                </ion-col>

                <ion-col size="12" size-md="6">
                  <ion-item fill="outline" class="form-item">
                    <ion-label position="stacked">{{
                      'PRODUCTS.TOTAL_SHARES' | translate
                    }}</ion-label>
                    <ion-input
                      id="share-product-total-shares"
                      data-testid="share-product-total-shares"
                      type="number"
                      name="totalShares"
                      [(ngModel)]="product.totalShares"
                      required
                    ></ion-input>
                  </ion-item>
                </ion-col>

                <ion-col size="12" size-md="6">
                  <ion-item fill="outline" class="form-item">
                    <ion-label position="stacked">{{
                      'PRODUCTS.UNIT_PRICE' | translate
                    }}</ion-label>
                    <ion-input
                      id="share-product-unit-price"
                      data-testid="share-product-unit-price"
                      type="number"
                      name="unitPrice"
                      [(ngModel)]="product.unitPrice"
                      required
                    ></ion-input>
                  </ion-item>
                </ion-col>

                <ion-col size="12" size-md="6">
                  <ion-item fill="outline" class="form-item">
                    <ion-label position="stacked">{{
                      'PRODUCTS.NOMINAL_SHARES' | translate
                    }}</ion-label>
                    <ion-input
                      id="share-product-nominal-shares"
                      data-testid="share-product-nominal-shares"
                      type="number"
                      name="nominalShares"
                      [(ngModel)]="product.nominalShares"
                      required
                    ></ion-input>
                  </ion-item>
                </ion-col>
              </ion-row>
            </ion-grid>

            <div class="form-actions">
              <ion-button
                id="share-product-cancel-btn"
                data-testid="share-product-cancel-btn"
                fill="clear"
                color="medium"
                type="button"
                (click)="onCancel()"
                [disabled]="isSaving"
              >
                {{ 'COMMON.CANCEL' | translate }}
              </ion-button>
              <ion-button
                id="share-product-submit-btn"
                data-testid="share-product-submit-btn"
                color="primary"
                type="submit"
                [disabled]="productForm.invalid || isSaving"
              >
                @if (isSaving) {
                  <ion-spinner name="crescent" slot="start"></ion-spinner>
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
      .form-item {
        margin-bottom: 12px;
      }
      .form-actions {
        display: flex;
        justify-content: flex-end;
        gap: 12px;
        margin-top: 16px;
      }
    `,
  ],
})
export class ShareProductFormComponent implements OnInit {
  private readonly productService = inject(ProductsService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  protected readonly DEFAULT_CURRENCY = DEFAULT_CURRENCY;

  productId: number | null = null;
  isEditMode = false;
  isSaving = false;

  product: PostProductsTypeRequest = {
    currencyCode: DEFAULT_CURRENCY,
    digitsAfterDecimal: 2,
    inMultiplesOf: 1,
    totalShares: 1000,
    unitPrice: 1,
    nominalShares: 1,
    accountingRule: 1,
    allowDividendCalculationForInactiveClients: false,
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
    this.productService.getProductsTypeProductId(this.productId, PRODUCT_TYPE).subscribe((data) => {
      this.product = {
        name: data.name,
        shortName: data.shortName,
        description: data.description,
        currencyCode: data.currency?.code,
        digitsAfterDecimal: data.currency?.decimalPlaces,
        totalShares: data.totalShares,
        unitPrice: data.unitPrice,
        nominalShares: data.nominalShares,
        accountingRule: 1,
      };
    });
  }

  onSubmit() {
    this.isSaving = true;
    this.product.locale = DEFAULT_LOCALE;

    if (this.isEditMode && this.productId) {
      this.productService
        .putProductsTypeProductId(PRODUCT_TYPE, this.productId, this.product)
        .subscribe({
          next: () => this.router.navigate([REDIRECT_URL]),
          error: () => (this.isSaving = false),
        });
    } else {
      this.productService.postProductsType(PRODUCT_TYPE, this.product).subscribe({
        next: () => this.router.navigate([REDIRECT_URL]),
        error: () => (this.isSaving = false),
      });
    }
  }

  onCancel() {
    this.router.navigate([REDIRECT_URL]);
  }
}
