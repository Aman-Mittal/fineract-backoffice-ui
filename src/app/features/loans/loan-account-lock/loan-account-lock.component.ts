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
import { LoanAccountLockService } from '../../../api';

@Component({
  selector: 'app-loan-account-lock',
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
        <mat-card-title>{{ 'LOAN_ACCOUNT_LOCK.TITLE' | translate }}</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <div class="section">
          <mat-form-field appearance="outline">
            <mat-label>{{ 'LOAN_ACCOUNT_LOCK.LOAN_ID' | translate }}</mat-label>
            <input matInput type="number" [(ngModel)]="loanId" required />
          </mat-form-field>

          <button
            mat-raised-button
            color="primary"
            [disabled]="isLoading || !loanId"
            (click)="checkLock()"
          >
            @if (isLoading) {
              <mat-spinner diameter="20"></mat-spinner>
            } @else {
              {{ 'LOAN_ACCOUNT_LOCK.CHECK_LOCK' | translate }}
            }
          </button>

          @if (lockChecked()) {
            <div class="lock-info">
              <h4>{{ 'LOAN_ACCOUNT_LOCK.LOCK_INFO' | translate }}</h4>
              @if (lockInfo()) {
                <pre>{{ lockInfo() | json }}</pre>
              } @else {
                <p>{{ 'LOAN_ACCOUNT_LOCK.NO_LOCK' | translate }}</p>
              }
            </div>
          }
        </div>

        <mat-divider></mat-divider>

        <div class="section">
          <h3>{{ 'LOAN_ACCOUNT_LOCK.PLACE_LOCK' | translate }}</h3>

          <mat-form-field appearance="outline">
            <mat-label>{{ 'LOAN_ACCOUNT_LOCK.LOCK_OWNER' | translate }}</mat-label>
            <input matInput type="text" [(ngModel)]="lockOwner" />
          </mat-form-field>

          <button
            mat-raised-button
            color="accent"
            [disabled]="isLoading || !loanId || !lockOwner"
            (click)="placeLock()"
          >
            {{ 'LOAN_ACCOUNT_LOCK.PLACE_LOCK' | translate }}
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
      .lock-info pre {
        background: #f5f5f5;
        padding: 12px;
        border-radius: 4px;
        overflow: auto;
      }
    `,
  ],
})
export class LoanAccountLockComponent {
  private readonly loanAccountLockService = inject(LoanAccountLockService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly translate = inject(TranslateService);

  lockInfo = signal<any>(null);
  lockChecked = signal(false);
  isLoading = false;
  loanId = 0;
  lockOwner = '';

  checkLock(): void {
    this.isLoading = true;
    this.loanAccountLockService.getLoansLocked().subscribe({
      next: (data: any) => {
        this.lockInfo.set(data ?? null);
        this.lockChecked.set(true);
        this.isLoading = false;
      },
      error: () => {
        this.lockInfo.set(null);
        this.lockChecked.set(true);
        this.isLoading = false;
      },
    });
  }

  placeLock(): void {
    this.isLoading = true;
    this.loanAccountLockService
      .postInternalLoansLoanIdPlaceLockLockOwner(this.loanId, this.lockOwner)
      .subscribe({
        next: () => {
          this.isLoading = false;
          this.translate.get('LOAN_ACCOUNT_LOCK.SUCCESS').subscribe((msg) => {
            this.snackBar.open(msg, undefined, { duration: 3000 });
          });
        },
        error: () => {
          this.isLoading = false;
        },
      });
  }
}
