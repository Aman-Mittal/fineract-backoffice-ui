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

import { Component, inject } from '@angular/core';

import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';
import { SidebarService } from '../core/services/sidebar.service';

/**
 * Responsive sidebar component for primary application navigation.
 *
 * Provides links to core feature modules including Dashboard, Clients,
 * Loans, and Organization management. Supports active route highlighting.
 */
@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterModule, TranslateModule, MatIconModule],
  template: `
    <nav
      class="sidebar"
      [class.collapsed]="sidebarService.isCollapsed()"
      role="navigation"
      [attr.aria-label]="'nav.main' | translate"
    >
      <ul class="nav-list">
        <li>
          <a routerLink="/dashboard" routerLinkActive="active" class="nav-item">
            <mat-icon class="nav-icon">dashboard</mat-icon>
            <span class="nav-text">{{ 'nav.dashboard' | translate }}</span>
          </a>
        </li>
        <li>
          <a routerLink="/clients" routerLinkActive="active" class="nav-item">
            <mat-icon class="nav-icon">people</mat-icon>
            <span class="nav-text">{{ 'nav.clients' | translate }}</span>
          </a>
        </li>
        <li>
          <a routerLink="/groups" routerLinkActive="active" class="nav-item">
            <mat-icon class="nav-icon">group</mat-icon>
            <span class="nav-text">{{ 'nav.groups' | translate }}</span>
          </a>
        </li>
        <li>
          <a routerLink="/centers" routerLinkActive="active" class="nav-item">
            <mat-icon class="nav-icon">place</mat-icon>
            <span class="nav-text">{{ 'nav.centers' | translate }}</span>
          </a>
        </li>
        <li>
          <a routerLink="/loans" routerLinkActive="active" class="nav-item">
            <mat-icon class="nav-icon">payments</mat-icon>
            <span class="nav-text">{{ 'nav.loans' | translate }}</span>
          </a>
        </li>
        <li>
          <div class="nav-group">
            <span class="nav-group-header">{{ 'nav.transfers' | translate }}</span>
            <ul class="nav-sub-list">
              <li>
                <a
                  routerLink="/transfers/account-transfer"
                  routerLinkActive="active"
                  class="nav-item sub-item"
                >
                  <mat-icon class="nav-icon">swap_horiz</mat-icon>
                  <span class="nav-text">{{ 'nav.accountTransfer' | translate }}</span>
                </a>
              </li>
              <li>
                <a
                  routerLink="/transfers/standing-instructions"
                  routerLinkActive="active"
                  class="nav-item sub-item"
                >
                  <mat-icon class="nav-icon">schedule_send</mat-icon>
                  <span class="nav-text">{{ 'nav.standingInstructions' | translate }}</span>
                </a>
              </li>
              <li>
                <a
                  routerLink="/transfers/standing-instructions/history"
                  routerLinkActive="active"
                  class="nav-item sub-item"
                >
                  <mat-icon class="nav-icon">history</mat-icon>
                  <span class="nav-text">{{ 'nav.standingInstructionsHistory' | translate }}</span>
                </a>
              </li>
            </ul>
          </div>
        </li>
        <li>
          <div class="nav-group">
            <span class="nav-group-header">{{ 'nav.products' | translate }}</span>
            <ul class="nav-sub-list">
              <li>
                <a routerLink="/products/loan" routerLinkActive="active" class="nav-item sub-item">
                  <mat-icon class="nav-icon">currency_exchange</mat-icon>
                  <span class="nav-text">{{ 'nav.loanProducts' | translate }}</span>
                </a>
              </li>
              <li>
                <a
                  routerLink="/products/savings"
                  routerLinkActive="active"
                  class="nav-item sub-item"
                >
                  <mat-icon class="nav-icon">savings</mat-icon>
                  <span class="nav-text">{{ 'nav.savingsProducts' | translate }}</span>
                </a>
              </li>
              <li>
                <a routerLink="/products/fixed" routerLinkActive="active" class="nav-item sub-item">
                  <mat-icon class="nav-icon">account_balance</mat-icon>
                  <span class="nav-text">{{ 'nav.fixedDepositProducts' | translate }}</span>
                </a>
              </li>
              <li>
                <a
                  routerLink="/products/recurring"
                  routerLinkActive="active"
                  class="nav-item sub-item"
                >
                  <mat-icon class="nav-icon">autorenew</mat-icon>
                  <span class="nav-text">{{ 'nav.recurringDepositProducts' | translate }}</span>
                </a>
              </li>
              <li>
                <a routerLink="/products/share" routerLinkActive="active" class="nav-item sub-item">
                  <mat-icon class="nav-icon">pie_chart</mat-icon>
                  <span class="nav-text">{{ 'nav.shareProducts' | translate }}</span>
                </a>
              </li>
              <li>
                <a
                  routerLink="/products/tax-components"
                  routerLinkActive="active"
                  class="nav-item sub-item"
                >
                  <mat-icon class="nav-icon">percent</mat-icon>
                  <span class="nav-text">{{ 'nav.taxComponents' | translate }}</span>
                </a>
              </li>
              <li>
                <a
                  routerLink="/products/tax-groups"
                  routerLinkActive="active"
                  class="nav-item sub-item"
                >
                  <mat-icon class="nav-icon">receipt_long</mat-icon>
                  <span class="nav-text">{{ 'nav.taxGroups' | translate }}</span>
                </a>
              </li>
              <li>
                <a
                  routerLink="/products/floating-rates"
                  routerLinkActive="active"
                  class="nav-item sub-item"
                >
                  <mat-icon class="nav-icon">trending_up</mat-icon>
                  <span class="nav-text">{{ 'nav.floatingRates' | translate }}</span>
                </a>
              </li>
              <li class="nav-divider"></li>
              <li>
                <a
                  routerLink="/products/savings-accounts"
                  routerLinkActive="active"
                  class="nav-item sub-item"
                >
                  <mat-icon class="nav-icon">wallet</mat-icon>
                  <span class="nav-text">{{ 'nav.savingsAccounts' | translate }}</span>
                </a>
              </li>
              <li>
                <a
                  routerLink="/products/fixed-deposits"
                  routerLinkActive="active"
                  class="nav-item sub-item"
                >
                  <mat-icon class="nav-icon">lock</mat-icon>
                  <span class="nav-text">{{ 'nav.fixedDeposits' | translate }}</span>
                </a>
              </li>
              <li>
                <a
                  routerLink="/products/recurring-deposits"
                  routerLinkActive="active"
                  class="nav-item sub-item"
                >
                  <mat-icon class="nav-icon">history</mat-icon>
                  <span class="nav-text">{{ 'nav.recurringDeposits' | translate }}</span>
                </a>
              </li>
              <li>
                <a
                  routerLink="/products/shares"
                  routerLinkActive="active"
                  class="nav-item sub-item"
                >
                  <mat-icon class="nav-icon">show_chart</mat-icon>
                  <span class="nav-text">{{ 'nav.shares' | translate }}</span>
                </a>
              </li>
            </ul>
          </div>
        </li>
        <li>
          <div class="nav-group">
            <span class="nav-group-header">{{ 'nav.fintech' | translate }}</span>
            <ul class="nav-sub-list">
              <li>
                <a
                  routerLink="/fintech/asset-owners"
                  routerLinkActive="active"
                  class="nav-item sub-item"
                >
                  <mat-icon class="nav-icon">admin_panel_settings</mat-icon>
                  <span class="nav-text">{{ 'nav.assetOwners' | translate }}</span>
                </a>
              </li>
            </ul>
          </div>
        </li>
        <li>
          <div class="nav-group">
            <span class="nav-group-header">{{ 'nav.accounting' | translate }}</span>
            <ul class="nav-sub-list">
              <li>
                <a
                  routerLink="/accounting/chart-of-accounts"
                  routerLinkActive="active"
                  class="nav-item sub-item"
                >
                  <mat-icon class="nav-icon">account_tree</mat-icon>
                  <span class="nav-text">{{ 'nav.chartOfAccounts' | translate }}</span>
                </a>
              </li>
              <li>
                <a
                  routerLink="/accounting/journal-entries"
                  routerLinkActive="active"
                  class="nav-item sub-item"
                >
                  <mat-icon class="nav-icon">menu_book</mat-icon>
                  <span class="nav-text">{{ 'nav.journalEntries' | translate }}</span>
                </a>
              </li>
              <li>
                <a
                  routerLink="/accounting/closures"
                  routerLinkActive="active"
                  class="nav-item sub-item"
                >
                  <mat-icon class="nav-icon">assignment_turned_in</mat-icon>
                  <span class="nav-text">{{ 'nav.accountingClosures' | translate }}</span>
                </a>
              </li>
              <li>
                <a
                  routerLink="/accounting/rules"
                  routerLinkActive="active"
                  class="nav-item sub-item"
                >
                  <mat-icon class="nav-icon">gavel</mat-icon>
                  <span class="nav-text">{{ 'nav.accountingRules' | translate }}</span>
                </a>
              </li>
              <li>
                <a
                  routerLink="/accounting/financial-activity-mappings"
                  routerLinkActive="active"
                  class="nav-item sub-item"
                >
                  <mat-icon class="nav-icon">swap_horiz</mat-icon>
                  <span class="nav-text">{{ 'nav.financialActivityMappings' | translate }}</span>
                </a>
              </li>
              <li>
                <a
                  routerLink="/accounting/charges"
                  routerLinkActive="active"
                  class="nav-item sub-item"
                >
                  <mat-icon class="nav-icon">percent</mat-icon>
                  <span class="nav-text">{{ 'nav.charges' | translate }}</span>
                </a>
              </li>
            </ul>
          </div>
        </li>
        <li>
          <div class="nav-group">
            <span class="nav-group-header">{{ 'nav.tasks' | translate }}</span>
            <ul class="nav-sub-list">
              <li>
                <a
                  routerLink="/tasks/checker-inbox"
                  routerLinkActive="active"
                  class="nav-item sub-item"
                >
                  <mat-icon class="nav-icon">inbox</mat-icon>
                  <span class="nav-text">{{ 'nav.checker_inbox' | translate }}</span>
                </a>
              </li>
            </ul>
          </div>
        </li>
        <li>
          <div class="nav-group">
            <span class="nav-group-header">{{ 'nav.security' | translate }}</span>
            <ul class="nav-sub-list">
              <li>
                <a routerLink="/security/users" routerLinkActive="active" class="nav-item sub-item">
                  <mat-icon class="nav-icon">person_outline</mat-icon>
                  <span class="nav-text">{{ 'nav.users' | translate }}</span>
                </a>
              </li>
              <li>
                <a routerLink="/security/roles" routerLinkActive="active" class="nav-item sub-item">
                  <mat-icon class="nav-icon">manage_accounts</mat-icon>
                  <span class="nav-text">{{ 'nav.roles' | translate }}</span>
                </a>
              </li>
              <li>
                <a
                  routerLink="/security/audits"
                  routerLinkActive="active"
                  class="nav-item sub-item"
                >
                  <mat-icon class="nav-icon">history_edits</mat-icon>
                  <span class="nav-text">{{ 'nav.audits' | translate }}</span>
                </a>
              </li>
            </ul>
          </div>
        </li>
        <li>
          <div class="nav-group">
            <span class="nav-group-header">{{ 'nav.reporting' | translate }}</span>
            <ul class="nav-sub-list">
              <li>
                <a routerLink="/reporting" routerLinkActive="active" class="nav-item sub-item">
                  <mat-icon class="nav-icon">assessment</mat-icon>
                  <span class="nav-text">{{ 'nav.reports' | translate }}</span>
                </a>
              </li>
            </ul>
          </div>
        </li>
        <li>
          <div class="nav-group">
            <span class="nav-group-header">{{ 'nav.settings' | translate }}</span>
            <ul class="nav-sub-list">
              <li>
                <a
                  routerLink="/settings/configurations"
                  routerLinkActive="active"
                  class="nav-item sub-item"
                >
                  <mat-icon class="nav-icon">tune</mat-icon>
                  <span class="nav-text">{{ 'nav.globalConfigurations' | translate }}</span>
                </a>
              </li>
              <li>
                <a
                  routerLink="/settings/holidays"
                  routerLinkActive="active"
                  class="nav-item sub-item"
                >
                  <mat-icon class="nav-icon">event_busy</mat-icon>
                  <span class="nav-text">{{ 'nav.holidays' | translate }}</span>
                </a>
              </li>
              <li>
                <a
                  routerLink="/settings/working-days"
                  routerLinkActive="active"
                  class="nav-item sub-item"
                >
                  <mat-icon class="nav-icon">calendar_today</mat-icon>
                  <span class="nav-text">{{ 'nav.workingDays' | translate }}</span>
                </a>
              </li>
            </ul>
          </div>
        </li>
        <li>
          <div class="nav-group">
            <span class="nav-group-header">{{ 'nav.tellerOperations' | translate }}</span>
            <ul class="nav-sub-list">
              <li>
                <a routerLink="/tellers" routerLinkActive="active" class="nav-item sub-item">
                  <mat-icon class="nav-icon">storefront</mat-icon>
                  <span class="nav-text">{{ 'nav.tellers' | translate }}</span>
                </a>
              </li>
            </ul>
          </div>
        </li>
        <li>
          <div class="nav-group">
            <span class="nav-group-header">{{ 'nav.organization' | translate }}</span>
            <ul class="nav-sub-list">
              <li>
                <a
                  routerLink="/organization/offices"
                  routerLinkActive="active"
                  class="nav-item sub-item"
                >
                  <mat-icon class="nav-icon">corporate_fare</mat-icon>
                  <span class="nav-text">{{ 'nav.offices' | translate }}</span>
                </a>
              </li>
              <li>
                <a
                  routerLink="/organization/staff"
                  routerLinkActive="active"
                  class="nav-item sub-item"
                >
                  <mat-icon class="nav-icon">badge</mat-icon>
                  <span class="nav-text">{{ 'nav.staff' | translate }}</span>
                </a>
              </li>
              <li>
                <a
                  routerLink="/organization/funds"
                  routerLinkActive="active"
                  class="nav-item sub-item"
                >
                  <mat-icon class="nav-icon">savings</mat-icon>
                  <span class="nav-text">{{ 'nav.funds' | translate }}</span>
                </a>
              </li>
              <li>
                <a
                  routerLink="/organization/payment-types"
                  routerLinkActive="active"
                  class="nav-item sub-item"
                >
                  <mat-icon class="nav-icon">payments</mat-icon>
                  <span class="nav-text">{{ 'nav.paymentTypes' | translate }}</span>
                </a>
              </li>
            </ul>
          </div>
        </li>
        <li>
          <div class="nav-group">
            <span class="nav-group-header">{{ 'nav.system' | translate }}</span>
            <ul class="nav-sub-list">
              <li>
                <a
                  routerLink="/system/data-tables"
                  routerLinkActive="active"
                  class="nav-item sub-item"
                >
                  <mat-icon class="nav-icon">table_chart</mat-icon>
                  <span class="nav-text">{{ 'nav.dataTables' | translate }}</span>
                </a>
              </li>
              <li>
                <a
                  routerLink="/system/bulk-import"
                  routerLinkActive="active"
                  class="nav-item sub-item"
                >
                  <mat-icon class="nav-icon">publish</mat-icon>
                  <span class="nav-text">{{ 'nav.bulkImport' | translate }}</span>
                </a>
              </li>
              <li>
                <a
                  routerLink="/system/delinquency"
                  routerLinkActive="active"
                  class="nav-item sub-item"
                >
                  <mat-icon class="nav-icon">gavel</mat-icon>
                  <span class="nav-text">{{ 'nav.delinquency' | translate }}</span>
                </a>
              </li>
            </ul>
          </div>
        </li>
      </ul>
    </nav>
  `,
  styles: [
    `
      .sidebar {
        width: var(--sidebar-width);
        background-color: var(--secondary-color);
        color: #fff;
        height: calc(100vh - var(--header-height));
        padding-top: 1rem;
        overflow-y: auto;
        overflow-x: hidden;
        scrollbar-width: thin;
        scrollbar-color: rgba(255, 255, 255, 0.2) transparent;
        transition: width 0.2s ease-in-out;
      }
      :host-context([data-theme='dark']) .sidebar {
        background-color: var(--card-bg);
        border-right: 1px solid var(--border-color);
      }
      .sidebar.collapsed {
        width: 64px;
      }
      .sidebar::-webkit-scrollbar {
        width: 6px;
      }
      .sidebar::-webkit-scrollbar-track {
        background: transparent;
      }
      .sidebar::-webkit-scrollbar-thumb {
        background: rgba(255, 255, 255, 0.2);
        border-radius: 3px;
      }
      .sidebar::-webkit-scrollbar-thumb:hover {
        background: rgba(255, 255, 255, 0.4);
      }
      .nav-list {
        list-style: none;
        padding: 0;
        margin: 0;
      }
      .nav-item {
        display: flex;
        align-items: center;
        padding: 0.75rem 1.5rem;
        color: #bdc3c7;
        text-decoration: none;
        transition: all 0.2s;
      }
      :host-context([data-theme='dark']) .nav-item {
        color: rgba(255, 255, 255, 0.7);
      }
      .nav-item:hover {
        background-color: #34495e;
        color: #fff;
      }
      :host-context([data-theme='dark']) .nav-item:hover {
        background-color: rgba(255, 255, 255, 0.1);
        color: #fff;
      }
      .nav-item.active {
        background-color: var(--primary-color);
        color: #fff;
        border-left: 4px solid #fff;
      }
      :host-context([data-theme='dark']) .nav-item.active {
        border-left-color: var(--primary-color);
        background-color: rgba(52, 152, 219, 0.25);
        color: #fff;
      }
      .nav-icon {
        font-size: 20px;
        width: 20px;
        height: 20px;
        margin-right: 0.75rem;
        flex-shrink: 0;
        display: inline-flex;
        align-items: center;
        justify-content: center;
      }
      .sidebar.collapsed .nav-icon {
        margin-right: 0;
      }
      .nav-text {
        font-size: 0.9rem;
        font-weight: 500;
        transition: opacity 0.2s;
        white-space: nowrap;
      }
      .sidebar.collapsed .nav-text {
        display: none;
      }
      .nav-group {
        padding: 0.5rem 0;
        transition: padding 0.2s;
      }
      .sidebar.collapsed .nav-group {
        padding: 0;
      }
      .nav-group-header {
        display: block;
        padding: 0.5rem 1.5rem;
        font-size: 0.75rem;
        text-transform: uppercase;
        color: #7f8c8d;
        font-weight: 700;
        letter-spacing: 1px;
        white-space: nowrap;
      }
      :host-context([data-theme='dark']) .nav-group-header {
        color: rgba(255, 255, 255, 0.4);
      }
      .sidebar.collapsed .nav-group-header {
        display: none;
      }
      .nav-sub-list {
        list-style: none;
        padding: 0;
        margin: 0;
      }
      .sub-item {
        padding-left: 2.5rem;
      }
      .sidebar.collapsed .sub-item {
        padding-left: 0.75rem;
        justify-content: center;
      }
      .nav-divider {
        height: 1px;
        background-color: rgba(255, 255, 255, 0.1);
        margin: 0.5rem 1.5rem;
      }
      .sidebar.collapsed .nav-divider {
        display: none;
      }
    `,
  ],
})
export class SidebarComponent {
  protected readonly sidebarService = inject(SidebarService);
}
