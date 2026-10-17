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
import { DEPOSIT_ACCOUNT_API, I18N, OVERLAY, TranslatePipe } from '../../core/adapters';
import type { DepositEnumOption, DepositSavingsAccount } from '../../core/adapters';

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
  /** Mandatory when closing with a transfer to savings; absent otherwise. */
  toSavingsAccountId?: number;
  /** Sent with a transfer so the receiving account's statement says where the money came from. */
  transferDescription?: string;
}

/**
 * Asks what happens to the money when a term deposit is closed.
 *
 * `onAccountClosureId` is mandatory on both `close` and `prematureClose` — a closure without it
 * is refused — and the platform enumerates the choices per account rather than globally, so they
 * are read from the account's own `?command=close` template. `withdrawBalance`, which the savings
 * screens send, is not a parameter these commands accept at all.
 *
 * ## Which options are offered
 *
 * All of them the platform will accept, which is not all of them the template lists. Measured
 * against a running Fineract:
 *
 * ```
 * close          (matured account) → 100, 200, 300, 400 all accepted
 * prematureClose                   → 100 and 200 accepted
 *                                  → 300 and 400 refused: `reinvest.not.allowed`
 * ```
 *
 * The template returns the same four for both commands, so filtering the two reinvest options
 * out of a premature closure is the UI's job — offering a choice that then fails is worse than
 * not offering it, which is what this dialog used to do for three of the four.
 *
 * Transfer to savings needs an account to transfer to. The platform makes
 * `toSavingsAccountId` mandatory for it, so the field appears with the option and defaults to
 * the account the deposit is already linked to.
 *
 * Re-investing closes this deposit and opens a new one for the maturity amount, left pending
 * approval — measured — so the dialog says so before confirming rather than leaving the user to
 * discover a second account.
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

        @if (transfersToSavings()) {
          <ion-item fill="outline" class="full-width">
            <ion-label position="stacked">
              {{ 'DEPOSITS.TRANSFER_TO_SAVINGS' | appTranslate }}
            </ion-label>
            <ion-select
              [attr.aria-label]="'DEPOSITS.TRANSFER_TO_SAVINGS' | appTranslate"
              interface="popover"
              name="toSavingsAccountId"
              data-testid="deposit-closure-target"
              [(ngModel)]="toSavingsAccountId"
            >
              @for (target of transferTargets(); track target.id) {
                <ion-select-option [value]="target.id">{{ target.accountNo }}</ion-select-option>
              }
            </ion-select>
          </ion-item>

          @if (transferTargets().length === 0) {
            <p class="closure-note" data-testid="deposit-closure-no-targets">
              {{ 'DEPOSITS.NO_TRANSFER_TARGETS' | appTranslate }}
            </p>
          }
        }

        @if (reinvests()) {
          <p class="closure-note" data-testid="deposit-closure-reinvest-note">
            {{ 'DEPOSITS.REINVEST_NOTE' | appTranslate }}
          </p>
        }
      </div>
    </div>
    <div class="dialog-actions">
      <ion-button fill="clear" color="medium" (click)="onCancel()">
        {{ 'COMMON.CANCEL' | appTranslate }}
      </ion-button>
      <ion-button
        color="danger"
        data-testid="deposit-closure-confirm"
        [disabled]="!canConfirm()"
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
      .closure-note {
        margin: 0;
        font-size: 13px;
        color: var(--text-muted, #7f8c8d);
      }
    `,
  ],
})
export class DepositClosureDialogComponent implements OnInit {
  private readonly overlay = inject(OVERLAY);
  private readonly i18n = inject(I18N);
  private readonly deposits = inject(DEPOSIT_ACCOUNT_API);

  readonly data = input.required<DepositClosureDialogData>();

  readonly options = signal<DepositEnumOption[]>([]);
  readonly transferTargets = signal<DepositSavingsAccount[]>([]);
  readonly prematureAmount = signal<number | null>(null);
  onAccountClosureId?: number;
  toSavingsAccountId?: number;

  /** Whether the chosen option pays into a savings account, which needs one naming. */
  transfersToSavings(): boolean {
    return this.onAccountClosureId === TRANSFER_TO_SAVINGS;
  }

  /** Whether the chosen option opens a replacement deposit. */
  reinvests(): boolean {
    return (
      this.onAccountClosureId === REINVEST_PRINCIPAL_AND_INTEREST ||
      this.onAccountClosureId === REINVEST_PRINCIPAL_ONLY
    );
  }

  /**
   * Whether the closure can be sent.
   *
   * A transfer without a target is refused by the platform, so it is refused here instead of
   * being sent and reported as a failure.
   */
  canConfirm(): boolean {
    if (!this.onAccountClosureId) return false;
    return !this.transfersToSavings() || this.toSavingsAccountId !== undefined;
  }

  ngOnInit(): void {
    this.loadOptions();
    if (this.data().premature) {
      this.loadPrematureAmount();
    }
  }

  private loadOptions(): void {
    const { accountId, isRD } = this.data();

    this.deposits.closureTemplate(isRD ? 'recurring' : 'fixed', accountId).subscribe({
      next: (template) => {
        // The template offers the same four options for both commands, but a premature closure
        // cannot re-invest — the platform answers `reinvest.not.allowed`. Measured. The adapter
        // reports the template as it stands, because this is a rule about the *operation*.
        this.options.set(
          this.data().premature
            ? template.options.filter((option) => !REINVEST_OPTIONS.has(option.id))
            : [...template.options],
        );
        this.onAccountClosureId = this.options()[0]?.id;

        this.transferTargets.set([...template.transferTargets]);
        // Defaults to the account this deposit already pays into, when it has one.
        this.toSavingsAccountId = template.defaultTransferTargetId ?? undefined;
      },
      error: () => {
        this.options.set([]);
        this.transferTargets.set([]);
      },
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

    this.deposits.prematureAmount(isRD ? 'recurring' : 'fixed', accountId, closedOnDate).subscribe({
      next: (amount) => this.prematureAmount.set(amount),
      error: () => this.prematureAmount.set(null),
    });
  }

  onCancel(): void {
    void this.overlay.dismissModal();
  }

  onConfirm(): void {
    if (!this.canConfirm() || !this.onAccountClosureId) return;
    void this.overlay.dismissModal<DepositClosureResult>({
      onAccountClosureId: this.onAccountClosureId,
      // Only for a transfer: sending a target with any other option describes a movement that
      // is not going to happen.
      toSavingsAccountId: this.transfersToSavings() ? this.toSavingsAccountId : undefined,
      transferDescription: this.transfersToSavings()
        ? this.i18n.translate('DEPOSITS.TRANSFER_DESCRIPTION')
        : undefined,
    });
  }
}

/** `depositAccountClosureType.transferToSavings`. */
const TRANSFER_TO_SAVINGS = 200;
/** `reinvestPrincipalAndInterest` and `reinvestPrincipalOnly`. */
const REINVEST_PRINCIPAL_AND_INTEREST = 300;
const REINVEST_PRINCIPAL_ONLY = 400;
const REINVEST_OPTIONS = new Set([REINVEST_PRINCIPAL_AND_INTEREST, REINVEST_PRINCIPAL_ONLY]);
