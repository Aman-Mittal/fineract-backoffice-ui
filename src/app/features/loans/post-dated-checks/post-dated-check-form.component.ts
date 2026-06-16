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
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {
  RepaymentWithPostDatedChecksService,
  GetPostDatedChecks,
  UpdatePostDatedCheckRequest,
} from '../../../api';
import {
  formatDateToFineract,
  FINERACT_DATE_FORMAT,
  FINERACT_LOCALE,
} from '../../../core/utils/date-formatter';

/**
 * Edit-only form for a post-dated check on a loan. Loads the existing check from the
 * loan's post-dated check list and submits the changes via PUT. The loan id and check id
 * are taken from the route.
 */
@Component({
  selector: 'app-post-dated-check-form',
  standalone: true,
  imports: [
    FormsModule,
    TranslateModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatProgressSpinnerModule,
  ],
  template: `
    <div class="form-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>{{ 'POST_DATED_CHECKS.EDIT' | translate }}</mat-card-title>
        </mat-card-header>

        <mat-card-content>
          <form #checkForm="ngForm" (ngSubmit)="onSubmit()" class="check-form">
            <mat-form-field appearance="outline">
              <mat-label>{{ 'POST_DATED_CHECKS.NAME' | translate }}</mat-label>
              <input matInput name="name" [(ngModel)]="name" required />
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>{{ 'POST_DATED_CHECKS.AMOUNT' | translate }}</mat-label>
              <input matInput type="number" name="amount" [(ngModel)]="amount" required />
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>{{ 'POST_DATED_CHECKS.ACCOUNT_NO' | translate }}</mat-label>
              <input matInput type="number" name="accountNo" [(ngModel)]="accountNo" required />
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>{{ 'POST_DATED_CHECKS.DATE' | translate }}</mat-label>
              <input
                matInput
                [matDatepicker]="datePicker"
                name="date"
                [(ngModel)]="date"
                required
              />
              <mat-datepicker-toggle matSuffix [for]="datePicker"></mat-datepicker-toggle>
              <mat-datepicker #datePicker></mat-datepicker>
            </mat-form-field>

            <div class="form-actions">
              <button mat-button type="button" (click)="onCancel()" [disabled]="isSaving">
                {{ 'COMMON.CANCEL' | translate }}
              </button>
              <button
                mat-raised-button
                color="primary"
                type="submit"
                [disabled]="checkForm.invalid || isSaving"
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
      .check-form {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }
      mat-form-field {
        width: 100%;
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
export class PostDatedCheckFormComponent implements OnInit {
  private readonly checkService = inject(RepaymentWithPostDatedChecksService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  loanId: number | null = null;
  checkId: number | null = null;
  isSaving = false;

  name = '';
  amount: number | null = null;
  accountNo: number | null = null;
  date: Date | null = null;

  ngOnInit(): void {
    const loanIdParam = this.route.snapshot.paramMap.get('loanId');
    const idParam = this.route.snapshot.paramMap.get('id');
    if (loanIdParam) {
      this.loanId = +loanIdParam;
    }
    if (idParam) {
      this.checkId = +idParam;
      this.load();
    }
  }

  load(): void {
    if (!this.loanId || !this.checkId) return;
    this.checkService.getLoansLoanIdPostdatedchecks(this.loanId).subscribe({
      next: (data: GetPostDatedChecks[]) => {
        const check = (data || []).find((c) => c.id === this.checkId);
        if (check) {
          this.name = check.name ?? '';
          this.amount = check.amount ?? null;
          this.accountNo = check.accountNo ?? null;
          this.date = check.date ? new Date(check.date) : null;
        }
      },
      error: (err: unknown) => console.error('Failed to load post-dated check', err),
    });
  }

  onSubmit(): void {
    if (!this.loanId || !this.checkId) return;
    this.isSaving = true;

    const request: UpdatePostDatedCheckRequest = {
      name: this.name,
      amount: this.amount ?? undefined,
      accountNo: this.accountNo ?? undefined,
      date: formatDateToFineract(this.date),
      dateFormat: FINERACT_DATE_FORMAT,
      locale: FINERACT_LOCALE,
    };

    this.checkService
      .putLoansLoanIdPostdatedchecksPostDatedCheckId(this.checkId, this.loanId, request)
      .subscribe({
        next: () => this.router.navigate(['/loans', this.loanId, 'post-dated-checks']),
        error: () => (this.isSaving = false),
      });
  }

  onCancel(): void {
    this.router.navigate(['/loans', this.loanId, 'post-dated-checks']);
  }
}
