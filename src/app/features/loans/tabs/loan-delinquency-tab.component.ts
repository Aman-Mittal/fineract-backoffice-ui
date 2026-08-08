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

import { Component, OnInit, computed, inject, input, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { IonCard, IonCardContent, IonCardHeader, IonCardTitle } from '@ionic/angular/standalone';
import { forkJoin } from 'rxjs';

import { ColumnDef, DataTableComponent } from '../../../shared';
import { TranslatePipe } from '../../../core/adapters';
import { GetLoansLoanIdDelinquencySummary, LoansService } from '../../../api';

/**
 * How far behind a loan is, and why.
 *
 * "How overdue is this, and by how much" is the most-asked question about a loan, and until now
 * the screen made an officer derive it from the schedule and the transaction list. The platform
 * has the answer computed.
 *
 * The summary arrives as an input — `delinquent` is already on the loan response the parent
 * fetched. The tags and the pause/resume history are separate resources, so those are fetched
 * here, together, and a failure gives the tables a retry rather than an empty state that reads
 * as "not delinquent" (issue #223).
 */
@Component({
  selector: 'app-loan-delinquency-tab',
  standalone: true,
  imports: [
    DecimalPipe,
    TranslatePipe,
    DataTableComponent,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
  ],
  template: `
    <ion-card>
      <ion-card-header>
        <ion-card-title>{{ 'LOANS.DELINQUENCY_SUMMARY' | appTranslate }}</ion-card-title>
      </ion-card-header>
      <ion-card-content class="summary-grid">
        <div class="summary-item">
          <span class="label">{{ 'LOANS.PAST_DUE_DAYS' | appTranslate }}</span>
          <span class="value" data-testid="loan-past-due-days">
            {{ summary()?.pastDueDays ?? 0 }}
          </span>
        </div>
        <div class="summary-item">
          <span class="label">{{ 'LOANS.DELINQUENT_DAYS' | appTranslate }}</span>
          <span class="value" data-testid="loan-delinquent-days">
            {{ summary()?.delinquentDays ?? 0 }}
          </span>
        </div>
        <div class="summary-item">
          <span class="label">{{ 'LOANS.DELINQUENT_AMOUNT' | appTranslate }}</span>
          <span class="value" data-testid="loan-delinquent-amount">
            {{ summary()?.delinquentAmount | number }}
          </span>
        </div>
        <div class="summary-item">
          <span class="label">{{ 'LOANS.NEXT_PAYMENT_DUE' | appTranslate }}</span>
          <span class="value">{{ summary()?.nextPaymentDueDate || '-' }}</span>
        </div>
        <div class="summary-item">
          <span class="label">{{ 'LOANS.NEXT_PAYMENT_AMOUNT' | appTranslate }}</span>
          <span class="value">{{ summary()?.nextPaymentAmount | number }}</span>
        </div>
        <div class="summary-item">
          <span class="label">{{ 'LOANS.LAST_REPAYMENT' | appTranslate }}</span>
          <span class="value">{{ summary()?.lastRepaymentDate || '-' }}</span>
        </div>
      </ion-card-content>
    </ion-card>

    <h3 class="section-title">{{ 'LOANS.DELINQUENCY_TAGS' | appTranslate }}</h3>
    <app-data-table
      [data]="tags()"
      [columns]="tagColumns"
      [isLoading]="isLoading()"
      [hasError]="hasError()"
      (retry)="load()"
      [localLogic]="true"
    ></app-data-table>

    <h3 class="section-title">{{ 'LOANS.DELINQUENCY_PAUSES' | appTranslate }}</h3>
    <app-data-table
      [data]="pausePeriods()"
      [columns]="pauseColumns"
      [localLogic]="true"
    ></app-data-table>
  `,
  styles: [
    `
      .summary-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
        gap: 12px 24px;
      }
      .summary-item {
        display: flex;
        flex-direction: column;
        gap: 2px;
      }
      .summary-item .label {
        font-size: 12px;
        color: var(--text-muted, #6b7280);
      }
      .summary-item .value {
        font-size: 16px;
        font-weight: 600;
      }
      .section-title {
        margin: 24px 0 8px;
        font-size: 1rem;
      }
    `,
  ],
})
export class LoanDelinquencyTabComponent implements OnInit {
  readonly loanId = input.required<number>();
  readonly summary = input<GetLoansLoanIdDelinquencySummary | undefined>(undefined);

  private readonly loansService = inject(LoansService);

  readonly tags = signal<unknown[]>([]);
  readonly actions = signal<unknown[]>([]);
  readonly isLoading = signal(false);
  readonly hasError = signal(false);

  /** Pause periods ride along on the summary rather than being a resource of their own. */
  readonly pausePeriods = computed(() => this.summary()?.delinquencyPausePeriods ?? []);

  tagColumns: ColumnDef[] = [
    { key: 'classification', label: 'LOANS.CLASSIFICATION' },
    { key: 'addedOnDate', label: 'LOANS.ADDED_ON' },
    { key: 'liftedOnDate', label: 'LOANS.LIFTED_ON' },
  ];

  pauseColumns: ColumnDef[] = [
    { key: 'startDate', label: 'LOANS.PAUSE_START' },
    { key: 'endDate', label: 'LOANS.PAUSE_END' },
    { key: 'active', label: 'COMMON.STATUS' },
  ];

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.isLoading.set(true);
    // Fetched together: two tables that describe one thing should not be able to disagree
    // about whether the load succeeded.
    forkJoin({
      tags: this.loansService.getLoansLoanIdDelinquencytags(this.loanId()),
      actions: this.loansService.getLoansLoanIdDelinquencyActions(this.loanId()),
    }).subscribe({
      next: ({ tags, actions }) => {
        this.tags.set((tags as unknown[]) ?? []);
        this.actions.set((actions as unknown[]) ?? []);
        this.hasError.set(false);
        this.isLoading.set(false);
      },
      error: () => {
        this.hasError.set(true);
        this.isLoading.set(false);
      },
    });
  }
}
