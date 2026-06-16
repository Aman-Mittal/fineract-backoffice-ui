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

import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { PeriodicAccrualAccountingService, PostRunaccrualsRequest } from '../../../api';
import {
  formatDateToFineract,
  FINERACT_DATE_FORMAT,
  FINERACT_LOCALE,
} from '../../../core/utils/date-formatter';

/**
 * Single action screen that triggers periodic accrual accounting up to a chosen date.
 * Submits the chosen tillDate (formatted to the Fineract date format) to the runaccruals endpoint.
 */
@Component({
  selector: 'app-run-accruals',
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
          <mat-card-title>{{ 'RUN_ACCRUALS.TITLE' | translate }}</mat-card-title>
        </mat-card-header>

        <mat-card-content>
          <p class="hint">{{ 'HELP.RUN_ACCRUALS_DESC' | translate }}</p>

          @if (successMessage) {
            <div class="success-message">{{ successMessage }}</div>
          }

          <form #accrualForm="ngForm" (ngSubmit)="onSubmit()" class="accrual-form">
            <mat-form-field appearance="outline">
              <mat-label>{{ 'RUN_ACCRUALS.TILL_DATE' | translate }}</mat-label>
              <input
                matInput
                name="tillDate"
                [matDatepicker]="tillPicker"
                [(ngModel)]="tillDate"
                required
              />
              <mat-datepicker-toggle matIconSuffix [for]="tillPicker"></mat-datepicker-toggle>
              <mat-datepicker #tillPicker></mat-datepicker>
            </mat-form-field>

            <div class="form-actions">
              <button
                mat-raised-button
                color="primary"
                type="submit"
                [disabled]="accrualForm.invalid || isSubmitting"
              >
                @if (isSubmitting) {
                  <mat-spinner
                    diameter="20"
                    style="margin-right: 8px; display: inline-block; vertical-align: middle;"
                  ></mat-spinner>
                  {{ 'RUN_ACCRUALS.RUNNING' | translate }}
                } @else {
                  {{ 'RUN_ACCRUALS.RUN' | translate }}
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
      .accrual-form {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }
      mat-form-field {
        width: 100%;
      }
      .hint {
        color: rgba(0, 0, 0, 0.6);
      }
      .success-message {
        color: #2e7d32;
        margin-bottom: 16px;
      }
      .form-actions {
        display: flex;
        justify-content: flex-end;
      }
    `,
  ],
})
export class RunAccrualsComponent {
  private readonly accrualService = inject(PeriodicAccrualAccountingService);

  tillDate: Date | null = null;
  isSubmitting = false;
  successMessage = '';

  onSubmit(): void {
    if (!this.tillDate) return;
    this.isSubmitting = true;
    this.successMessage = '';

    const request: PostRunaccrualsRequest = {
      tillDate: formatDateToFineract(this.tillDate),
      dateFormat: FINERACT_DATE_FORMAT,
      locale: FINERACT_LOCALE,
    };

    this.accrualService.postRunaccruals(request).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.successMessage = 'Periodic accruals executed successfully.';
      },
      error: () => (this.isSubmitting = false),
    });
  }
}
