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

import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router, RouterModule } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { ConfigService } from '../../core/services/config.service';
import { ClientService, LoansService, SavingsAccountService } from '../../api';

/**
 * Dashboard component that displays system status and key performance metrics.
 */
@Component({
  selector: 'app-system-status',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    MatCardModule,
    MatIconModule,
    MatDividerModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    RouterModule,
  ],
  template: `
    <div class="dashboard-container">
      <div class="widgets-grid">
        <mat-card class="widget-card clients">
          <mat-card-content>
            <div class="widget-header">
              <mat-icon>people</mat-icon>
              <span class="widget-label">{{ 'DASHBOARD.TOTAL_CLIENTS' | translate }}</span>
            </div>
            @if (isLoading()) {
              <div class="widget-loader">
                <mat-spinner diameter="30"></mat-spinner>
              </div>
            } @else {
              <div class="widget-value">{{ clientCount() }}</div>
              <div class="widget-trend">{{ 'DASHBOARD.ACTIVE_MEMBERS' | translate }}</div>
            }
          </mat-card-content>
        </mat-card>

        <mat-card class="widget-card loans">
          <mat-card-content>
            <div class="widget-header">
              <mat-icon>account_balance</mat-icon>
              <span class="widget-label">{{ 'DASHBOARD.ACTIVE_LOANS' | translate }}</span>
            </div>
            @if (isLoading()) {
              <div class="widget-loader">
                <mat-spinner diameter="30"></mat-spinner>
              </div>
            } @else {
              <div class="widget-value">{{ activeLoans() }}</div>
              <div class="widget-trend highlight">
                {{ pendingLoans().length }} {{ 'DASHBOARD.PENDING_APPROVALS' | translate }}
              </div>
            }
          </mat-card-content>
        </mat-card>

        <mat-card class="widget-card savings">
          <mat-card-content>
            <div class="widget-header">
              <mat-icon>savings</mat-icon>
              <span class="widget-label">{{ 'DASHBOARD.SAVINGS_ACCOUNTS' | translate }}</span>
            </div>
            @if (isLoading()) {
              <div class="widget-loader">
                <mat-spinner diameter="30"></mat-spinner>
              </div>
            } @else {
              <div class="widget-value">{{ savingsCount() }}</div>
              <div class="widget-trend">
                {{ pendingSavings().length }} {{ 'DASHBOARD.PENDING_APPROVALS' | translate }}
              </div>
            }
          </mat-card-content>
        </mat-card>

        <mat-card class="widget-card status">
          <mat-card-content>
            <div class="widget-header">
              <mat-icon>dns</mat-icon>
              <span class="widget-label">{{ 'DASHBOARD.SYSTEM_HEALTH' | translate }}</span>
            </div>
            <div class="widget-value healthy">{{ 'DASHBOARD.ONLINE' | translate }}</div>
            <div class="widget-trend">API: {{ currentTenant() }}</div>
          </mat-card-content>
        </mat-card>
      </div>

      <div class="dashboard-layout">
        <div class="main-column">
          <mat-card class="approval-card">
            <mat-card-header>
              <mat-card-title>
                <mat-icon>pending_actions</mat-icon>
                {{ 'DASHBOARD.PENDING_APPROVALS' | translate }}
              </mat-card-title>
            </mat-card-header>
            <mat-card-content>
              @if (isLoading()) {
                <div class="empty-approvals">
                  <mat-spinner diameter="40"></mat-spinner>
                </div>
              } @else if (pendingLoans().length === 0 && pendingSavings().length === 0) {
                <div class="empty-approvals">
                  <mat-icon>check_circle_outline</mat-icon>
                  <p>{{ 'DASHBOARD.NO_PENDING_APPROVALS' | translate }}</p>
                </div>
              } @else {
                <div class="approval-list">
                  @for (loan of pendingLoans(); track loan.id) {
                    <div class="approval-item">
                      <div class="item-info">
                        <span class="item-type loan">LOAN</span>
                        <span class="item-id">#{{ loan.accountNo }}</span>
                        <span class="item-detail">{{ loan.clientName }}</span>
                      </div>
                      <button mat-button color="primary" [routerLink]="['/loans/view', loan.id]">
                        {{ 'COMMON.VIEW' | translate }}
                      </button>
                    </div>
                  }
                  @for (savings of pendingSavings(); track savings.id) {
                    <div class="approval-item">
                      <div class="item-info">
                        <span class="item-type savings">SAVINGS</span>
                        <span class="item-id">#{{ savings.accountNo }}</span>
                        <span class="item-detail">{{ savings.clientName }}</span>
                      </div>
                      <button
                        mat-button
                        color="primary"
                        [routerLink]="['/products/savings-accounts/view', savings.id]"
                      >
                        {{ 'COMMON.VIEW' | translate }}
                      </button>
                    </div>
                  }
                </div>
              }
            </mat-card-content>
          </mat-card>
        </div>

        <div class="side-column">
          <mat-card class="system-card">
            <mat-card-header>
              <mat-card-title>
                <mat-icon>settings</mat-icon>
                {{ 'DASHBOARD.SYSTEM_STATUS' | translate }}
              </mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <ul class="status-list">
                <li>
                  <span class="label">{{ 'DASHBOARD.RUNTIME_API' | translate }}:</span>
                  <span class="value">{{ configService.apiUrl }}</span>
                </li>
                <li>
                  <span class="label">{{ 'DASHBOARD.ENVIRONMENT' | translate }}:</span>
                  <span class="value badge" [ngClass]="isProd ? 'prod' : 'dev'">
                    {{ (isProd ? 'DASHBOARD.PRODUCTION' : 'DASHBOARD.DEVELOPMENT') | translate }}
                  </span>
                </li>
                <li>
                  <span class="label">{{ 'DASHBOARD.ACTIVE_TENANT' | translate }}:</span>
                  <span class="value">{{ currentTenant() }}</span>
                </li>
              </ul>
            </mat-card-content>
          </mat-card>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .dashboard-container {
        padding: 24px;
        display: flex;
        flex-direction: column;
        gap: 24px;
        max-width: 1400px;
        margin: 0 auto;
      }
      .widgets-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: 24px;
      }
      .widget-card {
        border-radius: 12px;
        border: none;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
        transition: transform 0.2s, box-shadow 0.2s;
      }
      .widget-card:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
      }
      .widget-header {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 12px;
        color: #7f8c8d;
      }
      .widget-header mat-icon {
        font-size: 24px;
        width: 24px;
        height: 24px;
      }
      .widget-label {
        font-size: 15px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
      .widget-value {
        font-size: 36px;
        font-weight: 700;
        margin-bottom: 8px;
        color: #2c3e50;
      }
      .widget-loader {
        height: 60px;
        display: flex;
        align-items: center;
        margin-bottom: 8px;
      }
      .widget-trend {
        font-size: 13px;
        color: #95a5a6;
      }
      .widget-trend.highlight {
        color: #e67e22;
        font-weight: 600;
      }
      .healthy {
        color: #27ae60;
      }
      .dashboard-layout {
        display: grid;
        grid-template-columns: 2fr 1fr;
        gap: 24px;
      }
      .main-column, .side-column {
        display: flex;
        flex-direction: column;
        gap: 24px;
      }
      mat-card-title {
        display: flex;
        align-items: center;
        gap: 10px;
        font-size: 18px;
        font-weight: 600;
        margin-bottom: 8px;
      }
      .approval-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px 16px;
        border-bottom: 1px solid #f0f2f5;
        transition: background 0.2s;
      }
      .approval-item:hover {
        background-color: #f8f9fa;
      }
      .approval-item:last-child {
        border-bottom: none;
      }
      .item-info {
        display: flex;
        align-items: center;
        gap: 12px;
      }
      .item-type {
        font-size: 10px;
        font-weight: 800;
        padding: 2px 6px;
        border-radius: 4px;
      }
      .item-type.loan { background: #e3f2fd; color: #1976d2; }
      .item-type.savings { background: #e8f5e9; color: #2e7d32; }
      .item-id {
        font-weight: 600;
        color: #34495e;
      }
      .item-detail {
        color: #7f8c8d;
      }
      .empty-approvals {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 48px;
        color: #bdc3c7;
      }
      .empty-approvals mat-icon {
        font-size: 48px;
        width: 48px;
        height: 48px;
        margin-bottom: 12px;
      }
      .status-list {
        list-style: none;
        padding: 0;
        margin: 0;
        display: flex;
        flex-direction: column;
        gap: 16px;
      }
      .status-list li {
        display: flex;
        flex-direction: column;
        gap: 4px;
      }
      .status-list .label {
        color: #7f8c8d;
        font-size: 12px;
        font-weight: 600;
        text-transform: uppercase;
      }
      .status-list .value {
        font-family: 'Roboto Mono', monospace;
        color: #2c3e50;
        word-break: break-all;
      }
      .badge {
        display: inline-block;
        padding: 4px 10px;
        border-radius: 20px;
        font-size: 11px;
        font-weight: 700;
        text-align: center;
        width: fit-content;
      }
      .prod { background: #fee2e2; color: #b91c1c; }
      .dev { background: #dcfce7; color: #15803d; }
    `,
  ],
})
export class SystemStatusComponent implements OnInit {
  protected readonly configService = inject(ConfigService);
  private readonly clientService = inject(ClientService);
  private readonly loansService = inject(LoansService);
  private readonly savingsService = inject(SavingsAccountService);
  private readonly router = inject(Router);

