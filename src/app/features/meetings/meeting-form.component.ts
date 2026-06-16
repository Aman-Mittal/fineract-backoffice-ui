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
import { MeetingsService, MeetingCreateRequest } from '../../api';
import {
  formatDateToFineract,
  FINERACT_DATE_FORMAT,
  FINERACT_LOCALE,
} from '../../core/utils/date-formatter';

/**
 * Create / edit form for a group/center meeting. The entity type and entity id come
 * from the route; the calendar to attach the meeting to is taken from the meetings
 * template (the entity's collection meeting calendar) but can be overridden.
 */
@Component({
  selector: 'app-meeting-form',
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
          <mat-card-title>
            {{ isEditMode ? ('MEETINGS.EDIT' | translate) : ('MEETINGS.CREATE' | translate) }}
          </mat-card-title>
        </mat-card-header>

        <mat-card-content>
          <form #meetingForm="ngForm" (ngSubmit)="onSubmit()" class="meeting-form">
            <mat-form-field appearance="outline">
              <mat-label>{{ 'MEETINGS.MEETING_DATE' | translate }}</mat-label>
              <input
                matInput
                [matDatepicker]="picker"
                name="meetingDate"
                [(ngModel)]="meetingDate"
                required
              />
              <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
              <mat-datepicker #picker></mat-datepicker>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>{{ 'MEETINGS.CALENDAR_ID' | translate }}</mat-label>
              <input matInput type="number" name="calendarId" [(ngModel)]="calendarId" required />
            </mat-form-field>

            <div class="form-actions">
              <button mat-button type="button" (click)="onCancel()" [disabled]="isSaving">
                {{ 'COMMON.CANCEL' | translate }}
              </button>
              <button
                mat-raised-button
                color="primary"
                type="submit"
                [disabled]="meetingForm.invalid || isSaving"
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
      .meeting-form {
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
export class MeetingFormComponent implements OnInit {
  private readonly meetingsService = inject(MeetingsService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  entityType!: string;
  entityId!: number;
  meetingId: number | null = null;
  isEditMode = false;
  isSaving = false;

  meetingDate: Date | null = null;
  calendarId: number | null = null;

  ngOnInit(): void {
    this.entityType = this.route.snapshot.paramMap.get('entityType') ?? '';
    this.entityId = Number(this.route.snapshot.paramMap.get('entityId'));

    this.meetingsService
      .getEntityTypeEntityIdMeetingsTemplate(this.entityType, this.entityId)
      .subscribe((tpl) => {
        if (this.calendarId == null) {
          this.calendarId = tpl.calendarData?.id ?? null;
        }
      });

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.meetingId = +id;
      this.isEditMode = true;
      this.load();
    }
  }

  load(): void {
    if (!this.meetingId) return;
    this.meetingsService
      .getEntityTypeEntityIdMeetingsMeetingId(this.meetingId, this.entityType, this.entityId)
      .subscribe((data) => {
        this.meetingDate = data.meetingDate ? new Date(data.meetingDate) : null;
        this.calendarId = data.calendarData?.id ?? this.calendarId;
      });
  }

  onSubmit(): void {
    this.isSaving = true;
    const request: MeetingCreateRequest = {
      calendarId: Number(this.calendarId),
      meetingDate: formatDateToFineract(this.meetingDate),
      dateFormat: FINERACT_DATE_FORMAT,
      locale: FINERACT_LOCALE,
    };

    const request$ =
      this.isEditMode && this.meetingId
        ? this.meetingsService.putEntityTypeEntityIdMeetingsMeetingId(
            this.entityType,
            this.entityId,
            this.meetingId,
            request,
          )
        : this.meetingsService.postEntityTypeEntityIdMeetings(
            this.entityType,
            this.entityId,
            request,
          );

    request$.subscribe({
      next: () => this.router.navigate(['/meetings', this.entityType, this.entityId]),
      error: () => (this.isSaving = false),
    });
  }

  onCancel(): void {
    this.router.navigate(['/meetings', this.entityType, this.entityId]);
  }
}
