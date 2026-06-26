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
import { MatCardModule } from '@angular/material/card';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ColumnDef, CellTemplateDirective } from '../../../shared';
import { DataTableComponent } from '../../../shared/components/data-table/data-table.component';
import {
  SCHEDULERJOBService,
  SchedulerService,
  GetJobsResponse,
  GetSchedulerResponse,
} from '../../../api';

/**
 * Lists Fineract scheduler jobs (name, active, next run) with a "Run now" action,
 * and surfaces the global scheduler status with a start/stop toggle.
 *
 * The global scheduler is controlled via postScheduler with a `command` query param
 * ('start' | 'stop'); job execution is triggered via postJobsJobId(jobId, 'executeJob').
 */
@Component({
  selector: 'app-scheduler-jobs-list',
  standalone: true,
  imports: [
    TranslateModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatCardModule,
    MatSlideToggleModule,
    DataTableComponent,
    CellTemplateDirective,
  ],
  template: `
    <mat-card class="scheduler-status">
      <div class="status-row">
        <span class="status-label">{{ 'SCHEDULER_JOBS.GLOBAL_STATUS' | translate }}:</span>
        <span>{{
          (schedulerActive ? 'SCHEDULER_JOBS.RUNNING' : 'SCHEDULER_JOBS.STOPPED') | translate
        }}</span>
        <mat-slide-toggle [checked]="schedulerActive" (change)="onToggleScheduler($event.checked)">
          {{ 'SCHEDULER_JOBS.TOGGLE_SCHEDULER' | translate }}
        </mat-slide-toggle>
      </div>
    </mat-card>

    <app-data-table
      title="nav.schedulerJobs"
      helpTextKey="HELP.SCHEDULER_JOBS_DESC"
      [columns]="columns"
      [data]="jobs"
      [totalRecords]="jobs.length"
      [localLogic]="true"
    >
      <ng-template appCellTemplate="active" let-row>
        {{ (row.active ? 'COMMON.YES' : 'COMMON.NO') | translate }}
      </ng-template>
      <ng-template appCellTemplate="actions" let-row>
        <button
          mat-icon-button
          color="primary"
          [attr.aria-label]="'SCHEDULER_JOBS.RUN_NOW' | translate"
          [matTooltip]="'SCHEDULER_JOBS.RUN_NOW' | translate"
          (click)="onRunNow(row)"
        >
          <mat-icon>play_arrow</mat-icon>
        </button>
        <button
          mat-icon-button
          color="primary"
          [attr.aria-label]="'SCHEDULER_JOBS.HISTORY' | translate"
          [matTooltip]="'SCHEDULER_JOBS.HISTORY' | translate"
          (click)="onHistory(row)"
        >
          <mat-icon>history</mat-icon>
        </button>
      </ng-template>
    </app-data-table>
  `,
  styles: [
    `
      .scheduler-status {
        margin: 16px;
      }
      .status-row {
        display: flex;
        align-items: center;
        gap: 16px;
      }
      .status-label {
        font-weight: 600;
      }
    `,
  ],
})
export class SchedulerJobsListComponent implements OnInit {
  private readonly jobService = inject(SCHEDULERJOBService);
  private readonly schedulerService = inject(SchedulerService);
  private readonly router = inject(Router);

  readonly columns: ColumnDef[] = [
    { key: 'displayName', label: 'SCHEDULER_JOBS.NAME', sortable: true },
    { key: 'active', label: 'SCHEDULER_JOBS.ACTIVE', sortable: true },
    { key: 'nextRunTime', label: 'SCHEDULER_JOBS.NEXT_RUN', sortable: true },
    { key: 'actions', label: 'COMMON.ACTIONS', sortable: false },
  ];

  jobs: GetJobsResponse[] = [];
  schedulerActive = false;

  ngOnInit(): void {
    this.loadJobs();
    this.loadSchedulerStatus();
  }

  loadJobs(): void {
    this.jobService.getJobs().subscribe({
      next: (data: GetJobsResponse[]) => {
        this.jobs = data || [];
      },
      error: (err: unknown) => console.error('Failed to load scheduler jobs', err),
    });
  }

  loadSchedulerStatus(): void {
    this.schedulerService.getScheduler().subscribe({
      next: (data: GetSchedulerResponse) => {
        this.schedulerActive = !!data?.active;
      },
      error: (err: unknown) => console.error('Failed to load scheduler status', err),
    });
  }

  onToggleScheduler(checked: boolean): void {
    const command = checked ? 'start' : 'stop';
    this.schedulerService.postScheduler(command).subscribe({
      next: () => this.loadSchedulerStatus(),
      error: (err: unknown) => console.error('Failed to update scheduler', err),
    });
  }

  onRunNow(row: GetJobsResponse): void {
    if (!row.jobId) return;
    this.jobService.postJobsJobId(row.jobId, 'executeJob').subscribe({
      next: () => this.loadJobs(),
      error: (err: unknown) => console.error('Failed to run job', err),
    });
  }

  onHistory(row: GetJobsResponse): void {
    if (!row.jobId) return;
    this.router.navigate(['/system/scheduler-jobs', row.jobId, 'history']);
  }
}
