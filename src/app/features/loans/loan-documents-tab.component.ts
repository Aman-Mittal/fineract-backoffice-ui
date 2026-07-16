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

import { Component, Input, OnInit, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import { DocumentsService, DocumentData, BASE_PATH } from '../../api';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';

// Loan-level documents are the evidentiary record for underwriting/servicing
// decisions (signed application, ID proof, collateral photos) — staff need
// to attach them quickly during the same session they're reviewing the loan,
// and pull them back up later without leaving the loan account view.
@Component({
  selector: 'app-loan-documents-tab',
  standalone: true,
  imports: [
    FormsModule,
    TranslateModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatTooltipModule,
  ],
  template: `
    <div class="upload-row">
      <mat-form-field appearance="outline">
        <mat-label>{{ 'COMMON.NAME' | translate }}</mat-label>
        <input matInput [(ngModel)]="newDocName" name="docName" />
      </mat-form-field>
      <mat-form-field appearance="outline" class="description-input">
        <mat-label>{{ 'COMMON.DESCRIPTION' | translate }}</mat-label>
        <input matInput [(ngModel)]="newDocDescription" name="docDescription" />
      </mat-form-field>
      <button mat-stroked-button type="button" (click)="fileInput.click()">
        <mat-icon>attach_file</mat-icon>
        {{ 'LOANS.SELECT_FILE' | translate }}
      </button>
      <input #fileInput type="file" (change)="onFileSelected($event)" style="display: none" />
      <span class="file-name">{{
        selectedFile?.name || ('LOANS.NO_FILE_SELECTED' | translate)
      }}</span>
      <button
        mat-raised-button
        color="primary"
        [disabled]="!selectedFile || isSaving()"
        (click)="onUpload()"
      >
        <mat-icon>upload</mat-icon>
        {{ 'LOANS.UPLOAD' | translate }}
      </button>
    </div>

    @if (isLoading()) {
      <p class="empty-state">{{ 'COMMON.LOADING' | translate }}</p>
    } @else if (documents().length === 0) {
      <p class="empty-state">{{ 'LOANS.NO_DOCUMENTS' | translate }}</p>
    } @else {
      <table mat-table [dataSource]="documents()" class="full-width-table">
        <ng-container matColumnDef="name">
          <th mat-header-cell *matHeaderCellDef>{{ 'COMMON.NAME' | translate }}</th>
          <td mat-cell *matCellDef="let doc">{{ doc.name }}</td>
        </ng-container>
        <ng-container matColumnDef="fileName">
          <th mat-header-cell *matHeaderCellDef>{{ 'LOANS.FILE_NAME' | translate }}</th>
          <td mat-cell *matCellDef="let doc">{{ doc.fileName }}</td>
        </ng-container>
        <ng-container matColumnDef="type">
          <th mat-header-cell *matHeaderCellDef>{{ 'COMMON.TYPE' | translate }}</th>
          <td mat-cell *matCellDef="let doc">{{ doc.type }}</td>
        </ng-container>
        <ng-container matColumnDef="actions">
          <th mat-header-cell *matHeaderCellDef>{{ 'COMMON.ACTIONS' | translate }}</th>
          <td mat-cell *matCellDef="let doc">
            <button
              mat-icon-button
              color="primary"
              (click)="onDownload(doc.id)"
              [matTooltip]="'COMMON.DOWNLOAD' | translate"
            >
              <mat-icon>download</mat-icon>
            </button>
            <button
              mat-icon-button
              color="warn"
              (click)="onDelete(doc.id)"
              [matTooltip]="'COMMON.DELETE' | translate"
            >
              <mat-icon>delete</mat-icon>
            </button>
          </td>
        </ng-container>
        <tr mat-header-row *matHeaderRowDef="columns"></tr>
        <tr mat-row *matRowDef="let row; columns: columns"></tr>
      </table>
    }
  `,
  styles: [
    `
      .upload-row {
        display: flex;
        gap: 12px;
        align-items: center;
        flex-wrap: wrap;
        margin-bottom: 20px;
      }
      .description-input {
        flex: 1;
        min-width: 180px;
      }
      .file-name {
        font-size: 14px;
        color: var(--text-muted, #7f8c8d);
      }
      .full-width-table {
        width: 100%;
      }
      .empty-state {
        color: #95a5a6;
        text-align: center;
        padding: 24px;
      }
    `,
  ],
})
export class LoanDocumentsTabComponent implements OnInit {
  @Input({ required: true }) loanId!: number;

  private readonly documentsService = inject(DocumentsService);
  private readonly dialog = inject(MatDialog);
  private readonly translate = inject(TranslateService);
  private readonly httpClient = inject(HttpClient);
  private readonly basePath = inject(BASE_PATH);

  documents = signal<DocumentData[]>([]);
  isLoading = signal(false);
  isSaving = signal(false);
  selectedFile?: File;
  newDocName = '';
  newDocDescription = '';

  columns = ['name', 'fileName', 'type', 'actions'];

  ngOnInit(): void {
    this.loadDocuments();
  }

  loadDocuments(): void {
    this.isLoading.set(true);
    this.documentsService.getEntityTypeEntityIdDocuments('loans', this.loanId).subscribe({
      next: (data) => {
        this.documents.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to load loan documents', err);
        this.isLoading.set(false);
      },
    });
  }

  onFileSelected(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      this.selectedFile = target.files[0];
      if (!this.newDocName) {
        this.newDocName = this.selectedFile.name;
      }
    }
  }

  onUpload(): void {
    if (!this.selectedFile) return;
    this.isSaving.set(true);

    // The OpenAPI-generated postEntityTypeEntityIdDocuments() has a codegen
    // bug: it computes canConsumeForm but never uses it, so it always sends
    // a plain HttpParams body instead of real multipart/form-data — Fineract
    // rejects that with 415. Post the FormData directly instead; the global
    // authInterceptor still attaches the tenant/auth headers for us.
    const formData = new FormData();
    formData.append('file', this.selectedFile, this.selectedFile.name);
    formData.append('name', this.newDocName || this.selectedFile.name);
    if (this.newDocDescription) {
      formData.append('description', this.newDocDescription);
    }

    this.httpClient.post(`${this.basePath}/v1/loans/${this.loanId}/documents`, formData).subscribe({
      next: () => {
        this.selectedFile = undefined;
        this.newDocName = '';
        this.newDocDescription = '';
        this.isSaving.set(false);
        this.loadDocuments();
      },
      error: (err) => {
        console.error('Failed to upload loan document', err);
        this.isSaving.set(false);
      },
    });
  }

  onDownload(id: number): void {
    this.documentsService
      .getEntityTypeEntityIdDocumentsDocumentIdAttachment('loans', this.loanId, id)
      .subscribe({
        next: (blob: Blob) => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          const doc = this.documents().find((d) => d.id === id);
          a.download = doc?.fileName || 'document';
          a.click();
          window.URL.revokeObjectURL(url);
        },
        error: (err) => console.error('Failed to download loan document', err),
      });
  }

  onDelete(id: number): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: this.translate.instant('COMMON.DELETE'),
        message: this.translate.instant('LOANS.CONFIRM_DELETE_DOCUMENT'),
        destructive: true,
      },
    });
    dialogRef.afterClosed().subscribe((confirmed) => {
      if (!confirmed) return;
      this.documentsService
        .deleteEntityTypeEntityIdDocumentsDocumentId('loans', this.loanId, id)
        .subscribe({
          next: () => this.loadDocuments(),
          error: (err) => console.error('Failed to delete loan document', err),
        });
    });
  }
}
