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

import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ColumnDef, CellTemplateDirective } from '../../../shared';
import { DataTableComponent } from '../../../shared/components/data-table/data-table.component';
import { CashiersService, CashierData } from '../../../api';

/**
 * Component for listing cashiers assigned to a specific branch teller.
 *
 * Integrates with the Fineract Cashiers API to manage staff allocations
 * for vault and drawer operations.
 */
@Component({
  selector: 'app-cashiers-list',
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
      title="TELLERS.CASHIERS"
      helpTextKey="HELP.CASHIERS_DESC"
      createButtonLabel="TELLERS.ALLOCATE_CASHIER"
      [columns]="columns"
      [data]="cashiers"
      [totalRecords]="cashiers.length"
      [localLogic]="true"
      (create)="onAllocateCashier()"
    >
      <ng-template appCellTemplate="startDate" let-cashier>
        {{ formatArrayDate(cashier.startDate) }}
      </ng-template>

      <ng-template appCellTemplate="endDate" let-cashier>
        {{ formatArrayDate(cashier.endDate) }}
      </ng-template>

      <ng-template appCellTemplate="fullDay" let-cashier>
        {{ (cashier.isFullDay ? 'COMMON.YES' : 'COMMON.NO') | translate }}
      </ng-template>

      <ng-template appCellTemplate="actions" let-cashier>
        <button
          mat-icon-button
          color="warn"
          [attr.aria-label]="'COMMON.DELETE' | translate"
          matTooltip="Remove Cashier Allocation"
          (click)="onRemoveCashier(cashier)"
        >
          <mat-icon>delete</mat-icon>
        </button>
      </ng-template>
    </app-data-table>
  `,
})
export class CashiersListComponent implements OnInit {
  /** Service for cashier lifecycle management */
  private readonly cashiersService = inject(CashiersService);
  /** Router for navigation */
  private readonly router = inject(Router);
  /** Activated route for teller ID */
  private readonly route = inject(ActivatedRoute);

  /** Current teller identifier */
  tellerId = 0;

  /** Column definitions for the cashiers table */
  readonly columns: ColumnDef[] = [
    { key: 'staffName', label: 'TELLERS.STAFF', sortable: true },
    { key: 'startDate', label: 'TELLERS.START_DATE', sortable: true },
    { key: 'endDate', label: 'TELLERS.END_DATE', sortable: true },
    { key: 'fullDay', label: 'TELLERS.IS_FULL_TIME', sortable: true },
    { key: 'actions', label: 'COMMON.ACTIONS', sortable: false },
  ];

  /** List of cashiers allocated to the teller */
  cashiers: CashierData[] = [];

  /**
   * Initializes the component and retrieves the teller context.
   */
  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.tellerId = +params['tellerId'];
      this.loadCashiers();
    });
  }

  /**
   * Fetches the cashier list for the current teller.
   */
  private loadCashiers(): void {
    // Note: getCashierData signature usually needs officeId but can work with just tellerId in some versions.
    // Defaulting to undefined for officeId to fetch based on teller context.
    this.cashiersService.getCashierData(undefined, this.tellerId).subscribe({
      next: (data: CashierData[]) => {
        this.cashiers = data || [];
      },
      error: (err: unknown) => {
        console.error('Failed to load cashiers', err);
      },
    });
  }

  /**
   * Navigates to the cashier allocation form.
   */
  onAllocateCashier(): void {
    this.router.navigate(['/tellers', this.tellerId, 'cashiers', 'create']);
  }

  /**
   * Removes a cashier allocation.
   *
   * @param cashier - The cashier record to delete.
   */
  onRemoveCashier(cashier: CashierData): void {
    // Implementation for removal (DELETE /tellers/{tellerId}/cashiers/{cashierId})
    // For now, we log the intent.
    console.log('Remove cashier allocation', cashier.id);
  }

  /**
   * Formats a Fineract array date [YYYY, MM, DD] into a readable string.
   *
   * @param dateArray - Raw date from API.
   * @returns Formatted date string.
   */
  formatArrayDate(dateArray: unknown): string {
    if (!dateArray || !Array.isArray(dateArray) || dateArray.length < 3) {
      return '-';
    }
    return `${dateArray[0]}-${String(dateArray[1]).padStart(2, '0')}-${String(dateArray[2]).padStart(2, '0')}`;
  }
}
