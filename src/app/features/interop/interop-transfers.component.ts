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
import { Component, signal, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { JsonPipe } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { TranslateModule } from '@ngx-translate/core';
import { NotificationService } from '../../core/services/notification.service';
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonInput,
  IonItem,
  IonLabel,
  IonSelect,
  IonSelectOption,
  IonTextarea,
} from '@ionic/angular/standalone';
import {
  InterOperationService,
  InteropTransferRequestData,
  InteropTransferResponseData,
} from '../../api';

const ERROR_OCCURRED = 'Error occurred';

@Component({
  selector: 'app-interop-transfers',
  standalone: true,
  imports: [
    FormsModule,
    JsonPipe,
    MatTabsModule,
    TranslateModule,
    IonButton,
    IonInput,
    IonTextarea,
    IonItem,
    IonLabel,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonCard,
    IonSelectOption,
    IonSelect,
  ],
  template: `
    <ion-card>
      <ion-card-header>
        <ion-card-title>{{ 'INTEROP.TRANSFER_TITLE' | translate }}</ion-card-title>
      </ion-card-header>
      <ion-card-content>
        <mat-tab-group>
          <!-- Tab 1: Get Transfer -->
          <mat-tab [label]="'INTEROP.LOAD_TRANSFER' | translate">
            <div class="tab-content">
              <ion-item fill="outline">
                <ion-label position="stacked">{{
                  'INTEROP.TRANSACTION_CODE' | translate
                }}</ion-label>
                <ion-input [(ngModel)]="transactionCode"></ion-input>
              </ion-item>

              <ion-item fill="outline">
                <ion-label position="stacked">{{ 'INTEROP.TRANSFER_CODE' | translate }}</ion-label>
                <ion-input [(ngModel)]="transferCode"></ion-input>
              </ion-item>

              <ion-button
                color="primary"
                (click)="loadTransfer()"
                [disabled]="!transactionCode || !transferCode"
              >
                {{ 'INTEROP.LOAD_TRANSFER' | translate }}
              </ion-button>

              @if (result()) {
                <pre>{{ result() | json }}</pre>
              }
            </div>
          </mat-tab>

          <!-- Tab 2: Create Transfer -->
          <mat-tab [label]="'INTEROP.CREATE_TRANSFER' | translate">
            <div class="tab-content">
              <ion-item fill="outline" class="full-width">
                <ion-label position="stacked">{{ 'INTEROP.TRANSFER_BODY' | translate }}</ion-label>
                <ion-textarea rows="10" [(ngModel)]="transferBodyJson"></ion-textarea>
              </ion-item>

              <ion-item fill="outline">
                <ion-label position="stacked">{{ 'INTEROP.ACTION' | translate }}</ion-label>
                <ion-select [(ngModel)]="transferAction">
                  <ion-select-option value="prepare">prepare</ion-select-option>
                  <ion-select-option value="create">create</ion-select-option>
                </ion-select>
              </ion-item>

              <ion-button color="accent" (click)="createTransfer()">
                {{ 'INTEROP.CREATE_TRANSFER' | translate }}
              </ion-button>

              @if (result()) {
                <pre>{{ result() | json }}</pre>
              }
            </div>
          </mat-tab>

          <!-- Tab 3: Disburse / Repay -->
          <mat-tab label="Disburse / Repay">
            <div class="tab-content">
              <ion-item fill="outline">
                <ion-label position="stacked">{{ 'INTEROP.ACCOUNT_ID' | translate }}</ion-label>
                <ion-input [(ngModel)]="disburseAccountId"></ion-input>
              </ion-item>

              <div class="button-row">
                <ion-button color="primary" (click)="disburse()" [disabled]="!disburseAccountId">
                  {{ 'INTEROP.DISBURSE' | translate }}
                </ion-button>
                <ion-button
                  color="accent"
                  (click)="loanRepayment()"
                  [disabled]="!disburseAccountId"
                >
                  {{ 'INTEROP.LOAN_REPAYMENT' | translate }}
                </ion-button>
              </div>

              @if (result()) {
                <pre>{{ result() | json }}</pre>
              }
            </div>
          </mat-tab>
        </mat-tab-group>
      </ion-card-content>
    </ion-card>
  `,
  styles: [
    `
      .tab-content {
        padding: 16px 0;
        display: flex;
        flex-direction: column;
        gap: 16px;
      }
      mat-form-field {
        width: 300px;
      }
      .full-width {
        width: 100%;
      }
      .button-row {
        display: flex;
        gap: 12px;
      }
      pre {
        background: #f5f5f5;
        padding: 12px;
        border-radius: 4px;
        overflow: auto;
      }
    `,
  ],
})
export class InteropTransfersComponent {
  private interopService = inject(InterOperationService);
  private notifications = inject(NotificationService);

  result = signal<InteropTransferResponseData | string | null>(null);

  transactionCode = '';
  transferCode = '';

  transferBodyJson = '{}';
  transferAction = 'create';

  disburseAccountId = '';

  loadTransfer(): void {
    this.result.set(null);
    this.interopService
      .getInteroperationTransactionsTransactionCodeTransfersTransferCode(
        this.transactionCode,
        this.transferCode,
      )
      .subscribe({
        next: (data) => this.result.set(data),
        error: (err: { message?: string }) =>
          this.notifications.error(err.message || ERROR_OCCURRED),
      });
  }

  createTransfer(): void {
    this.result.set(null);
    let body: InteropTransferRequestData;
    try {
      body = JSON.parse(this.transferBodyJson) as InteropTransferRequestData;
    } catch {
      this.notifications.error('Invalid JSON');
      return;
    }
    this.interopService.postInteroperationTransfers(body, this.transferAction).subscribe({
      next: (data) => this.result.set(data),
      error: (err: { message?: string }) => this.notifications.error(err.message || ERROR_OCCURRED),
    });
  }

  disburse(): void {
    this.result.set(null);
    this.interopService
      .postInteroperationTransactionsAccountIdDisburse(this.disburseAccountId)
      .subscribe({
        next: (data) => this.result.set(data),
        error: (err: { message?: string }) =>
          this.notifications.error(err.message || ERROR_OCCURRED),
      });
  }

  loanRepayment(): void {
    this.result.set(null);
    this.interopService
      .postInteroperationTransactionsAccountIdLoanrepayment(this.disburseAccountId)
      .subscribe({
        next: (data) => this.result.set(data),
        error: (err: { message?: string }) =>
          this.notifications.error(err.message || ERROR_OCCURRED),
      });
  }
}
