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
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SelfDividendService } from '../../../api';
import {
  formatDateToFineract,
  FINERACT_DATE_FORMAT,
  FINERACT_LOCALE,
} from '../../../core/utils/date-formatter';

/**
 * Create form for a share product dividend. The share product id is read from the route
 * snapshot; the core captured fields are the dividend amount and the dividend period start
 * and end dates. The dividend endpoint is untyped, so the request body is serialised to a
 * JSON string.
 */
@Component({
  selector: 'app-share-dividend-form',
  standalone: true,
  imports: [
    FormsModule,
    TranslateModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatProgressSpinnerModule,
  ],
  template: `
    <div class="form-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>{{ 'SHARE_DIVIDENDS.CREATE' | translate }}</mat-card-title>
        </mat-card-header>

        <mat-card-content>
          <form #dividendForm="ngForm" (ngSubmit)="onSubmit()" class="dividend-form">
            <mat-form-field appearance="outline">
              <mat-label>{{ 'SHARE_DIVIDENDS.AMOUNT' | translate }}</mat-label>
              <input
                matInput
                type="number"
                name="dividendAmount"
                [(ngModel)]="dividendAmount"
                required
              />
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>{{ 'SHARE_DIVIDENDS.PERIOD_START_DATE' | translate }}</mat-label>
              <input
                matInput
                [matDatepicker]="startPicker"
                name="dividendPeriodStartDate"
                [(ngModel)]="dividendPeriodStartDate"
                required
              />
              <mat-datepicker-toggle matSuffix [for]="startPicker"></mat-datepicker-toggle>
              <mat-datepicker #startPicker></mat-datepicker>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>{{ 'SHARE_DIVIDENDS.PERIOD_END_DATE' | translate }}</mat-label>
              <input
                matInput
                [matDatepicker]="endPicker"
                name="dividendPeriodEndDate"
                [(ngModel)]="dividendPeriodEndDate"
                required
              />
              <mat-datepicker-toggle matSuffix [for]="endPicker"></mat-datepicker-toggle>
              <mat-datepicker #endPicker></mat-datepicker>
            </mat-form-field>

            <div class="form-actions">
              <button mat-button type="button" (click)="onCancel()" [disabled]="isSaving">
                {{ 'COMMON.CANCEL' | translate }}
              </button>
              <button
                mat-raised-button
                color="primary"
                type="submit"
                [disabled]="dividendForm.invalid || isSaving"
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
      .dividend-form {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }
    `,
  ],
})
export class ShareDividendFormComponent implements OnInit {
  private readonly selfDividendService = inject(SelfDividendService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  productId!: number;
  isSaving = false;

  dividendAmount: number | null = null;
  dividendPeriodStartDate: Date | null = null;
  dividendPeriodEndDate: Date | null = null;

  ngOnInit(): void {
    this.productId = Number(this.route.snapshot.paramMap.get('productId'));
  }

  onSubmit(): void {
    this.isSaving = true;
    const body = JSON.stringify({
      dividendAmount: this.dividendAmount ?? undefined,
      dividendPeriodStartDate: this.dividendPeriodStartDate
        ? formatDateToFineract(this.dividendPeriodStartDate)
        : undefined,
      dividendPeriodEndDate: this.dividendPeriodEndDate
        ? formatDateToFineract(this.dividendPeriodEndDate)
        : undefined,
      dateFormat: FINERACT_DATE_FORMAT,
      locale: FINERACT_LOCALE,
    });

    this.selfDividendService.postShareproductProductIdDividend(this.productId, body).subscribe({
      next: () => this.router.navigate(['/products/shares', this.productId, 'dividends']),
      error: () => (this.isSaving = false),
    });
  }

  onCancel(): void {
    this.router.navigate(['/products/shares', this.productId, 'dividends']);
  }
}
