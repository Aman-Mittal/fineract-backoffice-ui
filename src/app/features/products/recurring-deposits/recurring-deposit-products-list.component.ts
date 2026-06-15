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
import { Router, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { DataTableComponent, ColumnDef, CellTemplateDirective } from '../../../shared';
import { RecurringDepositProductService, GetRecurringDepositProductsResponse } from '../../../api';

@Component({
  selector: 'app-recurring-deposit-products-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TranslateModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    DataTableComponent,
    CellTemplateDirective,
  ],
  template: `
    <app-data-table
      title="nav.recurringDeposits"
      createButtonLabel="PRODUCTS.CREATE_RECURRING_DEPOSIT_PRODUCT"
      [columns]="columns"
      [data]="products"
      [showSearch]="true"
      [localLogic]="true"
      [isLoading]="isLoading"
      (create)="onCreate()"
    >
      <ng-template appCellTemplate="nominalAnnualInterestRate" let-product>
        {{ product.nominalAnnualInterestRate | number: '1.2-2' }}%
      </ng-template>

      <ng-template appCellTemplate="actions" let-product>
        <button mat-icon-button color="primary" matTooltip="Edit Product" (click)="onEdit(product)">
          <mat-icon>edit</mat-icon>
        </button>
      </ng-template>
    </app-data-table>
  `,
})
export class RecurringDepositProductsListComponent implements OnInit {
  private readonly productService = inject(RecurringDepositProductService);
  private readonly router = inject(Router);

  columns: ColumnDef[] = [
    { key: 'name', label: 'COMMON.NAME', sortable: true },
    { key: 'shortName', label: 'PRODUCTS.SHORT_NAME', sortable: true },
    { key: 'currency.code', label: 'PRODUCTS.CURRENCY', sortable: true },
    {
      key: 'nominalAnnualInterestRate',
      label: 'PRODUCTS.NOMINAL_ANNUAL_INTEREST_RATE',
      sortable: true,
    },
    { key: 'actions', label: 'COMMON.ACTIONS', sortable: false },
  ];

  products: GetRecurringDepositProductsResponse[] = [];
  isLoading = true;

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.isLoading = true;
    this.productService
      .getRecurringdepositproducts()
      .pipe(catchError(() => of([])))
      .subscribe((data) => {
        this.products = data;
        this.isLoading = false;
      });
  }

  onCreate() {
    this.router.navigate(['/products/recurring/create']);
  }

  onEdit(product: GetRecurringDepositProductsResponse) {
    this.router.navigate(['/products/recurring/edit', product.id]);
  }
}
