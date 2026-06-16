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
import { SpmSurveysService, SurveyData } from '../../../api';

/**
 * Lists SPM surveys (poverty / social-performance questionnaires). Surveys are small
 * master-data records, so the table uses local pagination. Each survey links through to
 * its collected scorecards.
 */
@Component({
  selector: 'app-spm-surveys-list',
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
      title="nav.spmSurveys"
      helpTextKey="HELP.SPM_SURVEYS_DESC"
      createButtonLabel="SPM_SURVEYS.CREATE"
      [columns]="columns"
      [data]="surveys"
      [totalRecords]="surveys.length"
      [localLogic]="true"
      (create)="onCreate()"
    >
      <ng-template appCellTemplate="actions" let-row>
        <button
          mat-icon-button
          color="primary"
          [attr.aria-label]="'SCORECARDS.VIEW' | translate"
          [matTooltip]="'SCORECARDS.VIEW' | translate"
          (click)="onScorecards(row)"
        >
          <mat-icon>assessment</mat-icon>
        </button>
        <button
          mat-icon-button
          color="primary"
          [attr.aria-label]="'COMMON.EDIT' | translate"
          [matTooltip]="'COMMON.EDIT' | translate"
          (click)="onEdit(row)"
        >
          <mat-icon>edit</mat-icon>
        </button>
      </ng-template>
    </app-data-table>
  `,
})
export class SpmSurveysListComponent implements OnInit {
  private readonly surveysService = inject(SpmSurveysService);
  private readonly router = inject(Router);

  readonly columns: ColumnDef[] = [
    { key: 'key', label: 'SPM_SURVEYS.KEY', sortable: true },
    { key: 'name', label: 'SPM_SURVEYS.NAME', sortable: true },
    { key: 'countryCode', label: 'SPM_SURVEYS.COUNTRY_CODE', sortable: true },
    { key: 'description', label: 'SPM_SURVEYS.DESCRIPTION', sortable: false },
    { key: 'actions', label: 'COMMON.ACTIONS', sortable: false },
  ];

  surveys: SurveyData[] = [];

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.surveysService.getSurveys().subscribe({
      next: (data: SurveyData[]) => {
        this.surveys = data || [];
      },
      error: (err: unknown) => {
        console.error('Failed to load SPM surveys', err);
      },
    });
  }

  onCreate(): void {
    this.router.navigate(['/spm/surveys/create']);
  }

  onEdit(row: SurveyData): void {
    this.router.navigate(['/spm/surveys/edit', row.id]);
  }

  onScorecards(row: SurveyData): void {
    this.router.navigate(['/spm/surveys', row.id, 'scorecards']);
  }
}
