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
import { TranslateModule } from '@ngx-translate/core';
import {
  IonButton,
  IonItem,
  IonLabel,
  IonSelect,
  IonSelectOption,
  ModalController,
} from '@ionic/angular/standalone';

import { CodeValuesService, GetCodeValuesDataResponse } from '../../api';

export interface SavingsBlockDialogData {
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
}

@Component({
  selector: 'app-savings-block-dialog',
  standalone: true,
  imports: [FormsModule, TranslateModule, IonItem, IonLabel, IonSelect, IonSelectOption, IonButton],
  template: `
    <div class="dialog">
      <h2 class="dialog-title">{{ data().titleKey | translate }}</h2>
      <div class="dialog-content">
        <p>{{ data().messageKey | translate }}</p>

        <ion-item fill="outline">
          <ion-label position="stacked">{{ 'SAVINGS.BLOCK_REASON' | translate }}</ion-label>
          <ion-select
            [attr.aria-label]="'SAVINGS.BLOCK_REASON' | translate"
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
            {{ 'SAVINGS.NO_BLOCK_REASONS' | translate }}
          </p>
        }
      </div>
      <div class="dialog-actions">
        <ion-button fill="clear" color="medium" (click)="dismiss()">
          {{ 'COMMON.CANCEL' | translate }}
        </ion-button>
        <ion-button
          color="danger"
          data-testid="savings-block-confirm"
          [disabled]="reasonId === null"
          (click)="confirm()"
        >
          {{ 'COMMON.CONFIRM' | translate }}
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
  private readonly modalController = inject(ModalController);
  private readonly codeValuesService = inject(CodeValuesService);

  readonly data = input.required<SavingsBlockDialogData>();

  readonly reasons = signal<GetCodeValuesDataResponse[]>([]);
  reasonId: number | null = null;

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

  confirm(): void {
    if (this.reasonId === null) return;
    this.modalController.dismiss({ reasonForBlock: this.reasonId } satisfies SavingsBlockResult);
  }

  dismiss(): void {
    this.modalController.dismiss();
  }
}
