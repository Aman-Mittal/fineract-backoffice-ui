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
  IonDatetime,
  IonDatetimeButton,
  IonItem,
  IonLabel,
  IonModal,
  IonSelect,
  IonSelectOption,
  IonTextarea,
} from '@ionic/angular/standalone';

import { ClientService } from '../../api';
import { OVERLAY, TranslatePipe } from '../../core/adapters';
import { toIsoDate } from '../../core/utils/date-formatter';

export interface ClientTransferDialogData {
  /**
   * `propose` starts the handshake and needs a transfer date; `proposeAndAccept` completes the
   * move in one step and **rejects** `transferDate` outright — the platform answers
   * "The parameter transferDate is not supported." So the date field is not merely hidden for
   * the one-step variant, it must not be sent.
   */
  mode: 'propose' | 'proposeAndAccept';
  /** The client's current office, excluded from the destination list. */
  officeId?: number;
}

export interface ClientTransferResult {
  destinationOfficeId: number;
  /** ISO date, present only in `propose` mode. */
  transferDate?: string;
  note?: string;
}

/**
 * Chooses where a client is being transferred to.
 *
 * Offices come from `GET /clients/template`, which returns the whole list the user may see; the
 * client's own office is filtered out because transferring to it is not a no-op — the platform
 * accepts it and leaves the client sitting in "Transfer in progress" against their current
 * branch, which reads as a stuck record rather than a rejected request.
 */
@Component({
  selector: 'app-client-transfer-dialog',
  standalone: true,
  imports: [
    FormsModule,
    TranslatePipe,
    IonButton,
    IonItem,
    IonLabel,
    IonSelect,
    IonSelectOption,
    IonTextarea,
    IonDatetime,
    IonDatetimeButton,
    IonModal,
  ],
  template: `
    <h2 class="dialog-title">
      {{
        (data().mode === 'propose'
          ? 'CLIENTS.ACTIONS.PROPOSE_TRANSFER'
          : 'CLIENTS.ACTIONS.PROPOSE_AND_ACCEPT_TRANSFER'
        ) | appTranslate
      }}
    </h2>
    <div class="dialog-content">
      <ion-item fill="outline" class="full-width">
        <ion-label position="stacked">{{ 'CLIENTS.DESTINATION_OFFICE' | appTranslate }}</ion-label>
        <ion-select
          [attr.aria-label]="'CLIENTS.DESTINATION_OFFICE' | appTranslate"
          interface="popover"
          data-testid="client-transfer-office"
          name="destinationOfficeId"
          [(ngModel)]="destinationOfficeId"
        >
          @for (office of offices(); track office.id) {
            <ion-select-option [value]="office.id">{{ office.name }}</ion-select-option>
          }
        </ion-select>
      </ion-item>

      @if (!offices().length) {
        <p class="field-note" data-testid="client-transfer-no-offices">
          {{ 'CLIENTS.NO_OTHER_OFFICES' | appTranslate }}
        </p>
      }

      @if (data().mode === 'propose') {
        <ion-item fill="outline" class="full-width">
          <ion-label position="stacked">{{ 'CLIENTS.TRANSFER_DATE' | appTranslate }}</ion-label>
          <ion-datetime-button datetime="clientTransferDate-picker"></ion-datetime-button>
          <ion-modal [keepContentsMounted]="true">
            <ng-template>
              <ion-datetime
                id="clientTransferDate-picker"
                data-testid="client-transfer-date"
                presentation="date"
                name="transferDate"
                [ngModel]="transferDate()"
                (ngModelChange)="transferDate.set($event)"
              ></ion-datetime>
            </ng-template>
          </ion-modal>
        </ion-item>
      }

      <ion-item fill="outline" class="full-width">
        <ion-label position="stacked">{{ 'COMMON.NOTE' | appTranslate }}</ion-label>
        <ion-textarea
          name="note"
          data-testid="client-transfer-note"
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
        color="primary"
        data-testid="client-transfer-confirm"
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
      .field-note {
        margin: 0;
        font-size: 12px;
        color: var(--text-muted, #6b7280);
      }
    `,
  ],
})
export class ClientTransferDialogComponent implements OnInit {
  private readonly overlay = inject(OVERLAY);
  private readonly clientService = inject(ClientService);

  readonly data = input.required<ClientTransferDialogData>();

  readonly offices = signal<{ id?: number; name?: string }[]>([]);
  readonly transferDate = signal(toIsoDate(new Date()));
  readonly note = signal('');
  destinationOfficeId?: number;

  ngOnInit(): void {
    const currentOfficeId = this.data().officeId;

    this.clientService.getClientsTemplate().subscribe({
      next: (template) => {
        const options = template.officeOptions ? Array.from(template.officeOptions) : [];
        this.offices.set(options.filter((office) => office.id !== currentOfficeId));
      },
      error: () => this.offices.set([]),
    });
  }

  isValid(): boolean {
    if (this.destinationOfficeId === undefined) return false;
    return this.data().mode !== 'propose' || !!this.transferDate();
  }

  onCancel(): void {
    void this.overlay.dismissModal();
  }

  onConfirm(): void {
    if (!this.isValid()) return;

    const note = this.note().trim();
    const result: ClientTransferResult = {
      destinationOfficeId: this.destinationOfficeId as number,
    };
    if (this.data().mode === 'propose') result.transferDate = this.transferDate();
    if (note) result.note = note;

    void this.overlay.dismissModal<ClientTransferResult>(result);
  }
}
