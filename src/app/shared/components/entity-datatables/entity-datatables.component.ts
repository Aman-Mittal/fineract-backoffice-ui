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

import { computed, inject, input, signal, Component, OnInit } from '@angular/core';
import { I18N, TranslatePipe } from '../../../core/adapters';
import { TabsComponent, UiTab } from '../../../ui/tabs/tabs.component';
import { ButtonComponent } from '../../../ui/button/button.component';
import { SpinnerComponent } from '../../../ui/spinner/spinner.component';
import { DataTablesService, GetDataTablesResponse } from '../../../api';
import { DialogService } from '../../../core/services/dialog.service';
import { AuthService } from '../../../core/services/auth.service';
import { DataTableComponent, ColumnDef } from '../data-table/data-table.component';
import { CellTemplateDirective } from '../data-table/cell-template.directive';
import { RequiresPermissionDirective } from '../../directives/requires-permission.directive';
import { DatatableEntryDialogComponent } from '../datatable-entry-dialog/datatable-entry-dialog.component';

const AUDIT_COLUMN_NAMES = new Set(['id', 'created_at', 'updated_at']);

/** The column a multi-row datatable keys its rows by, and a single-row one does not have. */
const ROW_ID_COLUMN = 'id';

/** The actions column, present only where the user can write to the table. */
const ACTIONS_COLUMN = '__actions';

@Component({
  selector: 'app-entity-datatables',
  standalone: true,
  imports: [
    TranslatePipe,
    TabsComponent,
    ButtonComponent,
    SpinnerComponent,
    DataTableComponent,
    CellTemplateDirective,
    RequiresPermissionDirective,
  ],
  template: `
    <div class="entity-datatables-container">
      @if (isLoading()) {
        <div class="loading-overlay">
          <app-spinner [label]="'COMMON.LOADING' | appTranslate" />
        </div>
      }

      @if (tableTabs().length > 0) {
        <app-tabs
          #tabs
          data-testid="entity-datatables-tabs"
          [tabs]="tableTabs()"
          [label]="'SYSTEM.DATA_TABLES' | appTranslate"
          [idPrefix]="'entity-datatables-' + apptableName() + '-' + entityId()"
          [value]="activeTable()?.registeredTableName"
          (valueChange)="onTabChange($event)"
        />

        @if (activeTable(); as dt) {
          <div
            class="tab-content"
            role="tabpanel"
            tabindex="0"
            [id]="tabs.panelId()"
            [attr.aria-labelledby]="tabs.tabId(dt.registeredTableName!)"
          >
            <app-data-table
              [columns]="getColumnDefs(dt)"
              [data]="tableData()"
              [isLoading]="isTableLoading()"
              [localLogic]="true"
            >
              <app-button
                headerActions
                data-testid="entity-datatables-add"
                type="button"
                icon="add-outline"
                [disabled]="!canWrite(dt, 'CREATE')"
                [appRequiresPermission]="permissionCode(dt, 'CREATE')"
                (click)="onAddEntry(dt)"
              >
                {{ 'SYSTEM.ADD_ENTRY' | appTranslate }}
              </app-button>

              <!--
                Edit and delete are offered per row, and each carries its own generated code:
                registering a datatable creates READ_, CREATE_, UPDATE_ and DELETE_ for it, and
                Fineract checks the exact one: ALL_FUNCTIONS_READ passes the read and no write.
              -->
              <ng-template [appCellTemplate]="ACTIONS_COLUMN" let-row>
                <div class="row-actions">
                  <app-button
                    type="button"
                    emphasis="quiet"
                    icon="create-outline"
                    data-testid="entity-datatables-edit"
                    [disabled]="!canWrite(dt, 'UPDATE')"
                    [appRequiresPermission]="permissionCode(dt, 'UPDATE')"
                    [label]="'COMMON.EDIT' | appTranslate"
                    (click)="onEditEntry(dt, row)"
                  />
                  <app-button
                    type="button"
                    emphasis="quiet"
                    intent="danger"
                    icon="trash-outline"
                    data-testid="entity-datatables-delete"
                    [disabled]="!canWrite(dt, 'DELETE')"
                    [appRequiresPermission]="permissionCode(dt, 'DELETE')"
                    [label]="'COMMON.DELETE' | appTranslate"
                    (click)="onDeleteEntry(dt, row)"
                  />
                </div>
              </ng-template>
            </app-data-table>
          </div>
        }
      } @else if (!isLoading()) {
        <p class="no-data">{{ 'SYSTEM.NO_DATA_TABLES_REGISTERED' | appTranslate }}</p>
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
      .row-actions {
        display: flex;
        gap: 4px;
      }
    `,
  ],
})
export class EntityDatatablesComponent implements OnInit {
  readonly apptableName = input.required<string>();
  readonly entityId = input.required<number>();

