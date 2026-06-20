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
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {
  CodeValuesService,
  GetCodeValuesDataResponse,
  PostCodeValuesDataRequest,
  PutCodeValuesDataRequest,
} from '../../../api';

@Component({
  selector: 'app-code-value-form',
  standalone: true,
  imports: [
    FormsModule,
    TranslateModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatButtonModule,
    MatProgressSpinnerModule,
  ],
  template: `
    <div class="form-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>
            {{
              isEditMode
                ? ('CODE_VALUES.EDIT_TITLE' | translate)
                : ('CODE_VALUES.CREATE_TITLE' | translate)
            }}
          </mat-card-title>
        </mat-card-header>

        <mat-card-content>
          <form #codeValueForm="ngForm" (ngSubmit)="onSubmit()" class="code-value-form">
            <mat-form-field appearance="outline">
              <mat-label>{{ 'CODE_VALUES.NAME' | translate }}</mat-label>
              <input matInput name="name" [(ngModel)]="codeValue.name" required />
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>{{ 'CODE_VALUES.DESCRIPTION' | translate }}</mat-label>
              <input matInput name="description" [(ngModel)]="codeValue.description" />
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>{{ 'CODE_VALUES.POSITION' | translate }}</mat-label>
              <input matInput type="number" name="position" [(ngModel)]="codeValue.position" />
            </mat-form-field>

            <div class="checkbox-field">
              <mat-checkbox name="isActive" [(ngModel)]="codeValue.isActive">
                {{ 'CODE_VALUES.ACTIVE' | translate }}
              </mat-checkbox>
            </div>

            <div class="form-actions">
              <button mat-button type="button" (click)="onCancel()" [disabled]="isSaving">
                {{ 'CODE_VALUES.CANCEL' | translate }}
              </button>
              <button
                mat-raised-button
                color="primary"
                type="submit"
                [disabled]="codeValueForm.invalid || isSaving"
              >
                @if (isSaving) {
                  <mat-spinner
                    diameter="20"
                    style="margin-right: 8px; display: inline-block; vertical-align: middle;"
                  ></mat-spinner>
                  {{ 'COMMON.SAVING' | translate }}
                } @else {
                  {{ 'CODE_VALUES.SAVE' | translate }}
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
      .code-value-form {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }
      mat-form-field {
        width: 100%;
      }
      .checkbox-field {
        padding: 4px 0;
      }
      .form-actions {
        display: flex;
        gap: 8px;
        justify-content: flex-end;
      }
    `,
  ],
})
export class CodeValueFormComponent implements OnInit {
  private readonly codeValuesService = inject(CodeValuesService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  codeId = 0;
  codeValueId: number | null = null;
  isEditMode = false;
  isSaving = false;

  codeValue: PostCodeValuesDataRequest = {
    name: '',
    description: '',
    position: undefined,
    isActive: true,
  };

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const codeIdParam = params.get('codeId');
      const codeValueIdParam = params.get('id');

      if (codeIdParam) {
        this.codeId = +codeIdParam;
      }

      if (codeValueIdParam) {
        this.codeValueId = +codeValueIdParam;
        this.isEditMode = true;
        this.loadCodeValueData();
      }
    });
  }

  private get listPath(): string[] {
    return ['/system/codes', String(this.codeId), 'values'];
  }

  loadCodeValueData(): void {
    if (!this.codeValueId) return;
    // Note: API signature is getCodesCodeIdCodevaluesCodeValueId(codeValueId, codeId)
    this.codeValuesService
      .getCodesCodeIdCodevaluesCodeValueId(this.codeValueId, this.codeId)
      .subscribe({
        next: (data: GetCodeValuesDataResponse) => {
          this.codeValue = {
            name: data.name,
            description: data.description,
            position: data.position,
            isActive: data.active,
          };
        },
        error: (err: unknown) => {
          console.error('Failed to load code value', err);
        },
      });
  }

  onSubmit(): void {
    this.isSaving = true;

    if (this.isEditMode && this.codeValueId) {
      const payload: PutCodeValuesDataRequest = {
        name: this.codeValue.name,
        description: this.codeValue.description,
        position: this.codeValue.position,
        isActive: this.codeValue.isActive,
      };
      this.codeValuesService
        .putCodesCodeIdCodevaluesCodeValueId(this.codeId, this.codeValueId, payload)
        .subscribe({
          next: () => this.router.navigate(this.listPath),
          error: (err: unknown) => {
            console.error('Failed to update code value', err);
            this.isSaving = false;
          },
        });
    } else {
      this.codeValuesService.postCodesCodeIdCodevalues(this.codeId, this.codeValue).subscribe({
        next: () => this.router.navigate(this.listPath),
        error: (err: unknown) => {
          console.error('Failed to create code value', err);
          this.isSaving = false;
        },
      });
    }
  }

  onCancel(): void {
    this.router.navigate(this.listPath);
  }
}
