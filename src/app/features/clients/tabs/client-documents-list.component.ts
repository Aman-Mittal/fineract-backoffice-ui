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
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import {
  DataTableComponent,
  ColumnDef,
  HasPermissionDirective,
  CellTemplateDirective,
} from '../../../shared';
import { DocumentsService, DocumentData } from '../../../api';

@Component({
  selector: 'app-client-documents-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TranslateModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    DataTableComponent,
    HasPermissionDirective,
    CellTemplateDirective,
  ],
  template: `
    <div class="tab-actions">
      <button
        mat-raised-button
        color="primary"
        [routerLink]="['/clients', clientId, 'documents', 'create']"
        *appHasPermission="'CREATE_DOCUMENT'"
      >
        <mat-icon>upload</mat-icon>
        {{ 'CLIENTS.ADD_DOCUMENT' | translate }}
      </button>
    </div>

    <app-data-table
      [data]="documents()"
      [columns]="columns"
      [isLoading]="isLoading()"
      [localLogic]="true"
    >
      <ng-template appCellTemplate="actions" let-row>
        <div class="action-buttons">
          <button
            mat-icon-button
            color="primary"
            (click)="onDownload(row.id)"
            *appHasPermission="'READ_DOCUMENT'"
            [matTooltip]="'COMMON.DOWNLOAD' | translate"
          >
            <mat-icon>download</mat-icon>
          </button>
          <button
            mat-icon-button
            color="warn"
            (click)="onDelete(row.id)"
            *appHasPermission="'DELETE_DOCUMENT'"
            [matTooltip]="'COMMON.DELETE' | translate"
          >
            <mat-icon>delete</mat-icon>
          </button>
        </div>
      </ng-template>
    </app-data-table>
  `,
  styles: [
    `
      .tab-actions {
        display: flex;
        justify-content: flex-end;
        margin-bottom: 16px;
      }
      .action-buttons {
        display: flex;
        gap: 8px;
      }
    `,
  ],
})
export class ClientDocumentsListComponent implements OnInit {
  @Input({ required: true }) clientId!: number;

  private readonly documentService = inject(DocumentsService);

  documents = signal<DocumentData[]>([]);
  isLoading = signal<boolean>(false);

  columns: ColumnDef[] = [
    {
      key: 'name',
      label: 'COMMON.NAME',
    },
    {
      key: 'fileName',
      label: 'CLIENTS.FILE_NAME',
    },
    {
      key: 'type',
      label: 'COMMON.TYPE',
    },
    {
      key: 'actions',
      label: 'COMMON.ACTIONS',
    },
  ];

  ngOnInit(): void {
    this.loadDocuments();
  }

  loadDocuments(): void {
    this.isLoading.set(true);
    this.documentService.getEntityTypeEntityIdDocuments('clients', this.clientId).subscribe({
      next: (data) => {
        this.documents.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to load client documents', err);
        this.isLoading.set(false);
      },
    });
  }

  onDownload(id: number): void {
    this.documentService
      .getEntityTypeEntityIdDocumentsDocumentIdAttachment('clients', this.clientId, id)
      .subscribe({
        next: (blob) => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          const doc = this.documents().find((d) => d.id === id);
          a.download = doc?.fileName || 'document';
          a.click();
          window.URL.revokeObjectURL(url);
        },
        error: (err) => console.error('Failed to download document', err),
      });
  }

  onDelete(id: number): void {
    if (confirm('Are you sure you want to delete this document?')) {
      this.documentService
        .deleteEntityTypeEntityIdDocumentsDocumentId('clients', this.clientId, id)
        .subscribe({
          next: () => this.loadDocuments(),
          error: (err) => console.error('Failed to delete document', err),
        });
    }
  }
}
