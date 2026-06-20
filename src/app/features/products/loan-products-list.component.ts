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

@Component({
  selector: 'app-loan-products-list',
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
          [matTooltip]="'COMMON.EDIT' | translate"
          (click)="onEditProduct(product)"
        >
          <mat-icon>edit</mat-icon>
        </button>
      </ng-template>
    </app-data-table>
  `,
})
export class LoanProductsListComponent implements OnInit {
  private readonly loanProductsService = inject(LoanProductsService);
  private readonly router = inject(Router);

  readonly columns: ColumnDef[] = [
    { key: 'name', label: 'COMMON.NAME', sortable: true },
    { key: 'shortName', label: 'PRODUCTS.SHORT_NAME', sortable: true },
    { key: 'description', label: 'PRODUCTS.DESCRIPTION', sortable: false },
    { key: 'actions', label: 'COMMON.ACTIONS', sortable: false },
  ];

  products: GetLoanProductsResponse[] = [];

  ngOnInit(): void {
    this.loadProducts();
  }

  private loadProducts(): void {
    this.loanProductsService
      .getLoanproducts()
      .pipe(catchError(() => of([])))
      .subscribe((data: GetLoanProductsResponse[]) => {
        this.products = data || [];
      });
  }

  onCreateProduct(): void {
    this.router.navigate(['/products/loan/create']);
  }

  onEditProduct(product: GetLoanProductsResponse): void {
    this.router.navigate(['/products/loan/edit', product.id]);
  }
}
