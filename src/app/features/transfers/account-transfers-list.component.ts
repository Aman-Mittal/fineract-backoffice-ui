import { Component, OnInit, inject } from '@angular/core';
import { DecimalPipe, DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TranslateModule } from '@ngx-translate/core';

import {
  AccountTransfersService,
  GetAccountTransfersResponse,
  GetAccountTransfersPageItems,
} from '../../api';

@Component({
  selector: 'app-account-transfers-list',
  standalone: true,
  imports: [
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    TranslateModule,
    DecimalPipe,
    DatePipe,
  ],
  template: `
    <mat-card>
      <mat-card-header>
        <mat-card-title>{{ 'TRANSFERS.HISTORY_TITLE' | translate }}</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        @if (isLoading) {
          <div class="spinner-container">
            <mat-spinner diameter="40"></mat-spinner>
          </div>
        }

        @if (!isLoading) {
          <table mat-table [dataSource]="transfers">
            <ng-container matColumnDef="id">
              <th mat-header-cell *matHeaderCellDef>{{ 'TRANSFERS.ID' | translate }}</th>
              <td mat-cell *matCellDef="let row">{{ row.id }}</td>
            </ng-container>

            <ng-container matColumnDef="fromAccountId">
              <th mat-header-cell *matHeaderCellDef>{{ 'TRANSFERS.FROM_ACCOUNT' | translate }}</th>
              <td mat-cell *matCellDef="let row">{{ row.fromAccount?.id }}</td>
            </ng-container>

            <ng-container matColumnDef="toAccountId">
              <th mat-header-cell *matHeaderCellDef>{{ 'TRANSFERS.TO_ACCOUNT' | translate }}</th>
              <td mat-cell *matCellDef="let row">{{ row.toAccount?.id }}</td>
            </ng-container>

            <ng-container matColumnDef="currency.code">
              <th mat-header-cell *matHeaderCellDef>{{ 'TRANSFERS.CURRENCY' | translate }}</th>
              <td mat-cell *matCellDef="let row">{{ row.currency?.code }}</td>
            </ng-container>

            <ng-container matColumnDef="transferAmount">
              <th mat-header-cell *matHeaderCellDef>{{ 'TRANSFERS.AMOUNT' | translate }}</th>
              <td mat-cell *matCellDef="let row">{{ row.transferAmount | number: '1.2-2' }}</td>
            </ng-container>

            <ng-container matColumnDef="transferDate">
              <th mat-header-cell *matHeaderCellDef>{{ 'TRANSFERS.DATE' | translate }}</th>
              <td mat-cell *matCellDef="let row">
                {{ parseDate(row.transferDate) | date: 'mediumDate' }}
              </td>
            </ng-container>

            <ng-container matColumnDef="transferDescription">
              <th mat-header-cell *matHeaderCellDef>{{ 'TRANSFERS.DESCRIPTION' | translate }}</th>
              <td mat-cell *matCellDef="let row">{{ row.transferDescription }}</td>
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
      .spinner-container {
        display: flex;
        justify-content: center;
        padding: 2rem;
      }
      table {
        width: 100%;
      }
    `,
  ],
})
export class AccountTransfersListComponent implements OnInit {
  transfers: GetAccountTransfersPageItems[] = [];
  isLoading = false;

  displayedColumns: string[] = [
    'id',
    'fromAccountId',
    'toAccountId',
    'currency.code',
    'transferAmount',
    'transferDate',
    'transferDescription',
  ];

  private accountTransfersService = inject(AccountTransfersService);

  ngOnInit(): void {
    this.loadTransfers();
  }

  loadTransfers(): void {
    this.isLoading = true;
    this.accountTransfersService.getAccounttransfers().subscribe({
      next: (response: GetAccountTransfersResponse) => {
        this.transfers = Array.from(response.pageItems ?? []);
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  parseDate(transferDate: unknown): Date | null {
    if (!transferDate) return null;
    if (Array.isArray(transferDate)) {
      return new Date(
        (transferDate as number[])[0],
        (transferDate as number[])[1] - 1,
        (transferDate as number[])[2],
      );
    }
    return new Date(transferDate as string | number);
  }
}