  protected readonly environmentUrl = environment.fineractApiUrl;
  protected readonly isProd = environment.production;
  protected readonly currentTenant = signal('default');
  isLoading = signal(true);

  clientCount = signal(0);
  activeLoans = signal(0);
  savingsCount = signal(0);

  pendingLoans = signal<any[]>([]);
  pendingSavings = signal<any[]>([]);

  ngOnInit(): void {
    this.loadMetrics();
  }

  private loadMetrics(): void {
    this.isLoading.set(true);
    forkJoin({
      clients: this.clientService.retrieveAll21(undefined, undefined, undefined, undefined, undefined, undefined, undefined, 0, 1),
      loans: this.loansService.retrieveAll27(undefined, 0, 100),
      savings: this.savingsService.retrieveAll33(undefined, 0, 100)
    }).pipe(
      catchError(() => of({ clients: null, loans: null, savings: null }))
    ).subscribe(data => {
      this.isLoading.set(false);
      if (data.clients) {
        this.clientCount.set((data.clients as any).totalFilteredRecords || 0);
      }
      
      if (data.loans) {
        const loans = (data.loans as any).pageItems || [];
        this.activeLoans.set(loans.filter((l: any) => l.status?.active).length);
        this.pendingLoans.set(loans.filter((l: any) => l.status?.pendingApproval));
      }

      if (data.savings) {
        const accounts = (data.savings as any).pageItems || [];
        this.savingsCount.set((data.savings as any).totalFilteredRecords || 0);
        this.pendingSavings.set(accounts.filter((a: any) => a.status?.submittedAndPendingApproval));
      }
    });
  }
}
