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

import { Component, OnInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { DEPOSIT_PRODUCT_API, TranslatePipe } from '../../../core/adapters';
import type { DepositProductSummary, DepositType } from '../../../core/adapters';
import { DecimalPipe } from '@angular/common';
import { of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { DataTableComponent, ColumnDef, CellTemplateDirective } from '../../../shared';
import { TooltipDirective } from '../../../shared/directives/tooltip.directive';
import { ButtonComponent } from '../../../ui/button/button.component';

/** Which kind of deposit product this screen lists; the adapter serves both. */
const DEPOSIT_TYPE: DepositType = 'fixed';

/**
 * The deposit products of one kind.
 *
 * ## No interest rate column
 *
 * There used to be one, bound to `nominalAnnualInterestRate`, and it read `0.00 %` against
 * every product on the screen. The list endpoint answers that field as `0` for all of them —
 * measured across 59 fixed and 3 recurring deposit products on a running Fineract, products
 * whose charts pay 5% and 7% among them — and carries no chart to read the real figure from.
 *
 * A single rate is the wrong shape for the answer in any case: a deposit product prices by
 * term, in bands, and the one number a column could hold would have to pick a band. So the list
 * states the two figures the endpoint does answer — the deposit amount and the minimum term —
 * and the rates stay where they are true, on the product\'s own page.
 */
@Component({
  selector: 'app-fixed-deposit-products-list',
  standalone: true,
  imports: [
    TranslatePipe,
    DataTableComponent,
    CellTemplateDirective,
    DecimalPipe,
    ButtonComponent,
    TooltipDirective,
  ],
  template: `
    <app-data-table
      [hasError]="hasError()"
      (retry)="onRetry()"
      title="nav.fixedDepositProducts"
      createButtonLabel="PRODUCTS.CREATE_FIXED_DEPOSIT_PRODUCT"
      createPermission="CREATE_FIXEDDEPOSITPRODUCT"
      [columns]="columns"
      [data]="products()"
      [showSearch]="true"
      [localLogic]="true"
      [isLoading]="isLoading()"
      (create)="onCreate()"
    >
      <ng-template appCellTemplate="depositAmount" let-product>
        {{ product.depositAmount | number: '1.2-2' }}
      </ng-template>

      <ng-template appCellTemplate="minDepositTerm" let-product>
        {{ product.minDepositTerm }} {{ product.minDepositTermUnit }}
      </ng-template>

      <ng-template appCellTemplate="actions" let-product>
        <app-button
          type="button"
          intent="primary"
          emphasis="quiet"
          [label]="'COMMON.EDIT' | appTranslate"
          icon="create-outline"
          [appTooltip]="'COMMON.EDIT' | appTranslate"
          (click)="onEdit(product)"
        />
      </ng-template>
    </app-data-table>
  `,
})
export class FixedDepositProductsListComponent implements OnInit {
  /** True when the last load failed, so the table offers a retry instead of an empty list. */
  readonly hasError = signal(false);

  private readonly depositProducts = inject(DEPOSIT_PRODUCT_API);
  private readonly router = inject(Router);

  columns: ColumnDef[] = [
    { key: 'name', label: 'COMMON.NAME', sortable: true },
    { key: 'shortName', label: 'PRODUCTS.SHORT_NAME', sortable: true },
    { key: 'currencyCode', label: 'PRODUCTS.CURRENCY', sortable: true },
    { key: 'depositAmount', label: 'DEPOSITS.DEPOSIT_AMOUNT', sortable: true },
    { key: 'minDepositTerm', label: 'PRODUCTS.MIN_DEPOSIT_TERM', sortable: true },
    { key: 'actions', label: 'COMMON.ACTIONS', sortable: false },
  ];

  readonly products = signal<DepositProductSummary[]>([]);
  readonly isLoading = signal(true);

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.isLoading.set(true);
    this.depositProducts
      .list(DEPOSIT_TYPE)
      .pipe(
        tap(() => this.hasError.set(false)),
        catchError(() => {
          this.hasError.set(true);
          return of([]);
        }),
      )
      .subscribe((data) => {
        this.products.set(data);
        this.isLoading.set(false);
      });
  }

  onCreate() {
    this.router.navigate(['/products/fixed/create']);
  }

  onEdit(product: DepositProductSummary) {
    this.router.navigate(['/products/fixed/edit', product.id]);
  }

  onRetry(): void {
    this.loadProducts();
  }
}
