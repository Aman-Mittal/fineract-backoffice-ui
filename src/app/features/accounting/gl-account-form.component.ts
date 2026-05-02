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
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import {
  GeneralLedgerAccountService,
  PostGLAccountsRequest,
  PutGLAccountsRequest,
} from '../../api';

@Component({
  selector: 'app-gl-account-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCheckboxModule,
    MatTooltipModule,
    MatIconModule,
  ],
  template: `
    <div class="form-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>
            {{
              isEditMode
                ? ('ACCOUNTING.EDIT_GL_ACCOUNT' | translate)
                : ('ACCOUNTING.CREATE_GL_ACCOUNT' | translate)
            }}
          </mat-card-title>
        </mat-card-header>

        <mat-card-content>
          <form #accountForm="ngForm" (ngSubmit)="onSubmit()" class="account-form">
            <div class="form-grid">
              <mat-form-field
                appearance="outline"
                [matTooltip]="'HELP.ACCOUNT_NAME_DESC' | translate"
              >
                <mat-label>{{ 'COMMON.NAME' | translate }}</mat-label>
                <input matInput name="name" [(ngModel)]="account.name" required />
              </mat-form-field>

              <mat-form-field appearance="outline" [matTooltip]="'HELP.GL_CODE_DESC' | translate">
                <mat-label>{{ 'ACCOUNTING.GL_CODE' | translate }}</mat-label>
                <input matInput name="glCode" [(ngModel)]="account.glCode" required />
              </mat-form-field>

              <mat-form-field
                appearance="outline"
                [matTooltip]="'HELP.ACCOUNT_TYPE_DESC' | translate"
              >
                <mat-label>{{ 'ACCOUNTING.ACCOUNT_TYPE' | translate }}</mat-label>
                <mat-select name="type" [(ngModel)]="account.type" required>
                  <mat-option [value]="1">{{ 'ACCOUNTING.ASSET' | translate }}</mat-option>
                  <mat-option [value]="2">{{ 'ACCOUNTING.LIABILITY' | translate }}</mat-option>
                  <mat-option [value]="3">{{ 'ACCOUNTING.EQUITY' | translate }}</mat-option>
                  <mat-option [value]="4">{{ 'ACCOUNTING.INCOME' | translate }}</mat-option>
                  <mat-option [value]="5">{{ 'ACCOUNTING.EXPENSE' | translate }}</mat-option>
                </mat-select>
              </mat-form-field>

              <mat-form-field
                appearance="outline"
                [matTooltip]="'HELP.ACCOUNT_USAGE_DESC' | translate"
              >
                <mat-label>{{ 'ACCOUNTING.ACCOUNT_USAGE' | translate }}</mat-label>
                <mat-select name="usage" [(ngModel)]="account.usage" required>
                  <mat-option [value]="1">{{ 'ACCOUNTING.DETAIL' | translate }}</mat-option>
                  <mat-option [value]="2">{{ 'ACCOUNTING.HEADER' | translate }}</mat-option>
                </mat-select>
              </mat-form-field>

              <mat-form-field
                appearance="outline"
                [matTooltip]="'HELP.DESCRIPTION_DESC' | translate"
                class="full-width"
              >
                <mat-label>{{ 'PRODUCTS.DESCRIPTION' | translate }}</mat-label>
                <textarea
                  matInput
                  name="description"
                  [(ngModel)]="account.description"
                  rows="3"
                ></textarea>
              </mat-form-field>

              <div class="checkbox-container">
                <mat-checkbox
                  name="manualEntriesAllowed"
                  [(ngModel)]="account.manualEntriesAllowed"
                >
                  {{ 'ACCOUNTING.ALLOW_MANUAL_ENTRIES' | translate }}
                </mat-checkbox>
                <mat-icon
                  [matTooltip]="'HELP.ALLOW_MANUAL_ENTRIES_DESC' | translate"
                  class="help-icon"
                  >help_outline</mat-icon
                >
              </div>
            </div>

            <div class="form-actions">
              <button mat-button type="button" (click)="onCancel()">
                {{ 'COMMON.CANCEL' | translate }}
              </button>
              <button
                mat-raised-button
                color="primary"
                type="submit"
                [disabled]="accountForm.invalid || isSaving"
              >
                {{ isSaving ? ('COMMON.SAVING' | translate) : ('COMMON.SAVE' | translate) }}
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
      .account-form {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }
      .form-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 16px;
      }
      .full-width {
        grid-column: span 2;
      }
      mat-form-field {
        width: 100%;
      }
      .checkbox-container {
        display: flex;
        align-items: center;
        gap: 8px;
        height: 60px;
      }
      .form-actions {
        display: flex;
        justify-content: flex-end;
        gap: 12px;
        margin-top: 16px;
      }
      .help-icon {
        font-size: 18px;
        width: 18px;
        height: 18px;
        color: #7f8c8d;
        cursor: help;
      }
    `,
  ],
})
export class GLAccountFormComponent implements OnInit {
  private readonly accountService = inject(GeneralLedgerAccountService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  private readonly LIST_PATH = '/accounting/chart-of-accounts';

  accountId: number | null = null;
  isEditMode = false;
  isSaving = false;

  account: PostGLAccountsRequest = {
    manualEntriesAllowed: true,
  };

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.accountId = +id;
        this.isEditMode = true;
        this.loadAccountData();
      }
    });
  }

  loadAccountData() {
    if (!this.accountId) return;
    this.accountService.retreiveAccount(this.accountId).subscribe((data) => {
      this.account = {
        name: data.name,
        glCode: data.glCode,
        type: data.type?.id,
        usage: data.usage?.id,
        description: data.description,
        manualEntriesAllowed: data.manualEntriesAllowed,
      };
    });
  }

  onSubmit() {
    this.isSaving = true;
    if (this.isEditMode && this.accountId) {
      this.accountService
        .updateGLAccount1(this.accountId, this.account as PutGLAccountsRequest)
        .subscribe({
          next: () => this.router.navigate([this.LIST_PATH]),
          error: () => (this.isSaving = false),
        });
    } else {
      this.accountService.createGLAccount1(this.account).subscribe({
        next: () => this.router.navigate([this.LIST_PATH]),
        error: () => (this.isSaving = false),
      });
    }
  }

  onCancel() {
    this.router.navigate([this.LIST_PATH]);
  }
}
