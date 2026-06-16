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
import { TranslateModule } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ColumnDef, CellTemplateDirective } from '../../../shared';
import { DataTableComponent } from '../../../shared/components/data-table/data-table.component';
import { ReportMailingJobsService, GetReportMailingJobsResponse } from '../../../api';

/**
 * Lists scheduled report-mailing jobs.
 */
@Component({
  selector: 'app-report-mailing-jobs-list',
  standalone: true,
  imports: [
    TranslateModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    DataTableComponent,
    CellTemplateDirective,
  ],
  template: `
    <app-data-table
      title="nav.reportMailingJobs"
      helpTextKey="HELP.REPORT_MAILING_JOBS_DESC"
      createButtonLabel="REPORT_MAILING_JOBS.CREATE"
      [columns]="columns"
      [data]="jobs"
      [totalRecords]="jobs.length"
      [localLogic]="true"
      (create)="onCreate()"
    >
      <ng-template appCellTemplate="isActive" let-row>
        {{ (row.isActive ? 'COMMON.YES' : 'COMMON.NO') | translate }}
      </ng-template>
      <ng-template appCellTemplate="actions" let-row>
        <button
          mat-icon-button
          color="primary"
          [attr.aria-label]="'COMMON.EDIT' | translate"
          [matTooltip]="'COMMON.EDIT' | translate"
          (click)="onEdit(row)"
        >
          <mat-icon>edit</mat-icon>
        </button>
        <button
          mat-icon-button
          color="warn"
          [attr.aria-label]="'COMMON.DELETE' | translate"
          [matTooltip]="'COMMON.DELETE' | translate"
          (click)="onDelete(row)"
        >
          <mat-icon>delete</mat-icon>
        </button>
      </ng-template>
    </app-data-table>
  `,
})
export class ReportMailingJobsListComponent implements OnInit {
  private readonly jobsService = inject(ReportMailingJobsService);
  private readonly router = inject(Router);

  readonly columns: ColumnDef[] = [
    { key: 'name', label: 'REPORT_MAILING_JOBS.NAME', sortable: true },
    { key: 'emailRecipients', label: 'REPORT_MAILING_JOBS.EMAIL_RECIPIENTS', sortable: false },
    { key: 'emailSubject', label: 'REPORT_MAILING_JOBS.EMAIL_SUBJECT', sortable: false },
    { key: 'isActive', label: 'REPORT_MAILING_JOBS.IS_ACTIVE', sortable: false },
    { key: 'actions', label: 'COMMON.ACTIONS', sortable: false },
  ];

  jobs: GetReportMailingJobsResponse[] = [];

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.jobsService.getReportmailingjobs().subscribe({
      next: (data: GetReportMailingJobsResponse[]) => {
        this.jobs = data || [];
      },
      error: (err: unknown) => {
        console.error('Failed to load report-mailing jobs', err);
      },
    });
  }

  onCreate(): void {
    this.router.navigate(['/system/report-mailing-jobs/create']);
  }

  onEdit(row: GetReportMailingJobsResponse): void {
    this.router.navigate(['/system/report-mailing-jobs/edit', row.id]);
  }

  onDelete(row: GetReportMailingJobsResponse): void {
    if (!row.id || !window.confirm('Delete this report-mailing job?')) return;
    this.jobsService.deleteReportmailingjobsEntityId(row.id).subscribe({
      next: () => this.load(),
      error: (err: unknown) => console.error('Failed to delete report-mailing job', err),
    });
  }
}
