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

import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '../../../core/adapters';
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
  PutWorkingCapitalLoansLoanIdRequest,
  GetWorkingCapitalLoanProductsResponse,
  GetWorkingCapitalLoanBreach,
  WorkingCapitalNearBreachData,
  StringEnumOptionData,
  GetDelinquencyBucket,
  FundData,
} from '../../../api';
import {
  formatDateToFineract,
  toIsoDate,
  FINERACT_DATE_FORMAT,
  FINERACT_LOCALE,
} from '../../../core/utils/date-formatter';
import { createPickersReady } from '../../../shared/utils/pickers-ready';

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
    TranslatePipe,
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
          <ion-card-title>{{
            (isEdit() ? 'WC_LOANS.ACTIONS.MODIFY' : 'WC_LOANS.CREATE') | appTranslate
          }}</ion-card-title>
        </ion-card-header>

        <ion-card-content>
          <!-- In edit mode the form is withheld until the loan arrives. Prefilling bindings
               that have already been checked is an NG0100 in development and an inconsistent
               first paint in production, and an empty form that fills itself in a moment later
               is worse to use than a spinner. -->
          @if (isReady()) {
            <form #loanForm="ngForm" (ngSubmit)="onSubmit()" class="wc-form">
              <ion-item fill="outline">
                <ion-label position="stacked">{{ 'WC_LOANS.CLIENT_ID' | appTranslate }}</ion-label>
                <ion-input
                  [attr.aria-label]="'WC_LOANS.CLIENT_ID' | appTranslate"
                  type="number"
                  name="clientId"
                  [(ngModel)]="loan.clientId"
                  required
                ></ion-input>
              </ion-item>

              <ion-item fill="outline">
                <ion-label position="stacked">{{ 'WC_LOANS.PRODUCT' | appTranslate }}</ion-label>
                <ion-select
                  [attr.aria-label]="'WC_LOANS.PRODUCT' | appTranslate"
                  interface="popover"
                  name="productId"
                  [(ngModel)]="loan.productId"
                  required
                >
                  @for (opt of productOptions(); track opt.id) {
                    <ion-select-option [value]="opt.id">{{ opt.name }}</ion-select-option>
                  }
                </ion-select>
              </ion-item>

              <ion-item fill="outline">
                <ion-label position="stacked">{{ 'WC_LOANS.PRINCIPAL' | appTranslate }}</ion-label>
                <ion-input
                  [attr.aria-label]="'WC_LOANS.PRINCIPAL' | appTranslate"
                  type="number"
                  name="principalAmount"
                  [(ngModel)]="loan.principalAmount"
                  required
                ></ion-input>
              </ion-item>

              <ion-item fill="outline">
                <ion-label position="stacked">{{
                  'WC_LOANS.SUBMITTED_ON_DATE' | appTranslate
                }}</ion-label>
                @if (pickersReady()) {
                  <ion-datetime-button datetime="submittedOnDate-picker"></ion-datetime-button>
                }
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
                  'WC_LOANS.EXPECTED_DISBURSEMENT_DATE' | appTranslate
                }}</ion-label>
                @if (pickersReady()) {
                  <ion-datetime-button
                    datetime="expectedDisbursementDate-picker"
                  ></ion-datetime-button>
                }
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
                <ion-label position="stacked">{{
                  'WC_LOANS.REPAYMENT_EVERY' | appTranslate
                }}</ion-label>
                <ion-input
                  [attr.aria-label]="'WC_LOANS.REPAYMENT_EVERY' | appTranslate"
                  type="number"
                  name="repaymentEvery"
                  [(ngModel)]="loan.repaymentEvery"
                ></ion-input>
              </ion-item>

              <ion-item fill="outline">
                <ion-label position="stacked">{{
                  'WC_LOANS.REPAYMENT_FREQUENCY_TYPE' | appTranslate
                }}</ion-label>
                <ion-select
                  [attr.aria-label]="'WC_LOANS.REPAYMENT_FREQUENCY_TYPE' | appTranslate"
                  interface="popover"
                  name="repaymentFrequencyType"
                  [(ngModel)]="loan.repaymentFrequencyType"
                >
                  @for (opt of repaymentFrequencyTypeOptions(); track opt.id) {
                    <ion-select-option [value]="opt.code">{{ opt.value }}</ion-select-option>
                  }
                </ion-select>
              </ion-item>

              <ion-item fill="outline">
                <ion-label position="stacked">{{ 'WC_LOANS.BREACH' | appTranslate }}</ion-label>
                <ion-select
                  [attr.aria-label]="'WC_LOANS.BREACH' | appTranslate"
                  interface="popover"
                  name="breachId"
                  [(ngModel)]="loan.breachId"
                >
                  @for (opt of breachOptions(); track opt.id) {
                    <ion-select-option [value]="opt.id">{{ opt.name }}</ion-select-option>
                  }
                </ion-select>
              </ion-item>

              <ion-item fill="outline">
                <ion-label position="stacked">{{
                  'WC_LOANS.NEAR_BREACH' | appTranslate
                }}</ion-label>
                <ion-select
                  [attr.aria-label]="'WC_LOANS.NEAR_BREACH' | appTranslate"
                  interface="popover"
                  name="nearBreachId"
                  [(ngModel)]="loan.nearBreachId"
                >
                  @for (opt of nearBreachOptions(); track opt.id) {
                    <ion-select-option [value]="opt.id">{{ opt.name }}</ion-select-option>
                  }
                </ion-select>
              </ion-item>

              <ion-item fill="outline">
                <ion-label position="stacked">{{
                  'WC_LOANS.DELINQUENCY_BUCKET' | appTranslate
                }}</ion-label>
                <ion-select
                  [attr.aria-label]="'WC_LOANS.DELINQUENCY_BUCKET' | appTranslate"
                  interface="popover"
                  name="delinquencyBucketId"
                  [(ngModel)]="loan.delinquencyBucketId"
                >
                  @for (opt of delinquencyBucketOptions(); track opt.id) {
                    <ion-select-option [value]="opt.id">{{ opt.name }}</ion-select-option>
                  }
                </ion-select>
              </ion-item>

              <ion-item fill="outline">
                <ion-label position="stacked">{{ 'WC_LOANS.FUND' | appTranslate }}</ion-label>
                <ion-select
                  [attr.aria-label]="'WC_LOANS.FUND' | appTranslate"
                  interface="popover"
                  name="fundId"
                  [(ngModel)]="loan.fundId"
                >
                  @for (opt of fundOptions(); track opt.id) {
                    <ion-select-option [value]="opt.id">{{ opt.name }}</ion-select-option>
                  }
                </ion-select>
              </ion-item>

              <ion-item fill="outline">
                <ion-label position="stacked">{{
                  'WC_LOANS.PERIOD_PAYMENT_RATE' | appTranslate
                }}</ion-label>
                <ion-input
                  [attr.aria-label]="'WC_LOANS.PERIOD_PAYMENT_RATE' | appTranslate"
                  type="number"
                  name="periodPaymentRate"
                  [(ngModel)]="loan.periodPaymentRate"
                ></ion-input>
              </ion-item>

              <ion-item fill="outline">
                <ion-label position="stacked">{{
                  'WC_LOANS.TOTAL_PAYMENT_VOLUME' | appTranslate
                }}</ion-label>
                <ion-input
                  [attr.aria-label]="'WC_LOANS.TOTAL_PAYMENT_VOLUME' | appTranslate"
                  type="number"
                  name="totalPaymentVolume"
                  [(ngModel)]="loan.totalPaymentVolume"
                ></ion-input>
              </ion-item>

              <ion-item fill="outline">
                <ion-label position="stacked">{{
                  'WC_LOANS.EXTERNAL_ID' | appTranslate
                }}</ion-label>
                <ion-input
                  [attr.aria-label]="'WC_LOANS.EXTERNAL_ID' | appTranslate"
                  name="externalId"
                  [(ngModel)]="loan.externalId"
                ></ion-input>
              </ion-item>

              <ion-item fill="outline">
                <ion-label position="stacked">{{
                  'WC_LOANS.SUBMITTED_ON_NOTE' | appTranslate
                }}</ion-label>
                <ion-textarea
                  [attr.aria-label]="'WC_LOANS.SUBMITTED_ON_NOTE' | appTranslate"
                  name="submittedOnNote"
                  [(ngModel)]="loan.submittedOnNote"
                ></ion-textarea>
              </ion-item>

              <div class="form-actions">
                <ion-button fill="clear" type="button" (click)="onCancel()" [disabled]="isSaving()">
                  {{ 'COMMON.CANCEL' | appTranslate }}
                </ion-button>
                <ion-button
                  color="primary"
                  type="submit"
                  [disabled]="loanForm.invalid || isSaving()"
                >
                  @if (isSaving()) {
                    <ion-spinner name="crescent"></ion-spinner>
                    {{ 'COMMON.SAVING' | appTranslate }}
                  } @else {
                    {{ 'COMMON.SAVE' | appTranslate }}
                  }
                </ion-button>
              </div>
            </form>
          } @else {
            <div class="form-loading">
              <ion-spinner name="crescent"></ion-spinner>
            </div>
          }
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
      .form-loading {
        display: flex;
        justify-content: center;
        padding: 32px;
      }
    `,
  ],
})
export class WcLoanFormComponent implements OnInit {
  /** See `createPickersReady` — the date buttons must not outrun their pickers. */
  readonly pickersReady = createPickersReady();

  private readonly loansService = inject(WorkingCapitalLoansService);
  private readonly nearBreachService = inject(WorkingCapitalNearBreachService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  private readonly LIST_PATH = '/working-capital/loans';

  readonly isSaving = signal(false);

  /**
   * Set when the route carried an `:id`, which only `loans/edit/:id` does.
   *
   * The same form serves both; Fineract's `PUT` body is the `POST` body, and a second screen for
   * the same fields would be two places to change whenever the application shape does.
   */
  readonly loanId = signal<number | null>(null);
  readonly isEdit = signal(false);

  /** False only while an edit-mode prefill is in flight. */
  readonly isReady = signal(true);

  /**
   * The loaded application, to diff the submit against.
   *
   * `PUT /working-capital-loans/{id}` is a modification command: Fineract applies the fields it is
   * given and audits them as changes. Sending the whole form back would log every field as
   * modified on every save, so only what the user actually changed is sent.
   */
  private loaded: Partial<PutWorkingCapitalLoansLoanIdRequest> = {};

  loan: Partial<PostWorkingCapitalLoansRequest> = {};
  submittedOnDate: string | null = null;
  expectedDisbursementDate: string | null = null;

  readonly productOptions = signal<GetWorkingCapitalLoanProductsResponse[]>([]);
  readonly breachOptions = signal<GetWorkingCapitalLoanBreach[]>([]);
  readonly nearBreachOptions = signal<WorkingCapitalNearBreachData[]>([]);
  readonly repaymentFrequencyTypeOptions = signal<StringEnumOptionData[]>([]);
  readonly delinquencyBucketOptions = signal<GetDelinquencyBucket[]>([]);
  readonly fundOptions = signal<FundData[]>([]);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loanId.set(+id);
      this.isEdit.set(true);
      this.isReady.set(false);
      this.loadLoan(+id);
    }
    this.nearBreachService.getWorkingCapitalNearBreach().subscribe((data) => {
      this.nearBreachOptions.set(data);
    });
    this.loansService.getWorkingCapitalLoansTemplate().subscribe((tpl) => {
      this.productOptions.set(tpl.productOptions ?? []);
      this.breachOptions.set(tpl.breachOptions ?? []);
      this.repaymentFrequencyTypeOptions.set(tpl.periodFrequencyTypeOptions ?? []);
      this.delinquencyBucketOptions.set(tpl.delinquencyBucketOptions ?? []);
      this.fundOptions.set(tpl.fundOptions ?? []);
    });
  }

  /** Prefills the form from the loan being modified. */
  private loadLoan(loanId: number): void {
    this.loansService.getWorkingCapitalLoansLoanId(loanId).subscribe({
      next: (loan) => {
        this.loan = {
          clientId: loan.clientId,
          productId: loan.loanProductId,
          fundId: loan.fundId,
          externalId: loan.externalId,
          principalAmount: loan.principal,
          totalPaymentVolume: loan.totalPaymentVolume,
          // `paymentRate` is the rate the loan was priced at; `periodPaymentRate` is what the
          // create and modify bodies call the same number.
          periodPaymentRate: loan.paymentRate,
          repaymentEvery: loan.repaymentEvery,
          repaymentFrequencyType: loan.repaymentFrequencyType
            ?.code as PostWorkingCapitalLoansRequest.RepaymentFrequencyTypeEnum,
          breachId: loan.breach?.id,
          nearBreachId: loan.nearBreach?.id,
          delinquencyBucketId: loan.delinquencyBucket?.id,
        };
        this.submittedOnDate = loan.timeline?.submittedOnDate
          ? toIsoDate(new Date(loan.timeline.submittedOnDate))
          : null;
        this.expectedDisbursementDate = loan.timeline?.expectedDisbursementDate
          ? toIsoDate(new Date(loan.timeline.expectedDisbursementDate))
          : null;
        this.loaded = { ...this.loan };
        this.isReady.set(true);
      },
      error: (err: unknown) => {
        // Show the form rather than an endless spinner: the user can still fill it in, and the
        // interceptor has already surfaced the failure.
        this.isReady.set(true);
        console.error('Failed to load the working capital loan', err);
      },
    });
  }

  onSubmit(): void {
    this.isSaving.set(true);
    return this.isEdit() ? this.submitModification() : this.submitApplication();
  }

  private submitApplication(): void {
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
      error: () => this.isSaving.set(false),
    });
  }

  /** Sends only what changed, plus the dates, which Fineract re-validates together. */
  private submitModification(): void {
    const loanId = this.loanId();
    if (loanId === null) return;

    const request: Partial<PutWorkingCapitalLoansLoanIdRequest> = {
      locale: FINERACT_LOCALE,
      dateFormat: FINERACT_DATE_FORMAT,
    };
    for (const [key, value] of Object.entries(this.loan) as [
      keyof PutWorkingCapitalLoansLoanIdRequest,
      unknown,
    ][]) {
      if (value !== this.loaded[key]) {
        Object.assign(request, { [key]: value });
      }
    }
    if (this.submittedOnDate) {
      request.submittedOnDate = formatDateToFineract(this.submittedOnDate);
    }
    if (this.expectedDisbursementDate) {
      request.expectedDisbursementDate = formatDateToFineract(this.expectedDisbursementDate);
    }

    this.loansService
      .putWorkingCapitalLoansLoanId(loanId, request as PutWorkingCapitalLoansLoanIdRequest)
      .subscribe({
        next: () => this.router.navigate([`${this.LIST_PATH}/view/${loanId}`]),
        error: () => this.isSaving.set(false),
      });
  }

  onCancel(): void {
    const loanId = this.loanId();
    this.router.navigate(loanId === null ? [this.LIST_PATH] : [`${this.LIST_PATH}/view/${loanId}`]);
  }
}
