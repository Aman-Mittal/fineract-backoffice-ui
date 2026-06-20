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
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ClientSearchComponent, HelpIconComponent } from '../../../shared';
import {
  ShareAccountService,
  AccountRequest,
  PutAccountsTypeAccountIdRequest,
  GetAccountsTypeAccountIdResponse,
  GetAccountsTypeProductOptions,
  SavingsAccountData,
} from '../../../api';
import {
  formatDateToFineract,
  FINERACT_DATE_FORMAT,
  FINERACT_LOCALE,
} from '../../../core/utils/date-formatter';

interface ShareAccountTemplateResponse {
  productOptions?: Set<GetAccountsTypeProductOptions>;
  clientSavingsAccounts?: SavingsAccountData[];
}

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
    MatIconModule,
    MatProgressSpinnerModule,
    ClientSearchComponent,
    HelpIconComponent,
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
            <app-help-icon [helpTextKey]="'HELP.SHARE_ACCOUNTS_DESC'"></app-help-icon>
          </mat-card-title>
        </mat-card-header>

        <mat-card-content>
          @if (!isEditMode) {
            <div class="info-banner">
              <mat-icon class="info-banner-icon">info_outline</mat-icon>
              <div class="info-banner-content">
                <strong>{{ 'SHARE_ACCOUNTS.PREREQUISITES_TITLE' | translate }}</strong>
                <ol class="prereq-list">
                  <li>{{ 'SHARE_ACCOUNTS.PREREQ_CLIENT' | translate }}</li>
                  <li>{{ 'SHARE_ACCOUNTS.PREREQ_SAVINGS' | translate }}</li>
                  <li>{{ 'SHARE_ACCOUNTS.PREREQ_PRODUCT' | translate }}</li>
                </ol>
              </div>
            </div>
          }

          <form #shareForm="ngForm" (ngSubmit)="onSubmit()" class="share-account-form">
            <div class="form-grid">
              <!-- Client Search with Create Option -->
              <div class="field-container-row">
                <app-client-search
                  [label]="'COMMON.CLIENT' | translate"
                  [required]="true"
                  [initialClientId]="account.clientId || null"
                  (clientSelected)="onClientSelected($event)"
                  class="flex-grow"
                >
                </app-client-search>
                <button
                  mat-icon-button
                  type="button"
                  [matTooltip]="'CLIENTS.CREATE_CLIENT' | translate"
                  (click)="onCreateClient()"
                  style="margin-top: 4px;"
                >
                  <mat-icon color="primary">add_circle_outline</mat-icon>
                </button>
              </div>

              <!-- Product with Create Option -->
              <div class="field-container-row">
                <mat-form-field
                  appearance="outline"
                  [matTooltip]="'HELP.SHARE_PRODUCT_DESC' | translate"
                  class="flex-grow"
                >
                  <mat-label>{{ 'COMMON.PRODUCT' | translate }}</mat-label>
                  <mat-select
                    name="productId"
                    [(ngModel)]="account.productId"
                    (selectionChange)="onProductSelected($event.value)"
                    required
                    [disabled]="isEditMode"
                  >
                    @for (product of products; track product.id) {
                      <mat-option [value]="product.id">{{ product.name }}</mat-option>
                    }
                  </mat-select>
                </mat-form-field>
                <button
                  mat-icon-button
                  type="button"
                  [matTooltip]="'PRODUCTS.CREATE_SHARE_PRODUCT' | translate"
                  (click)="onCreateProduct()"
                  style="margin-top: 4px;"
                  [disabled]="isEditMode"
                >
                  <mat-icon color="primary">add_circle_outline</mat-icon>
                </button>
              </div>

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
                <mat-select
                  name="savingsAccountId"
                  [(ngModel)]="account.savingsAccountId"
                  [disabled]="!account.clientId"
                >
                  <mat-select-trigger>
                    {{ getSelectedSavingsAccountLabel() }}
                  </mat-select-trigger>
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
                  @if (filteredSavingsAccounts.length === 0 && savingsAccounts.length === 0) {
                    <mat-option disabled>
                      {{ 'SHARE_ACCOUNTS.NO_SAVINGS_HINT' | translate }}
                    </mat-option>
                  }
                  @if (filteredSavingsAccounts.length === 0 && savingsAccounts.length > 0) {
                    <mat-option disabled>
                      {{ 'COMMON.NO_DATA' | translate }}
                    </mat-option>
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
      .field-container-row {
        display: flex;
        align-items: flex-start;
        gap: 8px;
      }
      .flex-grow {
        flex-grow: 1;
      }
      .info-banner {
        display: flex;
        align-items: flex-start;
        gap: 12px;
        padding: 16px;
        margin-bottom: 20px;
        border-radius: 8px;
        background: linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%);
        border-left: 4px solid #1976d2;
      }
      .info-banner-icon {
        color: #1976d2;
        margin-top: 2px;
      }
      .info-banner-content {
        font-size: 13px;
        color: #37474f;
        line-height: 1.6;
      }
      .info-banner-content strong {
        font-size: 14px;
        color: #1a237e;
      }
      .prereq-list {
        margin: 6px 0 0 0;
        padding-left: 20px;
      }
      .prereq-list li {
        margin-bottom: 2px;
      }
    `,
  ],
})
export class ShareAccountFormComponent implements OnInit {
  private readonly shareService = inject(ShareAccountService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  private readonly LIST_PATH = '/products/shares';

  accountId: number | null = null;
  isEditMode = false;
  isSaving = false;

  account: AccountRequest = {};
  applicationDate: Date = new Date();
  products: GetAccountsTypeProductOptions[] = [];
  savingsAccounts: SavingsAccountData[] = [];
  filteredSavingsAccounts: SavingsAccountData[] = [];
  savingsSearchVal = '';

  ngOnInit(): void {
    // Check for clientId in query params for pre-population
    this.route.queryParams.subscribe((queryParams) => {
      const clientId = queryParams['clientId'];
      if (clientId && !this.isEditMode) {
        const idNum = +clientId;
        this.account.clientId = idNum;
        this.loadProducts(idNum);
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

  onClientSelected(clientId: number): void {
    this.account.clientId = clientId;
    this.account.productId = undefined;
    this.account.savingsAccountId = undefined;
    this.products = [];
    this.savingsAccounts = [];
    this.filteredSavingsAccounts = [];
    this.loadProducts(clientId);
  }

  onProductSelected(productId: number): void {
    this.account.productId = productId;
    this.account.savingsAccountId = undefined;
    if (this.account.clientId) {
      this.loadProducts(this.account.clientId, productId);
    }
  }

  onSavingsSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.savingsSearchVal = input.value.toLowerCase();
    this.filteredSavingsAccounts = this.savingsAccounts.filter(
      (sa) =>
        sa.accountNo?.toLowerCase().includes(this.savingsSearchVal) ||
        sa.savingsProductName?.toLowerCase().includes(this.savingsSearchVal),
    );
  }

  getSelectedSavingsAccountLabel(): string {
    const selectedId = this.account.savingsAccountId;
    if (!selectedId) return '';
    const sa = this.savingsAccounts.find((a) => a.id === selectedId);
    return sa ? `${sa.accountNo} - ${sa.savingsProductName}` : '';
  }

  onCreateClient() {
    this.router.navigate(['/clients/create']);
  }

  onCreateProduct() {
    this.router.navigate(['/products/share/create']);
  }

  private loadProducts(clientId?: number, productId?: number): void {
    if (!clientId) {
      this.products = [];
      this.savingsAccounts = [];
      this.filteredSavingsAccounts = [];
      return;
    }
    this.shareService.getAccountsTypeTemplate('share', clientId, productId).subscribe({
      next: (template: ShareAccountTemplateResponse) => {
        if (template.productOptions) {
          this.products = Array.from(template.productOptions);
        }
        this.savingsAccounts = Array.from(template.clientSavingsAccounts || []);
        this.filteredSavingsAccounts = this.savingsAccounts;
      },
      error: (err: unknown) => console.error('Failed to load products', err),
    });
  }

  private loadAccountData(): void {
    if (!this.accountId) return;
    this.shareService.getAccountsTypeAccountId(this.accountId, 'share').subscribe({
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
          this.loadProducts(data.clientId, data.productId);
        }
      },
      error: (err: unknown) => console.error('Failed to load account', err),
    });
  }

  onSubmit(): void {
    this.isSaving = true;

    const formattedDate = formatDateToFineract(this.applicationDate);

    this.account.applicationDate = formattedDate;
    this.account.dateFormat = FINERACT_DATE_FORMAT;
    this.account.locale = FINERACT_LOCALE;
    this.account.submittedDate = formattedDate; // Often required by Fineract

    if (this.isEditMode && this.accountId) {
      const payload: PutAccountsTypeAccountIdRequest & { savingsAccountId?: number } = {
        applicationDate: formattedDate,
        requestedShares: this.account.requestedShares,
        dateFormat: FINERACT_DATE_FORMAT,
        locale: FINERACT_LOCALE,
        savingsAccountId: this.account.savingsAccountId,
      };

      this.shareService.putAccountsTypeAccountId('share', this.accountId, payload).subscribe({
        next: () => this.router.navigate([this.LIST_PATH]),
        error: () => (this.isSaving = false),
      });
    } else {
      this.shareService.postAccountsType('share', this.account).subscribe({
        next: () => this.router.navigate([this.LIST_PATH]),
        error: () => (this.isSaving = false),
      });
    }
  }

  onCancel(): void {
    this.router.navigate([this.LIST_PATH]);
  }
}
