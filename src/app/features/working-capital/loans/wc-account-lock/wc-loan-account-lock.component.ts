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
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { WorkingCapitalLoanAccountLockService } from '../../../../api';

@Component({
  selector: 'app-wc-loan-account-lock',
  standalone: true,
  imports: [
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    TranslateModule,
  ],
  template: `
    <mat-card>
      <mat-card-header>
        <mat-card-title>{{ 'WC_LOAN_ACCOUNT_LOCK.TITLE' | translate }}</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <div class="form-fields">
          <mat-form-field appearance="outline">
            <mat-label>{{ 'WC_LOAN_ACCOUNT_LOCK.LOAN_ID' | translate }}</mat-label>
            <input matInput type="number" [(ngModel)]="loanId" required />
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>{{ 'WC_LOAN_ACCOUNT_LOCK.LOCK_OWNER' | translate }}</mat-label>
            <input matInput type="text" [(ngModel)]="lockOwner" />
          </mat-form-field>
        </div>

        <div class="actions">
          <button
            mat-raised-button
            color="primary"
            [disabled]="!loanId || isLoading"
            (click)="placeLock()"
          >
            @if (isLoading) {
              <mat-spinner diameter="20" />
            } @else {
              {{ 'WC_LOAN_ACCOUNT_LOCK.PLACE_LOCK' | translate }}
            }
          </button>
        </div>
      </mat-card-content>
    </mat-card>
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
