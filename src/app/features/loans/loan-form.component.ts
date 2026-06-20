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
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ClientSearchComponent } from '../../shared/components/client-search/client-search.component';
import {
  LoansService,
  PostLoansRequest,
  PutLoansLoanIdRequest,
  LoanProductsService,
  GetLoanProductsResponse,
  GetLoansLoanIdResponse,
} from '../../api';
import {
  formatDateToFineract,
  FINERACT_DATE_FORMAT,
  FINERACT_LOCALE,
} from '../../core/utils/date-formatter';

@Component({
  selector: 'app-loan-form',
  standalone: true,
  imports: [
    FormsModule,
    TranslateModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule,
    MatTooltipModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    ClientSearchComponent,
  ],
  template: `
    <div class="form-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>
            {{ isEditMode ? ('LOANS.EDIT_LOAN' | translate) : ('LOANS.CREATE_LOAN' | translate) }}
          </mat-card-title>
        </mat-card-header>

        <mat-card-content>
          <form #loanForm="ngForm" (ngSubmit)="onSubmit()" class="loan-form">
            <div class="form-grid">
              <!-- Client Search with Create Option -->
              <div class="field-container-row">
                <app-client-search
                  [label]="'COMMON.CLIENT_ID' | translate"
                  [required]="true"
                  [initialClientId]="loan.clientId || null"
                  (clientSelected)="loan.clientId = $event"
                  class="flex-grow"
                >
                </app-client-search>
                <button
                  mat-icon-button
                  type="button"
                  [matTooltip]="'CLIENTS.CREATE_CLIENT' | translate"
                  (click)="onCreateClient()"
                  style="margin-top: 4px;"
                >
                  <mat-icon color="primary">add_circle_outline</mat-icon>
                </button>
              </div>

              <!-- Product Selection with Create Option -->
              <div class="field-container-row">
                <mat-form-field
                  appearance="outline"
                  [matTooltip]="'HELP.LOAN_PRODUCT_DESC' | translate"
                  class="flex-grow"
                >
                  <mat-label>{{ 'LOANS.PRODUCT' | translate }}</mat-label>
                  <mat-select
                    name="productId"
                    [(ngModel)]="loan.productId"
                    required
                    [disabled]="isEditMode"
                  >
                    @for (product of products; track product.id) {
                      <mat-option [value]="product.id">{{ product.name }}</mat-option>
                    }
                  </mat-select>
                </mat-form-field>
                <button
                  mat-icon-button
                  type="button"
                  [matTooltip]="'PRODUCTS.CREATE_LOAN_PRODUCT' | translate"
                  (click)="onCreateProduct()"
                  style="margin-top: 4px;"
                  [disabled]="isEditMode"
                >
                  <mat-icon color="primary">add_circle_outline</mat-icon>
                </button>
              </div>

              <!-- Principal -->
              <mat-form-field appearance="outline" [matTooltip]="'HELP.PRINCIPAL_DESC' | translate">
                <mat-label>{{ 'LOANS.PRINCIPAL' | translate }}</mat-label>
                <input
                  matInput
                  type="number"
                  name="principal"
                  [(ngModel)]="loan.principal"
                  required
                />
              </mat-form-field>

              <!-- External ID -->
              <mat-form-field
                appearance="outline"
                [matTooltip]="'HELP.EXTERNAL_ID_DESC' | translate"
              >
                <mat-label>{{ 'COMMON.EXTERNAL_ID' | translate }}</mat-label>
                <input matInput name="externalId" [(ngModel)]="loan.externalId" />
              </mat-form-field>

              <!-- Submitted On -->
              <mat-form-field
                appearance="outline"
                [matTooltip]="'HELP.SUBMITTED_ON_DESC' | translate"
              >
                <mat-label>{{ 'COMMON.SUBMITTED_ON' | translate }}</mat-label>
                <input
                  matInput
                  [matDatepicker]="subPicker"
                  name="submittedOnDate"
                  [(ngModel)]="submittedOnDate"
                  required
                />
                <mat-datepicker-toggle matSuffix [for]="subPicker"></mat-datepicker-toggle>
                <mat-datepicker #subPicker></mat-datepicker>
              </mat-form-field>

              <!-- Expected Disbursement -->
              <mat-form-field
                appearance="outline"
                [matTooltip]="'HELP.EXPECTED_DISBURSEMENT_DESC' | translate"
              >
                <mat-label>{{ 'LOANS.EXPECTED_DISBURSEMENT' | translate }}</mat-label>
                <input
                  matInput
                  [matDatepicker]="disPicker"
                  name="expectedDisbursementDate"
                  [(ngModel)]="expectedDisbursementDate"
                  required
                />
                <mat-datepicker-toggle matSuffix [for]="disPicker"></mat-datepicker-toggle>
                <mat-datepicker #disPicker></mat-datepicker>
              </mat-form-field>

              <!-- Term Frequency -->
              <mat-form-field
                appearance="outline"
                [matTooltip]="'HELP.TERM_FREQUENCY_DESC' | translate"
              >
                <mat-label>{{ 'LOANS.TERM_FREQUENCY' | translate }}</mat-label>
                <input
                  matInput
                  type="number"
                  name="loanTermFrequency"
                  [(ngModel)]="loan.loanTermFrequency"
                  required
                />
              </mat-form-field>

              <!-- Term Type -->
              <mat-form-field appearance="outline" [matTooltip]="'HELP.TERM_TYPE_DESC' | translate">
                <mat-label>{{ 'LOANS.TERM_TYPE' | translate }}</mat-label>
                <mat-select
                  name="loanTermFrequencyType"
                  [(ngModel)]="loan.loanTermFrequencyType"
                  required
                >
                  <mat-option [value]="0">{{ 'COMMON.DAYS' | translate }}</mat-option>
                  <mat-option [value]="1">{{ 'COMMON.WEEKS' | translate }}</mat-option>
                  <mat-option [value]="2">{{ 'COMMON.MONTHS' | translate }}</mat-option>
                  <mat-option [value]="3">{{ 'COMMON.YEARS' | translate }}</mat-option>
                </mat-select>
              </mat-form-field>

              <!-- Number of Repayments -->
              <mat-form-field
                appearance="outline"
                [matTooltip]="'HELP.REPAYMENTS_COUNT_DESC' | translate"
              >
                <mat-label>{{ 'LOANS.REPAYMENTS_COUNT' | translate }}</mat-label>
                <input
                  matInput
                  type="number"
                  name="numberOfRepayments"
                  [(ngModel)]="loan.numberOfRepayments"
                  required
                />
              </mat-form-field>

              <!-- Repayment Every -->
              <mat-form-field
                appearance="outline"
                [matTooltip]="'HELP.REPAYMENT_EVERY_DESC' | translate"
              >
                <mat-label>{{ 'LOANS.REPAYMENT_EVERY' | translate }}</mat-label>
                <input
                  matInput
                  type="number"
                  name="repaymentEvery"
                  [(ngModel)]="loan.repaymentEvery"
                  required
                />
              </mat-form-field>

              <!-- Repayment Frequency Type -->
              <mat-form-field appearance="outline">
                <mat-label>{{ 'COMMON.FREQUENCY' | translate }}</mat-label>
                <mat-select
                  name="repaymentFrequencyType"
                  [(ngModel)]="loan.repaymentFrequencyType"
                  required
                >
                  <mat-option [value]="0">{{ 'COMMON.DAYS' | translate }}</mat-option>
                  <mat-option [value]="1">{{ 'COMMON.WEEKS' | translate }}</mat-option>
                  <mat-option [value]="2">{{ 'COMMON.MONTHS' | translate }}</mat-option>
                </mat-select>
              </mat-form-field>

              <!-- Interest Rate Per Period -->
              <mat-form-field appearance="outline">
                <mat-label>{{ 'COMMON.INTEREST_RATE' | translate }}</mat-label>
                <input
                  matInput
                  type="number"
                  name="interestRatePerPeriod"
                  [(ngModel)]="loan.interestRatePerPeriod"
                  required
                />
              </mat-form-field>

              <!-- Interest Type -->
              <mat-form-field appearance="outline">
                <mat-label>{{ 'PRODUCTS.INTEREST_TYPE' | translate }}</mat-label>
                <mat-select name="interestType" [(ngModel)]="loan.interestType" required>
                  <mat-option [value]="0">{{ 'LOANS.DECLINING_BALANCE' | translate }}</mat-option>
                  <mat-option [value]="1">{{ 'LOANS.FLAT' | translate }}</mat-option>
                </mat-select>
              </mat-form-field>

              <!-- Amortization Type -->
              <mat-form-field appearance="outline">
                <mat-label>{{ 'PRODUCTS.AMORTIZATION_TYPE' | translate }}</mat-label>
                <mat-select name="amortizationType" [(ngModel)]="loan.amortizationType" required>
                  <mat-option [value]="1">{{ 'LOANS.EQUAL_INSTALLMENTS' | translate }}</mat-option>
                  <mat-option [value]="0">{{ 'LOANS.EQUAL_PRINCIPAL' | translate }}</mat-option>
                </mat-select>
              </mat-form-field>

              <!-- Interest Calculation Period Type -->
              <mat-form-field appearance="outline">
                <mat-label>{{ 'PRODUCTS.INTEREST_CALCULATION_PERIOD_TYPE' | translate }}</mat-label>
                <mat-select
                  name="interestCalculationPeriodType"
                  [(ngModel)]="loan.interestCalculationPeriodType"
                  required
                >
                  <mat-option [value]="0">{{ 'LOANS.DAILY' | translate }}</mat-option>
                  <mat-option [value]="1">{{ 'LOANS.SAME_AS_REPAYMENT' | translate }}</mat-option>
                </mat-select>
              </mat-form-field>

              <!-- Grace on Principal Payment -->
              <mat-form-field appearance="outline">
                <mat-label>{{ 'LOANS.GRACE_ON_PRINCIPAL_PAYMENT' | translate }}</mat-label>
                <input
                  matInput
                  type="number"
                  name="graceOnPrincipalPayment"
                  [(ngModel)]="loan.graceOnPrincipalPayment"
                />
              </mat-form-field>

              <!-- Grace on Interest Payment -->
              <mat-form-field appearance="outline">
                <mat-label>{{ 'LOANS.GRACE_ON_INTEREST_PAYMENT' | translate }}</mat-label>
                <input
                  matInput
                  type="number"
                  name="graceOnInterestPayment"
                  [(ngModel)]="loan.graceOnInterestPayment"
                />
              </mat-form-field>

              <!-- Grace on Interest Charged -->
              <mat-form-field appearance="outline">
                <mat-label>{{ 'LOANS.GRACE_ON_INTEREST_CHARGED' | translate }}</mat-label>
                <input
                  matInput
                  type="number"
                  name="graceOnInterestCharged"
                  [(ngModel)]="loan.graceOnInterestCharged"
                />
              </mat-form-field>

              <!-- In Arrears Tolerance -->
              <mat-form-field appearance="outline">
                <mat-label>{{ 'LOANS.IN_ARREARS_TOLERANCE' | translate }}</mat-label>
                <input
                  matInput
                  type="number"
                  name="inArrearsTolerance"
                  [(ngModel)]="loan.inArrearsTolerance"
                />
              </mat-form-field>

              <!-- Repayments Starting From Date -->
              <mat-form-field appearance="outline">
                <mat-label>{{ 'LOANS.REPAYMENTS_STARTING_FROM_DATE' | translate }}</mat-label>
                <input
                  matInput
                  [matDatepicker]="repaymentsFromPicker"
                  name="repaymentsStartingFromDate"
                  [(ngModel)]="repaymentsStartingFromDate"
                />
                <mat-datepicker-toggle
                  matSuffix
                  [for]="repaymentsFromPicker"
                ></mat-datepicker-toggle>
                <mat-datepicker #repaymentsFromPicker></mat-datepicker>
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
                [disabled]="loanForm.invalid || isSaving"
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
      .loan-form {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }
      .form-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 16px;
      }
      .field-container-row {
        display: flex;
        align-items: flex-start;
        gap: 8px;
      }
      .flex-grow {
        flex-grow: 1;
      }
    `,
  ],
})
export class LoanFormComponent implements OnInit {
  private readonly loansService = inject(LoansService);
  private readonly productService = inject(LoanProductsService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly snackBar = inject(MatSnackBar);

  private readonly LIST_PATH = '/loans';

  loanId: number | null = null;
  isEditMode = false;
  isSaving = false;

  loan: PostLoansRequest = {
    loanType: 'individual',
  };
  submittedOnDate: Date = new Date();
  expectedDisbursementDate: Date = new Date();
  repaymentsStartingFromDate: Date | null = null;
  products: GetLoanProductsResponse[] = [];

  ngOnInit() {
    this.loadProducts();

    this.route.queryParams.subscribe((queryParams) => {
      const clientId = queryParams['clientId'];
      if (clientId) {
        this.loan.clientId = +clientId;
      }
    });

    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.loanId = +id;
        this.isEditMode = true;
        this.loadLoanData();
      }
    });
  }

  onCreateClient() {
    this.router.navigate(['/clients/create']);
  }

  onCreateProduct() {
    this.router.navigate(['/products/loan/create']);
  }

  private loadProducts() {
    this.productService.getLoanproducts().subscribe({
      next: (data: GetLoanProductsResponse[]) => (this.products = data || []),
      error: () =>
        this.snackBar.open('Operation failed. Please try again.', 'Close', { duration: 3000 }),
    });
  }

  private loadLoanData() {
    if (!this.loanId) return;
    this.loansService.getLoansLoanId(this.loanId).subscribe({
      next: (data: GetLoansLoanIdResponse) => {
        const subDateArray = data.timeline?.submittedOnDate as unknown as number[];
        if (subDateArray) {
          this.submittedOnDate = new Date(subDateArray[0], subDateArray[1] - 1, subDateArray[2]);
        }
        const expDisbDateArray = data.timeline?.expectedDisbursementDate as unknown as number[];
        if (expDisbDateArray) {
          this.expectedDisbursementDate = new Date(
            expDisbDateArray[0],
            expDisbDateArray[1] - 1,
            expDisbDateArray[2],
          );
        }

        this.loan = {
          clientId: data.clientId,
          productId: data.loanProductId,
          principal: data.principal,
          externalId: data.externalId,
          loanTermFrequency: data.termFrequency,
          loanTermFrequencyType: data.termPeriodFrequencyType?.id,
          numberOfRepayments: data.numberOfRepayments,
          repaymentEvery: data.repaymentEvery,
          repaymentFrequencyType: data.repaymentFrequencyType?.id,
          interestRatePerPeriod: data.interestRatePerPeriod,
          interestType: data.interestType?.id,
          amortizationType: data.amortizationType?.id,
          interestCalculationPeriodType: data.interestCalculationPeriodType?.id,
          transactionProcessingStrategyCode: data.transactionProcessingStrategyCode,
        };
      },
      error: () =>
        this.snackBar.open('Operation failed. Please try again.', 'Close', { duration: 3000 }),
    });
  }

  onSubmit() {
    this.isSaving = true;

    this.loan.submittedOnDate = formatDateToFineract(this.submittedOnDate);
    this.loan.expectedDisbursementDate = formatDateToFineract(this.expectedDisbursementDate);
    if (this.repaymentsStartingFromDate) {
      this.loan.repaymentsStartingFromDate = formatDateToFineract(this.repaymentsStartingFromDate);
    }
    this.loan.dateFormat = FINERACT_DATE_FORMAT;
    this.loan.locale = FINERACT_LOCALE;

    const selectedProduct = this.products.find((p) => p.id === this.loan.productId);
    if (selectedProduct && selectedProduct.transactionProcessingStrategy) {
      this.loan.transactionProcessingStrategyCode = selectedProduct.transactionProcessingStrategy;
    } else if (!this.loan.transactionProcessingStrategyCode) {
      this.loan.transactionProcessingStrategyCode = 'mifos-standard-strategy';
    }

    if (this.isEditMode && this.loanId) {
      this.loansService.putLoansLoanId(this.loanId, this.loan as PutLoansLoanIdRequest).subscribe({
        next: () => this.router.navigate([this.LIST_PATH]),
        error: () => (this.isSaving = false),
      });
    } else {
      this.loansService.postLoans(this.loan).subscribe({
        next: () => this.router.navigate([this.LIST_PATH]),
        error: () => (this.isSaving = false),
      });
    }
  }

  onCancel() {
    this.router.navigate([this.LIST_PATH]);
  }
}
