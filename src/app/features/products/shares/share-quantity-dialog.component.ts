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
import { IonButton, IonInput, IonItem, IonLabel, IonNote } from '@ionic/angular/standalone';

import { OVERLAY, TranslatePipe } from '../../../core/adapters';

export interface ShareQuantityDialogData {
  /** Translation key for the heading — buying more shares, or selling some back. */
  titleKey: string;
  /** Shares the client currently holds, so a redemption can be bounded by it. */
  heldShares?: number;
  /** Redeeming cannot exceed the holding; buying is not capped here. */
  bounded: boolean;
}

export interface ShareQuantityResult {
  requestedShares: number;
}

/**
 * Collects a number of shares for the two commands that trade them.
 *
 * `applyadditionalshares` and `redeemshares` take the same pair — a date and a share count — and
 * differ only in direction, so they share this dialog rather than having one each.
 *
 * A redemption is capped at the holding. The platform refuses a larger one, but it refuses it
 * after the teller has committed to a number, and the holding is already on screen.
 */
@Component({
  selector: 'app-share-quantity-dialog',
  standalone: true,
  imports: [FormsModule, TranslatePipe, IonButton, IonInput, IonItem, IonLabel, IonNote],
  template: `
    <h2 class="dialog-title">{{ data().titleKey | appTranslate }}</h2>
    <div class="dialog-content">
      <div class="dialog-form">
        @if (data().bounded) {
          <ion-note data-testid="share-quantity-held">
            {{ 'SHARE_ACCOUNTS.SHARES_HELD' | appTranslate }}: {{ data().heldShares ?? 0 }}
          </ion-note>
        }

        <ion-item fill="outline" class="full-width">
          <ion-label position="stacked">{{
            'SHARE_ACCOUNTS.NUMBER_OF_SHARES' | appTranslate
          }}</ion-label>
          <ion-input
            [attr.aria-label]="'SHARE_ACCOUNTS.NUMBER_OF_SHARES' | appTranslate"
            data-testid="share-quantity-input"
            name="requestedShares"
            type="number"
            min="1"
            [ngModel]="requestedShares()"
            (ngModelChange)="requestedShares.set($event)"
            required
          ></ion-input>
        </ion-item>

        @if (exceedsHolding()) {
          <ion-note color="danger" data-testid="share-quantity-too-many">
            {{ 'SHARE_ACCOUNTS.MORE_THAN_HELD' | appTranslate }}
          </ion-note>
        }
      </div>
    </div>
    <div class="dialog-actions">
      <ion-button fill="clear" color="medium" (click)="onCancel()">
        {{ 'COMMON.CANCEL' | appTranslate }}
      </ion-button>
      <ion-button
        color="primary"
        data-testid="share-quantity-confirm"
        [disabled]="!isValid()"
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
        gap: 12px;
        padding-top: 8px;
        min-width: 320px;
      }
      .full-width {
        width: 100%;
      }
    `,
  ],
})
export class ShareQuantityDialogComponent {
  private readonly overlay = inject(OVERLAY);

  readonly data = input.required<ShareQuantityDialogData>();
  readonly requestedShares = signal<number | null>(null);

  exceedsHolding(): boolean {
    const shares = this.requestedShares();
    if (!this.data().bounded || shares === null) return false;
    return shares > (this.data().heldShares ?? 0);
  }

  isValid(): boolean {
    const shares = this.requestedShares();
    return shares !== null && shares > 0 && !this.exceedsHolding();
  }

  onCancel(): void {
    void this.overlay.dismissModal();
  }

  onConfirm(): void {
    const shares = this.requestedShares();
    if (!this.isValid() || shares === null) return;
    void this.overlay.dismissModal<ShareQuantityResult>({ requestedShares: shares });
  }
}
