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
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { DecimalPipe } from '@angular/common';
import {
  LoanTransactionsService,
  GetLoansLoanIdTransactionsTransactionIdResponse,
} from '../../api';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';

export interface TransactionDetailDialogData {
  loanId: number;
  transactionId: number;
  currencySymbol?: string;
  /** Whether this transaction type can be corrected via the adjust API — a
   *  business call made by the caller (e.g. repayment/goodwill credit yes,
   *  disbursement/approval no). */
  adjustable: boolean;
}

const DATE_FORMAT = 'yyyy-MM-dd';

@Component({
  selector: 'app-transaction-detail-dialog',
  standalone: true,
  imports: [
    FormsModule,
    TranslateModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    DecimalPipe,
  ],
  template: `
    <h2 mat-dialog-title>{{ 'LOANS.TRANSACTION_DETAILS' | translate }}</h2>
    <mat-dialog-content>
      @if (detail(); as tx) {
        <table class="detail-table">
          <tr>
            <td class="label">{{ 'COMMON.TYPE' | translate }}</td>
            <td class="value">{{ transactionTypeLabel(tx) }}</td>
          </tr>
          <tr>
            <td class="label">{{ 'COMMON.TRANSACTION_DATE' | translate }}</td>
            <td class="value">{{ formatDate(tx.date) }}</td>
          </tr>
          <tr>
            <td class="label">{{ 'COMMON.AMOUNT' | translate }}</td>
            <td class="value">{{ data.currencySymbol }}{{ tx.amount | number: '1.2-2' }}</td>
          </tr>
          <tr>
            <td class="label">
              {{ 'LOANS.REPAYMENT_SCHEDULE_HEADERS.PRINCIPAL_DUE' | translate }}
            </td>
            <td class="value">
              {{ data.currencySymbol }}{{ tx.principalPortion | number: '1.2-2' }}
            </td>
          </tr>
          <tr>
            <td class="label">{{ 'LOANS.REPAYMENT_SCHEDULE_HEADERS.INTEREST' | translate }}</td>
            <td class="value">
              {{ data.currencySymbol }}{{ tx.interestPortion | number: '1.2-2' }}
            </td>
          </tr>
          <tr>
            <td class="label">{{ 'LOANS.REPAYMENT_SCHEDULE_HEADERS.FEES' | translate }}</td>
            <td class="value">
              {{ data.currencySymbol }}{{ tx.feeChargesPortion | number: '1.2-2' }}
            </td>
          </tr>
          <tr>
            <td class="label">{{ 'LOANS.REPAYMENT_SCHEDULE_HEADERS.PENALTIES' | translate }}</td>
            <td class="value">
              {{ data.currencySymbol }}{{ tx.penaltyChargesPortion | number: '1.2-2' }}
            </td>
          </tr>
          @if (tx.paymentDetailData?.receiptNumber) {
            <tr>
              <td class="label">{{ 'LOANS.RECEIPT_NUMBER' | translate }}</td>
              <td class="value">{{ tx.paymentDetailData?.receiptNumber }}</td>
            </tr>
          }
          @if (tx.manuallyReversed) {
            <tr>
              <td class="label">{{ 'LOANS.REVERSED' | translate }}</td>
              <td class="value">{{ 'COMMON.YES' | translate }}</td>
            </tr>
          }
        </table>

        @if (data.adjustable && !tx.manuallyReversed) {
          @if (!showAdjustForm()) {
            <button
              mat-stroked-button
              color="warn"
              class="adjust-toggle"
              (click)="showAdjustForm.set(true)"
            >
              <mat-icon>edit</mat-icon>
              {{ 'LOANS.ACTIONS.ADJUST_TRANSACTION' | translate }}
            </button>
          } @else {
            <div class="adjust-form">
              <p class="adjust-warning">{{ 'LOANS.CONFIRM_ADJUST_TRANSACTION' | translate }}</p>
              <mat-form-field appearance="outline">
                <mat-label>{{ 'COMMON.TRANSACTION_DATE' | translate }}</mat-label>
                <input
                  matInput
                  [matDatepicker]="picker"
                  [(ngModel)]="adjustDate"
                  name="adjustDate"
                />
                <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
                <mat-datepicker #picker></mat-datepicker>
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>{{ 'COMMON.TRANSACTION_AMOUNT' | translate }}</mat-label>
                <input matInput type="number" [(ngModel)]="adjustAmount" name="adjustAmount" />
              </mat-form-field>
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>{{ 'COMMON.NOTE' | translate }}</mat-label>
                <textarea matInput rows="2" [(ngModel)]="adjustNote" name="adjustNote"></textarea>
              </mat-form-field>
            </div>
          }
        }
      } @else {
        <p>{{ 'COMMON.LOADING' | translate }}</p>
      }
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="dialogRef.close(false)">{{ 'COMMON.CLOSE' | translate }}</button>
      @if (showAdjustForm()) {
        <button mat-raised-button color="warn" [disabled]="isSaving()" (click)="onConfirmAdjust()">
          {{ 'LOANS.ACTIONS.ADJUST_TRANSACTION' | translate }}
        </button>
      }
    </mat-dialog-actions>
  `,
  styles: [
    `
      .detail-table {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 8px;
      }
      .detail-table td {
        padding: 6px 8px;
        border-bottom: 1px solid var(--border-color, #e0e0e0);
      }
      .detail-table .label {
        color: var(--text-muted, #7f8c8d);
        font-weight: 500;
      }
      .detail-table .value {
        text-align: right;
        font-weight: 600;
      }
      .adjust-toggle {
        margin-top: 12px;
      }
      .adjust-form {
        margin-top: 12px;
        display: flex;
        flex-direction: column;
        gap: 8px;
      }
      .adjust-warning {
        color: #c0392b;
        font-size: 13px;
      }
      .full-width {
        width: 100%;
      }
    `,
  ],
})
export class TransactionDetailDialogComponent implements OnInit {
  readonly dialogRef = inject(MatDialogRef<TransactionDetailDialogComponent>);
  private readonly transactionsService = inject(LoanTransactionsService);
  private readonly confirmDialog = inject(MatDialog);
  private readonly translate = inject(TranslateService);

