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
import { TranslateModule } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CellTemplateDirective, ColumnDef } from '../../shared';
import { DataTableComponent } from '../../shared/components/data-table/data-table.component';
import { SavingsProductService, GetSavingsProductsResponse } from '../../api';

/**
 * Component for displaying a list of savings products.
 *
 * Integrates with the Fineract Savings Products API.
 * Uses local pagination and search as the API returns the full product list.
 */
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
      title="nav.savingsProducts"
      helpTextKey="HELP.SAVINGS_PRODUCTS_DESC"
      createButtonLabel="PRODUCTS.CREATE_SAVINGS_PRODUCT"
      [columns]="columns"
      [data]="products"
      [totalRecords]="products.length"
      [showSearch]="true"
      [localLogic]="true"
      (create)="onCreateProduct()"
    >
      <ng-template appCellTemplate="actions" let-product>
        <button
          mat-icon-button
          color="primary"
          [attr.aria-label]="'COMMON.EDIT' | translate"
          matTooltip="Edit Product"
          (click)="onEditProduct(product)"
        >
          <mat-icon>edit</mat-icon>
        </button>
      </ng-template>
    </app-data-table>
  `,
})
export class SavingsProductsListComponent implements OnInit {
  /** Service for savings product operations */
  private readonly savingsProductService = inject(SavingsProductService);
  /** Router for navigation */
  private readonly router = inject(Router);

  /** Column definitions for the savings products data table */
  readonly columns: ColumnDef[] = [
    { key: 'name', label: 'COMMON.NAME', sortable: true },
    { key: 'shortName', label: 'PRODUCTS.SHORT_NAME', sortable: true },
    { key: 'description', label: 'PRODUCTS.DESCRIPTION', sortable: false },
    { key: 'actions', label: 'COMMON.ACTIONS', sortable: false },
  ];

  /** List of savings products retrieved from the API */
  products: GetSavingsProductsResponse[] = [];

  /**
   * Initializes the component.
   */
  ngOnInit(): void {
    this.loadProducts();
  }

  /**
   * Retrieves all savings products from the Fineract API.
   */
  private loadProducts(): void {
    this.savingsProductService
      .retrieveAll34()
      .pipe(catchError(() => of([])))
      .subscribe((data: GetSavingsProductsResponse[]) => {
        this.products = data || [];
      });
  }

  /**
   * Navigates to the savings product creation form.
   */
  onCreateProduct(): void {
    this.router.navigate(['/products/savings/create']);
  }

  /**
   * Navigates to the edit form for a specific savings product.
   *
   * @param product - The savings product entity to edit.
   */
  onEditProduct(product: GetSavingsProductsResponse): void {
    this.router.navigate(['/products/savings/edit', product.id]);
  }
}
