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

import { ClientService } from '../../api';
import { OVERLAY, TranslatePipe } from '../../core/adapters';

export interface ClientStaffDialogData {
  /** The client's office. Scopes the staff list to that office and its parents. */
  officeId?: number;
  /** Currently assigned staff, pre-selected so a reassignment starts from the truth. */
  staffId?: number;
}

export interface ClientStaffResult {
  staffId: number;
}

/**
 * Picks the member of staff a client is assigned to.
 *
 * Options come from `GET /clients/template?officeId=…`, deliberately **without**
 * `staffInSelectedOfficeOnly`. That flag restricts the list to staff whose own office matches
 * exactly, which empties it for any branch that has no staff records of its own — yet
 * `assignStaff` accepts a head-office member for a client in a child branch, so the flag would
 * hide people the platform is perfectly willing to assign.
 */
@Component({
  selector: 'app-client-staff-dialog',
  standalone: true,
  imports: [FormsModule, TranslatePipe, IonItem, IonLabel, IonSelect, IonSelectOption, IonButton],
  template: `
    <h2 class="dialog-title">{{ 'CLIENTS.ACTIONS.ASSIGN_STAFF' | appTranslate }}</h2>
    <div class="dialog-content">
      <ion-item fill="outline" class="full-width">
        <ion-label position="stacked">{{ 'COMMON.STAFF' | appTranslate }}</ion-label>
        <ion-select
          [attr.aria-label]="'COMMON.STAFF' | appTranslate"
          interface="popover"
          data-testid="client-staff-select"
          name="staffId"
          [(ngModel)]="staffId"
        >
          @for (member of staff(); track member.id) {
            <ion-select-option [value]="member.id">{{ member.displayName }}</ion-select-option>
          }
        </ion-select>
      </ion-item>

      @if (!staff().length) {
        <p class="field-note" data-testid="client-staff-none">
          {{ 'CLIENTS.NO_STAFF_AVAILABLE' | appTranslate }}
        </p>
      }
    </div>
    <div class="dialog-actions">
      <ion-button fill="clear" color="medium" (click)="onCancel()">
        {{ 'COMMON.CANCEL' | appTranslate }}
      </ion-button>
      <ion-button
        color="primary"
        data-testid="client-staff-confirm"
        [disabled]="staffId === undefined"
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
export class ClientStaffDialogComponent implements OnInit {
  private readonly overlay = inject(OVERLAY);
  private readonly clientService = inject(ClientService);

  readonly data = input.required<ClientStaffDialogData>();

  readonly staff = signal<{ id?: number; displayName?: string }[]>([]);
  staffId?: number;

  ngOnInit(): void {
    this.staffId = this.data().staffId;

    // Signature: officeId, commandParam, staffInSelectedOfficeOnly
    this.clientService.getClientsTemplate(this.data().officeId).subscribe({
      next: (template) => {
        this.staff.set(template.staffOptions ? Array.from(template.staffOptions) : []);
      },
      error: () => this.staff.set([]),
    });
  }

  onCancel(): void {
    void this.overlay.dismissModal();
  }

  onConfirm(): void {
    if (this.staffId === undefined) return;
    void this.overlay.dismissModal<ClientStaffResult>({ staffId: this.staffId });
  }
}
