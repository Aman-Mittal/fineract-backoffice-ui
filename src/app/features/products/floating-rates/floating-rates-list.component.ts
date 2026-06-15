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
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ColumnDef, CellTemplateDirective } from '../../../shared';
import { DataTableComponent } from '../../../shared/components/data-table/data-table.component';
import { FloatingRatesService, FloatingRateData } from '../../../api';

/**
 * Lists floating interest rates (name, base-lending-rate flag, active flag).
 */
@Component({
  selector: 'app-floating-rates-list',
  standalone: true,
  imports: [
    TranslateModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    DataTableComponent,
    CellTemplateDirective,
  ],
  template: `
    <app-data-table
      title="nav.floatingRates"
      helpTextKey="HELP.FLOATING_RATES_DESC"
      createButtonLabel="FLOATING_RATES.CREATE"
      [columns]="columns"
      [data]="rates"
      [totalRecords]="rates.length"
      [localLogic]="true"
      (create)="onCreate()"
    >
      <ng-template appCellTemplate="isBaseLendingRate" let-row>
        {{ (row.isBaseLendingRate ? 'COMMON.YES' : 'COMMON.NO') | translate }}
      </ng-template>
      <ng-template appCellTemplate="isActive" let-row>
        {{ (row.isActive ? 'COMMON.YES' : 'COMMON.NO') | translate }}
      </ng-template>
      <ng-template appCellTemplate="actions" let-row>
        <button
          mat-icon-button
          color="primary"
          [attr.aria-label]="'COMMON.EDIT' | translate"
          [matTooltip]="'COMMON.EDIT' | translate"
          (click)="onEdit(row)"
        >
          <mat-icon>edit</mat-icon>
        </button>
      </ng-template>
    </app-data-table>
  `,
})
export class FloatingRatesListComponent implements OnInit {
  private readonly floatingRatesService = inject(FloatingRatesService);
  private readonly router = inject(Router);

  readonly columns: ColumnDef[] = [
    { key: 'name', label: 'FLOATING_RATES.NAME', sortable: true },
    { key: 'isBaseLendingRate', label: 'FLOATING_RATES.IS_BASE_LENDING_RATE', sortable: true },
    { key: 'isActive', label: 'COMMON.ACTIVE', sortable: true },
    { key: 'actions', label: 'COMMON.ACTIONS', sortable: false },
  ];

  rates: FloatingRateData[] = [];

  ngOnInit(): void {
    this.floatingRatesService.getFloatingrates().subscribe({
      next: (data: FloatingRateData[]) => {
        this.rates = data || [];
      },
      error: (err: unknown) => console.error('Failed to load floating rates', err),
    });
  }

  onCreate(): void {
    this.router.navigate(['/products/floating-rates/create']);
  }

  onEdit(row: FloatingRateData): void {
    this.router.navigate(['/products/floating-rates/edit', row.id]);
  }
}
