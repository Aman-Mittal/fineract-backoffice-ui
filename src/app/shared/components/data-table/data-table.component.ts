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

import {
  Component,
  Input,
  signal,
  Output,
  EventEmitter,
  ContentChildren,
  QueryList,
  AfterContentInit,
  TemplateRef,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { CdkTableModule } from '@angular/cdk/table';
import { NgTemplateOutlet } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonIcon,
  IonSpinner,
} from '@ionic/angular/standalone';
import { HelpIconComponent } from '../help-icon/help-icon.component';
import { SearchFilterComponent } from '../search-filter/search-filter.component';
import { PaginatorComponent } from '../paginator/paginator.component';
import { PageEvent, SortDirection, SortEvent } from '../../models/table.model';
import { CellTemplateDirective } from './cell-template.directive';
import { TooltipDirective } from '../../directives/tooltip.directive';

export interface ColumnDef {
  key: string;
  label: string;
  sortable?: boolean;
  tooltip?: string;
}

/** Tri-state cycle used by the sortable column headers, matching the previous mat-sort behaviour. */
const NEXT_DIRECTION: Record<SortDirection, SortDirection> = {
  '': 'asc',
  asc: 'desc',
  desc: '',
};

/**
 * A highly reusable, generic data table component.
 * Supports both server-side and local pagination/sorting/filtering.
 *
 * Built on `cdk-table` for row/column rendering with Ionic chrome. When `localLogic` is
 * false the component is purely presentational and the parent is responsible for
 * fetching the right page; when true it filters, sorts and paginates `data` itself.
 *
 * @template T - The type of data to be displayed in the table.
 */
