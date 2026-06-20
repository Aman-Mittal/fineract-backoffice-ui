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
import { Router, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { DefaultService } from '../../../api';
import {
  formatDateToFineract,
  FINERACT_DATE_FORMAT,
  FINERACT_LOCALE,
} from '../../../core/utils/date-formatter';

@Component({
  selector: 'app-office-transaction-form',
  standalone: true,
  imports: [
    FormsModule,
    RouterModule,
    TranslateModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSnackBarModule,
  ],
  template: `
    <div class="form-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>{{ 'OFFICE_TRANSACTIONS.CREATE' | translate }}</mat-card-title>
        </mat-card-header>

        <mat-card-content>
          <form #txForm="ngForm" (ngSubmit)="onSubmit()" class="tx-form">
            <div class="form-grid">
              <mat-form-field appearance="outline">
                <mat-label>{{ 'OFFICE_TRANSACTIONS.FROM_OFFICE' | translate }}</mat-label>
                <mat-select name="fromOfficeId" [(ngModel)]="fromOfficeId" required>
                  @for (opt of fromOfficeOptions; track opt.id) {
                    <mat-option [value]="opt.id">{{ opt.name }}</mat-option>
                  }
                </mat-select>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>{{ 'OFFICE_TRANSACTIONS.TO_OFFICE' | translate }}</mat-label>
                <mat-select name="toOfficeId" [(ngModel)]="toOfficeId" required>
                  @for (opt of toOfficeOptions; track opt.id) {
                    <mat-option [value]="opt.id">{{ opt.name }}</mat-option>
                  }
                </mat-select>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>{{ 'OFFICE_TRANSACTIONS.AMOUNT' | translate }}</mat-label>
                <input matInput type="number" name="amount" [(ngModel)]="amount" required min="0" />
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>{{ 'OFFICE_TRANSACTIONS.DATE' | translate }}</mat-label>
                <input
                  matInput
                  [matDatepicker]="picker"
                  name="transactionDate"
                  [(ngModel)]="transactionDate"
                  required
                />
                <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
                <mat-datepicker #picker></mat-datepicker>
              </mat-form-field>

              <mat-form-field appearance="outline" class="full-span">
                <mat-label>{{ 'OFFICE_TRANSACTIONS.DESC' | translate }}</mat-label>
                <input matInput name="description" [(ngModel)]="description" />
              </mat-form-field>
            </div>

            <div class="form-actions">
              <button mat-button type="button" routerLink="/organization/office-transactions">
                {{ 'COMMON.CANCEL' | translate }}
              </button>
              <button
                mat-raised-button
                color="primary"
                type="submit"
                [disabled]="txForm.invalid || isSaving"
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
      .tx-form {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }
      .form-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 16px;
      }
      .full-span {
        grid-column: 1 / -1;
      }
      .form-actions {
        display: flex;
        gap: 8px;
        justify-content: flex-end;
      }
    `,
  ],
})
export class OfficeTransactionFormComponent implements OnInit {
  private readonly api = inject(DefaultService);
  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);

  fromOfficeOptions: { id: number; name: string }[] = [];
  toOfficeOptions: { id: number; name: string }[] = [];

  fromOfficeId: number | null = null;
  toOfficeId: number | null = null;
  amount: number | null = null;
  transactionDate: Date = new Date();
  description = '';
  isSaving = false;

  ngOnInit(): void {
    this.api.getOfficetransactionsTemplate().subscribe({
      next: (raw: string) => {
        try {
          const template = JSON.parse(raw);
          this.fromOfficeOptions = template.fromOfficeOptions || template.officesToOptions || [];
          this.toOfficeOptions = template.toOfficeOptions || template.officesToOptions || [];
        } catch {
          this.fromOfficeOptions = [];
          this.toOfficeOptions = [];
        }
      },
      error: (err: unknown) => {
        console.error('Failed to load office transaction template', err);
      },
    });
  }

  onSubmit(): void {
    if (!this.fromOfficeId || !this.toOfficeId || !this.amount || !this.transactionDate) {
      return;
    }
    this.isSaving = true;

    const body = {
      fromOfficeId: this.fromOfficeId,
      toOfficeId: this.toOfficeId,
      transactionAmount: this.amount,
      transactionDate: formatDateToFineract(this.transactionDate),
      dateFormat: FINERACT_DATE_FORMAT,
      locale: FINERACT_LOCALE,
      description: this.description,
    };

    this.api.postOfficetransactions(JSON.stringify(body)).subscribe({
      next: () => {
        this.snackBar.open('Office transaction created', 'Close', { duration: 3000 });
        this.router.navigate(['/organization/office-transactions']);
      },
      error: (err: unknown) => {
        console.error('Failed to create office transaction', err);
        this.snackBar.open('Failed to create transaction', 'Close', { duration: 3000 });
        this.isSaving = false;
      },
    });
  }
}
