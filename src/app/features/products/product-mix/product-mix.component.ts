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
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ProductMixService, LoanProductData } from '../../../api';

/**
 * Manages the product mix for a single loan product. The mix defines which other loan
 * products are restricted when this product is in use. The loan product id is read from
 * the route snapshot; a saved mix is updated, otherwise a new one is created, and
 * clearing the selection deletes the mix entirely.
 */
@Component({
  selector: 'app-product-mix',
  standalone: true,
  imports: [
    FormsModule,
    TranslateModule,
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
  ],
  template: `
    <div class="form-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>{{ 'PRODUCT_MIX.TITLE' | translate }}</mat-card-title>
        </mat-card-header>

        <mat-card-content>
          <form #mixForm="ngForm" (ngSubmit)="onSubmit()" class="mix-form">
            <mat-form-field appearance="outline">
              <mat-label>{{ 'PRODUCT_MIX.RESTRICTED_PRODUCTS' | translate }}</mat-label>
              <mat-select name="restrictedProducts" [(ngModel)]="restrictedProducts" multiple>
                @for (opt of productOptions; track opt.id) {
                  <mat-option [value]="opt.id">{{ opt.name }}</mat-option>
                }
              </mat-select>
            </mat-form-field>

            <div class="form-actions">
              <button
                mat-button
                type="button"
                color="warn"
                (click)="onDelete()"
                [disabled]="!hasMix || isSaving"
              >
                {{ 'PRODUCT_MIX.CLEAR' | translate }}
              </button>
              <button mat-button type="button" (click)="onCancel()" [disabled]="isSaving">
                {{ 'COMMON.CANCEL' | translate }}
              </button>
              <button mat-raised-button color="primary" type="submit" [disabled]="isSaving">
                @if (isSaving) {
                  <mat-spinner
                    diameter="20"
                    style="margin-right: 8px; display: inline-block; vertical-align: middle;"
                  ></mat-spinner>
                  {{ 'COMMON.SAVING' | translate }}
                } @else {
                  {{ 'COMMON.SAVE' | translate }}
                }
              </button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [
    `
      .form-container {
        padding: 24px;
        max-width: 600px;
        margin: 0 auto;
      }
      .mix-form {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }
    `,
  ],
})
export class ProductMixComponent implements OnInit {
  private readonly productMixService = inject(ProductMixService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);

  private readonly LIST_PATH = '/products/loan';

  productId!: number;
  hasMix = false;
  isSaving = false;

  restrictedProducts: number[] = [];
  productOptions: LoanProductData[] = [];

  ngOnInit(): void {
    this.productId = Number(this.route.snapshot.paramMap.get('productId'));
    this.load();
  }

  load(): void {
    this.productMixService.getLoanproductsProductIdProductmix(this.productId).subscribe({
      next: (data) => {
        this.productOptions = data.productOptions ?? [];
        const restricted = data.restrictedProducts ?? [];
        this.restrictedProducts = restricted
          .map((p) => p.id)
          .filter((id): id is number => id !== undefined);
        this.hasMix = restricted.length > 0;
      },
      error: () =>
        this.snackBar.open('Operation failed. Please try again.', 'Close', { duration: 3000 }),
    });
  }

  onSubmit(): void {
    this.isSaving = true;
    const request = { productId: this.productId, restrictedProducts: this.restrictedProducts };
    const request$ = this.hasMix
      ? this.productMixService.putLoanproductsProductIdProductmix(this.productId, request)
      : this.productMixService.postLoanproductsProductIdProductmix(this.productId, request);

    request$.subscribe({
      next: () => this.router.navigate([this.LIST_PATH]),
      error: () => (this.isSaving = false),
    });
  }

  onDelete(): void {
    if (!window.confirm('Clear this product mix?')) return;
    this.isSaving = true;
    this.productMixService.deleteLoanproductsProductIdProductmix(this.productId).subscribe({
      next: () => this.router.navigate([this.LIST_PATH]),
      error: () => (this.isSaving = false),
    });
  }

  onCancel(): void {
    this.router.navigate([this.LIST_PATH]);
  }
}
