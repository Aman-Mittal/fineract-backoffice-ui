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
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DatePipe } from '@angular/common';
import {
  BulkImportService,
  ClientService,
  LoansService,
  SavingsAccountService,
  JournalEntriesService,
} from '../../../api';
import { DataTableComponent, ColumnDef, CellTemplateDirective } from '../../../shared';

@Component({
  selector: 'app-bulk-import',
  standalone: true,
  imports: [
    FormsModule,
    TranslateModule,
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    DataTableComponent,
    CellTemplateDirective,
    DatePipe,
  ],
  template: `
    <div class="bulk-import-container">
      <mat-card class="import-config-card">
        <mat-card-header>
          <mat-card-title>{{ 'SYSTEM.BULK_IMPORT' | translate }}</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <div class="config-row">
            <mat-form-field appearance="outline">
              <mat-label>{{ 'SYSTEM.ENTITY_TYPE' | translate }}</mat-label>
              <mat-select [(ngModel)]="selectedEntity" (selectionChange)="onEntityChange()">
                @for (entity of entityTypes; track entity.value) {
                  <mat-option [value]="entity.value">{{ entity.label | translate }}</mat-option>
                }
              </mat-select>
            </mat-form-field>

            <div class="actions">
              <button mat-stroked-button color="primary" (click)="onDownloadTemplate()">
                <mat-icon>download</mat-icon>
                {{ 'SYSTEM.DOWNLOAD_TEMPLATE' | translate }}
              </button>

              <button mat-raised-button color="primary" (click)="fileInput.click()">
                <mat-icon>upload</mat-icon>
                {{ 'SYSTEM.UPLOAD_CSV' | translate }}
              </button>
              <input
                #fileInput
                type="file"
                (change)="onFileSelected($event)"
                style="display: none"
              />
            </div>
          </div>
        </mat-card-content>
      </mat-card>

      <app-data-table
        [title]="'SYSTEM.IMPORT_HISTORY' | translate"
        [columns]="columns"
        [data]="importHistory()"
        [isLoading]="isLoading()"
        [localLogic]="true"
      >
        <ng-template appCellTemplate="importTime" let-row>
          {{ row['importTime'] | date: 'medium' }}
        </ng-template>

        <ng-template appCellTemplate="actions" let-row>
          <button
            mat-icon-button
            color="primary"
            (click)="onDownloadResult(row['importDocumentId'])"
            [matTooltip]="'SYSTEM.DOWNLOAD_RESULT' | translate"
          >
            <mat-icon>file_download</mat-icon>
          </button>
        </ng-template>
      </app-data-table>
    </div>
  `,
  styles: [
    `
      .bulk-import-container {
        padding: 24px;
      }
      .import-config-card {
        margin: 24px;
      }
      .config-row {
        display: flex;
        align-items: center;
        gap: 24px;
        padding-top: 16px;
      }
      .actions {
        display: flex;
        gap: 12px;
      }
      mat-form-field {
        min-width: 250px;
      }
    `,
  ],
})
export class BulkImportComponent implements OnInit {
  private readonly bulkImportService = inject(BulkImportService);
  private readonly clientService = inject(ClientService);
  private readonly loansService = inject(LoansService);
  private readonly savingsService = inject(SavingsAccountService);
  private readonly journalEntriesService = inject(JournalEntriesService);

  entityTypes = [
    { label: 'nav.clients', value: 'clients' },
    { label: 'nav.loans', value: 'loans' },
    { label: 'nav.savingsAccounts', value: 'savingsaccounts' },
    { label: 'nav.chartOfAccounts', value: 'glaccounts' },
  ];

  selectedEntity = 'clients';
  importHistory = signal<Record<string, unknown>[]>([]);
  isLoading = signal<boolean>(false);

  private readonly dateFormat = 'dd MMMM yyyy';

  columns: ColumnDef[] = [
    { key: 'name', label: 'COMMON.NAME', sortable: true },
    { key: 'importTime', label: 'SYSTEM.IMPORT_TIME', sortable: true },
    { key: 'createdBy', label: 'SYSTEM.CREATED_BY', sortable: true },
    { key: 'status', label: 'COMMON.STATUS', sortable: true },
    { key: 'actions', label: 'COMMON.ACTIONS' },
  ];

  ngOnInit(): void {
    this.loadImportHistory();
  }

  onEntityChange(): void {
    this.loadImportHistory();
  }

  loadImportHistory(): void {
    this.isLoading.set(true);
    this.bulkImportService.getImports(this.selectedEntity).subscribe({
      next: (data: unknown) => {
        const result = (typeof data === 'string' ? JSON.parse(data) : data) as Record<
          string,
          unknown
        >[];
        this.importHistory.set(result || []);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to load import history', err);
        this.isLoading.set(false);
      },
    });
  }

  onDownloadTemplate(): void {
    console.log('Download template for', this.selectedEntity);
  }

  onFileSelected(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      const file = target.files[0];
      this.uploadFile(file);
    }
  }

  uploadFile(file: File): void {
    this.isLoading.set(true);
    let upload$: Observable<unknown> | undefined;

    switch (this.selectedEntity) {
      case 'clients':
        upload$ = this.clientService.postClientsUploadtemplate(
          undefined,
          this.dateFormat,
          'en',
          file,
        );
        break;
      case 'loans':
        upload$ = this.loansService.postLoansUploadtemplate(this.dateFormat, 'en', file);
        break;
      case 'savingsaccounts':
        upload$ = this.savingsService.postSavingsaccountsUploadtemplate(
          this.dateFormat,
          'en',
          file,
        );
        break;
      case 'glaccounts':
        upload$ = this.journalEntriesService.postJournalentriesUploadtemplate(
          this.dateFormat,
          'en',
          file,
        );
        break;
    }

    if (upload$) {
      upload$.subscribe({
        next: () => {
          this.loadImportHistory();
        },
        error: (err: unknown) => {
          console.error('Upload failed', err);
          this.isLoading.set(false);
        },
      });
    }
  }

  onDownloadResult(id: string): void {
    this.bulkImportService
      .getImportsDownloadOutputTemplate(Number(id))
      .subscribe((blob: unknown) => {
        const url = window.URL.createObjectURL(blob as Blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `import_result_${id}.xlsx`;
        a.click();
        window.URL.revokeObjectURL(url);
      });
  }
}
