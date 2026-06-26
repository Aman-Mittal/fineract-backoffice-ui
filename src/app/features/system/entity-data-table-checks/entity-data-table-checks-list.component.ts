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
import { EntityDataTableService, GetEntityDatatableChecksResponse } from '../../../api';

/**
 * Lists entity data-table checks. These records have no update endpoint, so the table
 * supports create and delete only.
 */
@Component({
  selector: 'app-entity-data-table-checks-list',
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
      title="nav.entityDataTableChecks"
      helpTextKey="HELP.ENTITY_DATA_TABLE_CHECKS_DESC"
      createButtonLabel="ENTITY_DATA_TABLE_CHECKS.CREATE"
      [columns]="columns"
      [data]="checks"
      [totalRecords]="checks.length"
      [localLogic]="true"
      (create)="onCreate()"
    >
      <ng-template appCellTemplate="status" let-row>
        {{ row.status?.value }}
      </ng-template>
      <ng-template appCellTemplate="actions" let-row>
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
export class EntityDataTableChecksListComponent implements OnInit {
  private readonly checksService = inject(EntityDataTableService);
  private readonly router = inject(Router);

  readonly columns: ColumnDef[] = [
    { key: 'entity', label: 'ENTITY_DATA_TABLE_CHECKS.ENTITY', sortable: true },
    { key: 'datatableName', label: 'ENTITY_DATA_TABLE_CHECKS.DATATABLE_NAME', sortable: true },
    { key: 'status', label: 'ENTITY_DATA_TABLE_CHECKS.STATUS', sortable: false },
    { key: 'productName', label: 'ENTITY_DATA_TABLE_CHECKS.PRODUCT', sortable: false },
    { key: 'actions', label: 'COMMON.ACTIONS', sortable: false },
  ];

  checks: GetEntityDatatableChecksResponse[] = [];

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.checksService.getEntityDatatableChecks().subscribe({
      next: (data: GetEntityDatatableChecksResponse[]) => {
        this.checks = data || [];
      },
      error: (err: unknown) => {
        console.error('Failed to load entity data-table checks', err);
      },
    });
  }

  onCreate(): void {
    this.router.navigate(['/system/entity-data-table-checks/create']);
  }

  onDelete(row: GetEntityDatatableChecksResponse): void {
    if (!row.id || !window.confirm('Delete this data-table check?')) return;
    this.checksService.deleteEntityDatatableChecksEntityDatatableCheckId(row.id).subscribe({
      next: () => this.load(),
      error: (err: unknown) => console.error('Failed to delete data-table check', err),
    });
  }
}
