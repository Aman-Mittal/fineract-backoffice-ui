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
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TranslateModule } from '@ngx-translate/core';
import {
  InterOperationService,
  InteropAccountData,
  InteropIdentifiersResponseData,
  InteropKycResponseData,
  InteropTransactionsData,
} from '../../api';

@Component({
  selector: 'app-interop-account-view',
  standalone: true,
  imports: [
    FormsModule,
    JsonPipe,
    MatCardModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    TranslateModule,
  ],
  template: `
    <mat-card>
      <mat-card-header>
        <mat-card-title>{{ 'INTEROP.ACCOUNT_TITLE' | translate }}</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <mat-form-field>
          <mat-label>{{ 'INTEROP.ACCOUNT_ID' | translate }}</mat-label>
          <input matInput [(ngModel)]="accountId" />
        </mat-form-field>

        <div class="button-row">
          <button mat-raised-button color="primary" (click)="loadAccount()" [disabled]="!accountId">
            {{ 'INTEROP.LOAD_ACCOUNT' | translate }}
          </button>
          <button
            mat-raised-button
            color="primary"
            (click)="loadIdentifiers()"
            [disabled]="!accountId"
          >
            {{ 'INTEROP.LOAD_IDENTIFIERS' | translate }}
          </button>
          <button mat-raised-button color="primary" (click)="loadKyc()" [disabled]="!accountId">
            {{ 'INTEROP.LOAD_KYC' | translate }}
          </button>
          <button
            mat-raised-button
            color="primary"
            (click)="loadTransactions()"
            [disabled]="!accountId"
          >
            {{ 'INTEROP.LOAD_TRANSACTIONS' | translate }}
          </button>
        </div>

        <div class="filter-row">
          <mat-checkbox [(ngModel)]="debitFilter">{{ 'INTEROP.DEBIT' | translate }}</mat-checkbox>
          <mat-checkbox [(ngModel)]="creditFilter">{{ 'INTEROP.CREDIT' | translate }}</mat-checkbox>
        </div>

        @if (accountData()) {
          <h3>Account</h3>
          <pre>{{ accountData() | json }}</pre>
        }

        @if (identifiers()) {
          <h3>Identifiers</h3>
          <pre>{{ identifiers() | json }}</pre>
        }

        @if (kyc()) {
          <h3>KYC</h3>
          <pre>{{ kyc() | json }}</pre>
        }

        @if (transactions()) {
          <h3>Transactions</h3>
          <pre>{{ transactions() | json }}</pre>
        }
      </mat-card-content>
    </mat-card>
  `,
  styles: [
    `
      mat-form-field {
        width: 300px;
        display: block;
        margin-bottom: 16px;
      }
      .button-row {
        display: flex;
        gap: 12px;
        flex-wrap: wrap;
        margin-bottom: 16px;
      }
      .filter-row {
        display: flex;
        gap: 24px;
        margin-bottom: 16px;
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
export class InteropAccountViewComponent {
  private interopService = inject(InterOperationService);

  accountId = '';
  debitFilter = true;
  creditFilter = true;

  accountData = signal<InteropAccountData | null>(null);
  identifiers = signal<InteropIdentifiersResponseData | null>(null);
  kyc = signal<InteropKycResponseData | null>(null);
  transactions = signal<InteropTransactionsData | null>(null);

  loadAccount(): void {
    this.interopService.getInteroperationAccountsAccountId(this.accountId).subscribe({
      next: (data) => this.accountData.set(data),
    });
  }

  loadIdentifiers(): void {
    this.interopService.getInteroperationAccountsAccountIdIdentifiers(this.accountId).subscribe({
      next: (data) => this.identifiers.set(data),
    });
  }

  loadKyc(): void {
    this.interopService.getInteroperationAccountsAccountIdKyc(this.accountId).subscribe({
      next: (data) => this.kyc.set(data),
    });
  }

  loadTransactions(): void {
    this.interopService
      .getInteroperationAccountsAccountIdTransactions(
        this.accountId,
        this.debitFilter,
        this.creditFilter,
      )
      .subscribe({
        next: (data) => this.transactions.set(data),
      });
  }
}
