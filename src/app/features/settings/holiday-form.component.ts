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
import { Router } from '@angular/router';
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
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import {
  HolidaysService,
  OfficesService,
  PostHolidaysRequest,
  GetOfficesResponse,
} from '../../api';

@Component({
  selector: 'app-holiday-form',
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
    MatSnackBarModule,
  ],
  template: `
    <div class="form-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>
            {{ 'HOLIDAYS.CREATE_HOLIDAY' | translate }}
          </mat-card-title>
        </mat-card-header>

        <mat-card-content>
          <form #holidayForm="ngForm" (ngSubmit)="onSubmit()" class="holiday-form">
            <div class="form-grid">
              <mat-form-field
                appearance="outline"
                class="full-width"
                [matTooltip]="'HELP.HOLIDAY_NAME_DESC' | translate"
              >
                <mat-label>{{ 'HOLIDAYS.NAME' | translate }}</mat-label>
                <input matInput name="name" [(ngModel)]="holiday.name" required />
              </mat-form-field>

              <mat-form-field
                appearance="outline"
                class="full-width"
                [matTooltip]="'HELP.APPLICABLE_OFFICES_DESC' | translate"
              >
                <mat-label>{{ 'HOLIDAYS.APPLICABLE_OFFICES' | translate }}</mat-label>
                <mat-select name="offices" [(ngModel)]="selectedOfficeIds" multiple required>
                  @for (office of offices; track office.id) {
                    <mat-option [value]="office.id">{{ office.name }}</mat-option>
                  }
                </mat-select>
              </mat-form-field>

              <mat-form-field
                appearance="outline"
                class="full-width"
                [matTooltip]="'HELP.FROM_DATE_DESC' | translate"
              >
                <mat-label>{{ 'HOLIDAYS.FROM_DATE' | translate }}</mat-label>
                <input
                  matInput
                  [matDatepicker]="fromPicker"
                  name="fromDate"
                  [(ngModel)]="fromDate"
                  required
                />
                <mat-datepicker-toggle matSuffix [for]="fromPicker"></mat-datepicker-toggle>
                <mat-datepicker #fromPicker></mat-datepicker>
              </mat-form-field>

              <mat-form-field
                appearance="outline"
                class="full-width"
                [matTooltip]="'HELP.TO_DATE_DESC' | translate"
              >
                <mat-label>{{ 'HOLIDAYS.TO_DATE' | translate }}</mat-label>
                <input
                  matInput
                  [matDatepicker]="toPicker"
                  name="toDate"
                  [(ngModel)]="toDate"
                  required
                />
                <mat-datepicker-toggle matSuffix [for]="toPicker"></mat-datepicker-toggle>
                <mat-datepicker #toPicker></mat-datepicker>
              </mat-form-field>

              <mat-form-field
                appearance="outline"
                class="full-width"
                [matTooltip]="'HELP.RESCHEDULING_TYPE_DESC' | translate"
              >
                <mat-label>{{ 'HOLIDAYS.RESCHEDULING_TYPE' | translate }}</mat-label>
                <mat-select name="reschedulingType" [(ngModel)]="reschedulingType" required>
                  @for (option of reschedulingTypeOptions; track option.id) {
                    <mat-option [value]="option.id">{{ option.value }}</mat-option>
                  }
                </mat-select>
              </mat-form-field>

              @if (reschedulingType === 2) {
                <mat-form-field
                  appearance="outline"
                  class="full-width"
                  [matTooltip]="'HELP.REPAYMENTS_RESCHEDULED_TO_DESC' | translate"
                >
                  <mat-label>{{ 'HOLIDAYS.REPAYMENTS_RESCHEDULED_TO' | translate }}</mat-label>
                  <input
                    matInput
                    [matDatepicker]="reschedulePicker"
                    name="repaymentsRescheduledTo"
                    [(ngModel)]="repaymentsRescheduledTo"
                    required
                  />
                  <mat-datepicker-toggle matSuffix [for]="reschedulePicker"></mat-datepicker-toggle>
                  <mat-datepicker #reschedulePicker></mat-datepicker>
                </mat-form-field>
              }
            </div>

            <mat-form-field
              appearance="outline"
              class="full-width"
              [matTooltip]="'HELP.HOLIDAY_DESCRIPTION_DESC' | translate"
            >
              <mat-label>{{ 'HOLIDAYS.DESCRIPTION' | translate }}</mat-label>
              <textarea
                matInput
                name="description"
                [(ngModel)]="holiday.description"
                rows="3"
              ></textarea>
            </mat-form-field>

            <div class="form-actions">
              <button mat-button type="button" (click)="onCancel()" [disabled]="isSaving">
                {{ 'COMMON.CANCEL' | translate }}
              </button>
              <button
                mat-raised-button
                color="primary"
                type="submit"
                [disabled]="holidayForm.invalid || isSaving || selectedOfficeIds.length === 0"
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
      .holiday-form {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }
      .form-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 16px;
      }
      .full-width {
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
export class HolidayFormComponent implements OnInit {
  private readonly holidaysService = inject(HolidaysService);
  private readonly officesService = inject(OfficesService);
  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);

  private readonly LIST_PATH = '/settings/holidays';

  isSaving = false;
  holiday: PostHolidaysRequest = {};
  fromDate: Date | null = null;
  toDate: Date | null = null;
  repaymentsRescheduledTo: Date | null = null;

  offices: GetOfficesResponse[] = [];
  selectedOfficeIds: number[] = [];

  reschedulingType = 2; // Default to 'Reschedule to specified date'
  reschedulingTypeOptions: { id: number; value: string }[] = [];

  ngOnInit(): void {
    this.loadOffices();
    this.loadReschedulingOptions();
  }

  private loadOffices(): void {
    this.officesService.getOffices(true).subscribe({
      next: (data) => {
        this.offices = data || [];
      },
      error: (err) => {
        console.error('Failed to load offices', err);
        this.snackBar.open('Failed to load offices', 'Close', { duration: 3000 });
      },
    });
  }

  private loadReschedulingOptions(): void {
    this.holidaysService.getHolidaysTemplate().subscribe({
      next: (data) => {
        try {
          const parsed = typeof data === 'string' ? JSON.parse(data) : data;
          this.reschedulingTypeOptions = parsed || [];
        } catch {
          this.reschedulingTypeOptions = [
            { id: 1, value: 'Reschedule to next repayment date' },
            { id: 2, value: 'Reschedule to specified date' },
          ];
        }
      },
      error: () => {
        this.reschedulingTypeOptions = [
          { id: 1, value: 'Reschedule to next repayment date' },
          { id: 2, value: 'Reschedule to specified date' },
        ];
      },
    });
  }

  private formatDate(date: Date): string {
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
  }

  onSubmit(): void {
    if (!this.fromDate || !this.toDate) {
      return;
    }

    if (this.reschedulingType === 2 && !this.repaymentsRescheduledTo) {
      return;
    }

    this.isSaving = true;

    const payload: Record<string, unknown> = {
      name: this.holiday.name,
      description: this.holiday.description,
      fromDate: this.formatDate(this.fromDate),
      toDate: this.formatDate(this.toDate),
      offices: this.selectedOfficeIds.map((id) => ({ officeId: id })),
      reschedulingType: this.reschedulingType,
      dateFormat: 'dd MMMM yyyy',
      locale: 'en',
    };

    if (this.reschedulingType === 2 && this.repaymentsRescheduledTo) {
      payload['repaymentsRescheduledTo'] = this.formatDate(this.repaymentsRescheduledTo);
    }

    this.holidaysService.postHolidays(payload as PostHolidaysRequest).subscribe({
      next: () => {
        this.snackBar.open('Holiday created successfully', 'Close', { duration: 3000 });
        this.router.navigate([this.LIST_PATH]);
      },
      error: (err) => {
        this.isSaving = false;
        console.error('Failed to create holiday', err);
      },
    });
  }

  onCancel(): void {
    this.router.navigate([this.LIST_PATH]);
  }
}
