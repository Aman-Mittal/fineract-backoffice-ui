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
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { DocumentsService } from '../../../api';

@Component({
  selector: 'app-client-document-form',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    TranslateModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
  ],
  template: `
    <div class="form-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>
            {{
              isEditMode
                ? ('CLIENTS.EDIT_DOCUMENT' | translate)
                : ('CLIENTS.ADD_DOCUMENT' | translate)
            }}
          </mat-card-title>
        </mat-card-header>

        <mat-card-content>
          <form #docForm="ngForm" (ngSubmit)="onSubmit()" class="doc-form">
            <mat-form-field appearance="outline">
              <mat-label>{{ 'COMMON.NAME' | translate }}</mat-label>
              <input matInput name="name" [(ngModel)]="document.name" required />
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>{{ 'COMMON.DESCRIPTION' | translate }}</mat-label>
              <textarea
                matInput
                name="description"
                [(ngModel)]="document.description"
                rows="3"
              ></textarea>
            </mat-form-field>

            @if (!isEditMode) {
              <div class="file-input-container">
                <button mat-stroked-button type="button" (click)="fileInput.click()">
                  <mat-icon>attach_file</mat-icon>
                  {{ 'CLIENTS.SELECT_FILE' | translate }}
                </button>
                <input
                  #fileInput
                  type="file"
                  (change)="onFileSelected($event)"
                  style="display: none"
                  required
                />
                <span class="file-name">{{
                  selectedFile?.name || ('CLIENTS.NO_FILE_SELECTED' | translate)
                }}</span>
              </div>
            }

            <div class="form-actions">
              <button mat-button type="button" (click)="onCancel()">
                {{ 'COMMON.CANCEL' | translate }}
              </button>
              <button
                mat-raised-button
                color="primary"
                type="submit"
                [disabled]="!docForm.form.valid || (!isEditMode && !selectedFile)"
              >
                {{ 'COMMON.SAVE' | translate }}
              </button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [
    `
      .form-container {
        padding: 24px;
        max-width: 600px;
        margin: 0 auto;
      }
      .doc-form {
        display: flex;
        flex-direction: column;
        gap: 16px;
        padding-top: 16px;
      }
      .file-input-container {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-top: 8px;
      }
      .file-name {
        font-size: 14px;
        color: rgba(0, 0, 0, 0.6);
      }
      .form-actions {
        display: flex;
        justify-content: flex-end;
        gap: 12px;
        margin-top: 16px;
      }
    `,
  ],
})
export class ClientDocumentFormComponent implements OnInit {
  private readonly documentService = inject(DocumentsService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  private readonly clientViewPath = '/clients/view';

  clientId!: number;
  docId?: number;
  isEditMode = false;
  selectedFile?: File;

  document = {
    name: '',
    description: '',
  };

  ngOnInit(): void {
    this.clientId = Number(this.route.snapshot.paramMap.get('clientId'));
    this.docId = Number(this.route.snapshot.paramMap.get('id'));

    if (this.docId) {
      this.isEditMode = true;
      this.loadDocumentData();
    }
  }

  loadDocumentData(): void {
    this.documentService
      .getEntityTypeEntityIdDocumentsDocumentId('clients', this.clientId, this.docId!)
      .subscribe((data) => {
        this.document = {
          name: data.name || '',
          description: data.description || '',
        };
      });
  }

  onFileSelected(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      this.selectedFile = target.files[0];
    }
  }

  onSubmit(): void {
    if (this.isEditMode) {
      this.documentService
        .putEntityTypeEntityIdDocumentsDocumentId(
          'clients',
          this.clientId,
          this.docId!,
          undefined, // contentLength
          this.document.description,
          undefined, // file
          this.document.name,
        )
        .subscribe({
          next: () => this.router.navigate([this.clientViewPath, this.clientId]),
          error: (err) => console.error('Failed to update document', err),
        });
    } else {
      this.documentService
        .postEntityTypeEntityIdDocuments(
          'clients',
          this.clientId,
          this.selectedFile!.size,
          this.document.description,
          this.selectedFile!,
          this.document.name,
        )
        .subscribe({
          next: () => this.router.navigate([this.clientViewPath, this.clientId]),
          error: (err) => console.error('Failed to add document', err),
        });
    }
  }

  onCancel(): void {
    this.router.navigate([this.clientViewPath, this.clientId]);
  }
}
