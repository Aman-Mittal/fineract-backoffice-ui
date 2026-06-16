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
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { InstanceModeService, ChangeInstanceModeRequest } from '../../../api';

/**
 * Instance mode: write-only screen exposing the read / write / batch toggles and
 * persisting them via the instance-mode endpoint.
 */
@Component({
  selector: 'app-instance-mode',
  standalone: true,
  imports: [
    FormsModule,
    TranslateModule,
    MatCardModule,
    MatSlideToggleModule,
    MatButtonModule,
    MatProgressSpinnerModule,
  ],
  template: `
    <div class="form-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>{{ 'INSTANCE_MODE.TITLE' | translate }}</mat-card-title>
        </mat-card-header>

        <mat-card-content>
          <div class="toggle-list">
            <mat-slide-toggle [(ngModel)]="mode.readEnabled">
              {{ 'INSTANCE_MODE.READ_ENABLED' | translate }}
            </mat-slide-toggle>
            <mat-slide-toggle [(ngModel)]="mode.writeEnabled">
              {{ 'INSTANCE_MODE.WRITE_ENABLED' | translate }}
            </mat-slide-toggle>
            <mat-slide-toggle [(ngModel)]="mode.batchWorkerEnabled">
              {{ 'INSTANCE_MODE.BATCH_WORKER_ENABLED' | translate }}
            </mat-slide-toggle>
          </div>

          <div class="form-actions">
            <button
              mat-raised-button
              color="primary"
              type="button"
              [disabled]="isSaving"
              (click)="onSave()"
            >
              @if (isSaving) {
                <mat-spinner
                  diameter="20"
                  style="margin-right: 8px; display: inline-block; vertical-align: middle;"
                ></mat-spinner>
                {{ 'COMMON.SAVING' | translate }}
              } @else {
                {{ 'COMMON.SAVE' | translate }}
              }
            </button>
          </div>
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
      .toggle-list {
        display: flex;
        flex-direction: column;
        gap: 16px;
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
export class InstanceModeComponent {
  private readonly service = inject(InstanceModeService);

  mode: ChangeInstanceModeRequest = {
    readEnabled: true,
    writeEnabled: true,
    batchWorkerEnabled: true,
    batchManagerEnabled: true,
  };
  isSaving = false;

  onSave(): void {
    this.isSaving = true;
    this.service.putInstanceMode(this.mode).subscribe({
      next: () => (this.isSaving = false),
      error: () => (this.isSaving = false),
    });
  }
}
