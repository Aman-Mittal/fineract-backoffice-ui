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

import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import {
  SavingsAccountTransactionsService,
  PostSavingsAccountTransactionsRequest,
} from '../../api';

/**
 * Component for processing deposits and withdrawals on a savings account.
 *
 * Provides a unified form that adapts based on the 'command' route parameter.
 * Strictly binds to OpenAPI models and enforces yyyy-MM-dd date formatting.
 */
@Component({
  selector: 'app-savings-account-transaction-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTooltipModule,
  ],
  template: `
    <div class="form-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>
            {{
              command === 'deposit'
                ? ('SAVINGS.DEPOSIT' | translate)
                : ('SAVINGS.WITHDRAWAL' | translate)
            }}
          </mat-card-title>
        </mat-card-header>

        <mat-card-content>
          <form #transactionForm="ngForm" (ngSubmit)="onSubmit()" class="transaction-form">
            <div class="form-grid">
              <!-- Transaction Date -->
              <mat-form-field
                appearance="outline"
                [matTooltip]="'HELP.TRANSACTION_DATE_DESC' | translate"
              >
                <mat-label>{{ 'COMMON.TRANSACTION_DATE' | translate }}</mat-label>
                <input
                  matInput
                  [matDatepicker]="picker"
                  name="transactionDate"
                  [(ngModel)]="transactionDate"
                  required
                />
                <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
                <mat-datepicker #picker></mat-datepicker>
              </mat-form-field>

              <!-- Transaction Amount -->
              <mat-form-field
                appearance="outline"
                [matTooltip]="'HELP.TRANSACTION_AMOUNT_DESC' | translate"
              >
                <mat-label>{{ 'COMMON.TRANSACTION_AMOUNT' | translate }}</mat-label>
                <input
                  matInput
                  type="number"
                  name="transactionAmount"
                  [(ngModel)]="transaction.transactionAmount"
                  required
                />
              </mat-form-field>

              <!-- Payment Type -->
              <mat-form-field
                appearance="outline"
                [matTooltip]="'HELP.PAYMENT_TYPE_DESC' | translate"
              >
                <mat-label>{{ 'COMMON.PAYMENT_TYPE' | translate }}</mat-label>
                <mat-select name="paymentTypeId" [(ngModel)]="transaction.paymentTypeId">
                  @for (type of paymentTypeOptions; track type['id']) {
                    <mat-option [value]="type['id']">{{ type['name'] }}</mat-option>
                  }
                </mat-select>
              </mat-form-field>

              <!-- Note -->
              <mat-form-field
                appearance="outline"
                [matTooltip]="'HELP.NOTE_DESC' | translate"
                class="full-width"
              >
                <mat-label>{{ 'COMMON.NOTE' | translate }}</mat-label>
                <textarea matInput name="note" [(ngModel)]="note" rows="3"></textarea>
              </mat-form-field>
            </div>

            <div class="form-actions">
              <button mat-button type="button" (click)="onCancel()">
                {{ 'COMMON.CANCEL' | translate }}
              </button>
              <button
                mat-raised-button
                color="primary"
                type="submit"
                [disabled]="transactionForm.invalid || isSaving"
              >
                {{ isSaving ? ('COMMON.SAVING' | translate) : ('COMMON.SAVE' | translate) }}
              </button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [
    `
      .form-container {
        padding: 24px;
        max-width: 800px;
        margin: 0 auto;
      }
      .transaction-form {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }
      .form-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 16px;
      }
      .full-width {
        grid-column: span 2;
      }
      mat-form-field {
        width: 100%;
      }
      .form-actions {
        display: flex;
        justify-content: flex-end;
        gap: 12px;
        margin-top: 16px;
      }
    `,
  ],
})
export class SavingsAccountTransactionFormComponent implements OnInit {
  /** Service for savings transaction management */
  private readonly transactionService = inject(SavingsAccountTransactionsService);
  /** Router for navigation */
  private readonly router = inject(Router);
  /** Activated route for context */
  private readonly route = inject(ActivatedRoute);

  /** Savings account identifier */
  accountId = 0;
  /** Transaction command (deposit/withdrawal) */
  command = '';
  /** State of the save operation */
  isSaving = false;

  /** Transaction request model */
  transaction: PostSavingsAccountTransactionsRequest = {};
  /** Note bound separately as it might not be in the direct model */
  note = '';
  /** Date object for template binding */
  transactionDate: Date = new Date();
  /** Payment type options (usually loaded from template) */
  paymentTypeOptions: Record<string, unknown>[] = [];

  /**
   * Initializes the component and loads context.
   */
  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.accountId = +params['accountId'];
      this.command = params['command'];
      this.loadTemplate();
    });
  }

  /**
   * Fetches the transaction template for the current account.
   */
  private loadTemplate(): void {
    this.transactionService.retrieveTemplate19(this.accountId).subscribe({
      next: (template: string) => {
        // Handle template parsing if necessary (OpenAPI sometimes returns generic string/any)
        const data = typeof template === 'string' ? JSON.parse(template) : template;
        this.paymentTypeOptions = data.paymentTypeOptions || [];
        if (data.date) {
          this.transactionDate = new Date(data.date[0], data.date[1] - 1, data.date[2]);
        }
      },
      error: (err: unknown) => {
        console.error('Failed to load savings transaction template', err);
      },
    });
  }

  /**
   * Submits the transaction to the API.
   */
  onSubmit(): void {
    this.isSaving = true;

    const formattedDate = `${this.transactionDate.getFullYear()}-${String(
      this.transactionDate.getMonth() + 1,
    ).padStart(2, '0')}-${String(this.transactionDate.getDate()).padStart(2, '0')}`;

    this.transaction.transactionDate = formattedDate;
    this.transaction.dateFormat = 'yyyy-MM-dd';
    this.transaction.locale = 'en';

    // Incorporate note into payload
    const payload: Record<string, unknown> = {
      ...this.transaction,
      note: this.note,
    };

    this.transactionService
      .transaction2(this.accountId, payload as PostSavingsAccountTransactionsRequest, this.command)
      .subscribe({
        next: () => this.router.navigate(['/products/savings-accounts']),
        error: () => (this.isSaving = false),
      });
  }

  /**
   * Navigates back to the savings accounts list.
   */
  onCancel(): void {
    this.router.navigate(['/products/savings-accounts']);
  }
}
