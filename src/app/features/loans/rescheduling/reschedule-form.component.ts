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
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonInput,
  IonItem,
  IonLabel,
  IonNote,
  IonSelect,
  IonSelectOption,
  IonSpinner,
  IonTextarea,
} from '@ionic/angular/standalone';
import {
  RescheduleLoansService,
  PostCreateRescheduleLoansRequest,
  GetRescheduleReasonsTemplateResponse,
  LoansService,
  GetLoansLoanIdRepaymentPeriod,
  CodesService,
  CodeValuesService,
} from '../../../api';

/**
 * Component for requesting a loan rescheduling.
 */
@Component({
  selector: 'app-reschedule-form',
  standalone: true,
  imports: [
    FormsModule,
    TranslateModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    IonButton,
    IonSpinner,
    IonInput,
    IonTextarea,
    IonItem,
    IonLabel,
    IonNote,
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
          <ion-card-title>Request Loan Reschedule</ion-card-title>
        </ion-card-header>

        <ion-card-content>
          <form #rescheduleForm="ngForm" (ngSubmit)="onSubmit()" class="reschedule-form">
            <div class="form-grid">
              <!-- Reschedule From Date (Select Unpaid Installment) -->
              <ion-item fill="outline" [attr.title]="'HELP.RESCHEDULE_FROM_DESC' | translate">
                <ion-label position="stacked">Reschedule From Date</ion-label>
                <ion-select
                  name="rescheduleFromDate"
                  [(ngModel)]="rescheduleFromDateString"
                  required
                >
                  @for (installment of unpaidInstallments; track installment.period) {
                    <ion-select-option [value]="formatInstallmentDate(installment)">
                      Period {{ installment.period }}: Due on
                      {{ formatPeriodDate(installment.dueDate) }} (Principal Due:
                      {{ installment.principalDue }}, Interest Due: {{ installment.interestDue }})
                    </ion-select-option>
                  }
                </ion-select>
                <ion-note>Must be an existing installment date</ion-note>
              </ion-item>

              <!-- Reason Container (Dropdown or Custom entry) -->
              <div class="reason-container">
                @if (isAddingCustomReason) {
                  <ion-item fill="outline">
                    <ion-label position="stacked">Reason Name (Manual)</ion-label>
                    <ion-input
                      name="customReasonName"
                      [(ngModel)]="customReasonName"
                      required
                    ></ion-input>
                  </ion-item>
                } @else {
                  <ion-item fill="outline">
                    <ion-label position="stacked">Reason</ion-label>
                    <ion-select
                      name="rescheduleReasonId"
                      [(ngModel)]="request.rescheduleReasonId"
                      required
                    >
                      @for (reason of reasons; track reason['id']) {
                        <ion-select-option [value]="reason['id']">{{
                          reason['name']
                        }}</ion-select-option>
                      }
                    </ion-select>
                  </ion-item>
                }

                @if (reasons.length > 0) {
                  <div class="reason-toggle">
                    <ion-button
                      fill="clear"
                      color="primary"
                      type="button"
                      (click)="toggleCustomReason()"
                    >
                      {{ isAddingCustomReason ? 'Select existing reason' : 'Add custom reason' }}
                    </ion-button>
                  </div>
                }
              </div>

              <!-- Submitted On Date -->
              <mat-form-field appearance="outline">
                <mat-label>Submitted On Date</mat-label>
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

              <!-- Adjusted Due Date (Optional) -->
              <mat-form-field appearance="outline">
                <mat-label>Adjusted Due Date (Optional)</mat-label>
                <input
                  matInput
                  [matDatepicker]="adjPicker"
                  name="adjustedDueDate"
                  [(ngModel)]="adjustedDueDate"
                />
                <mat-datepicker-toggle matSuffix [for]="adjPicker"></mat-datepicker-toggle>
                <mat-datepicker #adjPicker></mat-datepicker>
                <mat-hint>New date for the rescheduled installment</mat-hint>
              </mat-form-field>

              <!-- Comment -->
              <ion-item fill="outline" class="full-width">
                <ion-label position="stacked">Comment</ion-label>
                <ion-textarea
                  name="rescheduleReasonComment"
                  [(ngModel)]="request.rescheduleReasonComment"
                  rows="2"
                ></ion-textarea>
              </ion-item>

              <!-- Grace on Principal -->
              <ion-item fill="outline">
                <ion-label position="stacked">Grace on Principal</ion-label>
                <ion-input
                  type="number"
                  name="graceOnPrincipal"
                  [(ngModel)]="request.graceOnPrincipal"
                ></ion-input>
              </ion-item>

              <!-- Grace on Interest -->
              <ion-item fill="outline">
                <ion-label position="stacked">Grace on Interest</ion-label>
                <ion-input
                  type="number"
                  name="graceOnInterest"
                  [(ngModel)]="request.graceOnInterest"
                ></ion-input>
              </ion-item>

              <!-- Extra Terms -->
              <ion-item fill="outline">
                <ion-label position="stacked">Extra Terms</ion-label>
                <ion-input
                  type="number"
                  name="extraTerms"
                  [(ngModel)]="request.extraTerms"
                ></ion-input>
              </ion-item>

              <!-- New Interest Rate -->
              <ion-item fill="outline">
                <ion-label position="stacked">New Interest Rate</ion-label>
                <ion-input
                  type="number"
                  name="newInterestRate"
                  [(ngModel)]="request.newInterestRate"
                ></ion-input>
              </ion-item>
            </div>

            <div class="form-actions">
              <ion-button fill="clear" type="button" (click)="onCancel()" [disabled]="isSaving">
                {{ 'COMMON.CANCEL' | translate }}
              </ion-button>
              <ion-button
                color="primary"
                type="submit"
                [disabled]="rescheduleForm.invalid || isSaving"
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
        max-width: 800px;
        margin: 0 auto;
      }
      .reschedule-form {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }
      .form-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 16px;
      }
      .reason-container {
        display: flex;
        flex-direction: column;
        width: 100%;
      }
      .reason-toggle {
        margin-top: -8px;
        margin-bottom: 8px;
      }
    `,
  ],
})
export class RescheduleFormComponent implements OnInit {
  private readonly rescheduleService = inject(RescheduleLoansService);
  private readonly loansService = inject(LoansService);
  private readonly codesService = inject(CodesService);
  private readonly codeValuesService = inject(CodeValuesService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  loanId: number | null = null;
  isSaving = false;

  request: PostCreateRescheduleLoansRequest = {
    graceOnPrincipal: 0,
    graceOnInterest: 0,
    extraTerms: 0,
  };
  rescheduleFromDateString = '';
  submittedOnDate = new Date();
  adjustedDueDate: Date | null = null;
  reasons: Record<string, unknown>[] = [];
  unpaidInstallments: GetLoansLoanIdRepaymentPeriod[] = [];

  isAddingCustomReason = false;
  customReasonName = '';

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('loanId');
      if (id) {
        this.loanId = +id;
        this.request.loanId = this.loanId;
        this.loadTemplate();
        this.loadLoanRepaymentSchedule();
      }
    });
  }

  toggleCustomReason(): void {
    this.isAddingCustomReason = !this.isAddingCustomReason;
    if (!this.isAddingCustomReason) {
      this.customReasonName = '';
      this.request.rescheduleReasonId = undefined;
    }
  }

  private loadTemplate(): void {
    this.rescheduleService.getRescheduleloansTemplate().subscribe({
      next: (template: GetRescheduleReasonsTemplateResponse) => {
        this.reasons = (template.rescheduleReasons as unknown as Record<string, unknown>[]) || [];
        if (this.reasons.length === 0) {
          this.isAddingCustomReason = true;
        }
      },
    });
  }

  private loadLoanRepaymentSchedule(): void {
    if (!this.loanId) return;
    this.loansService.getLoansLoanId(this.loanId, undefined, 'repaymentSchedule').subscribe({
      next: (loan) => {
        const periods = loan.repaymentSchedule?.periods || [];
        this.unpaidInstallments = periods.filter(
          (period) => period.period !== undefined && period.period !== null && !period.complete,
        );
      },
      error: (err) => console.error('Failed to load repayment schedule', err),
    });
  }

  formatInstallmentDate(period: GetLoansLoanIdRepaymentPeriod): string {
    const dates = period.dueDate as unknown as number[];
    if (dates && Array.isArray(dates)) {
      return `${dates[0]}-${String(dates[1]).padStart(2, '0')}-${String(dates[2]).padStart(2, '0')}`;
    }
    if (typeof period.dueDate === 'string') {
      return period.dueDate;
    }
    return '';
  }

  formatPeriodDate(dates: unknown): string {
    if (dates && Array.isArray(dates)) {
      return new Date(dates[0], dates[1] - 1, dates[2]).toLocaleDateString();
    }
    if (typeof dates === 'string') {
      return new Date(dates).toLocaleDateString();
    }
    return '-';
  }

  onSubmit(): void {
    this.isSaving = true;

    this.request.rescheduleFromDate = this.rescheduleFromDateString;

    const formattedSubDate = `${this.submittedOnDate.getFullYear()}-${String(
      this.submittedOnDate.getMonth() + 1,
    ).padStart(2, '0')}-${String(this.submittedOnDate.getDate()).padStart(2, '0')}`;
    this.request.submittedOnDate = formattedSubDate;

    if (this.adjustedDueDate) {
      this.request.adjustedDueDate = `${this.adjustedDueDate.getFullYear()}-${String(
        this.adjustedDueDate.getMonth() + 1,
      ).padStart(2, '0')}-${String(this.adjustedDueDate.getDate()).padStart(2, '0')}`;
    } else {
      delete this.request.adjustedDueDate;
    }

    if (this.request.graceOnPrincipal === undefined || this.request.graceOnPrincipal === null) {
      this.request.graceOnPrincipal = 0;
    }
    if (this.request.graceOnInterest === undefined || this.request.graceOnInterest === null) {
      this.request.graceOnInterest = 0;
    }
    if (this.request.extraTerms === undefined || this.request.extraTerms === null) {
      this.request.extraTerms = 0;
    }

    this.request.dateFormat = 'yyyy-MM-dd';
    this.request.locale = 'en';

    if (this.isAddingCustomReason && this.customReasonName.trim()) {
      this.codesService.getCodes().subscribe({
        next: (codes) => {
          const targetCode = codes.find((c) => c.name === 'LoanRescheduleReason');
          if (targetCode && targetCode.id) {
            this.codeValuesService
              .postCodesCodeIdCodevalues(targetCode.id, {
                name: this.customReasonName.trim(),
                isActive: true,
              })
              .subscribe({
                next: (res) => {
                  const reasonId = res.subResourceId || res.resourceId;
                  if (reasonId) {
                    this.request.rescheduleReasonId = reasonId;
                    this.submitRescheduleRequest();
                  } else {
                    console.error('Failed to get reason ID from response');
                    this.isSaving = false;
                  }
                },
                error: (err) => {
                  console.error('Failed to create code value', err);
                  this.isSaving = false;
                },
              });
          } else {
            console.error('Could not find LoanRescheduleReason code category');
            this.isSaving = false;
          }
        },
        error: (err) => {
          console.error('Failed to retrieve codes', err);
          this.isSaving = false;
        },
      });
    } else {
      this.submitRescheduleRequest();
    }
  }

  private submitRescheduleRequest(): void {
    this.rescheduleService.postRescheduleloans(this.request).subscribe({
      next: () => this.router.navigate(['/loans', this.loanId, 'rescheduling']),
      error: () => (this.isSaving = false),
    });
  }

  onCancel(): void {
    this.router.navigate(['/loans', this.loanId, 'rescheduling']);
  }
}
