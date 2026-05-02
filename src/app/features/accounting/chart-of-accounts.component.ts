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
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { Sort } from '@angular/material/sort';
import { of } from 'rxjs';
import { catchError, startWith } from 'rxjs/operators';
import { DataTableComponent, CellTemplateDirective, ColumnDef } from '../../shared';
import { GeneralLedgerAccountService, GetGLAccountsResponse } from '../../api';

@Component({
  selector: 'app-chart-of-accounts',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    DataTableComponent,
    CellTemplateDirective
  ],
  template: `
    <app-data-table
      title="Chart of Accounts"
      helpTextKey="HELP.CHART_OF_ACCOUNTS_DESC"
      createButtonLabel="Add Ledger Account"
      [columns]="columns"
      [data]="accounts"
      (create)="onCreateAccount()"
      (sortChange)="onSort($event)">
      
      <ng-template appCellTemplate="type" let-account>
        <span class="type-tag" [ngClass]="account.type?.value?.toLowerCase()">
          {{ account.type?.value }}
        </span>
      </ng-template>

      <ng-template appCellTemplate="actions" let-account>
        <button mat-icon-button color="primary" matTooltip="Edit Account" (click)="onEditAccount(account)">
          <mat-icon>edit</mat-icon>
        </button>
      </ng-template>
    </app-data-table>
  `,
  styles: [`
    .type-tag {
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: bold;
    }
    .asset { background-color: #e3f2fd; color: #1976d2; }
    .liability { background-color: #fce4ec; color: #c2185b; }
    .equity { background-color: #f3e5f5; color: #7b1fa2; }
    .income { background-color: #e8f5e9; color: #388e3c; }
    .expense { background-color: #fff3e0; color: #f57c00; }
  `]
})
export class ChartOfAccountsComponent {
  private readonly glAccountService = inject(GeneralLedgerAccountService);
  private readonly router = inject(Router);

  columns: ColumnDef[] = [
    { key: 'glCode', label: 'GL Code', sortable: true },
    { key: 'name', label: 'Account Name', sortable: true },
    { key: 'type', label: 'Type', sortable: true },
    { key: 'usage', label: 'Usage', sortable: true },
    { key: 'actions', label: 'Actions', sortable: false }
  ];

  accounts: GetGLAccountsResponse[] = [];

  constructor() {
    this.glAccountService.retrieveAllAccounts()
      .pipe(
        startWith([]),
        catchError(() => of([]))
      )
      .subscribe(data => {
        this.accounts = data;
      });
  }

  onSort(sort: Sort) {
    if (sort.direction) {
      this.accounts = [...this.accounts].sort((a, b) => {
        const isAsc = sort.direction === 'asc';
        const aValue = (a as Record<string, unknown>)[sort.active] ?? '';
        const bValue = (b as Record<string, unknown>)[sort.active] ?? '';
        return (String(aValue) < String(bValue) ? -1 : 1) * (isAsc ? 1 : -1);
      });
    }
  }

  onCreateAccount() {
    this.router.navigate(['/accounting/chart-of-accounts/create']);
  }

  onEditAccount(account: GetGLAccountsResponse) {
    this.router.navigate(['/accounting/chart-of-accounts/edit', account.id]);
  }
}
