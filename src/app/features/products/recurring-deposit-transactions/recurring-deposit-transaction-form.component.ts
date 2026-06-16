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
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {
  RecurringDepositAccountTransactionsService,
  PostRecurringDepositAccountsRecurringDepositAccountIdTransactionsRequest,
} from '../../../api';
import {
  formatDateToFineract,
  FINERACT_DATE_FORMAT,
  FINERACT_LOCALE,
} from '../../../core/utils/date-formatter';

/**
 * Deposit form for a single recurring deposit account. The account id is read from the route.
 * Payment-type options come from the transaction template endpoint; the form posts a deposit
 * against the account's transaction collection.
 */
@Component({
  selector: 'app-recurring-deposit-transaction-form',
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
    MatProgressSpinnerModule,
  ],
  template: `
    <div class="form-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>
            {{ 'RECURRING_DEPOSIT_TRANSACTIONS.CREATE' | translate }}
          </mat-card-title>
        </mat-card-header>

        <mat-card-content>
          <form #transactionForm="ngForm" (ngSubmit)="onSubmit()" class="rd-form">
            <mat-form-field appearance="outline">
              <mat-label>{{ 'RECURRING_DEPOSIT_TRANSACTIONS.DATE' | translate }}</mat-label>
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

            <mat-form-field appearance="outline">
              <mat-label>{{ 'RECURRING_DEPOSIT_TRANSACTIONS.AMOUNT' | translate }}</mat-label>
              <input
                matInput
                type="number"
                name="transactionAmount"
                [(ngModel)]="transactionAmount"
                required
              />
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>{{ 'RECURRING_DEPOSIT_TRANSACTIONS.PAYMENT_TYPE' | translate }}</mat-label>
              <mat-select name="paymentTypeId" [(ngModel)]="paymentTypeId">
                @for (opt of paymentTypeOptions; track opt) {
                  <mat-option [value]="opt">{{ opt }}</mat-option>
                }
              </mat-select>
            </mat-form-field>

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
        max-width: 600px;
        margin: 0 auto;
      }
      .rd-form {
        display: flex;
        flex-direction: column;
        gap: 16px;
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
export class RecurringDepositTransactionFormComponent implements OnInit {
  private readonly transactionsService = inject(RecurringDepositAccountTransactionsService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  accountId!: number;
  isSaving = false;

  transactionDate: Date = new Date();
  transactionAmount: number | null = null;
  paymentTypeId: number | null = null;
  paymentTypeOptions: number[] = [];

  ngOnInit(): void {
    this.accountId = Number(this.route.snapshot.paramMap.get('accountId'));
    this.transactionsService
      .getRecurringdepositaccountsRecurringDepositAccountIdTransactionsTemplate(this.accountId)
      .subscribe((tpl) => {
        this.paymentTypeOptions = tpl.paymentTypeOptions ?? [];
      });
  }

  onSubmit(): void {
    this.isSaving = true;
    const request: PostRecurringDepositAccountsRecurringDepositAccountIdTransactionsRequest = {
      transactionDate: formatDateToFineract(this.transactionDate),
      transactionAmount: this.transactionAmount ?? undefined,
      paymentTypeId: this.paymentTypeId ?? undefined,
      dateFormat: FINERACT_DATE_FORMAT,
      locale: FINERACT_LOCALE,
    };

    this.transactionsService
      .postRecurringdepositaccountsRecurringDepositAccountIdTransactions(this.accountId, request)
      .subscribe({
        next: () =>
          this.router.navigate(['/products/recurring-deposits', this.accountId, 'transactions']),
        error: () => (this.isSaving = false),
      });
  }

  onCancel(): void {
    this.router.navigate(['/products/recurring-deposits', this.accountId, 'transactions']);
  }
}