  private readonly datatablesService = inject(DataTablesService);
  private readonly dialogService = inject(DialogService);
  private readonly authService = inject(AuthService);
  private readonly i18n = inject(I18N);

  /** Exposed so the actions template can name the column it fills. */
  protected readonly ACTIONS_COLUMN = ACTIONS_COLUMN;

  readonly datatables = signal<GetDataTablesResponse[]>([]);

  /**
   * The tables this user may read.
   *
   * Removed rather than disabled, which is the one place in this component where that is right:
   * a table the user cannot read has no rows to show, so a tab for it would be an empty panel
   * with nothing to explain. The write actions inside a readable table are disabled instead, and
   * say which code is missing.
   */
  readonly readableTables = computed(() =>
    this.datatables().filter((table) => !!table.registeredTableName && this.canRead(table)),
  );

  readonly tableTabs = computed<UiTab[]>(() =>
    this.readableTables().map((table) => ({
      value: table.registeredTableName!,
      label: table.registeredTableName!,
    })),
  );
  readonly isLoading = signal<boolean>(false);

  readonly tableData = signal<Record<string, unknown>[]>([]);
  readonly isTableLoading = signal<boolean>(false);
  readonly activeTable = signal<GetDataTablesResponse | undefined>(undefined);

  ngOnInit(): void {
    this.loadDatatables();
  }

