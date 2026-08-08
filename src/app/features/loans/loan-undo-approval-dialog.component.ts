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

import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonButton, IonItem, IonLabel, IonTextarea } from '@ionic/angular/standalone';

import { OVERLAY, TranslatePipe } from '../../core/adapters';

/** What the dialog was dismissed with. `note` is absent when the user left the field empty. */
export interface LoanUndoApprovalResult {
  note?: string;
}

/**
 * Confirms undoing a loan approval, and collects the optional reason the platform records
 * against the command.
 *
 * A plain confirmation would do the job — `undoapproval` takes an empty body quite happily.
 * The note is here because this is a reversal of the moment the institution committed to an
 * amount, and "who undid this, and why" is the first question asked afterwards. The platform
 * keeps the note on the command's audit entry rather than as a loan note, so it is not
 * visible on the notes tab; it is visible where an auditor looks.
 */
@Component({
  selector: 'app-loan-undo-approval-dialog',
  standalone: true,
  imports: [FormsModule, TranslatePipe, IonButton, IonItem, IonLabel, IonTextarea],
  template: `
    <h2 class="dialog-title">{{ 'LOANS.ACTIONS.UNDO_APPROVAL' | appTranslate }}</h2>
    <div class="dialog-content">
      <p class="dialog-message">{{ 'LOANS.CONFIRM_UNDO_APPROVAL' | appTranslate }}</p>
      <ion-item fill="outline" class="full-width">
        <ion-label position="stacked">{{ 'LOANS.UNDO_APPROVAL_REASON' | appTranslate }}</ion-label>
        <ion-textarea
          name="note"
          data-testid="loan-undo-approval-note"
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
      <ion-button color="danger" data-testid="loan-undo-approval-confirm" (click)="onConfirm()">
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
export class LoanUndoApprovalDialogComponent {
  private readonly overlay = inject(OVERLAY);

  readonly note = signal('');

  onCancel(): void {
    void this.overlay.dismissModal();
  }

  onConfirm(): void {
    const note = this.note().trim();
    void this.overlay.dismissModal<LoanUndoApprovalResult>(note ? { note } : {});
  }
}
