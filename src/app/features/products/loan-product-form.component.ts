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
import {
  LoanProductsService,
  PostLoanProductsRequest,
  PutLoanProductsProductIdRequest,
  FundData,
  FundsService,
  DelinquencyRangeAndBucketsManagementService,
  DelinquencyBucketResponse,
  EnumOptionData,
  GetLoanProductsTransactionProcessingStrategyOptions,
} from '../../api';
import { LOAN_SCHEDULE_TYPE, isAdvancedPaymentAllocationStrategy } from './loan-schedule-type';
import { PaymentCreditAllocationEditorComponent } from './payment-credit-allocation-editor.component';

@Component({
  selector: 'app-loan-product-form',
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
    PaymentCreditAllocationEditorComponent,
  ],
  template: `
    <div class="form-container">
      <ion-card class="ion-no-margin">
        <ion-card-header>
          <ion-card-title>
            {{
              isEditMode
                ? ('PRODUCTS.EDIT_LOAN_PRODUCT' | translate)
                : ('PRODUCTS.CREATE_LOAN_PRODUCT' | translate)
            }}
          </ion-card-title>
        </ion-card-header>

        <ion-card-content>
          <form #productForm="ngForm" (ngSubmit)="onSubmit()" class="product-form">
            <ion-grid class="ion-no-padding">
              <ion-row>
                <ion-col size="12" size-md="6">
                  <ion-item fill="outline" class="form-item">
                    <ion-label position="stacked">{{ 'COMMON.NAME' | translate }}</ion-label>
                    <ion-input
                      [attr.aria-label]="'COMMON.NAME' | translate"
                      id="loan-product-name"
                      data-testid="loan-product-name"
                      name="name"
                      [(ngModel)]="product.name"
                      required
                      placeholder="{{ 'COMMON.NAME' | translate }}"
                    ></ion-input>
                  </ion-item>
                </ion-col>

                <ion-col size="12" size-md="6">
                  <ion-item fill="outline" class="form-item">
                    <ion-label position="stacked">{{
                      'PRODUCTS.SHORT_NAME' | translate
                    }}</ion-label>
                    <ion-input
                      [attr.aria-label]="'PRODUCTS.SHORT_NAME' | translate"
                      id="loan-product-short-name"
                      data-testid="loan-product-short-name"
                      name="shortName"
                      [(ngModel)]="product.shortName"
                      required
                      maxlength="4"
                      placeholder="{{ 'PRODUCTS.SHORT_NAME' | translate }}"
                    ></ion-input>
                  </ion-item>
                </ion-col>

                <ion-col size="12">
                  <ion-item fill="outline" class="form-item">
                    <ion-label position="stacked">{{
                      'PRODUCTS.DESCRIPTION' | translate
                    }}</ion-label>
                    <ion-textarea
                      [attr.aria-label]="'PRODUCTS.DESCRIPTION' | translate"
                      id="loan-product-description"
                      data-testid="loan-product-description"
                      name="description"
                      [(ngModel)]="product.description"
                      rows="3"
                      placeholder="{{ 'PRODUCTS.DESCRIPTION' | translate }}"
                    ></ion-textarea>
                  </ion-item>
                </ion-col>

                <ion-col size="12">
                  <ion-item fill="outline" class="form-item">
                    <ion-label position="stacked">{{ 'COMMON.EXTERNAL_ID' | translate }}</ion-label>
                    <ion-input
                      [attr.aria-label]="'COMMON.EXTERNAL_ID' | translate"
                      id="loan-product-external-id"
                      data-testid="loan-product-external-id"
                      name="externalId"
                      [(ngModel)]="product.externalId"
                      placeholder="{{ 'COMMON.EXTERNAL_ID' | translate }}"
                    ></ion-input>
                  </ion-item>
                </ion-col>

                <ion-col size="12" size-md="6">
                  <ion-item fill="outline" class="form-item">
                    <ion-label position="stacked">{{ 'PRODUCTS.FUND' | translate }}</ion-label>
                    <ion-select
                      [attr.aria-label]="'PRODUCTS.FUND' | translate"
                      interface="popover"
                      id="loan-product-fund-id"
                      data-testid="loan-product-fund-id"
                      name="fundId"
                      [(ngModel)]="product.fundId"
                      placeholder="{{ 'PRODUCTS.FUND' | translate }}"
                    >
                      @for (fund of fundOptions; track fund.id) {
                        <ion-select-option [value]="fund.id">{{ fund.name }}</ion-select-option>
                      }
                    </ion-select>
                  </ion-item>
                </ion-col>

                <ion-col size="12" size-md="6">
                  <ion-item fill="outline" class="form-item">
                    <ion-label position="stacked">{{
                      'PRODUCTS.DELINQUENCY_BUCKET' | translate
                    }}</ion-label>
                    <ion-select
                      [attr.aria-label]="'PRODUCTS.DELINQUENCY_BUCKET' | translate"
                      interface="popover"
                      id="loan-product-delinquency-bucket-id"
                      data-testid="loan-product-delinquency-bucket-id"
                      name="delinquencyBucketId"
                      [(ngModel)]="product.delinquencyBucketId"
                      placeholder="{{ 'PRODUCTS.DELINQUENCY_BUCKET' | translate }}"
                    >
                      @for (bucket of delinquencyBucketOptions; track bucket.id) {
                        <ion-select-option [value]="bucket.id">{{ bucket.name }}</ion-select-option>
                      }
                    </ion-select>
                  </ion-item>
                </ion-col>

                <ion-col size="12" size-md="6">
                  <ion-item fill="outline" class="form-item">
                    <ion-label position="stacked">{{ 'PRODUCTS.CURRENCY' | translate }}</ion-label>
                    <ion-select
                      [attr.aria-label]="'PRODUCTS.CURRENCY' | translate"
                      interface="popover"
                      id="loan-product-currency-code"
                      data-testid="loan-product-currency-code"
                      name="currencyCode"
                      [(ngModel)]="product.currencyCode"
                      required
                      placeholder="{{ 'PRODUCTS.CURRENCY' | translate }}"
                    >
                      <ion-select-option value="USD">USD</ion-select-option>
                      <ion-select-option value="EUR">EUR</ion-select-option>
                      <ion-select-option value="INR">INR</ion-select-option>
                    </ion-select>
                  </ion-item>
                </ion-col>

                <ion-col size="12" size-md="6">
                  <ion-item fill="outline" class="form-item">
                    <ion-label position="stacked">{{
                      'PRODUCTS.DECIMAL_PLACES' | translate
                    }}</ion-label>
                    <ion-input
                      [attr.aria-label]="'PRODUCTS.DECIMAL_PLACES' | translate"
                      id="loan-product-digits-after-decimal"
                      data-testid="loan-product-digits-after-decimal"
                      type="number"
                      name="digitsAfterDecimal"
                      [(ngModel)]="product.digitsAfterDecimal"
                      required
                    ></ion-input>
                  </ion-item>
                </ion-col>

                <ion-col size="12" size-md="6">
                  <ion-item fill="outline" class="form-item">
                    <ion-label position="stacked">{{ 'PRODUCTS.PRINCIPAL' | translate }}</ion-label>
                    <ion-input
                      [attr.aria-label]="'PRODUCTS.PRINCIPAL' | translate"
                      id="loan-product-principal"
                      data-testid="loan-product-principal"
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
                      'PRODUCTS.INTEREST_RATE' | translate
                    }}</ion-label>
                    <ion-input
                      [attr.aria-label]="'PRODUCTS.INTEREST_RATE' | translate"
                      id="loan-product-interest-rate"
                      data-testid="loan-product-interest-rate"
                      type="number"
                      name="interestRatePerPeriod"
                      [(ngModel)]="product.interestRatePerPeriod"
                      required
                    ></ion-input>
                  </ion-item>
                </ion-col>

                <ion-col size="12" size-md="6">
                  <ion-item fill="outline" class="form-item">
                    <ion-label position="stacked">{{
                      'LOANS.REPAYMENTS_COUNT' | translate
                    }}</ion-label>
                    <ion-input
                      [attr.aria-label]="'LOANS.REPAYMENTS_COUNT' | translate"
                      id="loan-product-repayments-count"
                      data-testid="loan-product-repayments-count"
                      type="number"
                      name="numberOfRepayments"
                      [(ngModel)]="product.numberOfRepayments"
                      required
                    ></ion-input>
                  </ion-item>
                </ion-col>

                <ion-col size="12" size-md="6">
                  <ion-item fill="outline" class="form-item">
                    <ion-label position="stacked">{{
                      'LOANS.REPAYMENT_EVERY' | translate
                    }}</ion-label>
                    <ion-input
                      [attr.aria-label]="'LOANS.REPAYMENT_EVERY' | translate"
                      id="loan-product-repayment-every"
                      data-testid="loan-product-repayment-every"
                      type="number"
                      name="repaymentEvery"
                      [(ngModel)]="product.repaymentEvery"
                      required
                    ></ion-input>
                  </ion-item>
                </ion-col>

                <!-- Repayment Frequency Type -->
                <ion-col size="12" size-md="6">
                  <ion-item fill="outline" class="form-item">
                    <ion-label position="stacked">{{ 'COMMON.FREQUENCY' | translate }}</ion-label>
                    <ion-select
                      [attr.aria-label]="'COMMON.FREQUENCY' | translate"
                      interface="popover"
                      id="loan-product-repayment-frequency"
                      data-testid="loan-product-repayment-frequency"
                      name="repaymentFrequencyType"
                      [(ngModel)]="product.repaymentFrequencyType"
                      required
                    >
                      <ion-select-option [value]="0">{{
                        'COMMON.DAYS' | translate
                      }}</ion-select-option>
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
                </ion-col>

                <!-- Interest Rate Frequency Type -->
                <ion-col size="12" size-md="6">
                  <ion-item fill="outline" class="form-item">
                    <ion-label position="stacked">{{
                      'PRODUCTS.INTEREST_RATE_FREQUENCY_TYPE' | translate
                    }}</ion-label>
                    <ion-select
                      [attr.aria-label]="'PRODUCTS.INTEREST_RATE_FREQUENCY_TYPE' | translate"
                      interface="popover"
                      id="loan-product-interest-frequency"
                      data-testid="loan-product-interest-frequency"
                      name="interestRateFrequencyType"
                      [(ngModel)]="product.interestRateFrequencyType"
                      required
                    >
                      <ion-select-option [value]="2">{{
                        'COMMON.PER_MONTH' | translate
                      }}</ion-select-option>
                      <ion-select-option [value]="3">{{
                        'COMMON.PER_YEAR' | translate
                      }}</ion-select-option>
                    </ion-select>
                  </ion-item>
                </ion-col>

                <!-- Amortization Type -->
                <ion-col size="12" size-md="6">
                  <ion-item fill="outline" class="form-item">
                    <ion-label position="stacked">{{
                      'PRODUCTS.AMORTIZATION_TYPE' | translate
                    }}</ion-label>
                    <ion-select
                      [attr.aria-label]="'PRODUCTS.AMORTIZATION_TYPE' | translate"
                      interface="popover"
                      id="loan-product-amortization-type"
                      data-testid="loan-product-amortization-type"
                      name="amortizationType"
                      [(ngModel)]="product.amortizationType"
                      required
                    >
                      <ion-select-option [value]="1">{{
                        'LOANS.EQUAL_INSTALLMENTS' | translate
                      }}</ion-select-option>
                      <ion-select-option [value]="0">{{
                        'LOANS.EQUAL_PRINCIPAL' | translate
                      }}</ion-select-option>
                    </ion-select>
                  </ion-item>
                </ion-col>

                <!-- Interest Type -->
                <ion-col size="12" size-md="6">
                  <ion-item fill="outline" class="form-item">
                    <ion-label position="stacked">{{
                      'PRODUCTS.INTEREST_TYPE' | translate
                    }}</ion-label>
                    <ion-select
                      [attr.aria-label]="'PRODUCTS.INTEREST_TYPE' | translate"
                      interface="popover"
                      id="loan-product-interest-type"
                      data-testid="loan-product-interest-type"
                      name="interestType"
                      [(ngModel)]="product.interestType"
                      required
                    >
                      <ion-select-option [value]="0">{{
                        'LOANS.DECLINING_BALANCE' | translate
                      }}</ion-select-option>
                      <ion-select-option [value]="1">{{
                        'LOANS.FLAT' | translate
                      }}</ion-select-option>
                    </ion-select>
                  </ion-item>
                </ion-col>

                <!-- Interest Calculation Period Type -->
                <ion-col size="12" size-md="6">
                  <ion-item fill="outline" class="form-item">
                    <ion-label position="stacked">{{
                      'PRODUCTS.INTEREST_CALCULATION_PERIOD_TYPE' | translate
                    }}</ion-label>
                    <ion-select
                      [attr.aria-label]="'PRODUCTS.INTEREST_CALCULATION_PERIOD_TYPE' | translate"
                      interface="popover"
                      id="loan-product-interest-calc-period"
                      data-testid="loan-product-interest-calc-period"
                      name="interestCalculationPeriodType"
                      [(ngModel)]="product.interestCalculationPeriodType"
                      required
                    >
                      <ion-select-option [value]="0">{{
                        'LOANS.DAILY' | translate
                      }}</ion-select-option>
                      <ion-select-option [value]="1">{{
                        'LOANS.SAME_AS_REPAYMENT' | translate
                      }}</ion-select-option>
                    </ion-select>
                  </ion-item>
                </ion-col>

                <!-- Loan Schedule Type -->
                <ion-col size="12" size-md="6">
                  <ion-item fill="outline" class="form-item">
                    <ion-label position="stacked">{{
                      'PRODUCTS.LOAN_SCHEDULE_TYPE' | translate
                    }}</ion-label>
                    <ion-select
                      [attr.aria-label]="'PRODUCTS.LOAN_SCHEDULE_TYPE' | translate"
                      interface="popover"
                      id="loan-product-schedule-type"
                      data-testid="loan-product-schedule-type"
                      name="loanScheduleType"
                      [(ngModel)]="product.loanScheduleType"
                      (ngModelChange)="onLoanScheduleTypeChange($event)"
                      required
                    >
                      @for (option of loanScheduleTypeOptions; track option.code) {
                        <ion-select-option [value]="option.code">{{
                          option.value
                        }}</ion-select-option>
                      }
                    </ion-select>
                  </ion-item>
                </ion-col>

                <!-- Transaction Processing Strategy Code -->
                <ion-col size="12" size-md="6">
                  <ion-item fill="outline" class="form-item">
                    <ion-label position="stacked">{{
                      'PRODUCTS.TRANSACTION_PROCESSING_STRATEGY' | translate
                    }}</ion-label>
                    <ion-select
                      [attr.aria-label]="'PRODUCTS.TRANSACTION_PROCESSING_STRATEGY' | translate"
                      interface="popover"
                      id="loan-product-transaction-strategy"
                      data-testid="loan-product-transaction-strategy"
                      name="transactionProcessingStrategyCode"
                      [(ngModel)]="product.transactionProcessingStrategyCode"
                      [disabled]="isProgressive"
                      required
                    >
                      @for (option of transactionProcessingStrategyOptions; track option.code) {
                        <ion-select-option [value]="option.code">{{
                          option.name
                        }}</ion-select-option>
                      }
                    </ion-select>
                  </ion-item>
                </ion-col>

                <!-- Loan Schedule Processing Type (Progressive only) -->
                @if (isProgressive) {
                  <ion-col size="12" size-md="6">
                    <ion-item fill="outline" class="form-item">
                      <ion-label position="stacked">{{
                        'PRODUCTS.LOAN_SCHEDULE_PROCESSING_TYPE' | translate
                      }}</ion-label>
                      <ion-select
                        [attr.aria-label]="'PRODUCTS.LOAN_SCHEDULE_PROCESSING_TYPE' | translate"
                        interface="popover"
                        id="loan-product-schedule-processing-type"
                        data-testid="loan-product-schedule-processing-type"
                        name="loanScheduleProcessingType"
                        [(ngModel)]="product.loanScheduleProcessingType"
                        required
                      >
                        @for (option of loanScheduleProcessingTypeOptions; track option.code) {
                          <ion-select-option [value]="option.code">{{
                            option.value
                          }}</ion-select-option>
                        }
                      </ion-select>
                    </ion-item>
                  </ion-col>
                }
              </ion-row>
            </ion-grid>

            @if (isProgressive) {
              <app-payment-credit-allocation-editor
                [transactionTypeOptions]="advancedPaymentAllocationTransactionTypes"
                [allocationRuleOptions]="advancedPaymentAllocationTypes"
                [futureInstallmentOptions]="
                  advancedPaymentAllocationFutureInstallmentAllocationRules
                "
                [creditTransactionTypeOptions]="creditAllocationTransactionTypes"
                [creditAllocationRuleOptions]="creditAllocationAllocationTypes"
                [paymentAllocation]="product.paymentAllocation ?? []"
                (paymentAllocationChange)="product.paymentAllocation = $event"
                [creditAllocation]="product.creditAllocation ?? []"
                (creditAllocationChange)="product.creditAllocation = $event"
              ></app-payment-credit-allocation-editor>
            }

            <div class="form-actions">
              <ion-button
                id="loan-product-cancel-btn"
                data-testid="loan-product-cancel-btn"
                fill="clear"
                color="medium"
                type="button"
                (click)="onCancel()"
                [disabled]="isSaving"
              >
                {{ 'COMMON.CANCEL' | translate }}
              </ion-button>
              <ion-button
                id="loan-product-submit-btn"
                data-testid="loan-product-submit-btn"
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
export class LoanProductFormComponent implements OnInit {
  private readonly productService = inject(LoanProductsService);
  private readonly fundsService = inject(FundsService);
  private readonly delinquencyService = inject(DelinquencyRangeAndBucketsManagementService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  private readonly LIST_PATH = '/products/loan';

  productId: number | null = null;
  isEditMode = false;
  isSaving = false;

  fundOptions: FundData[] = [];
  delinquencyBucketOptions: DelinquencyBucketResponse[] = [];

  loanScheduleTypeOptions: EnumOptionData[] = [];
  loanScheduleProcessingTypeOptions: EnumOptionData[] = [];
  advancedPaymentAllocationTypes: EnumOptionData[] = [];
  advancedPaymentAllocationTransactionTypes: EnumOptionData[] = [];
  advancedPaymentAllocationFutureInstallmentAllocationRules: EnumOptionData[] = [];
  creditAllocationTransactionTypes: EnumOptionData[] = [];
  creditAllocationAllocationTypes: EnumOptionData[] = [];
  transactionProcessingStrategyOptionsBase: GetLoanProductsTransactionProcessingStrategyOptions[] =
    [];
  transactionProcessingStrategyOptions: GetLoanProductsTransactionProcessingStrategyOptions[] = [];
  isProgressive = false;

  product: PostLoanProductsRequest = {
    currencyCode: 'USD',
    digitsAfterDecimal: 2,
    inMultiplesOf: 0,
    repaymentFrequencyType: 2, // Months
    interestRateFrequencyType: 3, // Per Year
    amortizationType: 1, // Equal Installments
    interestType: 0, // Declining Balance
    interestCalculationPeriodType: 1, // Daily
    loanScheduleType: LOAN_SCHEDULE_TYPE.CUMULATIVE,
    transactionProcessingStrategyCode: 'mifos-standard-strategy',
    accountingRule: 1, // NONE
    daysInYearType: 1,
    daysInMonthType: 1,
    isInterestRecalculationEnabled: false,
  };

  ngOnInit() {
    this.fundsService.getFunds().subscribe((data) => (this.fundOptions = data));
    this.delinquencyService
      .getDelinquencyBuckets()
      .subscribe((data) => (this.delinquencyBucketOptions = data));

    this.productService.getLoanproductsTemplate().subscribe((template) => {
      this.loanScheduleTypeOptions = template.loanScheduleTypeOptions ?? [];
      this.loanScheduleProcessingTypeOptions = template.loanScheduleProcessingTypeOptions ?? [];
      this.advancedPaymentAllocationTypes = template.advancedPaymentAllocationTypes ?? [];
      this.advancedPaymentAllocationTransactionTypes =
        template.advancedPaymentAllocationTransactionTypes ?? [];
      this.advancedPaymentAllocationFutureInstallmentAllocationRules =
        template.advancedPaymentAllocationFutureInstallmentAllocationRules ?? [];
      this.creditAllocationTransactionTypes = template.creditAllocationTransactionTypes ?? [];
      this.creditAllocationAllocationTypes = template.creditAllocationAllocationTypes ?? [];
      this.transactionProcessingStrategyOptionsBase = template.transactionProcessingStrategyOptions
        ? Array.from(template.transactionProcessingStrategyOptions)
        : [];
      this.applyTransactionProcessingStrategyFilter();
    });

    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.productId = +id;
        this.isEditMode = true;
        this.loadProductData();
      }
    });
  }

  onLoanScheduleTypeChange(loanScheduleType: string) {
    this.isProgressive = loanScheduleType === LOAN_SCHEDULE_TYPE.PROGRESSIVE;
    this.applyTransactionProcessingStrategyFilter();

    if (this.isProgressive) {
      this.product.loanScheduleProcessingType = 'HORIZONTAL';
      this.product.paymentAllocation = this.buildDefaultPaymentAllocation();
    } else {
      this.product.loanScheduleProcessingType = undefined;
      this.product.paymentAllocation = undefined;
      this.product.creditAllocation = undefined;
    }
  }

  private applyTransactionProcessingStrategyFilter() {
    if (this.isProgressive) {
      this.transactionProcessingStrategyOptions =
        this.transactionProcessingStrategyOptionsBase.filter((option) =>
          isAdvancedPaymentAllocationStrategy(option.code),
        );
      if (this.transactionProcessingStrategyOptions.length) {
        this.product.transactionProcessingStrategyCode =
          this.transactionProcessingStrategyOptions[0].code;
      }
    } else {
      this.transactionProcessingStrategyOptions =
        this.transactionProcessingStrategyOptionsBase.filter(
          (option) => !isAdvancedPaymentAllocationStrategy(option.code),
        );
      if (
        isAdvancedPaymentAllocationStrategy(this.product.transactionProcessingStrategyCode) &&
        this.transactionProcessingStrategyOptions.length
      ) {
        this.product.transactionProcessingStrategyCode =
          this.transactionProcessingStrategyOptions[0].code;
      }
    }
  }

  private buildDefaultPaymentAllocation() {
    return [
      {
        transactionType: 'DEFAULT',
        futureInstallmentAllocationRule: 'NEXT_INSTALLMENT',
        paymentAllocationOrder: this.advancedPaymentAllocationTypes.map((type, index) => ({
          order: index + 1,
          paymentAllocationRule: type.code,
        })),
      },
    ];
  }

  loadProductData() {
    if (!this.productId) return;
    this.productService.getLoanproductsProductId(this.productId).subscribe((data) => {
      this.product = {
        name: data.name,
        shortName: data.shortName,
        description: data.description,
        currencyCode: data.currency?.code,
        digitsAfterDecimal: data.currency?.decimalPlaces,
        principal: data.principal,
        interestRatePerPeriod: data.interestRatePerPeriod,
        numberOfRepayments: data.numberOfRepayments,
        repaymentEvery: data.repaymentEvery,
        inMultiplesOf: 0,
        repaymentFrequencyType: data.repaymentFrequencyType?.id ?? 2,
        interestRateFrequencyType: data.interestRateFrequencyType?.id ?? 3,
        amortizationType: data.amortizationType?.id ?? 1,
        interestType: data.interestType?.id ?? 0,
        interestCalculationPeriodType: data.interestCalculationPeriodType?.id ?? 1,
        transactionProcessingStrategyCode:
          data.transactionProcessingStrategyCode ?? 'mifos-standard-strategy',
        accountingRule: data.accountingRule?.id ?? 1,
        daysInYearType: data.daysInYearType?.id ?? 1,
        daysInMonthType: data.daysInMonthType?.id ?? 1,
        isInterestRecalculationEnabled: data.isInterestRecalculationEnabled ?? false,
        loanScheduleType: data.loanScheduleType?.code ?? LOAN_SCHEDULE_TYPE.CUMULATIVE,
        loanScheduleProcessingType: data.loanScheduleProcessingType?.code,
        paymentAllocation: data.paymentAllocation,
        creditAllocation: data.creditAllocation,
      };
      this.isProgressive = this.product.loanScheduleType === LOAN_SCHEDULE_TYPE.PROGRESSIVE;
      this.applyTransactionProcessingStrategyFilter();
    });
  }

  onSubmit() {
    this.isSaving = true;
    this.product.locale = 'en';

    if (this.isEditMode && this.productId) {
      this.productService
        .putLoanproductsProductId(this.productId, this.product as PutLoanProductsProductIdRequest)
        .subscribe({
          next: () => this.router.navigate([this.LIST_PATH]),
          error: () => (this.isSaving = false),
        });
    } else {
      this.productService.postLoanproducts(this.product).subscribe({
        next: () => this.router.navigate([this.LIST_PATH]),
        error: () => (this.isSaving = false),
      });
    }
  }

  onCancel() {
    this.router.navigate([this.LIST_PATH]);
  }
}
