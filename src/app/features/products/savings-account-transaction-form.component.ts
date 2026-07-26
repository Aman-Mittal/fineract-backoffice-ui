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
import { NotificationService } from '../../core/services/notification.service';
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
import { toIsoDate } from '../../core/utils/date-formatter';
import {
  SavingsAccountTransactionsService,
  PostSavingsAccountTransactionsRequest,
} from '../../api';

@Component({
  selector: 'app-savings-account-transaction-form',
  standalone: true,
  imports: [
    FormsModule,
    TranslateModule,
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
          <ion-card-title>
            {{
              command === 'deposit'
                ? ('SAVINGS.DEPOSIT' | translate)
                : ('SAVINGS.WITHDRAWAL' | translate)
            }}
          </ion-card-title>
        </ion-card-header>

        <ion-card-content>
          <form #transactionForm="ngForm" (ngSubmit)="onSubmit()" class="transaction-form">
            <div class="form-grid">
              <!-- Transaction Date -->
              <ion-item fill="outline" [attr.title]="'HELP.TRANSACTION_DATE_DESC' | translate">
                <ion-label position="stacked">{{
                  'COMMON.TRANSACTION_DATE' | translate
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

              <!-- Transaction Amount -->
              <ion-item fill="outline" [attr.title]="'HELP.TRANSACTION_AMOUNT_DESC' | translate">
                <ion-label position="stacked">{{
                  'COMMON.TRANSACTION_AMOUNT' | translate
                }}</ion-label>
                <ion-input
                  type="number"
                  name="transactionAmount"
                  [(ngModel)]="transaction.transactionAmount"
                  required
                ></ion-input>
              </ion-item>

              <!-- Payment Type -->
              <ion-item fill="outline" [attr.title]="'HELP.PAYMENT_TYPE_DESC' | translate">
                <ion-label position="stacked">{{ 'COMMON.PAYMENT_TYPE' | translate }}</ion-label>
                <ion-select name="paymentTypeId" [(ngModel)]="transaction.paymentTypeId">
                  @for (type of paymentTypeOptions; track type['id']) {
                    <ion-select-option [value]="type['id']">{{ type['name'] }}</ion-select-option>
                  }
                </ion-select>
              </ion-item>

              <!-- Note -->
              <ion-item
                fill="outline"
                [attr.title]="'HELP.NOTE_DESC' | translate"
                class="full-width"
              >
                <ion-label position="stacked">{{ 'COMMON.NOTE' | translate }}</ion-label>
                <ion-textarea name="note" [(ngModel)]="note" rows="3"></ion-textarea>
              </ion-item>
            </div>

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
export class SavingsAccountTransactionFormComponent implements OnInit {
  private readonly transactionService = inject(SavingsAccountTransactionsService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly notifications = inject(NotificationService);

  accountId = 0;
  command = '';
  isSaving = false;

  transaction: PostSavingsAccountTransactionsRequest = {};
  /** Note bound separately as it might not be in the direct model */
  note = '';
  transactionDate = toIsoDate(new Date());
  paymentTypeOptions: Record<string, unknown>[] = [];

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.accountId = +params['accountId'];
      this.command = params['command'];
      this.loadTemplate();
    });
  }

  private loadTemplate(): void {
    this.transactionService
      .getSavingsaccountsSavingsIdTransactionsTemplate(this.accountId)
      .subscribe({
        next: (template: string) => {
          // Handle template parsing if necessary (OpenAPI sometimes returns generic string/any)
          const data = typeof template === 'string' ? JSON.parse(template) : template;
          this.paymentTypeOptions = data.paymentTypeOptions || [];
          if (data.date) {
            this.transactionDate = toIsoDate(
              new Date(data.date[0], data.date[1] - 1, data.date[2]),
            );
          }
        },
        error: () => {
          this.notifications.error('Operation failed. Please try again.');
        },
      });
  }

  onSubmit(): void {
    this.isSaving = true;

    const formattedDate = toIsoDate(this.transactionDate);

    this.transaction.transactionDate = formattedDate;
    this.transaction.dateFormat = 'yyyy-MM-dd';
    this.transaction.locale = 'en';

    // Incorporate note into payload
    const payload: Record<string, unknown> = {
      ...this.transaction,
      note: this.note,
    };

    this.transactionService
      .postSavingsaccountsSavingsIdTransactions(
        this.accountId,
        payload as PostSavingsAccountTransactionsRequest,
        this.command,
      )
      .subscribe({
        next: () => this.router.navigate(['/products/savings-accounts']),
        error: () => (this.isSaving = false),
      });
  }

  onCancel(): void {
    this.router.navigate(['/products/savings-accounts']);
  }
}
