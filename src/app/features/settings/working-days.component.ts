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

import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { WorkingDaysService, WorkingDaysData, WorkingDaysUpdateRequest } from '../../api';
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonCheckbox,
  IonItem,
  IonLabel,
  IonSelect,
  IonSelectOption,
} from '@ionic/angular/standalone';

/**
 * Component for configuring system-wide working days and repayment reschedule rules.
 */
@Component({
  selector: 'app-working-days',
  standalone: true,
  imports: [
    FormsModule,
    TranslateModule,
    MatSnackBarModule,
    IonButton,
    IonItem,
    IonLabel,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonCard,
    IonSelectOption,
    IonSelect,
    IonCheckbox,
  ],
  template: `
    <div class="form-container">
      <ion-card>
        <ion-card-header>
          <ion-card-title>Working Days & Reschedule Rules</ion-card-title>
        </ion-card-header>

        <ion-card-content>
          <form #workingDaysForm="ngForm" (ngSubmit)="onSubmit()" class="working-days-form">
            <div class="days-grid">
              <ion-checkbox name="monday" [(ngModel)]="recurrence['MO']">Monday</ion-checkbox>
              <ion-checkbox name="tuesday" [(ngModel)]="recurrence['TU']">Tuesday</ion-checkbox>
              <ion-checkbox name="wednesday" [(ngModel)]="recurrence['WE']">Wednesday</ion-checkbox>
              <ion-checkbox name="thursday" [(ngModel)]="recurrence['TH']">Thursday</ion-checkbox>
              <ion-checkbox name="friday" [(ngModel)]="recurrence['FR']">Friday</ion-checkbox>
              <ion-checkbox name="saturday" [(ngModel)]="recurrence['SA']">Saturday</ion-checkbox>
              <ion-checkbox name="sunday" [(ngModel)]="recurrence['SU']">Sunday</ion-checkbox>
            </div>

            <div class="reschedule-rules mt-4">
              <ion-item fill="outline" class="full-width">
                <ion-label position="stacked">Repayments Rescheduling Rule</ion-label>
                <ion-select name="rescheduleStrategy" [(ngModel)]="rescheduleId">
                  @for (option of rescheduleOptions; track option['id']) {
                    <ion-select-option [value]="option['id']">{{
                      option['value']
                    }}</ion-select-option>
                  }
                </ion-select>
              </ion-item>

              <ion-checkbox name="extendTerm" [(ngModel)]="extendTerm">
                Extend Term for Daily Repayments
              </ion-checkbox>

              <ion-checkbox
                name="extendTermForRepaymentsOnHolidays"
                [(ngModel)]="extendTermForRepaymentsOnHolidays"
              >
                Extend Term for Repayments on Holidays
              </ion-checkbox>
            </div>

            <div class="form-actions">
              <ion-button color="primary" type="submit" [disabled]="isSaving">
                {{ isSaving ? ('COMMON.SAVING' | translate) : ('COMMON.SAVE' | translate) }}
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
        max-width: 800px;
        margin: 0 auto;
      }
      .days-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 16px;
        padding: 16px 0;
      }
      .full-width {
        width: 100%;
      }
      .mt-4 {
        margin-top: 2rem;
      }
      .form-actions {
        display: flex;
        justify-content: flex-end;
        margin-top: 24px;
      }
    `,
  ],
})
export class WorkingDaysComponent implements OnInit {
  private readonly workingDaysService = inject(WorkingDaysService);
  private readonly snackBar = inject(MatSnackBar);

  workingDays: Record<string, unknown> = {};
  recurrence: Record<string, boolean> = {
    MO: false,
    TU: false,
    WE: false,
    TH: false,
    FR: false,
    SA: false,
    SU: false,
  };
  rescheduleOptions: Record<string, unknown>[] = [];
  rescheduleId: number | undefined = undefined;
  extendTerm = false;
  extendTermForRepaymentsOnHolidays = false;
  isSaving = false;

  ngOnInit(): void {
    this.loadWorkingDays();
  }

  private loadWorkingDays(): void {
    this.workingDaysService.getWorkingdays().subscribe((data: WorkingDaysData) => {
      this.workingDays = data as unknown as Record<string, unknown>;
      const rescheduleType = this.workingDays['repaymentRescheduleType'] as Record<string, unknown>;
      this.rescheduleId = rescheduleType?.['id'] as number;
      this.extendTerm = !!this.workingDays['extendTermForDailyRepayments'];
      this.extendTermForRepaymentsOnHolidays =
        !!this.workingDays['extendTermForRepaymentsOnHolidays'];

      // Reset recurrence object
      Object.keys(this.recurrence).forEach((day) => (this.recurrence[day] = false));

      // Parse recurrence string (e.g. "FREQ=WEEKLY;INTERVAL=1;BYDAY=MO,TU,WE,TH,FR")
      const recurrence = this.workingDays['recurrence'] as string;
      const byDayMatch = recurrence?.match(/BYDAY=([^;]+)/);
      if (byDayMatch) {
        const days = byDayMatch[1].split(',');
        days.forEach((day) => (this.recurrence[day] = true));
      }

      // Load reschedule options from the API template
      this.workingDaysService.getWorkingdaysTemplate().subscribe({
        next: (templateData) => {
          this.rescheduleOptions = (templateData.repaymentRescheduleOptions ||
            []) as unknown as Record<string, unknown>[];
        },
        error: () => {
          // Fallback to static defaults if template API is not available
          this.rescheduleOptions = [
            { id: 1, value: 'Same Day' },
            { id: 2, value: 'Move to Next Working Day' },
            { id: 3, value: 'Move to Previous Working Day' },
          ];
        },
      });
    });
  }

  onSubmit(): void {
    this.isSaving = true;

    const activeDays = Object.keys(this.recurrence)
      .filter((day) => this.recurrence[day])
      .join(',');
    const recurrenceStr = `FREQ=WEEKLY;INTERVAL=1;BYDAY=${activeDays}`;

    const request = {
      recurrence: recurrenceStr,
      repaymentRescheduleType: this.rescheduleId,
      extendTermForDailyRepayments: this.extendTerm,
      extendTermForRepaymentsOnHolidays: this.extendTermForRepaymentsOnHolidays,
      locale: 'en',
    } as unknown as WorkingDaysUpdateRequest;

    this.workingDaysService.putWorkingdays(request).subscribe({
      next: () => {
        this.isSaving = false;
        this.snackBar.open('Working days updated successfully', 'Close', { duration: 3000 });
        this.loadWorkingDays();
      },
      error: () => {
        this.isSaving = false;
        this.snackBar.open('Operation failed. Please try again.', 'Close', { duration: 3000 });
      },
    });
  }
}
