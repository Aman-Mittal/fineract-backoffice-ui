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
  Output,
  EventEmitter,
  ContentChildren,
  QueryList,
  AfterContentInit,
  TemplateRef,
  OnChanges,
  SimpleChanges,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TranslateModule } from '@ngx-translate/core';
import { HelpIconComponent } from '../help-icon/help-icon.component';
import { SearchFilterComponent } from '../search-filter/search-filter.component';
import { CellTemplateDirective } from './cell-template.directive';

export interface ColumnDef {
  key: string;
  label: string;
  sortable?: boolean;
  tooltip?: string;
}

/**
 * A highly reusable, generic data table component.
 * Supports both server-side and local pagination/sorting/filtering.
 *
 * @template T - The type of data to be displayed in the table.
 */
@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    TranslateModule,
    HelpIconComponent,
    SearchFilterComponent,
  ],
  template: `
    <mat-card class="data-table-card">
      @if (isLoading) {
        <div class="loading-overlay">
          <mat-spinner diameter="40"></mat-spinner>
        </div>
      }
      <mat-card-header>
        <mat-card-title>
          {{ title | translate }}
          @if (helpTextKey) {
            <app-help-icon [helpTextKey]="helpTextKey"></app-help-icon>
          }
        </mat-card-title>
        <div class="header-actions">
          @if (createButtonLabel) {
            <button mat-raised-button color="primary" (click)="onCreate()">
              <mat-icon>add</mat-icon>
              {{ createButtonLabel | translate }}
            </button>
          }
          <ng-content select="[headerActions]"></ng-content>
        </div>
      </mat-card-header>

      <mat-card-content>
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
          <table
            mat-table
            [dataSource]="dataSource"
            matSort
            (matSortChange)="onSort($event)"
            class="mat-elevation-z1"
          >
            @for (col of columns; track col.key) {
              <ng-container [matColumnDef]="col.key">
                <th
                  mat-header-cell
                  *matHeaderCellDef
                  [mat-sort-header]="col.key"
                  [disabled]="!col.sortable"
                >
                  {{ col.label | translate }}
                </th>
                <td mat-cell *matCellDef="let row">
                  @if (columnTemplates[col.key]) {
                    <ng-container
                      *ngTemplateOutlet="columnTemplates[col.key]; context: { $implicit: row }"
                    ></ng-container>
                  } @else {
                    <span class="truncate-text" [matTooltip]="getTooltipText(row, col.key)">
                      {{ getCellValue(row, col.key) }}
                    </span>
                  }
                </td>
              </ng-container>
            }

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>

            <tr class="mat-row" *matNoDataRow>
              <td class="mat-cell" [attr.colspan]="displayedColumns.length">
                {{ 'COMMON.NO_DATA' | translate }}
              </td>
            </tr>
          </table>

          <mat-paginator
            [length]="totalRecords"
            [pageSize]="pageSize"
            [pageIndex]="pageIndex"
            [pageSizeOptions]="pageSizeOptions"
            (page)="onPage($event)"
            aria-label="Select page"
          >
          </mat-paginator>
        </div>
      </mat-card-content>
    </mat-card>
  `,
  styles: [
    `
      .data-table-card {
        margin: 24px;
        position: relative;
      }
      mat-card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 16px;
      }
      mat-card-title {
        display: flex;
        align-items: center;
        margin: 0;
      }
      .header-actions {
        margin-left: auto;
        display: flex;
        gap: 8px;
      }
      .table-header {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        gap: 16px;
        margin-bottom: 8px;
      }
      .search-container {
        display: flex;
        align-items: center;
      }
      .table-container {
        overflow: auto;
      }
      table {
        width: 100%;
      }
      .loading-overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(255, 255, 255, 0.6);
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
export class DataTableComponent<T> implements AfterContentInit, AfterViewInit, OnChanges {
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
  @Output() sortChange = new EventEmitter<Sort>();
  @Output() pageChange = new EventEmitter<PageEvent>();

  @ContentChildren(CellTemplateDirective) cellTemplates!: QueryList<CellTemplateDirective>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  dataSource = new MatTableDataSource<T>([]);
  columnTemplates: Record<string, TemplateRef<unknown>> = {};

  get displayedColumns(): string[] {
    return this.columns.map((c) => c.key);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data']) {
      this.dataSource.data = this.data;
      if (this.localLogic && this.paginator) {
        this.dataSource.paginator = this.paginator;
      }
    }
  }

  ngAfterContentInit() {
    this.cellTemplates.forEach((directive) => {
      this.columnTemplates[directive.columnName] = directive.template;
    });
  }

  ngAfterViewInit() {
    if (this.localLogic) {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }

  onCreate() {
    this.create.emit();
  }

  onSearch(value: string) {
    if (this.localLogic) {
      this.dataSource.filter = value.trim().toLowerCase();
      if (this.dataSource.paginator) {
        this.dataSource.paginator.firstPage();
      }
    }
    this.searchChange.emit(value);
  }

  onSort(sort: Sort) {
    this.sortChange.emit(sort);
  }

  onPage(event: PageEvent) {
    this.pageChange.emit(event);
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
}
