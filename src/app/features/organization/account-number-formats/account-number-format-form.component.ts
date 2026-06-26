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
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {
  AccountNumberFormatService,
  EnumOptionData,
  GetAccountNumberFormatsIdResponse,
  GetAccountNumberFormatsResponseTemplate,
  PostAccountNumberFormatsRequest,
  PutAccountNumberFormatsRequest,
} from '../../../api';

@Component({
  selector: 'app-account-number-format-form',
  standalone: true,
  imports: [
    FormsModule,
    TranslateModule,
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
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
                ? ('ACCOUNT_NUMBER_FORMATS.EDIT_TITLE' | translate)
                : ('ACCOUNT_NUMBER_FORMATS.CREATE_TITLE' | translate)
            }}
          </mat-card-title>
        </mat-card-header>

        <mat-card-content>
          <form #formatForm="ngForm" (ngSubmit)="onSubmit()" class="format-form">
            <div class="form-grid">
              <mat-form-field appearance="outline">
                <mat-label>{{ 'ACCOUNT_NUMBER_FORMATS.ACCOUNT_TYPE' | translate }}</mat-label>
                <mat-select
                  name="accountType"
                  [(ngModel)]="format.accountType"
                  (ngModelChange)="onAccountTypeChange($event)"
                  required
                  [disabled]="isEditMode"
                >
                  @for (option of accountTypeOptions; track option.id) {
                    <mat-option [value]="option.id">{{ option.value }}</mat-option>
                  }
                </mat-select>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>{{ 'ACCOUNT_NUMBER_FORMATS.PREFIX_TYPE' | translate }}</mat-label>
                <mat-select
                  name="prefixType"
                  [(ngModel)]="format.prefixType"
                  [disabled]="prefixTypeOptions.length === 0"
                >
                  @for (option of prefixTypeOptions; track option.id) {
                    <mat-option [value]="option.id">{{ option.value }}</mat-option>
                  }
                </mat-select>
              </mat-form-field>
            </div>

            <div class="form-actions">
              <button mat-button type="button" (click)="onCancel()" [disabled]="isSaving">
                {{ 'ACCOUNT_NUMBER_FORMATS.CANCEL' | translate }}
              </button>
              <button
                mat-raised-button
                color="primary"
                type="submit"
                [disabled]="formatForm.invalid || isSaving"
              >
                @if (isSaving) {
                  <mat-spinner
                    diameter="20"
                    style="margin-right: 8px; display: inline-block; vertical-align: middle;"
                  ></mat-spinner>
                  {{ 'COMMON.SAVING' | translate }}
                } @else {
                  {{ 'ACCOUNT_NUMBER_FORMATS.SAVE' | translate }}
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
        max-width: 900px;
        margin: 0 auto;
      }
      .format-form {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }
      .form-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 16px;
      }
      .form-actions {
        display: flex;
        gap: 8px;
        justify-content: flex-end;
      }
    `,
  ],
})
export class AccountNumberFormatFormComponent implements OnInit {
  private readonly accountNumberFormatService = inject(AccountNumberFormatService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  private readonly LIST_PATH = '/organization/account-number-formats';

  isEditMode = false;
  formatId?: number;
  isSaving = false;

  accountTypeOptions: EnumOptionData[] = [];
  prefixTypeOptions: EnumOptionData[] = [];
  allPrefixTypeOptions: Record<string, EnumOptionData[]> = {};

  format: { accountType: number | undefined; prefixType: number | undefined } = {
    accountType: undefined,
    prefixType: undefined,
  };

  private selectedAccountTypeCode = '';

  ngOnInit(): void {
    this.accountNumberFormatService.getAccountnumberformatsTemplate().subscribe({
      next: (template: GetAccountNumberFormatsResponseTemplate) => {
        this.accountTypeOptions = template.accountTypeOptions ?? [];
        this.allPrefixTypeOptions = template.prefixTypeOptions ?? {};
      },
      error: (err: unknown) => {
        console.error('Failed to load account number format template', err);
      },
    });

    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.formatId = +id;
        this.isEditMode = true;
        this.loadExistingFormat(this.formatId);
      }
    });
  }

  private loadExistingFormat(id: number): void {
    this.accountNumberFormatService.getAccountnumberformatsAccountNumberFormatId(id).subscribe({
      next: (data: GetAccountNumberFormatsIdResponse) => {
        this.format.accountType = data.accountType?.id;
        this.format.prefixType = data.prefixType?.id;
        this.selectedAccountTypeCode = data.accountType?.code ?? '';
        this.prefixTypeOptions = this.allPrefixTypeOptions[this.selectedAccountTypeCode] ?? [];
      },
      error: (err: unknown) => {
        console.error('Failed to load account number format', err);
      },
    });
  }

  onAccountTypeChange(selectedId: number | undefined): void {
    if (selectedId == null) {
      this.prefixTypeOptions = [];
      this.selectedAccountTypeCode = '';
      this.format.prefixType = undefined;
      return;
    }
    const matched = this.accountTypeOptions.find((o) => o.id === selectedId);
    this.selectedAccountTypeCode = matched?.code ?? '';
    this.prefixTypeOptions = this.allPrefixTypeOptions[this.selectedAccountTypeCode] ?? [];
    this.format.prefixType = undefined;
  }

  onSubmit(): void {
    this.isSaving = true;
    if (this.isEditMode && this.formatId != null) {
      const payload: PutAccountNumberFormatsRequest = {
        prefixType: this.format.prefixType,
      };
      this.accountNumberFormatService
        .putAccountnumberformatsAccountNumberFormatId(this.formatId, payload)
        .subscribe({
          next: () => this.router.navigate([this.LIST_PATH]),
          error: () => (this.isSaving = false),
        });
    } else {
      const payload: PostAccountNumberFormatsRequest = {
        accountType: this.format.accountType,
        prefixType: this.format.prefixType,
      };
      this.accountNumberFormatService.postAccountnumberformats(payload).subscribe({
        next: () => this.router.navigate([this.LIST_PATH]),
        error: () => (this.isSaving = false),
      });
    }
  }

  onCancel(): void {
    this.router.navigate([this.LIST_PATH]);
  }
}
