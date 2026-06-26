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

import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MixReportService } from '../../../api';

/**
 * Read-only view of the generated MIX (XBRL) report. The endpoint returns the report as
 * an XML string for an optional date range / currency, which is shown verbatim.
 */
@Component({
  selector: 'app-mix-report',
  standalone: true,
  imports: [
    FormsModule,
    TranslateModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
  ],
  template: `
    <div class="report-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>{{ 'MIX_REPORT.TITLE' | translate }}</mat-card-title>
        </mat-card-header>

        <mat-card-content>
          <form #reportForm="ngForm" (ngSubmit)="onGenerate()" class="mix-report-form">
            <mat-form-field appearance="outline">
              <mat-label>{{ 'MIX_REPORT.START_DATE' | translate }}</mat-label>
              <input matInput name="startDate" [(ngModel)]="startDate" placeholder="yyyy-MM-dd" />
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>{{ 'MIX_REPORT.END_DATE' | translate }}</mat-label>
              <input matInput name="endDate" [(ngModel)]="endDate" placeholder="yyyy-MM-dd" />
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>{{ 'MIX_REPORT.CURRENCY' | translate }}</mat-label>
              <input matInput name="currency" [(ngModel)]="currency" />
            </mat-form-field>

            <div class="form-actions">
              <button mat-raised-button color="primary" type="submit" [disabled]="isLoading">
                @if (isLoading) {
                  <mat-spinner
                    diameter="20"
                    style="margin-right: 8px; display: inline-block; vertical-align: middle;"
                  ></mat-spinner>
                  {{ 'MIX_REPORT.GENERATING' | translate }}
                } @else {
                  {{ 'MIX_REPORT.GENERATE' | translate }}
                }
              </button>
            </div>
          </form>

          @if (report) {
            <pre class="mix-report-output">{{ report }}</pre>
          }
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [
    `
      .report-container {
        padding: 24px;
        max-width: 900px;
        margin: 0 auto;
      }
      .mix-report-form {
        display: flex;
        flex-wrap: wrap;
        gap: 16px;
        align-items: center;
      }
      .form-actions {
        display: flex;
        justify-content: flex-end;
      }
      .mix-report-output {
        margin-top: 16px;
        padding: 16px;
        background: rgba(0, 0, 0, 0.04);
        white-space: pre-wrap;
        word-break: break-all;
        max-height: 500px;
        overflow: auto;
      }
    `,
  ],
})
export class MixReportComponent {
  private readonly reportService = inject(MixReportService);

  startDate?: string;
  endDate?: string;
  currency?: string;
  isLoading = false;
  report = '';

  onGenerate(): void {
    this.isLoading = true;
    this.reportService.getMixreport(this.startDate, this.endDate, this.currency).subscribe({
      next: (data: string) => {
        this.report = data || '';
        this.isLoading = false;
      },
      error: (err: unknown) => {
        console.error('Failed to generate MIX report', err);
        this.isLoading = false;
      },
    });
  }
}
