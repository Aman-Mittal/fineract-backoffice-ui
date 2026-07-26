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

import { Component, OnInit, inject, signal } from '@angular/core';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { DefaultService } from '../../../api';
import { NotificationService } from '../../../core/services/notification.service';
import { formatDateToFineract, toIsoDate } from '../../../core/utils/date-formatter';
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
  IonTextarea,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-email-campaign-form',
  standalone: true,
  imports: [
    FormsModule,
    RouterModule,
    TranslateModule,
    IonButton,
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
    IonDatetime,
    IonDatetimeButton,
    IonModal,
  ],
  template: `
    <div class="form-container">
      <ion-card>
        <ion-card-header>
          <ion-card-title>
            @if (isEditMode()) {
              {{ 'EMAIL_CAMPAIGNS.EDIT' | translate }}
            } @else {
              {{ 'EMAIL_CAMPAIGNS.CREATE' | translate }}
            }
          </ion-card-title>
        </ion-card-header>

        <ion-card-content>
          <form #campaignForm="ngForm" (ngSubmit)="onSubmit()" class="campaign-form">
            <ion-item fill="outline" class="full-width">
              <ion-label position="stacked">{{ 'EMAIL_CAMPAIGNS.NAME' | translate }}</ion-label>
              <ion-input name="campaignName" [(ngModel)]="campaignName" required></ion-input>
            </ion-item>

            <ion-item fill="outline" class="full-width">
              <ion-label position="stacked">{{ 'EMAIL_CAMPAIGNS.TYPE' | translate }}</ion-label>
              <ion-select name="campaignType" [(ngModel)]="campaignType">
                @for (option of campaignTypeOptions(); track option.id) {
                  <ion-select-option [value]="option.id">{{ option.value }}</ion-select-option>
                }
              </ion-select>
            </ion-item>

            <ion-item fill="outline" class="full-width">
              <ion-label position="stacked">{{ 'EMAIL_CAMPAIGNS.SUBJECT' | translate }}</ion-label>
              <ion-input name="emailSubject" [(ngModel)]="emailSubject"></ion-input>
            </ion-item>

            <ion-item fill="outline" class="full-width">
              <ion-label position="stacked">{{ 'EMAIL_CAMPAIGNS.MESSAGE' | translate }}</ion-label>
              <ion-textarea name="emailMessage" [(ngModel)]="emailMessage" rows="5"></ion-textarea>
            </ion-item>

            <ion-item fill="outline" class="full-width">
              <ion-label position="stacked">{{ 'EMAIL_CAMPAIGNS.SCHEDULE' | translate }}</ion-label>
              <ion-datetime-button datetime="scheduledStartDate-picker"></ion-datetime-button>
              <ion-modal [keepContentsMounted]="true">
                <ng-template>
                  <ion-datetime
                    id="scheduledStartDate-picker"
                    data-testid="scheduledStartDate-picker"
                    presentation="date"
                    name="scheduledStartDate"
                    [(ngModel)]="scheduledStartDate"
                  ></ion-datetime>
                </ng-template>
              </ion-modal>
            </ion-item>

            <div class="form-actions">
              <ion-button fill="clear" type="button" (click)="onCancel()" [disabled]="isSaving()">
                {{ 'COMMON.CANCEL' | translate }}
              </ion-button>
              <ion-button
                color="primary"
                type="submit"
                [disabled]="campaignForm.invalid || isSaving()"
              >
                {{ 'COMMON.SAVE' | translate }}
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
      .campaign-form {
        display: flex;
        flex-direction: column;
        gap: 16px;
        padding-top: 16px;
      }
      .full-width {
        width: 100%;
      }
      .form-actions {
        display: flex;
        gap: 12px;
        justify-content: flex-end;
        padding-top: 8px;
      }
    `,
  ],
})
export class EmailCampaignFormComponent implements OnInit {
  private readonly api = inject(DefaultService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly notifications = inject(NotificationService);

  private readonly LIST_PATH = '/campaigns/email';

  isEditMode = signal(false);
  isSaving = signal(false);
  campaignTypeOptions = signal<{ id: number; value: string }[]>([]);

  private campaignId: number | null = null;

  campaignName = '';
  campaignType: number | null = null;
  emailSubject = '';
  emailMessage = '';
  scheduledStartDate: string | null = null;

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.campaignId = Number(idParam);
      this.isEditMode.set(true);
    }

    this.loadTemplate();
  }

  private loadTemplate(): void {
    this.api.getEmailCampaignTemplate().subscribe({
      next: (raw) => {
        try {
          const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw;
          const options: { id: number; value: string }[] =
            parsed?.campaignTypeOptions ?? parsed?.typeOptions ?? [];
          this.campaignTypeOptions.set(options);
        } catch {
          this.campaignTypeOptions.set([]);
        }
        if (this.isEditMode() && this.campaignId !== null) {
          this.loadExisting(this.campaignId);
        }
      },
      error: (err) => {
        console.error('Failed to load email campaign template', err);
        if (this.isEditMode() && this.campaignId !== null) {
          this.loadExisting(this.campaignId);
        }
      },
    });
  }

  private loadExisting(id: number): void {
    this.api.getEmailCampaignResourceId(id).subscribe({
      next: (raw) => {
        try {
          const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw;
          this.campaignName = parsed?.campaignName ?? '';
          this.campaignType = parsed?.campaignType?.id ?? parsed?.campaignType ?? null;
          this.emailSubject = parsed?.emailSubject ?? '';
          this.emailMessage = parsed?.emailMessage ?? '';
          if (parsed?.recurrenceStartDate) {
            this.scheduledStartDate = toIsoDate(new Date(parsed.recurrenceStartDate));
          }
        } catch {
          console.error('Failed to parse email campaign data');
        }
      },
      error: (err) => {
        console.error('Failed to load email campaign', err);
        this.notifications.error('Failed to load campaign data');
      },
    });
  }

  onSubmit(): void {
    this.isSaving.set(true);

    const payload: Record<string, unknown> = {
      campaignName: this.campaignName,
      campaignType: this.campaignType,
      emailSubject: this.emailSubject,
      emailMessage: this.emailMessage,
      dateFormat: 'dd MMMM yyyy',
      locale: 'en',
    };

    if (this.scheduledStartDate) {
      payload['recurrenceStartDate'] = formatDateToFineract(this.scheduledStartDate);
    }

    const body = JSON.stringify(payload);

    if (this.isEditMode() && this.campaignId !== null) {
      this.api.putEmailCampaignResourceId(this.campaignId, body).subscribe({
        next: () => {
          this.notifications.success('Email campaign updated successfully');
          this.router.navigate([this.LIST_PATH]);
        },
        error: (err) => {
          this.isSaving.set(false);
          console.error('Failed to update email campaign', err);
          this.notifications.error('Failed to update campaign');
        },
      });
    } else {
      this.api.postEmailCampaign(body).subscribe({
        next: () => {
          this.notifications.success('Email campaign created successfully');
          this.router.navigate([this.LIST_PATH]);
        },
        error: (err) => {
          this.isSaving.set(false);
          console.error('Failed to create email campaign', err);
          this.notifications.error('Failed to create campaign');
        },
      });
    }
  }

  onCancel(): void {
    this.router.navigate([this.LIST_PATH]);
  }
}
