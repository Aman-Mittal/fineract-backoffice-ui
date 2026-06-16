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
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ColumnDef } from '../../../shared';
import { DataTableComponent } from '../../../shared/components/data-table/data-table.component';
import { CashierJournalsService, TellerJournalData } from '../../../api';

/**
 * Read-only listing of cashier journal entries for a given teller and cashier.
 * tellerId / cashierId are seeded from query params when present, otherwise the
 * simple number inputs let the user pick them before loading.
 */
@Component({
  selector: 'app-cashier-journals-list',
  standalone: true,
  imports: [
    FormsModule,
    TranslateModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    DataTableComponent,
  ],
  template: `
    <div class="filter-bar">
      <mat-card>
        <mat-card-content class="filter-form">
          <mat-form-field appearance="outline">
            <mat-label>{{ 'CASHIER_JOURNALS.TELLER_ID' | translate }}</mat-label>
            <input matInput type="number" name="tellerId" [(ngModel)]="tellerId" />
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>{{ 'CASHIER_JOURNALS.CASHIER_ID' | translate }}</mat-label>
            <input matInput type="number" name="cashierId" [(ngModel)]="cashierId" />
          </mat-form-field>

          <button mat-raised-button color="primary" (click)="load()">
            {{ 'CASHIER_JOURNALS.LOAD' | translate }}
          </button>
        </mat-card-content>
      </mat-card>
    </div>

    <app-data-table
      title="nav.cashierJournals"
      helpTextKey="HELP.CASHIER_JOURNALS_DESC"
      [columns]="columns"
      [data]="journals"
      [totalRecords]="journals.length"
      [localLogic]="true"
      [isLoading]="isLoading"
    ></app-data-table>
  `,
  styles: [
    `
      .filter-bar {
        padding: 24px 24px 0;
      }
      .filter-form {
        display: flex;
        align-items: center;
        gap: 16px;
        flex-wrap: wrap;
      }
    `,
  ],
})
export class CashierJournalsListComponent implements OnInit {
  private readonly journalsService = inject(CashierJournalsService);
  private readonly route = inject(ActivatedRoute);

  readonly columns: ColumnDef[] = [
    { key: 'day', label: 'CASHIER_JOURNALS.DAY', sortable: true },
    { key: 'officeId', label: 'CASHIER_JOURNALS.OFFICE_ID', sortable: true },
    { key: 'tellerId', label: 'CASHIER_JOURNALS.TELLER_ID', sortable: true },
    { key: 'openingBalance', label: 'CASHIER_JOURNALS.OPENING_BALANCE', sortable: true },
    { key: 'sumReceipts', label: 'CASHIER_JOURNALS.SUM_RECEIPTS', sortable: true },
    { key: 'sumPayments', label: 'CASHIER_JOURNALS.SUM_PAYMENTS', sortable: true },
    { key: 'closingBalance', label: 'CASHIER_JOURNALS.CLOSING_BALANCE', sortable: true },
    { key: 'settledBalance', label: 'CASHIER_JOURNALS.SETTLED_BALANCE', sortable: true },
  ];

  tellerId: number | null = null;
  cashierId: number | null = null;
  journals: TellerJournalData[] = [];
  isLoading = false;

  ngOnInit(): void {
    const params = this.route.snapshot.queryParamMap;
    const tellerId = params.get('tellerId');
    const cashierId = params.get('cashierId');
    if (tellerId) this.tellerId = +tellerId;
    if (cashierId) this.cashierId = +cashierId;
    if (this.tellerId != null && this.cashierId != null) {
      this.load();
    }
  }

  load(): void {
    if (this.tellerId == null || this.cashierId == null) return;
    this.isLoading = true;
    this.journalsService.getCashiersjournal(undefined, this.tellerId, this.cashierId).subscribe({
      next: (data: TellerJournalData[]) => {
        this.journals = data || [];
        this.isLoading = false;
      },
      error: (err: unknown) => {
        console.error('Failed to load cashier journals', err);
        this.isLoading = false;
      },
    });
  }
}