  loadDatatables(): void {
    this.isLoading.set(true);
    this.datatablesService.getDatatables(this.apptableName()).subscribe({
      next: (data) => {
        this.datatables.set(data);
        this.isLoading.set(false);
        // Only named tables the user can read get a tab, so select the first of those. Fetching
        // rows for a table they cannot read would answer 403 and log a failure for a tab that
        // is not on screen.
        const first = this.readableTables()[0];
        if (first) {
          this.activeTable.set(first);
          this.loadTableData(first.registeredTableName!);
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
    // The columns come from `activeTable()` and switch synchronously, while the rows arrive
    // later. Holding the previous table's rows would render them under the new table's headers
    // until the response lands, so drop them as the request goes out.
    this.tableData.set([]);
    this.datatablesService.getDatatablesDatatableApptableId(tableName, this.entityId()).subscribe({
      next: (data: unknown) => {
        // Nothing cancels the previous request, so switching A -> B -> A leaves two in flight
        // and the slower one can land last. Without this guard its rows would be shown under
        // whichever tab is selected by then, and stay there.
        if (this.isStale(tableName)) return;
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
        if (this.isStale(tableName)) return;
        this.isTableLoading.set(false);
      },
    });
  }

  /** True once a later tab change has made this response's table no longer the selected one. */
  private isStale(tableName: string): boolean {
    return this.activeTable()?.registeredTableName !== tableName;
  }

  /**
   * The code generated for one action on one table.
   *
   * Registering a datatable creates `READ_`, `CREATE_`, `UPDATE_` and `DELETE_` prefixed with
   * the registered table name **verbatim** — `READ_wc_kyc`, not an upper-cased form — which is
   * what `AppUser.hasNotPermissionForDatatable` checks. Confirmed against a live platform after
   * registering one.
   */
  permissionCode(
    dt: GetDataTablesResponse,
    action: 'READ' | 'CREATE' | 'UPDATE' | 'DELETE',
  ): string {
    return `${action}_${dt.registeredTableName}`;
  }

  /**
   * Whether the user may read this table.
   *
   * `hasPermission` already implements both of the platform's shortcuts: `ALL_FUNCTIONS` passes
   * everything, and `ALL_FUNCTIONS_READ` passes a request made only of `READ_*` codes. A
   * read-only auditor therefore sees every tab and no enabled write control, with no special
   * case here.
   */
  canRead(dt: GetDataTablesResponse): boolean {
    return this.authService.hasPermission(this.permissionCode(dt, 'READ'));
  }

  canWrite(dt: GetDataTablesResponse, action: 'CREATE' | 'UPDATE' | 'DELETE'): boolean {
    return this.authService.hasPermission(this.permissionCode(dt, action));
  }

  /**
   * True for a table that holds many rows per entity.
   *
   * The listing carries no `multiRow` flag, so the shape is the discriminator: a multi-row
   * table's primary key is its own `id` and the entity key rides alongside as an ordinary
   * column, while a single-row table's primary key *is* the entity key (`wc_loan_id`). Measured
   * by registering one of each.
   *
   * It decides the URL: a row of a multi-row table is updated and deleted at
   * `…/{datatable}/{entityId}/{rowId}`, and a single-row table's one row at
   * `…/{datatable}/{entityId}`.
   */
  isMultiRow(dt: GetDataTablesResponse): boolean {
    return (dt.columnHeaderData ?? []).some(
      (col) => col.isColumnPrimaryKey && col.columnName === ROW_ID_COLUMN,
    );
  }

  private rowId(dt: GetDataTablesResponse, row: Record<string, unknown>): number | undefined {
    if (!this.isMultiRow(dt)) return undefined;
    const id = row[ROW_ID_COLUMN];
    return typeof id === 'number' ? id : undefined;
  }

  getColumnDefs(dt: GetDataTablesResponse): ColumnDef[] {
    // The primary key column is the entity's own FK (e.g. "loan_id"), not
    // "<apptableName>_id" (apptableName is "m_loan", not "loan") — filtering
    // by isColumnPrimaryKey works regardless of the entity's naming.
    const columns: ColumnDef[] = (dt.columnHeaderData || [])
      .filter((col) => !col.isColumnPrimaryKey && !AUDIT_COLUMN_NAMES.has(col.columnName ?? ''))
      .map((col) => ({
        key: col.columnName!,
        label: col.columnName!, // Ideally we'd have a way to translate these
        sortable: true,
      }));

    // The actions column is offered to anyone who holds either write code. It is *rendered* for
    // a user who holds neither only in order to say so, which is not worth a column of its own,
    // so it is dropped instead.
    if (this.canWrite(dt, 'UPDATE') || this.canWrite(dt, 'DELETE')) {
      columns.push({ key: ACTIONS_COLUMN, label: '', width: '112px' });
    }
    return columns;
  }

  onTabChange(tableName: string): void {
    const table = this.datatables().find((dt) => dt.registeredTableName === tableName);
    if (!table || table === this.activeTable()) return;
    this.activeTable.set(table);
    this.loadTableData(tableName);
  }

  onAddEntry(dt: GetDataTablesResponse): Promise<void> {
    return this.openEntry(dt);
  }

  onEditEntry(dt: GetDataTablesResponse, row: Record<string, unknown>): Promise<void> {
    return this.openEntry(dt, row);
  }

  private openEntry(dt: GetDataTablesResponse, row?: Record<string, unknown>): Promise<void> {
    return this.dialogService
      .open<boolean>(DatatableEntryDialogComponent, {
        data: {
          datatableName: dt.registeredTableName!,
          apptableId: this.entityId(),
          columns: dt.columnHeaderData || [],
          row,
          rowId: row ? this.rowId(dt, row) : undefined,
        },
      })
      .then((saved) => {
        if (saved) {
          this.loadTableData(dt.registeredTableName!);
        }
      });
  }

  /**
   * Deletes one row, after a destructive confirmation.
   *
   * There is no undo: the platform drops the row outright, and a datatable is where an
   * institution keeps the fields this UI knows nothing about — a reference it cannot be asked to
   * re-derive.
   */
  async onDeleteEntry(dt: GetDataTablesResponse, row: Record<string, unknown>): Promise<void> {
    const confirmed = await this.dialogService.confirm({
      title: this.i18n.translate('COMMON.DELETE'),
      message: this.i18n.translate('SYSTEM.CONFIRM_DELETE_ENTRY'),
      destructive: true,
    });
    if (!confirmed) return;

    const table = dt.registeredTableName!;
    const rowId = this.rowId(dt, row);
    const request$ =
      rowId === undefined
        ? this.datatablesService.deleteDatatablesDatatableApptableId(table, this.entityId())
        : this.datatablesService.deleteDatatablesDatatableApptableIdDatatableId(
            table,
            this.entityId(),
            rowId,
          );

    request$.subscribe({
      next: () => this.loadTableData(table),
      error: (err) => console.error(`Failed to delete the row from ${table}`, err),
    });
  }
}
