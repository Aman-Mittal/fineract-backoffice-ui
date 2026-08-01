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
import { CalendarService, CalendarRequest, EnumOptionData } from '../../api';
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonDatetime,
  IonDatetimeButton,
  IonInput,
  IonItem,
  IonLabel,
  IonModal,
  IonSelect,
  IonSelectOption,
  IonSpinner,
} from '@ionic/angular/standalone';
import {
  FINERACT_DATE_FORMAT,
  FINERACT_LOCALE,
  formatDateToFineract,
  toIsoDate,
} from '../../core/utils/date-formatter';

/**
 * Create / edit form for a group/center calendar. The entity type and entity id come
 * from the route; the calendar-type options come from the calendar template endpoint.
 * The update endpoint accepts a JSON body string, so the edit request is serialized.
 */
@Component({
  selector: 'app-calendar-form',
  standalone: true,
  imports: [
    FormsModule,
    TranslateModule,
    IonButton,
    IonSpinner,
    IonInput,
    IonItem,
    IonLabel,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonCard,
    IonSelectOption,
    IonSelect,
    IonDatetime,
    IonDatetimeButton,
    IonModal,
  ],
  template: `
    <div class="form-container">
      <ion-card>
        <ion-card-header>
          <ion-card-title>
            {{ isEditMode ? ('CALENDARS.EDIT' | translate) : ('CALENDARS.CREATE' | translate) }}
          </ion-card-title>
        </ion-card-header>

        <ion-card-content>
          <form #calendarForm="ngForm" (ngSubmit)="onSubmit()" class="calendar-form">
            <ion-item fill="outline">
              <ion-label position="stacked">{{ 'CALENDARS.TITLE_FIELD' | translate }}</ion-label>
              <ion-input
                [attr.aria-label]="'CALENDARS.TITLE_FIELD' | translate"
                name="title"
                [(ngModel)]="title"
                required
              ></ion-input>
            </ion-item>

            <ion-item fill="outline">
              <ion-label position="stacked">{{ 'CALENDARS.START_DATE' | translate }}</ion-label>
              <ion-datetime-button datetime="startDate-picker"></ion-datetime-button>
              <ion-modal [keepContentsMounted]="true">
                <ng-template>
                  <ion-datetime
                    id="startDate-picker"
                    data-testid="startDate-picker"
                    presentation="date"
                    name="startDate"
                    [(ngModel)]="startDate"
                    required
                  ></ion-datetime>
                </ng-template>
              </ion-modal>
            </ion-item>

            <ion-item fill="outline">
              <ion-label position="stacked">{{ 'CALENDARS.TYPE' | translate }}</ion-label>
              <ion-select
                [attr.aria-label]="'CALENDARS.TYPE' | translate"
                interface="popover"
                name="typeId"
                [(ngModel)]="typeId"
                required
              >
                @for (opt of typeOptions; track opt.id) {
                  <ion-select-option [value]="opt.id">{{ opt.value }}</ion-select-option>
                }
              </ion-select>
            </ion-item>

            <div class="form-actions">
              <ion-button fill="clear" type="button" (click)="onCancel()" [disabled]="isSaving">
                {{ 'COMMON.CANCEL' | translate }}
              </ion-button>
              <ion-button
                color="primary"
                type="submit"
                [disabled]="calendarForm.invalid || isSaving"
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
        max-width: 600px;
        margin: 0 auto;
      }
      .calendar-form {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }
    `,
  ],
})
export class CalendarFormComponent implements OnInit {
  private readonly calendarService = inject(CalendarService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  entityType!: string;
  entityId!: number;
  calendarId: number | null = null;
  isEditMode = false;
  isSaving = false;

  title = '';
  startDate: string | null = null;
  typeId: string | null = null;
  typeOptions: EnumOptionData[] = [];

  ngOnInit(): void {
    this.entityType = this.route.snapshot.paramMap.get('entityType') ?? '';
    this.entityId = Number(this.route.snapshot.paramMap.get('entityId'));

    this.calendarService
      .getEntityTypeEntityIdCalendarsTemplate(this.entityType, this.entityId)
      .subscribe((tpl) => {
        this.typeOptions = tpl.calendarTypeOptions ?? [];
      });

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.calendarId = +id;
      this.isEditMode = true;
      this.load();
    }
  }

  load(): void {
    if (!this.calendarId) return;
    this.calendarService
      .getEntityTypeEntityIdCalendarsCalendarId(this.calendarId, this.entityType, this.entityId)
      .subscribe((data) => {
        this.title = data.title ?? '';
        this.startDate = data.startDate ? toIsoDate(new Date(data.startDate)) : null;
        this.typeId = data.typeId ?? (data.type?.id != null ? String(data.type.id) : null);
      });
  }

  onSubmit(): void {
    this.isSaving = true;
    const request: CalendarRequest = {
      title: this.title,
      startDate: formatDateToFineract(this.startDate),
      typeId: this.typeId ?? undefined,
      dateFormat: FINERACT_DATE_FORMAT,
      locale: FINERACT_LOCALE,
    };

    const request$ =
      this.isEditMode && this.calendarId
        ? this.calendarService.putEntityTypeEntityIdCalendarsCalendarId(
            this.entityType,
            this.entityId,
            this.calendarId,
            JSON.stringify(request),
          )
        : this.calendarService.postEntityTypeEntityIdCalendars(
            this.entityType,
            this.entityId,
            request,
          );

    request$.subscribe({
      next: () => this.router.navigate(['/calendars', this.entityType, this.entityId]),
      error: () => (this.isSaving = false),
    });
  }

  onCancel(): void {
    this.router.navigate(['/calendars', this.entityType, this.entityId]);
  }
}
