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
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { GlobalConfigurationService, PutGlobalConfigurationsRequest } from '../../api';

@Component({
  selector: 'app-edit-configuration-dialog',
  standalone: true,
  imports: [
    FormsModule,
    TranslateModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  template: `
    <h2 mat-dialog-title>
      {{ 'SETTINGS.EDIT_CONFIG_TITLE' | translate: { name: config['name'] } }}
    </h2>
    <mat-dialog-content>
      <div class="config-details">
        @if (config['description']) {
          <p class="description">{{ config['description'] }}</p>
        }
      </div>

      <form #configForm="ngForm" class="config-form">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>{{ 'COMMON.VALUE' | translate }}</mat-label>
          <input matInput type="number" name="value" [(ngModel)]="value" required />
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">{{ 'COMMON.CANCEL' | translate }}</button>
      <button
        mat-raised-button
        color="primary"
        [disabled]="configForm.invalid || isSaving"
        (click)="onSubmit()"
      >
        {{ isSaving ? ('COMMON.SAVING' | translate) : ('COMMON.SAVE' | translate) }}
      </button>
    </mat-dialog-actions>
  `,
  styles: [
    `
      .config-form {
        display: flex;
        flex-direction: column;
        gap: 12px;
        padding-top: 8px;
        min-width: 400px;
      }
      .config-details {
        margin-bottom: 16px;
      }
      .description {
        color: rgba(0, 0, 0, 0.6);
        font-size: 14px;
        line-height: 1.4;
      }
      .full-width {
        width: 100%;
      }
    `,
  ],
})
export class EditConfigurationDialogComponent implements OnInit {
  private readonly configService = inject(GlobalConfigurationService);
  private readonly dialogRef = inject(MatDialogRef<EditConfigurationDialogComponent>);
  private readonly data = inject<{ config: Record<string, unknown> }>(MAT_DIALOG_DATA);

  config = this.data.config;
  value = 0;
  isSaving = false;

  ngOnInit() {
    this.value = this.config['value'] as number;
  }

  onSubmit() {
    this.isSaving = true;
    const request: PutGlobalConfigurationsRequest = {
      value: this.value,
    };

    const configId = this.config['id'] as number;
    this.configService.updateConfiguration1(configId, request).subscribe({
      next: () => this.dialogRef.close({ ...this.config, value: this.value }),
      error: () => (this.isSaving = false),
    });
  }

  onCancel() {
    this.dialogRef.close();
  }
}
