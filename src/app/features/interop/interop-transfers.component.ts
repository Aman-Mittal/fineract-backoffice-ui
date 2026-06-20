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
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { TranslateModule } from '@ngx-translate/core';
import { InterOperationService } from '../../api';

@Component({
  selector: 'app-interop-transfers',
  standalone: true,
  imports: [
    FormsModule,
    JsonPipe,
    MatCardModule,
    MatTabsModule,
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
        <mat-card-title>{{ 'INTEROP.TRANSFER_TITLE' | translate }}</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <mat-tab-group>
          <!-- Tab 1: Get Transfer -->
          <mat-tab [label]="'INTEROP.LOAD_TRANSFER' | translate">
            <div class="tab-content">
              <mat-form-field>
                <mat-label>{{ 'INTEROP.TRANSACTION_CODE' | translate }}</mat-label>
                <input matInput [(ngModel)]="transactionCode" />
              </mat-form-field>

              <mat-form-field>
                <mat-label>{{ 'INTEROP.TRANSFER_CODE' | translate }}</mat-label>
                <input matInput [(ngModel)]="transferCode" />
              </mat-form-field>

              <button
                mat-raised-button
                color="primary"
                (click)="loadTransfer()"
                [disabled]="!transactionCode || !transferCode"
              >
                {{ 'INTEROP.LOAD_TRANSFER' | translate }}
              </button>

              @if (result()) {
                <pre>{{ result() | json }}</pre>
              }
            </div>
          </mat-tab>

          <!-- Tab 2: Create Transfer -->
          <mat-tab [label]="'INTEROP.CREATE_TRANSFER' | translate">
            <div class="tab-content">
              <mat-form-field class="full-width">
                <mat-label>{{ 'INTEROP.TRANSFER_BODY' | translate }}</mat-label>
                <textarea matInput rows="10" [(ngModel)]="transferBodyJson"></textarea>
              </mat-form-field>

              <mat-form-field>
                <mat-label>{{ 'INTEROP.ACTION' | translate }}</mat-label>
                <mat-select [(ngModel)]="transferAction">
                  <mat-option value="prepare">prepare</mat-option>
                  <mat-option value="create">create</mat-option>
                </mat-select>
              </mat-form-field>

              <button mat-raised-button color="accent" (click)="createTransfer()">
                {{ 'INTEROP.CREATE_TRANSFER' | translate }}
              </button>

              @if (result()) {
                <pre>{{ result() | json }}</pre>
              }
            </div>
          </mat-tab>

          <!-- Tab 3: Disburse / Repay -->
          <mat-tab label="Disburse / Repay">
            <div class="tab-content">
              <mat-form-field>
                <mat-label>{{ 'INTEROP.ACCOUNT_ID' | translate }}</mat-label>
                <input matInput [(ngModel)]="disburseAccountId" />
              </mat-form-field>

              <div class="button-row">
                <button
                  mat-raised-button
                  color="primary"
                  (click)="disburse()"
                  [disabled]="!disburseAccountId"
                >
                  {{ 'INTEROP.DISBURSE' | translate }}
                </button>
                <button
                  mat-raised-button
                  color="accent"
                  (click)="loanRepayment()"
                  [disabled]="!disburseAccountId"
                >
                  {{ 'INTEROP.LOAN_REPAYMENT' | translate }}
                </button>
              </div>

              @if (result()) {
                <pre>{{ result() | json }}</pre>
              }
            </div>
          </mat-tab>
        </mat-tab-group>
      </mat-card-content>
    </mat-card>
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
  private snackBar = inject(MatSnackBar);

  result = signal<any>(null);

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
        next: (data: any) => this.result.set(data),
        error: (err: any) => this.snackBar.open(err.message, 'Close', { duration: 4000 }),
      });
  }

  createTransfer(): void {
    this.result.set(null);
    let body: any;
    try {
      body = JSON.parse(this.transferBodyJson);
    } catch {
      this.snackBar.open('Invalid JSON', 'Close', { duration: 4000 });
      return;
    }
    this.interopService.postInteroperationTransfers(body, this.transferAction).subscribe({
      next: (data: any) => this.result.set(data),
      error: (err: any) => this.snackBar.open(err.message, 'Close', { duration: 4000 }),
    });
  }

  disburse(): void {
    this.result.set(null);
    this.interopService
      .postInteroperationTransactionsAccountIdDisburse(this.disburseAccountId)
      .subscribe({
        next: (data: any) => this.result.set(data),
        error: (err: any) => this.snackBar.open(err.message, 'Close', { duration: 4000 }),
      });
  }

  loanRepayment(): void {
    this.result.set(null);
    this.interopService
      .postInteroperationTransactionsAccountIdLoanrepayment(this.disburseAccountId)
      .subscribe({
        next: (data: any) => this.result.set(data),
        error: (err: any) => this.snackBar.open(err.message, 'Close', { duration: 4000 }),
      });
  }
}
