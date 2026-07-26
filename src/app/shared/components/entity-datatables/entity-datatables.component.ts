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
import { TranslateModule } from '@ngx-translate/core';
import {
  IonButton,
  IonIcon,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonSpinner,
} from '@ionic/angular/standalone';
import { DataTablesService, GetDataTablesResponse } from '../../../api';
import { DialogService } from '../../../core/services/dialog.service';
import { DataTableComponent, ColumnDef } from '../data-table/data-table.component';
import { DatatableEntryDialogComponent } from '../datatable-entry-dialog/datatable-entry-dialog.component';

const AUDIT_COLUMN_NAMES = new Set(['id', 'created_at', 'updated_at']);

@Component({
  selector: 'app-entity-datatables',
  standalone: true,
  imports: [
    TranslateModule,
    IonSegment,
    IonSegmentButton,
    IonLabel,
    IonButton,
    IonIcon,
    IonSpinner,
    DataTableComponent,
  ],
  template: `
    <div class="entity-datatables-container">
      @if (isLoading()) {
        <div class="loading-overlay">
          <ion-spinner name="crescent"></ion-spinner>
        </div>
      }

      @if (datatables().length > 0) {
        <ion-segment
          scrollable
          data-testid="entity-datatables-tabs"
          [value]="activeTable?.registeredTableName"
          (ionChange)="onTabChange($event)"
        >
          @for (dt of datatables(); track dt.registeredTableName) {
            <ion-segment-button [value]="dt.registeredTableName!">
              <ion-label>{{ dt.registeredTableName }}</ion-label>
            </ion-segment-button>
          }
        </ion-segment>

        @if (activeTable; as dt) {
          <div class="tab-content">
            <app-data-table
              [columns]="getColumnDefs(dt)"
              [data]="tableData()"
              [isLoading]="isTableLoading()"
              [localLogic]="true"
            >
              <ion-button
                headerActions
                data-testid="entity-datatables-add"
                color="primary"
                (click)="onAddEntry(dt)"
              >
                <ion-icon name="add-outline" slot="start"></ion-icon>
                {{ 'SYSTEM.ADD_ENTRY' | translate }}
              </ion-button>
            </app-data-table>
          </div>
        }
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
        color: var(--text-muted, rgba(0, 0, 0, 0.6));
      }
    `,
  ],
})
export class EntityDatatablesComponent implements OnInit {
  @Input({ required: true }) apptableName!: string;
  @Input({ required: true }) entityId!: number;

  private readonly datatablesService = inject(DataTablesService);
  private readonly dialogService = inject(DialogService);

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
        const parsed = typeof data === 'string' ? JSON.parse(data) : data;

        // GET /datatables/{datatable}/{apptableId} returns entries as a plain
        // array of row objects (one object per row, columns as keys) — NOT
        // the legacy `{ columnHeaders, data }` resultset shape used by some
        // other Fineract report/query endpoints. Support both defensively.
        let formattedData: Record<string, unknown>[];
        if (Array.isArray(parsed)) {
          formattedData = parsed as Record<string, unknown>[];
        } else {
          const result = parsed as Record<string, unknown>;
          const headers = (result['columnHeaders'] as Record<string, unknown>[]) || [];
          const rows = (result['data'] as unknown[][]) || [];
          formattedData = rows.map((row: unknown[]) => {
            const entry: Record<string, unknown> = {};
            headers.forEach((header: Record<string, unknown>, index: number) => {
              const colName = header['columnName'] as string;
              entry[colName] = row[index];
            });
            return entry;
          });
        }

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
    // The primary key column is the entity's own FK (e.g. "loan_id"), not
    // "<apptableName>_id" (apptableName is "m_loan", not "loan") — filtering
    // by isColumnPrimaryKey works regardless of the entity's naming.
    return (dt.columnHeaderData || [])
      .filter((col) => !col.isColumnPrimaryKey && !AUDIT_COLUMN_NAMES.has(col.columnName ?? ''))
      .map((col) => ({
        key: col.columnName!,
        label: col.columnName!, // Ideally we'd have a way to translate these
        sortable: true,
      }));
  }

  onTabChange(event: Event): void {
    const detail = (event as CustomEvent<{ value?: string }>).detail;
    const tableName = detail?.value ?? (event.target as HTMLInputElement)?.value;
    if (!tableName) return;

    this.activeTable = this.datatables().find((d) => d.registeredTableName === tableName);
    this.loadTableData(tableName);
  }

  onAddEntry(dt: GetDataTablesResponse): Promise<void> {
    return this.dialogService
      .open<boolean>(DatatableEntryDialogComponent, {
        data: {
          datatableName: dt.registeredTableName!,
          apptableId: this.entityId,
          columns: dt.columnHeaderData || [],
        },
      })
      .then((saved) => {
        if (saved) {
          this.loadTableData(dt.registeredTableName!);
        }
      });
  }
}
