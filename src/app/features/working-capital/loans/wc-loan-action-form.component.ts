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
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonDatetime,
  IonDatetimeButton,
  IonInput,
  IonItem,
  IonLabel,
  IonModal,
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
  FINERACT_DATE_FORMAT,
  FINERACT_LOCALE,
  formatDateToFineract,
  toIsoDate,
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
    IonDatetime,
    IonDatetimeButton,
    IonModal,
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
              <ion-item fill="outline">
                <ion-label position="stacked">{{
                  'WC_LOANS.ACTIONS.APPROVED_ON_DATE' | translate
                }}</ion-label>
                <ion-datetime-button datetime="approvedOnDate-picker"></ion-datetime-button>
                <ion-modal [keepContentsMounted]="true">
                  <ng-template>
                    <ion-datetime
                      id="approvedOnDate-picker"
                      data-testid="approvedOnDate-picker"
                      presentation="date"
                      name="approvedOnDate"
                      [(ngModel)]="approvedOnDate"
                      required
                    ></ion-datetime>
                  </ng-template>
                </ion-modal>
              </ion-item>
              <ion-item fill="outline">
                <ion-label position="stacked">{{
                  'WC_LOANS.ACTIONS.APPROVED_AMOUNT' | translate
                }}</ion-label>
                <ion-input
                  [attr.aria-label]="'WC_LOANS.ACTIONS.APPROVED_AMOUNT' | translate"
                  type="number"
                  name="approvedLoanAmount"
                  [(ngModel)]="lifecycle.approvedLoanAmount"
                ></ion-input>
              </ion-item>
            }

            @if (command === 'disburse') {
              <ion-item fill="outline">
                <ion-label position="stacked">{{
                  'WC_LOANS.ACTIONS.EXPECTED_DISBURSEMENT_DATE' | translate
                }}</ion-label>
                <ion-datetime-button
                  datetime="expectedDisbursementDate-picker"
                ></ion-datetime-button>
                <ion-modal [keepContentsMounted]="true">
                  <ng-template>
                    <ion-datetime
                      id="expectedDisbursementDate-picker"
                      data-testid="expectedDisbursementDate-picker"
                      presentation="date"
                      name="expectedDisbursementDate"
                      [(ngModel)]="expectedDisbursementDate"
                    ></ion-datetime>
                  </ng-template>
                </ion-modal>
              </ion-item>
              <ion-item fill="outline">
                <ion-label position="stacked">{{
                  'WC_LOANS.ACTIONS.ACTUAL_DISBURSEMENT_DATE' | translate
                }}</ion-label>
                <ion-datetime-button datetime="actualDisbursementDate-picker"></ion-datetime-button>
                <ion-modal [keepContentsMounted]="true">
                  <ng-template>
                    <ion-datetime
                      id="actualDisbursementDate-picker"
                      data-testid="actualDisbursementDate-picker"
                      presentation="date"
                      name="actualDisbursementDate"
                      [(ngModel)]="actualDisbursementDate"
                      required
                    ></ion-datetime>
                  </ng-template>
                </ion-modal>
              </ion-item>
              <ion-item fill="outline">
                <ion-label position="stacked">{{
                  'WC_LOANS.ACTIONS.TRANSACTION_AMOUNT' | translate
                }}</ion-label>
                <ion-input
                  [attr.aria-label]="'WC_LOANS.ACTIONS.TRANSACTION_AMOUNT' | translate"
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
                  [attr.aria-label]="'WC_LOANS.ACTIONS.DISCOUNT_AMOUNT' | translate"
                  type="number"
                  name="discountAmount"
                  [(ngModel)]="lifecycle.discountAmount"
                ></ion-input>
              </ion-item>
            }

            @if (command === 'reject') {
              <ion-item fill="outline">
                <ion-label position="stacked">{{
                  'WC_LOANS.ACTIONS.REJECTED_ON_DATE' | translate
                }}</ion-label>
                <ion-datetime-button datetime="rejectedOnDate-picker"></ion-datetime-button>
                <ion-modal [keepContentsMounted]="true">
                  <ng-template>
                    <ion-datetime
                      id="rejectedOnDate-picker"
                      data-testid="rejectedOnDate-picker"
                      presentation="date"
                      name="rejectedOnDate"
                      [(ngModel)]="rejectedOnDate"
                      required
                    ></ion-datetime>
                  </ng-template>
                </ion-modal>
              </ion-item>
            }

            @if (command === 'repayment') {
              <ion-item fill="outline">
                <ion-label position="stacked">{{
                  'WC_LOANS.ACTIONS.TRANSACTION_DATE' | translate
                }}</ion-label>
                <ion-datetime-button datetime="transactionDate-picker"></ion-datetime-button>
                <ion-modal [keepContentsMounted]="true">
                  <ng-template>
                    <ion-datetime
                      id="transactionDate-picker"
                      data-testid="transactionDate-picker"
                      presentation="date"
                      name="transactionDate"
                      [(ngModel)]="transactionDate"
                      required
                    ></ion-datetime>
                  </ng-template>
                </ion-modal>
              </ion-item>
              <ion-item fill="outline">
                <ion-label position="stacked">{{
                  'WC_LOANS.ACTIONS.TRANSACTION_AMOUNT' | translate
                }}</ion-label>
                <ion-input
                  [attr.aria-label]="'WC_LOANS.ACTIONS.TRANSACTION_AMOUNT' | translate"
                  type="number"
                  name="repaymentAmount"
                  [(ngModel)]="repayment.transactionAmount"
                  required
                ></ion-input>
              </ion-item>
              <ion-item fill="outline">
                <ion-label position="stacked">{{ 'WC_LOANS.ACTIONS.NOTE' | translate }}</ion-label>
                <ion-textarea
                  [attr.aria-label]="'WC_LOANS.ACTIONS.NOTE' | translate"
                  name="repaymentNote"
                  [(ngModel)]="repayment.note"
                ></ion-textarea>
              </ion-item>
            }

            @if (command !== 'repayment') {
              <ion-item fill="outline">
                <ion-label position="stacked">{{ 'WC_LOANS.ACTIONS.NOTE' | translate }}</ion-label>
                <ion-textarea
                  [attr.aria-label]="'WC_LOANS.ACTIONS.NOTE' | translate"
                  name="note"
                  [(ngModel)]="lifecycle.note"
                ></ion-textarea>
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

  approvedOnDate: string | null = null;
  expectedDisbursementDate: string | null = null;
  actualDisbursementDate: string | null = null;
  rejectedOnDate: string | null = null;
  transactionDate: string | null = toIsoDate(new Date());

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
