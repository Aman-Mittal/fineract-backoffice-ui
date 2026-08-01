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
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonDatetime,
  IonDatetimeButton,
  IonInput,
  IonItem,
  IonLabel,
  IonModal,
  IonSelect,
  IonSelectOption,
  IonSpinner,
  IonTextarea,
} from '@ionic/angular/standalone';
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
    IonDatetime,
    IonDatetimeButton,
    IonModal,
  ],
  template: `
    <div class="form-container">
      <ion-card>
        <ion-card-header>
          <ion-card-title>{{ 'WC_LOANS.CREATE' | translate }}</ion-card-title>
        </ion-card-header>

        <ion-card-content>
          <form #loanForm="ngForm" (ngSubmit)="onSubmit()" class="wc-form">
            <ion-item fill="outline">
              <ion-label position="stacked">{{ 'WC_LOANS.CLIENT_ID' | translate }}</ion-label>
              <ion-input
                [attr.aria-label]="'WC_LOANS.CLIENT_ID' | translate"
                type="number"
                name="clientId"
                [(ngModel)]="loan.clientId"
                required
              ></ion-input>
            </ion-item>

            <ion-item fill="outline">
              <ion-label position="stacked">{{ 'WC_LOANS.PRODUCT' | translate }}</ion-label>
              <ion-select
                [attr.aria-label]="'WC_LOANS.PRODUCT' | translate"
                interface="popover"
                name="productId"
                [(ngModel)]="loan.productId"
                required
              >
                @for (opt of productOptions; track opt.id) {
                  <ion-select-option [value]="opt.id">{{ opt.name }}</ion-select-option>
                }
              </ion-select>
            </ion-item>

            <ion-item fill="outline">
              <ion-label position="stacked">{{ 'WC_LOANS.PRINCIPAL' | translate }}</ion-label>
              <ion-input
                [attr.aria-label]="'WC_LOANS.PRINCIPAL' | translate"
                type="number"
                name="principalAmount"
                [(ngModel)]="loan.principalAmount"
                required
              ></ion-input>
            </ion-item>

            <ion-item fill="outline">
              <ion-label position="stacked">{{
                'WC_LOANS.SUBMITTED_ON_DATE' | translate
              }}</ion-label>
              <ion-datetime-button datetime="submittedOnDate-picker"></ion-datetime-button>
              <ion-modal [keepContentsMounted]="true">
                <ng-template>
                  <ion-datetime
                    id="submittedOnDate-picker"
                    data-testid="submittedOnDate-picker"
                    presentation="date"
                    name="submittedOnDate"
                    [(ngModel)]="submittedOnDate"
                  ></ion-datetime>
                </ng-template>
              </ion-modal>
            </ion-item>

            <ion-item fill="outline">
              <ion-label position="stacked">{{
                'WC_LOANS.EXPECTED_DISBURSEMENT_DATE' | translate
              }}</ion-label>
              <ion-datetime-button datetime="expectedDisbursementDate-picker"></ion-datetime-button>
              <ion-modal [keepContentsMounted]="true">
                <ng-template>
                  <ion-datetime
                    id="expectedDisbursementDate-picker"
                    data-testid="expectedDisbursementDate-picker"
                    presentation="date"
                    name="expectedDisbursementDate"
                    [(ngModel)]="expectedDisbursementDate"
                  ></ion-datetime>
                </ng-template>
              </ion-modal>
            </ion-item>

            <ion-item fill="outline">
              <ion-label position="stacked">{{ 'WC_LOANS.REPAYMENT_EVERY' | translate }}</ion-label>
              <ion-input
                [attr.aria-label]="'WC_LOANS.REPAYMENT_EVERY' | translate"
                type="number"
                name="repaymentEvery"
                [(ngModel)]="loan.repaymentEvery"
              ></ion-input>
            </ion-item>

            <ion-item fill="outline">
              <ion-label position="stacked">{{
                'WC_LOANS.REPAYMENT_FREQUENCY_TYPE' | translate
              }}</ion-label>
              <ion-select
                [attr.aria-label]="'WC_LOANS.REPAYMENT_FREQUENCY_TYPE' | translate"
                interface="popover"
                name="repaymentFrequencyType"
                [(ngModel)]="loan.repaymentFrequencyType"
              >
                @for (opt of repaymentFrequencyTypeOptions; track opt.id) {
                  <ion-select-option [value]="opt.code">{{ opt.value }}</ion-select-option>
                }
              </ion-select>
            </ion-item>

            <ion-item fill="outline">
              <ion-label position="stacked">{{ 'WC_LOANS.BREACH' | translate }}</ion-label>
              <ion-select
                [attr.aria-label]="'WC_LOANS.BREACH' | translate"
                interface="popover"
                name="breachId"
                [(ngModel)]="loan.breachId"
              >
                @for (opt of breachOptions; track opt.id) {
                  <ion-select-option [value]="opt.id">{{ opt.name }}</ion-select-option>
                }
              </ion-select>
            </ion-item>

            <ion-item fill="outline">
              <ion-label position="stacked">{{ 'WC_LOANS.NEAR_BREACH' | translate }}</ion-label>
              <ion-select
                [attr.aria-label]="'WC_LOANS.NEAR_BREACH' | translate"
                interface="popover"
                name="nearBreachId"
                [(ngModel)]="loan.nearBreachId"
              >
                @for (opt of nearBreachOptions; track opt.id) {
                  <ion-select-option [value]="opt.id">{{ opt.name }}</ion-select-option>
                }
              </ion-select>
            </ion-item>

            <ion-item fill="outline">
              <ion-label position="stacked">{{
                'WC_LOANS.DELINQUENCY_BUCKET' | translate
              }}</ion-label>
              <ion-select
                [attr.aria-label]="'WC_LOANS.DELINQUENCY_BUCKET' | translate"
                interface="popover"
                name="delinquencyBucketId"
                [(ngModel)]="loan.delinquencyBucketId"
              >
                @for (opt of delinquencyBucketOptions; track opt.id) {
                  <ion-select-option [value]="opt.id">{{ opt.name }}</ion-select-option>
                }
              </ion-select>
            </ion-item>

            <ion-item fill="outline">
              <ion-label position="stacked">{{ 'WC_LOANS.FUND' | translate }}</ion-label>
              <ion-select
                [attr.aria-label]="'WC_LOANS.FUND' | translate"
                interface="popover"
                name="fundId"
                [(ngModel)]="loan.fundId"
              >
                @for (opt of fundOptions; track opt.id) {
                  <ion-select-option [value]="opt.id">{{ opt.name }}</ion-select-option>
                }
              </ion-select>
            </ion-item>

            <ion-item fill="outline">
              <ion-label position="stacked">{{
                'WC_LOANS.PERIOD_PAYMENT_RATE' | translate
              }}</ion-label>
              <ion-input
                [attr.aria-label]="'WC_LOANS.PERIOD_PAYMENT_RATE' | translate"
                type="number"
                name="periodPaymentRate"
                [(ngModel)]="loan.periodPaymentRate"
              ></ion-input>
            </ion-item>

            <ion-item fill="outline">
              <ion-label position="stacked">{{
                'WC_LOANS.TOTAL_PAYMENT_VOLUME' | translate
              }}</ion-label>
              <ion-input
                [attr.aria-label]="'WC_LOANS.TOTAL_PAYMENT_VOLUME' | translate"
                type="number"
                name="totalPaymentVolume"
                [(ngModel)]="loan.totalPaymentVolume"
              ></ion-input>
            </ion-item>

            <ion-item fill="outline">
              <ion-label position="stacked">{{ 'WC_LOANS.EXTERNAL_ID' | translate }}</ion-label>
              <ion-input
                [attr.aria-label]="'WC_LOANS.EXTERNAL_ID' | translate"
                name="externalId"
                [(ngModel)]="loan.externalId"
              ></ion-input>
            </ion-item>

            <ion-item fill="outline">
              <ion-label position="stacked">{{
                'WC_LOANS.SUBMITTED_ON_NOTE' | translate
              }}</ion-label>
              <ion-textarea
                [attr.aria-label]="'WC_LOANS.SUBMITTED_ON_NOTE' | translate"
                name="submittedOnNote"
                [(ngModel)]="loan.submittedOnNote"
              ></ion-textarea>
            </ion-item>

            <div class="form-actions">
              <ion-button fill="clear" type="button" (click)="onCancel()" [disabled]="isSaving">
                {{ 'COMMON.CANCEL' | translate }}
              </ion-button>
              <ion-button color="primary" type="submit" [disabled]="loanForm.invalid || isSaving">
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
  submittedOnDate: string | null = null;
  expectedDisbursementDate: string | null = null;

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
