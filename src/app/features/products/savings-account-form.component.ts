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
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ClientSearchComponent } from '../../shared/components/client-search/client-search.component';
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonSelect,
  IonSelectOption,
  IonSpinner,
} from '@ionic/angular/standalone';
import {
  SavingsAccountService,
  SavingsProductService,
  PostSavingsAccountsRequest,
  GetSavingsProductsResponse,
  SavingsAccountData,
} from '../../api';
import {
  formatDateToFineract,
  FINERACT_DATE_FORMAT,
  FINERACT_LOCALE,
} from '../../core/utils/date-formatter';

@Component({
  selector: 'app-savings-account-form',
  standalone: true,
  imports: [
    FormsModule,
    TranslateModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSnackBarModule,
    ClientSearchComponent,
    IonIcon,
    IonButton,
    IonSpinner,
    IonInput,
    IonItem,
    IonLabel,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonCard,
    IonSelectOption,
    IonSelect,
  ],
  template: `
    <div class="form-container">
      <ion-card>
        <ion-card-header>
          <ion-card-title>
            {{
              isEditMode
                ? ('SAVINGS.EDIT_ACCOUNT' | translate)
                : ('SAVINGS.CREATE_ACCOUNT' | translate)
            }}
          </ion-card-title>
        </ion-card-header>

        <ion-card-content>
          <form #accountForm="ngForm" (ngSubmit)="onSubmit()" class="savings-form">
            <div class="form-grid">
              <!-- Client Search with Create Option -->
              <div class="field-container-row">
                <app-client-search
                  [label]="'COMMON.CLIENT_ID' | translate"
                  [required]="true"
                  [initialClientId]="account.clientId || null"
                  (clientSelected)="account.clientId = $event"
                  class="flex-grow"
                >
                </app-client-search>
                <ion-button
                  fill="clear"
                  type="button"
                  [attr.title]="'CLIENTS.CREATE_CLIENT' | translate"
                  (click)="onCreateClient()"
                  style="margin-top: 4px;"
                >
                  <ion-icon color="primary" name="add-circle-outline"></ion-icon>
                </ion-button>
              </div>

              <!-- Product Selection with Create Option -->
              <div class="field-container-row">
                <ion-item
                  fill="outline"
                  [attr.title]="'HELP.SAVINGS_PRODUCT_DESC' | translate"
                  class="flex-grow"
                >
                  <ion-label position="stacked">{{ 'COMMON.PRODUCT' | translate }}</ion-label>
                  <ion-select
                    name="productId"
                    [(ngModel)]="account.productId"
                    required
                    [disabled]="isEditMode"
                  >
                    @for (product of products; track product.id) {
                      <ion-select-option [value]="product.id">{{ product.name }}</ion-select-option>
                    }
                  </ion-select>
                </ion-item>
                <ion-button
                  fill="clear"
                  type="button"
                  [attr.title]="'PRODUCTS.CREATE_SAVINGS_PRODUCT' | translate"
                  (click)="onCreateProduct()"
                  style="margin-top: 4px;"
                  [disabled]="isEditMode"
                >
                  <ion-icon color="primary" name="add-circle-outline"></ion-icon>
                </ion-button>
              </div>

              <!-- Submitted On -->
              <mat-form-field
                appearance="outline"
                [attr.title]="'HELP.SUBMITTED_ON_DESC' | translate"
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
              <ion-item fill="outline" [attr.title]="'HELP.INTEREST_RATE_DESC' | translate">
                <ion-label position="stacked">{{ 'COMMON.INTEREST_RATE' | translate }}</ion-label>
                <ion-input
                  type="number"
                  name="nominalAnnualInterestRate"
                  [(ngModel)]="interestRate"
                ></ion-input>
              </ion-item>
            </div>

            <div class="form-actions">
              <ion-button fill="clear" type="button" (click)="onCancel()" [disabled]="isSaving">
                {{ 'COMMON.CANCEL' | translate }}
              </ion-button>
              <ion-button
                color="primary"
                type="submit"
                [disabled]="accountForm.invalid || isSaving"
              >
                @if (isSaving) {
                  <ion-spinner name="crescent"></ion-spinner>
                  {{ 'COMMON.SAVING' | translate }}
                } @else {
                  {{ 'COMMON.SAVE' | translate }}
                }
              </ion-button>
            </div>
          </form>
        </ion-card-content>
      </ion-card>
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
      .field-container-row {
        display: flex;
        align-items: flex-start;
        gap: 8px;
      }
      .flex-grow {
        flex-grow: 1;
      }
    `,
  ],
})
export class SavingsAccountFormComponent implements OnInit {
  private readonly savingsService = inject(SavingsAccountService);
  private readonly productService = inject(SavingsProductService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly snackBar = inject(MatSnackBar);

  private readonly LIST_PATH = '/products/savings-accounts';

  accountId: number | null = null;
  isEditMode = false;
  isSaving = false;

  account: PostSavingsAccountsRequest = {};
  /** Interest rate bound separately as it's missing from model */
  interestRate = 0;
  submittedOnDate: Date = new Date();
  products: GetSavingsProductsResponse[] = [];

  ngOnInit(): void {
    this.loadProducts();

    // Check for clientId in query params for pre-population
    this.route.queryParams.subscribe((queryParams) => {
      const clientId = queryParams['clientId'];
      if (clientId) {
        this.account.clientId = +clientId;
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

  onCreateClient() {
    this.router.navigate(['/clients/create']);
  }

  onCreateProduct() {
    this.router.navigate(['/products/savings/create']);
  }

  private loadProducts(): void {
    this.productService.getSavingsproducts().subscribe({
      next: (data: GetSavingsProductsResponse[]) => {
        this.products = data || [];
      },
      error: () =>
        this.snackBar.open('Operation failed. Please try again.', 'Close', { duration: 3000 }),
    });
  }

  private loadAccountData(): void {
    if (!this.accountId) return;
    this.savingsService.getSavingsaccountsAccountId(this.accountId).subscribe({
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
      error: () =>
        this.snackBar.open('Operation failed. Please try again.', 'Close', { duration: 3000 }),
    });
  }

  onSubmit(): void {
    this.isSaving = true;

    this.account.submittedOnDate = formatDateToFineract(this.submittedOnDate);
    this.account.dateFormat = FINERACT_DATE_FORMAT;
    this.account.locale = FINERACT_LOCALE;

    // Cast to Record to add missing properties to the payload
    const payload: Record<string, unknown> = {
      ...this.account,
      nominalAnnualInterestRate: this.interestRate,
    };

    if (this.isEditMode && this.accountId) {
      this.savingsService
        .putSavingsaccountsAccountId(this.accountId, payload as Record<string, unknown>)
        .subscribe({
          next: () => this.router.navigate([this.LIST_PATH]),
          error: () => (this.isSaving = false),
        });
    } else {
      this.savingsService.postSavingsaccounts(payload as PostSavingsAccountsRequest).subscribe({
        next: () => this.router.navigate([this.LIST_PATH]),
        error: () => (this.isSaving = false),
      });
    }
  }

  onCancel(): void {
    this.router.navigate([this.LIST_PATH]);
  }
}
