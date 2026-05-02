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

import { Component, Input, Output, EventEmitter, ContentChildren, QueryList, AfterContentInit, TemplateRef, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
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
    TranslateModule,
    HelpIconComponent,
    SearchFilterComponent
  ],
  template: `
    <mat-card class="data-table-card">
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
            <app-search-filter 
              [label]="searchLabel | translate" 
              [placeholder]="searchPlaceholder | translate" 
              (searchChange)="onSearch($event)">
            </app-search-filter>
          }
          <ng-content select="[filters]"></ng-content>
        </div>

        <div class="table-container">
          <table mat-table [dataSource]="dataSource" matSort (matSortChange)="onSort($event)" class="mat-elevation-z1">
            @for (col of columns; track col.key) {
              <ng-container [matColumnDef]="col.key">
                <th mat-header-cell *matHeaderCellDef [mat-sort-header]="col.key" [disabled]="!col.sortable">
                  {{ col.label | translate }}
                </th>
                <td mat-cell *matCellDef="let row">
                  @if (columnTemplates[col.key]) {
                    <ng-container *ngTemplateOutlet="columnTemplates[col.key]; context: { $implicit: row }"></ng-container>
                  } @else {
                    {{ getCellValue(row, col.key) }}
                  }
                </td>
              </ng-container>
            }

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
            
            <tr class="mat-row" *matNoDataRow>
              <td class="mat-cell" [attr.colspan]="displayedColumns.length">
                {{ 'COMMON.NO_DATA' | translate }}
              </td>
            </tr>
          </table>

          <mat-paginator 
            [length]="totalRecords" 
            [pageSize]="pageSize" 
            [pageSizeOptions]="pageSizeOptions" 
            (page)="onPage($event)"
            aria-label="Select page">
          </mat-paginator>
        </div>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    .data-table-card {
      margin: 24px;
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
    .table-container {
      overflow: auto;
    }
    table {
      width: 100%;
    }
  `]
})
export class DataTableComponent<T> implements AfterContentInit, OnChanges {
  @Input() title = '';
  @Input() helpTextKey = '';
  @Input() createButtonLabel = '';
  @Input() columns: ColumnDef[] = [];
  @Input() data: T[] = [];
  @Input() totalRecords = 0;
  @Input() pageSize = 10;
  @Input() pageSizeOptions = [5, 10, 25, 100];
  @Input() showSearch = true;
  @Input() searchLabel = 'COMMON.SEARCH';
  @Input() searchPlaceholder = 'COMMON.SEARCH_PLACEHOLDER';

  @Output() create = new EventEmitter<void>();
  @Output() searchChange = new EventEmitter<string>();
  @Output() sortChange = new EventEmitter<Sort>();
  @Output() pageChange = new EventEmitter<PageEvent>();

  @ContentChildren(CellTemplateDirective) cellTemplates!: QueryList<CellTemplateDirective>;

  dataSource = new MatTableDataSource<T>([]);
  columnTemplates: Record<string, TemplateRef<unknown>> = {};

  get displayedColumns(): string[] {
    return this.columns.map(c => c.key);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data']) {
      this.dataSource.data = this.data;
    }
  }

  ngAfterContentInit() {
    this.cellTemplates.forEach(directive => {
      this.columnTemplates[directive.columnName] = directive.template;
    });
  }

  onCreate() {
    this.create.emit();
  }

  onSearch(value: string) {
    this.searchChange.emit(value);
  }

  onSort(sort: Sort) {
    this.sortChange.emit(sort);
  }

  onPage(event: PageEvent) {
    this.pageChange.emit(event);
  }

  getCellValue(row: T, key: string): unknown {
    const value = (row as Record<string, unknown>)[key];
    if (value && typeof value === 'object' && 'value' in value) {
      return (value as Record<string, unknown>)['value'];
    }
    return value;
  }
}
