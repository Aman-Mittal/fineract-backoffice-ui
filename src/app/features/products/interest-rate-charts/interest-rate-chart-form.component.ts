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
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {
  InterestRateChartService,
  InterestRateChartCreateRequest,
  InterestRateChartUpdateRequest,
} from '../../../api';
import {
  formatDateToFineract,
  formatArrayDate,
  FINERACT_DATE_FORMAT,
  FINERACT_LOCALE,
} from '../../../core/utils/date-formatter';

/**
 * Create / edit form for an interest rate chart's core fields. On create the chart's
 * effective from-date is captured; updates are limited to name and description (the
 * Fineract update endpoint only accepts those fields).
 */
@Component({
  selector: 'app-interest-rate-chart-form',
  standalone: true,
  imports: [
    FormsModule,
    TranslateModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
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
                ? ('INTEREST_RATE_CHARTS.EDIT' | translate)
                : ('INTEREST_RATE_CHARTS.CREATE' | translate)
            }}
          </mat-card-title>
        </mat-card-header>

        <mat-card-content>
          <form #chartForm="ngForm" (ngSubmit)="onSubmit()" class="chart-form">
            <mat-form-field appearance="outline">
              <mat-label>{{ 'INTEREST_RATE_CHARTS.NAME' | translate }}</mat-label>
              <input matInput name="name" [(ngModel)]="name" required />
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>{{ 'INTEREST_RATE_CHARTS.DESCRIPTION' | translate }}</mat-label>
              <input matInput name="description" [(ngModel)]="description" />
            </mat-form-field>

            @if (!isEditMode) {
              <mat-form-field appearance="outline">
                <mat-label>{{ 'INTEREST_RATE_CHARTS.FROM_DATE' | translate }}</mat-label>
                <input
                  matInput
                  [matDatepicker]="picker"
                  name="fromDate"
                  [(ngModel)]="fromDate"
                  required
                />
                <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
                <mat-datepicker #picker></mat-datepicker>
              </mat-form-field>
            }

            <div class="form-actions">
              <button mat-button type="button" (click)="onCancel()" [disabled]="isSaving">
                {{ 'COMMON.CANCEL' | translate }}
              </button>
              <button
                mat-raised-button
                color="primary"
                type="submit"
                [disabled]="chartForm.invalid || isSaving"
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
      .chart-form {
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
export class InterestRateChartFormComponent implements OnInit {
  private readonly chartService = inject(InterestRateChartService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  private readonly LIST_PATH = '/products/interest-rate-charts';

  chartId: number | null = null;
  isEditMode = false;
  isSaving = false;

  name = '';
  description = '';
  fromDate: Date = new Date();

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.chartId = +id;
        this.isEditMode = true;
        this.load();
      }
    });
  }

  load(): void {
    if (!this.chartId) return;
    this.chartService.getInterestratechartsChartId(this.chartId).subscribe((data) => {
      this.fromDate = data.fromDate ? new Date(formatArrayDate(data.fromDate)) : new Date();
    });
  }

  onSubmit(): void {
    this.isSaving = true;
    if (this.isEditMode && this.chartId) {
      const payload: InterestRateChartUpdateRequest = {
        name: this.name,
        description: this.description,
      };
      this.chartService.putInterestratechartsChartId(this.chartId, payload).subscribe({
        next: () => this.router.navigate([this.LIST_PATH]),
        error: () => (this.isSaving = false),
      });
    } else {
      const payload: InterestRateChartCreateRequest = {
        name: this.name,
        description: this.description,
        fromDate: formatDateToFineract(this.fromDate),
        dateFormat: FINERACT_DATE_FORMAT,
        locale: FINERACT_LOCALE,
      };
      this.chartService.postInterestratecharts(payload).subscribe({
        next: () => this.router.navigate([this.LIST_PATH]),
        error: () => (this.isSaving = false),
      });
    }
  }

  onCancel(): void {
    this.router.navigate([this.LIST_PATH]);
  }
}
