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
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { LoanProductsService, PostLoanProductsRequest, PutLoanProductsProductIdRequest } from '../../api';

@Component({
  selector: 'app-loan-product-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatTooltipModule
  ],
  template: `
    <div class="form-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>
            {{ isEditMode ? ('PRODUCTS.EDIT_LOAN_PRODUCT' | translate) : ('PRODUCTS.CREATE_LOAN_PRODUCT' | translate) }}
          </mat-card-title>
        </mat-card-header>
        
        <mat-card-content>
          <form #productForm="ngForm" (ngSubmit)="onSubmit()" class="product-form">
            <div class="form-grid">
              <mat-form-field appearance="outline" [matTooltip]="'HELP.PRODUCT_NAME_DESC' | translate">
                <mat-label>{{ 'COMMON.NAME' | translate }}</mat-label>
                <input matInput name="name" [(ngModel)]="product.name" required>
              </mat-form-field>

              <mat-form-field appearance="outline" [matTooltip]="'HELP.SHORT_NAME_DESC' | translate">
                <mat-label>{{ 'PRODUCTS.SHORT_NAME' | translate }}</mat-label>
                <input matInput name="shortName" [(ngModel)]="product.shortName" required maxlength="4">
              </mat-form-field>

              <mat-form-field appearance="outline" [matTooltip]="'HELP.DESCRIPTION_DESC' | translate" class="full-width">
                <mat-label>{{ 'PRODUCTS.DESCRIPTION' | translate }}</mat-label>
                <textarea matInput name="description" [(ngModel)]="product.description" rows="3"></textarea>
              </mat-form-field>

              <mat-form-field appearance="outline" [matTooltip]="'HELP.CURRENCY_DESC' | translate">
                <mat-label>{{ 'PRODUCTS.CURRENCY' | translate }}</mat-label>
                <mat-select name="currencyCode" [(ngModel)]="product.currencyCode" required>
                  <mat-option value="USD">USD</mat-option>
                  <mat-option value="EUR">EUR</mat-option>
                  <mat-option value="INR">INR</mat-option>
                </mat-select>
              </mat-form-field>

              <mat-form-field appearance="outline" [matTooltip]="'HELP.DECIMAL_PLACES_DESC' | translate">
                <mat-label>{{ 'PRODUCTS.DECIMAL_PLACES' | translate }}</mat-label>
                <input matInput type="number" name="digitsAfterDecimal" [(ngModel)]="product.digitsAfterDecimal" required>
              </mat-form-field>

              <mat-form-field appearance="outline" [matTooltip]="'HELP.PRINCIPAL_DESC' | translate">
                <mat-label>{{ 'PRODUCTS.PRINCIPAL' | translate }}</mat-label>
                <input matInput type="number" name="principal" [(ngModel)]="product.principal" required>
              </mat-form-field>

              <mat-form-field appearance="outline" [matTooltip]="'HELP.INTEREST_RATE_DESC' | translate">
                <mat-label>{{ 'PRODUCTS.INTEREST_RATE' | translate }}</mat-label>
                <input matInput type="number" name="interestRatePerPeriod" [(ngModel)]="product.interestRatePerPeriod" required>
              </mat-form-field>

              <mat-form-field appearance="outline" [matTooltip]="'HELP.REPAYMENTS_COUNT_DESC' | translate">
                <mat-label>{{ 'LOANS.REPAYMENTS_COUNT' | translate }}</mat-label>
                <input matInput type="number" name="numberOfRepayments" [(ngModel)]="product.numberOfRepayments" required>
              </mat-form-field>

              <mat-form-field appearance="outline" [matTooltip]="'HELP.REPAYMENT_EVERY_DESC' | translate">
                <mat-label>{{ 'LOANS.REPAYMENT_EVERY' | translate }}</mat-label>
                <input matInput type="number" name="repaymentEvery" [(ngModel)]="product.repaymentEvery" required>
              </mat-form-field>
            </div>

            <div class="form-actions">
              <button mat-button type="button" (click)="onCancel()">{{ 'COMMON.CANCEL' | translate }}</button>
              <button mat-raised-button color="primary" type="submit" [disabled]="productForm.invalid || isSaving">
                {{ isSaving ? ('COMMON.SAVING' | translate) : ('COMMON.SAVE' | translate) }}
              </button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
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
    .full-width {
      grid-column: span 2;
    }
    mat-form-field {
      width: 100%;
    }
    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      margin-top: 16px;
    }
  `]
})
export class LoanProductFormComponent implements OnInit {
  private readonly productService = inject(LoanProductsService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  private readonly LIST_PATH = '/products/loan';

  productId: number | null = null;
  isEditMode = false;
  isSaving = false;
  
  product: PostLoanProductsRequest = {
    currencyCode: 'USD',
    digitsAfterDecimal: 2,
    inMultiplesOf: 0,
    repaymentFrequencyType: 2, // Months
    interestRateFrequencyType: 3, // Per Year
    amortizationType: 1, // Equal Installments
    interestType: 0, // Declining Balance
    interestCalculationPeriodType: 1, // Daily
    transactionProcessingStrategyCode: 'mifos-standard-strategy',
    accountingRule: 1, // NONE
    daysInYearType: 1,
    daysInMonthType: 1,
    isInterestRecalculationEnabled: false
  };

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
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
    this.productService.retrieveLoanProductDetails(this.productId).subscribe(data => {
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
        repaymentFrequencyType: 2,
        interestRateFrequencyType: 3,
        amortizationType: 1,
        interestType: 0,
        interestCalculationPeriodType: 1,
        transactionProcessingStrategyCode: 'mifos-standard-strategy',
        accountingRule: 1,
        daysInYearType: 1,
        daysInMonthType: 1,
        isInterestRecalculationEnabled: false
      };
    });
  }

  onSubmit() {
    this.isSaving = true;
    this.product.locale = 'en';

    if (this.isEditMode && this.productId) {
      this.productService.updateLoanProduct(this.productId, this.product as PutLoanProductsProductIdRequest).subscribe({
        next: () => this.router.navigate([this.LIST_PATH]),
        error: () => this.isSaving = false
      });
    } else {
      this.productService.createLoanProduct(this.product).subscribe({
        next: () => this.router.navigate([this.LIST_PATH]),
        error: () => this.isSaving = false
      });
    }
  }

  onCancel() {
    this.router.navigate([this.LIST_PATH]);
  }
}
