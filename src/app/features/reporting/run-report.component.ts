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

import { CdkTableModule } from '@angular/cdk/table';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonDatetime,
  IonDatetimeButton,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonModal,
  IonNote,
  IonSelect,
  IonSelectOption,
  IonSpinner,
} from '@ionic/angular/standalone';

import { DOWNLOAD } from '../../core/adapters';
import { NotificationService } from '../../core/services/notification.service';
import { toIsoDate } from '../../core/utils/date-formatter';
import { HelpIconComponent } from '../../shared';
import { PaginatorComponent } from '../../shared/components/paginator/paginator.component';
import { PageEvent } from '../../shared/models/table.model';
import {
  ReportExecutionService,
  ReportParameter,
  ReportParameterValues,
} from './report-execution.service';

const SUPPORTED_DISPLAY_TYPES = new Set(['select', 'date', 'text', 'none']);

@Component({
  selector: 'app-run-report',
  standalone: true,
  imports: [
    FormsModule,
    TranslateModule,
    CdkTableModule,
    PaginatorComponent,
    HelpIconComponent,
    IonIcon,
    IonButton,
    IonItem,
    IonLabel,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonCard,
    IonSelectOption,
    IonSelect,
    IonDatetime,
    IonDatetimeButton,
    IonInput,
    IonModal,
    IonNote,
    IonSpinner,
  ],
  template: `
    <div class="form-container">
      <ion-card>
        <ion-card-header>
          <ion-card-title>
            {{ 'REPORTS.RUN_TITLE' | translate }}: {{ reportName() }}
            <app-help-icon [helpTextKey]="'HELP.REPORTS_DESC'"></app-help-icon>
          </ion-card-title>
        </ion-card-header>

        <ion-card-content>
          @if (isParametersLoading()) {
            <div class="parameter-status" data-testid="report-parameters-loading">
              <ion-spinner name="crescent"></ion-spinner>
              <span>{{ 'REPORTS.PARAMETERS_LOADING' | translate }}</span>
            </div>
          } @else if (parameterLoadFailed()) {
            <ion-note color="danger" data-testid="report-parameters-error">
              {{ 'REPORTS.PARAMETERS_LOAD_FAILED' | translate }}
            </ion-note>
          } @else if (unsupportedParameters().length > 0) {
            <ion-note color="danger" data-testid="report-parameters-unsupported">
              {{ 'REPORTS.PARAMETERS_UNSUPPORTED' | translate }}:
              {{ unsupportedParameterNames() }}
            </ion-note>
          }

          <div class="report-parameters form-grid">
            @for (parameter of parameters(); track parameter.queryParameter; let index = $index) {
              @switch (parameter.displayType) {
                @case ('select') {
                  <ion-item
                    fill="outline"
                    [attr.data-testid]="parameterTestId(parameter)"
                    [id]="parameterControlId(parameter, index)"
                  >
                    <ion-label position="stacked">{{ parameter.label }}</ion-label>
                    <ion-select
                      [id]="parameterControlId(parameter, index) + '-select'"
                      [attr.data-testid]="parameterTestId(parameter) + '-select'"
                      [attr.aria-label]="parameter.label"
                      interface="popover"
                      [value]="parameterValue(parameter)"
                      (ionChange)="onParameterChange(parameter, $event)"
                    >
                      @for (option of parameter.options; track option.id) {
                        <ion-select-option [value]="option.id">
                          {{ option.isAll ? ('COMMON.ALL' | translate) : option.name }}
                        </ion-select-option>
                      }
                    </ion-select>
                  </ion-item>
                }
                @case ('date') {
                  <ion-item
                    fill="outline"
                    [attr.data-testid]="parameterTestId(parameter)"
                    [id]="parameterControlId(parameter, index)"
                  >
                    <ion-label position="stacked">{{ parameter.label }}</ion-label>
                    <ion-datetime-button
                      [id]="parameterControlId(parameter, index) + '-button'"
                      [attr.data-testid]="parameterTestId(parameter) + '-button'"
                      [datetime]="parameterDatePickerId(parameter, index)"
                    ></ion-datetime-button>
                    <ion-modal [keepContentsMounted]="true">
                      <ng-template>
                        <ion-datetime
                          presentation="date"
                          [id]="parameterDatePickerId(parameter, index)"
                          [attr.data-testid]="parameterDatePickerId(parameter, index)"
                          [value]="parameterStringValue(parameter)"
                          (ionChange)="onParameterChange(parameter, $event)"
                        ></ion-datetime>
                      </ng-template>
                    </ion-modal>
                  </ion-item>
                }
                @case ('text') {
                  <ion-item
                    fill="outline"
                    [attr.data-testid]="parameterTestId(parameter)"
                    [id]="parameterControlId(parameter, index)"
                  >
                    <ion-label position="stacked">{{ parameter.label }}</ion-label>
                    <ion-input
                      [id]="parameterControlId(parameter, index) + '-input'"
                      [attr.data-testid]="parameterTestId(parameter) + '-input'"
                      type="text"
                      [attr.aria-label]="parameter.label"
                      [value]="parameterStringValue(parameter)"
                      (ionInput)="onParameterChange(parameter, $event)"
                    ></ion-input>
                  </ion-item>
                }
              }
            }
          </div>

          @if (parametersLoaded() && !parameterLoadFailed() && !canRun()) {
            <ion-note data-testid="report-parameters-incomplete">
              {{ 'REPORTS.PARAMETERS_INCOMPLETE' | translate }}
            </ion-note>
          }

          <div class="form-actions">
            <ion-button
              id="cancel-report"
              data-testid="cancel-report"
              fill="clear"
              (click)="onCancel()"
              >{{ 'COMMON.CANCEL' | translate }}</ion-button
            >
            <ion-button
              id="download-report-csv"
              data-testid="download-report-csv"
              color="secondary"
              (click)="onDownloadCSV()"
              [disabled]="!canRun() || isLoading()"
            >
              <ion-icon name="download-outline"></ion-icon>
              {{ 'REPORTS.DOWNLOAD_CSV' | translate }}
            </ion-button>
            <ion-button
              id="run-report"
              data-testid="run-report"
              color="primary"
              (click)="onRun()"
              [disabled]="!canRun() || isLoading()"
            >
              {{ isLoading() ? ('COMMON.LOADING' | translate) : ('REPORTS.RUN' | translate) }}
            </ion-button>
          </div>

          @if (reportData()) {
            <div class="report-results mt-4">
              <hr class="divider" />
              <div class="results-header">
                <h3 class="mt-2">{{ 'REPORTS.RESULTS' | translate }}</h3>
                <ion-button
                  id="download-report-results-csv"
                  data-testid="download-report-results-csv"
                  color="primary"
                  (click)="downloadCSV()"
                >
                  <ion-icon name="download-outline"></ion-icon>
                  {{ 'REPORTS.DOWNLOAD_RESULTS_CSV' | translate }}
                </ion-button>
              </div>
              <div class="table-container">
                <table cdk-table [dataSource]="pagedRows()">
                  @for (col of displayedColumns(); track col; let i = $index) {
                    <ng-container [cdkColumnDef]="col">
                      <th cdk-header-cell *cdkHeaderCellDef>{{ col }}</th>
                      <td cdk-cell *cdkCellDef="let row">{{ getReportCellValue(row, i) }}</td>
                    </ng-container>
                  }
                  <tr cdk-header-row *cdkHeaderRowDef="displayedColumns()"></tr>
                  <tr cdk-row *cdkRowDef="let row; columns: displayedColumns()"></tr>
                </table>
                <app-paginator
                  [length]="dataRows().length"
                  [pageSize]="pageSize()"
                  [pageIndex]="pageIndex()"
                  [pageSizeOptions]="[10, 20, 50, 100]"
                  (page)="onPage($event)"
                ></app-paginator>
              </div>
            </div>
          }
        </ion-card-content>
      </ion-card>
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
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 16px;
      }
      .parameter-status {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 16px;
      }
      ion-note {
        display: block;
        margin: 8px 0 16px;
      }
      .results-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 16px;
        margin-bottom: 8px;
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
      @media (max-width: 900px) {
        .form-grid {
          grid-template-columns: 1fr;
        }
      }
    `,
  ],
})
export class RunReportComponent implements OnInit {
  private readonly reportExecution = inject(ReportExecutionService);
  private readonly download = inject(DOWNLOAD);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly notifications = inject(NotificationService);
  private readonly translate = inject(TranslateService);

