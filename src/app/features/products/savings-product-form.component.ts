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
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import {
  SavingsProductService,
  PostSavingsProductsRequest,
  PutSavingsProductsProductIdRequest,
} from '../../api';

@Component({
  selector: 'app-savings-product-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatTooltipModule,
  ],
  template: `
    <div class="form-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>
            {{
              isEditMode
                ? ('PRODUCTS.EDIT_SAVINGS_PRODUCT' | translate)
                : ('PRODUCTS.CREATE_SAVINGS_PRODUCT' | translate)
            }}
          </mat-card-title>
        </mat-card-header>

        <mat-card-content>
          <form #productForm="ngForm" (ngSubmit)="onSubmit()" class="product-form">
            <div class="form-grid">
              <mat-form-field
                appearance="outline"
                [matTooltip]="'HELP.PRODUCT_NAME_DESC' | translate"
              >
                <mat-label>{{ 'COMMON.NAME' | translate }}</mat-label>
                <input matInput name="name" [(ngModel)]="product.name" required />
              </mat-form-field>

              <mat-form-field
                appearance="outline"
                [matTooltip]="'HELP.SHORT_NAME_DESC' | translate"
              >
                <mat-label>{{ 'PRODUCTS.SHORT_NAME' | translate }}</mat-label>
                <input
                  matInput
                  name="shortName"
                  [(ngModel)]="product.shortName"
                  required
                  maxlength="4"
                />
              </mat-form-field>

              <mat-form-field
                appearance="outline"
                [matTooltip]="'HELP.DESCRIPTION_DESC' | translate"
                class="full-width"
              >
                <mat-label>{{ 'PRODUCTS.DESCRIPTION' | translate }}</mat-label>
                <textarea
                  matInput
                  name="description"
                  [(ngModel)]="product.description"
                  rows="3"
                ></textarea>
              </mat-form-field>

              <mat-form-field appearance="outline" [matTooltip]="'HELP.CURRENCY_DESC' | translate">
                <mat-label>{{ 'PRODUCTS.CURRENCY' | translate }}</mat-label>
                <mat-select name="currencyCode" [(ngModel)]="product.currencyCode" required>
                  <mat-option value="USD">USD</mat-option>
                  <mat-option value="EUR">EUR</mat-option>
                  <mat-option value="INR">INR</mat-option>
                </mat-select>
              </mat-form-field>

              <mat-form-field
                appearance="outline"
                [matTooltip]="'HELP.DECIMAL_PLACES_DESC' | translate"
              >
                <mat-label>{{ 'PRODUCTS.DECIMAL_PLACES' | translate }}</mat-label>
                <input
                  matInput
                  type="number"
                  name="digitsAfterDecimal"
                  [(ngModel)]="product.digitsAfterDecimal"
                  required
                />
              </mat-form-field>

              <mat-form-field
                appearance="outline"
                [matTooltip]="'HELP.INTEREST_RATE_DESC' | translate"
              >
                <mat-label>{{ 'PRODUCTS.NOMINAL_ANNUAL_INTEREST_RATE' | translate }}</mat-label>
                <input
                  matInput
                  type="number"
                  name="nominalAnnualInterestRate"
                  [(ngModel)]="product.nominalAnnualInterestRate"
                  required
                />
              </mat-form-field>
            </div>

            <div class="form-actions">
              <button mat-button type="button" (click)="onCancel()">
                {{ 'COMMON.CANCEL' | translate }}
              </button>
              <button
                mat-raised-button
                color="primary"
                type="submit"
                [disabled]="productForm.invalid || isSaving"
              >
                {{ isSaving ? ('COMMON.SAVING' | translate) : ('COMMON.SAVE' | translate) }}
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
        max-width: 900px;
        margin: 0 auto;
      }
      .product-form {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }
      .form-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 16px;
      }
      .full-width {
        grid-column: span 2;
      }
      mat-form-field {
        width: 100%;
      }
      .form-actions {
        display: flex;
        justify-content: flex-end;
        gap: 12px;
        margin-top: 16px;
      }
    `,
  ],
})
export class SavingsProductFormComponent implements OnInit {
  private readonly productService = inject(SavingsProductService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  private readonly LIST_PATH = '/products/savings';

  productId: number | null = null;
  isEditMode = false;
  isSaving = false;

  product: PostSavingsProductsRequest = {
    currencyCode: 'USD',
    digitsAfterDecimal: 2,
    interestCompoundingPeriodType: 1,
    interestPostingPeriodType: 4,
    interestCalculationType: 1,
    interestCalculationDaysInYearType: 365,
    accountingRule: 1,
  };

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.productId = +id;
        this.isEditMode = true;
        this.loadProductData();
      }
    });
  }

  loadProductData() {
    if (!this.productId) return;
    this.productService.retrieveOne27(this.productId).subscribe((data) => {
      this.product = {
        name: data.name,
        shortName: data.shortName,
        description: data.description,
        currencyCode: data.currency?.code,
        digitsAfterDecimal: data.currency?.decimalPlaces,
        nominalAnnualInterestRate: data.nominalAnnualInterestRate,
        interestCompoundingPeriodType: 1,
        interestPostingPeriodType: 4,
        interestCalculationType: 1,
        interestCalculationDaysInYearType: 365,
        accountingRule: 1,
      };
    });
  }

  onSubmit() {
    this.isSaving = true;
    this.product.locale = 'en';

    if (this.isEditMode && this.productId) {
      this.productService
        .update22(this.productId, this.product as PutSavingsProductsProductIdRequest)
        .subscribe({
          next: () => this.router.navigate([this.LIST_PATH]),
          error: () => (this.isSaving = false),
        });
    } else {
      this.productService.create13(this.product).subscribe({
        next: () => this.router.navigate([this.LIST_PATH]),
        error: () => (this.isSaving = false),
      });
    }
  }

  onCancel() {
    this.router.navigate([this.LIST_PATH]);
  }
}
