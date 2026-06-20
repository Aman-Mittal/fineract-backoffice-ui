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
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ClientIdentifierService, ClientIdentifierRequest, CodeValueData } from '../../../api';

@Component({
  selector: 'app-client-identifier-form',
  standalone: true,
  imports: [
    FormsModule,
    TranslateModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
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
                ? ('CLIENTS.EDIT_IDENTIFIER' | translate)
                : ('CLIENTS.ADD_IDENTIFIER' | translate)
            }}
          </mat-card-title>
        </mat-card-header>

        <mat-card-content>
          <form #identifierForm="ngForm" (ngSubmit)="onSubmit()" class="identifier-form">
            <div class="form-grid">
              <mat-form-field appearance="outline">
                <mat-label>{{ 'CLIENTS.DOCUMENT_TYPE' | translate }}</mat-label>
                <mat-select name="documentTypeId" [(ngModel)]="identifier.documentTypeId" required>
                  @for (type of documentTypes(); track type.id) {
                    <mat-option [value]="type.id">{{ type.name }}</mat-option>
                  }
                </mat-select>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>{{ 'CLIENTS.DOCUMENT_KEY' | translate }}</mat-label>
                <input matInput name="documentKey" [(ngModel)]="identifier.documentKey" required />
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>{{ 'COMMON.STATUS' | translate }}</mat-label>
                <mat-select name="status" [(ngModel)]="identifier.status">
                  <mat-option value="Active">Active</mat-option>
                  <mat-option value="Inactive">Inactive</mat-option>
                </mat-select>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>{{ 'COMMON.DESCRIPTION' | translate }}</mat-label>
                <textarea
                  matInput
                  name="description"
                  [(ngModel)]="identifier.description"
                  rows="3"
                ></textarea>
              </mat-form-field>
            </div>

            <div class="form-actions">
              <button mat-button type="button" (click)="onCancel()">
                {{ 'COMMON.CANCEL' | translate }}
              </button>
              <button
                mat-raised-button
                color="primary"
                type="submit"
                [disabled]="!identifierForm.form.valid"
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
        max-width: 800px;
        margin: 0 auto;
      }
      .identifier-form {
        display: flex;
        flex-direction: column;
        gap: 16px;
        padding-top: 16px;
      }
      .form-grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: 16px;
      }
    `,
  ],
})
export class ClientIdentifierFormComponent implements OnInit {
  private readonly identifierService = inject(ClientIdentifierService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  private readonly clientViewPath = '/clients/view';

  clientId!: number;
  identifierId?: number;
  isEditMode = false;
  documentTypes = signal<CodeValueData[]>([]);

  identifier: ClientIdentifierRequest = {
    documentTypeId: undefined,
    documentKey: '',
    description: '',
    status: 'Active',
  };

  ngOnInit(): void {
    this.clientId = Number(this.route.snapshot.paramMap.get('clientId'));
    this.identifierId = Number(this.route.snapshot.paramMap.get('id'));

    this.loadTemplate();

    if (this.identifierId) {
      this.isEditMode = true;
      this.loadIdentifierData();
    }
  }

  loadTemplate(): void {
    this.identifierService
      .getClientsClientIdIdentifiersTemplate(this.clientId)
      .subscribe((data) => {
        this.documentTypes.set(data.allowedDocumentTypes || []);
      });
  }

  loadIdentifierData(): void {
    this.identifierService
      .getClientsClientIdIdentifiersIdentifierId(this.clientId, this.identifierId!)
      .subscribe((data) => {
        this.identifier = {
          documentTypeId: data.documentType?.id,
          documentKey: data.documentKey,
          description: data.description,
          status: (data as Record<string, unknown>)['status'] as string,
        };
      });
  }

  onSubmit(): void {
    if (this.isEditMode) {
      this.identifierService
        .putClientsClientIdIdentifiersIdentifierId(
          this.clientId,
          this.identifierId!,
          this.identifier,
        )
        .subscribe({
          next: () => this.router.navigate([this.clientViewPath, this.clientId]),
          error: (err) => console.error('Failed to update identifier', err),
        });
    } else {
      this.identifierService
        .postClientsClientIdIdentifiers(this.clientId, this.identifier)
        .subscribe({
          next: () => this.router.navigate([this.clientViewPath, this.clientId]),
          error: (err) => console.error('Failed to create identifier', err),
        });
    }
  }

  onCancel(): void {
    this.router.navigate([this.clientViewPath, this.clientId]);
  }
}