@Component({
  selector: 'app-data-table',
  standalone: true,
  host: {
    '[attr.title]': 'null',
  },
  imports: [
    CdkTableModule,
    TranslateModule,
    NgTemplateOutlet,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonButton,
    IonIcon,
    IonSpinner,
    HelpIconComponent,
    SearchFilterComponent,
    PaginatorComponent,
    TooltipDirective,
  ],
  template: `
    <ion-card class="data-table-card">
      @if (isLoading) {
        <div class="loading-overlay">
          <ion-spinner name="crescent" data-testid="data-table-spinner"></ion-spinner>
        </div>
      }
      <ion-card-header>
        <ion-card-title>
          {{ title | translate }}
          @if (helpTextKey) {
            <app-help-icon [helpTextKey]="helpTextKey"></app-help-icon>
          }
        </ion-card-title>
        <div class="header-actions">
          @if (createButtonLabel) {
            <ion-button data-testid="data-table-create" color="primary" (click)="onCreate()">
              <ion-icon name="add-outline" slot="start"></ion-icon>
              {{ createButtonLabel | translate }}
            </ion-button>
          }
          <ng-content select="[headerActions]"></ng-content>
        </div>
      </ion-card-header>

      <ion-card-content>
        <div class="table-header">
          @if (showSearch) {
            <div class="search-container">
              <app-search-filter
                [label]="searchLabel | translate"
                [placeholder]="searchPlaceholder | translate"
                (searchChange)="onSearch($event)"
              >
              </app-search-filter>
              <app-help-icon helpTextKey="HELP.SEARCH_DESC"></app-help-icon>
            </div>
          }
          <ng-content select="[filters]"></ng-content>
        </div>

        <div class="table-container">
          <table cdk-table [dataSource]="rows()" class="data-table">
            @for (col of columns; track col.key) {
              <ng-container [cdkColumnDef]="col.key">
                <th
                  cdk-header-cell
                  *cdkHeaderCellDef
                  [appTooltip]="col.tooltip || ''"
                  [attr.aria-sort]="ariaSortFor(col)"
                  [class.sortable]="col.sortable"
                  (click)="onSortHeaderClick(col)"
                >
                  {{ col.label | translate }}
                  @if (col.sortable && sort().active === col.key && sort().direction) {
                    <ion-icon
                      class="sort-indicator"
                      [name]="
                        sort().direction === 'asc' ? 'arrow-up-outline' : 'arrow-down-outline'
                      "
                    ></ion-icon>
                  }
                </th>
                <td cdk-cell *cdkCellDef="let row">
                  @if (columnTemplates[col.key]) {
                    <ng-container
                      *ngTemplateOutlet="columnTemplates[col.key]; context: { $implicit: row }"
                    ></ng-container>
                  } @else {
                    <span class="truncate-text" [appTooltip]="getTooltipText(row, col.key)">
                      {{ getCellValue(row, col.key) }}
                    </span>
                  }
                </td>
              </ng-container>
            }

            <tr cdk-header-row *cdkHeaderRowDef="displayedColumns"></tr>
            <tr cdk-row *cdkRowDef="let row; columns: displayedColumns"></tr>

            <tr class="no-data-row" *cdkNoDataRow>
              <td [attr.colspan]="displayedColumns.length">
                {{ 'COMMON.NO_DATA' | translate }}
              </td>
            </tr>
          </table>

          <app-paginator
            [length]="displayedTotal()"
            [pageSize]="effectivePageSize"
            [pageIndex]="effectivePageIndex"
            [pageSizeOptions]="pageSizeOptions"
            (page)="onPage($event)"
          ></app-paginator>
        </div>
      </ion-card-content>
    </ion-card>
  `,
  styles: [
    `
      .data-table-card {
        margin: 24px;
        position: relative;
      }
      /* ion-card-header stacks its children in a column by default. The title and its
         actions belong on one line — the action is a response to the title, not a
         separate thought. */
      ion-card-header {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        gap: var(--space-4);
        padding-bottom: var(--space-3);
        border-bottom: 1px solid var(--border-color);
      }
      ion-card-title {
        display: flex;
        align-items: center;
        margin: 0;
        font-size: 1.125rem;
        font-weight: 600;
        color: var(--secondary-color);
      }
      .header-actions {
        display: flex;
        align-items: center;
        gap: var(--space-2);
        flex-shrink: 0;
      }
      .table-header {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        gap: var(--space-4);
        margin: var(--space-4) 0 var(--space-2);
      }
      .search-container {
        display: flex;
        align-items: center;
      }
      .table-container {
        overflow: auto;
      }
      .data-table {
        width: 100%;
        border-collapse: collapse;
      }
      .data-table th,
      .data-table td {
        padding: var(--space-3) var(--space-4);
        text-align: left;
        border-bottom: 1px solid var(--border-color, #e0e0e0);
      }
      .data-table th {
        font-weight: 600;
        color: var(--secondary-color);
        white-space: nowrap;
      }
      .data-table th.sortable {
        cursor: pointer;
        user-select: none;
      }
      .data-table th.sortable:hover {
        color: var(--primary-color);
      }
      .data-table th[aria-sort] {
        color: var(--primary-color);
      }
      .data-table tr:hover td {
        background-color: var(--hover-bg);
      }
      .sort-indicator {
        font-size: 14px;
        vertical-align: middle;
        margin-left: 4px;
      }
      .no-data-row td {
        text-align: center;
        color: var(--text-muted, #7f8c8d);
      }
      .loading-overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: var(--overlay-bg);
        z-index: 10;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 12px;
      }
      .truncate-text {
        display: inline-block;
        max-width: 200px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        vertical-align: middle;
      }
    `,
  ],
})
export class DataTableComponent<T> implements AfterContentInit, OnChanges {
  @Input() title = '';
  @Input() helpTextKey = '';
  @Input() createButtonLabel = '';
  @Input() columns: ColumnDef[] = [];
  @Input() data: T[] = [];
  /** Total number of records. If server-side, this comes from API response. */
  @Input() totalRecords = 0;
  @Input() pageSize = 10;
  @Input() pageIndex = 0;
  @Input() pageSizeOptions = [5, 10, 25, 100];
  @Input() showSearch = true;
  @Input() searchLabel = 'COMMON.SEARCH';
  @Input() searchPlaceholder = 'COMMON.SEARCH_PLACEHOLDER';
  /** If true, the component will handle pagination/sorting locally. */
  @Input() localLogic = false;
  @Input() isLoading = false;

  @Output() create = new EventEmitter<void>();
  @Output() searchChange = new EventEmitter<string>();
  @Output() sortChange = new EventEmitter<SortEvent>();
  @Output() pageChange = new EventEmitter<PageEvent>();

  @ContentChildren(CellTemplateDirective) cellTemplates!: QueryList<CellTemplateDirective>;

  /**
   * Rows currently rendered — the visible page when `localLogic`, otherwise `data` verbatim.
   *
   * Signals rather than plain fields so the view refreshes whenever the derived state changes,
   * independently of how change detection was triggered.
   */
  readonly rows = signal<T[]>([]);
  /** Record count reported to the paginator; local filtering shrinks it. */
  readonly displayedTotal = signal(0);
  readonly sort = signal<SortEvent>({ active: '', direction: '' });

  columnTemplates: Record<string, TemplateRef<unknown>> = {};

  private filterText = '';
  private readonly localPageIndex = signal(0);
  private readonly localPageSize = signal(10);

  get displayedColumns(): string[] {
    return this.columns.map((c) => c.key);
  }

