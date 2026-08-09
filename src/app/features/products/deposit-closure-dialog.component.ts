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

import { Component, OnInit, inject, input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  IonButton,
  IonItem,
  IonLabel,
  IonSelect,
  IonSelectOption,
} from '@ionic/angular/standalone';
import { Observable } from 'rxjs';

import { FixedDepositAccountService, RecurringDepositAccountService } from '../../api';
import { OVERLAY, TranslatePipe } from '../../core/adapters';

export interface DepositClosureDialogData {
  accountId: number;
  isRD: boolean;
  /** Premature closures show what the client would receive; a closure at maturity does not. */
  premature: boolean;
  /** ISO `YYYY-MM-DD` the command will carry, needed to price a premature closure. */
  closedOnDate: string;
  currency: string;
}

export interface DepositClosureResult {
  onAccountClosureId: number;
}

interface ClosureOption {
  id?: number;
  value?: string;
}

/**
 * Asks what happens to the money when a term deposit is closed.
 *
 * `onAccountClosureId` is mandatory on both `close` and `prematureClose` — a closure without it
 * is refused — and the platform enumerates the choices per account rather than globally, so they
 * are read from the account's own `?command=close` template. `withdrawBalance`, which the savings
 * screens send, is not a parameter these commands accept at all.
 *
 * Only "Withdraw Deposit" is offered for now. The other three each need a second input this
 * dialog does not collect — an account to transfer to, or the terms to re-invest on — and
 * offering a choice that then fails is worse than not offering it.
 */
@Component({
  selector: 'app-deposit-closure-dialog',
  standalone: true,
  imports: [FormsModule, TranslatePipe, IonButton, IonItem, IonLabel, IonSelect, IonSelectOption],
  template: `
    <h2 class="dialog-title">
      {{ (data().premature ? 'ACTIONS.PREMATURE_CLOSE' : 'ACTIONS.CLOSE') | appTranslate }}
    </h2>
    <div class="dialog-content">
      <div class="dialog-form">
        @if (data().premature) {
          <p class="premature-amount" data-testid="deposit-premature-amount">
            {{ 'PRODUCTS.DEPOSITS.PREMATURE_AMOUNT' | appTranslate }}:
            <strong>{{ data().currency }} {{ prematureAmount() ?? '—' }}</strong>
          </p>
        }

        <ion-item fill="outline" class="full-width">
          <ion-label position="stacked">
            {{ 'PRODUCTS.DEPOSITS.ON_CLOSURE' | appTranslate }}
          </ion-label>
          <ion-select
            [attr.aria-label]="'PRODUCTS.DEPOSITS.ON_CLOSURE' | appTranslate"
            interface="popover"
            name="onAccountClosureId"
            data-testid="deposit-closure-type"
            [(ngModel)]="onAccountClosureId"
          >
            @for (option of options(); track option.id) {
              <ion-select-option [value]="option.id">{{ option.value }}</ion-select-option>
            }
          </ion-select>
        </ion-item>
      </div>
    </div>
    <div class="dialog-actions">
      <ion-button fill="clear" color="medium" (click)="onCancel()">
        {{ 'COMMON.CANCEL' | appTranslate }}
      </ion-button>
      <ion-button
        color="danger"
        data-testid="deposit-closure-confirm"
        [disabled]="!onAccountClosureId"
        (click)="onConfirm()"
      >
        {{ 'COMMON.CONFIRM' | appTranslate }}
      </ion-button>
    </div>
  `,
  styles: [
    `
      .dialog-form {
        display: flex;
        flex-direction: column;
        gap: 16px;
        padding-top: 8px;
        min-width: 320px;
      }
      .full-width {
        width: 100%;
      }
      .premature-amount {
        margin: 0;
        font-size: 14px;
      }
    `,
  ],
})
export class DepositClosureDialogComponent implements OnInit {
  private readonly overlay = inject(OVERLAY);
  private readonly fdService = inject(FixedDepositAccountService);
  private readonly rdService = inject(RecurringDepositAccountService);

  readonly data = input.required<DepositClosureDialogData>();

  readonly options = signal<ClosureOption[]>([]);
  readonly prematureAmount = signal<number | null>(null);
  onAccountClosureId?: number;

  ngOnInit(): void {
    this.loadOptions();
    if (this.data().premature) {
      this.loadPrematureAmount();
    }
  }

  private loadOptions(): void {
    const { accountId, isRD } = this.data();
    const request$: Observable<unknown> = isRD
      ? this.rdService.getRecurringdepositaccountsAccountIdTemplate(accountId, 'close')
      : this.fdService.getFixeddepositaccountsAccountIdTemplate(accountId, 'close');

    request$.subscribe({
      next: (template) => {
        const options =
          (template as { onAccountClosureOptions?: ClosureOption[] }).onAccountClosureOptions ?? [];
        // Withdraw Deposit (100) is the one this dialog can complete on its own — see the note
        // on the class.
        const withdraw = options.filter((option) => option.id === WITHDRAW_DEPOSIT);
        this.options.set(withdraw.length ? withdraw : options.slice(0, 1));
        this.onAccountClosureId = this.options()[0]?.id;
      },
      error: () => this.options.set([]),
    });
  }

  /**
   * What the client would actually receive today.
   *
   * `calculatePrematureAmount` is a POST that changes nothing — it prices the closure — and it is
   * the difference between a teller quoting a figure and guessing one.
   */
  private loadPrematureAmount(): void {
    const { accountId, isRD, closedOnDate } = this.data();
    const body = {
      closedOnDate: closedOnDate,
      locale: 'en',
      dateFormat: 'yyyy-MM-dd',
    };
    const request$: Observable<unknown> = isRD
      ? this.rdService.postRecurringdepositaccountsAccountId(
          accountId,
          body,
          'calculatePrematureAmount',
        )
      : this.fdService.postFixeddepositaccountsAccountId(
          accountId,
          body,
          'calculatePrematureAmount',
        );

    request$.subscribe({
      next: (result) => {
        const amount = (result as { maturityAmount?: number }).maturityAmount;
        this.prematureAmount.set(typeof amount === 'number' ? amount : null);
      },
      error: () => this.prematureAmount.set(null),
    });
  }

  onCancel(): void {
    void this.overlay.dismissModal();
  }

  onConfirm(): void {
    if (!this.onAccountClosureId) return;
    void this.overlay.dismissModal<DepositClosureResult>({
      onAccountClosureId: this.onAccountClosureId,
    });
  }
}

/** `depositAccountClosureType.withdrawDeposit`. */
const WITHDRAW_DEPOSIT = 100;
