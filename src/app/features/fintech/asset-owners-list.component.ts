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
import { PageEvent } from '@angular/material/paginator';
import { Subject, merge, of } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { DataTableComponent, CellTemplateDirective, ColumnDef } from '../../shared';
import { ExternalAssetOwnersService, ExternalTransferData } from '../../api';

@Component({
  selector: 'app-asset-owners-list',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    DataTableComponent,
    CellTemplateDirective,
  ],
  template: `
    <app-data-table
      title="External Asset Owners"
      helpTextKey="HELP.ASSET_OWNERS_DESC"
      [columns]="columns"
      [data]="transfers"
      [totalRecords]="totalRecords"
      (searchChange)="onSearch($event)"
      (pageChange)="onPage($event)"
    >
      <ng-template appCellTemplate="status" let-transfer>
        <span class="status-tag" [ngClass]="transfer.status?.toLowerCase()">
          {{ transfer.status }}
        </span>
      </ng-template>

      <ng-template appCellTemplate="actions" let-transfer>
        <button mat-icon-button color="primary" matTooltip="View Details">
          <mat-icon>visibility</mat-icon>
        </button>
      </ng-template>
    </app-data-table>
  `,
  styles: [
    `
      .status-tag {
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 12px;
        font-weight: bold;
        text-transform: uppercase;
      }
      .active {
        background-color: #e6f4ea;
        color: #1e8e3e;
      }
      .pending {
        background-color: #fef7e0;
        color: #f29900;
      }
    `,
  ],
})
export class ExternalAssetOwnersListComponent {
  private readonly assetOwnersService = inject(ExternalAssetOwnersService);

  columns: ColumnDef[] = [
    { key: 'transferExternalId', label: 'Transfer ID', sortable: false },
    { key: 'ownerExternalId', label: 'Owner ID', sortable: false },
    { key: 'loanAccountNo', label: 'Loan Account', sortable: false },
    { key: 'purchasePriceRatio', label: 'Purchase Ratio', sortable: false },
    { key: 'status', label: 'Status', sortable: false },
    { key: 'actions', label: 'Actions', sortable: false },
  ];

  transfers: ExternalTransferData[] = [];
  totalRecords = 0;

  private searchSubject = new Subject<string>();
  private pageSubject = new Subject<PageEvent>();

  private currentFilter = '';
  private currentPage: PageEvent = { pageIndex: 0, pageSize: 10, length: 0 };

  constructor() {
    merge(this.searchSubject, this.pageSubject)
      .pipe(
        startWith({}),
        switchMap(() => {
          // Use searchInvestorData with PagedRequestExternalAssetOwnerSearchRequest
          const request = {
            page: this.currentPage.pageIndex,
            size: this.currentPage.pageSize,
            request: {
              text: this.currentFilter || undefined,
            },
          };

          return this.assetOwnersService
            .searchInvestorData(request)
            .pipe(catchError(() => of(null)));
        }),
        map((response) => {
          if (response === null) return [];
          this.totalRecords = response.totalElements || 0;
          return response.content || [];
        }),
      )
      .subscribe((data) => {
        this.transfers = data;
      });
  }

  onSearch(value: string) {
    this.currentFilter = value;
    this.currentPage.pageIndex = 0;
    this.searchSubject.next(value);
  }

  onPage(event: PageEvent) {
    this.currentPage = event;
    this.pageSubject.next(event);
  }
}
