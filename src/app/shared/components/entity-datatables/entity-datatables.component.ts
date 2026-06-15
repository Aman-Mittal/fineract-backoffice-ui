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

import { Component, Input, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DataTablesService, GetDataTablesResponse } from '../../../api';
import { DataTableComponent, ColumnDef } from '../data-table/data-table.component';

@Component({
  selector: 'app-entity-datatables',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    MatTabsModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    DataTableComponent,
  ],
  template: `
    <div class="entity-datatables-container">
      @if (isLoading()) {
        <div class="loading-overlay">
          <mat-spinner diameter="40"></mat-spinner>
        </div>
      }

      @if (datatables().length > 0) {
        <mat-tab-group (selectedTabChange)="onTabChange($event)">
          @for (dt of datatables(); track dt.registeredTableName) {
            <mat-tab [label]="dt.registeredTableName!">
              <div class="tab-content">
                <app-data-table
                  [columns]="getColumnDefs(dt)"
                  [data]="tableData()"
                  [isLoading]="isTableLoading()"
                  [localLogic]="true"
                >
                  <button headerActions mat-raised-button color="primary" (click)="onAddEntry(dt)">
                    <mat-icon>add</mat-icon>
                    {{ 'SYSTEM.ADD_ENTRY' | translate }}
                  </button>
                </app-data-table>
              </div>
            </mat-tab>
          }
        </mat-tab-group>
      } @else if (!isLoading()) {
        <p class="no-data">{{ 'SYSTEM.NO_DATA_TABLES_REGISTERED' | translate }}</p>
      }
    </div>
  `,
  styles: [
    `
      .entity-datatables-container {
        position: relative;
        min-height: 200px;
      }
      .loading-overlay {
        display: flex;
        justify-content: center;
        padding: 40px;
      }
      .tab-content {
        padding: 16px 0;
      }
      .no-data {
        padding: 24px;
        text-align: center;
        color: rgba(0, 0, 0, 0.6);
      }
    `,
  ],
})
export class EntityDatatablesComponent implements OnInit {
  @Input({ required: true }) apptableName!: string;
  @Input({ required: true }) entityId!: number;

  private readonly datatablesService = inject(DataTablesService);

  datatables = signal<GetDataTablesResponse[]>([]);
  isLoading = signal<boolean>(false);

  tableData = signal<Record<string, unknown>[]>([]);
  isTableLoading = signal<boolean>(false);
  activeTable?: GetDataTablesResponse;

  ngOnInit(): void {
    this.loadDatatables();
  }

  loadDatatables(): void {
    this.isLoading.set(true);
    this.datatablesService.getDatatables(this.apptableName).subscribe({
      next: (data) => {
        this.datatables.set(data);
        this.isLoading.set(false);
        if (data.length > 0) {
          this.activeTable = data[0];
          this.loadTableData(data[0].registeredTableName!);
        }
      },
      error: (err) => {
        console.error('Failed to load entity datatables', err);
        this.isLoading.set(false);
      },
    });
  }

  loadTableData(tableName: string): void {
    this.isTableLoading.set(true);
    this.datatablesService.getDatatablesDatatableApptableId(tableName, this.entityId).subscribe({
      next: (data: unknown) => {
        // Fineract returns a resultset: { columnHeaders: [], data: [[]] }
        const result = (typeof data === 'string' ? JSON.parse(data) : data) as Record<
          string,
          unknown
        >;
        const headers = (result['columnHeaders'] as Record<string, unknown>[]) || [];
        const rows = (result['data'] as unknown[][]) || [];

        const formattedData = rows.map((row: unknown[]) => {
          const entry: Record<string, unknown> = {};
          headers.forEach((header: Record<string, unknown>, index: number) => {
            const colName = header['columnName'] as string;
            entry[colName] = row[index];
          });
          return entry;
        });

        this.tableData.set(formattedData);
        this.isTableLoading.set(false);
      },
      error: (err) => {
        console.error(`Failed to load data for table ${tableName}`, err);
        this.isTableLoading.set(false);
      },
    });
  }

  getColumnDefs(dt: GetDataTablesResponse): ColumnDef[] {
    return (dt.columnHeaderData || [])
      .filter((col) => !['id', this.apptableName + '_id'].includes(col.columnName!))
      .map((col) => ({
        key: col.columnName!,
        label: col.columnName!, // Ideally we'd have a way to translate these
        sortable: true,
      }));
  }

  onTabChange(event: { tab: { textLabel: string } }): void {
    const tableName = event.tab.textLabel;
    this.activeTable = this.datatables().find((d) => d.registeredTableName === tableName);
    this.loadTableData(tableName);
  }

  onAddEntry(dt: GetDataTablesResponse): void {
    console.log('Add entry to', dt.registeredTableName);
  }
}
