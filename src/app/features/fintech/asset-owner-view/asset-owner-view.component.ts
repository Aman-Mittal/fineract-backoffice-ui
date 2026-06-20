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
import { ActivatedRoute, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import {
  ExternalAssetOwnersService,
  ExternalTransferData,
  PageExternalTransferData,
  ExternalOwnerTransferJournalEntryData,
  JournalEntryData,
  ExternalAssetOwnerLoanProductAttributesService,
} from '../../../api';
import { DataTableComponent, ColumnDef, StatusBadgeComponent } from '../../../shared';

@Component({
  selector: 'app-asset-owner-view',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TranslateModule,
    MatCardModule,
    MatDividerModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    MatTableModule,
    DataTableComponent,
    StatusBadgeComponent,
  ],
  template: `
    @if (transfer$ | async; as transfer) {
      <div class="container">
        <div class="breadcrumb">
          <a routerLink="/fintech/asset-owners">External Asset Owners</a> /
          <span>{{ transfer.owner?.externalId }}</span>
        </div>
        <mat-card class="header-card">
          <mat-card-header>
            <mat-card-title>
              Asset Owner: {{ transfer.owner?.externalId }}
              <app-status-badge [status]="transfer.status"></app-status-badge>
            </mat-card-title>
            <div class="header-actions">
              <button
                mat-stroked-button
                color="primary"
                [routerLink]="['/loans/view', transfer.loan?.loanId]"
              >
                <mat-icon>account_balance</mat-icon>
                View Loan Account
              </button>
            </div>
          </mat-card-header>
          <mat-card-content>
            <div class="details-grid">
              <div class="detail-item">
                <span class="label">Transfer ID:</span>
                <span class="value">{{ transfer.transferExternalId }}</span>
              </div>
              <div class="detail-item">
                <span class="label">Loan External ID:</span>
                <span class="value">{{ transfer.loan?.externalId }}</span>
              </div>
              <div class="detail-item">
                <span class="label">Purchase Price Ratio:</span>
                <span class="value">{{ transfer.purchasePriceRatio }}</span>
              </div>
              <div class="detail-item">
                <span class="label">Settlement Date:</span>
                <span class="value">{{ transfer.settlementDate }}</span>
              </div>
              <div class="detail-item">
                <span class="label">Effective From:</span>
                <span class="value">{{ transfer.effectiveFrom }}</span>
              </div>
              <div class="detail-item">
                <span class="label">Effective To:</span>
                <span class="value">{{ transfer.effectiveTo || 'N/A' }}</span>
              </div>
            </div>
          </mat-card-content>
        </mat-card>
        <mat-tab-group class="content-tabs">
          <mat-tab label="Journal Entries">
            <app-data-table
              title="Journal Entries"
              [columns]="journalColumns"
              [data]="(journalEntries$ | async) || []"
              [showSearch]="false"
              [localLogic]="true"
            >
            </app-data-table>
          </mat-tab>
          <mat-tab label="{{ 'ASSET_OWNERS.LOAN_PRODUCT_ATTRIBUTES' | translate }}">
            <div class="tab-content">
              @if (attributes().length === 0) {
                <p class="empty-state">{{ 'COMMON.NO_DATA' | translate }}</p>
              } @else {
                <table mat-table [dataSource]="attributes()" class="full-width-table">
                  <ng-container matColumnDef="attributeKey">
                    <th mat-header-cell *matHeaderCellDef>
                      {{ 'ASSET_OWNERS.ATTRIBUTE_KEY' | translate }}
                    </th>
                    <td mat-cell *matCellDef="let row">{{ row.attributeKey }}</td>
                  </ng-container>
                  <ng-container matColumnDef="attributeValue">
                    <th mat-header-cell *matHeaderCellDef>
                      {{ 'ASSET_OWNERS.ATTRIBUTE_VALUE' | translate }}
                    </th>
                    <td mat-cell *matCellDef="let row">{{ row.attributeValue }}</td>
                  </ng-container>
                  <ng-container matColumnDef="actions">
                    <th mat-header-cell *matHeaderCellDef></th>
                    <td mat-cell *matCellDef="let row">
                      <!-- placeholder for edit action -->
                    </td>
                  </ng-container>
                  <tr mat-header-row *matHeaderRowDef="attributeColumns"></tr>
                  <tr mat-row *matRowDef="let row; columns: attributeColumns"></tr>
                </table>
              }
            </div>
          </mat-tab>
        </mat-tab-group>
      </div>
    }
  `,
  styles: [
    `
      .container {
        padding: 24px;
      }
      .breadcrumb {
        margin-bottom: 16px;
        font-size: 14px;
      }
      .breadcrumb a {
        text-decoration: none;
        color: #1976d2;
      }
      .header-card {
        margin-bottom: 24px;
      }
      mat-card-title {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 16px;
      }
      .header-actions {
        margin-left: auto;
      }
      .details-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
        gap: 16px;
        margin-top: 16px;
      }
      .detail-item {
        display: flex;
        flex-direction: column;
      }
      .label {
        font-size: 12px;
        color: rgba(0, 0, 0, 0.6);
        margin-bottom: 4px;
      }
      .value {
        font-weight: 500;
      }
      .content-tabs {
        margin-top: 24px;
      }
      .tab-content {
        padding: 16px 0;
      }
      .empty-state {
        color: rgba(0, 0, 0, 0.54);
        font-style: italic;
      }
      .full-width-table {
        width: 100%;
      }
    `,
  ],
})
export class AssetOwnerViewComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly assetOwnersService = inject(ExternalAssetOwnersService);
  private readonly attributesService = inject(ExternalAssetOwnerLoanProductAttributesService);

  attributes = signal<Record<string, unknown>[]>([]);
  attributeColumns = ['attributeKey', 'attributeValue', 'actions'];

  transfer$!: Observable<ExternalTransferData>;
  journalEntries$!: Observable<JournalEntryData[]>;

  journalColumns: ColumnDef[] = [
    { key: 'id', label: 'ID', sortable: true },
    { key: 'transactionDate', label: 'Date', sortable: true },
    { key: 'amount', label: 'Amount', sortable: true },
    { key: 'type.value', label: 'Type', sortable: true },
    { key: 'glAccountName', label: 'GL Account', sortable: true },
  ];

  ngOnInit() {
    const transferExternalId = this.route.snapshot.params['id'];

    // Get basic transfer details using transferExternalId
    this.transfer$ = this.assetOwnersService
      .getExternalAssetOwnersTransfers(transferExternalId, undefined, undefined, 0, 1)
      .pipe(
        map((page: PageExternalTransferData) => page.content?.[0] || {}),
        catchError(() => of({} as ExternalTransferData)),
      );

    // Load loan product attributes if the transfer has a loanProductId
    this.transfer$.subscribe((transfer: ExternalTransferData) => {
      if ((transfer as Record<string, unknown>)['loanProductId']) {
        this.attributesService
          .getExternalAssetOwnersLoanProductLoanProductIdAttributes(
            (transfer as Record<string, unknown>)['loanProductId'] as number,
          )
          .subscribe({
            next: (page: unknown) =>
              this.attributes.set((page as { content?: Record<string, unknown>[] })?.content ?? []),
            error: () => {
              /* ignored */
            },
          });
      }
    });

    // Get journal entries using the numeric transferId once transfer is loaded
    this.journalEntries$ = this.transfer$.pipe(
      switchMap((transfer) => {
        if (transfer.transferId) {
          return this.assetOwnersService
            .getExternalAssetOwnersTransfersTransferIdJournalEntries(transfer.transferId)
            .pipe(
              map(
                (response: ExternalOwnerTransferJournalEntryData) =>
                  response.journalEntryData?.content || [],
              ),
              catchError(() => of([])),
            );
        }
        return of([]);
      }),
    );
  }
}
