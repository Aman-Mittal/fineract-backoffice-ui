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
import { JsonPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LoanCOBCatchUpService } from '../../../api';

@Component({
  selector: 'app-loan-cob-catchup',
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
        <mat-card-title>{{ 'LOAN_COB_CATCHUP.TITLE' | translate }}</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <div class="section">
          <button mat-raised-button color="primary" (click)="checkStatus()">
            {{ 'LOAN_COB_CATCHUP.CHECK_STATUS' | translate }}
          </button>

          @if (statusChecked) {
            <p>
              {{ 'LOAN_COB_CATCHUP.IS_RUNNING' | translate }}:
              <strong>{{ isRunning() }}</strong>
            </p>
          }
        </div>

        <mat-divider></mat-divider>

        <div class="section">
          <mat-form-field appearance="outline">
            <mat-label>{{ 'LOAN_COB_CATCHUP.LOAN_ID' | translate }}</mat-label>
            <input matInput type="number" [(ngModel)]="loanId" />
          </mat-form-field>

          <button
            mat-raised-button
            color="primary"
            [disabled]="!loanId"
            (click)="getOldestCobDate()"
          >
            {{ 'LOAN_COB_CATCHUP.GET_OLDEST_DATE' | translate }}
          </button>

          @if (oldestDate() !== null) {
            <div>
              <h4>{{ 'LOAN_COB_CATCHUP.OLDEST_DATE' | translate }}</h4>
              <pre>{{ oldestDate() | json }}</pre>
            </div>
          }
        </div>

        <mat-divider></mat-divider>

        <div class="section">
          <mat-form-field appearance="outline">
            <mat-label>{{ 'LOAN_COB_CATCHUP.LOAN_ID' | translate }}</mat-label>
            <input matInput type="number" [(ngModel)]="catchupLoanId" />
          </mat-form-field>

          <button
            mat-raised-button
            color="accent"
            [disabled]="!catchupLoanId"
            (click)="runCatchup()"
          >
            {{ 'LOAN_COB_CATCHUP.RUN_CATCHUP' | translate }}
          </button>
        </div>
      </mat-card-content>
    </mat-card>
  `,
  styles: [
    `
      .section {
        display: flex;
        flex-direction: column;
        gap: 16px;
        padding: 16px 0;
      }
      mat-form-field {
        width: 100%;
        max-width: 400px;
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
export class LoanCobCatchupComponent {
  private readonly loanCOBCatchUpService = inject(LoanCOBCatchUpService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly translate = inject(TranslateService);

  isRunning = signal<boolean | null>(null);
  oldestDate = signal<any>(null);
  statusChecked = false;
  loanId = 0;
  catchupLoanId = 0;

  checkStatus(): void {
    this.loanCOBCatchUpService.getLoansIsCatchUpRunning().subscribe({
      next: (data: any) => {
        this.isRunning.set(data);
        this.statusChecked = true;
      },
      error: () => {
        this.statusChecked = true;
      },
    });
  }

  getOldestCobDate(): void {
    this.loanCOBCatchUpService.getLoansOldestCobClosed().subscribe({
      next: (data: any) => {
        this.oldestDate.set(data);
      },
      error: () => {
        this.oldestDate.set(null);
      },
    });
  }

  runCatchup(): void {
    this.loanCOBCatchUpService.postLoansCatchUp().subscribe({
      next: () => {
        this.translate.get('LOAN_COB_CATCHUP.SUCCESS').subscribe((msg) => {
          this.snackBar.open(msg, undefined, { duration: 3000 });
        });
      },
      error: () => {},
    });
  }
}
