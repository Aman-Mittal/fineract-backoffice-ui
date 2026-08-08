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

import { ClientService, GetClientsSavingsAccounts } from '../../api';
import { OVERLAY, TranslatePipe } from '../../core/adapters';

export interface ClientSavingsAccountDialogData {
  clientId: number;
  /** The account currently set as the default, pre-selected. */
  savingsAccountId?: number;
}

export interface ClientSavingsAccountResult {
  savingsAccountId: number;
}

/**
 * Picks the client's default savings account.
 *
 * This is the account the platform reaches for when a client-level operation needs a savings
 * destination — disbursing a loan to savings is the one that surfaces today, and it fails with a
 * message about the loan rather than about the missing link, so the setting is worth being able
 * to see and change here.
 *
 * The list is every savings account on the client. Nothing is filtered by status: the platform
 * validates only that the account exists and belongs to the client, answering
 * "Savings account with identifier N does not exist" otherwise, and second-guessing that here
 * would hide a legitimate choice.
 */
@Component({
  selector: 'app-client-savings-account-dialog',
  standalone: true,
  imports: [FormsModule, TranslatePipe, IonItem, IonLabel, IonSelect, IonSelectOption, IonButton],
  template: `
    <h2 class="dialog-title">{{ 'CLIENTS.ACTIONS.UPDATE_SAVINGS_ACCOUNT' | appTranslate }}</h2>
    <div class="dialog-content">
      <ion-item fill="outline" class="full-width">
        <ion-label position="stacked">{{ 'CLIENTS.SAVINGS_ACCOUNT' | appTranslate }}</ion-label>
        <ion-select
          [attr.aria-label]="'CLIENTS.SAVINGS_ACCOUNT' | appTranslate"
          interface="popover"
          data-testid="client-savings-account-select"
          name="savingsAccountId"
          [(ngModel)]="savingsAccountId"
        >
          @for (account of accounts(); track account.id) {
            <ion-select-option [value]="account.id">
              {{ account.accountNo }} — {{ account.productName }}
            </ion-select-option>
          }
        </ion-select>
      </ion-item>

      @if (!accounts().length) {
        <p class="field-note" data-testid="client-savings-account-none">
          {{ 'CLIENTS.NO_SAVINGS_ACCOUNTS' | appTranslate }}
        </p>
      }
    </div>
    <div class="dialog-actions">
      <ion-button fill="clear" color="medium" (click)="onCancel()">
        {{ 'COMMON.CANCEL' | appTranslate }}
      </ion-button>
      <ion-button
        color="primary"
        data-testid="client-savings-account-confirm"
        [disabled]="savingsAccountId === undefined"
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
        gap: 12px;
        padding-top: 8px;
        min-width: 340px;
      }
      .full-width {
        width: 100%;
      }
      .field-note {
        margin: 0;
        font-size: 12px;
        color: var(--text-muted, #6b7280);
      }
    `,
  ],
})
export class ClientSavingsAccountDialogComponent implements OnInit {
  private readonly overlay = inject(OVERLAY);
  private readonly clientService = inject(ClientService);

  readonly data = input.required<ClientSavingsAccountDialogData>();

  readonly accounts = signal<GetClientsSavingsAccounts[]>([]);
  savingsAccountId?: number;

  ngOnInit(): void {
    this.savingsAccountId = this.data().savingsAccountId;

    this.clientService.getClientsClientIdAccounts(this.data().clientId).subscribe({
      next: (response) => {
        this.accounts.set(response.savingsAccounts ? Array.from(response.savingsAccounts) : []);
      },
      error: () => this.accounts.set([]),
    });
  }

  onCancel(): void {
    void this.overlay.dismissModal();
  }

  onConfirm(): void {
    if (this.savingsAccountId === undefined) return;
    void this.overlay.dismissModal<ClientSavingsAccountResult>({
      savingsAccountId: this.savingsAccountId,
    });
  }
}
