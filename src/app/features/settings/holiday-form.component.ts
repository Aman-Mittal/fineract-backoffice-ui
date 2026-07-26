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
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { NotificationService } from '../../core/services/notification.service';
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonInput,
  IonItem,
  IonLabel,
  IonSelect,
  IonSelectOption,
  IonSpinner,
  IonTextarea,
} from '@ionic/angular/standalone';
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
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    IonButton,
    IonSpinner,
    IonInput,
    IonTextarea,
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
            {{ 'HOLIDAYS.CREATE_HOLIDAY' | translate }}
          </ion-card-title>
        </ion-card-header>

        <ion-card-content>
          <form #holidayForm="ngForm" (ngSubmit)="onSubmit()" class="holiday-form">
            <div class="form-grid">
              <ion-item
                fill="outline"
                class="full-width"
                [attr.title]="'HELP.HOLIDAY_NAME_DESC' | translate"
              >
                <ion-label position="stacked">{{ 'HOLIDAYS.NAME' | translate }}</ion-label>
                <ion-input name="name" [(ngModel)]="holiday.name" required></ion-input>
              </ion-item>

              <ion-item
                fill="outline"
                class="full-width"
                [attr.title]="'HELP.APPLICABLE_OFFICES_DESC' | translate"
              >
                <ion-label position="stacked">{{
                  'HOLIDAYS.APPLICABLE_OFFICES' | translate
                }}</ion-label>
                <ion-select name="offices" [(ngModel)]="selectedOfficeIds" multiple required>
                  @for (office of offices; track office.id) {
                    <ion-select-option [value]="office.id">{{ office.name }}</ion-select-option>
                  }
                </ion-select>
              </ion-item>

              <mat-form-field
                appearance="outline"
                class="full-width"
                [attr.title]="'HELP.FROM_DATE_DESC' | translate"
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
                [attr.title]="'HELP.TO_DATE_DESC' | translate"
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

              <ion-item
                fill="outline"
                class="full-width"
                [attr.title]="'HELP.RESCHEDULING_TYPE_DESC' | translate"
              >
                <ion-label position="stacked">{{
                  'HOLIDAYS.RESCHEDULING_TYPE' | translate
                }}</ion-label>
                <ion-select name="reschedulingType" [(ngModel)]="reschedulingType" required>
                  @for (option of reschedulingTypeOptions; track option.id) {
                    <ion-select-option [value]="option.id">{{ option.value }}</ion-select-option>
                  }
                </ion-select>
              </ion-item>

              @if (reschedulingType === 2) {
                <mat-form-field
                  appearance="outline"
                  class="full-width"
                  [attr.title]="'HELP.REPAYMENTS_RESCHEDULED_TO_DESC' | translate"
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

            <ion-item
              fill="outline"
              class="full-width"
              [attr.title]="'HELP.HOLIDAY_DESCRIPTION_DESC' | translate"
            >
              <ion-label position="stacked">{{ 'HOLIDAYS.DESCRIPTION' | translate }}</ion-label>
              <ion-textarea
                name="description"
                [(ngModel)]="holiday.description"
                rows="3"
              ></ion-textarea>
            </ion-item>

            <div class="form-actions">
              <ion-button fill="clear" type="button" (click)="onCancel()" [disabled]="isSaving">
                {{ 'COMMON.CANCEL' | translate }}
              </ion-button>
              <ion-button
                color="primary"
                type="submit"
                [disabled]="holidayForm.invalid || isSaving || selectedOfficeIds.length === 0"
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
    `,
  ],
})
export class HolidayFormComponent implements OnInit {
  private readonly holidaysService = inject(HolidaysService);
  private readonly officesService = inject(OfficesService);
  private readonly router = inject(Router);
  private readonly notifications = inject(NotificationService);

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
        this.notifications.error('Failed to load offices');
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
        this.notifications.success('Holiday created successfully');
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
