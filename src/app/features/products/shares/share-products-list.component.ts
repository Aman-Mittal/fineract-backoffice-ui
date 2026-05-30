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
import { ProductsService, GetProductsTypeResponse, GetProductsPageItems } from '../../../api';

@Component({
  selector: 'app-share-products-list',
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
      title="nav.shares"
      createButtonLabel="PRODUCTS.CREATE_SHARE_PRODUCT"
      [columns]="columns"
      [data]="products"
      [showSearch]="true"
      [localLogic]="true"
      [isLoading]="isLoading"
      (create)="onCreate()"
    >
      <ng-template appCellTemplate="actions" let-product>
        <button mat-icon-button color="primary" matTooltip="Edit Product" (click)="onEdit(product)">
          <mat-icon>edit</mat-icon>
        </button>
      </ng-template>
    </app-data-table>
  `,
})
export class ShareProductsListComponent implements OnInit {
  private readonly productService = inject(ProductsService);
  private readonly router = inject(Router);

  columns: ColumnDef[] = [
    { key: 'name', label: 'COMMON.NAME', sortable: true },
    { key: 'shortName', label: 'COMMON.DESCRIPTION', sortable: true },
    { key: 'currency.code', label: 'COMMON.TYPE', sortable: true },
    { key: 'unitPrice', label: 'COMMON.AMOUNT', sortable: true },
    { key: 'actions', label: 'COMMON.ACTIONS', sortable: false },
  ];

  products: GetProductsPageItems[] = [];
  isLoading = true;

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.isLoading = true;
    this.productService
      .retrieveAllProducts('share')
      .pipe(catchError(() => of({ pageItems: [] } as unknown as GetProductsTypeResponse)))
      .subscribe((response: GetProductsTypeResponse) => {
        this.products = Array.from(response.pageItems || []);
        this.isLoading = false;
      });
  }

  onCreate() {
    this.router.navigate(['/products/share/create']);
  }

  onEdit(product: GetProductsPageItems) {
    this.router.navigate(['/products/share/edit', product.id]);
  }
}
