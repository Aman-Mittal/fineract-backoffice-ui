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
import { LoanProductsService, GetLoanProductsResponse } from '../../api';

/**
 * Component for displaying a list of loan products.
 *
 * Integrates with the Fineract Loan Products API.
 * Uses local pagination and search as the API returns the full product list.
 */
@Component({
  selector: 'app-loan-products-list',
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
      title="nav.loanProducts"
      helpTextKey="HELP.LOAN_PRODUCTS_DESC"
      createButtonLabel="PRODUCTS.CREATE_LOAN_PRODUCT"
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
export class LoanProductsListComponent implements OnInit {
  /** Service for loan product operations */
  private readonly loanProductsService = inject(LoanProductsService);
  /** Router for navigation */
  private readonly router = inject(Router);

  /** Column definitions for the loan products data table */
  readonly columns: ColumnDef[] = [
    { key: 'name', label: 'COMMON.NAME', sortable: true },
    { key: 'shortName', label: 'PRODUCTS.SHORT_NAME', sortable: true },
    { key: 'description', label: 'PRODUCTS.DESCRIPTION', sortable: false },
    { key: 'actions', label: 'COMMON.ACTIONS', sortable: false },
  ];

  /** List of loan products retrieved from the API */
  products: GetLoanProductsResponse[] = [];

  /**
   * Initializes the component.
   */
  ngOnInit(): void {
    this.loadProducts();
  }

  /**
   * Retrieves all loan products from the Fineract API.
   */
  private loadProducts(): void {
    this.loanProductsService
      .retrieveAllLoanProducts()
      .pipe(catchError(() => of([])))
      .subscribe((data: GetLoanProductsResponse[]) => {
        this.products = data || [];
      });
  }

  /**
   * Navigates to the loan product creation form.
   */
  onCreateProduct(): void {
    this.router.navigate(['/products/loan/create']);
  }

  /**
   * Navigates to the edit form for a specific loan product.
   *
   * @param product - The loan product entity to edit.
   */
  onEditProduct(product: GetLoanProductsResponse): void {
    this.router.navigate(['/products/loan/edit', product.id]);
  }
}
