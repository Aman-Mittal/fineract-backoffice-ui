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
  IonSelect,
  IonSelectOption,
  IonTextarea,
  IonButton,
  IonSpinner,
  IonGrid,
  IonRow,
  IonCol,
} from '@ionic/angular/standalone';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import {
  WorkingCapitalLoanProductsService,
  PostWorkingCapitalLoanProductsRequest,
  StringEnumOptionData,
  CurrencyData,
  WorkingCapitalBreachData,
  WorkingCapitalNearBreachData,
  GetDelinquencyBucket,
  FundData,
} from '../../../api';
import {
  formatDateToFineract,
  FINERACT_DATE_FORMAT,
  FINERACT_LOCALE,
} from '../../../core/utils/date-formatter';

/**
 * Create / edit form for a working-capital loan product. Covers the core mandatory
 * and common fields; currency / amortization / repayment-frequency options come from
 * the product template endpoint. Mirrors the working-capital breach form.
 */
@Component({
  selector: 'app-wc-loan-product-form',
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
    IonSelect,
    IonSelectOption,
    IonTextarea,
    IonButton,
    IonSpinner,
    IonGrid,
    IonRow,
    IonCol,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  template: `
    <div class="form-container">
      <ion-card class="ion-no-margin">
        <ion-card-header>
          <ion-card-title>
            {{
              isEditMode
                ? ('WC_LOAN_PRODUCTS.EDIT' | translate)
                : ('WC_LOAN_PRODUCTS.CREATE' | translate)
            }}
          </ion-card-title>
        </ion-card-header>

        <ion-card-content>
          <form #productForm="ngForm" (ngSubmit)="onSubmit()" class="wc-form">
            <ion-grid class="ion-no-padding">
              <ion-row>
                <ion-col size="12" size-md="6">
                  <ion-item fill="outline" class="form-item">
                    <ion-label position="stacked">{{
                      'WC_LOAN_PRODUCTS.NAME' | translate
                    }}</ion-label>
                    <ion-input
                      id="wc-product-name"
                      data-testid="wc-product-name"
                      name="name"
                      [(ngModel)]="product.name"
                      required
                    ></ion-input>
                  </ion-item>
                </ion-col>

                <ion-col size="12" size-md="6">
                  <ion-item fill="outline" class="form-item">
                    <ion-label position="stacked">{{
                      'WC_LOAN_PRODUCTS.SHORT_NAME' | translate
                    }}</ion-label>
                    <ion-input
                      id="wc-product-short-name"
                      data-testid="wc-product-short-name"
                      name="shortName"
                      [(ngModel)]="product.shortName"
                      required
                    ></ion-input>
                  </ion-item>
                </ion-col>

                <ion-col size="12">
                  <ion-item fill="outline" class="form-item">
                    <ion-label position="stacked">{{
                      'WC_LOAN_PRODUCTS.DESCRIPTION' | translate
                    }}</ion-label>
                    <ion-textarea
                      id="wc-product-description"
                      data-testid="wc-product-description"
                      name="description"
                      [(ngModel)]="product.description"
                    ></ion-textarea>
                  </ion-item>
                </ion-col>

                <ion-col size="12" size-md="6">
                  <ion-item fill="outline" class="form-item">
                    <ion-label position="stacked">{{
                      'WC_LOAN_PRODUCTS.CURRENCY' | translate
                    }}</ion-label>
                    <ion-select
                      id="wc-product-currency-code"
                      data-testid="wc-product-currency-code"
                      name="currencyCode"
                      [(ngModel)]="product.currencyCode"
                      required
                    >
                      @for (opt of currencyOptions; track opt.code) {
                        <ion-select-option [value]="opt.code"
                          >{{ opt.name }} ({{ opt.code }})</ion-select-option
                        >
                      }
                    </ion-select>
                  </ion-item>
                </ion-col>

                <ion-col size="12" size-md="6">
                  <ion-item fill="outline" class="form-item">
                    <ion-label position="stacked">{{
                      'WC_LOAN_PRODUCTS.DIGITS_AFTER_DECIMAL' | translate
                    }}</ion-label>
                    <ion-input
                      id="wc-product-digits-after-decimal"
                      data-testid="wc-product-digits-after-decimal"
                      type="number"
                      name="digitsAfterDecimal"
                      [(ngModel)]="product.digitsAfterDecimal"
                      required
                    ></ion-input>
                  </ion-item>
                </ion-col>

                <ion-col size="12" size-md="6">
                  <ion-item fill="outline" class="form-item">
                    <ion-label position="stacked">{{
                      'WC_LOAN_PRODUCTS.IN_MULTIPLES_OF' | translate
                    }}</ion-label>
                    <ion-input
                      id="wc-product-in-multiples-of"
                      data-testid="wc-product-in-multiples-of"
                      type="number"
                      name="inMultiplesOf"
                      [(ngModel)]="product.inMultiplesOf"
                    ></ion-input>
                  </ion-item>
                </ion-col>

                <ion-col size="12" size-md="6">
                  <ion-item fill="outline" class="form-item">
                    <ion-label position="stacked">{{
                      'WC_LOAN_PRODUCTS.PRINCIPAL' | translate
                    }}</ion-label>
                    <ion-input
                      id="wc-product-principal"
                      data-testid="wc-product-principal"
                      type="number"
                      name="principal"
                      [(ngModel)]="product.principal"
                      required
                    ></ion-input>
                  </ion-item>
                </ion-col>

                <ion-col size="12" size-md="6">
                  <ion-item fill="outline" class="form-item">
                    <ion-label position="stacked">{{
                      'WC_LOAN_PRODUCTS.PERIOD_PAYMENT_RATE' | translate
                    }}</ion-label>
                    <ion-input
                      id="wc-product-period-payment-rate"
                      data-testid="wc-product-period-payment-rate"
                      type="number"
                      name="periodPaymentRate"
                      [(ngModel)]="product.periodPaymentRate"
                      required
                    ></ion-input>
                  </ion-item>
                </ion-col>

                <ion-col size="12" size-md="6">
                  <ion-item fill="outline" class="form-item">
                    <ion-label position="stacked">{{
                      'WC_LOAN_PRODUCTS.REPAYMENT_EVERY' | translate
                    }}</ion-label>
                    <ion-input
                      id="wc-product-repayment-every"
                      data-testid="wc-product-repayment-every"
                      type="number"
                      name="repaymentEvery"
                      [(ngModel)]="product.repaymentEvery"
                      required
                    ></ion-input>
                  </ion-item>
                </ion-col>

                <ion-col size="12" size-md="6">
                  <ion-item fill="outline" class="form-item">
                    <ion-label position="stacked">{{
                      'WC_LOAN_PRODUCTS.REPAYMENT_FREQUENCY' | translate
                    }}</ion-label>
                    <ion-select
                      id="wc-product-repayment-frequency"
                      data-testid="wc-product-repayment-frequency"
                      name="repaymentFrequencyType"
                      [(ngModel)]="product.repaymentFrequencyType"
                      required
                    >
                      @for (opt of repaymentFrequencyTypeOptions; track opt.id) {
                        <ion-select-option [value]="opt.code">{{ opt.value }}</ion-select-option>
                      }
                    </ion-select>
                  </ion-item>
                </ion-col>

                <ion-col size="12" size-md="6">
                  <ion-item fill="outline" class="form-item">
                    <ion-label position="stacked">{{
                      'WC_LOAN_PRODUCTS.AMORTIZATION_TYPE' | translate
                    }}</ion-label>
                    <ion-select
                      id="wc-product-amortization-type"
                      data-testid="wc-product-amortization-type"
                      name="amortizationType"
                      [(ngModel)]="product.amortizationType"
                      required
                    >
                      @for (opt of amortizationTypeOptions; track opt.id) {
                        <ion-select-option [value]="opt.code">{{ opt.value }}</ion-select-option>
                      }
                    </ion-select>
                  </ion-item>
                </ion-col>

                <ion-col size="12" size-md="6">
                  <ion-item fill="outline" class="form-item">
                    <ion-label position="stacked">{{
                      'WC_LOAN_PRODUCTS.NPV_DAY_COUNT' | translate
                    }}</ion-label>
                    <ion-input
                      id="wc-product-npv-day-count"
                      data-testid="wc-product-npv-day-count"
                      type="number"
                      name="npvDayCount"
                      [(ngModel)]="product.npvDayCount"
                      required
                    ></ion-input>
                  </ion-item>
                </ion-col>

                <ion-col size="12" size-md="6">
                  <ion-item fill="outline" class="form-item">
                    <ion-label position="stacked">{{
                      'WC_LOAN_PRODUCTS.MIN_PRINCIPAL' | translate
                    }}</ion-label>
                    <ion-input
                      id="wc-product-min-principal"
                      data-testid="wc-product-min-principal"
                      type="number"
                      name="minPrincipal"
                      [(ngModel)]="product.minPrincipal"
                    ></ion-input>
                  </ion-item>
                </ion-col>

                <ion-col size="12" size-md="6">
                  <ion-item fill="outline" class="form-item">
                    <ion-label position="stacked">{{
                      'WC_LOAN_PRODUCTS.MAX_PRINCIPAL' | translate
                    }}</ion-label>
                    <ion-input
                      id="wc-product-max-principal"
                      data-testid="wc-product-max-principal"
                      type="number"
                      name="maxPrincipal"
                      [(ngModel)]="product.maxPrincipal"
                    ></ion-input>
                  </ion-item>
                </ion-col>

                <ion-col size="12" size-md="6">
                  <ion-item fill="outline" class="form-item">
                    <ion-label position="stacked">{{
                      'WC_LOAN_PRODUCTS.MIN_PERIOD_PAYMENT_RATE' | translate
                    }}</ion-label>
                    <ion-input
                      id="wc-product-min-period-payment-rate"
                      data-testid="wc-product-min-period-payment-rate"
                      type="number"
                      name="minPeriodPaymentRate"
                      [(ngModel)]="product.minPeriodPaymentRate"
                    ></ion-input>
                  </ion-item>
                </ion-col>

                <ion-col size="12" size-md="6">
                  <ion-item fill="outline" class="form-item">
                    <ion-label position="stacked">{{
                      'WC_LOAN_PRODUCTS.MAX_PERIOD_PAYMENT_RATE' | translate
                    }}</ion-label>
                    <ion-input
                      id="wc-product-max-period-payment-rate"
                      data-testid="wc-product-max-period-payment-rate"
                      type="number"
                      name="maxPeriodPaymentRate"
                      [(ngModel)]="product.maxPeriodPaymentRate"
                    ></ion-input>
                  </ion-item>
                </ion-col>

                <ion-col size="12" size-md="6">
                  <ion-item fill="outline" class="form-item">
                    <ion-label position="stacked">{{
                      'WC_LOAN_PRODUCTS.ACCOUNTING_RULE' | translate
                    }}</ion-label>
                    <ion-select
                      id="wc-product-accounting-rule"
                      data-testid="wc-product-accounting-rule"
                      name="accountingRule"
                      [(ngModel)]="product.accountingRule"
                    >
                      @for (opt of accountingRuleOptions; track opt.id) {
                        <ion-select-option [value]="opt.code">{{ opt.value }}</ion-select-option>
                      }
                    </ion-select>
                  </ion-item>
                </ion-col>

                <ion-col size="12" size-md="6">
                  <ion-item fill="outline" class="form-item">
                    <ion-label position="stacked">{{
                      'WC_LOAN_PRODUCTS.BREACH' | translate
                    }}</ion-label>
                    <ion-select
                      id="wc-product-breach-id"
                      data-testid="wc-product-breach-id"
                      name="breachId"
                      [(ngModel)]="product.breachId"
                    >
                      @for (opt of breachOptions; track opt.id) {
                        <ion-select-option [value]="opt.id">{{ opt.name }}</ion-select-option>
                      }
                    </ion-select>
                  </ion-item>
                </ion-col>

                <ion-col size="12" size-md="6">
                  <ion-item fill="outline" class="form-item">
                    <ion-label position="stacked">{{
                      'WC_LOAN_PRODUCTS.NEAR_BREACH' | translate
                    }}</ion-label>
                    <ion-select
                      id="wc-product-near-breach-id"
                      data-testid="wc-product-near-breach-id"
                      name="nearBreachId"
                      [(ngModel)]="product.nearBreachId"
                    >
                      @for (opt of nearBreachOptions; track opt.id) {
                        <ion-select-option [value]="opt.id">{{ opt.name }}</ion-select-option>
                      }
                    </ion-select>
                  </ion-item>
                </ion-col>

                <ion-col size="12" size-md="6">
                  <ion-item fill="outline" class="form-item">
                    <ion-label position="stacked">{{
                      'WC_LOAN_PRODUCTS.DELINQUENCY_BUCKET' | translate
                    }}</ion-label>
                    <ion-select
                      id="wc-product-delinquency-bucket-id"
                      data-testid="wc-product-delinquency-bucket-id"
                      name="delinquencyBucketId"
                      [(ngModel)]="product.delinquencyBucketId"
                    >
                      @for (opt of delinquencyBucketOptions; track opt.id) {
                        <ion-select-option [value]="opt.id">{{ opt.name }}</ion-select-option>
                      }
                    </ion-select>
                  </ion-item>
                </ion-col>

                <ion-col size="12" size-md="6">
                  <ion-item fill="outline" class="form-item">
                    <ion-label position="stacked">{{
                      'WC_LOAN_PRODUCTS.FUND' | translate
                    }}</ion-label>
                    <ion-select
                      id="wc-product-fund-id"
                      data-testid="wc-product-fund-id"
                      name="fundId"
                      [(ngModel)]="product.fundId"
                    >
                      @for (opt of fundOptions; track opt.id) {
                        <ion-select-option [value]="opt.id">{{ opt.name }}</ion-select-option>
                      }
                    </ion-select>
                  </ion-item>
                </ion-col>

                <ion-col size="12" size-md="6">
                  <ion-item fill="outline" class="form-item">
                    <ion-label position="stacked">{{
                      'WC_LOAN_PRODUCTS.START_DATE' | translate
                    }}</ion-label>
                    <input
                      id="wc-product-start-date"
                      data-testid="wc-product-start-date"
                      matInput
                      [matDatepicker]="startPicker"
                      name="startDate"
                      [(ngModel)]="startDate"
                    />
                    <mat-datepicker-toggle matSuffix [for]="startPicker"></mat-datepicker-toggle>
                    <mat-datepicker #startPicker></mat-datepicker>
                  </ion-item>
                </ion-col>

                <ion-col size="12" size-md="6">
                  <ion-item fill="outline" class="form-item">
                    <ion-label position="stacked">{{
                      'WC_LOAN_PRODUCTS.CLOSE_DATE' | translate
                    }}</ion-label>
                    <input
                      id="wc-product-close-date"
                      data-testid="wc-product-close-date"
                      matInput
                      [matDatepicker]="closePicker"
                      name="closeDate"
                      [(ngModel)]="closeDate"
                    />
                    <mat-datepicker-toggle matSuffix [for]="closePicker"></mat-datepicker-toggle>
                    <mat-datepicker #closePicker></mat-datepicker>
                  </ion-item>
                </ion-col>

                <ion-col size="12">
                  <ion-item fill="outline" class="form-item">
                    <ion-label position="stacked">{{
                      'WC_LOAN_PRODUCTS.EXTERNAL_ID' | translate
                    }}</ion-label>
                    <ion-input
                      id="wc-product-external-id"
                      data-testid="wc-product-external-id"
                      name="externalId"
                      [(ngModel)]="product.externalId"
                    ></ion-input>
                  </ion-item>
                </ion-col>
              </ion-row>
            </ion-grid>

            <div class="form-actions">
              <ion-button
                id="wc-product-cancel-btn"
                data-testid="wc-product-cancel-btn"
                fill="clear"
                color="medium"
                type="button"
                (click)="onCancel()"
                [disabled]="isSaving"
              >
                {{ 'COMMON.CANCEL' | translate }}
              </ion-button>
              <ion-button
                id="wc-product-submit-btn"
                data-testid="wc-product-submit-btn"
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
        max-width: 800px;
        margin: 0 auto;
      }
      .wc-form {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }
      .form-item {
        --background: var(--ion-color-light, #f8f9fa);
        --border-radius: 8px;
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
export class WcLoanProductFormComponent implements OnInit {
  private readonly productService = inject(WorkingCapitalLoanProductsService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  private readonly LIST_PATH = '/working-capital/loan-products';

  productId: number | null = null;
  isEditMode = false;
  isSaving = false;

  product: Partial<PostWorkingCapitalLoanProductsRequest> = {};
  startDate: Date | null = null;
  closeDate: Date | null = null;

  currencyOptions: CurrencyData[] = [];
  amortizationTypeOptions: StringEnumOptionData[] = [];
  repaymentFrequencyTypeOptions: StringEnumOptionData[] = [];
  accountingRuleOptions: StringEnumOptionData[] = [];
  breachOptions: WorkingCapitalBreachData[] = [];
  nearBreachOptions: WorkingCapitalNearBreachData[] = [];
  delinquencyBucketOptions: GetDelinquencyBucket[] = [];
  fundOptions: FundData[] = [];

  ngOnInit(): void {
    this.productService.getWorkingCapitalLoanProductsTemplate().subscribe((tpl) => {
      this.currencyOptions = tpl.currencyOptions ?? [];
      this.amortizationTypeOptions = tpl.amortizationTypeOptions ?? [];
      this.repaymentFrequencyTypeOptions = tpl.periodFrequencyTypeOptions ?? [];
      this.accountingRuleOptions = tpl.accountingRuleOptions ?? [];
      this.breachOptions = tpl.breachOptions ?? [];
      this.nearBreachOptions = tpl.nearBreachOptions ?? [];
      this.delinquencyBucketOptions = tpl.delinquencyBucketOptions ?? [];
      this.fundOptions = tpl.fundOptions ?? [];
    });

    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.productId = +id;
        this.isEditMode = true;
        this.load();
      }
    });
  }

  load(): void {
    if (!this.productId) return;
    this.productService.getWorkingCapitalLoanProductsProductId(this.productId).subscribe((data) => {
      this.product = {
        name: data.name,
        shortName: data.shortName,
        description: data.description,
        currencyCode: data.currency?.code,
        digitsAfterDecimal: data.currency?.decimalPlaces,
        inMultiplesOf: data.currency?.inMultiplesOf,
        principal: data.principal,
        minPrincipal: data.minPrincipal,
        maxPrincipal: data.maxPrincipal,
        periodPaymentRate: data.periodPaymentRate,
        minPeriodPaymentRate: data.minPeriodPaymentRate,
        maxPeriodPaymentRate: data.maxPeriodPaymentRate,
        repaymentEvery: data.repaymentEvery,
        repaymentFrequencyType: data.repaymentFrequencyType
          ?.code as PostWorkingCapitalLoanProductsRequest.RepaymentFrequencyTypeEnum,
        amortizationType: data.amortizationType
          ?.code as PostWorkingCapitalLoanProductsRequest.AmortizationTypeEnum,
        npvDayCount: data.npvDayCount,
        accountingRule: data.accountingRule
          ?.id as PostWorkingCapitalLoanProductsRequest.AccountingRuleEnum,
        breachId: data.breach?.id,
        nearBreachId: data.nearBreach?.id,
        delinquencyBucketId: data.delinquencyBucket?.id,
        fundId: data.fundId,
        externalId: data.externalId,
      };
      if (data.closeDate) {
        const cd = data.closeDate as unknown as number[];
        this.closeDate = Array.isArray(cd)
          ? new Date(cd[0], cd[1] - 1, cd[2])
          : new Date(data.closeDate);
      }
    });
  }

  onSubmit(): void {
    this.isSaving = true;
    const payload: PostWorkingCapitalLoanProductsRequest = {
      ...this.product,
      locale: FINERACT_LOCALE,
      dateFormat: FINERACT_DATE_FORMAT,
    };
    if (this.startDate) payload.startDate = formatDateToFineract(this.startDate);
    if (this.closeDate) payload.closeDate = formatDateToFineract(this.closeDate);

    const request$ =
      this.isEditMode && this.productId
        ? this.productService.putWorkingCapitalLoanProductsProductId(this.productId, payload)
        : this.productService.postWorkingCapitalLoanProducts(payload);

    request$.subscribe({
      next: () => this.router.navigate([this.LIST_PATH]),
      error: () => (this.isSaving = false),
    });
  }

  onCancel(): void {
    this.router.navigate([this.LIST_PATH]);
  }
}
