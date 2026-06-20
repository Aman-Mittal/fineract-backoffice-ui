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
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
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
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
  ],
  template: `
    <div class="form-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Request Loan Reschedule</mat-card-title>
        </mat-card-header>

        <mat-card-content>
          <form #rescheduleForm="ngForm" (ngSubmit)="onSubmit()" class="reschedule-form">
            <div class="form-grid">
              <!-- Reschedule From Date (Select Unpaid Installment) -->
              <mat-form-field
                appearance="outline"
                [matTooltip]="'HELP.RESCHEDULE_FROM_DESC' | translate"
              >
                <mat-label>Reschedule From Date</mat-label>
                <mat-select
                  name="rescheduleFromDate"
                  [(ngModel)]="rescheduleFromDateString"
                  required
                >
                  @for (installment of unpaidInstallments; track installment.period) {
                    <mat-option [value]="formatInstallmentDate(installment)">
                      Period {{ installment.period }}: Due on
                      {{ formatPeriodDate(installment.dueDate) }} (Principal Due:
                      {{ installment.principalDue }}, Interest Due: {{ installment.interestDue }})
                    </mat-option>
                  }
                </mat-select>
                <mat-hint>Must be an existing installment date</mat-hint>
              </mat-form-field>

              <!-- Reason Container (Dropdown or Custom entry) -->
              <div class="reason-container">
                @if (isAddingCustomReason) {
                  <mat-form-field appearance="outline">
                    <mat-label>Reason Name (Manual)</mat-label>
                    <input
                      matInput
                      name="customReasonName"
                      [(ngModel)]="customReasonName"
                      required
                    />
                  </mat-form-field>
                } @else {
                  <mat-form-field appearance="outline">
                    <mat-label>Reason</mat-label>
                    <mat-select
                      name="rescheduleReasonId"
                      [(ngModel)]="request.rescheduleReasonId"
                      required
                    >
                      @for (reason of reasons; track reason['id']) {
                        <mat-option [value]="reason['id']">{{ reason['name'] }}</mat-option>
                      }
                    </mat-select>
                  </mat-form-field>
                }

                @if (reasons.length > 0) {
                  <div class="reason-toggle">
                    <button mat-button color="primary" type="button" (click)="toggleCustomReason()">
                      {{ isAddingCustomReason ? 'Select existing reason' : 'Add custom reason' }}
                    </button>
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
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Comment</mat-label>
                <textarea
                  matInput
                  name="rescheduleReasonComment"
                  [(ngModel)]="request.rescheduleReasonComment"
                  rows="2"
                ></textarea>
              </mat-form-field>

              <!-- Grace on Principal -->
              <mat-form-field appearance="outline">
                <mat-label>Grace on Principal</mat-label>
                <input
                  matInput
                  type="number"
                  name="graceOnPrincipal"
                  [(ngModel)]="request.graceOnPrincipal"
                />
              </mat-form-field>

              <!-- Grace on Interest -->
              <mat-form-field appearance="outline">
                <mat-label>Grace on Interest</mat-label>
                <input
                  matInput
                  type="number"
                  name="graceOnInterest"
                  [(ngModel)]="request.graceOnInterest"
                />
              </mat-form-field>

              <!-- Extra Terms -->
              <mat-form-field appearance="outline">
                <mat-label>Extra Terms</mat-label>
                <input matInput type="number" name="extraTerms" [(ngModel)]="request.extraTerms" />
              </mat-form-field>

              <!-- New Interest Rate -->
              <mat-form-field appearance="outline">
                <mat-label>New Interest Rate</mat-label>
                <input
                  matInput
                  type="number"
                  name="newInterestRate"
                  [(ngModel)]="request.newInterestRate"
                />
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
                [disabled]="rescheduleForm.invalid || isSaving"
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
