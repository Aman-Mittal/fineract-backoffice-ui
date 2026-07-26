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
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { WorkingCapitalLoanAccountLockService } from '../../../../api';
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
  selector: 'app-wc-loan-account-lock',
  standalone: true,
  imports: [
    FormsModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
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
        <ion-card-title>{{ 'WC_LOAN_ACCOUNT_LOCK.TITLE' | translate }}</ion-card-title>
      </ion-card-header>
      <ion-card-content>
        <div class="form-fields">
          <ion-item fill="outline">
            <ion-label position="stacked">{{
              'WC_LOAN_ACCOUNT_LOCK.LOAN_ID' | translate
            }}</ion-label>
            <ion-input type="number" [(ngModel)]="loanId" required></ion-input>
          </ion-item>

          <ion-item fill="outline">
            <ion-label position="stacked">{{
              'WC_LOAN_ACCOUNT_LOCK.LOCK_OWNER' | translate
            }}</ion-label>
            <ion-input type="text" [(ngModel)]="lockOwner"></ion-input>
          </ion-item>
        </div>

        <div class="actions">
          <ion-button color="primary" [disabled]="!loanId || isLoading" (click)="placeLock()">
            @if (isLoading) {
              <mat-spinner diameter="20" />
            } @else {
              {{ 'WC_LOAN_ACCOUNT_LOCK.PLACE_LOCK' | translate }}
            }
          </ion-button>
        </div>
      </ion-card-content>
    </ion-card>
  `,
  styles: [
    `
      .form-fields {
        display: flex;
        flex-direction: column;
        gap: 8px;
        margin-top: 8px;
        max-width: 400px;
      }
      .actions {
        margin-top: 8px;
      }
      mat-spinner {
        display: inline-block;
      }
    `,
  ],
})
export class WcLoanAccountLockComponent {
  private accountLockService = inject(WorkingCapitalLoanAccountLockService);
  private snackBar = inject(MatSnackBar);
  private translate = inject(TranslateService);

  loanId = 0;
  lockOwner = '';
  isLoading = false;

  placeLock(): void {
    this.isLoading = true;
    this.accountLockService
      .postInternalWorkingCapitalLoansLoanIdPlaceLockLockOwner(this.loanId, this.lockOwner)
      .subscribe({
        next: () => {
          this.isLoading = false;
          this.snackBar.open(this.translate.instant('WC_LOAN_ACCOUNT_LOCK.SUCCESS'), undefined, {
            duration: 3000,
          });
        },
        error: () => {
          this.isLoading = false;
          this.snackBar.open(this.translate.instant('WC_LOAN_ACCOUNT_LOCK.ERROR'), undefined, {
            duration: 3000,
          });
        },
      });
  }
}
