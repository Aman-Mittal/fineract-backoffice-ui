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
import { JsonPipe } from '@angular/common';
import { MatDividerModule } from '@angular/material/divider';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { WorkingCapitalLoanCOBCatchUpService, OldestCOBProcessedLoanDTO } from '../../../../api';
import { NotificationService } from '../../../../core/services/notification.service';
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonInput,
  IonItem,
  IonLabel,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-wc-loan-cob-catchup',
  standalone: true,
  imports: [
    FormsModule,
    JsonPipe,
    MatDividerModule,
    TranslateModule,
    IonButton,
    IonInput,
    IonItem,
    IonLabel,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonCard,
  ],
  template: `
    <ion-card>
      <ion-card-header>
        <ion-card-title>{{ 'WC_LOAN_COB_CATCHUP.TITLE' | translate }}</ion-card-title>
      </ion-card-header>
      <ion-card-content>
        <!-- Check Status Section -->
        <section class="section">
          <ion-button color="primary" (click)="checkStatus()">
            {{ 'WC_LOAN_COB_CATCHUP.CHECK_STATUS' | translate }}
          </ion-button>
          @if (isRunning() !== null) {
            <p class="result-text">
              {{ 'WC_LOAN_COB_CATCHUP.IS_RUNNING' | translate }}: {{ isRunning() | json }}
            </p>
          }
        </section>

        <mat-divider />

        <!-- Get Oldest COB Date Section -->
        <section class="section">
          <ion-item fill="outline">
            <ion-label position="stacked">{{
              'WC_LOAN_COB_CATCHUP.LOAN_ID' | translate
            }}</ion-label>
            <ion-input type="number" [(ngModel)]="loanId"></ion-input>
          </ion-item>

          <ion-button color="accent" [disabled]="!loanId" (click)="getOldestDate()">
            {{ 'WC_LOAN_COB_CATCHUP.GET_OLDEST_DATE' | translate }}
          </ion-button>

          @if (oldestDate() !== null) {
            <p class="result-text">
              {{ 'WC_LOAN_COB_CATCHUP.OLDEST_DATE' | translate }}: {{ oldestDate() | json }}
            </p>
          }
        </section>

        <mat-divider />

        <!-- Run COB Catch-Up Section -->
        <section class="section">
          <ion-item fill="outline">
            <ion-label position="stacked">{{
              'WC_LOAN_COB_CATCHUP.LOAN_ID' | translate
            }}</ion-label>
            <ion-input type="number" [(ngModel)]="catchupLoanId"></ion-input>
          </ion-item>

          <ion-button color="warn" [disabled]="!catchupLoanId" (click)="runCatchup()">
            {{ 'WC_LOAN_COB_CATCHUP.RUN_CATCHUP' | translate }}
          </ion-button>
        </section>
      </ion-card-content>
    </ion-card>
  `,
  styles: [
    `
      .section {
        display: flex;
        flex-direction: column;
        gap: 8px;
        margin: 16px 0;
        max-width: 400px;
      }
      .result-text {
        margin: 4px 0 0;
        font-size: 0.875rem;
        color: rgba(0, 0, 0, 0.6);
        word-break: break-all;
      }
      mat-divider {
        margin: 8px 0;
      }
    `,
  ],
})
export class WcLoanCobCatchupComponent {
  private cobCatchupService = inject(WorkingCapitalLoanCOBCatchUpService);
  private notifications = inject(NotificationService);
  private translate = inject(TranslateService);

  isRunning = signal<boolean | null>(null);
  oldestDate = signal<OldestCOBProcessedLoanDTO | null>(null);
  loanId = 0;
  catchupLoanId = 0;

  checkStatus(): void {
    this.cobCatchupService.getWorkingCapitalLoansIsCatchUpRunning().subscribe({
      next: (result) => this.isRunning.set(result?.catchUpRunning ?? false),
      error: () => this.showError(),
    });
  }

  getOldestDate(): void {
    this.cobCatchupService.getWorkingCapitalLoansOldestCobClosed().subscribe({
      next: (result) => this.oldestDate.set(result),
      error: () => this.showError(),
    });
  }

  runCatchup(): void {
    this.cobCatchupService.postWorkingCapitalLoansCatchUp().subscribe({
      next: () => {
        this.notifications.success(this.translate.instant('WC_LOAN_COB_CATCHUP.SUCCESS'));
      },
      error: () => this.showError(),
    });
  }

  private showError(): void {
    this.notifications.error(this.translate.instant('WC_LOAN_COB_CATCHUP.ERROR'));
  }
}
