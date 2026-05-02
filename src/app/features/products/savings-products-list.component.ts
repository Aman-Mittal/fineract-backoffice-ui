/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, See the NOTICE file
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
import { Sort } from '@angular/material/sort';
import { of } from 'rxjs';
import { catchError, startWith } from 'rxjs/operators';
import { DataTableComponent, CellTemplateDirective, ColumnDef } from '../../shared';
import { SavingsProductService, GetSavingsProductsResponse } from '../../api';

@Component({
  selector: 'app-savings-products-list',
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
      title="Savings Products"
      helpTextKey="HELP.SAVINGS_PRODUCTS_DESC"
      createButtonLabel="Create Savings Product"
      [columns]="columns"
      [data]="products"
      [showSearch]="false"
      (create)="onCreateProduct()"
      (sortChange)="onSort($event)"
    >
      <ng-template appCellTemplate="actions" let-product>
        <button
          mat-icon-button
          color="primary"
          matTooltip="Edit Product"
          (click)="onEditProduct(product)"
        >
          <mat-icon>edit</mat-icon>
        </button>
      </ng-template>
    </app-data-table>
  `,
})
export class SavingsProductsListComponent {
  private readonly savingsProductService = inject(SavingsProductService);
  private readonly router = inject(Router);

  columns: ColumnDef[] = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'shortName', label: 'Short Name', sortable: true },
    { key: 'description', label: 'Description', sortable: false },
    { key: 'actions', label: 'Actions', sortable: false },
  ];

  products: GetSavingsProductsResponse[] = [];

  constructor() {
    this.savingsProductService
      .retrieveAll34()
      .pipe(
        startWith([]),
        catchError(() => of([])),
      )
      .subscribe((data) => {
        this.products = data;
      });
  }

  onSort(sort: Sort) {
    if (sort.direction) {
      this.products = [...this.products].sort((a, b) => {
        const isAsc = sort.direction === 'asc';
        const aValue = (a as Record<string, unknown>)[sort.active] ?? '';
        const bValue = (b as Record<string, unknown>)[sort.active] ?? '';
        return (String(aValue) < String(bValue) ? -1 : 1) * (isAsc ? 1 : -1);
      });
    }
  }

  onCreateProduct() {
    this.router.navigate(['/products/savings/create']);
  }

  onEditProduct(product: GetSavingsProductsResponse) {
    this.router.navigate(['/products/savings/edit', product.id]);
  }
}
