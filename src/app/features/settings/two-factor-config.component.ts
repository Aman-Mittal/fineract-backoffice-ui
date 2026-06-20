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
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { DefaultService } from '../../api';

@Component({
  selector: 'app-two-factor-config',
  standalone: true,
  imports: [
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    TranslateModule,
  ],
  template: `
    <div class="two-factor-container">
      <mat-card class="two-factor-card">
        <mat-card-header>
          <mat-card-title>{{ 'TWO_FACTOR_CONFIG.TITLE' | translate }}</mat-card-title>
        </mat-card-header>

        <mat-card-content>
          @if (isLoading) {
            <div class="spinner-wrapper">
              <mat-spinner diameter="48"></mat-spinner>
            </div>
          }

          @if (!isLoading) {
            <form (ngSubmit)="onSave()">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>{{ 'TWO_FACTOR_CONFIG.CONFIG_JSON' | translate }}</mat-label>
                <textarea
                  matInput
                  name="configJson"
                  [(ngModel)]="configJson"
                  rows="14"
                  [disabled]="isSaving"
                ></textarea>
              </mat-form-field>
              <div class="actions">
                <button mat-raised-button color="primary" type="submit" [disabled]="isSaving">
                  @if (isSaving) {
                    <mat-spinner diameter="20" class="inline-spinner"></mat-spinner>
                  }
                  {{ 'TWO_FACTOR_CONFIG.SAVE' | translate }}
                </button>
              </div>
            </form>
          }
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [
    `
      .two-factor-container {
        padding: 24px;
        max-width: 720px;
        margin: 0 auto;
      }
      .two-factor-card {
        width: 100%;
      }
      .spinner-wrapper {
        display: flex;
        justify-content: center;
        padding: 32px 0;
      }
      .full-width {
        width: 100%;
        margin-top: 16px;
      }
      .actions {
        display: flex;
        justify-content: flex-end;
        margin-top: 8px;
      }
      .inline-spinner {
        display: inline-block;
        margin-right: 8px;
      }
    `,
  ],
})
export class TwoFactorConfigComponent implements OnInit {
  private defaultService = inject(DefaultService);
  private snackBar = inject(MatSnackBar);
  private translate = inject(TranslateService);

  configJson = '';
  isLoading = false;
  isSaving = false;

  ngOnInit(): void {
    this.isLoading = true;
    this.defaultService.getTwofactorConfigure().subscribe({
      next: (raw: string) => {
        try {
          const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw;
          this.configJson = JSON.stringify(parsed, null, 2);
        } catch {
          this.configJson = typeof raw === 'string' ? raw : JSON.stringify(raw, null, 2);
        }
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  onSave(): void {
    let parsed: any;
    try {
      parsed = JSON.parse(this.configJson);
    } catch {
      this.translate.get('TWO_FACTOR_CONFIG.PARSE_ERROR').subscribe((msg: string) => {
        this.snackBar.open(msg, 'X', { duration: 4000 });
      });
      return;
    }

    this.isSaving = true;
    this.defaultService.putTwofactorConfigure(parsed).subscribe({
      next: () => {
        this.isSaving = false;
        this.translate.get('TWO_FACTOR_CONFIG.SUCCESS').subscribe((msg: string) => {
          this.snackBar.open(msg, 'X', { duration: 4000 });
        });
      },
      error: () => {
        this.isSaving = false;
      },
    });
  }
}
