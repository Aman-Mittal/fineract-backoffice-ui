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
import { TranslateModule } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import {
  DataTableComponent,
  ColumnDef,
  CellTemplateDirective,
  StatusBadgeComponent,
} from '../../../shared';
import { RecurringDepositAccountService, GetRecurringDepositAccountsResponse } from '../../../api';

/**
 * Component for listing customer recurring deposit accounts.
 *
 * Provides a searchable, paginated overview of all recurring deposits.
 * Integrates with Fineract's RecurringDepositAccountService.
 */
@Component({
  selector: 'app-recurring-deposits-list',
  standalone: true,
  imports: [
    TranslateModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    DataTableComponent,
    CellTemplateDirective,
    StatusBadgeComponent,
  ],
  template: `
    <app-data-table
      title="Recurring Deposit Accounts"
      helpTextKey="HELP.RECURRING_DEPOSITS_DESC"
      createButtonLabel="RECURRING_DEPOSITS.CREATE"
      [columns]="columns"
      [data]="accounts"
      [totalRecords]="accounts.length"
      [showSearch]="true"
      [localLogic]="true"
      (create)="onCreateAccount()"
    >
      <ng-template appCellTemplate="status" let-account>
        <app-status-badge [status]="account.status"></app-status-badge>
      </ng-template>

      <ng-template appCellTemplate="actions" let-account>
        @if (account.status?.value === 'Submitted and pending approval') {
          <button
            mat-icon-button
            color="accent"
            [matTooltip]="'LOANS.APPROVE' | translate"
            (click)="onApprove(account)"
          >
            <mat-icon>check_circle</mat-icon>
          </button>
        }
        <button
          mat-icon-button
          color="primary"
          [attr.aria-label]="'COMMON.EDIT' | translate"
          matTooltip="Edit Account Details"
          (click)="onEditAccount(account)"
        >
          <mat-icon>edit</mat-icon>
        </button>
      </ng-template>
    </app-data-table>
  `,
})
export class RecurringDepositsListComponent implements OnInit {
  /** Service for RD account management */
  private readonly rdService = inject(RecurringDepositAccountService);
  /** Router for navigation */
  private readonly router = inject(Router);

  /** Data table column definitions */
  readonly columns: ColumnDef[] = [
    { key: 'accountNo', label: 'COMMON.ACCOUNT_NO', sortable: true },
    { key: 'clientName', label: 'COMMON.NAME', sortable: true },
    { key: 'recurringDepositAmount', label: 'COMMON.AMOUNT', sortable: true },
    { key: 'status', label: 'COMMON.STATUS', sortable: true },
    { key: 'actions', label: 'COMMON.ACTIONS', sortable: false },
  ];

  /** List of retrieved accounts */
  accounts: GetRecurringDepositAccountsResponse[] = [];

  /**
   * Component initialization.
   */
  ngOnInit(): void {
    this.loadAccounts();
  }

  /**
   * Fetches RD accounts from the API.
   */
  private loadAccounts(): void {
    this.rdService.retrieveAll31().subscribe({
      next: (data: GetRecurringDepositAccountsResponse[]) => {
        this.accounts = data || [];
      },
      error: (err: unknown) => {
        console.error('Failed to load recurring deposit accounts', err);
      },
    });
  }

  /**
   * Navigates to the RD creation form.
   */
  onCreateAccount(): void {
    this.router.navigate(['/products/recurring-deposits/create']);
  }

  /**
   * Navigates to the RD edit form.
   *
   * @param account - The RD account entity.
   */
  onEditAccount(account: GetRecurringDepositAccountsResponse): void {
    this.router.navigate(['/products/recurring-deposits/edit', account.id]);
  }

  onApprove(account: GetRecurringDepositAccountsResponse): void {
    this.router.navigate([`/products/recurring/${account.id}/action/approve`]);
  }
}
