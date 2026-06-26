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
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {
  ReportMailingJobsService,
  PostReportMailingJobsRequest,
  PutReportMailingJobsRequest,
} from '../../../api';

/**
 * Create / edit form for a report-mailing job. Kept to core fields (name, recipients,
 * subject, report id). The update endpoint accepts the same core fields server-side, so
 * the edit payload is built through a permissive local request shape.
 */
type ReportMailingJobUpdate = PutReportMailingJobsRequest & {
  name?: string;
  description?: string;
  emailRecipients?: string;
  emailSubject?: string;
  stretchyReportId?: number;
  isActive?: boolean;
};

@Component({
  selector: 'app-report-mailing-jobs-form',
  standalone: true,
  imports: [
    FormsModule,
    TranslateModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatButtonModule,
    MatProgressSpinnerModule,
  ],
  template: `
    <div class="form-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>
            {{
              isEditMode
                ? ('REPORT_MAILING_JOBS.EDIT' | translate)
                : ('REPORT_MAILING_JOBS.CREATE' | translate)
            }}
          </mat-card-title>
        </mat-card-header>

        <mat-card-content>
          <form #jobForm="ngForm" (ngSubmit)="onSubmit()" class="entity-form">
            <mat-form-field appearance="outline">
              <mat-label>{{ 'REPORT_MAILING_JOBS.NAME' | translate }}</mat-label>
              <input matInput name="name" [(ngModel)]="job.name" required />
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>{{ 'REPORT_MAILING_JOBS.DESCRIPTION' | translate }}</mat-label>
              <textarea matInput name="description" [(ngModel)]="job.description"></textarea>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>{{ 'REPORT_MAILING_JOBS.EMAIL_RECIPIENTS' | translate }}</mat-label>
              <input matInput name="emailRecipients" [(ngModel)]="job.emailRecipients" required />
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>{{ 'REPORT_MAILING_JOBS.EMAIL_SUBJECT' | translate }}</mat-label>
              <input matInput name="emailSubject" [(ngModel)]="job.emailSubject" required />
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>{{ 'REPORT_MAILING_JOBS.STRETCHY_REPORT_ID' | translate }}</mat-label>
              <input
                matInput
                type="number"
                name="stretchyReportId"
                [(ngModel)]="job.stretchyReportId"
                required
              />
            </mat-form-field>

            <mat-checkbox name="isActive" [(ngModel)]="job.isActive">
              {{ 'REPORT_MAILING_JOBS.IS_ACTIVE' | translate }}
            </mat-checkbox>

            <div class="form-actions">
              <button mat-button type="button" (click)="onCancel()" [disabled]="isSaving">
                {{ 'COMMON.CANCEL' | translate }}
              </button>
              <button
                mat-raised-button
                color="primary"
                type="submit"
                [disabled]="jobForm.invalid || isSaving"
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
      .entity-form {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }
    `,
  ],
})
export class ReportMailingJobsFormComponent implements OnInit {
  private readonly jobsService = inject(ReportMailingJobsService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  private readonly LIST_PATH = '/system/report-mailing-jobs';

  jobId: number | null = null;
  isEditMode = false;
  isSaving = false;

  job: PostReportMailingJobsRequest = {
    name: '',
    emailRecipients: '',
    emailSubject: '',
    isActive: true,
  };

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.jobId = +id;
        this.isEditMode = true;
        this.load();
      }
    });
  }

  load(): void {
    if (!this.jobId) return;
    this.jobsService.getReportmailingjobsEntityId(this.jobId).subscribe((data) => {
      this.job = {
        name: data.name,
        description: data.description,
        emailRecipients: data.emailRecipients,
        emailSubject: data.emailSubject,
        isActive: data.isActive,
      };
    });
  }

  onSubmit(): void {
    this.isSaving = true;
    let request$;
    if (this.isEditMode && this.jobId) {
      const update: ReportMailingJobUpdate = {
        name: this.job.name,
        description: this.job.description,
        emailRecipients: this.job.emailRecipients,
        emailSubject: this.job.emailSubject,
        stretchyReportId: this.job.stretchyReportId,
        isActive: this.job.isActive,
      };
      request$ = this.jobsService.putReportmailingjobsEntityId(this.jobId, update);
    } else {
      request$ = this.jobsService.postReportmailingjobs(this.job);
    }

    request$.subscribe({
      next: () => this.router.navigate([this.LIST_PATH]),
      error: () => (this.isSaving = false),
    });
  }

  onCancel(): void {
    this.router.navigate([this.LIST_PATH]);
  }
}
