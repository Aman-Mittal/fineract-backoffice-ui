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
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    PaymentCreditAllocationEditorComponent,
  ],
  template: `
    <div class="form-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>
            {{
              isEditMode
                ? ('PRODUCTS.EDIT_LOAN_PRODUCT' | translate)
                : ('PRODUCTS.CREATE_LOAN_PRODUCT' | translate)
            }}
          </mat-card-title>
        </mat-card-header>

        <mat-card-content>
          <form #productForm="ngForm" (ngSubmit)="onSubmit()" class="product-form">
            <div class="form-grid">
              <mat-form-field
                appearance="outline"
                [matTooltip]="'HELP.PRODUCT_NAME_DESC' | translate"
              >
                <mat-label>{{ 'COMMON.NAME' | translate }}</mat-label>
                <input matInput name="name" [(ngModel)]="product.name" required />
              </mat-form-field>

              <mat-form-field
                appearance="outline"
                [matTooltip]="'HELP.SHORT_NAME_DESC' | translate"
              >
                <mat-label>{{ 'PRODUCTS.SHORT_NAME' | translate }}</mat-label>
                <input
                  matInput
                  name="shortName"
                  [(ngModel)]="product.shortName"
                  required
                  maxlength="4"
                />
              </mat-form-field>

              <mat-form-field
                appearance="outline"
                [matTooltip]="'HELP.DESCRIPTION_DESC' | translate"
                class="full-width"
              >
                <mat-label>{{ 'PRODUCTS.DESCRIPTION' | translate }}</mat-label>
                <textarea
                  matInput
                  name="description"
                  [(ngModel)]="product.description"
                  rows="3"
                ></textarea>
              </mat-form-field>

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>{{ 'COMMON.EXTERNAL_ID' | translate }}</mat-label>
                <input matInput name="externalId" [(ngModel)]="product.externalId" />
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>{{ 'PRODUCTS.FUND' | translate }}</mat-label>
                <mat-select name="fundId" [(ngModel)]="product.fundId">
                  @for (fund of fundOptions; track fund.id) {
                    <mat-option [value]="fund.id">{{ fund.name }}</mat-option>
                  }
                </mat-select>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>{{ 'PRODUCTS.DELINQUENCY_BUCKET' | translate }}</mat-label>
                <mat-select name="delinquencyBucketId" [(ngModel)]="product.delinquencyBucketId">
                  @for (bucket of delinquencyBucketOptions; track bucket.id) {
                    <mat-option [value]="bucket.id">{{ bucket.name }}</mat-option>
                  }
                </mat-select>
              </mat-form-field>

              <mat-form-field appearance="outline" [matTooltip]="'HELP.CURRENCY_DESC' | translate">
                <mat-label>{{ 'PRODUCTS.CURRENCY' | translate }}</mat-label>
                <mat-select name="currencyCode" [(ngModel)]="product.currencyCode" required>
                  <mat-option value="USD">USD</mat-option>
                  <mat-option value="EUR">EUR</mat-option>
                  <mat-option value="INR">INR</mat-option>
                </mat-select>
              </mat-form-field>

              <mat-form-field
                appearance="outline"
                [matTooltip]="'HELP.DECIMAL_PLACES_DESC' | translate"
              >
                <mat-label>{{ 'PRODUCTS.DECIMAL_PLACES' | translate }}</mat-label>
                <input
                  matInput
                  type="number"
                  name="digitsAfterDecimal"
                  [(ngModel)]="product.digitsAfterDecimal"
                  required
                />
              </mat-form-field>

              <mat-form-field appearance="outline" [matTooltip]="'HELP.PRINCIPAL_DESC' | translate">
                <mat-label>{{ 'PRODUCTS.PRINCIPAL' | translate }}</mat-label>
                <input
                  matInput
                  type="number"
                  name="principal"
                  [(ngModel)]="product.principal"
                  required
                />
              </mat-form-field>

              <mat-form-field
                appearance="outline"
                [matTooltip]="'HELP.INTEREST_RATE_DESC' | translate"
              >
                <mat-label>{{ 'PRODUCTS.INTEREST_RATE' | translate }}</mat-label>
                <input
                  matInput
                  type="number"
                  name="interestRatePerPeriod"
                  [(ngModel)]="product.interestRatePerPeriod"
                  required
                />
              </mat-form-field>

              <mat-form-field
                appearance="outline"
                [matTooltip]="'HELP.REPAYMENTS_COUNT_DESC' | translate"
              >
                <mat-label>{{ 'LOANS.REPAYMENTS_COUNT' | translate }}</mat-label>
                <input
                  matInput
                  type="number"
                  name="numberOfRepayments"
                  [(ngModel)]="product.numberOfRepayments"
                  required
                />
              </mat-form-field>

              <mat-form-field
                appearance="outline"
                [matTooltip]="'HELP.REPAYMENT_EVERY_DESC' | translate"
              >
                <mat-label>{{ 'LOANS.REPAYMENT_EVERY' | translate }}</mat-label>
                <input
                  matInput
                  type="number"
                  name="repaymentEvery"
                  [(ngModel)]="product.repaymentEvery"
                  required
                />
              </mat-form-field>

              <!-- Repayment Frequency Type -->
              <mat-form-field appearance="outline">
                <mat-label>{{ 'COMMON.FREQUENCY' | translate }}</mat-label>
                <mat-select
                  name="repaymentFrequencyType"
                  [(ngModel)]="product.repaymentFrequencyType"
                  required
                >
                  <mat-option [value]="0">{{ 'COMMON.DAYS' | translate }}</mat-option>
                  <mat-option [value]="1">{{ 'COMMON.WEEKS' | translate }}</mat-option>
                  <mat-option [value]="2">{{ 'COMMON.MONTHS' | translate }}</mat-option>
                  <mat-option [value]="3">{{ 'COMMON.YEARS' | translate }}</mat-option>
                </mat-select>
              </mat-form-field>

              <!-- Interest Rate Frequency Type -->
              <mat-form-field appearance="outline">
                <mat-label>{{ 'PRODUCTS.INTEREST_RATE_FREQUENCY_TYPE' | translate }}</mat-label>
                <mat-select
                  name="interestRateFrequencyType"
                  [(ngModel)]="product.interestRateFrequencyType"
                  required
                >
                  <mat-option [value]="2">{{ 'COMMON.PER_MONTH' | translate }}</mat-option>
                  <mat-option [value]="3">{{ 'COMMON.PER_YEAR' | translate }}</mat-option>
                </mat-select>
              </mat-form-field>

              <!-- Amortization Type -->
              <mat-form-field appearance="outline">
                <mat-label>{{ 'PRODUCTS.AMORTIZATION_TYPE' | translate }}</mat-label>
                <mat-select name="amortizationType" [(ngModel)]="product.amortizationType" required>
                  <mat-option [value]="1">{{ 'LOANS.EQUAL_INSTALLMENTS' | translate }}</mat-option>
                  <mat-option [value]="0">{{ 'LOANS.EQUAL_PRINCIPAL' | translate }}</mat-option>
                </mat-select>
              </mat-form-field>

              <!-- Interest Type -->
              <mat-form-field appearance="outline">
                <mat-label>{{ 'PRODUCTS.INTEREST_TYPE' | translate }}</mat-label>
                <mat-select name="interestType" [(ngModel)]="product.interestType" required>
                  <mat-option [value]="0">{{ 'LOANS.DECLINING_BALANCE' | translate }}</mat-option>
                  <mat-option [value]="1">{{ 'LOANS.FLAT' | translate }}</mat-option>
                </mat-select>
              </mat-form-field>

              <!-- Interest Calculation Period Type -->
              <mat-form-field appearance="outline">
                <mat-label>{{ 'PRODUCTS.INTEREST_CALCULATION_PERIOD_TYPE' | translate }}</mat-label>
                <mat-select
                  name="interestCalculationPeriodType"
                  [(ngModel)]="product.interestCalculationPeriodType"
                  required
                >
                  <mat-option [value]="0">{{ 'LOANS.DAILY' | translate }}</mat-option>
                  <mat-option [value]="1">{{ 'LOANS.SAME_AS_REPAYMENT' | translate }}</mat-option>
                </mat-select>
              </mat-form-field>

              <!-- Loan Schedule Type -->
              <mat-form-field
                appearance="outline"
                [matTooltip]="'HELP.LOAN_SCHEDULE_TYPE_DESC' | translate"
              >
                <mat-label>{{ 'PRODUCTS.LOAN_SCHEDULE_TYPE' | translate }}</mat-label>
                <mat-select
                  name="loanScheduleType"
                  [(ngModel)]="product.loanScheduleType"
                  (ngModelChange)="onLoanScheduleTypeChange($event)"
                  required
                >
                  @for (option of loanScheduleTypeOptions; track option.code) {
                    <mat-option [value]="option.code">{{ option.value }}</mat-option>
                  }
                </mat-select>
              </mat-form-field>

              <!-- Transaction Processing Strategy Code -->
              <mat-form-field appearance="outline">
                <mat-label>{{ 'PRODUCTS.TRANSACTION_PROCESSING_STRATEGY' | translate }}</mat-label>
                <mat-select
                  name="transactionProcessingStrategyCode"
                  [(ngModel)]="product.transactionProcessingStrategyCode"
                  [disabled]="isProgressive"
                  required
                >
                  @for (option of transactionProcessingStrategyOptions; track option.code) {
                    <mat-option [value]="option.code">{{ option.name }}</mat-option>
                  }
                </mat-select>
              </mat-form-field>

              <!-- Loan Schedule Processing Type (Progressive only) -->
              @if (isProgressive) {
                <mat-form-field appearance="outline">
                  <mat-label>{{ 'PRODUCTS.LOAN_SCHEDULE_PROCESSING_TYPE' | translate }}</mat-label>
                  <mat-select
                    name="loanScheduleProcessingType"
                    [(ngModel)]="product.loanScheduleProcessingType"
                    required
                  >
                    @for (option of loanScheduleProcessingTypeOptions; track option.code) {
                      <mat-option [value]="option.code">{{ option.value }}</mat-option>
                    }
                  </mat-select>
                </mat-form-field>
              }
            </div>

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
