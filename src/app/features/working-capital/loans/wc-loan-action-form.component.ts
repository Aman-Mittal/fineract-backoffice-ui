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
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonInput,
  IonItem,
  IonLabel,
  IonSpinner,
  IonTextarea,
} from '@ionic/angular/standalone';
import {
  WorkingCapitalLoansService,
  WorkingCapitalLoanTransactionsService,
  PostWorkingCapitalLoansLoanIdRequest,
  PostWorkingCapitalLoanTransactionsRequest,
} from '../../../api';
import {
  formatDateToFineract,
  FINERACT_DATE_FORMAT,
  FINERACT_LOCALE,
} from '../../../core/utils/date-formatter';

/**
 * Handles WC loan lifecycle commands (approve, reject, undoapproval, disburse, undodisbursal)
 * and repayment transactions. Branches on the :command route param — mirrors the main
 * loan-transaction-form pattern.
 */
@Component({
  selector: 'app-wc-loan-action-form',
  standalone: true,
  imports: [
    FormsModule,
    TranslateModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    IonButton,
    IonSpinner,
    IonInput,
    IonTextarea,
    IonItem,
    IonLabel,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonCard,
  ],
  template: `
    <div class="form-container">
      <ion-card>
        <ion-card-header>
          <ion-card-title>{{ title | translate }}</ion-card-title>
        </ion-card-header>

        <ion-card-content>
          <form #actionForm="ngForm" (ngSubmit)="onSubmit()" class="wc-form">
            @if (command === 'approve') {
              <mat-form-field appearance="outline">
                <mat-label>{{ 'WC_LOANS.ACTIONS.APPROVED_ON_DATE' | translate }}</mat-label>
                <input
                  matInput
                  [matDatepicker]="approvePicker"
                  name="approvedOnDate"
                  [(ngModel)]="approvedOnDate"
                  required
                />
                <mat-datepicker-toggle matSuffix [for]="approvePicker"></mat-datepicker-toggle>
                <mat-datepicker #approvePicker></mat-datepicker>
              </mat-form-field>
              <ion-item fill="outline">
                <ion-label position="stacked">{{
                  'WC_LOANS.ACTIONS.APPROVED_AMOUNT' | translate
                }}</ion-label>
                <ion-input
                  type="number"
                  name="approvedLoanAmount"
                  [(ngModel)]="lifecycle.approvedLoanAmount"
                ></ion-input>
              </ion-item>
            }

            @if (command === 'disburse') {
              <mat-form-field appearance="outline">
                <mat-label>{{
                  'WC_LOANS.ACTIONS.EXPECTED_DISBURSEMENT_DATE' | translate
                }}</mat-label>
                <input
                  matInput
                  [matDatepicker]="expectedDisbursePicker"
                  name="expectedDisbursementDate"
                  [(ngModel)]="expectedDisbursementDate"
                />
                <mat-datepicker-toggle
                  matSuffix
                  [for]="expectedDisbursePicker"
                ></mat-datepicker-toggle>
                <mat-datepicker #expectedDisbursePicker></mat-datepicker>
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>{{ 'WC_LOANS.ACTIONS.ACTUAL_DISBURSEMENT_DATE' | translate }}</mat-label>
                <input
                  matInput
                  [matDatepicker]="disbursePicker"
                  name="actualDisbursementDate"
                  [(ngModel)]="actualDisbursementDate"
                  required
                />
                <mat-datepicker-toggle matSuffix [for]="disbursePicker"></mat-datepicker-toggle>
                <mat-datepicker #disbursePicker></mat-datepicker>
              </mat-form-field>
              <ion-item fill="outline">
                <ion-label position="stacked">{{
                  'WC_LOANS.ACTIONS.TRANSACTION_AMOUNT' | translate
                }}</ion-label>
                <ion-input
                  type="number"
                  name="transactionAmount"
                  [(ngModel)]="lifecycle.transactionAmount"
                  required
                ></ion-input>
              </ion-item>
              <ion-item fill="outline">
                <ion-label position="stacked">{{
                  'WC_LOANS.ACTIONS.DISCOUNT_AMOUNT' | translate
                }}</ion-label>
                <ion-input
                  type="number"
                  name="discountAmount"
                  [(ngModel)]="lifecycle.discountAmount"
                ></ion-input>
              </ion-item>
            }

            @if (command === 'reject') {
              <mat-form-field appearance="outline">
                <mat-label>{{ 'WC_LOANS.ACTIONS.REJECTED_ON_DATE' | translate }}</mat-label>
                <input
                  matInput
                  [matDatepicker]="rejectPicker"
                  name="rejectedOnDate"
                  [(ngModel)]="rejectedOnDate"
                  required
                />
                <mat-datepicker-toggle matSuffix [for]="rejectPicker"></mat-datepicker-toggle>
                <mat-datepicker #rejectPicker></mat-datepicker>
              </mat-form-field>
            }

            @if (command === 'repayment') {
              <mat-form-field appearance="outline">
                <mat-label>{{ 'WC_LOANS.ACTIONS.TRANSACTION_DATE' | translate }}</mat-label>
                <input
                  matInput
                  [matDatepicker]="repayPicker"
                  name="transactionDate"
                  [(ngModel)]="transactionDate"
                  required
                />
                <mat-datepicker-toggle matSuffix [for]="repayPicker"></mat-datepicker-toggle>
                <mat-datepicker #repayPicker></mat-datepicker>
              </mat-form-field>
              <ion-item fill="outline">
                <ion-label position="stacked">{{
                  'WC_LOANS.ACTIONS.TRANSACTION_AMOUNT' | translate
                }}</ion-label>
                <ion-input
                  type="number"
                  name="repaymentAmount"
                  [(ngModel)]="repayment.transactionAmount"
                  required
                ></ion-input>
              </ion-item>
              <ion-item fill="outline">
                <ion-label position="stacked">{{ 'WC_LOANS.ACTIONS.NOTE' | translate }}</ion-label>
                <ion-textarea name="repaymentNote" [(ngModel)]="repayment.note"></ion-textarea>
              </ion-item>
            }

            @if (command !== 'repayment') {
              <ion-item fill="outline">
                <ion-label position="stacked">{{ 'WC_LOANS.ACTIONS.NOTE' | translate }}</ion-label>
                <ion-textarea name="note" [(ngModel)]="lifecycle.note"></ion-textarea>
              </ion-item>
            }

            <div class="form-actions">
              <ion-button fill="clear" type="button" (click)="onCancel()" [disabled]="isSaving">
                {{ 'COMMON.CANCEL' | translate }}
              </ion-button>
              <ion-button color="primary" type="submit" [disabled]="actionForm.invalid || isSaving">
                @if (isSaving) {
                  <ion-spinner name="crescent"></ion-spinner>
                  {{ 'COMMON.SAVING' | translate }}
                } @else {
                  {{ 'COMMON.SUBMIT' | translate }}
                }
              </ion-button>
            </div>
          </form>
        </ion-card-content>
      </ion-card>
    </div>
  `,
  styles: [
    `
      .form-container {
        padding: 24px;
        max-width: 600px;
        margin: 0 auto;
      }
      .wc-form {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }
    `,
  ],
})
export class WcLoanActionFormComponent implements OnInit {
  private readonly loansService = inject(WorkingCapitalLoansService);
  private readonly transactionsService = inject(WorkingCapitalLoanTransactionsService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  loanId = 0;
  command = '';
  isSaving = false;

  lifecycle: PostWorkingCapitalLoansLoanIdRequest = {
    dateFormat: FINERACT_DATE_FORMAT,
    locale: FINERACT_LOCALE,
  };
  repayment: PostWorkingCapitalLoanTransactionsRequest = {
    dateFormat: FINERACT_DATE_FORMAT,
    locale: FINERACT_LOCALE,
  };

  approvedOnDate: Date | null = null;
  expectedDisbursementDate: Date | null = null;
  actualDisbursementDate: Date | null = null;
  rejectedOnDate: Date | null = null;
  transactionDate: Date | null = new Date();

  get title(): string {
    const map: Record<string, string> = {
      approve: 'WC_LOANS.APPROVE',
      disburse: 'WC_LOANS.DISBURSE',
      reject: 'WC_LOANS.ACTIONS.REJECT',
      undoapproval: 'WC_LOANS.ACTIONS.UNDO_APPROVAL',
      undodisbursal: 'WC_LOANS.ACTIONS.UNDO_DISBURSAL',
      repayment: 'WC_LOANS.REPAYMENT',
    };
    return map[this.command] ?? this.command;
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    const cmd = this.route.snapshot.paramMap.get('command');
    if (id) this.loanId = +id;
    if (cmd) this.command = cmd;
  }

  onSubmit(): void {
    this.isSaving = true;

    if (this.command === 'repayment') {
      if (this.transactionDate) {
        this.repayment.transactionDate = formatDateToFineract(this.transactionDate);
      }
      this.transactionsService
        .postWorkingCapitalLoansLoanIdTransactions(this.loanId, 'repayment', this.repayment)
        .subscribe({
          next: () => this.router.navigate([`/working-capital/loans/view/${this.loanId}`]),
          error: () => (this.isSaving = false),
        });
      return;
    }

    if (this.command === 'approve' && this.approvedOnDate) {
      this.lifecycle.approvedOnDate = formatDateToFineract(this.approvedOnDate);
    }
    if (this.command === 'disburse') {
      if (this.expectedDisbursementDate) {
        this.lifecycle.expectedDisbursementDate = formatDateToFineract(
          this.expectedDisbursementDate,
        );
      }
      if (this.actualDisbursementDate) {
        this.lifecycle.actualDisbursementDate = formatDateToFineract(this.actualDisbursementDate);
      }
    }
    if (this.command === 'reject' && this.rejectedOnDate) {
      this.lifecycle.rejectedOnDate = formatDateToFineract(this.rejectedOnDate);
    }

    this.loansService
      .postWorkingCapitalLoansLoanId(this.loanId, this.command, this.lifecycle)
      .subscribe({
        next: () => this.router.navigate([`/working-capital/loans/view/${this.loanId}`]),
        error: () => (this.isSaving = false),
      });
  }

  onCancel(): void {
    this.router.navigate([`/working-capital/loans/view/${this.loanId}`]);
  }
}
