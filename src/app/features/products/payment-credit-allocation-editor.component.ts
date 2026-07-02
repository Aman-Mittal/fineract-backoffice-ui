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

import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatTooltipModule } from '@angular/material/tooltip';
import { EnumOptionData, AdvancedPaymentData, CreditAllocationData } from '../../api';

@Component({
  selector: 'app-payment-credit-allocation-editor',
  standalone: true,
  imports: [
    FormsModule,
    TranslateModule,
    MatCardModule,
    MatSelectModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatTooltipModule,
  ],
  template: `
    <mat-card class="allocation-card">
      <mat-card-header>
        <mat-card-title>{{ 'PRODUCTS.PAYMENT_ALLOCATION' | translate }}</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        @for (rule of paymentAllocation; track rule.transactionType; let ruleIndex = $index) {
          <div class="allocation-block">
            <div class="allocation-block-header">
              <strong>{{
                transactionTypeLabel(rule.transactionType, transactionTypeOptions)
              }}</strong>
              <button
                mat-icon-button
                type="button"
                color="warn"
                [matTooltip]="'COMMON.DELETE' | translate"
                (click)="removePaymentTransactionType(ruleIndex)"
              >
                <mat-icon>delete</mat-icon>
              </button>
            </div>

            <mat-form-field appearance="outline" class="future-installment-field">
              <mat-label>{{ 'PRODUCTS.FUTURE_INSTALLMENT_ALLOCATION_RULE' | translate }}</mat-label>
              <mat-select
                [(ngModel)]="rule.futureInstallmentAllocationRule"
                [name]="'futureInstallmentRule' + ruleIndex"
                (ngModelChange)="emitPaymentAllocation()"
              >
                @for (option of futureInstallmentOptions; track option.code) {
                  <mat-option [value]="option.code">{{ option.value }}</mat-option>
                }
              </mat-select>
            </mat-form-field>

            <mat-list class="allocation-order-list">
              @for (
                order of rule.paymentAllocationOrder;
                track order.paymentAllocationRule;
                let orderIndex = $index
              ) {
                <mat-list-item>
                  <span class="order-index">{{ orderIndex + 1 }}.</span>
                  <span class="order-label">{{
                    allocationRuleLabel(order.paymentAllocationRule, allocationRuleOptions)
                  }}</span>
                  <button
                    mat-icon-button
                    type="button"
                    [disabled]="orderIndex === 0"
                    (click)="moveOrderEntry(rule.paymentAllocationOrder!, orderIndex, -1)"
                  >
                    <mat-icon>arrow_upward</mat-icon>
                  </button>
                  <button
                    mat-icon-button
                    type="button"
                    [disabled]="orderIndex === rule.paymentAllocationOrder!.length - 1"
                    (click)="moveOrderEntry(rule.paymentAllocationOrder!, orderIndex, 1)"
                  >
                    <mat-icon>arrow_downward</mat-icon>
                  </button>
                </mat-list-item>
              }
            </mat-list>
          </div>
        }

        @if (availablePaymentTransactionTypes().length) {
          <div class="add-transaction-type-row">
            <mat-form-field appearance="outline">
              <mat-label>{{ 'PRODUCTS.ADD_TRANSACTION_TYPE' | translate }}</mat-label>
              <mat-select name="newPaymentTransactionType" [(ngModel)]="newPaymentTransactionType">
                @for (option of availablePaymentTransactionTypes(); track option.code) {
                  <mat-option [value]="option.code">{{ option.value }}</mat-option>
                }
              </mat-select>
            </mat-form-field>
            <button
              mat-stroked-button
              type="button"
              [disabled]="!newPaymentTransactionType"
              (click)="addPaymentTransactionType()"
            >
              <mat-icon>add</mat-icon>
              {{ 'COMMON.ADD' | translate }}
            </button>
          </div>
        }
      </mat-card-content>
    </mat-card>

    <mat-card class="allocation-card">
      <mat-card-header>
        <mat-card-title>{{ 'PRODUCTS.CREDIT_ALLOCATION' | translate }}</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        @for (rule of creditAllocation; track rule.transactionType; let ruleIndex = $index) {
          <div class="allocation-block">
            <div class="allocation-block-header">
              <strong>{{
                transactionTypeLabel(rule.transactionType, creditTransactionTypeOptions)
              }}</strong>
              <button
                mat-icon-button
                type="button"
                color="warn"
                [matTooltip]="'COMMON.DELETE' | translate"
                (click)="removeCreditTransactionType(ruleIndex)"
              >
                <mat-icon>delete</mat-icon>
              </button>
            </div>

            <mat-list class="allocation-order-list">
              @for (
                order of rule.creditAllocationOrder;
                track order.creditAllocationRule;
                let orderIndex = $index
              ) {
                <mat-list-item>
                  <span class="order-index">{{ orderIndex + 1 }}.</span>
                  <span class="order-label">{{
                    allocationRuleLabel(order.creditAllocationRule, creditAllocationRuleOptions)
                  }}</span>
                  <button
                    mat-icon-button
                    type="button"
                    [disabled]="orderIndex === 0"
                    (click)="moveOrderEntry(rule.creditAllocationOrder!, orderIndex, -1)"
                  >
                    <mat-icon>arrow_upward</mat-icon>
                  </button>
                  <button
                    mat-icon-button
                    type="button"
                    [disabled]="orderIndex === rule.creditAllocationOrder!.length - 1"
                    (click)="moveOrderEntry(rule.creditAllocationOrder!, orderIndex, 1)"
                  >
                    <mat-icon>arrow_downward</mat-icon>
                  </button>
                </mat-list-item>
              }
            </mat-list>
          </div>
        }

        @if (availableCreditTransactionTypes().length) {
          <div class="add-transaction-type-row">
            <mat-form-field appearance="outline">
              <mat-label>{{ 'PRODUCTS.ADD_TRANSACTION_TYPE' | translate }}</mat-label>
              <mat-select name="newCreditTransactionType" [(ngModel)]="newCreditTransactionType">
                @for (option of availableCreditTransactionTypes(); track option.code) {
                  <mat-option [value]="option.code">{{ option.value }}</mat-option>
                }
              </mat-select>
            </mat-form-field>
            <button
              mat-stroked-button
              type="button"
              [disabled]="!newCreditTransactionType"
              (click)="addCreditTransactionType()"
            >
              <mat-icon>add</mat-icon>
              {{ 'COMMON.ADD' | translate }}
            </button>
          </div>
        }
      </mat-card-content>
    </mat-card>
  `,
  styles: [
    `
      .allocation-card {
        margin-bottom: 16px;
      }
      .allocation-block {
        border: 1px solid #e0e0e0;
        border-radius: 8px;
        padding: 12px;
        margin-bottom: 12px;
      }
      .allocation-block-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 8px;
      }
      .future-installment-field {
        width: 100%;
        max-width: 320px;
      }
      .allocation-order-list mat-list-item {
        display: flex;
        align-items: center;
      }
      .order-index {
        width: 24px;
        color: #777;
      }
      .order-label {
        flex: 1;
      }
      .add-transaction-type-row {
        display: flex;
        align-items: center;
        gap: 12px;
      }
    `,
  ],
})
export class PaymentCreditAllocationEditorComponent {
  @Input() transactionTypeOptions: EnumOptionData[] = [];
  @Input() allocationRuleOptions: EnumOptionData[] = [];
  @Input() futureInstallmentOptions: EnumOptionData[] = [];
  @Input() creditTransactionTypeOptions: EnumOptionData[] = [];
  @Input() creditAllocationRuleOptions: EnumOptionData[] = [];

