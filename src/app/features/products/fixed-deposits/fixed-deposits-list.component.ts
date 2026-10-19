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

import { Router } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import {
  DataTableComponent,
  ColumnDef,
  CellTemplateDirective,
  StatusBadgeComponent,
} from '../../../shared';
import { DEPOSIT_ACCOUNT_API, TranslatePipe, type DepositAccount } from '../../../core/adapters';
import { ButtonComponent } from '../../../ui/button/button.component';
import { TooltipDirective } from '../../../shared/directives/tooltip.directive';

@Component({
  selector: 'app-fixed-deposits-list',
  standalone: true,
  imports: [
    TranslatePipe,
    DataTableComponent,
    CellTemplateDirective,
    StatusBadgeComponent,
    CurrencyPipe,
    ButtonComponent,
    TooltipDirective,
  ],
  template: `
    <app-data-table
      title="nav.fixedDeposits"
      helpTextKey="HELP.FIXED_DEPOSITS_DESC"
      createButtonLabel="FIXED_DEPOSITS.CREATE"
      createPermission="CREATE_FIXEDDEPOSITACCOUNT"
      [columns]="columns"
      [data]="accounts()"
      [totalRecords]="accounts().length"
      [showSearch]="true"
      [localLogic]="true"
      (create)="onCreateAccount()"
    >
      <ng-template appCellTemplate="depositAmount" let-account>
        {{ account.depositAmount | currency: account.currencyCode }}
      </ng-template>

      <ng-template appCellTemplate="maturityAmount" let-account>
        {{ account.maturityAmount | currency: account.currencyCode }}
      </ng-template>

      <ng-template appCellTemplate="status" let-account>
        <app-status-badge [status]="account.status"></app-status-badge>
      </ng-template>

      <ng-template appCellTemplate="actions" let-account>
        <!--
          Gated on the status flag, not on a comparison of status.value against the English
          string "Submitted and pending approval". That label moves with the platform's locale;
          the booleans beside it do not. See the DepositAccountStatus model.
        -->
        @if (account.status.submittedAndPendingApproval) {
          <app-button
            type="button"
            emphasis="quiet"
            intent="secondary"
            icon="checkmark-circle-outline"
            [label]="'LOANS.APPROVE' | appTranslate"
            [appTooltip]="'LOANS.APPROVE' | appTranslate"
            (click)="onApprove(account)"
          />
        }
        <app-button
          type="button"
          emphasis="quiet"
          intent="primary"
          icon="create-outline"
          [label]="'COMMON.EDIT' | appTranslate"
          (click)="onEditAccount(account)"
        />
      </ng-template>
    </app-data-table>
  `,
})
export class FixedDepositAccountsListComponent implements OnInit {
  private readonly deposits = inject(DEPOSIT_ACCOUNT_API);
  private readonly router = inject(Router);

  readonly columns: ColumnDef[] = [
    { key: 'accountNo', label: 'COMMON.ACCOUNT_NO', sortable: true },
    { key: 'clientName', label: 'COMMON.NAME', sortable: true },
    { key: 'depositAmount', label: 'COMMON.AMOUNT', sortable: true },
    { key: 'maturityAmount', label: 'COMMON.MATURITY_AMOUNT', sortable: true },
    { key: 'status', label: 'COMMON.STATUS', sortable: true },
    { key: 'actions', label: 'COMMON.ACTIONS', sortable: false },
  ];

  readonly accounts = signal<DepositAccount[]>([]);

  ngOnInit(): void {
    this.loadAccounts();
  }

  private loadAccounts(): void {
    this.deposits.list('fixed').subscribe({
      next: (accounts) => this.accounts.set(accounts),
      error: () => this.accounts.set([]),
    });
  }

  onCreateAccount(): void {
    this.router.navigate(['/products/fixed-deposits/create']);
  }

  onEditAccount(account: DepositAccount): void {
    this.router.navigate(['/products/fixed-deposits/edit', account.id]);
  }

  onApprove(account: DepositAccount): void {
    this.router.navigate([`/products/fixed/${account.id}/action/approve`]);
  }
}
