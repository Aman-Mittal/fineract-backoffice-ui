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

import { Component, inject, input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  IonButton,
  IonDatetime,
  IonDatetimeButton,
  IonInput,
  IonItem,
  IonLabel,
  IonModal,
  IonTextarea,
} from '@ionic/angular/standalone';

import { OVERLAY, TranslatePipe } from '../../core/adapters';
import { toIsoDate } from '../../core/utils/date-formatter';

export interface LoanDisburseToSavingsData {
  /** Defaults the amount, so the common case is a single click. */
  amount?: number;
  currency?: string;
}

export interface LoanDisburseToSavingsResult {
  actualDisbursementDate: string;
  transactionAmount: number;
  note?: string;
}

/**
 * Collects what `disbursetosavings` needs: the date the money moved and how much.
 *
 * There is deliberately no savings-account picker. The destination is the savings account
 * linked to the loan when the application was made, not something chosen at disbursement —
 * the platform refuses the command outright on a loan without one, answering
 * "requires linked savings account for payment". Offering a picker would imply a choice that
 * does not exist.
 */
@Component({
  selector: 'app-loan-disburse-to-savings-dialog',
  standalone: true,
  imports: [
    FormsModule,
    TranslatePipe,
    IonButton,
    IonItem,
    IonLabel,
    IonInput,
    IonTextarea,
    IonDatetime,
    IonDatetimeButton,
    IonModal,
  ],
  template: `
    <h2 class="dialog-title">{{ 'LOANS.ACTIONS.DISBURSE_TO_SAVINGS' | appTranslate }}</h2>
    <div class="dialog-content">
      <ion-item fill="outline" class="full-width">
        <ion-label position="stacked">{{ 'LOANS.DISBURSEMENT_DATE' | appTranslate }}</ion-label>
        <ion-datetime-button datetime="disburse-to-savings-date"></ion-datetime-button>
        <ion-modal [keepContentsMounted]="true">
          <ng-template>
            <ion-datetime
              id="disburse-to-savings-date"
              data-testid="disburse-to-savings-date"
              presentation="date"
              name="actualDisbursementDate"
              [ngModel]="disbursementDate()"
              (ngModelChange)="disbursementDate.set($event)"
              required
            ></ion-datetime>
          </ng-template>
        </ion-modal>
      </ion-item>

      <ion-item fill="outline" class="full-width">
        <ion-label position="stacked">{{ 'COMMON.AMOUNT' | appTranslate }}</ion-label>
        <ion-input
          type="number"
          name="transactionAmount"
          data-testid="disburse-to-savings-amount"
          [attr.aria-label]="'COMMON.AMOUNT' | appTranslate"
          [ngModel]="amount()"
          (ngModelChange)="amount.set($event)"
          required
        ></ion-input>
      </ion-item>

      <ion-item fill="outline" class="full-width">
        <ion-label position="stacked">{{ 'COMMON.NOTE' | appTranslate }}</ion-label>
        <ion-textarea
          name="note"
          data-testid="disburse-to-savings-note"
          rows="2"
          [ngModel]="note()"
          (ngModelChange)="note.set($event)"
        ></ion-textarea>
      </ion-item>
    </div>
    <div class="dialog-actions">
      <ion-button fill="clear" color="medium" (click)="onCancel()">
        {{ 'COMMON.CANCEL' | appTranslate }}
      </ion-button>
      <ion-button
        color="primary"
        data-testid="disburse-to-savings-confirm"
        [disabled]="!isValid()"
        (click)="onConfirm()"
      >
        {{ 'COMMON.CONFIRM' | appTranslate }}
      </ion-button>
    </div>
  `,
  styles: [
    `
      .dialog-content {
        display: flex;
        flex-direction: column;
        gap: 16px;
        padding-top: 8px;
        min-width: 350px;
      }
      .full-width {
        width: 100%;
      }
    `,
  ],
})
export class LoanDisburseToSavingsDialogComponent {
  private readonly overlay = inject(OVERLAY);

  readonly data = input<LoanDisburseToSavingsData>({});

  readonly disbursementDate = signal(toIsoDate(new Date()));
  readonly amount = signal<number | null>(null);
  readonly note = signal('');

  constructor() {
    // The loan's own principal is what is normally disbursed, so it is offered rather than
    // demanded — but it stays editable, because a tranche is not the whole principal.
    queueMicrotask(() => this.amount.set(this.data().amount ?? null));
  }

  isValid(): boolean {
    const amount = this.amount();
    return !!this.disbursementDate() && amount !== null && Number(amount) > 0;
  }

  onCancel(): void {
    void this.overlay.dismissModal();
  }

  onConfirm(): void {
    if (!this.isValid()) return;
    const note = this.note().trim();
    void this.overlay.dismissModal<LoanDisburseToSavingsResult>({
      actualDisbursementDate: this.disbursementDate(),
      transactionAmount: Number(this.amount()),
      ...(note ? { note } : {}),
    });
  }
}
