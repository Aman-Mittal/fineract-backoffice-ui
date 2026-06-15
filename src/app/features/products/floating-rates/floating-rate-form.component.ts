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
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FloatingRatesService, FloatingRateRequest } from '../../../api';
import {
  formatDateToFineract,
  FINERACT_DATE_FORMAT,
  FINERACT_LOCALE,
} from '../../../core/utils/date-formatter';

/** A single editable rate period row in the form. */
interface RatePeriodRow {
  fromDate: Date;
  interestRate: number | null;
  isDifferentialToBaseLendingRate: boolean;
}

/**
 * Create / edit form for a floating interest rate, including its dynamic list of rate periods.
 */
@Component({
  selector: 'app-floating-rate-form',
  standalone: true,
  imports: [
    FormsModule,
    TranslateModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatButtonModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatProgressSpinnerModule,
  ],
  template: `
    <div class="form-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>
            {{
              isEditMode
                ? ('FLOATING_RATES.EDIT' | translate)
                : ('FLOATING_RATES.CREATE' | translate)
            }}
          </mat-card-title>
        </mat-card-header>

        <mat-card-content>
          <form #frForm="ngForm" (ngSubmit)="onSubmit()" class="fr-form">
            <mat-form-field appearance="outline">
              <mat-label>{{ 'FLOATING_RATES.NAME' | translate }}</mat-label>
              <input matInput name="name" [(ngModel)]="rate.name" required />
            </mat-form-field>

            <div class="checkboxes">
              <mat-checkbox name="isBaseLendingRate" [(ngModel)]="rate.isBaseLendingRate">
                {{ 'FLOATING_RATES.IS_BASE_LENDING_RATE' | translate }}
              </mat-checkbox>
              <mat-checkbox name="isActive" [(ngModel)]="rate.isActive">
                {{ 'COMMON.ACTIVE' | translate }}
              </mat-checkbox>
            </div>

            <div class="periods">
              <div class="periods-header">
                <h3>{{ 'FLOATING_RATES.RATE_PERIODS' | translate }}</h3>
                <button mat-stroked-button type="button" (click)="addPeriod()">
                  <mat-icon>add</mat-icon> {{ 'FLOATING_RATES.ADD_PERIOD' | translate }}
                </button>
              </div>

              @for (period of periods; track $index) {
                <div class="period-row">
                  <mat-form-field appearance="outline">
                    <mat-label>{{ 'FLOATING_RATES.FROM_DATE' | translate }}</mat-label>
                    <input
                      matInput
                      [matDatepicker]="picker"
                      [name]="'fromDate' + $index"
                      [(ngModel)]="period.fromDate"
                      required
                    />
                    <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
                    <mat-datepicker #picker></mat-datepicker>
                  </mat-form-field>

                  <mat-form-field appearance="outline">
                    <mat-label>{{ 'FLOATING_RATES.INTEREST_RATE' | translate }}</mat-label>
                    <input
                      matInput
                      type="number"
                      [name]="'interestRate' + $index"
                      [(ngModel)]="period.interestRate"
                      required
                    />
                  </mat-form-field>

                  <mat-checkbox
                    [name]="'isDifferential' + $index"
                    [(ngModel)]="period.isDifferentialToBaseLendingRate"
                  >
                    {{ 'FLOATING_RATES.IS_DIFFERENTIAL' | translate }}
                  </mat-checkbox>

                  <button
                    mat-icon-button
                    color="warn"
                    type="button"
                    [attr.aria-label]="'COMMON.DELETE' | translate"
                    (click)="removePeriod($index)"
                  >
                    <mat-icon>delete</mat-icon>
                  </button>
                </div>
              }
            </div>

            <div class="form-actions">
              <button mat-button type="button" (click)="onCancel()" [disabled]="isSaving">
                {{ 'COMMON.CANCEL' | translate }}
              </button>
              <button
                mat-raised-button
                color="primary"
                type="submit"
                [disabled]="frForm.invalid || isSaving"
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
      .fr-form {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }
      mat-form-field {
        width: 100%;
      }
      .checkboxes {
        display: flex;
        gap: 24px;
      }
      .periods-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      .period-row {
        display: grid;
        grid-template-columns: 1fr 1fr auto auto;
        align-items: center;
        gap: 12px;
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
export class FloatingRateFormComponent implements OnInit {
  private readonly floatingRatesService = inject(FloatingRatesService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  private readonly LIST_PATH = '/products/floating-rates';

  rateId: number | null = null;
  isEditMode = false;
  isSaving = false;

  rate: FloatingRateRequest = { name: '', isBaseLendingRate: false, isActive: true };
  periods: RatePeriodRow[] = [];

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.rateId = +id;
        this.isEditMode = true;
        this.load();
      }
    });
  }

  load(): void {
    if (!this.rateId) return;
    this.floatingRatesService.getFloatingratesFloatingRateId(this.rateId).subscribe((data) => {
      this.rate = {
        name: data.name,
        isBaseLendingRate: data.isBaseLendingRate,
        isActive: data.isActive,
      };
      this.periods = (data.ratePeriods || []).map((p) => {
        const arr = p.fromDate as unknown as number[];
        return {
          fromDate:
            Array.isArray(arr) && arr.length >= 3
              ? new Date(arr[0], arr[1] - 1, arr[2])
              : new Date(),
          interestRate: p.interestRate ?? null,
          isDifferentialToBaseLendingRate: !!p.isDifferentialToBaseLendingRate,
        };
      });
    });
  }

  addPeriod(): void {
    this.periods.push({
      fromDate: new Date(),
      interestRate: null,
      isDifferentialToBaseLendingRate: false,
    });
  }

  removePeriod(index: number): void {
    this.periods.splice(index, 1);
  }

  onSubmit(): void {
    this.isSaving = true;
    const payload: FloatingRateRequest = {
      name: this.rate.name,
      isBaseLendingRate: this.rate.isBaseLendingRate,
      isActive: this.rate.isActive,
      ratePeriods: this.periods.map((p) => ({
        fromDate: formatDateToFineract(p.fromDate),
        interestRate: p.interestRate ?? undefined,
        isDifferentialToBaseLendingRate: p.isDifferentialToBaseLendingRate,
        dateFormat: FINERACT_DATE_FORMAT,
        locale: FINERACT_LOCALE,
      })),
    };

    const request$ =
      this.isEditMode && this.rateId
        ? this.floatingRatesService.putFloatingratesFloatingRateId(this.rateId, payload)
        : this.floatingRatesService.postFloatingrates(payload);

    request$.subscribe({
      next: () => this.router.navigate([this.LIST_PATH]),
      error: () => (this.isSaving = false),
    });
  }

  onCancel(): void {
    this.router.navigate([this.LIST_PATH]);
  }
}
