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
import {
  IonButton,
  IonDatetime,
  IonDatetimeButton,
  IonItem,
  IonLabel,
  IonModal,
} from '@ionic/angular/standalone';

import { OVERLAY, TranslatePipe } from '../../core/adapters';
import { toIsoDate } from '../../core/utils/date-formatter';

export interface LoanUnassignOfficerResult {
  unassignedDate: string;
}

/**
 * Collects the date a loan officer stopped being responsible for a loan.
 *
 * The date is the whole point rather than a formality: it decides which officer a loan counts
 * against in every per-officer report for the period, so backdating it to the day someone
 * actually left is the difference between a correct portfolio figure and a fictional one.
 */
@Component({
  selector: 'app-loan-unassign-officer-dialog',
  standalone: true,
  imports: [
    FormsModule,
    TranslatePipe,
    IonButton,
    IonItem,
    IonLabel,
    IonDatetime,
    IonDatetimeButton,
    IonModal,
  ],
  template: `
    <h2 class="dialog-title">{{ 'LOANS.ACTIONS.UNASSIGN_LOAN_OFFICER' | appTranslate }}</h2>
    <div class="dialog-content">
      <p class="dialog-message">{{ 'LOANS.CONFIRM_UNASSIGN_LOAN_OFFICER' | appTranslate }}</p>
      <ion-item fill="outline" class="full-width">
        <ion-label position="stacked">{{ 'LOANS.UNASSIGNED_DATE' | appTranslate }}</ion-label>
        <ion-datetime-button datetime="unassign-officer-date"></ion-datetime-button>
        <ion-modal [keepContentsMounted]="true">
          <ng-template>
            <ion-datetime
              id="unassign-officer-date"
              data-testid="unassign-officer-date"
              presentation="date"
              name="unassignedDate"
              [ngModel]="unassignedDate()"
              (ngModelChange)="unassignedDate.set($event)"
              required
            ></ion-datetime>
          </ng-template>
        </ion-modal>
      </ion-item>
    </div>
    <div class="dialog-actions">
      <ion-button fill="clear" color="medium" (click)="onCancel()">
        {{ 'COMMON.CANCEL' | appTranslate }}
      </ion-button>
      <ion-button
        color="primary"
        data-testid="unassign-officer-confirm"
        [disabled]="!unassignedDate()"
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
      .dialog-message {
        margin: 0;
      }
      .full-width {
        width: 100%;
      }
    `,
  ],
})
export class LoanUnassignOfficerDialogComponent {
  private readonly overlay = inject(OVERLAY);

  readonly unassignedDate = signal(toIsoDate(new Date()));

  onCancel(): void {
    void this.overlay.dismissModal();
  }

  onConfirm(): void {
    if (!this.unassignedDate()) return;
    void this.overlay.dismissModal<LoanUnassignOfficerResult>({
      unassignedDate: this.unassignedDate(),
    });
  }
}
