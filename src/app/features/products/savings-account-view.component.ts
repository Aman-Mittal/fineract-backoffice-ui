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

import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import {
  SavingsAccountService,
  SavingsAccountData,
  SavingsAccountTransactionData,
  SavingsAccountChargeData,
} from '../../api';
import { StatusBadgeComponent, HasPermissionDirective } from '../../shared';

@Component({
  selector: 'app-savings-account-view',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TranslateModule,
    MatCardModule,
    MatTabsModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatTooltipModule,
    StatusBadgeComponent,
    HasPermissionDirective,
  ],
  template: `
    @if (account()) {
      <div class="view-container">
        <!-- Header Actions Card -->
        <mat-card class="header-card">
          <mat-card-content class="header-content">
            <div class="savings-title-area">
              <div class="avatar-circle">
                <mat-icon>account_balance_wallet</mat-icon>
              </div>
              <div class="title-details">
                <h2>{{ account()?.savingsProductName }}</h2>
                <div class="subtitle-row">
                  <span class="account-no">#{{ account()?.accountNo }}</span>
                  <span class="divider">|</span>
                  <span class="client-name">Client: {{ account()?.clientName }}</span>
                  <app-status-badge
                    [status]="account()?.status"
                    class="status-badge"
                  ></app-status-badge>
                </div>
              </div>
            </div>
            <div class="actions-area">
              @if (account()?.status?.submittedAndPendingApproval) {
                <button
                  mat-raised-button
                  color="accent"
                  *appHasPermission="'APPROVE_SAVINGSACCOUNT'"
                  (click)="onSavingsAction('approve')"
                  matTooltip="Approve Savings Account"
                >
                  <mat-icon>check_circle</mat-icon>
                  Approve
                </button>
              }
              @if (account()?.status?.approved) {
                <button
                  mat-raised-button
                  color="primary"
                  *appHasPermission="'ACTIVATE_SAVINGSACCOUNT'"
                  (click)="onSavingsAction('activate')"
                  matTooltip="Activate Savings Account"
                >
                  <mat-icon>play_circle_outline</mat-icon>
                  Activate
                </button>
              }
              @if (account()?.status?.active) {
                <button
                  mat-raised-button
                  color="warn"
                  *appHasPermission="'CLOSE_SAVINGSACCOUNT'"
                  (click)="onSavingsAction('close')"
                  matTooltip="Close Savings Account"
                >
                  <mat-icon>power_settings_new</mat-icon>
                  Close
                </button>
              }
              <button
                mat-raised-button
                color="primary"
                *appHasPermission="'DEPOSIT_SAVINGSACCOUNT'"
                (click)="onTransaction('deposit')"
                matTooltip="Deposit Cash"
              >
                <mat-icon>add_circle_outline</mat-icon>
                Deposit
              </button>
              <button
                mat-raised-button
                color="warn"
                *appHasPermission="'WITHDRAW_SAVINGSACCOUNT'"
                (click)="onTransaction('withdrawal')"
                matTooltip="Withdraw Cash"
              >
                <mat-icon>remove_circle_outline</mat-icon>
                Withdraw
              </button>
              <button mat-button (click)="onBack()">
                <mat-icon>arrow_back</mat-icon>
                {{ 'COMMON.BACK' | translate }}
              </button>
            </div>
          </mat-card-content>
        </mat-card>

        <!-- Tabs Section -->
        <mat-tab-group class="tab-group" animationDuration="0ms">
          <!-- Overview -->
          <mat-tab label="Overview">
            <div class="tab-content">
              <div class="info-grid">
                <mat-card class="info-card">
                  <mat-card-header>
                    <mat-card-title>
                      <mat-icon>info</mat-icon>
                      Interest Settings
                    </mat-card-title>
                  </mat-card-header>
                  <mat-card-content class="details-list">
                    <div class="detail-item">
                      <span class="label">Nominal Annual Interest Rate</span>
                      <span class="value">{{ account()?.nominalAnnualInterestRate }}%</span>
                    </div>
                    <div class="detail-item">
                      <span class="label">Compounding Period</span>
                      <span class="value">{{
                        account()?.interestCompoundingPeriodType?.value
                      }}</span>
                    </div>
                    <div class="detail-item">
                      <span class="label">Posting Period</span>
                      <span class="value">{{ account()?.interestPostingPeriodType?.value }}</span>
                    </div>
                    <div class="detail-item">
                      <span class="label">Interest Calculation Day-in-Year</span>
                      <span class="value">{{
                        account()?.interestCalculationDaysInYearType?.value
                      }}</span>
                    </div>
                  </mat-card-content>
                </mat-card>

                <mat-card class="info-card">
                  <mat-card-header>
                    <mat-card-title>
                      <mat-icon>timeline</mat-icon>
                      Timeline & Balance
                    </mat-card-title>
                  </mat-card-header>
                  <mat-card-content class="details-list">
                    <div class="detail-item">
                      <span class="label">Submitted On Date</span>
                      <span class="value">{{ formattedSubmittedDate }}</span>
                    </div>
                    <div class="detail-item">
                      <span class="label">Activated On Date</span>
                      <span class="value">{{ formattedActivatedDate }}</span>
                    </div>
                    <div class="detail-item">
                      <span class="label">Field Officer</span>
                      <span class="value">{{ account()?.fieldOfficerName || '-' }}</span>
                    </div>
                    <div class="detail-item">
                      <span class="label">Account Balance</span>
                      <span class="value">
                        {{ account()?.currency?.displaySymbol }}
                        {{ account()?.summary?.accountBalance || 0 | number: '1.2-2' }}
                      </span>
                    </div>
                  </mat-card-content>
                </mat-card>
              </div>
            </div>
          </mat-tab>

          <!-- Transactions -->
          <mat-tab [label]="'COMMON.TRANSACTIONS' | translate">
            <div class="tab-content">
              <mat-card class="table-card">
                <mat-card-content>
                  @if (transactions().length > 0) {
                    <table mat-table [dataSource]="transactions()" class="full-width-table">
                      <ng-container matColumnDef="id">
                        <th mat-header-cell *matHeaderCellDef>{{ 'COMMON.ID' | translate }}</th>
                        <td mat-cell *matCellDef="let tx">{{ tx.id }}</td>
                      </ng-container>

                      <ng-container matColumnDef="date">
                        <th mat-header-cell *matHeaderCellDef>{{ 'COMMON.DATE' | translate }}</th>
                        <td mat-cell *matCellDef="let tx">{{ formatDate(tx.date) }}</td>
                      </ng-container>

                      <ng-container matColumnDef="type">
                        <th mat-header-cell *matHeaderCellDef>{{ 'COMMON.TYPE' | translate }}</th>
                        <td mat-cell *matCellDef="let tx">{{ tx.transactionType?.value }}</td>
                      </ng-container>

                      <ng-container matColumnDef="amount">
                        <th mat-header-cell *matHeaderCellDef>{{ 'COMMON.AMOUNT' | translate }}</th>
                        <td mat-cell *matCellDef="let tx">
                          <span
                            [ngClass]="{
                              'debit-amount': tx.debit && !tx.reversed,
                              'credit-amount': tx.credit && !tx.reversed,
                              'reversed-amount': tx.reversed,
                            }"
                          >
                            {{ tx.debit ? '-' : tx.credit ? '+' : '' }}
                            {{ account()?.currency?.displaySymbol
                            }}{{ tx.amount | number: '1.2-2' }}
                          </span>
                        </td>
                      </ng-container>

                      <ng-container matColumnDef="runningBalance">
                        <th mat-header-cell *matHeaderCellDef>
                          {{ 'COMMON.RUNNING_BALANCE' | translate }}
                        </th>
                        <td mat-cell *matCellDef="let tx">
                          {{ account()?.currency?.displaySymbol }}
                          {{ tx.runningBalance || 0 | number: '1.2-2' }}
                        </td>
                      </ng-container>

                      <tr mat-header-row *matHeaderRowDef="transactionColumns"></tr>
                      <tr mat-row *matRowDef="let row; columns: transactionColumns"></tr>
                    </table>
                  } @else {
                    <div class="empty-state">
                      <mat-icon>receipt</mat-icon>
                      <p>{{ 'LOANS.NO_TRANSACTIONS' | translate }}</p>
                    </div>
                  }
                </mat-card-content>
              </mat-card>
            </div>
          </mat-tab>

          <!-- Charges -->
          <mat-tab [label]="'LOANS.CHARGES' | translate">
            <div class="tab-content">
              <mat-card class="table-card">
                <mat-card-content>
                  @if (charges().length > 0) {
                    <table mat-table [dataSource]="charges()" class="full-width-table">
                      <ng-container matColumnDef="name">
                        <th mat-header-cell *matHeaderCellDef>{{ 'COMMON.NAME' | translate }}</th>
                        <td mat-cell *matCellDef="let c">{{ c.name }}</td>
                      </ng-container>

                      <ng-container matColumnDef="amount">
                        <th mat-header-cell *matHeaderCellDef>{{ 'COMMON.AMOUNT' | translate }}</th>
                        <td mat-cell *matCellDef="let c">
                          {{ account()?.currency?.displaySymbol }} {{ c.amount | number: '1.2-2' }}
                        </td>
                      </ng-container>

                      <ng-container matColumnDef="outstanding">
                        <th mat-header-cell *matHeaderCellDef>
                          {{ 'LOANS.REPAYMENT_SCHEDULE_HEADERS.OUTSTANDING' | translate }}
                        </th>
                        <td mat-cell *matCellDef="let c">
                          {{ account()?.currency?.displaySymbol }}
                          {{ c.amountOutstanding | number: '1.2-2' }}
                        </td>
                      </ng-container>

                      <tr mat-header-row *matHeaderRowDef="chargeColumns"></tr>
                      <tr mat-row *matRowDef="let row; columns: chargeColumns"></tr>
                    </table>
                  } @else {
                    <div class="empty-state">
                      <mat-icon>monetization_on</mat-icon>
                      <p>{{ 'SAVINGS.NO_CHARGES' | translate }}</p>
                    </div>
                  }
                </mat-card-content>
              </mat-card>
            </div>
          </mat-tab>
        </mat-tab-group>
      </div>
    }
  `,
  styles: [
    `
      .view-container {
        padding: 24px;
        max-width: 1200px;
        margin: 0 auto;
        display: flex;
        flex-direction: column;
        gap: 24px;
      }
      .header-card {
        border-radius: 12px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
      }
      .header-content {
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        gap: 16px;
      }
      .savings-title-area {
        display: flex;
        align-items: center;
        gap: 16px;
      }
      .avatar-circle {
        width: 64px;
        height: 64px;
        border-radius: 50%;
        background-color: var(--primary-color, #3f51b5);
        color: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .avatar-circle mat-icon {
        font-size: 32px;
        width: 32px;
        height: 32px;
      }
      .title-details h2 {
        margin: 0 0 4px 0;
        font-size: 24px;
        font-weight: 600;
        color: #2c3e50;
      }
      .subtitle-row {
        display: flex;
        align-items: center;
        gap: 8px;
        color: #7f8c8d;
        font-size: 14px;
      }
      .divider {
        color: #bdc3c7;
      }
      .actions-area {
        display: flex;
        gap: 12px;
        align-items: center;
      }
      .tab-group {
        background-color: #fff;
        border-radius: 12px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
      }
      .tab-content {
        padding: 24px;
      }
      .info-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 24px;
      }
      .info-card {
        border-radius: 8px;
        border: 1px solid #eaedf1;
      }
      .info-card mat-card-header {
        margin-bottom: 12px;
      }
      .info-card mat-card-title {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 16px;
        font-weight: 600;
        color: #34495e;
      }
      .details-list {
        display: flex;
        flex-direction: column;
        gap: 12px;
      }
      .detail-item {
        display: flex;
        justify-content: space-between;
        padding-bottom: 8px;
        border-bottom: 1px solid #f5f7fa;
      }
      .detail-item .label {
        color: #7f8c8d;
        font-size: 14px;
        font-weight: 500;
      }
      .detail-item .value {
        color: #2c3e50;
        font-size: 14px;
        font-weight: 600;
      }
      .table-card {
        border: 1px solid #eaedf1;
        box-shadow: none;
      }
      .full-width-table {
        width: 100%;
      }
      .empty-state {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 48px;
        color: #95a5a6;
      }
      .empty-state mat-icon {
        font-size: 48px;
        width: 48px;
        height: 48px;
        margin-bottom: 12px;
      }
      .empty-state p {
        margin: 0;
        font-size: 16px;
      }
      .debit-amount {
        color: #e74c3c;
        font-weight: 600;
      }
      .credit-amount {
        color: #2ecc71;
        font-weight: 600;
      }
      .reversed-amount {
        text-decoration: line-through;
        opacity: 0.6;
        color: #7f8c8d;
      }
    `,
  ],
})
export class SavingsAccountViewComponent implements OnInit {
  private readonly savingsService = inject(SavingsAccountService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  accountId = 0;
  account = signal<SavingsAccountData | null>(null);
  transactions = signal<SavingsAccountTransactionData[]>([]);
  charges = signal<SavingsAccountChargeData[]>([]);

  transactionColumns = ['id', 'date', 'type', 'amount', 'runningBalance'];
  chargeColumns = ['name', 'amount', 'outstanding'];

  get formattedSubmittedDate(): string {
    const dates = this.account()?.timeline?.submittedOnDate as unknown as number[];
    if (dates && Array.isArray(dates)) {
      return new Date(dates[0], dates[1] - 1, dates[2]).toLocaleDateString();
    }
    return '-';
  }

  get formattedActivatedDate(): string {
    const dates = this.account()?.timeline?.activatedOnDate as unknown as number[];
    if (dates && Array.isArray(dates)) {
      return new Date(dates[0], dates[1] - 1, dates[2]).toLocaleDateString();
    }
    return '-';
  }

  formatDate(dates: number[] | undefined | null): string {
    if (dates && Array.isArray(dates)) {
      return new Date(dates[0], dates[1] - 1, dates[2]).toLocaleDateString();
    }
    return '-';
  }

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.accountId = +id;
        this.loadAccountData();
      }
    });
  }

  loadAccountData() {
    this.savingsService.retrieveOne25(this.accountId, false, undefined, 'all').subscribe({
      next: (data) => {
        this.account.set(data);
        this.transactions.set(data.transactions || []);
        this.charges.set(data.charges || []);
      },
      error: (err) => console.error('Failed to load savings account details', err),
    });
  }

  onTransaction(command: string) {
    this.router.navigate([`/products/savings-accounts/${this.accountId}/transactions/${command}`]);
  }

  onSavingsAction(command: string) {
    this.router.navigate([`/products/savings/${this.accountId}/action/${command}`]);
  }

  onBack() {
    this.router.navigate(['/products/savings-accounts']);
  }
}
