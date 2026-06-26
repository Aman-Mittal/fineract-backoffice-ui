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
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {
  WorkingCapitalLoansService,
  WorkingCapitalNearBreachService,
  PostWorkingCapitalLoansRequest,
  GetWorkingCapitalLoanProductsResponse,
  GetWorkingCapitalLoanBreach,
  WorkingCapitalNearBreachData,
  StringEnumOptionData,
  GetDelinquencyBucket,
  FundData,
} from '../../../api';
import {
  formatDateToFineract,
  FINERACT_DATE_FORMAT,
  FINERACT_LOCALE,
} from '../../../core/utils/date-formatter';

/**
 * Create form for a Working Capital Loan application. Required fields are
 * clientId, productId and principalAmount; common optionals (dates, repayment
 * terms, breach references) are also captured. Option lists come from the
 * working-capital-loans template endpoint.
 */
@Component({
  selector: 'app-wc-loan-form',
  standalone: true,
  imports: [
    FormsModule,
    TranslateModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatProgressSpinnerModule,
  ],
  template: `
    <div class="form-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>{{ 'WC_LOANS.CREATE' | translate }}</mat-card-title>
        </mat-card-header>

        <mat-card-content>
          <form #loanForm="ngForm" (ngSubmit)="onSubmit()" class="wc-form">
            <mat-form-field appearance="outline">
              <mat-label>{{ 'WC_LOANS.CLIENT_ID' | translate }}</mat-label>
              <input matInput type="number" name="clientId" [(ngModel)]="loan.clientId" required />
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>{{ 'WC_LOANS.PRODUCT' | translate }}</mat-label>
              <mat-select name="productId" [(ngModel)]="loan.productId" required>
                @for (opt of productOptions; track opt.id) {
                  <mat-option [value]="opt.id">{{ opt.name }}</mat-option>
                }
              </mat-select>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>{{ 'WC_LOANS.PRINCIPAL' | translate }}</mat-label>
              <input
                matInput
                type="number"
                name="principalAmount"
                [(ngModel)]="loan.principalAmount"
                required
              />
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>{{ 'WC_LOANS.SUBMITTED_ON_DATE' | translate }}</mat-label>
              <input
                matInput
                [matDatepicker]="submittedPicker"
                name="submittedOnDate"
                [(ngModel)]="submittedOnDate"
              />
              <mat-datepicker-toggle matSuffix [for]="submittedPicker"></mat-datepicker-toggle>
              <mat-datepicker #submittedPicker></mat-datepicker>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>{{ 'WC_LOANS.EXPECTED_DISBURSEMENT_DATE' | translate }}</mat-label>
              <input
                matInput
                [matDatepicker]="disbursePicker"
                name="expectedDisbursementDate"
                [(ngModel)]="expectedDisbursementDate"
              />
              <mat-datepicker-toggle matSuffix [for]="disbursePicker"></mat-datepicker-toggle>
              <mat-datepicker #disbursePicker></mat-datepicker>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>{{ 'WC_LOANS.REPAYMENT_EVERY' | translate }}</mat-label>
              <input
                matInput
                type="number"
                name="repaymentEvery"
                [(ngModel)]="loan.repaymentEvery"
              />
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>{{ 'WC_LOANS.REPAYMENT_FREQUENCY_TYPE' | translate }}</mat-label>
              <mat-select name="repaymentFrequencyType" [(ngModel)]="loan.repaymentFrequencyType">
                @for (opt of repaymentFrequencyTypeOptions; track opt.id) {
                  <mat-option [value]="opt.code">{{ opt.value }}</mat-option>
                }
              </mat-select>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>{{ 'WC_LOANS.BREACH' | translate }}</mat-label>
              <mat-select name="breachId" [(ngModel)]="loan.breachId">
                @for (opt of breachOptions; track opt.id) {
                  <mat-option [value]="opt.id">{{ opt.name }}</mat-option>
                }
              </mat-select>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>{{ 'WC_LOANS.NEAR_BREACH' | translate }}</mat-label>
              <mat-select name="nearBreachId" [(ngModel)]="loan.nearBreachId">
                @for (opt of nearBreachOptions; track opt.id) {
                  <mat-option [value]="opt.id">{{ opt.name }}</mat-option>
                }
              </mat-select>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>{{ 'WC_LOANS.DELINQUENCY_BUCKET' | translate }}</mat-label>
              <mat-select name="delinquencyBucketId" [(ngModel)]="loan.delinquencyBucketId">
                @for (opt of delinquencyBucketOptions; track opt.id) {
                  <mat-option [value]="opt.id">{{ opt.name }}</mat-option>
                }
              </mat-select>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>{{ 'WC_LOANS.FUND' | translate }}</mat-label>
              <mat-select name="fundId" [(ngModel)]="loan.fundId">
                @for (opt of fundOptions; track opt.id) {
                  <mat-option [value]="opt.id">{{ opt.name }}</mat-option>
                }
              </mat-select>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>{{ 'WC_LOANS.PERIOD_PAYMENT_RATE' | translate }}</mat-label>
              <input
                matInput
                type="number"
                name="periodPaymentRate"
                [(ngModel)]="loan.periodPaymentRate"
              />
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>{{ 'WC_LOANS.TOTAL_PAYMENT_VOLUME' | translate }}</mat-label>
              <input
                matInput
                type="number"
                name="totalPaymentVolume"
                [(ngModel)]="loan.totalPaymentVolume"
              />
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>{{ 'WC_LOANS.EXTERNAL_ID' | translate }}</mat-label>
              <input matInput name="externalId" [(ngModel)]="loan.externalId" />
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>{{ 'WC_LOANS.SUBMITTED_ON_NOTE' | translate }}</mat-label>
              <textarea
                matInput
                name="submittedOnNote"
                [(ngModel)]="loan.submittedOnNote"
              ></textarea>
            </mat-form-field>

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
        max-width: 600px;
        margin: 0 auto;
      }
      .wc-form {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }
    `,
  ],
})
export class WcLoanFormComponent implements OnInit {
  private readonly loansService = inject(WorkingCapitalLoansService);
  private readonly nearBreachService = inject(WorkingCapitalNearBreachService);
  private readonly router = inject(Router);

