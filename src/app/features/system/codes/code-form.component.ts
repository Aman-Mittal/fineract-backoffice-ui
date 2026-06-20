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

import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CodesService, PostCodesRequest, PutCodesRequest, GetCodesResponse } from '../../../api';

@Component({
  selector: 'app-code-form',
  standalone: true,
  imports: [
    FormsModule,
    TranslateModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
  ],
  template: `
    <div class="form-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>
            {{ isEditMode ? ('CODES.EDIT_TITLE' | translate) : ('CODES.CREATE_TITLE' | translate) }}
          </mat-card-title>
        </mat-card-header>

        <mat-card-content>
          <form #codeForm="ngForm" (ngSubmit)="onSubmit()" class="code-form">
            <mat-form-field appearance="outline">
              <mat-label>{{ 'CODES.NAME' | translate }}</mat-label>
              <input matInput name="name" [(ngModel)]="code.name" required />
            </mat-form-field>

            <div class="form-actions">
              <button mat-button type="button" (click)="onCancel()" [disabled]="isSaving">
                {{ 'CODES.CANCEL' | translate }}
              </button>
              <button
                mat-raised-button
                color="primary"
                type="submit"
                [disabled]="codeForm.invalid || isSaving"
              >
                @if (isSaving) {
                  <mat-spinner
                    diameter="20"
                    style="margin-right: 8px; display: inline-block; vertical-align: middle;"
                  ></mat-spinner>
                  {{ 'COMMON.SAVING' | translate }}
                } @else {
                  {{ 'CODES.SAVE' | translate }}
                }
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
      .code-form {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }
      mat-form-field {
        width: 100%;
      }
      .form-actions {
        display: flex;
        gap: 8px;
        justify-content: flex-end;
      }
    `,
  ],
})
export class CodeFormComponent implements OnInit {
  private readonly codesService = inject(CodesService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  private readonly LIST_PATH = '/system/codes';

  codeId: number | null = null;
  isEditMode = false;
  isSaving = false;

  code: PostCodesRequest = { name: '' };

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.codeId = +id;
        this.isEditMode = true;
        this.loadCodeData();
      }
    });
  }

  loadCodeData(): void {
    if (!this.codeId) return;
    this.codesService.getCodesCodeId(this.codeId).subscribe({
      next: (data: GetCodesResponse) => {
        this.code = { name: data.name };
      },
      error: (err: unknown) => {
        console.error('Failed to load code', err);
      },
    });
  }

  onSubmit(): void {
    this.isSaving = true;

    if (this.isEditMode && this.codeId) {
      const payload: PutCodesRequest = { name: this.code.name };
      this.codesService.putCodesCodeId(this.codeId, payload).subscribe({
        next: () => this.router.navigate([this.LIST_PATH]),
        error: (err: unknown) => {
          console.error('Failed to update code', err);
          this.isSaving = false;
        },
      });
    } else {
      this.codesService.postCodes(this.code).subscribe({
        next: () => this.router.navigate([this.LIST_PATH]),
        error: (err: unknown) => {
          console.error('Failed to create code', err);
          this.isSaving = false;
        },
      });
    }
  }

  onCancel(): void {
    this.router.navigate([this.LIST_PATH]);
  }
}
