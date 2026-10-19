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
 * Deposit form for a single fixed deposit account. The account id is read from the route.
 *
 * Deposit only, deliberately. A fixed deposit refuses a withdrawal —
 * `POST /fixeddepositaccounts/{id}/transactions?command=withdrawal` answers `503`
 * `error.msg.fixeddepositaccount.account.trasaction.withdraw.notallowed` — so unlike its
 * recurring-deposit twin this form has no command to switch on. Money leaves a fixed deposit
 * through maturity or premature closure, both of which live on the account's own action menu.
 */
@Component({
  selector: 'app-fixed-deposit-transaction-form',
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
            {{ 'FIXED_DEPOSIT_TRANSACTIONS.DEPOSIT' | appTranslate }}
          </ion-card-title>
        </ion-card-header>

        <ion-card-content>
          <form #transactionForm="ngForm" (ngSubmit)="onSubmit()" class="fd-form">
            <ion-item fill="outline">
              <ion-label position="stacked">{{
                'FIXED_DEPOSIT_TRANSACTIONS.DATE' | appTranslate
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
                'FIXED_DEPOSIT_TRANSACTIONS.AMOUNT' | appTranslate
              }}</ion-label>
              <ion-input
                [attr.aria-label]="'FIXED_DEPOSIT_TRANSACTIONS.AMOUNT' | appTranslate"
                type="number"
                name="transactionAmount"
                data-testid="fd-transaction-amount"
                [(ngModel)]="transactionAmount"
                required
              ></ion-input>
            </ion-item>

            <ion-item fill="outline">
              <ion-label position="stacked">{{
                'FIXED_DEPOSIT_TRANSACTIONS.PAYMENT_TYPE' | appTranslate
              }}</ion-label>
              <ion-select
                [attr.aria-label]="'FIXED_DEPOSIT_TRANSACTIONS.PAYMENT_TYPE' | appTranslate"
                interface="popover"
                name="paymentTypeId"
                [(ngModel)]="paymentTypeId"
              >
                @for (option of paymentTypeOptions(); track option.id) {
                  <ion-select-option [value]="option.id">{{ option.name }}</ion-select-option>
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
                data-testid="fd-transaction-save"
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
      .fd-form {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }
      .form-actions {
        display: flex;
        justify-content: flex-end;
        gap: 8px;
      }
    `,
  ],
})
export class FixedDepositTransactionFormComponent implements OnInit {
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
  readonly isSaving = signal(false);

  transactionDate = this.platformDate.today();
  transactionAmount: number | null = null;
  paymentTypeId: number | null = null;
  readonly paymentTypeOptions = signal<DepositPaymentType[]>([]);

  ngOnInit(): void {
    this.accountId = Number(this.route.snapshot.paramMap.get('accountId'));
    this.deposits.transactionTemplate('fixed', this.accountId, 'deposit').subscribe({
      next: (template) => this.paymentTypeOptions.set([...template.paymentTypes]),
      error: () => this.paymentTypeOptions.set([]),
    });
  }

  /**
   * Posts the deposit.
   *
   * `paymentTypeId` is sent although the documented request does not name it: the platform
   * accepts it and echoes it back under `changes`, measured against a running Fineract, so the
   * teller's choice of payment channel reaches the ledger. How the request is carried — this
   * operation's body is typed `string` and its arguments are in a different order from the
   * recurring twin's — is the adapter's business now.
   */
  onSubmit(): void {
    this.isSaving.set(true);
    const request: Record<string, unknown> = {
      transactionDate: formatDateToFineract(this.transactionDate),
      transactionAmount: this.transactionAmount ?? undefined,
      paymentTypeId: this.paymentTypeId ?? undefined,
      dateFormat: FINERACT_DATE_FORMAT,
      locale: FINERACT_LOCALE,
    };

    this.deposits.postTransaction('fixed', this.accountId, 'deposit', request).subscribe({
      next: (response) => {
        this.isSaving.set(false);
        this.mutationOutcome.complete({
          response,
          successMessage: this.i18n.translate('SAVINGS.TRANSACTION_SUCCESS'),
          recordRoute: (id) => ['/products/fixed-deposits/view', id],
          recordId: this.accountId,
        });
      },
      error: () => this.isSaving.set(false),
    });
  }

  onCancel(): void {
    void this.router.navigate(['/products/fixed-deposits/view', this.accountId]);
  }
}
