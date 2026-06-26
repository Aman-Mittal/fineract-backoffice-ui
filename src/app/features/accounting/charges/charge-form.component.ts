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
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {
  ChargesService,
  ChargeRequest,
  CurrencyService,
  CurrencyConfigurationData,
  CurrencyData,
  ChargeData,
  GetChargesResponse,
} from '../../../api';
import { HelpIconComponent } from '../../../shared';

/**
 * Component for creating and editing global charges and penalties.
 */
@Component({
  selector: 'app-charge-form',
  standalone: true,
  imports: [
    FormsModule,
    TranslateModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCheckboxModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    HelpIconComponent,
  ],
  template: `
    <div class="form-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>
            {{ isEditMode ? ('CHARGES.EDIT' | translate) : ('CHARGES.CREATE' | translate) }}
            <app-help-icon [helpTextKey]="'HELP.CHARGES_DESC'"></app-help-icon>
          </mat-card-title>
        </mat-card-header>

        <mat-card-content>
          <form #chargeForm="ngForm" (ngSubmit)="onSubmit()" class="charge-form">
            <div class="form-grid">
              <!-- Name -->
              <mat-form-field appearance="outline">
                <mat-label>{{ 'COMMON.NAME' | translate }}</mat-label>
                <input matInput name="name" [(ngModel)]="charge.name" required />
              </mat-form-field>

              <!-- Charge Applies To -->
              <mat-form-field appearance="outline">
                <mat-label>Applies To</mat-label>
                <mat-select
                  name="chargeAppliesTo"
                  [(ngModel)]="charge.chargeAppliesTo"
                  required
                  [disabled]="isEditMode"
                >
                  <mat-option [value]="1">Client</mat-option>
                  <mat-option [value]="2">Loan</mat-option>
                  <mat-option [value]="3">Savings</mat-option>
                  <mat-option [value]="4">Shares</mat-option>
                </mat-select>
              </mat-form-field>

              <!-- Currency -->
              <mat-form-field appearance="outline">
                <mat-label>{{ 'COMMON.CURRENCY' | translate }}</mat-label>
                <mat-select name="currencyCode" [(ngModel)]="charge.currencyCode" required>
                  @for (currency of currencies; track currency.code) {
                    <mat-option [value]="currency.code">{{ currency.name }}</mat-option>
                  }
                </mat-select>
              </mat-form-field>

              <!-- Charge Time Type -->
              <mat-form-field appearance="outline">
                <mat-label>Charge Time Type</mat-label>
                <mat-select name="chargeTimeType" [(ngModel)]="charge.chargeTimeType" required>
                  @for (option of timeTypeOptions; track option['id']) {
                    <mat-option [value]="option['id']">{{ option['value'] }}</mat-option>
                  }
                </mat-select>
              </mat-form-field>

              <!-- Charge Calculation Type -->
              <mat-form-field appearance="outline">
                <mat-label>Calculation Type</mat-label>
                <mat-select
                  name="chargeCalculationType"
                  [(ngModel)]="charge.chargeCalculationType"
                  required
                >
                  @for (option of calculationTypeOptions; track option['id']) {
                    <mat-option [value]="option['id']">{{ option['value'] }}</mat-option>
                  }
                </mat-select>
              </mat-form-field>

              <!-- Amount -->
              <mat-form-field appearance="outline">
                <mat-label>{{ 'COMMON.AMOUNT' | translate }}</mat-label>
                <input matInput type="number" name="amount" [(ngModel)]="charge.amount" required />
              </mat-form-field>

              <!-- Active -->
              <div class="checkbox-container">
                <mat-checkbox name="active" [(ngModel)]="charge.active">
                  {{ 'COMMON.ACTIVE' | translate }}
                </mat-checkbox>
              </div>

              <!-- Penalty -->
              <div class="checkbox-container">
                <mat-checkbox name="penalty" [(ngModel)]="charge.penalty">
                  {{ 'COMMON.PENALTY' | translate }}
                </mat-checkbox>
              </div>
            </div>

            <div class="form-actions">
              <button mat-button type="button" (click)="onCancel()" [disabled]="isSaving">
                {{ 'COMMON.CANCEL' | translate }}
              </button>
              <button
                mat-raised-button
                color="primary"
                type="submit"
                [disabled]="chargeForm.invalid || isSaving"
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
      .charge-form {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }
      .form-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 16px;
      }
      .checkbox-container {
        display: flex;
        align-items: center;
        height: 60px;
      }
    `,
  ],
})
export class ChargeFormComponent implements OnInit {
  private readonly chargesService = inject(ChargesService);
  private readonly currencyService = inject(CurrencyService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  private readonly LIST_PATH = '/accounting/charges';

  chargeId: number | null = null;
  isEditMode = false;
  isSaving = false;

  charge: ChargeRequest = {
    active: true,
    penalty: false,
    chargeAppliesTo: 1, // Default to Client
  };

  currencies: CurrencyData[] = [];
  timeTypeOptions: Record<string, unknown>[] = [];
  calculationTypeOptions: Record<string, unknown>[] = [];

  ngOnInit(): void {
    this.loadMetadata();
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.chargeId = +id;
        this.isEditMode = true;
        this.loadChargeData();
      }
    });
  }

  private loadMetadata(): void {
    this.currencyService.getCurrencies().subscribe((data: CurrencyConfigurationData) => {
      this.currencies = Array.from(data.selectedCurrencyOptions || []);
    });

    this.chargesService.getChargesTemplate().subscribe((data: ChargeData) => {
      const record = data as unknown as Record<string, unknown>;
      this.timeTypeOptions = (record['chargeTimeTypeOptions'] as Record<string, unknown>[]) || [];
      this.calculationTypeOptions =
        (record['chargeCalculationTypeOptions'] as Record<string, unknown>[]) || [];
    });
  }

  private loadChargeData(): void {
    if (!this.chargeId) return;
    this.chargesService.getChargesChargeId(this.chargeId).subscribe((data: GetChargesResponse) => {
      const record = data as unknown as Record<string, unknown>;
      this.charge = {
        name: record['name'] as string,
        amount: record['amount'] as number,
        currencyCode: (record['currency'] as Record<string, unknown>)?.['code'] as string,
        chargeAppliesTo: (record['chargeAppliesTo'] as Record<string, unknown>)?.['id'] as number,
        chargeTimeType: (record['chargeTimeType'] as Record<string, unknown>)?.['id'] as number,
        chargeCalculationType: (record['chargeCalculationType'] as Record<string, unknown>)?.[
          'id'
        ] as number,
        active: record['active'] as boolean,
        penalty: record['penalty'] as boolean,
      };
    });
  }

  onSubmit(): void {
    this.isSaving = true;
    this.charge.locale = 'en';

    if (this.isEditMode && this.chargeId) {
      this.chargesService.putChargesChargeId(this.chargeId, this.charge).subscribe({
        next: () => this.router.navigate([this.LIST_PATH]),
        error: () => (this.isSaving = false),
      });
    } else {
      this.chargesService.postCharges(this.charge).subscribe({
        next: () => this.router.navigate([this.LIST_PATH]),
        error: () => (this.isSaving = false),
      });
    }
  }

  onCancel(): void {
    this.router.navigate([this.LIST_PATH]);
  }
}
