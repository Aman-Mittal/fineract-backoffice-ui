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
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import {
  WorkingCapitalLoansService,
  WorkingCapitalLoanChargesService,
  WorkingCapitalLoanTransactionsService,
  WorkingCapitalLoanDelinquencyActionsService,
  WorkingCapitalLoanDelinquencyRangeScheduleService,
  WorkingCapitalLoanBreachScheduleService,
  GetWorkingCapitalLoansLoanIdResponse,
  WorkingCapitalLoanChargeData,
  GetWorkingCapitalLoanTransactionIdResponse,
  WorkingCapitalLoanDelinquencyActionData,
  WorkingCapitalLoanDelinquencyRangeScheduleData,
  WorkingCapitalLoanBreachScheduleData,
} from '../../../api';

/**
 * Detail view for a single Working Capital Loan. Shows a Details key/value
 * summary plus read-only tabs for charges, transactions, delinquency actions,
 * delinquency range schedule and breach schedule, each backed by its own GET.
 */
@Component({
  selector: 'app-wc-loan-view',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    MatCardModule,
    MatTabsModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
  ],
  template: `
    <div class="view-container">
      <mat-card class="header-card">
        <mat-card-content class="header-content">
          <div class="loan-title-area">
            <div class="avatar-circle">
              <mat-icon>account_balance</mat-icon>
            </div>
            <div class="title-details">
              <h2>#{{ loan()?.accountNo || loanId }}</h2>
              <div class="subtitle-row">
                <span>{{ 'WC_LOANS.CLIENT' | translate }}: {{ loan()?.client?.displayName }}</span>
                <span class="divider">|</span>
                <span>{{ loan()?.status?.value }}</span>
              </div>
            </div>
          </div>
          <div class="actions-area">
            <button mat-button (click)="onBack()">
              <mat-icon>arrow_back</mat-icon>
              {{ 'COMMON.BACK' | translate }}
            </button>
          </div>
        </mat-card-content>
      </mat-card>

      <mat-tab-group class="tab-group" animationDuration="0ms">
        <!-- Details -->
        <mat-tab [label]="'WC_LOANS.TABS.DETAILS' | translate">
          <div class="tab-content">
            <mat-card class="info-card">
              <mat-card-content class="details-list">
                <div class="detail-item">
                  <span class="label">{{ 'WC_LOANS.ACCOUNT_NO' | translate }}</span>
                  <span class="value">{{ loan()?.accountNo || '-' }}</span>
                </div>
                <div class="detail-item">
                  <span class="label">{{ 'WC_LOANS.CLIENT' | translate }}</span>
                  <span class="value">{{ loan()?.client?.displayName || '-' }}</span>
                </div>
                <div class="detail-item">
                  <span class="label">{{ 'WC_LOANS.PRODUCT' | translate }}</span>
                  <span class="value">{{ loan()?.product?.name || '-' }}</span>
                </div>
                <div class="detail-item">
                  <span class="label">{{ 'WC_LOANS.PRINCIPAL' | translate }}</span>
                  <span class="value">
                    {{ loan()?.currency?.displaySymbol }}
                    {{ loan()?.proposedPrincipal ?? loan()?.approvedPrincipal | number: '1.2-2' }}
                  </span>
                </div>
                <div class="detail-item">
                  <span class="label">{{ 'WC_LOANS.STATUS' | translate }}</span>
                  <span class="value">{{ loan()?.status?.value || '-' }}</span>
                </div>
                <div class="detail-item">
                  <span class="label">{{ 'WC_LOANS.REPAYMENT_EVERY' | translate }}</span>
                  <span class="value">
                    {{ loan()?.repaymentEvery || '-' }}
                    {{ loan()?.repaymentFrequencyType?.value }}
                  </span>
                </div>
                <div class="detail-item">
                  <span class="label">{{ 'WC_LOANS.BREACH' | translate }}</span>
                  <span class="value">{{ loan()?.breach?.name || '-' }}</span>
                </div>
              </mat-card-content>
            </mat-card>
          </div>
        </mat-tab>

        <!-- Charges -->
        <mat-tab [label]="'WC_LOANS.TABS.CHARGES' | translate">
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
                      <td mat-cell *matCellDef="let c">{{ c.amount | number: '1.2-2' }}</td>
                    </ng-container>
                    <ng-container matColumnDef="paid">
                      <th mat-header-cell *matHeaderCellDef>{{ 'WC_LOANS.PAID' | translate }}</th>
                      <td mat-cell *matCellDef="let c">{{ c.amountPaid | number: '1.2-2' }}</td>
                    </ng-container>
                    <ng-container matColumnDef="outstanding">
                      <th mat-header-cell *matHeaderCellDef>
                        {{ 'WC_LOANS.OUTSTANDING' | translate }}
                      </th>
                      <td mat-cell *matCellDef="let c">
                        {{ c.amountOutstanding | number: '1.2-2' }}
                      </td>
                    </ng-container>
                    <tr mat-header-row *matHeaderRowDef="chargeColumns"></tr>
                    <tr mat-row *matRowDef="let row; columns: chargeColumns"></tr>
                  </table>
                } @else {
                  <div class="empty-state">
                    <mat-icon>monetization_on</mat-icon>
                    <p>{{ 'WC_LOANS.NO_DATA' | translate }}</p>
                  </div>
                }
              </mat-card-content>
            </mat-card>
          </div>
        </mat-tab>

        <!-- Transactions -->
        <mat-tab [label]="'WC_LOANS.TABS.TRANSACTIONS' | translate">
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
                      <td mat-cell *matCellDef="let tx">{{ tx.transactionDate }}</td>
                    </ng-container>
                    <ng-container matColumnDef="type">
                      <th mat-header-cell *matHeaderCellDef>{{ 'COMMON.TYPE' | translate }}</th>
                      <td mat-cell *matCellDef="let tx">{{ tx.type?.value }}</td>
                    </ng-container>
                    <ng-container matColumnDef="amount">
                      <th mat-header-cell *matHeaderCellDef>{{ 'COMMON.AMOUNT' | translate }}</th>
                      <td mat-cell *matCellDef="let tx">
                        {{ tx.transactionAmount | number: '1.2-2' }}
                      </td>
                    </ng-container>
                    <tr mat-header-row *matHeaderRowDef="transactionColumns"></tr>
                    <tr mat-row *matRowDef="let row; columns: transactionColumns"></tr>
                  </table>
                } @else {
                  <div class="empty-state">
                    <mat-icon>receipt</mat-icon>
                    <p>{{ 'WC_LOANS.NO_DATA' | translate }}</p>
                  </div>
                }
              </mat-card-content>
            </mat-card>
          </div>
        </mat-tab>

        <!-- Delinquency Actions -->
        <mat-tab [label]="'WC_LOANS.TABS.DELINQUENCY_ACTIONS' | translate">
          <div class="tab-content">
            <mat-card class="table-card">
              <mat-card-content>
                @if (delinquencyActions().length > 0) {
                  <table mat-table [dataSource]="delinquencyActions()" class="full-width-table">
                    <ng-container matColumnDef="action">
                      <th mat-header-cell *matHeaderCellDef>{{ 'WC_LOANS.ACTION' | translate }}</th>
                      <td mat-cell *matCellDef="let a">{{ a.action }}</td>
                    </ng-container>
                    <ng-container matColumnDef="startDate">
                      <th mat-header-cell *matHeaderCellDef>
                        {{ 'WC_LOANS.START_DATE' | translate }}
                      </th>
                      <td mat-cell *matCellDef="let a">{{ a.startDate }}</td>
                    </ng-container>
                    <ng-container matColumnDef="endDate">
                      <th mat-header-cell *matHeaderCellDef>
                        {{ 'WC_LOANS.END_DATE' | translate }}
                      </th>
                      <td mat-cell *matCellDef="let a">{{ a.endDate }}</td>
                    </ng-container>
                    <tr mat-header-row *matHeaderRowDef="delinquencyActionColumns"></tr>
                    <tr mat-row *matRowDef="let row; columns: delinquencyActionColumns"></tr>
                  </table>
                } @else {
                  <div class="empty-state">
                    <mat-icon>gavel</mat-icon>
                    <p>{{ 'WC_LOANS.NO_DATA' | translate }}</p>
                  </div>
                }
              </mat-card-content>
            </mat-card>
          </div>
        </mat-tab>

        <!-- Delinquency Range Schedule -->
        <mat-tab [label]="'WC_LOANS.TABS.DELINQUENCY_RANGE_SCHEDULE' | translate">
          <div class="tab-content">
            <mat-card class="table-card">
              <mat-card-content>
                @if (delinquencyRangeSchedule().length > 0) {
                  <table
                    mat-table
                    [dataSource]="delinquencyRangeSchedule()"
                    class="full-width-table"
                  >
                    <ng-container matColumnDef="periodNumber">
                      <th mat-header-cell *matHeaderCellDef>{{ 'WC_LOANS.PERIOD' | translate }}</th>
                      <td mat-cell *matCellDef="let r">{{ r.periodNumber }}</td>
                    </ng-container>
                    <ng-container matColumnDef="fromDate">
                      <th mat-header-cell *matHeaderCellDef>
                        {{ 'WC_LOANS.FROM_DATE' | translate }}
                      </th>
                      <td mat-cell *matCellDef="let r">{{ r.fromDate }}</td>
                    </ng-container>
                    <ng-container matColumnDef="toDate">
                      <th mat-header-cell *matHeaderCellDef>
                        {{ 'WC_LOANS.TO_DATE' | translate }}
                      </th>
                      <td mat-cell *matCellDef="let r">{{ r.toDate }}</td>
                    </ng-container>
                    <ng-container matColumnDef="outstanding">
                      <th mat-header-cell *matHeaderCellDef>
                        {{ 'WC_LOANS.OUTSTANDING' | translate }}
                      </th>
                      <td mat-cell *matCellDef="let r">
                        {{ r.outstandingAmount | number: '1.2-2' }}
                      </td>
                    </ng-container>
                    <tr mat-header-row *matHeaderRowDef="delinquencyRangeColumns"></tr>
                    <tr mat-row *matRowDef="let row; columns: delinquencyRangeColumns"></tr>
                  </table>
                } @else {
                  <div class="empty-state">
                    <mat-icon>schedule</mat-icon>
                    <p>{{ 'WC_LOANS.NO_DATA' | translate }}</p>
                  </div>
                }
              </mat-card-content>
            </mat-card>
          </div>
        </mat-tab>

        <!-- Breach Schedule -->
        <mat-tab [label]="'WC_LOANS.TABS.BREACH_SCHEDULE' | translate">
          <div class="tab-content">
            <mat-card class="table-card">
              <mat-card-content>
                @if (breachSchedule().length > 0) {
                  <table mat-table [dataSource]="breachSchedule()" class="full-width-table">
                    <ng-container matColumnDef="periodNumber">
                      <th mat-header-cell *matHeaderCellDef>{{ 'WC_LOANS.PERIOD' | translate }}</th>
                      <td mat-cell *matCellDef="let b">{{ b.periodNumber }}</td>
                    </ng-container>
                    <ng-container matColumnDef="fromDate">
                      <th mat-header-cell *matHeaderCellDef>
                        {{ 'WC_LOANS.FROM_DATE' | translate }}
                      </th>
                      <td mat-cell *matCellDef="let b">{{ b.fromDate }}</td>
                    </ng-container>
                    <ng-container matColumnDef="toDate">
                      <th mat-header-cell *matHeaderCellDef>
                        {{ 'WC_LOANS.TO_DATE' | translate }}
                      </th>
                      <td mat-cell *matCellDef="let b">{{ b.toDate }}</td>
                    </ng-container>
                    <ng-container matColumnDef="breach">
                      <th mat-header-cell *matHeaderCellDef>{{ 'WC_LOANS.BREACH' | translate }}</th>
                      <td mat-cell *matCellDef="let b">
                        {{ (b.breach ? 'COMMON.YES' : 'COMMON.NO') | translate }}
                      </td>
                    </ng-container>
                    <tr mat-header-row *matHeaderRowDef="breachScheduleColumns"></tr>
                    <tr mat-row *matRowDef="let row; columns: breachScheduleColumns"></tr>
                  </table>
                } @else {
                  <div class="empty-state">
                    <mat-icon>report_problem</mat-icon>
                    <p>{{ 'WC_LOANS.NO_DATA' | translate }}</p>
                  </div>
                }
              </mat-card-content>
            </mat-card>
          </div>
        </mat-tab>
      </mat-tab-group>
    </div>
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
      .tab-group {
        background-color: var(--card-bg);
        border-radius: 12px;
        box-shadow: var(--shadow-sm);
      }
      .tab-content {
        padding: 24px;
      }
      .info-card {
        border-radius: 8px;
        border: 1px solid var(--border-color);
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
        border-bottom: 1px solid var(--border-color);
      }
      .detail-item .label {
        color: var(--text-muted);
        font-size: 14px;
        font-weight: 500;
      }
      .detail-item .value {
        color: var(--text-color);
        font-size: 14px;
        font-weight: 600;
      }
      .table-card {
        border: 1px solid var(--border-color);
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
export class WcLoanViewComponent implements OnInit {
  private readonly loansService = inject(WorkingCapitalLoansService);
  private readonly chargesService = inject(WorkingCapitalLoanChargesService);
  private readonly transactionsService = inject(WorkingCapitalLoanTransactionsService);
  private readonly delinquencyActionsService = inject(WorkingCapitalLoanDelinquencyActionsService);
  private readonly delinquencyRangeScheduleService = inject(
    WorkingCapitalLoanDelinquencyRangeScheduleService,
  );
  private readonly breachScheduleService = inject(WorkingCapitalLoanBreachScheduleService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  loanId = 0;
  loan = signal<GetWorkingCapitalLoansLoanIdResponse | null>(null);
  charges = signal<WorkingCapitalLoanChargeData[]>([]);
  transactions = signal<GetWorkingCapitalLoanTransactionIdResponse[]>([]);
  delinquencyActions = signal<WorkingCapitalLoanDelinquencyActionData[]>([]);
  delinquencyRangeSchedule = signal<WorkingCapitalLoanDelinquencyRangeScheduleData[]>([]);
  breachSchedule = signal<WorkingCapitalLoanBreachScheduleData[]>([]);

  chargeColumns = ['name', 'amount', 'paid', 'outstanding'];
  transactionColumns = ['id', 'date', 'type', 'amount'];
  delinquencyActionColumns = ['action', 'startDate', 'endDate'];
  delinquencyRangeColumns = ['periodNumber', 'fromDate', 'toDate', 'outstanding'];
  breachScheduleColumns = ['periodNumber', 'fromDate', 'toDate', 'breach'];

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loanId = +id;
      this.loadData();
    }
  }

  loadData(): void {
    this.loansService.getWorkingCapitalLoansLoanId(this.loanId).subscribe({
      next: (data) => this.loan.set(data),
      error: (err: unknown) => console.error('Failed to load working-capital loan', err),
    });

    this.chargesService.getWorkingCapitalLoansLoanIdCharges(this.loanId).subscribe({
      next: (data) => this.charges.set(data ?? []),
      error: (err: unknown) => console.error('Failed to load loan charges', err),
    });

    this.transactionsService.getWorkingCapitalLoansLoanIdTransactions(this.loanId).subscribe({
      next: (data) => this.transactions.set(data.content ?? []),
      error: (err: unknown) => console.error('Failed to load loan transactions', err),
    });

    this.delinquencyActionsService
      .getWorkingCapitalLoansLoanIdDelinquencyActions(this.loanId)
      .subscribe({
        next: (data) => this.delinquencyActions.set(data ?? []),
        error: (err: unknown) => console.error('Failed to load delinquency actions', err),
      });

    this.delinquencyRangeScheduleService
      .getWorkingCapitalLoansLoanIdDelinquencyRangeSchedule(this.loanId)
      .subscribe({
        next: (data) => this.delinquencyRangeSchedule.set(data ?? []),
        error: (err: unknown) => console.error('Failed to load delinquency range schedule', err),
      });

    this.breachScheduleService.getWorkingCapitalLoansLoanIdBreachSchedule(this.loanId).subscribe({
      next: (data) => this.breachSchedule.set(data ?? []),
      error: (err: unknown) => console.error('Failed to load breach schedule', err),
    });
  }

  onBack(): void {
    this.router.navigate(['/working-capital/loans']);
  }
}
