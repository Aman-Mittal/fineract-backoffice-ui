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
  IonInput,
  IonItem,
  IonLabel,
  IonSelect,
  IonSelectOption,
} from '@ionic/angular/standalone';

import { CodeValuesService, GetCodeValuesDataResponse } from '../../api';
import { OVERLAY, TranslatePipe } from '../../core/adapters';

export interface SavingsBlockDialogData {
  /**
   * Collect an amount as well as a reason.
   *
   * Holding funds and blocking an account both name a reason from the same code list; a hold
   * additionally ring-fences a sum. Keeping them in one dialog keeps that lookup in one place.
   */
  withAmount?: boolean;
  /** Title key for the action being confirmed. */
  titleKey: string;
  /** Plain-language description of what the block does. */
  messageKey: string;
  /**
   * The Fineract code list the reason comes from.
   *
   * Each block type draws from its own list — `SavingsAccountBlockReasons`,
   * `DebitTransactionFreezeReasons` and `CreditTransactionFreezeReasons` — so this cannot be a
   * single shared lookup.
   */
  codeName: string;
}

export interface SavingsBlockResult {
  reasonForBlock: number;
  /** Present only when the dialog was opened with `withAmount`. */
  transactionAmount?: number;
}

@Component({
  selector: 'app-savings-block-dialog',
  standalone: true,
  imports: [
    FormsModule,
    TranslatePipe,
    IonInput,
    IonItem,
    IonLabel,
    IonSelect,
    IonSelectOption,
    IonButton,
  ],
  template: `
    <div class="dialog">
      <h2 class="dialog-title">{{ data().titleKey | appTranslate }}</h2>
      <div class="dialog-content">
        <p>{{ data().messageKey | appTranslate }}</p>

        @if (data().withAmount) {
          <ion-item fill="outline">
            <ion-label position="stacked">{{
              'SAVINGS.HOLD_AMOUNT_LABEL' | appTranslate
            }}</ion-label>
            <ion-input
              [attr.aria-label]="'SAVINGS.HOLD_AMOUNT_LABEL' | appTranslate"
              type="number"
              min="0"
              data-testid="savings-hold-amount"
              name="transactionAmount"
              [(ngModel)]="amount"
            ></ion-input>
          </ion-item>
        }

        <ion-item fill="outline">
          <ion-label position="stacked">{{ 'SAVINGS.BLOCK_REASON' | appTranslate }}</ion-label>
          <ion-select
            [attr.aria-label]="'SAVINGS.BLOCK_REASON' | appTranslate"
            interface="popover"
            data-testid="savings-block-reason"
            name="reasonForBlock"
            [(ngModel)]="reasonId"
          >
            @for (reason of reasons(); track reason.id) {
              <ion-select-option [value]="reason.id">{{ reason.name }}</ion-select-option>
            }
          </ion-select>
        </ion-item>

        @if (!reasons().length) {
          <p class="field-note" data-testid="savings-block-no-reasons">
            {{ 'SAVINGS.NO_BLOCK_REASONS' | appTranslate }}
          </p>
        }
      </div>
      <div class="dialog-actions">
        <ion-button fill="clear" color="medium" (click)="dismiss()">
          {{ 'COMMON.CANCEL' | appTranslate }}
        </ion-button>
        <ion-button
          color="danger"
          data-testid="savings-block-confirm"
          [disabled]="!canConfirm()"
          (click)="confirm()"
        >
          {{ 'COMMON.CONFIRM' | appTranslate }}
        </ion-button>
      </div>
    </div>
  `,
  styles: [
    `
      .dialog {
        padding: 20px 24px 12px;
        background: var(--card-bg);
        color: var(--text-color);
        min-width: 320px;
      }
      .dialog-title {
        margin: 0 0 12px;
        font-size: 1.25rem;
      }
      .field-note {
        margin: 8px 0 0;
        font-size: 12px;
        color: var(--text-muted, #6b7280);
      }
      .dialog-actions {
        display: flex;
        justify-content: flex-end;
        gap: 8px;
        margin-top: 16px;
      }
    `,
  ],
})
export class SavingsBlockDialogComponent {
  private readonly overlay = inject(OVERLAY);
  private readonly codeValuesService = inject(CodeValuesService);

  readonly data = input.required<SavingsBlockDialogData>();

  readonly reasons = signal<GetCodeValuesDataResponse[]>([]);
  reasonId: number | null = null;
  amount: number | null = null;

  constructor() {
    // Resolved by code *name*: the ids differ per deployment, and Fineract exposes a by-name
    // endpoint precisely so callers do not have to look one up first.
    queueMicrotask(() => {
      this.codeValuesService.getCodesNameCodeNameCodevalues(this.data().codeName).subscribe({
        next: (values) => this.reasons.set(values ?? []),
        error: () => this.reasons.set([]),
      });
    });
  }

  /** An amount is required only when this dialog was asked to collect one. */
  canConfirm(): boolean {
    if (this.reasonId === null) return false;
    return !this.data().withAmount || (this.amount !== null && this.amount > 0);
  }

  confirm(): void {
    if (!this.canConfirm() || this.reasonId === null) return;
    const result: SavingsBlockResult = { reasonForBlock: this.reasonId };
    if (this.data().withAmount && this.amount !== null) {
      // Fineract names this `transactionAmount` on the hold endpoint and rejects `amount`
      // outright, so the field is spelled the way the server expects it here.
      result.transactionAmount = this.amount;
    }
    void this.overlay.dismissModal(result);
  }

  dismiss(): void {
    void this.overlay.dismissModal();
  }
}
