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
import { LoanOriginatorsService, GetLoanOriginatorsResponse } from '../../../api';

/**
 * Lists loan originator master-data records (name + external id + type/channel/status).
 * Originators are a small reference list, so the table uses local pagination.
 */
@Component({
  selector: 'app-loan-originators-list',
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
      title="nav.loanOriginators"
      helpTextKey="HELP.LOAN_ORIGINATORS_DESC"
      createButtonLabel="LOAN_ORIGINATORS.CREATE"
      [columns]="columns"
      [data]="originators"
      [totalRecords]="originators.length"
      [localLogic]="true"
      (create)="onCreate()"
    >
      <ng-template appCellTemplate="originatorType" let-row>
        {{ row.originatorType?.name }}
      </ng-template>
      <ng-template appCellTemplate="channelType" let-row>
        {{ row.channelType?.name }}
      </ng-template>
      <ng-template appCellTemplate="actions" let-row>
        <button
          mat-icon-button
          color="primary"
          [attr.aria-label]="'COMMON.EDIT' | translate"
          [matTooltip]="'COMMON.EDIT' | translate"
          (click)="onEdit(row)"
        >
          <mat-icon>edit</mat-icon>
        </button>
        <button
          mat-icon-button
          color="warn"
          [attr.aria-label]="'COMMON.DELETE' | translate"
          [matTooltip]="'COMMON.DELETE' | translate"
          (click)="onDelete(row)"
        >
          <mat-icon>delete</mat-icon>
        </button>
      </ng-template>
    </app-data-table>
  `,
})
export class LoanOriginatorsListComponent implements OnInit {
  private readonly originatorsService = inject(LoanOriginatorsService);
  private readonly router = inject(Router);

  readonly columns: ColumnDef[] = [
    { key: 'name', label: 'LOAN_ORIGINATORS.NAME', sortable: true },
    { key: 'externalId', label: 'LOAN_ORIGINATORS.EXTERNAL_ID', sortable: true },
    { key: 'originatorType', label: 'LOAN_ORIGINATORS.ORIGINATOR_TYPE', sortable: false },
    { key: 'channelType', label: 'LOAN_ORIGINATORS.CHANNEL_TYPE', sortable: false },
    { key: 'status', label: 'LOAN_ORIGINATORS.STATUS', sortable: true },
    { key: 'actions', label: 'COMMON.ACTIONS', sortable: false },
  ];

  originators: GetLoanOriginatorsResponse[] = [];

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.originatorsService.getLoanOriginators().subscribe({
      next: (data: GetLoanOriginatorsResponse[]) => {
        this.originators = data || [];
      },
      error: (err: unknown) => {
        console.error('Failed to load loan originators', err);
      },
    });
  }

  onCreate(): void {
    this.router.navigate(['/products/loan-originators/create']);
  }

  onEdit(row: GetLoanOriginatorsResponse): void {
    this.router.navigate(['/products/loan-originators/edit', row.id]);
  }

  onDelete(row: GetLoanOriginatorsResponse): void {
    if (!row.id || !window.confirm('Delete this loan originator?')) return;
    this.originatorsService.deleteLoanOriginatorsOriginatorId(row.id).subscribe({
      next: () => this.load(),
      error: (err: unknown) => console.error('Failed to delete loan originator', err),
    });
  }
}
