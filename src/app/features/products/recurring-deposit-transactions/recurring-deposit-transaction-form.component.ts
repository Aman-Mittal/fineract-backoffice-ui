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
} from '@ionic/angular/standalone';
import {
  RecurringDepositAccountTransactionsService,
  PostRecurringDepositAccountsRecurringDepositAccountIdTransactionsRequest,
} from '../../../api';
import {
  formatDateToFineract,
  FINERACT_DATE_FORMAT,
  FINERACT_LOCALE,
  toIsoDate,
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
    MatFormFieldModule,
    MatInputModule,
    IonButton,
    IonSpinner,
    IonInput,
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
          <ion-card-title>
            {{ 'RECURRING_DEPOSIT_TRANSACTIONS.CREATE' | translate }}
          </ion-card-title>
        </ion-card-header>

        <ion-card-content>
          <form #transactionForm="ngForm" (ngSubmit)="onSubmit()" class="rd-form">
            <ion-item fill="outline">
              <ion-label position="stacked">{{
                'RECURRING_DEPOSIT_TRANSACTIONS.DATE' | translate
              }}</ion-label>
              <ion-datetime-button datetime="transactionDate-picker"></ion-datetime-button>
              <ion-modal [keepContentsMounted]="true">
                <ng-template>
                  <ion-datetime
                    id="transactionDate-picker"
                    data-testid="transactionDate-picker"
                    presentation="date"
                    name="transactionDate"
                    [(ngModel)]="transactionDate"
                    required
                  ></ion-datetime>
                </ng-template>
              </ion-modal>
            </ion-item>

            <ion-item fill="outline">
              <ion-label position="stacked">{{
                'RECURRING_DEPOSIT_TRANSACTIONS.AMOUNT' | translate
              }}</ion-label>
              <ion-input
                type="number"
                name="transactionAmount"
                [(ngModel)]="transactionAmount"
                required
              ></ion-input>
            </ion-item>

            <ion-item fill="outline">
              <ion-label position="stacked">{{
                'RECURRING_DEPOSIT_TRANSACTIONS.PAYMENT_TYPE' | translate
              }}</ion-label>
              <ion-select name="paymentTypeId" [(ngModel)]="paymentTypeId">
                @for (opt of paymentTypeOptions; track opt) {
                  <ion-select-option [value]="opt">{{ opt }}</ion-select-option>
                }
              </ion-select>
            </ion-item>

            <div class="form-actions">
              <ion-button fill="clear" type="button" (click)="onCancel()" [disabled]="isSaving">
                {{ 'COMMON.CANCEL' | translate }}
              </ion-button>
              <ion-button
                color="primary"
                type="submit"
                [disabled]="transactionForm.invalid || isSaving"
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
        max-width: 600px;
        margin: 0 auto;
      }
      .rd-form {
        display: flex;
        flex-direction: column;
        gap: 16px;
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

  transactionDate = toIsoDate(new Date());
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
