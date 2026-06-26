/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements. See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership. The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License. You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DecimalPipe } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import {
  LoansPointInTimeService,
  RetrieveLoansPointInTimeRequest,
  LoanPointInTimeData,
} from '../../../api';

@Component({
  selector: 'app-loans-point-in-time',
  standalone: true,
  imports: [
    FormsModule,
    DecimalPipe,
    TranslateModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTableModule,
    MatProgressSpinnerModule,
  ],
  template: `
    <mat-card>
      <mat-card-header>
        <mat-card-title>{{ 'LOANS_POINT_IN_TIME.TITLE' | translate }}</mat-card-title>
      </mat-card-header>

      <mat-card-content>
        <div class="search-form">
          <mat-form-field appearance="outline">
            <mat-label>{{ 'LOANS_POINT_IN_TIME.DATE' | translate }}</mat-label>
            <input matInput [matDatepicker]="picker" [(ngModel)]="searchDate" required />
            <mat-datepicker-toggle matIconSuffix [for]="picker" />
            <mat-datepicker #picker />
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>{{ 'LOANS_POINT_IN_TIME.LOAN_IDS' | translate }}</mat-label>
            <input matInput [(ngModel)]="loanIdsInput" placeholder="1, 2, 3" />
          </mat-form-field>

          <button
            mat-raised-button
            color="primary"
            [disabled]="!searchDate || isLoading"
            (click)="onSearch()"
          >
            {{ 'LOANS_POINT_IN_TIME.SEARCH' | translate }}
          </button>
        </div>

        @if (isLoading) {
          <div class="spinner-container">
            <mat-spinner diameter="48" />
          </div>
        }

        @if (!isLoading && results().length === 0) {
          <p class="no-results">{{ 'LOANS_POINT_IN_TIME.NO_RESULTS' | translate }}</p>
        }

        @if (!isLoading && results().length > 0) {
          <table mat-table [dataSource]="results()" class="results-table">
            <ng-container matColumnDef="id">
              <th mat-header-cell *matHeaderCellDef>Loan ID</th>
              <td mat-cell *matCellDef="let row">{{ row.id }}</td>
            </ng-container>

            <ng-container matColumnDef="accountNo">
              <th mat-header-cell *matHeaderCellDef>Account No</th>
              <td mat-cell *matCellDef="let row">{{ row.accountNo }}</td>
            </ng-container>

            <ng-container matColumnDef="status">
              <th mat-header-cell *matHeaderCellDef>Status</th>
              <td mat-cell *matCellDef="let row">{{ row.status?.value }}</td>
            </ng-container>

            <ng-container matColumnDef="principalDisbursed">
              <th mat-header-cell *matHeaderCellDef>Principal Disbursed</th>
              <td mat-cell *matCellDef="let row">
                {{ row.principal?.principalDisbursed | number: '1.2-2' }}
              </td>
            </ng-container>

            <ng-container matColumnDef="principalOutstanding">
              <th mat-header-cell *matHeaderCellDef>Principal Outstanding</th>
              <td mat-cell *matCellDef="let row">
                {{ row.principal?.principalOutstanding | number: '1.2-2' }}
              </td>
            </ng-container>

            <ng-container matColumnDef="totalOutstanding">
              <th mat-header-cell *matHeaderCellDef>Total Outstanding</th>
              <td mat-cell *matCellDef="let row">
                {{ row.total?.totalOutstanding | number: '1.2-2' }}
              </td>
            </ng-container>

            <ng-container matColumnDef="currency">
              <th mat-header-cell *matHeaderCellDef>Currency</th>
              <td mat-cell *matCellDef="let row">{{ row.currency?.code }}</td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
          </table>
        }
      </mat-card-content>
    </mat-card>
  `,
  styles: [
    `
      .search-form {
        display: flex;
        flex-wrap: wrap;
        gap: 16px;
        align-items: center;
        margin-bottom: 24px;
      }

      .search-form mat-form-field {
        min-width: 220px;
      }

      .spinner-container {
        display: flex;
        justify-content: center;
        padding: 32px 0;
      }

      .no-results {
        text-align: center;
        color: rgba(0, 0, 0, 0.54);
        padding: 24px 0;
      }

      .results-table {
        width: 100%;
      }
    `,
  ],
})
export class LoansPointInTimeComponent {
  searchDate: Date = new Date();
  loanIdsInput = '';
  results = signal<LoanPointInTimeData[]>([]);
  isLoading = false;

  readonly displayedColumns = [
    'id',
    'accountNo',
    'status',
    'principalDisbursed',
    'principalOutstanding',
    'totalOutstanding',
    'currency',
  ];

  private loansPointInTimeService = inject(LoansPointInTimeService);

  onSearch(): void {
    if (!this.searchDate) {
      return;
    }

    const loanIds: number[] = this.loanIdsInput
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0)
      .map((s) => Number(s))
      .filter((n) => !isNaN(n));

    const dateStr = this.formatDate(this.searchDate);

    const body: RetrieveLoansPointInTimeRequest = {
      date: dateStr as unknown as object,
      dateFormat: 'yyyy-MM-dd',
      locale: 'en',
      ...(loanIds.length > 0 ? { loanIds } : {}),
    };

    this.isLoading = true;
    this.results.set([]);

    this.loansPointInTimeService.postLoansAtDateSearch(body).subscribe({
      next: (data) => {
        this.results.set(data ?? []);
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  private formatDate(date: Date): string {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }
}
