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

import { Component, inject, input, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { GetPaymentTypeOptions, LoanTransactionsService } from '../../api';
import { OVERLAY, TranslatePipe } from '../../core/adapters';
import { ButtonComponent } from '../../ui/button/button.component';

export interface LoanChargebackData {
  loanId: number;
  transactionId: number;
  /** The repayment being charged back; also the most the platform will allow. */
  amount: number;
  currencySymbol?: string;
}

export interface LoanChargebackResult {
  transactionAmount: number;
  paymentTypeId?: number;
}

/** The payment type Fineract ships for exactly this correction. */
const CHARGEBACK_PAYMENT_TYPE_CODE = 'REPAYMENT_ADJUSTMENT_CHARGEBACK';

/**
 * Collects what a chargeback needs: how much of the repayment to take back, and the payment
 * type to record it under.
 *
 * A chargeback is only accepted against a specific transaction, so this opens from a row on the
 * Transactions tab rather than from the loan's Actions menu. It does not reverse the repayment —
 * the platform records a separate `Chargeback` transaction that puts the amount back on the
 * balance, and rejects the command when the amount exceeds what is left of the repayment. That
 * check is the platform's; the amount is prefilled with the full repayment and left editable
 * because a partial chargeback is a legitimate correction.
 */
@Component({
  selector: 'app-loan-chargeback-dialog',
  standalone: true,
  imports: [FormsModule, TranslatePipe, ButtonComponent],
  template: `
    <h2 class="dialog-title">{{ 'LOANS.ACTIONS.CHARGEBACK' | appTranslate }}</h2>
    <div class="dialog-content">
      <p class="dialog-message">{{ 'LOANS.CONFIRM_CHARGEBACK' | appTranslate }}</p>

      <div class="form-field">
        <label for="chargeback-amount">
          {{ 'COMMON.TRANSACTION_AMOUNT' | appTranslate }}
          @if (data().currencySymbol) {
            ({{ data().currencySymbol }})
          }
        </label>
        <input
          id="chargeback-amount"
          type="number"
          name="transactionAmount"
          data-testid="chargeback-amount"
          min="0"
          step="any"
          [ngModel]="amount()"
          (ngModelChange)="amount.set($event)"
          required
        />
      </div>

      <div class="form-field">
        <label for="chargeback-payment-type">{{ 'COMMON.PAYMENT_TYPE' | appTranslate }}</label>
        <select
          id="chargeback-payment-type"
          name="paymentTypeId"
          data-testid="chargeback-payment-type"
          [ngModel]="paymentTypeId()"
          (ngModelChange)="paymentTypeId.set($event)"
        >
          @for (type of paymentTypes(); track type.id) {
            <option [ngValue]="type.id">{{ type.name }}</option>
          }
        </select>
      </div>
    </div>
    <div class="dialog-actions">
      <app-button type="button" emphasis="quiet" intent="neutral" (click)="onCancel()">
        {{ 'COMMON.CANCEL' | appTranslate }}
      </app-button>
      <app-button
        type="button"
        intent="danger"
        data-testid="chargeback-confirm"
        [disabled]="!isValid()"
        (click)="onConfirm()"
      >
        {{ 'LOANS.ACTIONS.CHARGEBACK' | appTranslate }}
      </app-button>
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
      .dialog-message {
        margin: 0;
      }
    `,
  ],
})
export class LoanChargebackDialogComponent implements OnInit {
  private readonly overlay = inject(OVERLAY);
  private readonly transactionsService = inject(LoanTransactionsService);

  readonly data = input.required<LoanChargebackData>();

  readonly amount = signal<number | null>(null);
  readonly paymentTypeId = signal<number | undefined>(undefined);
  readonly paymentTypes = signal<GetPaymentTypeOptions[]>([]);

  ngOnInit(): void {
    this.amount.set(this.data().amount);

    // The transaction template is where the platform lists the enabled payment types; there is
    // no chargeback template to ask (it answers "unsupported value"), so the repayment one serves.
    this.transactionsService
      .getLoansLoanIdTransactionsTemplate(this.data().loanId, 'repayment')
      .subscribe({
        next: (template) => {
          const options = template.paymentTypeOptions ?? [];
          this.paymentTypes.set(options);
          const shipped = options.find(
            (o) => (o as { codeName?: string }).codeName === CHARGEBACK_PAYMENT_TYPE_CODE,
          );
          this.paymentTypeId.set(shipped?.id);
        },
        // Payment type is optional to the command; the dialog still works without the list.
        error: () => undefined,
      });
  }

  isValid(): boolean {
    const amount = this.amount();
    return amount !== null && Number(amount) > 0;
  }

  onCancel(): void {
    void this.overlay.dismissModal();
  }

  onConfirm(): void {
    if (!this.isValid()) return;
    const paymentTypeId = this.paymentTypeId();
    void this.overlay.dismissModal<LoanChargebackResult>({
      transactionAmount: Number(this.amount()),
      ...(paymentTypeId !== undefined ? { paymentTypeId } : {}),
    });
  }
}
