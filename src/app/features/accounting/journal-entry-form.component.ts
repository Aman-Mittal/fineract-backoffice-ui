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

import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {
  JournalEntriesService,
  JournalEntryCommand,
  SingleDebitOrCreditEntryCommand,
  GeneralLedgerAccountService,
  GetGLAccountsResponse,
  OfficesService,
  GetOfficesResponse,
  CurrencyService,
  CurrencyConfigurationData,
  CurrencyData,
} from '../../api';
import { HelpIconComponent } from '../../shared';

/**
 * Component for creating manual accounting journal entries.
 *
 * Supports multi-row debit and credit entries with account selection.
 */
@Component({
  selector: 'app-journal-entry-form',
  standalone: true,
  imports: [
    FormsModule,
    TranslateModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    HelpIconComponent,
  ],
  template: `
    <div class="form-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>
            Add Journal Entry
            <app-help-icon [helpTextKey]="'HELP.JOURNAL_ENTRIES_DESC'"></app-help-icon>
          </mat-card-title>
        </mat-card-header>

        <mat-card-content>
          <form #entryForm="ngForm" (ngSubmit)="onSubmit()" class="journal-entry-form">
            <div class="form-grid">
              <!-- Office -->
              <mat-form-field appearance="outline">
                <mat-label>Office</mat-label>
                <mat-select name="officeId" [(ngModel)]="command.officeId" required>
                  @for (office of offices; track office.id) {
                    <mat-option [value]="office.id">{{ office.name }}</mat-option>
                  }
                </mat-select>
              </mat-form-field>

              <!-- Currency -->
              <mat-form-field appearance="outline">
                <mat-label>Currency</mat-label>
                <mat-select name="currencyCode" [(ngModel)]="command.currencyCode" required>
                  @for (currency of currencies; track currency.code) {
                    <mat-option [value]="currency.code">{{ currency.name }}</mat-option>
                  }
                </mat-select>
              </mat-form-field>

              <!-- Transaction Date -->
              <mat-form-field appearance="outline">
                <mat-label>Transaction Date</mat-label>
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

              <!-- Reference Number -->
              <mat-form-field appearance="outline">
                <mat-label>Reference Number</mat-label>
                <input matInput name="referenceNumber" [(ngModel)]="command.referenceNumber" />
              </mat-form-field>
            </div>

            <div class="entries-section">
              <h3>Debits</h3>
              @for (debit of debits; track $index) {
                <div class="entry-row">
                  <mat-form-field appearance="outline" class="account-field">
                    <mat-label>Account</mat-label>
                    <mat-select
                      name="debitAccount{{ $index }}"
                      [(ngModel)]="debit.glAccountId"
                      required
                    >
                      @for (account of glAccounts; track account.id) {
                        <mat-option [value]="account.id"
                          >{{ account.name }} ({{ account.glCode }})</mat-option
                        >
                      }
                    </mat-select>
                  </mat-form-field>
                  <mat-form-field appearance="outline" class="amount-field">
                    <mat-label>Amount</mat-label>
                    <input
                      matInput
                      type="number"
                      name="debitAmount{{ $index }}"
                      [(ngModel)]="debit.amount"
                      required
                    />
                  </mat-form-field>
                  <button
                    mat-icon-button
                    color="warn"
                    type="button"
                    (click)="removeDebit($index)"
                    [disabled]="debits.length === 1"
                  >
                    <mat-icon>delete</mat-icon>
                  </button>
                </div>
              }
              <button mat-button color="primary" type="button" (click)="addDebit()">
                <mat-icon>add</mat-icon> Add Debit
              </button>
            </div>

            <div class="entries-section">
              <h3>Credits</h3>
              @for (credit of credits; track $index) {
                <div class="entry-row">
                  <mat-form-field appearance="outline" class="account-field">
                    <mat-label>Account</mat-label>
                    <mat-select
                      name="creditAccount{{ $index }}"
                      [(ngModel)]="credit.glAccountId"
                      required
                    >
                      @for (account of glAccounts; track account.id) {
                        <mat-option [value]="account.id"
                          >{{ account.name }} ({{ account.glCode }})</mat-option
                        >
                      }
                    </mat-select>
                  </mat-form-field>
                  <mat-form-field appearance="outline" class="amount-field">
                    <mat-label>Amount</mat-label>
                    <input
                      matInput
                      type="number"
                      name="creditAmount{{ $index }}"
                      [(ngModel)]="credit.amount"
                      required
                    />
                  </mat-form-field>
                  <button
                    mat-icon-button
                    color="warn"
                    type="button"
                    (click)="removeCredit($index)"
                    [disabled]="credits.length === 1"
                  >
                    <mat-icon>delete</mat-icon>
                  </button>
                </div>
              }
              <button mat-button color="primary" type="button" (click)="addCredit()">
                <mat-icon>add</mat-icon> Add Credit
              </button>
            </div>

            <!-- Comments -->
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Comments</mat-label>
              <textarea matInput name="comments" [(ngModel)]="command.comments" rows="3"></textarea>
            </mat-form-field>

            <div class="form-actions">
              <button mat-button type="button" (click)="onCancel()" [disabled]="isSaving">Cancel</button>
              <button
                mat-raised-button
                color="primary"
                type="submit"
                [disabled]="entryForm.invalid || isSaving || !isBalanced()"
              >
                @if (isSaving) {
                  <mat-spinner diameter="20" style="margin-right: 8px; display: inline-block; vertical-align: middle;"></mat-spinner>
                  Saving...
                } @else {
                  Save
                }
              </button>
            </div>
            @if (!isBalanced()) {
              <p class="error-text">Total debits must equal total credits.</p>
            }
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [
    `
      .form-container {
        padding: 24px;
        max-width: 1000px;
        margin: 0 auto;
      }
      .journal-entry-form {
        display: flex;
        flex-direction: column;
        gap: 24px;
      }
      .form-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 16px;
      }
      .entries-section {
        border: 1px solid #e0e0e0;
        padding: 16px;
        border-radius: 8px;
      }
      .entry-row {
        display: flex;
        gap: 16px;
        align-items: center;
        margin-bottom: 8px;
      }
      .account-field {
        flex: 2;
      }
      .amount-field {
        flex: 1;
      }
      .full-width {
        width: 100%;
      }
      .form-actions {
        display: flex;
        justify-content: flex-end;
        gap: 12px;
      }
      .error-text {
        color: #f44336;
        text-align: right;
        margin-top: -16px;
      }
    `,
  ],
})
export class JournalEntryFormComponent implements OnInit {
  private readonly journalService = inject(JournalEntriesService);
  private readonly glAccountService = inject(GeneralLedgerAccountService);
  private readonly officeService = inject(OfficesService);
  private readonly currencyService = inject(CurrencyService);
  private readonly router = inject(Router);

  offices: GetOfficesResponse[] = [];
  currencies: CurrencyData[] = [];
  glAccounts: GetGLAccountsResponse[] = [];

  command: JournalEntryCommand = {
    officeId: undefined,
    currencyCode: '',
    comments: '',
    referenceNumber: '',
  };

  transactionDate: Date = new Date();
  debits: SingleDebitOrCreditEntryCommand[] = [{ glAccountId: undefined, amount: 0 }];
  credits: SingleDebitOrCreditEntryCommand[] = [{ glAccountId: undefined, amount: 0 }];

  isSaving = false;

  ngOnInit() {
    this.loadData();
  }

  private loadData() {
    this.officeService
      .retrieveOffices()
      .subscribe((data: GetOfficesResponse[]) => (this.offices = data));
    this.currencyService.retrieveCurrencies().subscribe((data: CurrencyConfigurationData) => {
      this.currencies = data.selectedCurrencyOptions
        ? Array.from(data.selectedCurrencyOptions)
        : [];
    });
    this.glAccountService
      .retrieveAllAccounts()
      .subscribe((data: GetGLAccountsResponse[]) => (this.glAccounts = data));
  }

  addDebit() {
    this.debits.push({ glAccountId: undefined, amount: 0 });
  }

  removeDebit(index: number) {
    this.debits.splice(index, 1);
  }

  addCredit() {
    this.credits.push({ glAccountId: undefined, amount: 0 });
  }

  removeCredit(index: number) {
    this.credits.splice(index, 1);
  }

  isBalanced(): boolean {
    const totalDebits = this.debits.reduce((sum, d) => sum + (d.amount || 0), 0);
    const totalCredits = this.credits.reduce((sum, c) => sum + (c.amount || 0), 0);
    return Math.abs(totalDebits - totalCredits) < 0.001 && totalDebits > 0;
  }

  onSubmit() {
    this.isSaving = true;

    const formattedDate = `${this.transactionDate.getFullYear()}-${String(
      this.transactionDate.getMonth() + 1,
    ).padStart(2, '0')}-${String(this.transactionDate.getDate()).padStart(2, '0')}`;

    this.command.transactionDate = formattedDate;
    this.command.dateFormat = 'yyyy-MM-dd';
    this.command.locale = 'en';
    this.command.debits = this.debits;
    this.command.credits = this.credits;

    this.journalService.createGLJournalEntry(undefined, this.command).subscribe({
      next: () => this.router.navigate(['/accounting/journal-entries']),
      error: () => (this.isSaving = false),
    });
  }

  onCancel() {
    this.router.navigate(['/accounting/journal-entries']);
  }
}
