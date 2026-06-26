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
import { ColumnDef, CellTemplateDirective } from '../../../shared';
import { DataTableComponent } from '../../../shared/components/data-table/data-table.component';
import { FundsService, FundData } from '../../../api';

/**
 * Lists organization funds. Funds are a small master-data resource (name + external id),
 * so the component uses the DataTable's local pagination/search.
 */
@Component({
  selector: 'app-funds-list',
  standalone: true,
  imports: [
    TranslateModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    DataTableComponent,
    CellTemplateDirective,
  ],
  template: `
    <app-data-table
      title="nav.funds"
      helpTextKey="HELP.FUNDS_DESC"
      createButtonLabel="FUNDS.CREATE_FUND"
      [columns]="columns"
      [data]="funds"
      [totalRecords]="funds.length"
      [localLogic]="true"
      (create)="onCreate()"
    >
      <ng-template appCellTemplate="actions" let-fund>
        <button
          mat-icon-button
          color="primary"
          [attr.aria-label]="'COMMON.EDIT' | translate"
          [matTooltip]="'COMMON.EDIT' | translate"
          (click)="onEdit(fund)"
        >
          <mat-icon>edit</mat-icon>
        </button>
      </ng-template>
    </app-data-table>
  `,
})
export class FundsListComponent implements OnInit {
  private readonly fundsService = inject(FundsService);
  private readonly router = inject(Router);

  readonly columns: ColumnDef[] = [
    { key: 'name', label: 'FUNDS.NAME', sortable: true },
    { key: 'externalId', label: 'FUNDS.EXTERNAL_ID', sortable: true },
    { key: 'actions', label: 'COMMON.ACTIONS', sortable: false },
  ];

  funds: FundData[] = [];

  ngOnInit(): void {
    this.fundsService.getFunds().subscribe({
      next: (data: FundData[]) => {
        this.funds = data || [];
      },
      error: (err: unknown) => {
        console.error('Failed to load funds', err);
      },
    });
  }

  onCreate(): void {
    this.router.navigate(['/organization/funds/create']);
  }

  onEdit(fund: FundData): void {
    this.router.navigate(['/organization/funds/edit', fund.id]);
  }
}
