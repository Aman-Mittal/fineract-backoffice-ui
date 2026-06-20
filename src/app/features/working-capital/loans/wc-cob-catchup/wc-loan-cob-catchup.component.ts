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
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { WorkingCapitalLoanCOBCatchUpService } from '../../../../api';

@Component({
  selector: 'app-wc-loan-cob-catchup',
  standalone: true,
  imports: [
    FormsModule,
    JsonPipe,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    TranslateModule,
  ],
  template: `
    <mat-card>
      <mat-card-header>
        <mat-card-title>{{ 'WC_LOAN_COB_CATCHUP.TITLE' | translate }}</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <!-- Check Status Section -->
        <section class="section">
          <button mat-raised-button color="primary" (click)="checkStatus()">
            {{ 'WC_LOAN_COB_CATCHUP.CHECK_STATUS' | translate }}
          </button>
          @if (isRunning() !== null) {
            <p class="result-text">
              {{ 'WC_LOAN_COB_CATCHUP.IS_RUNNING' | translate }}: {{ isRunning() | json }}
            </p>
          }
        </section>

        <mat-divider />

        <!-- Get Oldest COB Date Section -->
        <section class="section">
          <mat-form-field appearance="outline">
            <mat-label>{{ 'WC_LOAN_COB_CATCHUP.LOAN_ID' | translate }}</mat-label>
            <input matInput type="number" [(ngModel)]="loanId" />
          </mat-form-field>

          <button mat-raised-button color="accent" [disabled]="!loanId" (click)="getOldestDate()">
            {{ 'WC_LOAN_COB_CATCHUP.GET_OLDEST_DATE' | translate }}
          </button>

          @if (oldestDate() !== null) {
            <p class="result-text">
              {{ 'WC_LOAN_COB_CATCHUP.OLDEST_DATE' | translate }}: {{ oldestDate() | json }}
            </p>
          }
        </section>

        <mat-divider />

        <!-- Run COB Catch-Up Section -->
        <section class="section">
          <mat-form-field appearance="outline">
            <mat-label>{{ 'WC_LOAN_COB_CATCHUP.LOAN_ID' | translate }}</mat-label>
            <input matInput type="number" [(ngModel)]="catchupLoanId" />
          </mat-form-field>

          <button mat-raised-button color="warn" [disabled]="!catchupLoanId" (click)="runCatchup()">
            {{ 'WC_LOAN_COB_CATCHUP.RUN_CATCHUP' | translate }}
          </button>
        </section>
      </mat-card-content>
    </mat-card>
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
  private snackBar = inject(MatSnackBar);
  private translate = inject(TranslateService);

  isRunning = signal<boolean | null>(null);
  oldestDate = signal<any>(null);
  loanId = 0;
  catchupLoanId = 0;

  checkStatus(): void {
    this.cobCatchupService.getWorkingCapitalLoansIsCatchUpRunning().subscribe({
      next: (result: any) => this.isRunning.set(result),
      error: () => this.showError(),
    });
  }

  getOldestDate(): void {
    this.cobCatchupService.getWorkingCapitalLoansOldestCobClosed().subscribe({
      next: (result: any) => this.oldestDate.set(result),
      error: () => this.showError(),
    });
  }

  runCatchup(): void {
    this.cobCatchupService.postWorkingCapitalLoansCatchUp().subscribe({
      next: () => {
        this.snackBar.open(this.translate.instant('WC_LOAN_COB_CATCHUP.SUCCESS'), undefined, {
          duration: 3000,
        });
      },
      error: () => this.showError(),
    });
  }

  private showError(): void {
    this.snackBar.open(this.translate.instant('WC_LOAN_COB_CATCHUP.ERROR'), undefined, {
      duration: 3000,
    });
  }
}
