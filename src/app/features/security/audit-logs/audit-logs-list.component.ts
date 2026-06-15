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
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatExpansionModule } from '@angular/material/expansion';
import { FormsModule } from '@angular/forms';
import { Subject, merge, of } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { DataTableComponent, ColumnDef, CellTemplateDirective } from '../../../shared';
import { AuditsService } from '../../../api';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ViewPayloadDialogComponent } from '../../tasks/checker-inbox/view-payload-dialog.component';

export interface AuditFilters {
  actionName: string;
  entityName: string;
  resourceId?: number;
  makerId?: number;
  makerDateTimeFrom: Date | null;
  makerDateTimeTo: Date | null;
  processingResult: string;
}

@Component({
  selector: 'app-audit-logs-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TranslateModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
    MatExpansionModule,
    FormsModule,
    DataTableComponent,
    CellTemplateDirective,
    MatDialogModule,
  ],
  template: `
    <div class="audit-logs-container">
      <mat-expansion-panel class="filter-panel" [expanded]="false">
        <mat-expansion-panel-header>
          <mat-panel-title>
            <mat-icon>filter_list</mat-icon>
            {{ 'COMMON.FILTERS' | translate }}
          </mat-panel-title>
        </mat-expansion-panel-header>

        <div class="filter-grid">
          <mat-form-field appearance="outline">
            <mat-label>Action Name</mat-label>
            <input
              matInput
              [(ngModel)]="activeFilters.actionName"
              (keyup.enter)="onApplyFilters()"
            />
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Entity Name</mat-label>
            <input
              matInput
              [(ngModel)]="activeFilters.entityName"
              (keyup.enter)="onApplyFilters()"
            />
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Resource ID</mat-label>
            <input
              matInput
              type="number"
              [(ngModel)]="activeFilters.resourceId"
              (keyup.enter)="onApplyFilters()"
            />
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Maker ID</mat-label>
            <input
              matInput
              type="number"
              [(ngModel)]="activeFilters.makerId"
              (keyup.enter)="onApplyFilters()"
            />
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Maker Date From</mat-label>
            <input
              matInput
              [matDatepicker]="makerFrom"
              [(ngModel)]="activeFilters.makerDateTimeFrom"
            />
            <mat-datepicker-toggle matSuffix [for]="makerFrom"></mat-datepicker-toggle>
            <mat-datepicker #makerFrom></mat-datepicker>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Maker Date To</mat-label>
            <input matInput [matDatepicker]="makerTo" [(ngModel)]="activeFilters.makerDateTimeTo" />
            <mat-datepicker-toggle matSuffix [for]="makerTo"></mat-datepicker-toggle>
            <mat-datepicker #makerTo></mat-datepicker>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Processing Result</mat-label>
            <mat-select [(ngModel)]="activeFilters.processingResult">
              <mat-option value="">All</mat-option>
              <mat-option value="success">Success</mat-option>
              <mat-option value="failure">Failure</mat-option>
            </mat-select>
          </mat-form-field>
        </div>

        <mat-action-row>
          <button mat-button color="warn" (click)="onResetFilters()">
            {{ 'COMMON.RESET' | translate }}
          </button>
          <button mat-raised-button color="primary" (click)="onApplyFilters()">
            {{ 'COMMON.APPLY' | translate }}
          </button>
        </mat-action-row>
      </mat-expansion-panel>

      <app-data-table
        title="SECURITY.AUDIT_LOGS"
        [columns]="columns"
        [data]="auditLogs()"
        [totalRecords]="totalRecords()"
        [pageSize]="pageSize()"
        [pageIndex]="pageIndex()"
        [isLoading]="isLoading()"
        [showSearch]="false"
        (pageChange)="onPage($event)"
        (sortChange)="onSort($event)"
      >
        <ng-template appCellTemplate="madeOnDate" let-row>
          {{ row['madeOnDate'] | date: 'medium' }}
        </ng-template>

        <ng-template appCellTemplate="checkedOnDate" let-row>
          {{ row['checkedOnDate'] | date: 'medium' }}
        </ng-template>

        <ng-template appCellTemplate="actions" let-row>
          <button
            mat-icon-button
            color="primary"
            (click)="onViewDetails(row)"
            [matTooltip]="'COMMON.VIEW_DETAILS' | translate"
          >
            <mat-icon>visibility</mat-icon>
          </button>
        </ng-template>
      </app-data-table>
    </div>
  `,
  styles: [
    `
      .audit-logs-container {
        padding: 16px;
      }
      .filter-panel {
        margin: 24px;
        margin-bottom: 0;
      }
      .filter-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: 16px;
        padding-top: 16px;
      }
    `,
  ],
})
export class AuditLogsListComponent implements OnInit {
  private readonly auditsService = inject(AuditsService);
  private readonly dialog = inject(MatDialog);

