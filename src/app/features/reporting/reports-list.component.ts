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
import { DataTableComponent, ColumnDef, CellTemplateDirective } from '../../shared';
import { ReportsService, GetReportsResponse } from '../../api';

/**
 * Component for listing available system reports.
 */
@Component({
  selector: 'app-reports-list',
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
      title="nav.reports"
      helpTextKey="HELP.REPORTS_DESC"
      [columns]="columns"
      [data]="reports"
      [totalRecords]="reports.length"
      [showSearch]="true"
      [localLogic]="true"
    >
      <ng-template appCellTemplate="actions" let-report>
        <button
          mat-icon-button
          color="primary"
          [attr.aria-label]="'COMMON.RUN' | translate"
          matTooltip="Run Report"
          (click)="onRunReport(report)"
        >
          <mat-icon>play_arrow</mat-icon>
        </button>
      </ng-template>
    </app-data-table>
  `,
})
export class ReportsListComponent implements OnInit {
  private readonly reportsService = inject(ReportsService);
  private readonly router = inject(Router);

  readonly columns: ColumnDef[] = [
    { key: 'reportName', label: 'REPORTS.NAME', sortable: true },
    { key: 'reportType', label: 'REPORTS.TYPE', sortable: true },
    { key: 'reportCategory', label: 'REPORTS.CATEGORY', sortable: true },
    { key: 'actions', label: 'COMMON.ACTIONS', sortable: false },
  ];

  reports: GetReportsResponse[] = [];

  ngOnInit(): void {
    this.loadReports();
  }

  private loadReports(): void {
    this.reportsService.getReports().subscribe({
      next: (data) => {
        this.reports = data || [];
      },
      error: (err) => console.error('Failed to load reports', err),
    });
  }

  onRunReport(report: GetReportsResponse): void {
    this.router.navigate(['/reporting/run', report.reportName], {
      queryParams: { type: report.reportType },
    });
  }
}
