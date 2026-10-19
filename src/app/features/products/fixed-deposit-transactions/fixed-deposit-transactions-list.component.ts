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
import { ActivatedRoute } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { ColumnDef, CellTemplateDirective, IsoDatePipe } from '../../../shared';
import { DataTableComponent } from '../../../shared/components/data-table/data-table.component';
import { DEPOSIT_ACCOUNT_API, type DepositTransaction } from '../../../core/adapters';

/**
 * Read-only list of transactions for a single fixed deposit account. The account id is read
 * from the route snapshot. Deposits and withdrawals are command-driven elsewhere, so this is a
 * view-only screen with no create action.
 */
@Component({
  selector: 'app-fixed-deposit-transactions-list',
  standalone: true,
  imports: [DataTableComponent, CellTemplateDirective, IsoDatePipe, DecimalPipe],
  template: `
    <app-data-table
      title="FIXED_DEPOSIT_TRANSACTIONS.TITLE"
      helpTextKey="HELP.FIXED_DEPOSIT_TRANSACTIONS_DESC"
      [columns]="columns"
      [data]="transactions()"
      [totalRecords]="transactions().length"
      [localLogic]="true"
    >
      <ng-template appCellTemplate="date" let-row>
        {{ row.date | appIsoDate }}
      </ng-template>
      <ng-template appCellTemplate="amount" let-row>
        {{ row.currencySymbol }} {{ row.amount | number: '1.2-2' }}
      </ng-template>
      <!--
        The type's label, not its code. This used to render transactionType.code, so a row
        read "savingsAccountTransactionType.payCharge" instead of "Pay Charge".
      -->
      <ng-template appCellTemplate="transactionType" let-row>
        {{ row.typeLabel }}
      </ng-template>
    </app-data-table>
  `,
})
export class FixedDepositTransactionsListComponent implements OnInit {
  private readonly deposits = inject(DEPOSIT_ACCOUNT_API);
  private readonly route = inject(ActivatedRoute);

  readonly columns: ColumnDef[] = [
    { key: 'date', label: 'FIXED_DEPOSIT_TRANSACTIONS.DATE', sortable: true },
    { key: 'amount', label: 'FIXED_DEPOSIT_TRANSACTIONS.AMOUNT', sortable: true },
    { key: 'transactionType', label: 'FIXED_DEPOSIT_TRANSACTIONS.TYPE', sortable: false },
  ];

  accountId!: number;
  readonly transactions = signal<DepositTransaction[]>([]);

  ngOnInit(): void {
    this.accountId = Number(this.route.snapshot.paramMap.get('accountId'));
    this.load();
  }

  load(): void {
    this.deposits.transactions('fixed', this.accountId).subscribe({
      next: (transactions) => this.transactions.set(transactions),
      error: () => this.transactions.set([]),
    });
  }
}
