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
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { Subject, merge, of } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import {
  DataTableComponent,
  ColumnDef,
  CellTemplateDirective,
  StatusBadgeComponent,
} from '../../shared';
import {
  SavingsAccountService,
  GetSavingsAccountsResponse,
  GetSavingsPageItems,
} from '../../api';

/**
 * Component for displaying a list of customer savings accounts.
 *
 * Provides a searchable data table integration with the Fineract Savings Account API.
 * Supports server-side pagination and sorting.
 *
 * @example
 * <app-savings-accounts-list></app-savings-accounts-list>
 */
@Component({
  selector: 'app-savings-accounts-list',
  standalone: true,
  imports: [
    CommonModule,
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
      title="nav.savingsAccounts"
      helpTextKey="HELP.SAVINGS_ACCOUNTS_DESC"
      createButtonLabel="SAVINGS.CREATE_ACCOUNT"
      [columns]="columns"
      [data]="accounts"
      [totalRecords]="totalRecords"
      [showSearch]="true"
      (create)="onCreateAccount()"
      (searchChange)="onSearch($event)"
      (sortChange)="onSort($event)"
      (pageChange)="onPage($event)"
    >
      <ng-template appCellTemplate="status" let-account>
        <app-status-badge [status]="account.status"></app-status-badge>
      </ng-template>

      <ng-template appCellTemplate="actions" let-account>
        <button
          mat-icon-button
          color="primary"
          [attr.aria-label]="'COMMON.EDIT' | translate"
          matTooltip="Edit Account"
          (click)="onEditAccount(account)"
        >
          <mat-icon>edit</mat-icon>
        </button>
        <button
          mat-icon-button
          color="accent"
          [attr.aria-label]="'SAVINGS.DEPOSIT' | translate"
          matTooltip="Deposit Cash"
          (click)="onTransaction(account, 'deposit')"
        >
          <mat-icon>add_circle_outline</mat-icon>
        </button>
        <button
          mat-icon-button
          color="warn"
          [attr.aria-label]="'SAVINGS.WITHDRAWAL' | translate"
          matTooltip="Withdraw Cash"
          (click)="onTransaction(account, 'withdrawal')"
        >
          <mat-icon>remove_circle_outline</mat-icon>
        </button>
      </ng-template>
    </app-data-table>
  `,
})
export class SavingsAccountsListComponent implements OnInit {
  /** Service for savings account lifecycle management */
  private readonly savingsService = inject(SavingsAccountService);
  /** Router for navigation */
  private readonly router = inject(Router);

  /** Column definitions for the savings accounts table */
  readonly columns: ColumnDef[] = [
    { key: 'accountNo', label: 'COMMON.ACCOUNT_NO', sortable: true },
    { key: 'clientName', label: 'COMMON.NAME', sortable: true },
    { key: 'savingsProductName', label: 'COMMON.PRODUCT', sortable: true },
    { key: 'accountBalance', label: 'COMMON.BALANCE', sortable: true },
    { key: 'status', label: 'COMMON.STATUS', sortable: true },
    { key: 'actions', label: 'COMMON.ACTIONS', sortable: false },
  ];

  /** Current list of accounts to display */
  accounts: GetSavingsPageItems[] = [];
  /** Total count for pagination */
  totalRecords = 0;

  /** Subjects for managing reactive data stream */
  private searchSubject = new Subject<string>();
  private sortSubject = new Subject<Sort>();
  private pageSubject = new Subject<PageEvent>();

  /** Current state of filtering/pagination */
  private currentFilter = '';
  private currentSort: Sort = { active: '', direction: '' };
  private currentPage: PageEvent = { pageIndex: 0, pageSize: 10, length: 0 };

  /**
   * Initializes the component and sets up the reactive data stream.
   */
  ngOnInit(): void {
    merge(this.searchSubject, this.sortSubject, this.pageSubject)
      .pipe(
        startWith({}),
        switchMap(() => {
          const offset = this.currentPage.pageIndex * this.currentPage.pageSize;
          const limit = this.currentPage.pageSize;
          const orderBy = this.currentSort.active || undefined;
          const sortOrder = this.currentSort.direction
            ? this.currentSort.direction.toUpperCase()
            : undefined;

          // Note: SavingsAccountService.retrieveAll33 supports offset/limit.
          // Fineract 1.x doesn't always support 'externalId' as a partial name search, 
          // but we use it if search is provided.
          const searchVal = this.currentFilter || undefined;

          return this.savingsService
            .retrieveAll33(searchVal, offset, limit, orderBy, sortOrder)
            .pipe(catchError(() => of(null)));
        }),
        map((response: GetSavingsAccountsResponse | null) => {
          if (!response) return [];
          this.totalRecords = response.totalFilteredRecords || 0;
          return Array.from(response.pageItems || []);
        }),
      )
      .subscribe((data) => {
        this.accounts = data;
      });
  }

  /**
   * Filters the account list based on user search input.
   *
   * @param query - Search string.
   */
  onSearch(query: string): void {
    this.currentFilter = query;
    this.currentPage.pageIndex = 0;
    this.searchSubject.next(query);
  }

  /**
   * Handles sort changes.
   *
   * @param sort - New sort state.
   */
  onSort(sort: Sort): void {
    this.currentSort = sort;
    this.currentPage.pageIndex = 0;
    this.sortSubject.next(sort);
  }

  /**
   * Handles page changes.
   *
   * @param event - New page state.
   */
  onPage(event: PageEvent): void {
    this.currentPage = event;
    this.pageSubject.next(event);
  }

  /**
   * Navigates to the savings account creation form.
   */
  onCreateAccount(): void {
    this.router.navigate(['/products/savings-accounts/create']);
  }

  /**
   * Navigates to the edit form for a specific savings account.
   *
   * @param account - The account entity to edit.
   */
  onEditAccount(account: GetSavingsPageItems): void {
    this.router.navigate(['/products/savings-accounts/edit', account.id]);
  }

  /**
   * Navigates to the transaction form for a specific savings account.
   *
   * @param account - The savings account.
   * @param command - The transaction type (deposit/withdrawal).
   */
  onTransaction(account: GetSavingsPageItems, command: string): void {
    this.router.navigate(['/products/savings-accounts', account.id, 'transactions', command]);
  }
}
