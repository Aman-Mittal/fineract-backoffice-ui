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

import { inject, input, signal, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { DecimalPipe } from '@angular/common';
import { LOAN_TRANSACTION_API } from '../../core/adapters';
import type { LoanTransaction } from '../../core/adapters';
import { DialogService } from '../../core/services/dialog.service';
import {
  IonButton,
  IonDatetime,
  IonDatetimeButton,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonModal,
  IonTextarea,
  ModalController,
} from '@ionic/angular/standalone';
import { formatDateToFineract, toIsoDate } from '../../core/utils/date-formatter';

export interface TransactionDetailDialogData {
  loanId: number;
  transactionId: number;
  currencySymbol?: string;
  /** Whether this transaction type can be corrected via the adjust API — a
   *  business call made by the caller (e.g. repayment/goodwill credit yes,
   *  disbursement/approval no). */
  adjustable: boolean;
}

@Component({
  selector: 'app-transaction-detail-dialog',
  standalone: true,
  imports: [
    FormsModule,
    TranslatePipe,
    DecimalPipe,
    IonIcon,
    IonButton,
    IonInput,
    IonTextarea,
    IonItem,
    IonLabel,
    IonDatetime,
    IonDatetimeButton,
    IonModal,
  ],
  template: `
    <h2 class="dialog-title">{{ 'LOANS.TRANSACTION_DETAILS' | translate }}</h2>
    <div class="dialog-content">
      @if (detail(); as tx) {
        <table class="detail-table">
          <tr>
            <td class="label">{{ 'COMMON.TYPE' | translate }}</td>
            <td class="value">{{ tx.type.displayName }}</td>
          </tr>
          <tr>
            <td class="label">{{ 'COMMON.TRANSACTION_DATE' | translate }}</td>
            <td class="value">{{ displayDate(tx.date) }}</td>
          </tr>
          <tr>
            <td class="label">{{ 'COMMON.AMOUNT' | translate }}</td>
            <td class="value">{{ data().currencySymbol }}{{ tx.amount | number: '1.2-2' }}</td>
          </tr>
          <tr>
            <td class="label">
              {{ 'LOANS.REPAYMENT_SCHEDULE_HEADERS.PRINCIPAL_DUE' | translate }}
            </td>
            <td class="value">
              {{ data().currencySymbol }}{{ tx.principalPortion | number: '1.2-2' }}
            </td>
          </tr>
          <tr>
            <td class="label">{{ 'LOANS.REPAYMENT_SCHEDULE_HEADERS.INTEREST' | translate }}</td>
            <td class="value">
              {{ data().currencySymbol }}{{ tx.interestPortion | number: '1.2-2' }}
            </td>
          </tr>
          <tr>
            <td class="label">{{ 'LOANS.REPAYMENT_SCHEDULE_HEADERS.FEES' | translate }}</td>
            <td class="value">
              {{ data().currencySymbol }}{{ tx.feeChargesPortion | number: '1.2-2' }}
            </td>
          </tr>
          <tr>
            <td class="label">{{ 'LOANS.REPAYMENT_SCHEDULE_HEADERS.PENALTIES' | translate }}</td>
            <td class="value">
              {{ data().currencySymbol }}{{ tx.penaltyChargesPortion | number: '1.2-2' }}
            </td>
          </tr>
          @if (tx.receiptNumber) {
            <tr>
              <td class="label">{{ 'LOANS.RECEIPT_NUMBER' | translate }}</td>
              <td class="value">{{ tx.receiptNumber }}</td>
            </tr>
          }
          @if (tx.manuallyReversed) {
            <tr>
              <td class="label">{{ 'LOANS.REVERSED' | translate }}</td>
              <td class="value">{{ 'COMMON.YES' | translate }}</td>
            </tr>
          }
        </table>

        @if (data().adjustable && !tx.manuallyReversed) {
          @if (!showAdjustForm()) {
            <ion-button
              fill="outline"
              color="danger"
              class="adjust-toggle"
              (click)="showAdjustForm.set(true)"
            >
              <ion-icon name="create-outline"></ion-icon>
              {{ 'LOANS.ACTIONS.ADJUST_TRANSACTION' | translate }}
            </ion-button>
          } @else {
            <div class="adjust-form">
              <p class="adjust-warning">{{ 'LOANS.CONFIRM_ADJUST_TRANSACTION' | translate }}</p>
              <ion-item fill="outline">
                <ion-label position="stacked">{{
                  'COMMON.TRANSACTION_DATE' | translate
                }}</ion-label>
                <ion-datetime-button datetime="adjustDate-picker"></ion-datetime-button>
                <ion-modal [keepContentsMounted]="true">
                  <ng-template>
                    <ion-datetime
                      id="adjustDate-picker"
                      data-testid="adjustDate-picker"
                      presentation="date"
                      name="adjustDate"
                      [ngModel]="adjustDate()"
                      (ngModelChange)="adjustDate.set($event)"
                    ></ion-datetime>
                  </ng-template>
                </ion-modal>
              </ion-item>
              <ion-item fill="outline">
                <ion-label position="stacked">{{
                  'COMMON.TRANSACTION_AMOUNT' | translate
                }}</ion-label>
                <ion-input
                  [attr.aria-label]="'COMMON.TRANSACTION_AMOUNT' | translate"
                  type="number"
                  [ngModel]="adjustAmount()"
                  (ngModelChange)="adjustAmount.set($event)"
                  name="adjustAmount"
                ></ion-input>
              </ion-item>
              <ion-item fill="outline" class="full-width">
                <ion-label position="stacked">{{ 'COMMON.NOTE' | translate }}</ion-label>
                <ion-textarea
                  [attr.aria-label]="'COMMON.NOTE' | translate"
                  rows="2"
                  [(ngModel)]="adjustNote"
                  name="adjustNote"
                ></ion-textarea>
              </ion-item>
            </div>
          }
        }
      } @else {
        <p>{{ 'COMMON.LOADING' | translate }}</p>
      }
    </div>
    <div class="dialog-actions">
      <ion-button fill="clear" (click)="modalController.dismiss(false)">{{
        'COMMON.CLOSE' | translate
      }}</ion-button>
      @if (showAdjustForm()) {
        <ion-button color="danger" [disabled]="isSaving()" (click)="onConfirmAdjust()">
          {{ 'LOANS.ACTIONS.ADJUST_TRANSACTION' | translate }}
        </ion-button>
      }
    </div>
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
  readonly modalController = inject(ModalController);
  private readonly transactionApi = inject(LOAN_TRANSACTION_API);
  private readonly dialogService = inject(DialogService);
  private readonly translate = inject(TranslateService);

  readonly detail = signal<LoanTransaction | null>(null);
  readonly showAdjustForm = signal(false);
  readonly isSaving = signal(false);

  readonly adjustDate = signal(toIsoDate(new Date()));
  readonly adjustAmount = signal(0);
  adjustNote = '';

  readonly data = input.required<TransactionDetailDialogData>();

  ngOnInit(): void {
    this.transactionApi.get(this.data().loanId, this.data().transactionId).subscribe({
      next: (transaction) => {
        this.detail.set(transaction);
        this.adjustAmount.set(transaction.amount);
        // Already `YYYY-MM-DD`, which is what the picker binds to. Only moved when the
        // transaction has a date; otherwise today's default stands.
        if (transaction.date) this.adjustDate.set(transaction.date);
      },
      error: (err) => console.error('Failed to load transaction detail', err),
    });
  }

  /**
   * The transaction date as `02 October 2026`.
   *
   * `formatDateToFineract` rather than `toLocaleDateString()`, which this dialog used to call on
   * the raw `[year, month, day]` array. It reads a date-only string through its parts, so it does
   * not drift a day west of Greenwich the way `new Date('2026-10-02')` does — the hazard
   * `core/utils/date-formatter.ts` documents at length.
   */
  displayDate(date: string | null): string {
    return date === null ? '' : formatDateToFineract(date);
  }

  onConfirmAdjust(): void {
    this.dialogService
      .confirm({
        title: this.translate.instant('LOANS.ACTIONS.ADJUST_TRANSACTION'),
        message: this.translate.instant('LOANS.CONFIRM_ADJUST_TRANSACTION'),
        destructive: true,
      })
      .then((confirmed) => {
        if (!confirmed) return;
        this.isSaving.set(true);
        this.transactionApi
          .adjust(this.data().loanId, this.data().transactionId, {
            date: toIsoDate(this.adjustDate()),
            amount: this.adjustAmount(),
            note: this.adjustNote,
          })
          .subscribe({
            next: () => {
              this.isSaving.set(false);
              this.modalController.dismiss(true);
            },
            error: (err) => {
              console.error('Failed to adjust transaction', err);
              this.isSaving.set(false);
            },
          });
      });
  }
}
