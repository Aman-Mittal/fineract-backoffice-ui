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

import { Component, OnInit, inject, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { DefaultService } from '../../../api';

interface OfficeTransaction {
  id: number;
  fromOfficeName?: string;
  fromOffice?: unknown;
  toOfficeName?: string;
  toOffice?: unknown;
  transactionDate?: unknown;
  transactionAmount?: number;
  amount?: number;
  description?: string;
}

@Component({
  selector: 'app-office-transactions-list',
  standalone: true,
  imports: [
    RouterModule,
    TranslateModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
  ],
  template: `
    <div class="list-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>{{ 'OFFICE_TRANSACTIONS.TITLE' | translate }}</mat-card-title>
          <span class="spacer"></span>
          <button
            mat-raised-button
            color="primary"
            routerLink="/organization/office-transactions/create"
          >
            <mat-icon>add</mat-icon>
            {{ 'COMMON.CREATE' | translate }}
          </button>
        </mat-card-header>

        <mat-card-content>
          <table mat-table [dataSource]="transactions()" class="full-width">
            <ng-container matColumnDef="id">
              <th mat-header-cell *matHeaderCellDef>{{ 'COMMON.ID' | translate }}</th>
              <td mat-cell *matCellDef="let row">{{ row.id }}</td>
            </ng-container>

            <ng-container matColumnDef="fromOffice">
              <th mat-header-cell *matHeaderCellDef>
                {{ 'OFFICE_TRANSACTIONS.FROM_OFFICE' | translate }}
              </th>
              <td mat-cell *matCellDef="let row">{{ row.fromOfficeName || row.fromOffice }}</td>
            </ng-container>

            <ng-container matColumnDef="toOffice">
              <th mat-header-cell *matHeaderCellDef>
                {{ 'OFFICE_TRANSACTIONS.TO_OFFICE' | translate }}
              </th>
              <td mat-cell *matCellDef="let row">{{ row.toOfficeName || row.toOffice }}</td>
            </ng-container>

            <ng-container matColumnDef="transactionDate">
              <th mat-header-cell *matHeaderCellDef>
                {{ 'OFFICE_TRANSACTIONS.DATE' | translate }}
              </th>
              <td mat-cell *matCellDef="let row">{{ formatDate(row.transactionDate) }}</td>
            </ng-container>

            <ng-container matColumnDef="amount">
              <th mat-header-cell *matHeaderCellDef>
                {{ 'OFFICE_TRANSACTIONS.AMOUNT' | translate }}
              </th>
              <td mat-cell *matCellDef="let row">{{ row.transactionAmount ?? row.amount }}</td>
            </ng-container>

            <ng-container matColumnDef="description">
              <th mat-header-cell *matHeaderCellDef>
                {{ 'OFFICE_TRANSACTIONS.DESC' | translate }}
              </th>
              <td mat-cell *matCellDef="let row">{{ row.description }}</td>
            </ng-container>

            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>{{ 'COMMON.ACTIONS' | translate }}</th>
              <td mat-cell *matCellDef="let row">
                <button mat-icon-button color="warn" (click)="onDelete(row)">
                  <mat-icon>delete</mat-icon>
                </button>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
          </table>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [
    `
      .list-container {
        padding: 24px;
      }
      mat-card-header {
        display: flex;
        align-items: center;
        margin-bottom: 16px;
      }
      .spacer {
        flex: 1;
      }
      .full-width {
        width: 100%;
      }
    `,
  ],
})
export class OfficeTransactionsListComponent implements OnInit {
  private readonly api = inject(DefaultService);
  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);

  transactions = signal<OfficeTransaction[]>([]);

  readonly displayedColumns = [
    'id',
    'fromOffice',
    'toOffice',
    'transactionDate',
    'amount',
    'description',
    'actions',
  ];

  ngOnInit(): void {
    this.loadTransactions();
  }

  private loadTransactions(): void {
    this.api.getOfficetransactions().subscribe({
      next: (raw: string) => {
        try {
          this.transactions.set(JSON.parse(raw) as OfficeTransaction[] || []);
        } catch {
          this.transactions.set([]);
        }
      },
      error: (err: unknown) => {
        console.error('Failed to load office transactions', err);
      },
    });
  }

  onDelete(row: OfficeTransaction): void {
    const id = row.id;
    this.api.deleteOfficetransactionsTransactionId(id).subscribe({
      next: () => {
        this.transactions.update((list) => list.filter((t) => t.id !== id));
        this.snackBar.open('Transaction deleted', 'Close', { duration: 3000 });
      },
      error: (err: unknown) => {
        console.error('Failed to delete office transaction', err);
        this.snackBar.open('Failed to delete transaction', 'Close', { duration: 3000 });
      },
    });
  }

  formatDate(value: unknown): string {
    if (!value || !Array.isArray(value) || value.length < 3) {
      return value ? String(value) : '-';
    }
    return `${value[0]}-${String(value[1]).padStart(2, '0')}-${String(value[2]).padStart(2, '0')}`;
  }
}