  readonly reportName = signal('');
  reportType = '';
  readonly isLoading = signal(false);
  readonly isParametersLoading = signal(false);
  readonly parametersLoaded = signal(false);
  readonly parameterLoadFailed = signal(false);
  readonly parameters = signal<ReportParameter[]>([]);
  readonly parameterValues = signal<Record<string, string | number>>({});

  readonly unsupportedParameters = computed(() =>
    this.parameters().filter((parameter) => !SUPPORTED_DISPLAY_TYPES.has(parameter.displayType)),
  );
  readonly unsupportedParameterNames = computed(() =>
    this.unsupportedParameters()
      .map((parameter) => `${parameter.label} (${parameter.displayType})`)
      .join(', '),
  );
  readonly canRun = computed(
    () =>
      this.parametersLoaded() &&
      !this.parameterLoadFailed() &&
      this.unsupportedParameters().length === 0 &&
      this.parameters().every((parameter) =>
        this.hasValue(this.parameterValues()[parameter.queryParameter]),
      ),
  );

  readonly reportData = signal<Record<string, unknown> | null>(null);
  readonly displayedColumns = signal<string[]>([]);
  readonly dataRows = signal<Record<string, unknown>[]>([]);
  /** Report results are fetched whole, so paging happens client-side. */
  readonly pageIndex = signal(0);
  readonly pageSize = signal(10);
  readonly rows = signal<Record<string, unknown>[]>([]);

