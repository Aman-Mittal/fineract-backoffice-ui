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
import { DecimalPipe } from '@angular/common';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { DataTableComponent, ColumnDef, CellTemplateDirective } from '../../../shared';
import { FixedDepositProductService, GetFixedDepositProductsResponse } from '../../../api';

@Component({
  selector: 'app-fixed-deposit-products-list',
  standalone: true,
  imports: [
    TranslateModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    DataTableComponent,
    CellTemplateDirective,
    DecimalPipe,
  ],
  template: `
    <app-data-table
      title="nav.fixedDepositProducts"
      createButtonLabel="PRODUCTS.CREATE_FIXED_DEPOSIT_PRODUCT"
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
        <button
          mat-icon-button
          color="primary"
          [matTooltip]="'COMMON.EDIT' | translate"
          (click)="onEdit(product)"
        >
          <mat-icon>edit</mat-icon>
        </button>
      </ng-template>
    </app-data-table>
  `,
})
export class FixedDepositProductsListComponent implements OnInit {
  private readonly productService = inject(FixedDepositProductService);
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

  products: GetFixedDepositProductsResponse[] = [];
  isLoading = true;

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.isLoading = true;
    this.productService
      .getFixeddepositproducts()
      .pipe(catchError(() => of([])))
      .subscribe((data) => {
        this.products = data;
        this.isLoading = false;
      });
  }

  onCreate() {
    this.router.navigate(['/products/fixed/create']);
  }

  onEdit(product: GetFixedDepositProductsResponse) {
    this.router.navigate(['/products/fixed/edit', product.id]);
  }
}
