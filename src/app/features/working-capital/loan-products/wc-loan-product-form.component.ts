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
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {
  WorkingCapitalLoanProductsService,
  PostWorkingCapitalLoanProductsRequest,
  StringEnumOptionData,
  CurrencyData,
} from '../../../api';

/**
 * Create / edit form for a working-capital loan product. Covers the core mandatory
 * and common fields; currency / amortization / repayment-frequency options come from
 * the product template endpoint. Mirrors the working-capital breach form.
 */
@Component({
  selector: 'app-wc-loan-product-form',
  standalone: true,
  imports: [
    FormsModule,
    TranslateModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatProgressSpinnerModule,
  ],
  template: `
    <div class="form-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>
            {{
              isEditMode
                ? ('WC_LOAN_PRODUCTS.EDIT' | translate)
                : ('WC_LOAN_PRODUCTS.CREATE' | translate)
            }}
          </mat-card-title>
        </mat-card-header>

        <mat-card-content>
          <form #productForm="ngForm" (ngSubmit)="onSubmit()" class="wc-form">
            <mat-form-field appearance="outline">
              <mat-label>{{ 'WC_LOAN_PRODUCTS.NAME' | translate }}</mat-label>
              <input matInput name="name" [(ngModel)]="product.name" required />
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>{{ 'WC_LOAN_PRODUCTS.SHORT_NAME' | translate }}</mat-label>
              <input matInput name="shortName" [(ngModel)]="product.shortName" required />
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>{{ 'WC_LOAN_PRODUCTS.DESCRIPTION' | translate }}</mat-label>
              <textarea matInput name="description" [(ngModel)]="product.description"></textarea>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>{{ 'WC_LOAN_PRODUCTS.CURRENCY' | translate }}</mat-label>
              <mat-select name="currencyCode" [(ngModel)]="product.currencyCode" required>
                @for (opt of currencyOptions; track opt.code) {
                  <mat-option [value]="opt.code">{{ opt.name }} ({{ opt.code }})</mat-option>
                }
              </mat-select>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>{{ 'WC_LOAN_PRODUCTS.DIGITS_AFTER_DECIMAL' | translate }}</mat-label>
              <input
                matInput
                type="number"
                name="digitsAfterDecimal"
                [(ngModel)]="product.digitsAfterDecimal"
                required
              />
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>{{ 'WC_LOAN_PRODUCTS.IN_MULTIPLES_OF' | translate }}</mat-label>
              <input
                matInput
                type="number"
                name="inMultiplesOf"
                [(ngModel)]="product.inMultiplesOf"
              />
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>{{ 'WC_LOAN_PRODUCTS.PRINCIPAL' | translate }}</mat-label>
              <input
                matInput
                type="number"
                name="principal"
                [(ngModel)]="product.principal"
                required
              />
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>{{ 'WC_LOAN_PRODUCTS.PERIOD_PAYMENT_RATE' | translate }}</mat-label>
              <input
                matInput
                type="number"
                name="periodPaymentRate"
                [(ngModel)]="product.periodPaymentRate"
                required
              />
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>{{ 'WC_LOAN_PRODUCTS.REPAYMENT_EVERY' | translate }}</mat-label>
              <input
                matInput
                type="number"
                name="repaymentEvery"
                [(ngModel)]="product.repaymentEvery"
                required
              />
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>{{ 'WC_LOAN_PRODUCTS.REPAYMENT_FREQUENCY' | translate }}</mat-label>
              <mat-select
                name="repaymentFrequencyType"
                [(ngModel)]="product.repaymentFrequencyType"
                required
              >
                @for (opt of repaymentFrequencyTypeOptions; track opt.id) {
                  <mat-option [value]="opt.code">{{ opt.value }}</mat-option>
                }
              </mat-select>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>{{ 'WC_LOAN_PRODUCTS.AMORTIZATION_TYPE' | translate }}</mat-label>
              <mat-select name="amortizationType" [(ngModel)]="product.amortizationType" required>
                @for (opt of amortizationTypeOptions; track opt.id) {
                  <mat-option [value]="opt.code">{{ opt.value }}</mat-option>
                }
              </mat-select>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>{{ 'WC_LOAN_PRODUCTS.NPV_DAY_COUNT' | translate }}</mat-label>
              <input
                matInput
                type="number"
                name="npvDayCount"
                [(ngModel)]="product.npvDayCount"
                required
              />
            </mat-form-field>

            <div class="form-actions">
              <button mat-button type="button" (click)="onCancel()" [disabled]="isSaving">
                {{ 'COMMON.CANCEL' | translate }}
              </button>
              <button
                mat-raised-button
                color="primary"
                type="submit"
                [disabled]="productForm.invalid || isSaving"
              >
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
      .wc-form {
        display: flex;
        flex-direction: column;
        gap: 16px;
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
export class WcLoanProductFormComponent implements OnInit {
  private readonly productService = inject(WorkingCapitalLoanProductsService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  private readonly LIST_PATH = '/working-capital/loan-products';

  productId: number | null = null;
  isEditMode = false;
  isSaving = false;

  product: Partial<PostWorkingCapitalLoanProductsRequest> = {};
  currencyOptions: CurrencyData[] = [];
  amortizationTypeOptions: StringEnumOptionData[] = [];
  repaymentFrequencyTypeOptions: StringEnumOptionData[] = [];

  ngOnInit(): void {
    this.productService.getWorkingCapitalLoanProductsTemplate().subscribe((tpl) => {
      this.currencyOptions = tpl.currencyOptions ?? [];
      this.amortizationTypeOptions = tpl.amortizationTypeOptions ?? [];
      this.repaymentFrequencyTypeOptions = tpl.periodFrequencyTypeOptions ?? [];
    });

    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.productId = +id;
        this.isEditMode = true;
        this.load();
      }
    });
  }

  load(): void {
    if (!this.productId) return;
    this.productService.getWorkingCapitalLoanProductsProductId(this.productId).subscribe((data) => {
      this.product = {
        name: data.name,
        shortName: data.shortName,
        description: data.description,
        currencyCode: data.currency?.code,
        digitsAfterDecimal: data.currency?.decimalPlaces,
        inMultiplesOf: data.currency?.inMultiplesOf,
        principal: data.principal,
        periodPaymentRate: data.periodPaymentRate,
        repaymentEvery: data.repaymentEvery,
        repaymentFrequencyType: data.repaymentFrequencyType
          ?.code as PostWorkingCapitalLoanProductsRequest.RepaymentFrequencyTypeEnum,
        amortizationType: data.amortizationType
          ?.code as PostWorkingCapitalLoanProductsRequest.AmortizationTypeEnum,
        npvDayCount: data.npvDayCount,
      };
    });
  }

  onSubmit(): void {
    this.isSaving = true;
    const payload: PostWorkingCapitalLoanProductsRequest = {
      ...this.product,
      locale: 'en',
      dateFormat: 'dd MMMM yyyy',
    };

    const request$ =
      this.isEditMode && this.productId
        ? this.productService.putWorkingCapitalLoanProductsProductId(this.productId, payload)
        : this.productService.postWorkingCapitalLoanProducts(payload);

    request$.subscribe({
      next: () => this.router.navigate([this.LIST_PATH]),
      error: () => (this.isSaving = false),
    });
  }

  onCancel(): void {
    this.router.navigate([this.LIST_PATH]);
  }
}
