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
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import {
  DataTableComponent,
  ColumnDef,
  HasPermissionDirective,
  CellTemplateDirective,
} from '../../../shared';
import { DataTablesService, GetDataTablesResponse } from '../../../api';

@Component({
  selector: 'app-datatables-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TranslateModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    DataTableComponent,
    HasPermissionDirective,
    CellTemplateDirective,
  ],
  template: `
    <app-data-table
      title="SYSTEM.DATA_TABLES"
      [columns]="columns"
      [data]="datatables()"
      [isLoading]="isLoading()"
      [localLogic]="true"
    >
      <button
        headerActions
        mat-raised-button
        color="primary"
        [routerLink]="['create']"
        *appHasPermission="'CREATE_DATATABLE'"
      >
        <mat-icon>add</mat-icon>
        {{ 'SYSTEM.CREATE_DATA_TABLE' | translate }}
      </button>

      <ng-template appCellTemplate="actions" let-row>
        <div class="action-buttons">
          <button
            mat-icon-button
            color="primary"
            [routerLink]="['edit', row.registeredTableName]"
            *appHasPermission="'UPDATE_DATATABLE'"
            [matTooltip]="'COMMON.EDIT' | translate"
          >
            <mat-icon>edit</mat-icon>
          </button>
          <button
            mat-icon-button
            color="warn"
            (click)="onDelete(row.registeredTableName)"
            *appHasPermission="'DELETE_DATATABLE'"
            [matTooltip]="'COMMON.DELETE' | translate"
          >
            <mat-icon>delete</mat-icon>
          </button>
        </div>
      </ng-template>
    </app-data-table>
  `,
  styles: [
    `
      .action-buttons {
        display: flex;
        gap: 8px;
      }
    `,
  ],
})
export class DatatablesListComponent implements OnInit {
  private readonly datatablesService = inject(DataTablesService);

  datatables = signal<GetDataTablesResponse[]>([]);
  isLoading = signal<boolean>(false);

  columns: ColumnDef[] = [
    {
      key: 'registeredTableName',
      label: 'SYSTEM.TABLE_NAME',
      sortable: true,
    },
    {
      key: 'applicationTableName',
      label: 'SYSTEM.APP_TABLE',
      sortable: true,
    },
    {
      key: 'actions',
      label: 'COMMON.ACTIONS',
    },
  ];

  ngOnInit(): void {
    this.loadDatatables();
  }

  loadDatatables(): void {
    this.isLoading.set(true);
    this.datatablesService.getDatatables().subscribe({
      next: (data) => {
        this.datatables.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to load datatables', err);
        this.isLoading.set(false);
      },
    });
  }

  onDelete(name: string): void {
    if (confirm(`Are you sure you want to delete data table '${name}'?`)) {
      this.datatablesService.deleteDatatablesDatatableName(name).subscribe({
        next: () => this.loadDatatables(),
        error: (err) => console.error('Failed to delete datatable', err),
      });
    }
  }
}
