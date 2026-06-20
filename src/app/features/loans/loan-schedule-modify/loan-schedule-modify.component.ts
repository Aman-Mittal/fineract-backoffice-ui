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
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { TranslateModule } from '@ngx-translate/core';
import { LoanReschedulingService } from '../../../api';

@Component({
  selector: 'app-loan-schedule-modify',
  standalone: true,
  imports: [
    FormsModule,
    JsonPipe,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    TranslateModule,
  ],
  template: `
    <mat-card>
      <mat-card-header>
        <mat-card-title>{{ 'LOAN_SCHEDULE_MODIFY.TITLE' | translate }}</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <div class="form-grid">
          <mat-form-field appearance="outline">
            <mat-label>{{ 'LOAN_SCHEDULE_MODIFY.LOAN_ID' | translate }}</mat-label>
            <input matInput type="number" [(ngModel)]="loanId" required />
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>{{ 'LOAN_SCHEDULE_MODIFY.COMMAND' | translate }}</mat-label>
            <mat-select [(ngModel)]="command" required>
              @for (cmd of commands; track cmd.value) {
                <mat-option [value]="cmd.value">{{ cmd.label }}</mat-option>
              }
            </mat-select>
          </mat-form-field>
        </div>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>{{ 'LOAN_SCHEDULE_MODIFY.BODY' | translate }}</mat-label>
          <textarea
            matInput
            [(ngModel)]="bodyText"
            rows="6"
            [placeholder]="'LOAN_SCHEDULE_MODIFY.BODY_PLACEHOLDER' | translate"
          ></textarea>
        </mat-form-field>

        <div class="form-actions">
          <button
            mat-raised-button
            color="primary"
            [disabled]="!loanId || !command || isLoading"
            (click)="submit()"
          >
            @if (isLoading) {
              <mat-spinner diameter="20"></mat-spinner>
            } @else {
              {{ 'LOAN_SCHEDULE_MODIFY.SUBMIT' | translate }}
            }
          </button>
        </div>

        @if (response() !== null) {
          <mat-card class="response-card">
            <mat-card-header>
              <mat-card-title>{{ 'LOAN_SCHEDULE_MODIFY.RESPONSE' | translate }}</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <pre>{{ response() | json }}</pre>
            </mat-card-content>
          </mat-card>
        }
      </mat-card-content>
    </mat-card>
  `,
  styles: [
    `
      .form-grid {
        display: flex;
        flex-wrap: wrap;
        gap: 16px;
      }
      .form-grid mat-form-field {
        flex: 1 1 200px;
      }
      .full-width {
        width: 100%;
        margin-top: 8px;
      }
      .form-actions {
        margin: 8px 0 16px;
      }
      mat-spinner {
        display: inline-block;
      }
      .response-card {
        margin-top: 16px;
      }
      pre {
        background: #f5f5f5;
        padding: 12px;
        border-radius: 4px;
        overflow: auto;
        font-size: 0.8rem;
      }
    `,
  ],
})
export class LoanScheduleModifyComponent {
  private readonly loanReschedulingService = inject(LoanReschedulingService);
  private readonly snackBar = inject(MatSnackBar);

  loanId = 0;
  command = '';
  bodyText = '';
  isLoading = false;

  response = signal<any>(null);

  commands = [
    { value: 'calculateRepaymentSchedule', label: 'Calculate Repayment Schedule' },
    { value: 'forceRecalculateRepaymentSchedule', label: 'Force Recalculate Repayment Schedule' },
  ];

  submit(): void {
    if (!this.loanId || !this.command) return;

    let body: object = {};
    if (this.bodyText.trim()) {
      try {
        body = JSON.parse(this.bodyText);
      } catch {
        this.snackBar.open('Invalid JSON body', 'Close', { duration: 3000 });
        return;
      }
    }

    this.isLoading = true;
    this.response.set(null);

    this.loanReschedulingService
      .postLoansLoanIdSchedule(this.loanId, body, this.command)
      .subscribe({
        next: (data: any) => {
          this.response.set(data);
          this.isLoading = false;
        },
        error: (err: any) => {
          this.response.set(err?.error ?? { error: 'Request failed' });
          this.isLoading = false;
        },
      });
  }
}
