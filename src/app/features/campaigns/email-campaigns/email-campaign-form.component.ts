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
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { DefaultService } from '../../../api';

@Component({
  selector: 'app-email-campaign-form',
  standalone: true,
  imports: [
    FormsModule,
    RouterModule,
    TranslateModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSnackBarModule,
  ],
  template: `
    <div class="form-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>
            @if (isEditMode()) {
              {{ 'EMAIL_CAMPAIGNS.EDIT' | translate }}
            } @else {
              {{ 'EMAIL_CAMPAIGNS.CREATE' | translate }}
            }
          </mat-card-title>
        </mat-card-header>

        <mat-card-content>
          <form #campaignForm="ngForm" (ngSubmit)="onSubmit()" class="campaign-form">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>{{ 'EMAIL_CAMPAIGNS.NAME' | translate }}</mat-label>
              <input matInput name="campaignName" [(ngModel)]="campaignName" required />
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>{{ 'EMAIL_CAMPAIGNS.TYPE' | translate }}</mat-label>
              <mat-select name="campaignType" [(ngModel)]="campaignType">
                @for (option of campaignTypeOptions(); track option.id) {
                  <mat-option [value]="option.id">{{ option.value }}</mat-option>
                }
              </mat-select>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>{{ 'EMAIL_CAMPAIGNS.SUBJECT' | translate }}</mat-label>
              <input matInput name="emailSubject" [(ngModel)]="emailSubject" />
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>{{ 'EMAIL_CAMPAIGNS.MESSAGE' | translate }}</mat-label>
              <textarea matInput name="emailMessage" [(ngModel)]="emailMessage" rows="5"></textarea>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>{{ 'EMAIL_CAMPAIGNS.SCHEDULE' | translate }}</mat-label>
              <input
                matInput
                [matDatepicker]="schedulePicker"
                name="scheduledStartDate"
                [(ngModel)]="scheduledStartDate"
              />
              <mat-datepicker-toggle matSuffix [for]="schedulePicker"></mat-datepicker-toggle>
              <mat-datepicker #schedulePicker></mat-datepicker>
            </mat-form-field>

            <div class="form-actions">
              <button mat-button type="button" (click)="onCancel()" [disabled]="isSaving()">
                {{ 'COMMON.CANCEL' | translate }}
              </button>
              <button
                mat-raised-button
                color="primary"
                type="submit"
                [disabled]="campaignForm.invalid || isSaving()"
              >
                {{ 'COMMON.SAVE' | translate }}
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
  private readonly snackBar = inject(MatSnackBar);

  private readonly LIST_PATH = '/campaigns/email';

  isEditMode = signal(false);
  isSaving = signal(false);
  campaignTypeOptions = signal<{ id: number; value: string }[]>([]);

  private campaignId: number | null = null;

  campaignName = '';
  campaignType: number | null = null;
  emailSubject = '';
  emailMessage = '';
  scheduledStartDate: Date | null = null;

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
            this.scheduledStartDate = new Date(parsed.recurrenceStartDate);
          }
        } catch {
          console.error('Failed to parse email campaign data');
        }
      },
      error: (err) => {
        console.error('Failed to load email campaign', err);
        this.snackBar.open('Failed to load campaign data', 'Close', { duration: 3000 });
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
      payload['recurrenceStartDate'] = this.formatDate(this.scheduledStartDate);
    }

    const body = JSON.stringify(payload);

    if (this.isEditMode() && this.campaignId !== null) {
      this.api.putEmailCampaignResourceId(this.campaignId, body).subscribe({
        next: () => {
          this.snackBar.open('Email campaign updated successfully', 'Close', { duration: 3000 });
          this.router.navigate([this.LIST_PATH]);
        },
        error: (err) => {
          this.isSaving.set(false);
          console.error('Failed to update email campaign', err);
          this.snackBar.open('Failed to update campaign', 'Close', { duration: 3000 });
        },
      });
    } else {
      this.api.postEmailCampaign(body).subscribe({
        next: () => {
          this.snackBar.open('Email campaign created successfully', 'Close', { duration: 3000 });
          this.router.navigate([this.LIST_PATH]);
        },
        error: (err) => {
          this.isSaving.set(false);
          console.error('Failed to create email campaign', err);
          this.snackBar.open('Failed to create campaign', 'Close', { duration: 3000 });
        },
      });
    }
  }

  onCancel(): void {
    this.router.navigate([this.LIST_PATH]);
  }
}