  readonly pagedRows = computed(() => {
    const start = this.pageIndex() * this.pageSize();
    return this.rows().slice(start, start + this.pageSize());
  });

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const reportName = params.get('reportName') || '';
      this.reportName.set(reportName);
      this.loadParameters(reportName);
    });
    this.route.queryParamMap.subscribe((params) => {
      this.reportType = params.get('type') || '';
    });
  }

  onPage(event: PageEvent): void {
    this.pageIndex.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
  }

  onParameterChange(parameter: ReportParameter, event: Event): void {
    const detailValue = (event as CustomEvent<{ value?: string | number | null }>).detail?.value;
    const targetValue = (event.target as HTMLInputElement | null)?.value;
    const value = detailValue ?? targetValue;
    if (value !== undefined && value !== null) {
      this.setParameterValue(parameter, value);
    }
  }

  setParameterValue(parameter: ReportParameter, value: string | number): void {
    this.parameterValues.update((current) => ({
      ...current,
      [parameter.queryParameter]: value,
    }));
  }

  parameterValue(parameter: ReportParameter): string | number | undefined {
    return this.parameterValues()[parameter.queryParameter];
  }

  parameterStringValue(parameter: ReportParameter): string | undefined {
    const value = this.parameterValue(parameter);
    return value === undefined ? undefined : String(value);
  }

  parameterControlId(parameter: ReportParameter, index: number): string {
    return `report-parameter-${this.safeIdentifier(parameter.variable)}-${index}`;
  }

  parameterDatePickerId(parameter: ReportParameter, index: number): string {
    return `${this.parameterControlId(parameter, index)}-picker`;
  }

  parameterTestId(parameter: ReportParameter): string {
    return `report-parameter-${this.safeIdentifier(parameter.variable)}`;
  }

  onDownloadCSV(): void {
    if (!this.canRun()) return;
    this.isLoading.set(true);

    this.reportExecution.downloadCsv(this.reportName(), this.collectedValues()).subscribe({
      next: (data) => {
        this.download.saveText(data, this.csvFilename(), 'text/csv;charset=utf-8;');
        this.isLoading.set(false);
      },
      error: () => this.handleRunError(),
    });
  }

  onRun(): void {
    if (!this.canRun()) return;
    this.isLoading.set(true);

    this.reportExecution.runReport(this.reportName(), this.collectedValues()).subscribe({
      next: (data) => {
        const result = data as Record<string, unknown>;
        this.reportData.set(result);
        const columnHeaders = (result['columnHeaders'] as Record<string, unknown>[]) || [];
        this.displayedColumns.set(columnHeaders.map((header) => header['columnName'] as string));
        const dataRows = (result['data'] as Record<string, unknown>[]) || [];
        this.dataRows.set(dataRows);
        this.rows.set(dataRows);
        this.pageIndex.set(0);
        this.isLoading.set(false);
      },
      error: () => this.handleRunError(),
    });
  }

  downloadCSV(): void {
    const displayedColumns = this.displayedColumns();
    const dataRows = this.dataRows();
    if (!displayedColumns.length || !dataRows.length) {
      return;
    }
    const csvRows: string[] = [];
    csvRows.push(displayedColumns.map((col) => `"${col.replace(/"/g, '""')}"`).join(','));

    for (const row of dataRows) {
      const values = displayedColumns.map((_, i) => {
        const val = this.getReportCellValue(row, i);
        return `"${val.replace(/"/g, '""')}"`;
      });
      csvRows.push(values.join(','));
    }

    // The BOM makes Excel read the file as UTF-8; without it, accented client names in a
    // report downloaded on a Windows machine open as mojibake.
    this.download.saveText(
      '\uFEFF' + csvRows.join('\n'),
      this.csvFilename(),
      'text/csv;charset=utf-8;',
    );
  }

  onCancel(): void {
    this.router.navigate(['/reporting']);
  }

  getReportCellValue(row: Record<string, unknown>, index: number): string {
    const rowData = row['row'];
    if (rowData && Array.isArray(rowData)) {
      const val = rowData[index];
      if (val === null || val === undefined) {
        return '';
      }
      if (Array.isArray(val) && val.length >= 3) {
        return new Date(val[0], val[1] - 1, val[2]).toLocaleDateString();
      }
      return String(val);
    }
    return '';
  }

  private loadParameters(reportName: string): void {
    this.isParametersLoading.set(true);
    this.parametersLoaded.set(false);
    this.parameterLoadFailed.set(false);
    this.parameters.set([]);
    this.parameterValues.set({});

    this.reportExecution.getReportParameters(reportName).subscribe({
      next: (parameters) => {
        this.parameters.set(parameters);
        this.parameterValues.set(
          Object.fromEntries(
            parameters
              .filter((parameter) => parameter.displayType === 'none')
              .map((parameter) => [parameter.queryParameter, String(parameter.defaultValue ?? '')]),
          ),
        );
        this.parametersLoaded.set(true);
        this.isParametersLoading.set(false);
      },
      error: () => {
        this.parameterLoadFailed.set(true);
        this.isParametersLoading.set(false);
        this.notifications.error(this.translate.instant('REPORTS.PARAMETERS_LOAD_FAILED'));
      },
    });
  }

  private collectedValues(): ReportParameterValues {
    const current = this.parameterValues();
    return Object.fromEntries(
      this.parameters().map((parameter) => {
        const value = current[parameter.queryParameter];
        return [
          parameter.queryParameter,
          parameter.displayType === 'date' ? toIsoDate(String(value)) : value,
        ];
      }),
    );
  }

  private hasValue(value: string | number | undefined): boolean {
    return value !== undefined && String(value).trim().length > 0;
  }

  private handleRunError(): void {
    this.notifications.error(this.translate.instant('COMMON.ERROR'));
    this.isLoading.set(false);
  }

  private safeIdentifier(value: string): string {
    return value.replace(/[^a-zA-Z0-9_-]/g, '-');
  }

  /** Filename shared by both CSV paths, so they cannot drift apart. */
  private csvFilename(): string {
    return `${this.reportName().replace(/\s+/g, '_')}_Report.csv`;
  }
}
