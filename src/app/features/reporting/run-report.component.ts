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

import { Component, OnInit, computed, inject, signal } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { RunReportsService, OfficesService, GetOfficesResponse } from '../../api';
import { HelpIconComponent } from '../../shared';
import { NotificationService } from '../../core/services/notification.service';
import { CdkTableModule } from '@angular/cdk/table';
import { PaginatorComponent } from '../../shared/components/paginator/paginator.component';
import { PageEvent } from '../../shared/models/table.model';
import { toIsoDate } from '../../core/utils/date-formatter';
import { DOWNLOAD } from '../../core/adapters';
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonDatetime,
  IonDatetimeButton,
  IonIcon,
  IonItem,
  IonLabel,
  IonModal,
  IonSelect,
  IonSelectOption,
} from '@ionic/angular/standalone';

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
    IonModal,
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
          <div class="report-parameters form-grid">
            <ion-item fill="outline">
              <ion-label position="stacked">{{ 'COMMON.OFFICE' | translate }}</ion-label>
              <ion-select
                [attr.aria-label]="'COMMON.OFFICE' | translate"
                interface="popover"
                [(ngModel)]="officeId"
              >
                @for (office of offices(); track office.id) {
                  <ion-select-option [value]="office.id">{{ office.name }}</ion-select-option>
                }
              </ion-select>
            </ion-item>

            <ion-item fill="outline">
              <ion-label position="stacked">{{ 'COMMON.FROM_DATE' | translate }}</ion-label>
              <ion-datetime-button datetime="fromDate-picker"></ion-datetime-button>
              <ion-modal [keepContentsMounted]="true">
                <ng-template>
                  <ion-datetime
                    id="fromDate-picker"
                    data-testid="fromDate-picker"
                    presentation="date"
                    name="fromDate"
                    [(ngModel)]="fromDate"
                  ></ion-datetime>
                </ng-template>
              </ion-modal>
            </ion-item>

            <ion-item fill="outline">
              <ion-label position="stacked">{{ 'COMMON.TO_DATE' | translate }}</ion-label>
              <ion-datetime-button datetime="toDate-picker"></ion-datetime-button>
              <ion-modal [keepContentsMounted]="true">
                <ng-template>
                  <ion-datetime
                    id="toDate-picker"
                    data-testid="toDate-picker"
                    presentation="date"
                    name="toDate"
                    [(ngModel)]="toDate"
                  ></ion-datetime>
                </ng-template>
              </ion-modal>
            </ion-item>
          </div>

          <div class="form-actions">
            <ion-button fill="clear" (click)="onCancel()">{{
              'COMMON.CANCEL' | translate
            }}</ion-button>
            <ion-button color="secondary" (click)="onDownloadCSV()" [disabled]="isLoading()">
              <ion-icon name="download-outline"></ion-icon>
              {{ 'REPORTS.DOWNLOAD_CSV' | translate }}
            </ion-button>
            <ion-button color="primary" (click)="onRun()" [disabled]="isLoading()">
              {{ isLoading() ? ('COMMON.LOADING' | translate) : ('REPORTS.RUN' | translate) }}
            </ion-button>
          </div>

          @if (reportData()) {
            <div class="report-results mt-4">
              <hr class="divider" />
              <div class="results-header">
                <h3 class="mt-2">{{ 'REPORTS.RESULTS' | translate }}</h3>
                <ion-button color="primary" (click)="downloadCSV()">
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
        grid-template-columns: repeat(3, 1fr);
        gap: 16px;
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
    `,
  ],
})
export class RunReportComponent implements OnInit {
  private readonly runReportsService = inject(RunReportsService);
  private readonly download = inject(DOWNLOAD);
  private readonly officesService = inject(OfficesService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly notifications = inject(NotificationService);

  readonly reportName = signal('');
  reportType = '';
  readonly isLoading = signal(false);

  officeId: number | undefined = undefined;
  fromDate: string | null = null;
  toDate: string | null = null;

  readonly offices = signal<GetOfficesResponse[]>([]);
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

  onPage(event: PageEvent): void {
    this.pageIndex.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.reportName.set(params.get('reportName') || '');
    });
    this.route.queryParamMap.subscribe((params) => {
      this.reportType = params.get('type') || '';
    });
    this.loadMetadata();
  }

  private loadMetadata(): void {
    this.officesService.getOffices(true).subscribe((data) => {
      this.offices.set(data);
    });
  }

  onDownloadCSV(): void {
    this.isLoading.set(true);
    const formattedFrom = this.fromDate ? toIsoDate(this.fromDate) : undefined;
    const formattedTo = this.toDate ? toIsoDate(this.toDate) : undefined;

    this.runReportsService
      .getRunreportsReportName(
        this.reportName(),
        true, // exportCSV
        undefined, // parameterType
        'CSV', // outputType
        this.officeId?.toString(),
        undefined, // rLoanOfficerId
        formattedFrom,
        formattedTo,
        undefined,
        undefined,
        'body',
        false,
        { httpHeaderAccept: 'text/csv' },
      )
      .subscribe({
        next: (data) => {
          this.download.saveText(
            data as unknown as string,
            this.csvFilename(),
            'text/csv;charset=utf-8;',
          );
          this.isLoading.set(false);
        },
        error: () => {
          this.notifications.error('Operation failed. Please try again.');
          this.isLoading.set(false);
        },
      });
  }

  onRun(): void {
    this.isLoading.set(true);
    const formattedFrom = this.fromDate ? toIsoDate(this.fromDate) : undefined;
    const formattedTo = this.toDate ? toIsoDate(this.toDate) : undefined;

    this.runReportsService
      .getRunreportsReportName(
        this.reportName(),
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
          this.reportData.set(result);
          const columnHeaders = (result['columnHeaders'] as Record<string, unknown>[]) || [];
          this.displayedColumns.set(columnHeaders.map((h) => h['columnName'] as string));
          const dataRows = (result['data'] as Record<string, unknown>[]) || [];
          this.dataRows.set(dataRows);
          this.rows.set(dataRows);
          this.pageIndex.set(0);
          this.isLoading.set(false);
        },
        error: () => {
          this.notifications.error('Operation failed. Please try again.');
          this.isLoading.set(false);
        },
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

  /** Filename shared by both CSV paths, so they cannot drift apart. */
  private csvFilename(): string {
    return `${this.reportName().replace(/\s+/g, '_')}_Report.csv`;
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
}
