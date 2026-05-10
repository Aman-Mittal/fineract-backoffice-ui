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
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ClientSearchComponent } from '../../shared';
import {
  SavingsAccountService,
  SavingsProductService,
  PostSavingsAccountsRequest,
  GetSavingsProductsResponse,
  SavingsAccountData,
} from '../../api';

/**
 * Component for creating and managing individual savings accounts.
 *
 * Provides a comprehensive form integration with Fineract's savings account API.
 * Uses template-driven binding to strictly-typed OpenAPI request models.
 *
 * @example
 * <app-savings-account-form></app-savings-account-form>
 */
@Component({
  selector: 'app-savings-account-form',
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
    MatDatepickerModule,
    MatNativeDateModule,
    MatTooltipModule,
    ClientSearchComponent,
  ],
  template: `
    <div class="form-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>
            {{
              isEditMode
                ? ('SAVINGS.EDIT_ACCOUNT' | translate)
                : ('SAVINGS.CREATE_ACCOUNT' | translate)
            }}
          </mat-card-title>
        </mat-card-header>

        <mat-card-content>
          <form #accountForm="ngForm" (ngSubmit)="onSubmit()" class="savings-form">
            <div class="form-grid">
              <!-- Client Search -->
              <app-client-search
                [label]="'COMMON.CLIENT_ID' | translate"
                [required]="true"
                [initialClientId]="account.clientId || null"
                (clientSelected)="account.clientId = $event"
              >
              </app-client-search>

              <!-- Product -->
              <mat-form-field
                appearance="outline"
                [matTooltip]="'HELP.SAVINGS_PRODUCT_DESC' | translate"
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
                </mat-select>
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

              <!-- Nominal Annual Interest Rate -->
              <mat-form-field
                appearance="outline"
                [matTooltip]="'HELP.INTEREST_RATE_DESC' | translate"
              >
                <mat-label>{{ 'COMMON.INTEREST_RATE' | translate }}</mat-label>
                <input
                  matInput
                  type="number"
                  name="nominalAnnualInterestRate"
                  [(ngModel)]="interestRate"
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
                [disabled]="accountForm.invalid || isSaving"
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
      .savings-form {
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
export class SavingsAccountFormComponent implements OnInit {
  /** Service for account operations */
  private readonly savingsService = inject(SavingsAccountService);
  /** Service for retrieving available products */
  private readonly productService = inject(SavingsProductService);
  /** Router for post-op navigation */
  private readonly router = inject(Router);
  /** Activated route for editing */
  private readonly route = inject(ActivatedRoute);

  /** Base path for redirection */
  private readonly LIST_PATH = '/products/savings-accounts';

  /** Account identifier */
  accountId: number | null = null;
  /** Edit mode flag */
  isEditMode = false;
  /** Save state */
  isSaving = false;

  /** Post request model */
  account: PostSavingsAccountsRequest = {};
  /** Interest rate bound separately as it's missing from model */
  interestRate = 0;
  /** Submitted date for template binding */
  submittedOnDate: Date = new Date();
  /** Available products list */
  products: GetSavingsProductsResponse[] = [];

  /**
   * Initialization handler.
   */
  ngOnInit(): void {
    this.loadProducts();
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
   * Fetches the savings products list using current API method.
   */
  private loadProducts(): void {
    this.productService.retrieveAll34().subscribe({
      next: (data: GetSavingsProductsResponse[]) => {
        this.products = data;
      },
      error: (err: unknown) => console.error('Failed to load products', err),
    });
  }

  /**
   * Loads existing account data for editing using current API method.
   */
  private loadAccountData(): void {
    if (!this.accountId) return;
    this.savingsService.retrieveOne25(this.accountId).subscribe({
      next: (data: SavingsAccountData) => {
        const dateArray = data.timeline?.submittedOnDate as unknown as number[];
        if (dateArray) {
          this.submittedOnDate = new Date(dateArray[0], dateArray[1] - 1, dateArray[2]);
        }
        this.account = {
          clientId: data.clientId,
          productId: data.savingsProductId,
        };
        this.interestRate = data.nominalAnnualInterestRate || 0;
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
    this.account.dateFormat = 'yyyy-MM-dd';
    this.account.locale = 'en';

    // Cast to Record to add missing properties to the payload
    const payload: Record<string, unknown> = {
      ...this.account,
      nominalAnnualInterestRate: this.interestRate,
    };

    if (this.isEditMode && this.accountId) {
      this.savingsService.update20(this.accountId, payload as Record<string, unknown>).subscribe({
        next: () => this.router.navigate([this.LIST_PATH]),
        error: () => (this.isSaving = false),
      });
    } else {
      this.savingsService.submitApplication2(payload as PostSavingsAccountsRequest).subscribe({
        next: () => this.router.navigate([this.LIST_PATH]),
        error: () => (this.isSaving = false),
      });
    }
  }

  /**
   * Navigation handler.
   */
  onCancel(): void {
    this.router.navigate([this.LIST_PATH]);
  }
}
