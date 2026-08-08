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
import { IonButton, IonItem, IonLabel, IonTextarea } from '@ionic/angular/standalone';

import { OVERLAY, TranslatePipe } from '../../core/adapters';

export interface ClientTransferResponseDialogData {
  /** Translation key for the heading, e.g. `CLIENTS.ACTIONS.ACCEPT_TRANSFER`. */
  titleKey: string;
  /** Translation key for the sentence explaining what the client's status becomes. */
  messageKey: string;
  /** Colours the confirm button red. Set for the two that refuse or cancel a transfer. */
  destructive?: boolean;
}

export interface ClientTransferResponseResult {
  note?: string;
}

/**
 * Answers a pending transfer: accept it, reject it, or withdraw the proposal.
 *
 * All three take an optional note and **nothing else** — `acceptTransfer` answers
 * "The parameter transferDate is not supported.", and the same for `dateFormat` and `locale`.
 * That is why they cannot share {@link ClientActionDialogComponent}, which always collects a
 * date, and why this dialog exists rather than a `destructive` flag on the existing one.
 */
@Component({
  selector: 'app-client-transfer-response-dialog',
  standalone: true,
  imports: [FormsModule, TranslatePipe, IonButton, IonItem, IonLabel, IonTextarea],
  template: `
    <h2 class="dialog-title">{{ data().titleKey | appTranslate }}</h2>
    <div class="dialog-content">
      <p class="dialog-message">{{ data().messageKey | appTranslate }}</p>
      <ion-item fill="outline" class="full-width">
        <ion-label position="stacked">{{ 'COMMON.NOTE' | appTranslate }}</ion-label>
        <ion-textarea
          name="note"
          data-testid="client-transfer-response-note"
          rows="3"
          [autoGrow]="true"
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
        [color]="data().destructive ? 'danger' : 'primary'"
        data-testid="client-transfer-response-confirm"
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
        min-width: 350px;
      }
      .dialog-message {
        margin: 0;
      }
      .full-width {
        width: 100%;
      }
    `,
  ],
})
export class ClientTransferResponseDialogComponent {
  private readonly overlay = inject(OVERLAY);

  readonly data = input.required<ClientTransferResponseDialogData>();
  readonly note = signal('');

  onCancel(): void {
    void this.overlay.dismissModal();
  }

  onConfirm(): void {
    const note = this.note().trim();
    void this.overlay.dismissModal<ClientTransferResponseResult>(note ? { note } : {});
  }
}
