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

import { Component, OnInit, inject, input, signal } from '@angular/core';

import { CellTemplateDirective, ColumnDef, DataTableComponent } from '../../../shared';
import { ExternalAssetOwnersService } from '../../../api';

interface AssetTransferRow {
  transferExternalId?: string;
  owner?: { externalId?: string };
  ownerExternalId?: string;
  status?: string;
  purchasePriceRatio?: number;
  settlementDate?: string;
  effectiveFrom?: string;
  effectiveTo?: string;
}

/**
 * Whether this loan has been sold on, and to whom.
 *
 * An officer looking at a loan the institution no longer owns has no indication of it today —
 * the screen looks exactly the same as for a loan still on the books, which is the wrong
 * impression to give anyone deciding how to service it.
 *
 * Always offered rather than hidden when empty, unlike the term-variation and originator tabs.
 * "This loan has not been sold" is a real and reassuring answer; the absence of a tab is not.
 */
@Component({
  selector: 'app-loan-asset-transfers-tab',
  standalone: true,
  imports: [DataTableComponent, CellTemplateDirective],
  template: `
    <app-data-table
      [data]="transfers()"
      [columns]="columns"
      [isLoading]="isLoading()"
      [hasError]="hasError()"
      (retry)="load()"
      [localLogic]="true"
    >
      <ng-template appCellTemplate="ownerExternalId" let-row>
        {{ row.owner?.externalId || row.ownerExternalId || '-' }}
      </ng-template>
    </app-data-table>
  `,
})
export class LoanAssetTransfersTabComponent implements OnInit {
  readonly loanId = input.required<number>();

  private readonly assetOwners = inject(ExternalAssetOwnersService);

  readonly transfers = signal<AssetTransferRow[]>([]);
  readonly isLoading = signal(false);
  readonly hasError = signal(false);

  columns: ColumnDef[] = [
    { key: 'transferExternalId', label: 'LOANS.TRANSFER_ID' },
    { key: 'ownerExternalId', label: 'LOANS.OWNER' },
    { key: 'status', label: 'COMMON.STATUS' },
    { key: 'purchasePriceRatio', label: 'LOANS.PURCHASE_PRICE_RATIO' },
    { key: 'settlementDate', label: 'LOANS.SETTLEMENT_DATE' },
    { key: 'effectiveFrom', label: 'LOANS.EFFECTIVE_FROM' },
  ];

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.isLoading.set(true);
    // This endpoint answers a Spring page envelope — `content`, not the `pageItems` the rest of
    // the platform returns — so the rows are read from there. Positional arguments again:
    // (transferExternalId, loanId, loanExternalId, offset, limit), so `loanId` is second.
    this.assetOwners
      .getExternalAssetOwnersTransfers(undefined, this.loanId(), undefined, 0, 200)
      .subscribe({
        next: (page) => {
          const envelope = page as unknown as { content?: AssetTransferRow[] };
          this.transfers.set(envelope?.content ?? []);
          this.hasError.set(false);
          this.isLoading.set(false);
        },
        error: () => {
          this.hasError.set(true);
          this.isLoading.set(false);
        },
      });
  }
}