  @Input() paymentAllocation: AdvancedPaymentData[] = [];
  @Output() paymentAllocationChange = new EventEmitter<AdvancedPaymentData[]>();

  @Input() creditAllocation: CreditAllocationData[] = [];
  @Output() creditAllocationChange = new EventEmitter<CreditAllocationData[]>();

  newPaymentTransactionType: string | null = null;
  newCreditTransactionType: string | null = null;

  transactionTypeLabel(code: string | undefined, options: EnumOptionData[]): string {
    return options.find((option) => option.code === code)?.value ?? code ?? '';
  }

  allocationRuleLabel(code: string | undefined, options: EnumOptionData[]): string {
    return options.find((option) => option.code === code)?.value ?? code ?? '';
  }

  availablePaymentTransactionTypes(): EnumOptionData[] {
    const used = new Set(this.paymentAllocation.map((rule) => rule.transactionType));
    return this.transactionTypeOptions.filter((option) => !used.has(option.code));
  }

  availableCreditTransactionTypes(): EnumOptionData[] {
    const used = new Set(this.creditAllocation.map((rule) => rule.transactionType));
    return this.creditTransactionTypeOptions.filter((option) => !used.has(option.code));
  }

  addPaymentTransactionType(): void {
    if (!this.newPaymentTransactionType) return;
    this.paymentAllocation = [
      ...this.paymentAllocation,
      {
        transactionType: this.newPaymentTransactionType,
        futureInstallmentAllocationRule:
          this.futureInstallmentOptions[0]?.code ?? 'NEXT_INSTALLMENT',
        paymentAllocationOrder: this.allocationRuleOptions.map((option, index) => ({
          order: index + 1,
          paymentAllocationRule: option.code,
        })),
      },
    ];
    this.newPaymentTransactionType = null;
    this.emitPaymentAllocation();
  }

  removePaymentTransactionType(index: number): void {
    this.paymentAllocation = this.paymentAllocation.filter((_, i) => i !== index);
    this.emitPaymentAllocation();
  }

  addCreditTransactionType(): void {
    if (!this.newCreditTransactionType) return;
    this.creditAllocation = [
      ...this.creditAllocation,
      {
        transactionType: this.newCreditTransactionType,
        creditAllocationOrder: this.creditAllocationRuleOptions.map((option, index) => ({
          order: index + 1,
          creditAllocationRule: option.code,
        })),
      },
    ];
    this.newCreditTransactionType = null;
    this.emitCreditAllocation();
  }

  removeCreditTransactionType(index: number): void {
    this.creditAllocation = this.creditAllocation.filter((_, i) => i !== index);
    this.emitCreditAllocation();
  }

  moveOrderEntry<T extends { order?: number }>(entries: T[], index: number, delta: number): void {
    const targetIndex = index + delta;
    if (targetIndex < 0 || targetIndex >= entries.length) return;
    [entries[index], entries[targetIndex]] = [entries[targetIndex], entries[index]];
    entries.forEach((entry, i) => (entry.order = i + 1));
    this.emitPaymentAllocation();
    this.emitCreditAllocation();
  }

  emitPaymentAllocation(): void {
    this.paymentAllocationChange.emit(this.paymentAllocation);
  }

  emitCreditAllocation(): void {
    this.creditAllocationChange.emit(this.creditAllocation);
  }
}
