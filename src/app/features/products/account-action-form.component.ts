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
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Observable } from 'rxjs';
import {
  SavingsAccountService,
  FixedDepositAccountService,
  RecurringDepositAccountService,
  LoansService,
} from '../../api';

@Component({
  selector: 'app-account-action-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
  ],
  template: `
    <div class="form-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>{{ title | translate }}</mat-card-title>
        </mat-card-header>

        <mat-card-content>
          <form #actionForm="ngForm" (ngSubmit)="onSubmit()" class="action-form">
            <div class="form-grid">
              <mat-form-field appearance="outline">
                <mat-label>{{ dateLabel | translate }}</mat-label>
                <input
                  matInput
                  [matDatepicker]="picker"
                  name="actionDate"
                  [(ngModel)]="actionDate"
                  required
                />
                <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
                <mat-datepicker #picker></mat-datepicker>
              </mat-form-field>

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>{{ 'COMMON.NOTE' | translate }}</mat-label>
                <textarea matInput name="note" [(ngModel)]="note" rows="3"></textarea>
              </mat-form-field>
            </div>

            <div class="form-actions">
              <button mat-button type="button" (click)="onCancel()" [disabled]="isSaving">
                {{ 'COMMON.CANCEL' | translate }}
              </button>
              <button
                mat-raised-button
                color="primary"
                type="submit"
                [disabled]="actionForm.invalid || isSaving"
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
      .action-form {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }
      .form-grid {
        display: grid;
        grid-template-columns: 1fr;
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
export class AccountActionFormComponent implements OnInit {
  private readonly savingsService = inject(SavingsAccountService);
  private readonly fixedDepositService = inject(FixedDepositAccountService);
  private readonly recurringDepositService = inject(RecurringDepositAccountService);
  private readonly loansService = inject(LoansService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  accountId = 0;
  accountType = ''; // 'savings', 'fixed', 'recurring', 'loan'
  command = ''; // 'approve', 'activate', 'close', 'disburse'
  isSaving = false;

  actionDate: Date = new Date();
  note = '';

  title = '';
  dateLabel = '';

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.accountId = +params['accountId'];
      this.accountType = params['accountType'];
      this.command = params['command'] || 'approve';
      this.setupLabels();
    });
  }

  private setupLabels(): void {
    const config: Record<string, { title: string; date: string }> = {
      approve: { title: 'ACTIONS.APPROVE_ACCOUNT', date: 'ACTIONS.APPROVAL_DATE' },
      activate: { title: 'ACTIONS.ACTIVATE_ACCOUNT', date: 'ACTIONS.ACTIVATION_DATE' },
      close: { title: 'ACTIONS.CLOSE_ACCOUNT', date: 'ACTIONS.CLOSURE_DATE' },
      disburse: { title: 'ACTIONS.DISBURSE_FUNDS', date: 'ACTIONS.DISBURSEMENT_DATE' },
    };

    const entry = config[this.command] || config['approve'];
    this.title = entry.title;
    this.dateLabel = entry.date;
  }

  onSubmit(): void {
    this.isSaving = true;
    const formattedDate = `${this.actionDate.getFullYear()}-${String(
      this.actionDate.getMonth() + 1,
    ).padStart(2, '0')}-${String(this.actionDate.getDate()).padStart(2, '0')}`;

    const payload: Record<string, unknown> = {
      dateFormat: 'yyyy-MM-dd',
      locale: 'en',
      note: this.note,
    };

    if (this.command === 'approve') payload['approvedOnDate'] = formattedDate;
    if (this.command === 'activate') payload['activatedOnDate'] = formattedDate;
    if (this.command === 'close') payload['closedOnDate'] = formattedDate;
    if (this.command === 'disburse') payload['actualDisbursementDate'] = formattedDate;

    let obs$: Observable<unknown> | null = null;
    let redirectPath = '';

    if (this.accountType === 'savings') {
      obs$ = this.savingsService.handleCommands6(this.accountId, payload, this.command);
      redirectPath = '/products/savings-accounts';
    } else if (this.accountType === 'fixed') {
      obs$ = this.fixedDepositService.handleCommands4(this.accountId, payload, this.command);
      redirectPath = '/products/fixed-deposits';
    } else if (this.accountType === 'recurring') {
      obs$ = this.recurringDepositService.handleCommands5(this.accountId, payload, this.command);
      redirectPath = '/products/recurring-deposits';
    } else if (this.accountType === 'loan') {
      obs$ = this.loansService.stateTransitions(this.accountId, payload, this.command);
      redirectPath = '/loans';
    }

    if (obs$) {
      obs$.subscribe({
        next: () => this.router.navigate([redirectPath]),
        error: () => (this.isSaving = false),
      });
    }
  }

  onCancel(): void {
    const paths: Record<string, string> = {
      savings: '/products/savings-accounts',
      fixed: '/products/fixed-deposits',
      recurring: '/products/recurring-deposits',
      loan: '/loans',
    };
    this.router.navigate([paths[this.accountType] || '/dashboard']);
  }
}
