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
import { DEPOSIT_ACCOUNT_API, type SavingsOnHoldTransaction } from '../../../core/adapters';

/**
 * Read-only list of on-hold fund transactions for a single savings account. The savings id is
 * read from the route snapshot. On-hold funds are created as a side effect of loan guarantees,
 * so this screen is view-only with no actions.
 */
@Component({
  selector: 'app-on-hold-transactions-list',
  standalone: true,
  imports: [DataTableComponent, CellTemplateDirective, IsoDatePipe, DecimalPipe],
  template: `
    <app-data-table
      title="ON_HOLD_TRANSACTIONS.TITLE"
      helpTextKey="HELP.ON_HOLD_TRANSACTIONS_DESC"
      [columns]="columns"
      [data]="transactions()"
      [totalRecords]="transactions().length"
      [localLogic]="true"
    >
      <ng-template appCellTemplate="date" let-row>
        {{ row.date | appIsoDate }}
      </ng-template>
      <ng-template appCellTemplate="amount" let-row>
        {{ row.amount | number: '1.2-2' }}
      </ng-template>
      <ng-template appCellTemplate="typeLabel" let-row>
        {{ row.typeLabel }}
      </ng-template>
      <!--
        The loan the funds are held for, which is what one of these rows is about. The column
        used to render loanClientName, a field this response does not carry, so it was blank on
        every row — see the SavingsOnHoldTransaction model.
      -->
      <ng-template appCellTemplate="loanId" let-row>
        {{ row.loanId ?? '—' }}
      </ng-template>
    </app-data-table>
  `,
})
export class OnHoldTransactionsListComponent implements OnInit {
  private readonly deposits = inject(DEPOSIT_ACCOUNT_API);
  private readonly route = inject(ActivatedRoute);

  readonly columns: ColumnDef[] = [
    { key: 'date', label: 'ON_HOLD_TRANSACTIONS.DATE', sortable: true },
    { key: 'amount', label: 'ON_HOLD_TRANSACTIONS.AMOUNT', sortable: true },
    { key: 'typeLabel', label: 'ON_HOLD_TRANSACTIONS.TYPE', sortable: false },
    { key: 'loanId', label: 'ON_HOLD_TRANSACTIONS.LOAN', sortable: false },
  ];

  savingsId!: number;
  readonly transactions = signal<SavingsOnHoldTransaction[]>([]);

  ngOnInit(): void {
    this.savingsId = Number(this.route.snapshot.paramMap.get('savingsId'));
    this.load();
  }

  load(): void {
    this.deposits.onHoldTransactions(this.savingsId).subscribe({
      next: (transactions) => this.transactions.set(transactions),
      error: () => this.transactions.set([]),
    });
  }
}
