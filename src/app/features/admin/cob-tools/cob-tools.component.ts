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
import { Component, inject, signal } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { InternalCOBService, COBPartition } from '../../../api';

@Component({
  selector: 'app-cob-tools',
  standalone: true,
  imports: [
    FormsModule,
    JsonPipe,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatTableModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    TranslateModule,
  ],
  template: `
    <mat-card>
      <mat-card-header>
        <mat-card-title>{{ 'COB_TOOLS.TITLE' | translate }}</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <!-- View COB Partitions -->
        <section>
          <h3>{{ 'COB_TOOLS.PARTITIONS' | translate }}</h3>
          <div class="row-actions">
            <mat-form-field appearance="outline">
              <mat-label>{{ 'COB_TOOLS.PARTITION_SIZE' | translate }}</mat-label>
              <input matInput type="number" [(ngModel)]="partitionSize" />
            </mat-form-field>
            <button
              mat-raised-button
              color="primary"
              (click)="loadPartitions()"
              [disabled]="isLoading"
            >
              {{ 'COB_TOOLS.LOAD_PARTITIONS' | translate }}
            </button>
          </div>

          @if (isLoading) {
            <mat-spinner diameter="32"></mat-spinner>
          }

          @if (partitions().length > 0) {
            <table mat-table [dataSource]="partitions()" class="full-width">
              <ng-container matColumnDef="data">
                <th mat-header-cell *matHeaderCellDef>Data</th>
                <td mat-cell *matCellDef="let row">{{ row | json }}</td>
              </ng-container>
              <tr mat-header-row *matHeaderRowDef="['data']"></tr>
              <tr mat-row *matRowDef="let row; columns: ['data']"></tr>
            </table>
          }
        </section>

        <mat-divider></mat-divider>

        <!-- Fast-Forward COB Date -->
        <section>
          <h3>{{ 'COB_TOOLS.FAST_FORWARD' | translate }}</h3>
          <div class="row-actions">
            <mat-form-field appearance="outline">
              <mat-label>{{ 'COB_TOOLS.FAST_FORWARD_LOAN_ID' | translate }}</mat-label>
              <input matInput type="number" [(ngModel)]="fastForwardLoanId" />
            </mat-form-field>
            <button mat-raised-button color="accent" (click)="fastForward()" [disabled]="isLoading">
              {{ 'COB_TOOLS.FAST_FORWARD' | translate }}
            </button>
          </div>
        </section>

        <mat-divider></mat-divider>

        <!-- Reprocess Loan COB -->
        <section>
          <h3>{{ 'COB_TOOLS.REPROCESS' | translate }}</h3>
          <div class="row-actions">
            <mat-form-field appearance="outline">
              <mat-label>{{ 'COB_TOOLS.REPROCESS_LOAN_ID' | translate }}</mat-label>
              <input matInput type="number" [(ngModel)]="reprocessLoanId" />
            </mat-form-field>
            <button mat-raised-button color="warn" (click)="reprocess()" [disabled]="isLoading">
              {{ 'COB_TOOLS.REPROCESS' | translate }}
            </button>
          </div>
        </section>
      </mat-card-content>
    </mat-card>
  `,
  styles: [
    `
      section {
        margin: 16px 0;
      }
      .row-actions {
        display: flex;
        align-items: center;
        gap: 16px;
        flex-wrap: wrap;
      }
      mat-divider {
        margin: 16px 0;
      }
      .full-width {
        width: 100%;
      }
    `,
  ],
})
export class CobToolsComponent {
  private cobService = inject(InternalCOBService);
  private snackBar = inject(MatSnackBar);
  private translate = inject(TranslateService);

  partitionSize = 10;
  partitions = signal<COBPartition[]>([]);
  fastForwardLoanId = 0;
  reprocessLoanId = 0;
  isLoading = false;

  loadPartitions(): void {
    this.isLoading = true;
    this.cobService.getInternalCobPartitionsPartitionSize(this.partitionSize).subscribe({
      next: (data: COBPartition[]) => {
        this.partitions.set(data ?? []);
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.showError();
      },
    });
  }

  fastForward(): void {
    this.isLoading = true;
    this.cobService
      .postInternalCobFastForwardCobDateOfLoanLoanId(this.fastForwardLoanId)
      .subscribe({
        next: () => {
          this.isLoading = false;
          this.showSuccess();
        },
        error: () => {
          this.isLoading = false;
          this.showError();
        },
      });
  }

  reprocess(): void {
    this.isLoading = true;
    this.cobService.postInternalCobLoanReprocessLoanId(this.reprocessLoanId).subscribe({
      next: () => {
        this.isLoading = false;
        this.showSuccess();
      },
      error: () => {
        this.isLoading = false;
        this.showError();
      },
    });
  }

  private showSuccess(): void {
    this.snackBar.open(this.translate.instant('COB_TOOLS.SUCCESS'), undefined, { duration: 3000 });
  }

  private showError(): void {
    this.snackBar.open(this.translate.instant('COB_TOOLS.ERROR'), undefined, { duration: 3000 });
  }
}