  private readonly LIST_PATH = '/working-capital/loans';

  isSaving = false;

  loan: Partial<PostWorkingCapitalLoansRequest> = {};
  submittedOnDate: Date | null = null;
  expectedDisbursementDate: Date | null = null;

  productOptions: GetWorkingCapitalLoanProductsResponse[] = [];
  breachOptions: GetWorkingCapitalLoanBreach[] = [];
  nearBreachOptions: WorkingCapitalNearBreachData[] = [];
  repaymentFrequencyTypeOptions: StringEnumOptionData[] = [];
  delinquencyBucketOptions: GetDelinquencyBucket[] = [];
  fundOptions: FundData[] = [];

  ngOnInit(): void {
    this.nearBreachService.getWorkingCapitalNearBreach().subscribe((data) => {
      this.nearBreachOptions = data;
    });
    this.loansService.getWorkingCapitalLoansTemplate().subscribe((tpl) => {
      this.productOptions = tpl.productOptions ?? [];
      this.breachOptions = tpl.breachOptions ?? [];
      this.repaymentFrequencyTypeOptions = tpl.periodFrequencyTypeOptions ?? [];
      this.delinquencyBucketOptions = tpl.delinquencyBucketOptions ?? [];
      this.fundOptions = tpl.fundOptions ?? [];
    });
  }

  onSubmit(): void {
    this.isSaving = true;

    const request: Partial<PostWorkingCapitalLoansRequest> = {
      ...this.loan,
      locale: FINERACT_LOCALE,
      dateFormat: FINERACT_DATE_FORMAT,
    };

    if (this.submittedOnDate) {
      request.submittedOnDate = formatDateToFineract(this.submittedOnDate);
    }
    if (this.expectedDisbursementDate) {
      request.expectedDisbursementDate = formatDateToFineract(this.expectedDisbursementDate);
    }

    this.loansService.postWorkingCapitalLoans(request as PostWorkingCapitalLoansRequest).subscribe({
      next: () => this.router.navigate([this.LIST_PATH]),
      error: () => (this.isSaving = false),
    });
  }

  onCancel(): void {
    this.router.navigate([this.LIST_PATH]);
  }
}
