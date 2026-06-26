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
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import {
  LoanTransactionsService,
  LoansService,
  PostLoansLoanIdTransactionsRequest,
  GetLoansLoanIdTransactionsTemplateResponse,
  GetPaymentTypeOptions,
} from '../../api';

@Component({
  selector: 'app-loan-transaction-form',
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
    MatSnackBarModule,
  ],
  template: `
    <div class="form-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>
            {{
              transactionType === 'repayment'
                ? ('LOANS.REPAYMENT' | translate)
                : transactionType === 'disburse'
                  ? ('LOANS.DISBURSEMENT' | translate)
                  : ('LOANS.APPROVAL' | translate)
            }}
          </mat-card-title>
        </mat-card-header>

        <mat-card-content>
          <form #transactionForm="ngForm" (ngSubmit)="onSubmit()" class="transaction-form">
            <div class="form-grid">
              <!-- Transaction Date -->
              <mat-form-field
                appearance="outline"
                [matTooltip]="'HELP.TRANSACTION_DATE_DESC' | translate"
              >
                <mat-label>
                  {{
                    transactionType === 'approve'
                      ? ('COMMON.ACTIVATION_DATE' | translate)
                      : ('COMMON.TRANSACTION_DATE' | translate)
                  }}
                </mat-label>
                <input
                  matInput
                  [matDatepicker]="picker"
                  name="transactionDate"
                  [(ngModel)]="transactionDate"
                  required
                />
                <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
                <mat-datepicker #picker></mat-datepicker>
              </mat-form-field>

              @if (transactionType !== 'approve') {
                <!-- Transaction Amount -->
                <mat-form-field
                  appearance="outline"
                  [matTooltip]="'HELP.TRANSACTION_AMOUNT_DESC' | translate"
                >
                  <mat-label>{{ 'COMMON.TRANSACTION_AMOUNT' | translate }}</mat-label>
                  <input
                    matInput
                    type="number"
                    name="transactionAmount"
                    [(ngModel)]="transaction.transactionAmount"
                    required
                  />
                </mat-form-field>

                <!-- Payment Type -->
                <mat-form-field
                  appearance="outline"
                  [matTooltip]="'HELP.PAYMENT_TYPE_DESC' | translate"
                >
                  <mat-label>{{ 'COMMON.PAYMENT_TYPE' | translate }}</mat-label>
                  <mat-select name="paymentTypeId" [(ngModel)]="transaction.paymentTypeId">
                    @for (type of paymentTypeOptions; track type.id) {
                      <mat-option [value]="type.id">{{ type.name }}</mat-option>
                    }
                  </mat-select>
                </mat-form-field>
              }

              @if (transactionType === 'repayment') {
                <!-- Receipt Number -->
                <mat-form-field appearance="outline">
                  <mat-label>{{ 'LOANS.RECEIPT_NUMBER' | translate }}</mat-label>
                  <input matInput name="receiptNumber" [(ngModel)]="transaction.receiptNumber" />
                </mat-form-field>

                <!-- Bank Number -->
                <mat-form-field appearance="outline">
                  <mat-label>{{ 'LOANS.BANK_NUMBER' | translate }}</mat-label>
                  <input matInput name="bankNumber" [(ngModel)]="transaction.bankNumber" />
                </mat-form-field>

                <!-- Check Number -->
                <mat-form-field appearance="outline">
                  <mat-label>{{ 'LOANS.CHECK_NUMBER' | translate }}</mat-label>
                  <input matInput name="checkNumber" [(ngModel)]="transaction.checkNumber" />
                </mat-form-field>

                <!-- Routing Code -->
                <mat-form-field appearance="outline">
                  <mat-label>{{ 'LOANS.ROUTING_CODE' | translate }}</mat-label>
                  <input matInput name="routingCode" [(ngModel)]="transaction.routingCode" />
                </mat-form-field>
              }

              <!-- Note -->
              <mat-form-field
                appearance="outline"
                [matTooltip]="'HELP.NOTE_DESC' | translate"
                class="full-width"
              >
                <mat-label>{{ 'COMMON.NOTE' | translate }}</mat-label>
                <textarea matInput name="note" [(ngModel)]="transaction.note" rows="3"></textarea>
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
                [disabled]="transactionForm.invalid || isSaving"
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
      .transaction-form {
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
export class LoanTransactionFormComponent implements OnInit {
  private readonly transactionService = inject(LoanTransactionsService);
  private readonly loansService = inject(LoansService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly snackBar = inject(MatSnackBar);

  loanId = 0;
  transactionType = '';
  isSaving = false;

  transaction: PostLoansLoanIdTransactionsRequest = {};
  transactionDate: Date = new Date();
  paymentTypeOptions: GetPaymentTypeOptions[] = [];

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.loanId = +params['loanId'];
      this.transactionType = params['type'];
      this.loadTemplate();
    });
  }

  private loadTemplate(): void {
    if (this.transactionType === 'approve') {
      return;
    }
    this.transactionService
      .getLoansLoanIdTransactionsTemplate(this.loanId, this.transactionType)
      .subscribe({
        next: (template: GetLoansLoanIdTransactionsTemplateResponse) => {
          this.transaction.transactionAmount = template.amount;
          const dateArray = template.date as unknown as number[];
          if (dateArray) {
            this.transactionDate = new Date(dateArray[0], dateArray[1] - 1, dateArray[2]);
          }
          this.paymentTypeOptions = template.paymentTypeOptions || [];
        },
        error: () => {
          this.snackBar.open('Operation failed. Please try again.', 'Close', { duration: 3000 });
        },
      });
  }

  onSubmit(): void {
    this.isSaving = true;

    const formattedDate = `${this.transactionDate.getFullYear()}-${String(
      this.transactionDate.getMonth() + 1,
    ).padStart(2, '0')}-${String(this.transactionDate.getDate()).padStart(2, '0')}`;

    if (this.transactionType === 'approve') {
      const payload = {
        approvedOnDate: formattedDate,
        dateFormat: 'yyyy-MM-dd',
        locale: 'en',
        note: this.transaction.note,
      };
      this.loansService.postLoansLoanId(this.loanId, payload, 'approve').subscribe({
        next: () => this.router.navigate(['/loans']),
        error: () => (this.isSaving = false),
      });
    } else {
      this.transaction.transactionDate = formattedDate;
      this.transaction.dateFormat = 'yyyy-MM-dd';
      this.transaction.locale = 'en';

      this.transactionService
        .postLoansLoanIdTransactions(this.loanId, this.transaction, this.transactionType)
        .subscribe({
          next: () => this.router.navigate(['/loans']),
          error: () => (this.isSaving = false),
        });
    }
  }

  onCancel(): void {
    this.router.navigate(['/loans']);
  }
}
