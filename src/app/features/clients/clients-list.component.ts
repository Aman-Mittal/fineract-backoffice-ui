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

import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { Router } from '@angular/router';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { Subject, merge, of } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import {
  StatusBadgeComponent,
  DataTableComponent,
  CellTemplateDirective,
  ColumnDef,
} from '../../shared';
import { ClientService, GetClientsPageItemsResponse } from '../../api';

@Component({
  selector: 'app-clients-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatSelectModule,
    StatusBadgeComponent,
    DataTableComponent,
    CellTemplateDirective,
  ],
  template: `
    <app-data-table
      title="MODULES.CLIENTS_CONTRACTS"
      helpTextKey="HELP.CLIENTS_CONTRACTS_DESC"
      createButtonLabel="Create Client"
      [columns]="columns"
      [data]="clients"
      [totalRecords]="totalRecords"
      (create)="onCreateClient()"
      (searchChange)="onSearch($event)"
      (sortChange)="onSort($event)"
      (pageChange)="onPage($event)"
    >
      <div filters class="filter-row">
        <mat-form-field appearance="outline" class="filter-field">
          <mat-label>{{ 'COMMON.STATUS' | translate }}</mat-label>
          <mat-select [(ngModel)]="activeFilters.status" (selectionChange)="onFilterChange()">
            <mat-option [value]="undefined">{{ 'COMMON.ALL' | translate }}</mat-option>
            <mat-option value="active">{{ 'COMMON.ACTIVE' | translate }}</mat-option>
            <mat-option value="pending">{{ 'COMMON.PENDING' | translate }}</mat-option>
            <mat-option value="closed">{{ 'COMMON.CLOSED' | translate }}</mat-option>
          </mat-select>
        </mat-form-field>
      </div>

      <ng-template appCellTemplate="status" let-client>
        <app-status-badge [status]="client.status?.value"></app-status-badge>
      </ng-template>

      <ng-template appCellTemplate="fullname" let-client>
        {{ client.fullname || client.displayName }}
      </ng-template>

      <ng-template appCellTemplate="actions" let-client>
        <button
          mat-icon-button
          color="primary"
          [attr.aria-label]="'COMMON.EDIT' | translate"
          matTooltip="Edit Client Details"
          (click)="onEditClient(client)"
        >
          <mat-icon>edit</mat-icon>
        </button>
      </ng-template>
    </app-data-table>
  `,
  styles: [
    `
      .filter-row {
        display: flex;
        gap: 12px;
        margin-left: 16px;
      }
      .filter-field {
        width: 150px;
      }
    `,
  ],
})
export class ClientsListComponent {
  private readonly clientService = inject(ClientService);
  private readonly router = inject(Router);

  columns: ColumnDef[] = [
    { key: 'accountNo', label: 'CLIENTS.ACCOUNT_NO', sortable: true },
    { key: 'fullname', label: 'COMMON.NAME', sortable: true },
    { key: 'status', label: 'COMMON.STATUS', sortable: true },
    { key: 'officeName', label: 'COMMON.OFFICE', sortable: true },
    { key: 'actions', label: 'COMMON.ACTIONS', sortable: false },
  ];

  clients: GetClientsPageItemsResponse[] = [];
  totalRecords = 0;

  activeFilters: { status?: string } = {};

  private searchSubject = new Subject<string>();
  private sortSubject = new Subject<Sort>();
  private pageSubject = new Subject<PageEvent>();
  private filterSubject = new Subject<void>();

  private currentFilter = '';
  private currentSort: Sort = { active: '', direction: '' };
  private currentPage: PageEvent = { pageIndex: 0, pageSize: 10, length: 0 };

  constructor() {
    merge(this.searchSubject, this.sortSubject, this.pageSubject, this.filterSubject)
      .pipe(
        startWith({}),
        switchMap(() => {
          const offset = this.currentPage.pageIndex * this.currentPage.pageSize;
          const limit = this.currentPage.pageSize;
          const orderBy = this.currentSort.active || undefined;
          const sortOrder = this.currentSort.direction
            ? this.currentSort.direction.toUpperCase()
            : undefined;

          const displayName = this.currentFilter ? `${this.currentFilter}%` : undefined;
          const status = this.activeFilters.status;

          return this.clientService
            .retrieveAll21(
              undefined,
              undefined,
              displayName,
              undefined,
              undefined,
              status,
              undefined,
              offset,
              limit,
              orderBy,
              sortOrder,
              false,
              1,
            )
            .pipe(catchError(() => of(null)));
        }),
        map((response) => {
          if (response === null) return [];
          this.totalRecords = response.totalFilteredRecords || 0;
          return response.pageItems || [];
        }),
      )
      .subscribe((data) => {
        this.clients = data;
      });
  }

  onSearch(filterValue: string) {
    this.currentFilter = filterValue;
    this.currentPage.pageIndex = 0;
    this.searchSubject.next(filterValue);
  }

  onSort(sort: Sort) {
    this.currentSort = sort;
    this.currentPage.pageIndex = 0;
    this.sortSubject.next(sort);
  }

  onPage(event: PageEvent) {
    this.currentPage = event;
    this.pageSubject.next(event);
  }

  onFilterChange() {
    this.currentPage.pageIndex = 0;
    this.filterSubject.next();
  }

  onCreateClient() {
    this.router.navigate(['/clients/create']);
  }

  onEditClient(client: GetClientsPageItemsResponse) {
    this.router.navigate(['/clients/edit', client.id]);
  }
}
