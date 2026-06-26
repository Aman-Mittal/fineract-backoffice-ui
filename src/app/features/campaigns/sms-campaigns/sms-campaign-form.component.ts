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
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { DefaultService, CommandWrapper, SmsCampaignData } from '../../../api';

@Component({
  selector: 'app-sms-campaign-form',
  standalone: true,
  imports: [
    FormsModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatSnackBarModule,
    TranslateModule,
  ],
  template: `
    <mat-card>
      <mat-card-header>
        <mat-card-title>
          {{ (isEditMode ? 'SMS_CAMPAIGNS.EDIT' : 'SMS_CAMPAIGNS.CREATE') | translate }}
        </mat-card-title>
      </mat-card-header>

      <mat-card-content>
        <form #campaignForm="ngForm" (ngSubmit)="onSubmit(campaignForm)">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>{{ 'SMS_CAMPAIGNS.NAME' | translate }}</mat-label>
            <input matInput name="campaignName" [(ngModel)]="model.campaignName" required />
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>{{ 'SMS_CAMPAIGNS.CAMPAIGN_TYPE' | translate }}</mat-label>
            <mat-select name="campaignType" [(ngModel)]="model.campaignType">
              @for (opt of campaignTypeOptions; track opt.id) {
                <mat-option [value]="opt.id">{{ opt.value }}</mat-option>
              }
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>{{ 'SMS_CAMPAIGNS.TRIGGER_TYPE' | translate }}</mat-label>
            <mat-select name="triggerType" [(ngModel)]="model.triggerType">
              @for (opt of triggerTypeOptions; track opt.id) {
                <mat-option [value]="opt.id">{{ opt.value }}</mat-option>
              }
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>{{ 'SMS_CAMPAIGNS.RUN_DAY' | translate }}</mat-label>
            <input
              matInput
              type="number"
              name="runOnDayOfMonth"
              [(ngModel)]="model.runOnDayOfMonth"
              min="1"
              max="31"
            />
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>{{ 'SMS_CAMPAIGNS.MESSAGE' | translate }}</mat-label>
            <textarea
              matInput
              name="message"
              [(ngModel)]="model.message"
              required
              rows="4"
            ></textarea>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Parameterized Message</mat-label>
            <input matInput name="parameterizedMessage" [(ngModel)]="model.parameterizedMessage" />
          </mat-form-field>

          <div class="form-actions">
            <button
              mat-raised-button
              color="primary"
              type="submit"
              [disabled]="campaignForm.invalid"
            >
              {{ 'SMS_CAMPAIGNS.SAVE' | translate }}
            </button>
            <button mat-button type="button" (click)="cancel()">Cancel</button>
          </div>
        </form>
      </mat-card-content>
    </mat-card>
  `,
  styles: [
    `
      .full-width {
        width: 100%;
        margin-bottom: 16px;
      }
      .form-actions {
        display: flex;
        gap: 8px;
        margin-top: 8px;
      }
      mat-card-content {
        padding-top: 16px;
      }
    `,
  ],
})
export class SmsCampaignFormComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly api = inject(DefaultService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly translate = inject(TranslateService);

  isEditMode = false;
  campaignId: number | null = null;

  campaignTypeOptions: { id: number; value: string }[] = [];
  triggerTypeOptions: { id: number; value: string }[] = [];

  model: {
    campaignName: string;
    campaignType: number | null;
    triggerType: number | null;
    runOnDayOfMonth: number | null;
    message: string;
    parameterizedMessage: string;
  } = {
    campaignName: '',
    campaignType: null,
    triggerType: null,
    runOnDayOfMonth: null,
    message: '',
    parameterizedMessage: '',
  };

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isEditMode = true;
      this.campaignId = Number(idParam);
    }

    this.api.getSmscampaignsTemplate().subscribe({
      next: (template: SmsCampaignData) => {
        this.campaignTypeOptions = (template?.campaignTypeOptions ?? []).map((opt) => ({
          id: opt.id ?? 0,
          value: opt.value ?? '',
        }));
        this.triggerTypeOptions = (template?.triggerTypeOptions ?? []).map((opt) => ({
          id: opt.id ?? 0,
          value: opt.value ?? '',
        }));

        if (this.isEditMode && this.campaignId !== null) {
          this.loadCampaign(this.campaignId);
        }
      },
      error: () => {
        if (this.isEditMode && this.campaignId !== null) {
          this.loadCampaign(this.campaignId);
        }
      },
    });
  }

  private loadCampaign(id: number): void {
    this.api.getSmscampaignsResourceId(id).subscribe({
      next: (campaign: SmsCampaignData) => {
        const campaignData = campaign as Record<string, unknown>;
        this.model.campaignName = campaign?.campaignName ?? '';
        this.model.campaignType = campaign?.campaignType?.id ?? null;
        this.model.triggerType = campaign?.triggerType?.id ?? null;
        this.model.runOnDayOfMonth = (campaignData['runOnDayOfMonth'] as number) ?? null;
        this.model.message = (campaignData['message'] as string) ?? '';
        this.model.parameterizedMessage = (campaignData['parameterizedMessage'] as string) ?? '';
      },
    });
  }

  onSubmit(form: NgForm): void {
    if (form.invalid) {
      return;
    }

    const payload = {
      campaignName: this.model.campaignName,
      campaignType: this.model.campaignType,
      triggerType: this.model.triggerType,
      runOnDayOfMonth: this.model.runOnDayOfMonth,
      message: this.model.message,
      parameterizedMessage: this.model.parameterizedMessage,
    };

    if (this.isEditMode && this.campaignId !== null) {
      this.api.putSmscampaignsCampaignId(this.campaignId, payload as CommandWrapper).subscribe({
        next: () => this.onSuccess(),
        error: () => this.onError(),
      });
    } else {
      this.api.postSmscampaigns(payload as CommandWrapper).subscribe({
        next: () => this.onSuccess(),
        error: () => this.onError(),
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/campaigns/sms']);
  }

  private onSuccess(): void {
    const key = this.isEditMode ? 'SMS_CAMPAIGNS.EDIT' : 'SMS_CAMPAIGNS.CREATE';
    this.translate.get(key).subscribe((msg: string) => {
      this.snackBar.open(msg, 'OK', { duration: 3000 });
    });
    this.router.navigate(['/campaigns/sms']);
  }

  private onError(): void {
    this.snackBar.open('An error occurred. Please try again.', 'Close', { duration: 4000 });
  }
}
