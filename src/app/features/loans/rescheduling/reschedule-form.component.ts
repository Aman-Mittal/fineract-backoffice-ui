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
              <mat-form-field
                appearance="outline"
                [matTooltip]="'HELP.RESCHEDULE_FROM_DESC' | translate"
              >
                <mat-label>Reschedule From Date</mat-label>
                <input
                  matInput
                  [matDatepicker]="fromPicker"
                  name="rescheduleFromDate"
                  [(ngModel)]="rescheduleFromDate"
                  required
                />
                <mat-datepicker-toggle matSuffix [for]="fromPicker"></mat-datepicker-toggle>
                <mat-datepicker #fromPicker></mat-datepicker>
                <mat-hint>Must be an existing installment date</mat-hint>
              </mat-form-field>

              <!-- Reason -->
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
                  required
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
                  required
                />
              </mat-form-field>

              <!-- Extra Terms -->
              <mat-form-field appearance="outline">
                <mat-label>Extra Terms</mat-label>
                <input
                  matInput
                  type="number"
                  name="extraTerms"
                  [(ngModel)]="request.extraTerms"
                  required
                />
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
    `,
  ],
})
export class RescheduleFormComponent implements OnInit {
  private readonly rescheduleService = inject(RescheduleLoansService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  loanId: number | null = null;
  isSaving = false;

  request: PostCreateRescheduleLoansRequest = {
    graceOnPrincipal: 0,
    graceOnInterest: 0,
    extraTerms: 0,
  };
  rescheduleFromDate = new Date();
  submittedOnDate = new Date();
  reasons: Record<string, unknown>[] = [];

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('loanId');
      if (id) {
        this.loanId = +id;
        this.request.loanId = this.loanId;
        this.loadTemplate();
      }
    });
  }

  private loadTemplate(): void {
    this.rescheduleService.retrieveTemplate10().subscribe({
      next: (template: GetRescheduleReasonsTemplateResponse) => {
        this.reasons = (template.rescheduleReasons as unknown as Record<string, unknown>[]) || [];
      },
    });
  }

  onSubmit(): void {
    this.isSaving = true;

    const formattedFromDate = `${this.rescheduleFromDate.getFullYear()}-${String(this.rescheduleFromDate.getMonth() + 1).padStart(2, '0')}-${String(this.rescheduleFromDate.getDate()).padStart(2, '0')}`;
    const formattedSubDate = `${this.submittedOnDate.getFullYear()}-${String(this.submittedOnDate.getMonth() + 1).padStart(2, '0')}-${String(this.submittedOnDate.getDate()).padStart(2, '0')}`;

    this.request.rescheduleFromDate = formattedFromDate;
    this.request.submittedOnDate = formattedSubDate;
    this.request.dateFormat = 'yyyy-MM-dd';
    this.request.locale = 'en';

    this.rescheduleService.createLoanRescheduleRequest(this.request).subscribe({
      next: () => this.router.navigate(['/loans', this.loanId, 'rescheduling']),
      error: () => (this.isSaving = false),
    });
  }

  onCancel(): void {
    this.router.navigate(['/loans', this.loanId, 'rescheduling']);
  }
}
