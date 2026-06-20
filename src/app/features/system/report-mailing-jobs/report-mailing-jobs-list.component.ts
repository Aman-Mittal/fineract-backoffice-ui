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
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ColumnDef, CellTemplateDirective } from '../../../shared';
import { DataTableComponent } from '../../../shared/components/data-table/data-table.component';
import {
  ReportMailingJobsService,
  GetReportMailingJobsResponse,
  ListReportMailingJobHistoryService,
  ReportMailingJobRunHistoryData,
} from '../../../api';

/**
 * Lists scheduled report-mailing jobs with a Run History tab.
 */
@Component({
  selector: 'app-report-mailing-jobs-list',
  standalone: true,
  imports: [
    DatePipe,
    TranslateModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatTabsModule,
    MatTableModule,
    MatProgressSpinnerModule,
    DataTableComponent,
    CellTemplateDirective,
  ],
  template: `
    <mat-tab-group (selectedTabChange)="onTabChange($event.index)">
      <!-- Jobs tab -->
      <mat-tab [label]="'nav.reportMailingJobs' | translate">
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
      </mat-tab>

      <!-- Run History tab -->
      <mat-tab [label]="'REPORT_MAILING.RUN_HISTORY' | translate">
        <div class="history-container">
          @if (historyLoading) {
            <div class="spinner-wrap">
              <mat-spinner diameter="48"></mat-spinner>
            </div>
          } @else {
            <table mat-table [dataSource]="runHistory()" class="history-table mat-elevation-z2">
              <ng-container matColumnDef="id">
                <th mat-header-cell *matHeaderCellDef>{{ 'COMMON.ID' | translate }}</th>
                <td mat-cell *matCellDef="let row">{{ row.id }}</td>
              </ng-container>

              <ng-container matColumnDef="jobName">
                <th mat-header-cell *matHeaderCellDef>
                  {{ 'REPORT_MAILING_JOBS.NAME' | translate }}
                </th>
                <td mat-cell *matCellDef="let row">{{ row.jobName }}</td>
              </ng-container>

              <ng-container matColumnDef="scheduledFireTime">
                <th mat-header-cell *matHeaderCellDef>
                  {{ 'REPORT_MAILING.SCHEDULED_FIRE_TIME' | translate }}
                </th>
                <td mat-cell *matCellDef="let row">{{ row.scheduledFireTime | date: 'medium' }}</td>
              </ng-container>

              <ng-container matColumnDef="triggerType">
                <th mat-header-cell *matHeaderCellDef>
                  {{ 'REPORT_MAILING.TRIGGER_TYPE' | translate }}
                </th>
                <td mat-cell *matCellDef="let row">{{ row.triggerType }}</td>
              </ng-container>

              <ng-container matColumnDef="status">
                <th mat-header-cell *matHeaderCellDef>{{ 'REPORT_MAILING.STATUS' | translate }}</th>
                <td mat-cell *matCellDef="let row">{{ row.status }}</td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="historyColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: historyColumns"></tr>

              @if (runHistory().length === 0) {
                <tr class="mat-row no-data-row">
                  <td
                    class="mat-cell"
                    [attr.colspan]="historyColumns.length"
                    style="text-align:center;padding:1rem;"
                  >
                    {{ 'COMMON.NO_DATA' | translate }}
                  </td>
                </tr>
              }
            </table>
          }
        </div>
      </mat-tab>
    </mat-tab-group>
  `,
  styles: [
    `
      .history-container {
        padding: 1rem;
      }
      .spinner-wrap {
        display: flex;
        justify-content: center;
        padding: 2rem;
      }
      .history-table {
        width: 100%;
      }
    `,
  ],
})
export class ReportMailingJobsListComponent implements OnInit {
  private readonly jobsService = inject(ReportMailingJobsService);
  private readonly historyService = inject(ListReportMailingJobHistoryService);
  private readonly router = inject(Router);

  readonly columns: ColumnDef[] = [
    { key: 'name', label: 'REPORT_MAILING_JOBS.NAME', sortable: true },
    { key: 'emailRecipients', label: 'REPORT_MAILING_JOBS.EMAIL_RECIPIENTS', sortable: false },
    { key: 'emailSubject', label: 'REPORT_MAILING_JOBS.EMAIL_SUBJECT', sortable: false },
    { key: 'isActive', label: 'REPORT_MAILING_JOBS.IS_ACTIVE', sortable: false },
    { key: 'actions', label: 'COMMON.ACTIONS', sortable: false },
  ];

  readonly historyColumns = ['id', 'jobName', 'scheduledFireTime', 'triggerType', 'status'];

  jobs: GetReportMailingJobsResponse[] = [];

  runHistory = signal<ReportMailingJobRunHistoryData[]>([]);
  historyLoading = false;
  private historyLoaded = false;

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

  onTabChange(index: number): void {
    if (index === 1 && !this.historyLoaded) {
      this.loadRunHistory();
    }
  }

  loadRunHistory(): void {
    this.historyLoading = true;
    this.historyService.getReportmailingjobrunhistory(undefined, 0, 20).subscribe({
      next: (data) => {
        const historyList = Array.isArray(data)
          ? data
          : (((data as Record<string, unknown>)?.[`pageItems`] as
              | ReportMailingJobRunHistoryData[]
              | undefined) ?? []);
        this.runHistory.set(historyList);
        this.historyLoaded = true;
        this.historyLoading = false;
      },
      error: (err: unknown) => {
        console.error('Failed to load run history', err);
        this.historyLoading = false;
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
