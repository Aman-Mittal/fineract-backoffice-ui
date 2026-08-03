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

import { Component, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonCol,
  IonDatetime,
  IonDatetimeButton,
  IonGrid,
  IonInput,
  IonItem,
  IonLabel,
  IonModal,
  IonNote,
  IonRow,
  IonSelect,
  IonSelectOption,
  IonSpinner,
  IonTextarea,
} from '@ionic/angular/standalone';
import { TranslatePipe } from '../../../core/adapters';
import {
  CurrencyData,
  PostTellersTellerIdCashiersCashierIdAllocateRequest,
  TellerCashManagementService,
} from '../../../api';
import {
  FINERACT_DATE_FORMAT,
  FINERACT_LOCALE,
  formatDateToFineract,
} from '../../../core/utils/date-formatter';

/**
 * Which side of the vault the transaction moves cash to.
 *
 * The two Fineract commands take an identical payload and differ only in direction, so they
 * share this form rather than duplicating it. The value is the last URL segment, which keeps
 * the two reachable as distinct routes — an allocation and a settlement are separate entries
 * in the cashier's ledger and each deserves its own address.
 */
export type CashierTransactionCommand = 'allocate' | 'settle';

@Component({
  selector: 'app-cashier-transaction-form',
  standalone: true,
  imports: [
    FormsModule,
    TranslatePipe,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonGrid,
    IonRow,
    IonCol,
    IonItem,
    IonLabel,
    IonInput,
    IonNote,
    IonSelect,
    IonSelectOption,
    IonTextarea,
    IonButton,
    IonSpinner,
    IonDatetime,
    IonDatetimeButton,
    IonModal,
  ],
  template: `
    <div class="form-container">
      <ion-card>
        <ion-card-header>
          <ion-card-title data-testid="cashier-txn-title">
            {{ titleKey() | appTranslate }}
          </ion-card-title>
          @if (cashierName()) {
            <ion-note data-testid="cashier-txn-subtitle">
              {{ cashierName() }} &middot; {{ tellerName() }}
            </ion-note>
          }
        </ion-card-header>

        <ion-card-content>
          <form #txnForm="ngForm" (ngSubmit)="onSubmit()" class="cashier-txn-form">
            <ion-grid class="ion-no-padding">
              <ion-row>
                <ion-col size="12" size-md="6">
                  <ion-item fill="outline">
                    <ion-label position="stacked">{{ 'COMMON.CURRENCY' | appTranslate }}</ion-label>
                    <ion-select
                      [attr.aria-label]="'COMMON.CURRENCY' | appTranslate"
                      interface="popover"
                      name="currencyCode"
                      [(ngModel)]="currencyCode"
                      required
                      id="cashier-txn-currency-select"
                      data-testid="cashier-txn-currency-select"
                    >
                      @for (currency of currencies(); track currency.code) {
                        <ion-select-option [value]="currency.code">
                          {{ currency.displayLabel || currency.name }}
                        </ion-select-option>
                      }
                    </ion-select>
                  </ion-item>
                </ion-col>

                <ion-col size="12" size-md="6">
                  <ion-item fill="outline">
                    <ion-label position="stacked">{{ 'COMMON.AMOUNT' | appTranslate }}</ion-label>
                    <ion-input
                      [attr.aria-label]="'COMMON.AMOUNT' | appTranslate"
                      type="number"
                      name="txnAmount"
                      [(ngModel)]="txnAmount"
                      required
                      min="0"
                      id="cashier-txn-amount-input"
                      data-testid="cashier-txn-amount-input"
                    ></ion-input>
                  </ion-item>
                </ion-col>

                <ion-col size="12" size-md="6">
                  <ion-item fill="outline">
                    <ion-label position="stacked">{{ 'COMMON.DATE' | appTranslate }}</ion-label>
                    <ion-datetime-button datetime="cashier-txn-date-picker"></ion-datetime-button>
                    <ion-modal [keepContentsMounted]="true">
                      <ng-template>
                        <ion-datetime
                          id="cashier-txn-date-picker"
                          data-testid="cashier-txn-date-picker"
                          presentation="date"
                          (ionChange)="onDateChange($event)"
                        ></ion-datetime>
                      </ng-template>
                    </ion-modal>
                  </ion-item>
                </ion-col>

                <ion-col size="12">
                  <ion-item fill="outline" class="full-width">
                    <ion-label position="stacked">{{ 'COMMON.NOTE' | appTranslate }}</ion-label>
                    <ion-textarea
                      [attr.aria-label]="'COMMON.NOTE' | appTranslate"
                      name="txnNote"
                      [(ngModel)]="txnNote"
                      rows="2"
                      id="cashier-txn-note-textarea"
                      data-testid="cashier-txn-note-textarea"
                    ></ion-textarea>
                  </ion-item>
                </ion-col>
              </ion-row>
            </ion-grid>

            <div class="form-actions">
              <ion-button
                fill="clear"
                color="medium"
                type="button"
                (click)="onCancel()"
                [disabled]="isSaving()"
                id="cashier-txn-cancel-btn"
                data-testid="cashier-txn-cancel-btn"
              >
                {{ 'COMMON.CANCEL' | appTranslate }}
              </ion-button>
              <ion-button
                color="primary"
                type="submit"
                [disabled]="txnForm.invalid || isSaving()"
                id="cashier-txn-submit-btn"
                data-testid="cashier-txn-submit-btn"
              >
                @if (isSaving()) {
                  <ion-spinner name="crescent" slot="start"></ion-spinner>
                  {{ 'COMMON.SAVING' | appTranslate }}
                } @else {
                  {{ submitLabelKey() | appTranslate }}
                }
              </ion-button>
            </div>
          </form>
        </ion-card-content>
      </ion-card>
    </div>
  `,
})
export class CashierTransactionFormComponent {
  private readonly tellerService = inject(TellerCashManagementService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  private readonly tellerId = signal(0);
  private readonly cashierId = signal(0);
  private readonly command = signal<CashierTransactionCommand>('allocate');

  readonly isSaving = signal(false);
  readonly currencies = signal<CurrencyData[]>([]);
  readonly cashierName = signal('');
  readonly tellerName = signal('');

  readonly titleKey = computed(() =>
    this.command() === 'settle' ? 'TELLERS.SETTLE_CASH' : 'TELLERS.ALLOCATE_CASH',
  );
  readonly submitLabelKey = computed(() =>
    this.command() === 'settle' ? 'TELLERS.SETTLE' : 'TELLERS.ALLOCATE',
  );

  currencyCode = '';
  txnAmount: number | null = null;
  txnNote = '';
  txnDate: Date = new Date();

  constructor() {
    this.route.params.pipe(takeUntilDestroyed()).subscribe((params) => {
      this.tellerId.set(+params['tellerId']);
      this.cashierId.set(+params['cashierId']);
      this.command.set(params['command'] === 'settle' ? 'settle' : 'allocate');
      this.loadTemplate();
    });
  }

  /**
   * Loads the currencies this cashier may transact in, and who they are.
   *
   * The currency list is not the organisation's full set: Fineract scopes it to the teller's
   * office, and posting a code outside it is rejected. Reading it from the template is what
   * keeps the dropdown from offering a choice the submit would refuse.
   */
  private loadTemplate(): void {
    this.tellerService
      .getTellersTellerIdCashiersCashierIdTransactionsTemplate(this.tellerId(), this.cashierId())
      .subscribe({
        next: (template) => {
          const options = template.currencyOptions ?? [];
          this.currencies.set(options);
          this.cashierName.set(template.cashierName ?? '');
          this.tellerName.set(template.tellerName ?? '');
          // Preselect when there is no decision to make. Leaving a single-option dropdown empty
          // makes the form invalid for a field the user cannot meaningfully change.
          if (options.length === 1) this.currencyCode = options[0].code ?? '';
        },
        error: () => this.currencies.set([]),
      });
  }

  onDateChange(event: CustomEvent): void {
    const value = (event.detail as { value?: string }).value;
    if (value) this.txnDate = new Date(value);
  }

  onSubmit(): void {
    this.isSaving.set(true);

    // `formatDateToFineract` zero-pads the day to match FINERACT_DATE_FORMAT's `dd`. Fineract
    // parses strictly against the declared format, so an unpadded day fails to parse and the
    // request comes back 500 rather than as a validation message.
    const payload: PostTellersTellerIdCashiersCashierIdAllocateRequest = {
      currencyCode: this.currencyCode,
      txnAmount: Number(this.txnAmount),
      txnDate: formatDateToFineract(this.txnDate),
      txnNote: this.txnNote,
      dateFormat: FINERACT_DATE_FORMAT,
      locale: FINERACT_LOCALE,
    };

    const request =
      this.command() === 'settle'
        ? this.tellerService.postTellersTellerIdCashiersCashierIdSettle(
            this.tellerId(),
            this.cashierId(),
            payload,
          )
        : this.tellerService.postTellersTellerIdCashiersCashierIdAllocate(
            this.tellerId(),
            this.cashierId(),
            payload,
          );

    request.subscribe({
      next: () => this.navigateToTransactions(),
      error: () => this.isSaving.set(false),
    });
  }

  onCancel(): void {
    this.navigateToTransactions();
  }

  private navigateToTransactions(): void {
    void this.router.navigate([
      '/tellers',
      this.tellerId(),
      'cashiers',
      this.cashierId(),
      'transactions',
    ]);
  }
}
