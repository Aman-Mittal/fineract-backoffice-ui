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

import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { Router, RouterModule } from '@angular/router';
import { Subject, merge, of } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import {
  StatusBadgeComponent,
  DataTableComponent,
  CellTemplateDirective,
  ColumnDef,
  HasPermissionDirective,
} from '../../shared';
import { LoansService, GetLoansLoanIdResponse } from '../../api';
import { PageEvent, SortEvent } from '../../shared/models/table.model';
import {
  IonButton,
  IonIcon,
  IonItem,
  IonLabel,
  IonSelect,
  IonSelectOption,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-loans-list',
  standalone: true,
  imports: [
    RouterModule,
    FormsModule,
    TranslateModule,
    StatusBadgeComponent,
    DataTableComponent,
    CellTemplateDirective,
    HasPermissionDirective,
    IonIcon,
    IonButton,
    IonItem,
    IonLabel,
    IonSelectOption,
    IonSelect,
  ],
  template: `
    <app-data-table
      title="MODULES.LOANS_PORTFOLIO"
      helpTextKey="HELP.LOANS_PORTFOLIO_DESC"
      [columns]="columns"
      [data]="loans"
      [totalRecords]="totalRecords"
      (searchChange)="onSearch($event)"
      (sortChange)="onSort($event)"
      (pageChange)="onPage($event)"
    >
      <ion-button
        headerActions
        color="primary"
        *appHasPermission="'CREATE_LOAN'"
        (click)="onCreateLoan()"
      >
        <ion-icon name="add-outline"></ion-icon>
        {{ 'LOANS.CREATE_LOAN_ACCOUNT' | translate }}
      </ion-button>

      <div filters class="filter-row">
        <ion-item fill="outline" class="filter-field">
          <ion-label position="stacked">{{ 'COMMON.STATUS' | translate }}</ion-label>
          <ion-select [(ngModel)]="activeFilters.status" (ionChange)="onFilterChange()">
            <ion-select-option [value]="undefined">{{
              'COMMON.ALL' | translate
            }}</ion-select-option>
            <ion-select-option value="300">{{ 'COMMON.ACTIVE' | translate }}</ion-select-option>
            <ion-select-option value="100">{{ 'COMMON.PENDING' | translate }}</ion-select-option>
            <ion-select-option value="600">{{ 'COMMON.CLOSED' | translate }}</ion-select-option>
            <ion-select-option value="700">{{ 'COMMON.OVERPAID' | translate }}</ion-select-option>
          </ion-select>
        </ion-item>
      </div>

      <ng-template appCellTemplate="status" let-loan>
        <app-status-badge [status]="loan.status"></app-status-badge>
      </ng-template>

      <ng-template appCellTemplate="accountNo" let-loan>
        <a class="clickable-link" [routerLink]="['/loans/view', loan.id]">{{ loan.accountNo }}</a>
      </ng-template>

      <ng-template appCellTemplate="actions" let-loan>
        <ion-button
          fill="clear"
          color="primary"
          [attr.aria-label]="'COMMON.EDIT' | translate"
          [attr.title]="'LOANS.EDIT_LOAN_APPLICATION' | translate"
          (click)="onEditLoan(loan)"
          *appHasPermission="'UPDATE_LOAN'"
        >
          <ion-icon name="create-outline"></ion-icon>
        </ion-button>
        <ion-button
          fill="clear"
          color="secondary"
          [attr.aria-label]="'LOANS.COLLATERAL' | translate"
          [attr.title]="'LOANS.MANAGE_COLLATERAL' | translate"
          (click)="onViewCollateral(loan)"
          *appHasPermission="'READ_LOANCOLLATERAL'"
        >
          <ion-icon name="shield-outline"></ion-icon>
        </ion-button>
        <ion-button
          fill="clear"
          color="primary"
          [attr.aria-label]="'LOANS.RESCHEDULE' | translate"
          [attr.title]="'LOANS.MANAGE_RESCHEDULING' | translate"
          (click)="onViewRescheduling(loan)"
        >
          <ion-icon name="repeat-outline"></ion-icon>
        </ion-button>

        @if (loan.status?.value === 'Submitted and pending approval') {
          <ion-button
            fill="clear"
            color="secondary"
            [attr.aria-label]="'LOANS.APPROVE_LOAN_APPLICATION' | translate"
            [attr.title]="'LOANS.APPROVE_LOAN_APPLICATION' | translate"
            (click)="onLoanAction(loan, 'approve')"
          >
            <ion-icon name="checkmark-circle-outline"></ion-icon>
          </ion-button>
        }
        @if (loan.status?.value === 'Approved') {
          <ion-button
            fill="clear"
            color="secondary"
            [attr.aria-label]="'LOANS.DISBURSE_LOAN' | translate"
            [attr.title]="'LOANS.DISBURSE_LOAN' | translate"
            (click)="onLoanAction(loan, 'disburse')"
          >
            <ion-icon name="open-outline"></ion-icon>
          </ion-button>
        }
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
export class LoansListComponent {
  private readonly loansService = inject(LoansService);
  private readonly router = inject(Router);

  columns: ColumnDef[] = [
    { key: 'accountNo', label: 'LOANS.ACCOUNT_NO', sortable: true },
    { key: 'clientName', label: 'LOANS.CLIENT_NAME', sortable: true },
    { key: 'loanProductName', label: 'LOANS.PRODUCT_NAME', sortable: true },
    { key: 'status', label: 'COMMON.STATUS', sortable: true },
    { key: 'actions', label: 'COMMON.ACTIONS', sortable: false },
  ];

  loans: GetLoansLoanIdResponse[] = [];
  totalRecords = 0;

  activeFilters: { status?: string } = {};

  private searchSubject = new Subject<string>();
  private sortSubject = new Subject<SortEvent>();
  private pageSubject = new Subject<PageEvent>();
  private filterSubject = new Subject<void>();

  private currentFilter = '';
  private currentSort: SortEvent = { active: '', direction: '' };
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

          const searchVal = this.currentFilter || undefined;
          const status = this.activeFilters.status;

          return this.loansService
            .getLoans(
              undefined,
              offset,
              limit,
              orderBy,
              sortOrder,
              searchVal,
              undefined,
              undefined,
              status,
            )
            .pipe(catchError(() => of(null)));
        }),
        map((response) => {
          if (response === null) return [];
          this.totalRecords = response.totalFilteredRecords || 0;
          return Array.from((response.pageItems as unknown as GetLoansLoanIdResponse[]) || []);
        }),
      )
      .subscribe((data) => {
        this.loans = data;
      });
  }

  onSearch(filterValue: string) {
    this.currentFilter = filterValue;
    this.currentPage.pageIndex = 0;
    this.searchSubject.next(filterValue);
  }

  onSort(sort: SortEvent) {
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

  onCreateLoan() {
    this.router.navigate(['/loans/create']);
  }

  onEditLoan(loan: GetLoansLoanIdResponse) {
    this.router.navigate(['/loans/edit', loan.id]);
  }

  onViewCollateral(loan: GetLoansLoanIdResponse) {
    this.router.navigate(['/loans', loan.id, 'collateral']);
  }

  onViewRescheduling(loan: GetLoansLoanIdResponse) {
    this.router.navigate(['/loans', loan.id, 'rescheduling']);
  }

  onLoanAction(loan: GetLoansLoanIdResponse, command: string) {
    this.router.navigate([`/products/loan/${loan.id}/action/${command}`]);
  }
}
