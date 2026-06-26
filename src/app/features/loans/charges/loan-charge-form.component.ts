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
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {
  LoanChargesService,
  PostLoansLoanIdChargesRequest,
  GetLoanChargeTemplateChargeOptions,
} from '../../../api';
import {
  formatDateToFineract,
  FINERACT_DATE_FORMAT,
  FINERACT_LOCALE,
} from '../../../core/utils/date-formatter';

/**
 * Create form for a loan charge. The available charge options come from the loan charges
 * template endpoint; the core captured fields are the chargeId, amount, and due date.
 */
@Component({
  selector: 'app-loan-charge-form',
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
          <mat-card-title>{{ 'LOAN_CHARGES.ADD_TITLE' | translate }}</mat-card-title>
        </mat-card-header>

        <mat-card-content>
          <form #chargeForm="ngForm" (ngSubmit)="onSubmit()" class="charge-form">
            <mat-form-field appearance="outline">
              <mat-label>{{ 'LOAN_CHARGES.CHARGE' | translate }}</mat-label>
              <mat-select name="chargeId" [(ngModel)]="charge.chargeId" required>
                @for (opt of chargeOptions; track opt.id) {
                  <mat-option [value]="opt.id">{{ opt.name }}</mat-option>
                }
              </mat-select>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>{{ 'LOAN_CHARGES.AMOUNT' | translate }}</mat-label>
              <input matInput type="number" name="amount" [(ngModel)]="charge.amount" required />
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>{{ 'LOAN_CHARGES.DUE_DATE' | translate }}</mat-label>
              <input matInput [matDatepicker]="picker" name="dueDate" [(ngModel)]="dueDate" />
              <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
              <mat-datepicker #picker></mat-datepicker>
            </mat-form-field>

            <div class="form-actions">
              <button mat-button type="button" (click)="onCancel()" [disabled]="isSaving">
                {{ 'LOAN_CHARGES.CANCEL' | translate }}
              </button>
              <button
                mat-raised-button
                color="primary"
                type="submit"
                [disabled]="chargeForm.invalid || isSaving"
              >
                @if (isSaving) {
                  <mat-spinner
                    diameter="20"
                    style="margin-right: 8px; display: inline-block; vertical-align: middle;"
                  ></mat-spinner>
                  {{ 'COMMON.SAVING' | translate }}
                } @else {
                  {{ 'LOAN_CHARGES.SAVE' | translate }}
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
      .charge-form {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }
    `,
  ],
})
export class LoanChargeFormComponent implements OnInit {
  private readonly loanChargesService = inject(LoanChargesService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  loanId!: number;
  isSaving = false;

  charge: PostLoansLoanIdChargesRequest = {};
  dueDate: Date | null = null;
  chargeOptions: GetLoanChargeTemplateChargeOptions[] = [];

  ngOnInit(): void {
    this.loanId = Number(this.route.snapshot.paramMap.get('loanId'));

    this.loanChargesService.getLoansLoanIdChargesTemplate(this.loanId).subscribe((tpl) => {
      this.chargeOptions = tpl.chargeOptions ? Array.from(tpl.chargeOptions) : [];
    });
  }

  onSubmit(): void {
    this.isSaving = true;
    const request: PostLoansLoanIdChargesRequest = {
      chargeId: this.charge.chargeId,
      amount: this.charge.amount,
      dueDate: this.dueDate ? formatDateToFineract(this.dueDate) : undefined,
      dateFormat: FINERACT_DATE_FORMAT,
      locale: FINERACT_LOCALE,
    };

    this.loanChargesService.postLoansLoanIdCharges(this.loanId, request).subscribe({
      next: () => this.router.navigate(['/loans', this.loanId, 'charges']),
      error: () => (this.isSaving = false),
    });
  }

  onCancel(): void {
    this.router.navigate(['/loans', this.loanId, 'charges']);
  }
}