  columns: ColumnDef[] = [
    { key: 'id', label: 'ID', sortable: true },
    { key: 'resourceId', label: 'Resource ID', sortable: true },
    { key: 'entityName', label: 'Entity', sortable: true },
    { key: 'actionName', label: 'Action', sortable: true },
    { key: 'maker', label: 'Maker', sortable: true },
    { key: 'madeOnDate', label: 'Date', sortable: true },
    { key: 'checker', label: 'Checker', sortable: true },
    { key: 'checkedOnDate', label: 'Checked Date', sortable: true },
    { key: 'processingResult', label: 'Result', sortable: true },
    { key: 'actions', label: 'COMMON.ACTIONS' },
  ];

  auditLogs = signal<Record<string, unknown>[]>([]);
  totalRecords = signal<number>(0);
  isLoading = signal<boolean>(false);
  pageSize = signal<number>(10);
  pageIndex = signal<number>(0);

  activeFilters: AuditFilters = {
    actionName: '',
    entityName: '',
    resourceId: undefined,
    makerId: undefined,
    makerDateTimeFrom: null,
    makerDateTimeTo: null,
    processingResult: '',
  };

  private sortSubject = new Subject<Sort>();
  private pageSubject = new Subject<PageEvent>();
  private filterSubject = new Subject<void>();

  private currentSort: Sort = { active: 'id', direction: 'desc' };

  ngOnInit(): void {
    merge(this.sortSubject, this.pageSubject, this.filterSubject)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoading.set(true);
          const limit = this.pageSize();
          const offset = this.pageIndex() * limit;
          const orderBy = this.currentSort.active;
          const sortOrder = this.currentSort.direction.toUpperCase() || 'DESC';

          const fromDate = this.activeFilters.makerDateTimeFrom
            ? this.activeFilters.makerDateTimeFrom.toISOString().split('T')[0]
            : undefined;
          const toDate = this.activeFilters.makerDateTimeTo
            ? this.activeFilters.makerDateTimeTo.toISOString().split('T')[0]
            : undefined;

          return this.auditsService
            .getAudits(
              this.activeFilters.actionName || undefined,
              this.activeFilters.entityName || undefined,
              this.activeFilters.resourceId,
              this.activeFilters.makerId,
              fromDate,
              toDate,
              undefined,
              undefined,
              undefined,
              undefined,
              undefined,
              undefined,
              undefined,
              undefined,
              undefined,
              this.activeFilters.processingResult || undefined,
              'yyyy-MM-dd',
              'en',
              offset,
              limit,
              orderBy,
              sortOrder,
              true,
            )
            .pipe(catchError(() => of(null)));
        }),
        map((data: unknown) => {
          this.isLoading.set(false);
          if (data === null) return [];

          const result = (typeof data === 'string' ? JSON.parse(data) : data) as Record<
            string,
            unknown
          >;
          const items = result['pageItems']
            ? (result['pageItems'] as unknown[])
            : (result as unknown);

          if (Array.isArray(items)) {
            const limit = this.pageSize();
            const offset = this.pageIndex() * limit;

            // If we received exactly 'limit' items, assume there might be more.
            // Some Fineract versions return totalFilteredRecords as the same as current page size.
            const total =
              items.length === limit
                ? offset + limit + 1
                : (result['totalFilteredRecords'] as number) ||
                  (result['totalRecords'] as number) ||
                  offset + items.length;

            this.totalRecords.set(total);
            return items as Record<string, unknown>[];
          }
          return [];
        }),
      )
      .subscribe((data) => {
        this.auditLogs.set(data);
      });
  }

  onApplyFilters(): void {
    this.pageIndex.set(0);
    this.filterSubject.next();
  }

  onResetFilters(): void {
    this.activeFilters = {
      actionName: '',
      entityName: '',
      resourceId: undefined,
      makerId: undefined,
      makerDateTimeFrom: null,
      makerDateTimeTo: null,
      processingResult: '',
    };
    this.onApplyFilters();
  }

  onPage(event: PageEvent): void {
    this.pageSize.set(event.pageSize);
    this.pageIndex.set(event.pageIndex);
    this.pageSubject.next(event);
  }

  onSort(sort: Sort): void {
    this.currentSort = sort;
    this.pageIndex.set(0);
    this.sortSubject.next(sort);
  }

  onViewDetails(row: Record<string, unknown>): void {
    const payload = (row['commandAsJson'] as string) || JSON.stringify(row, null, 2);
    this.dialog.open(ViewPayloadDialogComponent, {
      width: '600px',
      data: { payload },
    });
  }
}