  detail = signal<GetLoansLoanIdTransactionsTransactionIdResponse | null>(null);
  showAdjustForm = signal(false);
  isSaving = signal(false);

  adjustDate: Date = new Date();
  adjustAmount = 0;
  adjustNote = '';

  readonly data: TransactionDetailDialogData = inject(MAT_DIALOG_DATA);

  ngOnInit(): void {
    this.transactionsService
      .getLoansLoanIdTransactionsTransactionId(this.data.loanId, this.data.transactionId)
      .subscribe({
        next: (data) => {
          this.detail.set(data);
          this.adjustAmount = data.amount ?? 0;
          const dateArray = data.date as unknown as number[];
          if (Array.isArray(dateArray)) {
            this.adjustDate = new Date(dateArray[0], dateArray[1] - 1, dateArray[2]);
          }
        },
        error: (err) => console.error('Failed to load transaction detail', err),
      });
  }

  formatDate(dates: unknown): string {
    const arr = dates as number[];
    if (Array.isArray(arr)) {
      return new Date(arr[0], arr[1] - 1, arr[2]).toLocaleDateString();
    }
    return '';
  }

  // The generated GetLoansType model omits the `value` field that Fineract
  // actually returns (e.g. "Repayment") alongside `code`/`description` — the
  // OpenAPI spec under-documents this endpoint's response shape.
  transactionTypeLabel(tx: GetLoansLoanIdTransactionsTransactionIdResponse): string {
    const type = tx.type as unknown as Record<string, unknown> | undefined;
    return (
      (type?.['value'] as string) ||
      (type?.['description'] as string) ||
      (type?.['code'] as string) ||
      ''
    );
  }

  onConfirmAdjust(): void {
    const confirmRef = this.confirmDialog.open(ConfirmDialogComponent, {
      data: {
        title: this.translate.instant('LOANS.ACTIONS.ADJUST_TRANSACTION'),
        message: this.translate.instant('LOANS.CONFIRM_ADJUST_TRANSACTION'),
        destructive: true,
      },
    });
    confirmRef.afterClosed().subscribe((confirmed) => {
      if (!confirmed) return;
      this.isSaving.set(true);
      const formattedDate = `${this.adjustDate.getFullYear()}-${String(
        this.adjustDate.getMonth() + 1,
      ).padStart(2, '0')}-${String(this.adjustDate.getDate()).padStart(2, '0')}`;
      this.transactionsService
        .postLoansLoanIdTransactionsTransactionId(this.data.loanId, this.data.transactionId, {
          transactionDate: formattedDate,
          transactionAmount: this.adjustAmount,
          note: this.adjustNote,
          dateFormat: DATE_FORMAT,
          locale: 'en',
        })
        .subscribe({
          next: () => {
            this.isSaving.set(false);
            this.dialogRef.close(true);
          },
          error: (err) => {
            console.error('Failed to adjust transaction', err);
            this.isSaving.set(false);
          },
        });
    });
  }
}
