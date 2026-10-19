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
import { PlatformDateService } from '../../../core/services/platform-date.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MutationOutcomeService } from '../../../core/services/mutation-outcome.service';
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
  DEPOSIT_ACCOUNT_API,
  I18N,
  TranslatePipe,
  type DepositPaymentType,
} from '../../../core/adapters';
import {
  formatDateToFineract,
  FINERACT_DATE_FORMAT,
  FINERACT_LOCALE,
} from '../../../core/utils/date-formatter';
import { createPickersReady } from '../../../shared/utils/pickers-ready';

/**
 * Transaction form for a single recurring deposit account. The account id and command are read
 * from the route. Payment-type options come from the transaction template endpoint.
 */
@Component({
  selector: 'app-recurring-deposit-transaction-form',
  standalone: true,
  imports: [
    FormsModule,
    TranslatePipe,
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
            {{
              (command() === 'withdrawal'
                ? 'SAVINGS.WITHDRAWAL'
                : 'RECURRING_DEPOSIT_TRANSACTIONS.CREATE'
              ) | appTranslate
            }}
          </ion-card-title>
        </ion-card-header>

        <ion-card-content>
          <form #transactionForm="ngForm" (ngSubmit)="onSubmit()" class="rd-form">
            <ion-item fill="outline">
              <ion-label position="stacked">{{
                'RECURRING_DEPOSIT_TRANSACTIONS.DATE' | appTranslate
              }}</ion-label>
              @if (pickersReady()) {
                <ion-datetime-button datetime="transactionDate-picker"></ion-datetime-button>
              }
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
                'RECURRING_DEPOSIT_TRANSACTIONS.AMOUNT' | appTranslate
              }}</ion-label>
              <ion-input
                [attr.aria-label]="'RECURRING_DEPOSIT_TRANSACTIONS.AMOUNT' | appTranslate"
                type="number"
                name="transactionAmount"
                [(ngModel)]="transactionAmount"
                required
              ></ion-input>
            </ion-item>

            <ion-item fill="outline">
              <ion-label position="stacked">{{
                'RECURRING_DEPOSIT_TRANSACTIONS.PAYMENT_TYPE' | appTranslate
              }}</ion-label>
              <ion-select
                [attr.aria-label]="'RECURRING_DEPOSIT_TRANSACTIONS.PAYMENT_TYPE' | appTranslate"
                interface="popover"
                name="paymentTypeId"
                [(ngModel)]="paymentTypeId"
              >
                @for (opt of paymentTypeOptions(); track opt.id) {
                  <ion-select-option [value]="opt.id">{{ opt.name }}</ion-select-option>
                }
              </ion-select>
            </ion-item>

            <div class="form-actions">
              <ion-button fill="clear" type="button" (click)="onCancel()" [disabled]="isSaving()">
                {{ 'COMMON.CANCEL' | appTranslate }}
              </ion-button>
              <ion-button
                color="primary"
                type="submit"
                [disabled]="transactionForm.invalid || isSaving()"
              >
                @if (isSaving()) {
                  <ion-spinner name="crescent"></ion-spinner>
                  {{ 'COMMON.SAVING' | appTranslate }}
                } @else {
                  {{ 'COMMON.SAVE' | appTranslate }}
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
  /** See `createPickersReady` — the date buttons must not outrun their pickers. */
  readonly pickersReady = createPickersReady();

  private readonly deposits = inject(DEPOSIT_ACCOUNT_API);
  private readonly route = inject(ActivatedRoute);
  /**
   * Today, as the platform reckons it: the business date when one governs, and the platform's
   * own clock otherwise. Fineract judges "the future" by that reckoning, so a date seeded from
   * `new Date()` is refused whenever the browser runs ahead of it (#758).
   */
  private readonly platformDate = inject(PlatformDateService);
  private readonly router = inject(Router);
  private readonly mutationOutcome = inject(MutationOutcomeService);
  private readonly i18n = inject(I18N);

  accountId!: number;
  readonly command = signal<'deposit' | 'withdrawal'>('deposit');
  readonly isSaving = signal(false);

  transactionDate = this.platformDate.today();
  transactionAmount: number | null = null;
  paymentTypeId: number | null = null;
  readonly paymentTypeOptions = signal<DepositPaymentType[]>([]);

  ngOnInit(): void {
    this.accountId = Number(this.route.snapshot.paramMap.get('accountId'));
    const command = this.route.snapshot.paramMap.get('command');
    this.command.set(command === 'withdrawal' ? 'withdrawal' : 'deposit');
    // The command is part of this request, not an optional extra: measured, the recurring
    // template answers 400 without it, which left this list empty on every load.
    this.deposits.transactionTemplate('recurring', this.accountId, this.command()).subscribe({
      next: (template) => this.paymentTypeOptions.set([...template.paymentTypes]),
      error: () => this.paymentTypeOptions.set([]),
    });
  }

  onSubmit(): void {
    this.isSaving.set(true);
    const request: Record<string, unknown> = {
      transactionDate: formatDateToFineract(this.transactionDate),
      transactionAmount: this.transactionAmount ?? undefined,
      paymentTypeId: this.paymentTypeId ?? undefined,
      dateFormat: FINERACT_DATE_FORMAT,
      locale: FINERACT_LOCALE,
    };

    this.deposits.postTransaction('recurring', this.accountId, this.command(), request).subscribe({
      next: (response) => {
        this.isSaving.set(false);
        this.mutationOutcome.complete({
          response,
          successMessage: this.i18n.translate('SAVINGS.TRANSACTION_SUCCESS'),
          recordRoute: (id) => ['/products/recurring-deposits/view', id],
          recordId: this.accountId,
        });
      },
      error: () => this.isSaving.set(false),
    });
  }

  onCancel(): void {
    void this.router.navigate(['/products/recurring-deposits/view', this.accountId]);
  }
}
