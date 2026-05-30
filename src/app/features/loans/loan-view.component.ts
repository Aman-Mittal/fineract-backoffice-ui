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
  LoansService,
  GetLoansLoanIdResponse,
  GetLoansLoanIdRepaymentPeriod,
  GetLoansLoanIdTransactions,
  GetLoansLoanIdLoanChargeData,
} from '../../api';
import { StatusBadgeComponent, HasPermissionDirective } from '../../shared';

@Component({
  selector: 'app-loan-view',
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
    @if (loan()) {
      <div class="view-container">
        <!-- Header Actions Card -->
        <mat-card class="header-card">
          <mat-card-content class="header-content">
            <div class="loan-title-area">
              <div class="avatar-circle">
                <mat-icon>monetization_on</mat-icon>
              </div>
              <div class="title-details">
                <h2>{{ loan()?.loanProductName }}</h2>
                <div class="subtitle-row">
                  <span class="account-no">#{{ loan()?.accountNo }}</span>
                  <span class="divider">|</span>
                  <span class="client-name">Client: {{ loan()?.clientName }}</span>
                  <app-status-badge
                    [status]="loan()?.status"
                    class="status-badge"
                  ></app-status-badge>
                </div>
              </div>
            </div>
            <div class="actions-area">
              <button
                mat-raised-button
                color="primary"
                *appHasPermission="'REPAYMENT_LOAN'"
                (click)="onRepayment()"
                [matTooltip]="'LOANS.REPAYMENT' | translate"
              >
                <mat-icon>payment</mat-icon>
                {{ 'LOANS.REPAYMENT' | translate }}
              </button>
              <ng-container *appHasPermission="'DISBURSE_LOAN'">
                @if (isLoanApproved) {
                  <button
                    mat-raised-button
                    color="accent"
                    (click)="onDisburse()"
                    [matTooltip]="'LOANS.DISBURSE' | translate"
                  >
                    <mat-icon>launch</mat-icon>
                    {{ 'LOANS.DISBURSE' | translate }}
                  </button>
                }
              </ng-container>
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
          <mat-tab [label]="'LOANS.OVERVIEW' | translate">
            <div class="tab-content">
              <div class="info-grid">
                <mat-card class="info-card">
                  <mat-card-header>
                    <mat-card-title>
                      <mat-icon>info</mat-icon>
                      {{ 'LOANS.LOAN_TERMS' | translate }}
                    </mat-card-title>
                  </mat-card-header>
                  <mat-card-content class="details-list">
                    <div class="detail-item">
                      <span class="label">{{ 'LOANS.PRINCIPAL_AMOUNT' | translate }}</span>
                      <span class="value">
                        {{ loan()?.currency?.displaySymbol }}
                        {{ loan()?.principal | number: '1.2-2' }}
                      </span>
                    </div>
                    <div class="detail-item">
                      <span class="label">{{ 'LOANS.ANNUAL_INTEREST_RATE' | translate }}</span>
                      <span class="value">{{ loan()?.annualInterestRate }}%</span>
                    </div>
                    <div class="detail-item">
                      <span class="label">{{ 'LOANS.REPAYMENTS' | translate }}</span>
                      <span class="value">
                        {{ loan()?.numberOfRepayments }} every {{ loan()?.repaymentEvery }}
                        {{ repaymentFrequencyValue }}
                      </span>
                    </div>
                    <div class="detail-item">
                      <span class="label">{{ 'LOANS.LOAN_OFFICER' | translate }}</span>
                      <span class="value">{{ loan()?.loanOfficerName || '-' }}</span>
                    </div>
                  </mat-card-content>
                </mat-card>

                <mat-card class="info-card">
                  <mat-card-header>
                    <mat-card-title>
                      <mat-icon>timeline</mat-icon>
                      {{ 'LOANS.TIMELINE_STATUS' | translate }}
                    </mat-card-title>
                  </mat-card-header>
                  <mat-card-content class="details-list">
                    <div class="detail-item">
                      <span class="label">{{ 'LOANS.SUBMITTED_DATE' | translate }}</span>
                      <span class="value">{{ formattedSubmittedDate }}</span>
                    </div>
                    <div class="detail-item">
                      <span class="label">{{ 'LOANS.EXPECTED_DISBURSEMENT' | translate }}</span>
                      <span class="value">{{ formattedExpectedDisbursementDate }}</span>
                    </div>
                    <div class="detail-item">
                      <span class="label">{{ 'LOANS.TOTAL_DISBURSED' | translate }}</span>
                      <span class="value">
                        {{ loan()?.currency?.displaySymbol }}
                        {{ loan()?.summary?.principalDisbursed || 0 | number: '1.2-2' }}
                      </span>
                    </div>
                    <div class="detail-item">
                      <span class="label">{{ 'LOANS.TOTAL_OUTSTANDING' | translate }}</span>
                      <span class="value">
                        {{ loan()?.currency?.displaySymbol }}
                        {{ loan()?.summary?.totalOutstanding || 0 | number: '1.2-2' }}
                      </span>
                    </div>
                  </mat-card-content>
                </mat-card>
              </div>
            </div>
          </mat-tab>

          <!-- Repayment Schedule -->
          <mat-tab [label]="'LOANS.REPAYMENT_SCHEDULE' | translate">
            <div class="tab-content">
              <mat-card class="table-card">
                <mat-card-content>
                  @if (periods().length > 0) {
                    <table mat-table [dataSource]="periods()" class="full-width-table">
                      <ng-container matColumnDef="period">
                        <th mat-header-cell *matHeaderCellDef>#</th>
                        <td mat-cell *matCellDef="let p">{{ p.period }}</td>
                      </ng-container>

                      <ng-container matColumnDef="dueDate">
                        <th mat-header-cell *matHeaderCellDef>
                          {{ 'COMMON.TRANSACTION_DATE' | translate }}
                        </th>
                        <td mat-cell *matCellDef="let p">{{ formatPeriodDate(p.dueDate) }}</td>
                      </ng-container>

                      <ng-container matColumnDef="principal">
                        <th mat-header-cell *matHeaderCellDef>
                          {{ 'LOANS.PRINCIPAL' | translate }}
                        </th>
                        <td mat-cell *matCellDef="let p">
                          {{ loan()?.currency?.displaySymbol }}
                          {{ p.principalDue | number: '1.2-2' }}
                        </td>
                      </ng-container>

                      <ng-container matColumnDef="interest">
                        <th mat-header-cell *matHeaderCellDef>
                          {{ 'COMMON.INTEREST_RATE' | translate }}
                        </th>
                        <td mat-cell *matCellDef="let p">
                          {{ loan()?.currency?.displaySymbol }}
                          {{ p.interestDue | number: '1.2-2' }}
                        </td>
                      </ng-container>

                      <ng-container matColumnDef="fees">
                        <th mat-header-cell *matHeaderCellDef>{{ 'LOANS.CHARGES' | translate }}</th>
                        <td mat-cell *matCellDef="let p">
                          {{ loan()?.currency?.displaySymbol }}
                          {{ p.feeChargesDue | number: '1.2-2' }}
                        </td>
                      </ng-container>

                      <ng-container matColumnDef="total">
                        <th mat-header-cell *matHeaderCellDef>{{ 'COMMON.AMOUNT' | translate }}</th>
                        <td mat-cell *matCellDef="let p">
                          {{ loan()?.currency?.displaySymbol }}
                          {{ p.totalDueForPeriod | number: '1.2-2' }}
                        </td>
                      </ng-container>

                      <ng-container matColumnDef="outstanding">
                        <th mat-header-cell *matHeaderCellDef>
                          {{ 'LOANS.TOTAL_OUTSTANDING' | translate }}
                        </th>
                        <td mat-cell *matCellDef="let p">
                          {{ loan()?.currency?.displaySymbol }}
                          {{ p.totalOutstandingForPeriod | number: '1.2-2' }}
                        </td>
                      </ng-container>

                      <tr mat-header-row *matHeaderRowDef="scheduleColumns"></tr>
                      <tr mat-row *matRowDef="let row; columns: scheduleColumns"></tr>
                    </table>
                  } @else {
                    <div class="empty-state">
                      <mat-icon>calendar_today</mat-icon>
                      <p>{{ 'LOANS.NO_REPAYMENT_SCHEDULE' | translate }}</p>
                    </div>
                  }
                </mat-card-content>
              </mat-card>
            </div>
          </mat-tab>

          <!-- Transactions -->
          <mat-tab [label]="'LOANS.TRANSACTIONS' | translate">
            <div class="tab-content">
              <mat-card class="table-card">
                <mat-card-content>
                  @if (transactions().length > 0) {
                    <table mat-table [dataSource]="transactions()" class="full-width-table">
                      <ng-container matColumnDef="id">
                        <th mat-header-cell *matHeaderCellDef>ID</th>
                        <td mat-cell *matCellDef="let tx">{{ tx.id }}</td>
                      </ng-container>

                      <ng-container matColumnDef="date">
                        <th mat-header-cell *matHeaderCellDef>
                          {{ 'COMMON.TRANSACTION_DATE' | translate }}
                        </th>
                        <td mat-cell *matCellDef="let tx">{{ formatPeriodDate(tx.date) }}</td>
                      </ng-container>

                      <ng-container matColumnDef="type">
                        <th mat-header-cell *matHeaderCellDef>{{ 'COMMON.TYPE' | translate }}</th>
                        <td mat-cell *matCellDef="let tx">{{ tx.type?.value }}</td>
                      </ng-container>

                      <ng-container matColumnDef="amount">
                        <th mat-header-cell *matHeaderCellDef>{{ 'COMMON.AMOUNT' | translate }}</th>
                        <td mat-cell *matCellDef="let tx">
                          {{ loan()?.currency?.displaySymbol }} {{ tx.amount | number: '1.2-2' }}
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
                          {{ loan()?.currency?.displaySymbol }} {{ c.amount | number: '1.2-2' }}
                        </td>
                      </ng-container>

                      <ng-container matColumnDef="due">
                        <th mat-header-cell *matHeaderCellDef>
                          {{ 'LOANS.PRINCIPAL' | translate }}
                        </th>
                        <td mat-cell *matCellDef="let c">
                          {{ loan()?.currency?.displaySymbol }} {{ c.amountDue | number: '1.2-2' }}
                        </td>
                      </ng-container>

                      <ng-container matColumnDef="outstanding">
                        <th mat-header-cell *matHeaderCellDef>
                          {{ 'LOANS.TOTAL_OUTSTANDING' | translate }}
                        </th>
                        <td mat-cell *matCellDef="let c">
                          {{ loan()?.currency?.displaySymbol }}
                          {{ c.amountOutstanding | number: '1.2-2' }}
                        </td>
                      </ng-container>

                      <tr mat-header-row *matHeaderRowDef="chargeColumns"></tr>
                      <tr mat-row *matRowDef="let row; columns: chargeColumns"></tr>
                    </table>
                  } @else {
                    <div class="empty-state">
                      <mat-icon>monetization_on</mat-icon>
                      <p>{{ 'LOANS.CHARGES' | translate }}</p>
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
      .loan-title-area {
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
    `,
  ],
})
export class LoanViewComponent implements OnInit {
  private readonly loansService = inject(LoansService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  loanId = 0;
  loan = signal<GetLoansLoanIdResponse | null>(null);
  periods = signal<GetLoansLoanIdRepaymentPeriod[]>([]);
  transactions = signal<GetLoansLoanIdTransactions[]>([]);
  charges = signal<GetLoansLoanIdLoanChargeData[]>([]);

  get isLoanApproved(): boolean {
    const status = this.loan()?.status;
    return (status as unknown as Record<string, unknown>)?.['value'] === 'Approved';
  }

  get repaymentFrequencyValue(): string {
    const freq = this.loan()?.repaymentFrequencyType;
    return ((freq as unknown as Record<string, unknown>)?.['value'] as string) || '';
  }

  scheduleColumns = ['period', 'dueDate', 'principal', 'interest', 'fees', 'total', 'outstanding'];
  transactionColumns = ['id', 'date', 'type', 'amount'];
  chargeColumns = ['name', 'amount', 'due', 'outstanding'];

  get formattedSubmittedDate(): string {
    const dates = this.loan()?.timeline?.submittedOnDate as unknown as number[];
    if (dates && Array.isArray(dates)) {
      return new Date(dates[0], dates[1] - 1, dates[2]).toLocaleDateString();
    }
    return '-';
  }

  get formattedExpectedDisbursementDate(): string {
    const dates = this.loan()?.timeline?.expectedDisbursementDate as unknown as number[];
    if (dates && Array.isArray(dates)) {
      return new Date(dates[0], dates[1] - 1, dates[2]).toLocaleDateString();
    }
    return '-';
  }

  formatPeriodDate(dates: number[] | undefined | null): string {
    if (dates && Array.isArray(dates)) {
      return new Date(dates[0], dates[1] - 1, dates[2]).toLocaleDateString();
    }
    return '-';
  }

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.loanId = +id;
        this.loadLoanData();
      }
    });
  }

  loadLoanData() {
    // Request associations so repayment schedule, charges, and transactions are returned
    this.loansService.retrieveLoan(this.loanId, false, 'all').subscribe({
      next: (data) => {
        this.loan.set(data);
        this.periods.set(data.repaymentSchedule?.periods || []);
        this.transactions.set(data.transactions || []);
        this.charges.set(data.charges || []);
      },
      error: (err) => console.error('Failed to load loan data', err),
    });
  }

  onRepayment() {
    this.router.navigate([`/loans/${this.loanId}/transactions/repayment`]);
  }

  onDisburse() {
    this.router.navigate([`/loans/${this.loanId}/transactions/disburse`]);
  }

  onBack() {
    this.router.navigate(['/loans']);
  }
}