  /*
   * Page state is tracked here in both modes.
   *
   * These used to read the raw @Input in server-side mode, which left the
   * paginator pinned to whatever the parent last bound. Since most parents fetch
   * by offset and never bind `pageIndex` back, it stayed 0 forever: the range
   * label was always "1 - 10", "previous" was always disabled, and because
   * `goTo()` computes from `pageIndex()`, "next" resolved to page 1 every time —
   * so page 2 was reachable and nothing beyond it.
   *
   * ngOnChanges still syncs from the @Input, so a parent that does drive
   * `pageIndex` (to reset to the first page when a filter changes) keeps control.
   */
  get effectivePageIndex(): number {
    return this.localPageIndex();
  }

  get effectivePageSize(): number {
    return this.localPageSize();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['pageSize']) {
      this.localPageSize.set(this.pageSize);
    }
    if (changes['pageIndex']) {
      this.localPageIndex.set(this.pageIndex);
    }
    this.recompute();
  }

  ngAfterContentInit(): void {
    this.cellTemplates.forEach((directive) => {
      this.columnTemplates[directive.columnName] = directive.template;
    });
  }

  onCreate(): void {
    this.create.emit();
  }

  onSearch(value: string): void {
    // A narrower result set can leave the current page out of range. Server-side
    // parents also refetch from offset 0 on a new search, so the paginator has to
    // agree in both modes or the label drifts from the rows on screen.
    this.localPageIndex.set(0);
    if (this.localLogic) {
      this.filterText = value.trim().toLowerCase();
      this.recompute();
    }
    this.searchChange.emit(value);
  }

  onSortHeaderClick(col: ColumnDef): void {
    if (!col.sortable) return;

    const current = this.sort();
    const direction =
      current.active === col.key ? NEXT_DIRECTION[current.direction] : ('asc' as SortDirection);
    this.sort.set({ active: direction ? col.key : '', direction });

    // Re-sorting reorders the whole set, so the current page no longer means
    // anything; server-side parents reset to offset 0 for the same reason.
    this.localPageIndex.set(0);
    if (this.localLogic) {
      this.recompute();
    }
    this.sortChange.emit(this.sort());
  }

  onPage(event: PageEvent): void {
    this.localPageIndex.set(event.pageIndex);
    this.localPageSize.set(event.pageSize);
    if (this.localLogic) {
      this.recompute();
    }
    this.pageChange.emit(event);
  }

  ariaSortFor(col: ColumnDef): string | null {
    const { active, direction } = this.sort();
    if (!col.sortable || active !== col.key || !direction) return null;
    return direction === 'asc' ? 'ascending' : 'descending';
  }

  getCellValue(row: T, key: string): unknown {
    const keys = key.split('.');
    let value: unknown = row;
    for (const k of keys) {
      if (value === null || value === undefined) return undefined;
      value = (value as Record<string, unknown>)[k];
    }
    if (value && typeof value === 'object' && 'value' in value) {
      return (value as Record<string, unknown>)['value'];
    }
    return value;
  }

  getTooltipText(row: T, key: string): string {
    const val = this.getCellValue(row, key);
    if (val === null || val === undefined) return '';
    return String(val);
  }

  /** Recomputes the rendered rows. Server-side mode passes `data` straight through. */
  private recompute(): void {
    if (!this.localLogic) {
      this.rows.set(this.data ?? []);
      this.displayedTotal.set(this.totalRecords);
      return;
    }

    let result = [...(this.data ?? [])];

    if (this.filterText) {
      result = result.filter((row) => this.matchesFilter(row));
    }
    const { active, direction } = this.sort();
    if (active && direction) {
      result = this.sortRows(result, active, direction);
    }

    this.displayedTotal.set(result.length);

    const pageSize = this.localPageSize();
    const start = this.localPageIndex() * pageSize;
    this.rows.set(result.slice(start, start + pageSize));
  }

  /** Matches the row against the search text across every displayed column. */
  private matchesFilter(row: T): boolean {
    return this.columns.some((col) => {
      const value = this.getCellValue(row, col.key);
      return value !== null && value !== undefined
        ? String(value).toLowerCase().includes(this.filterText)
        : false;
    });
  }

  private sortRows(rows: T[], active: string, direction: SortDirection): T[] {
    const factor = direction === 'asc' ? 1 : -1;

    return rows.sort((a, b) => {
      const left = this.getCellValue(a, active);
      const right = this.getCellValue(b, active);

      // Nulls sort last regardless of direction, so empty cells never lead the table.
      if (left === null || left === undefined) return right === null || right === undefined ? 0 : 1;
      if (right === null || right === undefined) return -1;

      if (typeof left === 'number' && typeof right === 'number') {
        return (left - right) * factor;
      }
      return String(left).localeCompare(String(right), undefined, { numeric: true }) * factor;
    });
  }
}
