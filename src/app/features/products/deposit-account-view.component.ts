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
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { DecimalPipe, NgClass } from '@angular/common';
import { StatusBadgeComponent } from '../../shared/components/status-badge/status-badge.component';
import { EntityDatatablesComponent } from '../../shared/components/entity-datatables/entity-datatables.component';
import { FixedDepositAccountService, RecurringDepositAccountService } from '../../api';

@Component({
  selector: 'app-deposit-account-view',
  standalone: true,
  imports: [
    TranslateModule,
    MatCardModule,
    MatTabsModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatTooltipModule,
    MatMenuModule,
    StatusBadgeComponent,
    EntityDatatablesComponent,
    DecimalPipe,
    NgClass,
  ],
  template: `
    @if (account()) {
      <div class="view-container">
        <mat-card class="header-card">
          <mat-card-content class="header-content">
            <div class="title-area">
              <div class="avatar-circle">
                <mat-icon>account_balance_wallet</mat-icon>
              </div>
              <div class="title-details">
                <h2>{{ account()?.['productName'] }}</h2>
                <div class="subtitle-row">
                  <span class="account-no">#{{ account()?.['accountNo'] }}</span>
                  <span class="divider">|</span>
                  <span class="client-name">Client: {{ account()?.['clientName'] }}</span>
                  <app-status-badge [status]="getStatusValue()"></app-status-badge>
                </div>
              </div>
            </div>
            <div class="actions-area">
              <button mat-raised-button color="primary" [matMenuTriggerFor]="actionsMenu">
                <mat-icon>settings</mat-icon>
                {{ 'COMMON.ACTIONS' | translate }}
              </button>
              <mat-menu #actionsMenu="matMenu">
                @if (isRD) {
                  <button mat-menu-item (click)="onDeposit()">
                    <mat-icon>add</mat-icon>
                    <span>{{ 'SAVINGS.DEPOSIT' | translate }}</span>
                  </button>
                }
                <button mat-menu-item (click)="onWithdraw()">
                  <mat-icon>remove</mat-icon>
                  <span>{{ 'SAVINGS.WITHDRAW' | translate }}</span>
                </button>
              </mat-menu>

              <button mat-button (click)="onBack()">
                <mat-icon>arrow_back</mat-icon>
                {{ 'COMMON.BACK' | translate }}
              </button>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-tab-group class="tab-group" animationDuration="0ms">
          <mat-tab [label]="'COMMON.OVERVIEW' | translate">
            <div class="tab-content">
              <div class="info-grid">
                <mat-card class="info-card">
                  <mat-card-header>
                    <mat-card-title>{{ 'COMMON.DETAILS' | translate }}</mat-card-title>
                  </mat-card-header>
                  <mat-card-content class="details-list">
                    <div class="detail-item">
                      <span class="label">{{ 'COMMON.BALANCE' | translate }}</span>
                      <span class="value"
                        >{{ getCurrencySymbol() }} {{ getAccountBalance() | number: '1.2-2' }}</span
                      >
                    </div>
                    <div class="detail-item">
                      <span class="label">{{ 'COMMON.INTEREST_RATE' | translate }}</span>
                      <span class="value">{{ account()?.['nominalAnnualInterestRate'] }}%</span>
                    </div>
                    <div class="detail-item">
                      <span class="label">{{ 'SAVINGS.MIN_BALANCE_REQUIRED' | translate }}</span>
                      <span class="value">{{ account()?.['minRequiredOpeningBalance'] }}</span>
                    </div>
                  </mat-card-content>
                </mat-card>

                <mat-card class="info-card">
                  <mat-card-header>
                    <mat-card-title>{{ 'LOANS.TIMELINE_STATUS' | translate }}</mat-card-title>
                  </mat-card-header>
                  <mat-card-content class="details-list">
                    <div class="detail-item">
                      <span class="label">{{ 'COMMON.ACTIVATION_DATE' | translate }}</span>
                      <span class="value">{{ getActivationDate() }}</span>
                    </div>
                  </mat-card-content>
                </mat-card>
              </div>
            </div>
          </mat-tab>

          <mat-tab [label]="'COMMON.TRANSACTIONS' | translate">
            <div class="tab-content">
              <table mat-table [dataSource]="transactions()" class="full-width-table">
                <ng-container matColumnDef="id">
                  <th mat-header-cell *matHeaderCellDef>ID</th>
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
                    <span [ngClass]="tx.entryType === 'DEBIT' ? 'debit' : 'credit'">
                      {{ tx.currency?.displaySymbol }} {{ tx.amount | number: '1.2-2' }}
                    </span>
                  </td>
                </ng-container>
                <tr mat-header-row *matHeaderRowDef="['id', 'date', 'type', 'amount']"></tr>
                <tr mat-row *matRowDef="let row; columns: ['id', 'date', 'type', 'amount']"></tr>
              </table>
            </div>
          </mat-tab>

          <mat-tab [label]="'SYSTEM.CUSTOM_FIELDS' | translate">
            <div class="tab-content">
              <app-entity-datatables
                [apptableName]="isRD ? 'm_savings_account' : 'm_savings_account'"
                [entityId]="accountId"
              ></app-entity-datatables>
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
      }
      .header-content {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .title-area {
        display: flex;
        align-items: center;
        gap: 16px;
      }
      .avatar-circle {
        width: 64px;
        height: 64px;
        border-radius: 50%;
        background: #3f51b5;
        color: white;
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
        margin: 0;
      }
      .subtitle-row {
        display: flex;
        gap: 8px;
        align-items: center;
        color: #666;
        font-size: 14px;
      }
      .actions-area {
        display: flex;
        gap: 12px;
      }
      .tab-group {
        border-radius: 12px;
        background: white;
      }
      .tab-content {
        padding: 24px;
      }
      .info-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 24px;
      }
      .details-list {
        display: flex;
        flex-direction: column;
        gap: 12px;
      }
      .detail-item {
        display: flex;
        justify-content: space-between;
        border-bottom: 1px solid #eee;
        padding-bottom: 8px;
      }
      .label {
        color: #777;
      }
      .value {
        font-weight: 600;
      }
      .full-width-table {
        width: 100%;
      }
      .debit {
        color: #e74c3c;
      }
      .credit {
        color: #2ecc71;
      }
    `,
  ],
})
export class DepositAccountViewComponent implements OnInit {
  private readonly fdService = inject(FixedDepositAccountService);
  private readonly rdService = inject(RecurringDepositAccountService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  accountId = 0;
  isRD = false;
  account = signal<Record<string, unknown> | null>(null);
  transactions = signal<Record<string, unknown>[]>([]);

  ngOnInit(): void {
    this.accountId = Number(this.route.snapshot.paramMap.get('id'));
    this.isRD = this.router.url.includes('recurring');
    this.loadData();
  }

  loadData(): void {
    const service = (this.isRD ? this.rdService : this.fdService) as unknown as Record<
      string,
      unknown
    >;
    const method = this.isRD ? 'retrieveOne18' : 'retrieveOne14';

    const call = service[method] as (id: number) => {
      subscribe: (cb: (data: Record<string, unknown>) => void) => void;
    };

    call(this.accountId).subscribe((data: Record<string, unknown>) => {
      this.account.set(data);
      this.transactions.set(
        Array.from((data['transactions'] as unknown[]) || []) as Record<string, unknown>[],
      );
    });
  }

  getStatusValue(): string {
    const status = this.account()?.['status'] as Record<string, unknown>;
    return (status?.['value'] as string) || '';
  }

  getCurrencySymbol(): string {
    const currency = this.account()?.['currency'] as Record<string, unknown>;
    return (currency?.['displaySymbol'] as string) || '';
  }

  getAccountBalance(): number | null {
    const balance = this.account()?.['accountBalance'];
    return balance != null ? Number(balance) : null;
  }

  getActivationDate(): string {
    const timeline = this.account()?.['timeline'] as Record<string, unknown>;
    return this.formatDate(timeline?.['activatedOnDate']);
  }

  getBalance(): number {
    return (this.account()?.['accountBalance'] as number) || 0;
  }

  formatDate(date: unknown): string {
    if (Array.isArray(date)) {
      return new Date(date[0], date[1] - 1, date[2]).toLocaleDateString();
    }
    return '-';
  }

  onDeposit(): void {
    this.router.navigate([`/products/recurring-deposits/${this.accountId}/transactions/deposit`]);
  }

  onWithdraw(): void {
    const type = this.isRD ? 'recurring-deposits' : 'fixed-deposits';
    this.router.navigate([`/products/${type}/${this.accountId}/transactions/withdrawal`]);
  }

  onBack(): void {
    const path = this.isRD ? '/products/recurring-deposits' : '/products/fixed-deposits';
    this.router.navigate([path]);
  }
}
