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

import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { IonButton, IonIcon } from '@ionic/angular/standalone';
import { ColumnDef, CellTemplateDirective } from '../../../shared';
import { DataTableComponent } from '../../../shared/components/data-table/data-table.component';
import { CashiersService, CashierData, TellerCashManagementService } from '../../../api';
import { TooltipDirective } from '../../../shared/directives/tooltip.directive';

@Component({
  selector: 'app-cashiers-list',
  standalone: true,
  imports: [
    TranslateModule,
    IonButton,
    IonIcon,
    DataTableComponent,
    CellTemplateDirective,
    TooltipDirective,
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
        <ion-button
          fill="clear"
          color="danger"
          [attr.aria-label]="'COMMON.DELETE' | translate"
          [appTooltip]="'Remove Cashier Allocation'"
          (click)="onRemoveCashier(cashier)"
          [id]="'delete-cashier-btn-' + cashier.id"
          [attr.data-testid]="'delete-cashier-btn-' + cashier.id"
        >
          <ion-icon name="trash-outline" slot="icon-only"></ion-icon>
        </ion-button>
      </ng-template>
    </app-data-table>
  `,
})
export class CashiersListComponent implements OnInit {
  private readonly cashiersService = inject(CashiersService);
  private readonly tellerService = inject(TellerCashManagementService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  tellerId = 0;

  readonly columns: ColumnDef[] = [
    { key: 'staffName', label: 'TELLERS.STAFF', sortable: true },
    { key: 'startDate', label: 'TELLERS.START_DATE', sortable: true },
    { key: 'endDate', label: 'TELLERS.END_DATE', sortable: true },
    { key: 'fullDay', label: 'TELLERS.IS_FULL_TIME', sortable: true },
    { key: 'actions', label: 'COMMON.ACTIONS', sortable: false },
  ];

  cashiers: CashierData[] = [];

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.tellerId = +params['tellerId'];
      this.loadCashiers();
    });
  }

  private loadCashiers(): void {
    // Note: getCashierData signature usually needs officeId but can work with just tellerId in some versions.
    // Defaulting to undefined for officeId to fetch based on teller context.
    this.cashiersService.getCashiers(undefined, this.tellerId).subscribe({
      next: (data: CashierData[]) => {
        this.cashiers = data || [];
      },
      error: (err: unknown) => {
        console.error('Failed to load cashiers', err);
      },
    });
  }

  onAllocateCashier(): void {
    this.router.navigate(['/tellers', this.tellerId, 'cashiers', 'create']);
  }

  onRemoveCashier(cashier: CashierData): void {
    if (confirm('Are you sure you want to remove this cashier allocation?')) {
      this.tellerService
        .deleteTellersTellerIdCashiersCashierId(this.tellerId, cashier.id!)
        .subscribe({
          next: () => {
            this.loadCashiers();
          },
          error: (err: unknown) => {
            console.error('Failed to remove cashier allocation', err);
          },
        });
    }
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
