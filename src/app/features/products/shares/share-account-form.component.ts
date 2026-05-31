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
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ClientSearchComponent } from '../../../shared';
import {
  ShareAccountService,
  AccountRequest,
  PutAccountsTypeAccountIdRequest,
  GetAccountsTypeAccountIdResponse,
  GetAccountsTypeProductOptions,
  SavingsAccountData,
} from '../../../api';

interface ShareAccountTemplateResponse {
  productOptions?: Set<GetAccountsTypeProductOptions>;
  clientSavingsAccounts?: SavingsAccountData[];
}

/**
 * Component for creating and managing share accounts.
 *
 * Integrates with Fineract's ShareAccountService using template-driven forms.
 */
@Component({
  selector: 'app-share-account-form',
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
                ? ('SHARE_ACCOUNTS.EDIT' | translate)
                : ('SHARE_ACCOUNTS.CREATE' | translate)
            }}
          </mat-card-title>
        </mat-card-header>

        <mat-card-content>
          <form #shareForm="ngForm" (ngSubmit)="onSubmit()" class="share-account-form">
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
                [matTooltip]="'HELP.SHARE_PRODUCT_DESC' | translate"
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

              <!-- Requested Shares -->
              <mat-form-field
                appearance="outline"
                [matTooltip]="'HELP.REQUESTED_SHARES_DESC' | translate"
              >
                <mat-label>{{ 'SHARE_ACCOUNTS.REQUESTED_SHARES' | translate }}</mat-label>
                <input
                  matInput
                  type="number"
                  name="requestedShares"
                  [(ngModel)]="account.requestedShares"
                  required
                />
              </mat-form-field>

              <!-- Application Date -->
              <mat-form-field
                appearance="outline"
                [matTooltip]="'HELP.APPLICATION_DATE_DESC' | translate"
              >
                <mat-label>{{ 'SHARE_ACCOUNTS.APPLICATION_DATE' | translate }}</mat-label>
                <input
                  matInput
                  [matDatepicker]="picker"
                  name="applicationDate"
                  [(ngModel)]="applicationDate"
                  required
                />
                <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
                <mat-datepicker #picker></mat-datepicker>
              </mat-form-field>

              <!-- Savings Account ID (Optional but recommended) -->
              <mat-form-field
                appearance="outline"
                [matTooltip]="'HELP.SAVINGS_ACCOUNT_ID_DESC' | translate"
              >
                <mat-label>{{ 'SHARE_ACCOUNTS.SAVINGS_ACCOUNT_ID' | translate }}</mat-label>
                <mat-select name="savingsAccountId" [(ngModel)]="account.savingsAccountId">
                  <div
                    class="select-search-container"
                    (click)="$event.stopPropagation()"
                    (keydown)="$event.stopPropagation()"
                    tabindex="-1"
                  >
                    <input
                      matInput
                      placeholder="Search accounts..."
                      (input)="onSavingsSearch($event)"
                      class="select-search-input"
                    />
                  </div>
                  <mat-option [value]="null">-- None --</mat-option>
                  @for (sa of filteredSavingsAccounts; track sa.id) {
                    <mat-option [value]="sa.id">
                      {{ sa.accountNo }} - {{ sa.savingsProductName }}
                    </mat-option>
                  }
                  @if (filteredSavingsAccounts.length === 0) {
                    <mat-option disabled>No savings accounts found</mat-option>
                  }
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
                [disabled]="shareForm.invalid || isSaving"
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
      .share-account-form {
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
      .select-search-container {
        padding: 8px 16px;
        position: sticky;
        top: 0;
        background: white;
        z-index: 1;
        border-bottom: 1px solid #ccc;
      }
      .select-search-input {
        width: 100%;
        padding: 8px;
        box-sizing: border-box;
        border: 1px solid #ccc;
        border-radius: 4px;
        outline: none;
      }
    `,
  ],
})
export class ShareAccountFormComponent implements OnInit {
  /** Service for share account operations */
  private readonly shareService = inject(ShareAccountService);
  /** Router for post-op navigation */
  private readonly router = inject(Router);
  /** Activated route for editing */
  private readonly route = inject(ActivatedRoute);

  /** Date format constant for Fineract */
  private readonly DATE_FORMAT = 'yyyy-MM-dd';
  /** Base path for redirection */
  private readonly LIST_PATH = '/products/shares';

  /** Account identifier */
  accountId: number | null = null;
  /** Edit mode flag */
  isEditMode = false;
  /** Save state */
  isSaving = false;

  /** Request model */
  account: AccountRequest = {};
  /** Application date for template binding */
  applicationDate: Date = new Date();
  /** Available products list */
  products: GetAccountsTypeProductOptions[] = [];
  /** Available savings accounts list */
  savingsAccounts: SavingsAccountData[] = [];
  /** Filtered savings accounts list for search */
  filteredSavingsAccounts: SavingsAccountData[] = [];
  /** Search term for savings accounts */
  savingsSearchVal = '';

  /**
   * Component initialization.
   */
  ngOnInit(): void {
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
   * Handles client selection and updates available products.
   */
  onClientSelected(clientId: number): void {
    this.account.clientId = clientId;
    this.loadProducts(clientId);
  }

  /**
   * Handles filtering of savings accounts.
   */
  onSavingsSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.savingsSearchVal = input.value.toLowerCase();
    this.filteredSavingsAccounts = this.savingsAccounts.filter(
      (sa) =>
        sa.accountNo?.toLowerCase().includes(this.savingsSearchVal) ||
        sa.savingsProductName?.toLowerCase().includes(this.savingsSearchVal),
    );
  }

  /**
   * Fetches the list of share products.
   */
  private loadProducts(clientId?: number): void {
    if (!clientId) {
      this.products = [];
      this.savingsAccounts = [];
      this.filteredSavingsAccounts = [];
      return;
    }
    this.shareService.template7('share', clientId).subscribe({
      next: (template: ShareAccountTemplateResponse) => {
        this.products = Array.from(template.productOptions || []);
        this.savingsAccounts = Array.from(template.clientSavingsAccounts || []);
        this.filteredSavingsAccounts = this.savingsAccounts;
      },
      error: (err: unknown) => console.error('Failed to load products', err),
    });
  }

  /**
   * Loads existing account data for editing.
   */
  private loadAccountData(): void {
    if (!this.accountId) return;
    this.shareService.retrieveAccount(this.accountId, 'share').subscribe({
      next: (data: GetAccountsTypeAccountIdResponse) => {
        const dateArray = data.timeline?.submittedOnDate as unknown as number[];
        if (dateArray) {
          this.applicationDate = new Date(dateArray[0], dateArray[1] - 1, dateArray[2]);
        }
        this.account = {
          clientId: data.clientId,
          productId: data.productId,
          requestedShares: data.summary?.totalApprovedShares,
          savingsAccountId: data.savingsAccountId,
        };
        if (data.clientId) {
          this.loadProducts(data.clientId);
        }
      },
      error: (err: unknown) => console.error('Failed to load account', err),
    });
  }

  /**
   * Handles form submission.
   */
  onSubmit(): void {
    this.isSaving = true;

    const formattedDate = `${this.applicationDate.getFullYear()}-${String(
      this.applicationDate.getMonth() + 1,
    ).padStart(2, '0')}-${String(this.applicationDate.getDate()).padStart(2, '0')}`;

    this.account.applicationDate = formattedDate;
    this.account.dateFormat = this.DATE_FORMAT;
    this.account.locale = 'en';
    this.account.submittedDate = formattedDate; // Often required by Fineract

    if (this.isEditMode && this.accountId) {
      const payload: PutAccountsTypeAccountIdRequest = {
        applicationDate: formattedDate,
        requestedShares: this.account.requestedShares,
        dateFormat: this.DATE_FORMAT,
        locale: 'en',
      };

      this.shareService.updateAccount('share', this.accountId, payload).subscribe({
        next: () => this.router.navigate([this.LIST_PATH]),
        error: () => (this.isSaving = false),
      });
    } else {
      this.shareService.createAccount('share', this.account).subscribe({
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
