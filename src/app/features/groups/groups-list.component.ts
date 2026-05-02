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
import { TranslateModule } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { Subject, merge, of } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { StatusBadgeComponent, DataTableComponent, CellTemplateDirective, ColumnDef } from '../../shared';
import { GroupsService, GetGroupsPageItems } from '../../api';

@Component({
  selector: 'app-groups-list',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    StatusBadgeComponent,
    DataTableComponent,
    CellTemplateDirective
  ],
  template: `
    <app-data-table
      title="nav.groups"
      helpTextKey="HELP.GROUPS_DESC"
      createButtonLabel="Create Group"
      [columns]="columns"
      [data]="groups"
      [totalRecords]="totalRecords"
      (create)="onCreateGroup()"
      (searchChange)="onSearch($event)"
      (sortChange)="onSort($event)"
      (pageChange)="onPage($event)">
      
      <ng-template appCellTemplate="status" let-group>
        <app-status-badge [status]="group.status?.value"></app-status-badge>
      </ng-template>

      <ng-template appCellTemplate="actions" let-group>
        <button mat-icon-button color="primary" [attr.aria-label]="'COMMON.EDIT' | translate" matTooltip="Edit Group" (click)="onEditGroup(group)">
          <mat-icon>edit</mat-icon>
        </button>
      </ng-template>
    </app-data-table>
  `
})
export class GroupsListComponent {
  private readonly groupsService = inject(GroupsService);
  private readonly router = inject(Router);

  columns: ColumnDef[] = [
    { key: 'accountNo', label: 'Account No', sortable: true },
    { key: 'name', label: 'Name', sortable: true },
    { key: 'status', label: 'Status', sortable: true },
    { key: 'officeName', label: 'Office', sortable: true },
    { key: 'actions', label: 'Actions', sortable: false }
  ];

  groups: GetGroupsPageItems[] = [];
  totalRecords = 0;
  
  private searchSubject = new Subject<string>();
  private sortSubject = new Subject<Sort>();
  private pageSubject = new Subject<PageEvent>();

  private currentFilter = '';
  private currentSort: Sort = { active: '', direction: '' };
  private currentPage: PageEvent = { pageIndex: 0, pageSize: 10, length: 0 };

  constructor() {
    merge(this.searchSubject, this.sortSubject, this.pageSubject)
      .pipe(
        startWith({}),
        switchMap(() => {
          const offset = this.currentPage.pageIndex * this.currentPage.pageSize;
          const limit = this.currentPage.pageSize;
          const orderBy = this.currentSort.active || undefined;
          const sortOrder = this.currentSort.direction ? this.currentSort.direction.toUpperCase() : undefined;
          
          const nameFilter = this.currentFilter || undefined;

          // Signature: officeId, staffId, externalId, name, underHierarchy, paged, offset, limit, orderBy, sortOrder, orphansOnly
          return this.groupsService.retrieveAll24(
            undefined, undefined, undefined, nameFilter, undefined, true,
            offset, limit, orderBy, sortOrder
          ).pipe(
            catchError(() => of(null))
          );
        }),
        map(response => {
          if (response === null) return [];
          this.totalRecords = response.totalFilteredRecords || 0;
          return response.pageItems ? Array.from(response.pageItems) : [];
        })
      )
      .subscribe(data => {
        this.groups = data;
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

  onCreateGroup() {
    this.router.navigate(['/groups/create']);
  }

  onEditGroup(group: GetGroupsPageItems) {
    this.router.navigate(['/groups/edit', group.id]);
  }
}
