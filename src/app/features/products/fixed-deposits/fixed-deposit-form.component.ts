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
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ClientSearchComponent } from '../../../shared/components/client-search/client-search.component';
import {
  FixedDepositAccountService,
  GetFixedDepositAccountsTemplateResponse,
  GetFixedDepositAccountsAccountIdResponse,
  GetFixedDepositAccountsProductOptions,
} from '../../../api';

/**
 * Component for creating and managing individual fixed deposit accounts.
 *
 * Provides a comprehensive form integration with Fineract's term deposit API.
 * Uses template-driven binding to strictly-typed OpenAPI request models.
 */
@Component({
  selector: 'app-fixed-deposit-form',
  standalone: true,
  imports: [
    FormsModule,
    TranslateModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTooltipModule,
    MatIconModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    ClientSearchComponent,
  ],
  template: `
    <div class="form-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>
            {{
              isEditMode
                ? ('FIXED_DEPOSITS.EDIT' | translate)
                : ('FIXED_DEPOSITS.CREATE' | translate)
            }}
          </mat-card-title>
        </mat-card-header>

        <mat-card-content>
          <form #accountForm="ngForm" (ngSubmit)="onSubmit()" class="fixed-deposit-form">
            <div class="form-grid">
              <!-- Client Search -->
              <app-client-search
                [label]="'COMMON.CLIENT' | translate"
                [required]="true"
                [initialClientId]="account.clientId || null"
                (clientSelected)="onClientSelected($event)"
              >
              </app-client-search>

              <!-- Product -->
              <mat-form-field
                appearance="outline"
                [matTooltip]="'HELP.FIXED_DEPOSIT_PRODUCT_DESC' | translate"
              >
                <mat-label>{{ 'COMMON.PRODUCT' | translate }}</mat-label>
                <mat-select
                  name="productId"
                  [(ngModel)]="account.productId"
                  required
                  [disabled]="isEditMode"
                >
                  @for (product of products; track product.id) {
                    <mat-option [value]="product.id">{{ product.name }}</mat-option>
                  }
                  <mat-divider></mat-divider>
                  <mat-option (click)="onCreateProduct()">
                    <mat-icon color="primary" style="margin-right: 8px;">add_circle</mat-icon>
                    <span>{{ 'PRODUCTS.CREATE_NEW_PRODUCT' | translate }}</span>
                  </mat-option>
                </mat-select>
              </mat-form-field>

              <!-- Deposit Amount -->
              <mat-form-field
                appearance="outline"
                [matTooltip]="'HELP.DEPOSIT_AMOUNT_DESC' | translate"
              >
                <mat-label>{{ 'COMMON.AMOUNT' | translate }}</mat-label>
                <input
                  matInput
                  type="number"
                  name="depositAmount"
                  [(ngModel)]="account.depositAmount"
                  required
                />
              </mat-form-field>

              <!-- Submitted On -->
              <mat-form-field
                appearance="outline"
                [matTooltip]="'HELP.SUBMITTED_ON_DESC' | translate"
              >
                <mat-label>{{ 'COMMON.SUBMITTED_ON' | translate }}</mat-label>
                <input
                  matInput
                  [matDatepicker]="picker"
                  name="submittedOnDate"
                  [(ngModel)]="submittedOnDate"
                  required
                />
                <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
                <mat-datepicker #picker></mat-datepicker>
              </mat-form-field>

              <!-- Deposit Period -->
              <mat-form-field
                appearance="outline"
                [matTooltip]="'HELP.DEPOSIT_PERIOD_DESC' | translate"
              >
                <mat-label>{{ 'COMMON.PERIOD' | translate }}</mat-label>
                <input
                  matInput
                  type="number"
                  name="depositPeriod"
                  [(ngModel)]="account.depositPeriod"
                  required
                />
              </mat-form-field>

              <!-- Period Frequency -->
              <mat-form-field
                appearance="outline"
                [matTooltip]="'HELP.PERIOD_FREQUENCY_DESC' | translate"
              >
                <mat-label>{{ 'COMMON.FREQUENCY' | translate }}</mat-label>
                <mat-select
                  name="depositPeriodFrequencyId"
                  [(ngModel)]="account.depositPeriodFrequencyId"
                  required
                >
                  <mat-option [value]="0">{{ 'COMMON.DAYS' | translate }}</mat-option>
                  <mat-option [value]="1">{{ 'COMMON.WEEKS' | translate }}</mat-option>
                  <mat-option [value]="2">{{ 'COMMON.MONTHS' | translate }}</mat-option>
                  <mat-option [value]="3">{{ 'COMMON.YEARS' | translate }}</mat-option>
                </mat-select>
              </mat-form-field>
            </div>

            <div class="form-actions">
              <button mat-button type="button" (click)="onCancel()" [disabled]="isSaving">
                {{ 'COMMON.CANCEL' | translate }}
              </button>
              <button
                mat-raised-button
                color="primary"
                type="submit"
                [disabled]="accountForm.invalid || isSaving"
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
        max-width: 900px;
        margin: 0 auto;
      }
      .fixed-deposit-form {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }
      .form-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
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
export class FixedDepositAccountFormComponent implements OnInit {
  /** Service for term deposit operations */
  private readonly fixedDepositService = inject(FixedDepositAccountService);
  /** Router for post-op navigation */
  private readonly router = inject(Router);
  /** Activated route for editing */
  private readonly route = inject(ActivatedRoute);

  /** Date format constant for Fineract */
  private readonly DATE_FORMAT = 'yyyy-MM-dd';
  /** Path for redirection */
  private readonly LIST_PATH = '/products/fixed-deposits';

  /** Account identifier */
  accountId: number | null = null;
  /** Edit mode flag */
  isEditMode = false;
  /** Save state */
  isSaving = false;

  /** Post request model */
  account: any = {
    depositPeriodFrequencyId: 2, // Default to Months
  };
  /** Submitted date for template binding */
  submittedOnDate: Date = new Date();
  /** Available products list */
  products: GetFixedDepositAccountsProductOptions[] = [];

  /**
   * Component initialization.
   */
  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const clientId = params['clientId'];
      if (clientId) {
        this.account.clientId = +clientId;
        this.loadProducts(this.account.clientId);
      } else {
        this.loadProducts();
      }
    });

    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.accountId = +id;
        this.isEditMode = true;
        this.loadAccountData();
      }
    });
  }

  /**
   * Fetches the list of eligible fixed deposit products for the client.
   */
  private loadProducts(clientId?: number): void {
    this.fixedDepositService.template12(clientId).subscribe({
      next: (template: GetFixedDepositAccountsTemplateResponse) => {
        if (template && template.productOptions) {
          // Explicitly convert from Set or Array to ensure dropdown rendering
          this.products = Array.from(template.productOptions);
        } else {
          this.products = [];
        }
      },
      error: (err: unknown) => {
        console.error('Failed to load eligible products', err);
        this.products = [];
      },
    });
  }

  onClientSelected(clientId: number): void {
    this.account.clientId = clientId;
    this.loadProducts(clientId);
  }

  onCreateProduct(): void {
    this.router.navigate(['/products/fixed/create']);
  }

  /**
   * Loads existing account data for editing.
   */
  private loadAccountData(): void {
    if (!this.accountId) return;
    this.fixedDepositService.retrieveOne19(this.accountId).subscribe({
      next: (data: GetFixedDepositAccountsAccountIdResponse) => {
        const dateArray = data.timeline?.submittedOnDate as unknown as number[];
        if (dateArray) {
          this.submittedOnDate = new Date(dateArray[0], dateArray[1] - 1, dateArray[2]);
        }
        this.account = {
          clientId: data.clientId,
          productId: data.savingsProductId,
          depositAmount: data.depositAmount,
          depositPeriod: data.depositPeriod,
          depositPeriodFrequencyId: data.depositPeriodFrequency?.id,
        };
      },
      error: (err: unknown) => console.error('Failed to load account', err),
    });
  }

  /**
   * Handles form submission.
   */
  onSubmit(): void {
    this.isSaving = true;

    const formattedDate = `${this.submittedOnDate.getFullYear()}-${String(
      this.submittedOnDate.getMonth() + 1,
    ).padStart(2, '0')}-${String(this.submittedOnDate.getDate()).padStart(2, '0')}`;

    this.account.submittedOnDate = formattedDate;
    this.account.dateFormat = this.DATE_FORMAT;
    this.account.locale = 'en';

    if (this.isEditMode && this.accountId) {
      const payload: Record<string, unknown> = {
        depositAmount: this.account.depositAmount,
        depositPeriod: this.account.depositPeriod,
        depositPeriodFrequencyId: this.account.depositPeriodFrequencyId,
        locale: 'en',
        dateFormat: this.DATE_FORMAT,
      };
      this.fixedDepositService.update16(this.accountId, payload as any).subscribe({
        next: () => this.router.navigate([this.LIST_PATH]),
        error: () => (this.isSaving = false),
      });
    } else {
      this.fixedDepositService.submitApplication(this.account).subscribe({
        next: () => this.router.navigate([this.LIST_PATH]),
        error: () => (this.isSaving = false),
      });
    }
  }

  /**
   * Handles user cancellation.
   */
  onCancel(): void {
    this.router.navigate([this.LIST_PATH]);
  }
}
