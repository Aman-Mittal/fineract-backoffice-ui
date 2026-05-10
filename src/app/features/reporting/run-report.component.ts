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
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTableModule } from '@angular/material/table';
import { MatDividerModule } from '@angular/material/divider';
import { RunReportsService, OfficesService, GetOfficesResponse } from '../../api';
import { HelpIconComponent } from '../../shared';

/**
 * Component for running a system report with dynamic parameters.
 */
@Component({
  selector: 'app-run-report',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTooltipModule,
    MatTableModule,
    MatDividerModule,
    HelpIconComponent,
  ],
  template: `
    <div class="form-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>
            {{ 'REPORTS.RUN_TITLE' | translate }}: {{ reportName }}
            <app-help-icon [helpTextKey]="'HELP.REPORTS_DESC'"></app-help-icon>
          </mat-card-title>
        </mat-card-header>

        <mat-card-content>
          <div class="report-parameters form-grid">
            <mat-form-field appearance="outline">
              <mat-label>{{ 'COMMON.OFFICE' | translate }}</mat-label>
              <mat-select [(ngModel)]="officeId">
                @for (office of offices; track office.id) {
                  <mat-option [value]="office.id">{{ office.name }}</mat-option>
                }
              </mat-select>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>{{ 'COMMON.FROM_DATE' | translate }}</mat-label>
              <input matInput [matDatepicker]="fromPicker" [(ngModel)]="fromDate" />
              <mat-datepicker-toggle matSuffix [for]="fromPicker"></mat-datepicker-toggle>
              <mat-datepicker #fromPicker></mat-datepicker>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>{{ 'COMMON.TO_DATE' | translate }}</mat-label>
              <input matInput [matDatepicker]="toPicker" [(ngModel)]="toDate" />
              <mat-datepicker-toggle matSuffix [for]="toPicker"></mat-datepicker-toggle>
              <mat-datepicker #toPicker></mat-datepicker>
            </mat-form-field>
          </div>

          <div class="form-actions">
            <button mat-button (click)="onCancel()">{{ 'COMMON.CANCEL' | translate }}</button>
            <button mat-raised-button color="primary" (click)="onRun()" [disabled]="isLoading">
              {{ isLoading ? ('COMMON.LOADING' | translate) : ('REPORTS.RUN' | translate) }}
            </button>
          </div>

          @if (reportData) {
            <div class="report-results mt-4">
              <mat-divider></mat-divider>
              <h3 class="mt-2">{{ 'REPORTS.RESULTS' | translate }}</h3>

              <div class="table-container mat-elevation-z1">
                <table mat-table [dataSource]="dataRows">
                  @for (col of displayedColumns; track col) {
                    <ng-container [matColumnDef]="col">
                      <th mat-header-cell *matHeaderCellDef>{{ col }}</th>
                      <td mat-cell *matCellDef="let row">{{ row[col] }}</td>
                    </ng-container>
                  }
                  <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
                  <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
                </table>
              </div>
            </div>
          }
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [
    `
      .form-container {
        padding: 24px;
        max-width: 1200px;
        margin: 0 auto;
      }
      .form-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 16px;
      }
      .form-actions {
        display: flex;
        justify-content: flex-end;
        gap: 12px;
        margin-top: 16px;
      }
      .table-container {
        overflow-x: auto;
        margin-top: 16px;
      }
      .mt-4 {
        margin-top: 2rem;
      }
      .mt-2 {
        margin-top: 1rem;
      }
    `,
  ],
})
export class RunReportComponent implements OnInit {
  private readonly runReportsService = inject(RunReportsService);
  private readonly officesService = inject(OfficesService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  reportName = '';
  reportType = '';
  isLoading = false;

  officeId: number | undefined = undefined;
  fromDate: Date | null = null;
  toDate: Date | null = null;

  offices: GetOfficesResponse[] = [];
  reportData: Record<string, unknown> | null = null;
  displayedColumns: string[] = [];
  dataRows: Record<string, unknown>[] = [];

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.reportName = params.get('reportName') || '';
    });
    this.route.queryParamMap.subscribe((params) => {
      this.reportType = params.get('type') || '';
    });
    this.loadMetadata();
  }

  private loadMetadata(): void {
    this.officesService.retrieveOffices(true).subscribe((data) => {
      this.offices = data;
    });
  }

  onRun(): void {
    this.isLoading = true;
    const formattedFrom = this.fromDate
      ? `${this.fromDate.getFullYear()}-${String(this.fromDate.getMonth() + 1).padStart(2, '0')}-${String(this.fromDate.getDate()).padStart(2, '0')}`
      : undefined;
    const formattedTo = this.toDate
      ? `${this.toDate.getFullYear()}-${String(this.toDate.getMonth() + 1).padStart(2, '0')}-${String(this.toDate.getDate()).padStart(2, '0')}`
      : undefined;

    this.runReportsService
      .runReport(
        this.reportName,
        false, // isSelfServiceUserReport
        false, // exportCSV
        undefined, // parameterType
        'HTML', // outputType
        this.officeId?.toString(),
        undefined, // rLoanOfficerId
        formattedFrom,
        formattedTo,
      )
      .subscribe({
        next: (data) => {
          const result = data as unknown as Record<string, unknown>;
          this.reportData = result;
          const columnHeaders = (result['columnHeaders'] as Record<string, unknown>[]) || [];
          this.displayedColumns = columnHeaders.map((h) => h['columnName'] as string);
          this.dataRows = (result['data'] as Record<string, unknown>[]) || [];
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Failed to run report', err);
          this.isLoading = false;
        },
      });
  }

  onCancel(): void {
    this.router.navigate(['/reporting']);
  }
}
