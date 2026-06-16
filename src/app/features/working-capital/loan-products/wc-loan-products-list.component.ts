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
import {
  WorkingCapitalLoanProductsService,
  GetWorkingCapitalLoanProductsResponse,
} from '../../../api';

/**
 * Lists working-capital loan products. These are small master-data records, so the
 * table uses local pagination (mirrors the working-capital breach list screen).
 *
 * Note: the working-capital endpoints are Fineract 1.15.0-only and are not reachable
 * on the older community sandbox; this screen is verified against the frozen spec.
 */
@Component({
  selector: 'app-wc-loan-products-list',
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
      title="nav.wcLoanProducts"
      helpTextKey="HELP.WC_LOAN_PRODUCTS_DESC"
      createButtonLabel="WC_LOAN_PRODUCTS.CREATE"
      [columns]="columns"
      [data]="products"
      [totalRecords]="products.length"
      [localLogic]="true"
      (create)="onCreate()"
    >
      <ng-template appCellTemplate="currencyCode" let-row>
        {{ row.currency?.code }}
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
        <button
          mat-icon-button
          color="warn"
          [attr.aria-label]="'COMMON.DELETE' | translate"
          [matTooltip]="'COMMON.DELETE' | translate"
          (click)="onDelete(row)"
        >
          <mat-icon>delete</mat-icon>
        </button>
      </ng-template>
    </app-data-table>
  `,
})
export class WcLoanProductsListComponent implements OnInit {
  private readonly productService = inject(WorkingCapitalLoanProductsService);
  private readonly router = inject(Router);

  readonly columns: ColumnDef[] = [
    { key: 'name', label: 'WC_LOAN_PRODUCTS.NAME', sortable: true },
    { key: 'shortName', label: 'WC_LOAN_PRODUCTS.SHORT_NAME', sortable: true },
    { key: 'currencyCode', label: 'WC_LOAN_PRODUCTS.CURRENCY', sortable: false },
    { key: 'principal', label: 'WC_LOAN_PRODUCTS.PRINCIPAL', sortable: true },
    { key: 'actions', label: 'COMMON.ACTIONS', sortable: false },
  ];

  products: GetWorkingCapitalLoanProductsResponse[] = [];

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.productService.getWorkingCapitalLoanProducts().subscribe({
      next: (data: GetWorkingCapitalLoanProductsResponse[]) => {
        this.products = data || [];
      },
      error: (err: unknown) => {
        console.error('Failed to load working-capital loan products', err);
      },
    });
  }

  onCreate(): void {
    this.router.navigate(['/working-capital/loan-products/create']);
  }

  onEdit(row: GetWorkingCapitalLoanProductsResponse): void {
    this.router.navigate(['/working-capital/loan-products/edit', row.id]);
  }

  onDelete(row: GetWorkingCapitalLoanProductsResponse): void {
    if (!row.id || !window.confirm('Delete this working-capital loan product?')) return;
    this.productService.deleteWorkingCapitalLoanProductsProductId(row.id).subscribe({
      next: () => this.load(),
      error: (err: unknown) => console.error('Failed to delete loan product', err),
    });
  }
}
