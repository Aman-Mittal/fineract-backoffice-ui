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
import { TranslateModule } from '@ngx-translate/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { LoanProductsService, GetLoanProductsProductIdResponse } from '../../api';
import { LOAN_SCHEDULE_TYPE } from './loan-schedule-type';

@Component({
  selector: 'app-loan-product-view',
  standalone: true,
  imports: [TranslateModule, MatCardModule, MatButtonModule, MatIconModule, MatChipsModule],
  template: `
    @if (product) {
      <div class="view-container">
        <mat-card class="header-card">
          <mat-card-content class="header-content">
            <div>
              <h2>{{ product.name }}</h2>
              <span class="short-name">{{ product.shortName }}</span>
            </div>
            <div class="actions-area">
              <button mat-raised-button color="primary" (click)="onEdit()">
                <mat-icon>edit</mat-icon>
                {{ 'COMMON.EDIT' | translate }}
              </button>
              <button mat-button (click)="onBack()">
                <mat-icon>arrow_back</mat-icon>
                {{ 'COMMON.BACK' | translate }}
              </button>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card>
          <mat-card-header>
            <mat-card-title>{{ 'COMMON.DETAILS' | translate }}</mat-card-title>
          </mat-card-header>
          <mat-card-content class="details-list">
            <div class="detail-item">
              <span class="label">{{ 'PRODUCTS.CURRENCY' | translate }}</span>
              <span class="value">{{ product.currency?.code }}</span>
            </div>
            <div class="detail-item">
              <span class="label">{{ 'PRODUCTS.PRINCIPAL' | translate }}</span>
              <span class="value">{{ product.principal }}</span>
            </div>
            <div class="detail-item">
              <span class="label">{{ 'PRODUCTS.INTEREST_RATE' | translate }}</span>
              <span class="value"
                >{{ product.interestRatePerPeriod }}
                {{ product.interestRateFrequencyType?.description }}</span
              >
            </div>
            <div class="detail-item">
              <span class="label">{{ 'LOANS.REPAYMENTS_COUNT' | translate }}</span>
              <span class="value">{{ product.numberOfRepayments }}</span>
            </div>
            <div class="detail-item">
              <span class="label">{{ 'LOANS.REPAYMENT_EVERY' | translate }}</span>
              <span class="value"
                >{{ product.repaymentEvery }}
                {{ product.repaymentFrequencyType?.description }}</span
              >
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card>
          <mat-card-header>
            <mat-card-title>{{ 'PRODUCTS.LOAN_SCHEDULE_TYPE' | translate }}</mat-card-title>
          </mat-card-header>
          <mat-card-content class="details-list">
            <div class="detail-item">
              <span class="label">{{ 'PRODUCTS.LOAN_SCHEDULE_TYPE' | translate }}</span>
              <span class="value">
                <mat-chip-set>
                  <mat-chip [color]="isProgressive() ? 'accent' : 'primary'" highlighted>
                    {{ product.loanScheduleType?.value }}
                  </mat-chip>
                </mat-chip-set>
              </span>
            </div>
            <div class="detail-item">
              <span class="label">{{
                'PRODUCTS.TRANSACTION_PROCESSING_STRATEGY' | translate
              }}</span>
              <span class="value">{{ product.transactionProcessingStrategyName }}</span>
            </div>
            @if (isProgressive()) {
              <div class="detail-item">
                <span class="label">{{
                  'PRODUCTS.LOAN_SCHEDULE_PROCESSING_TYPE' | translate
                }}</span>
                <span class="value">{{ product.loanScheduleProcessingType?.value }}</span>
              </div>
            }
          </mat-card-content>
        </mat-card>

        @if (isProgressive() && product.paymentAllocation?.length) {
          <mat-card>
            <mat-card-header>
              <mat-card-title>{{ 'PRODUCTS.PAYMENT_ALLOCATION' | translate }}</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              @for (rule of product.paymentAllocation; track rule.transactionType) {
                <div class="allocation-rule">
                  <strong>{{ rule.transactionType }}</strong>
                  <span class="future-rule"
                    >({{ 'PRODUCTS.FUTURE_INSTALLMENT_ALLOCATION_RULE' | translate }}:
                    {{ rule.futureInstallmentAllocationRule }})</span
                  >
                  <ol class="order-list">
                    @for (order of rule.paymentAllocationOrder; track order.paymentAllocationRule) {
                      <li>{{ order.paymentAllocationRule }}</li>
                    }
                  </ol>
                </div>
              }
            </mat-card-content>
          </mat-card>
        }

        @if (isProgressive() && product.creditAllocation?.length) {
          <mat-card>
            <mat-card-header>
              <mat-card-title>{{ 'PRODUCTS.CREDIT_ALLOCATION' | translate }}</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              @for (rule of product.creditAllocation; track rule.transactionType) {
                <div class="allocation-rule">
                  <strong>{{ rule.transactionType }}</strong>
                  <ol class="order-list">
                    @for (order of rule.creditAllocationOrder; track order.creditAllocationRule) {
                      <li>{{ order.creditAllocationRule }}</li>
                    }
                  </ol>
                </div>
              }
            </mat-card-content>
          </mat-card>
        }
      </div>
    }
  `,
  styles: [
    `
      .view-container {
        padding: 24px;
        max-width: 900px;
        margin: 0 auto;
        display: flex;
        flex-direction: column;
        gap: 16px;
      }
      .header-content {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .short-name {
        color: #777;
      }
      .actions-area {
        display: flex;
        gap: 12px;
      }
      .details-list {
        display: flex;
        flex-direction: column;
        gap: 12px;
      }
      .detail-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid #eee;
        padding-bottom: 8px;
      }
      .label {
        color: #777;
      }
      .value {
        font-weight: 600;
      }
      .allocation-rule {
        border: 1px solid #e0e0e0;
        border-radius: 8px;
        padding: 12px;
        margin-bottom: 12px;
      }
      .future-rule {
        color: #777;
        margin-left: 8px;
        font-weight: normal;
      }
      .order-list {
        margin: 8px 0 0;
        padding-left: 20px;
      }
    `,
  ],
})
export class LoanProductViewComponent implements OnInit {
  private readonly productService = inject(LoanProductsService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  productId = 0;
  product: GetLoanProductsProductIdResponse | null = null;

  ngOnInit(): void {
    this.productId = Number(this.route.snapshot.paramMap.get('id'));
    this.productService.getLoanproductsProductId(this.productId).subscribe((data) => {
      this.product = data;
    });
  }

  isProgressive(): boolean {
    return this.product?.loanScheduleType?.code === LOAN_SCHEDULE_TYPE.PROGRESSIVE;
  }

  onEdit(): void {
    this.router.navigate(['/products/loan/edit', this.productId]);
  }

  onBack(): void {
    this.router.navigate(['/products/loan']);
  }
}
