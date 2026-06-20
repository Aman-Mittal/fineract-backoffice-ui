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
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ProgressiveLoanService } from '../../../api';

@Component({
  selector: 'app-progressive-loan-model',
  standalone: true,
  imports: [
    FormsModule,
    JsonPipe,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    TranslateModule,
  ],
  template: `
    <mat-card>
      <mat-card-header>
        <mat-card-title>{{ 'PROGRESSIVE_LOAN.TITLE' | translate }}</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <div class="row-actions">
          <mat-form-field appearance="outline">
            <mat-label>{{ 'PROGRESSIVE_LOAN.LOAN_ID' | translate }}</mat-label>
            <input matInput type="number" [(ngModel)]="loanId" />
          </mat-form-field>
          <button mat-raised-button color="primary" (click)="loadModel()" [disabled]="isLoading">
            {{ 'PROGRESSIVE_LOAN.LOAD' | translate }}
          </button>
          <button mat-raised-button color="accent" (click)="createModel()" [disabled]="isLoading">
            {{ 'PROGRESSIVE_LOAN.CREATE' | translate }}
          </button>
          <button mat-raised-button color="warn" (click)="deleteModel()" [disabled]="isLoading">
            {{ 'PROGRESSIVE_LOAN.DELETE' | translate }}
          </button>
        </div>

        @if (isLoading) {
          <mat-spinner diameter="32"></mat-spinner>
        }

        @if (model() !== null) {
          <div class="model-container">
            <h4>{{ 'PROGRESSIVE_LOAN.MODEL' | translate }}</h4>
            <pre>{{ model() | json }}</pre>
          </div>
        }
      </mat-card-content>
    </mat-card>
  `,
  styles: [
    `
      .row-actions {
        display: flex;
        align-items: center;
        gap: 16px;
        flex-wrap: wrap;
        margin-bottom: 16px;
      }
      .model-container pre {
        background: #f5f5f5;
        padding: 16px;
        border-radius: 4px;
        overflow: auto;
        max-height: 400px;
      }
    `,
  ],
})
export class ProgressiveLoanModelComponent {
  private progressiveLoanService = inject(ProgressiveLoanService);
  private snackBar = inject(MatSnackBar);
  private translate = inject(TranslateService);

  loanId = 0;
  model = signal<any>(null);
  isLoading = false;

  loadModel(): void {
    this.isLoading = true;
    this.progressiveLoanService.getInternalLoanProgressiveLoanIdModel(this.loanId).subscribe({
      next: (data: any) => {
        this.model.set(data);
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.showError();
      },
    });
  }

  createModel(): void {
    this.isLoading = true;
    this.progressiveLoanService.postInternalLoanProgressiveLoanIdModel(this.loanId).subscribe({
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

  deleteModel(): void {
    this.isLoading = true;
    this.progressiveLoanService.deleteInternalLoanProgressiveLoanIdModel(this.loanId).subscribe({
      next: () => {
        this.model.set(null);
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
    this.snackBar.open(this.translate.instant('PROGRESSIVE_LOAN.SUCCESS'), undefined, {
      duration: 3000,
    });
  }

  private showError(): void {
    this.snackBar.open(this.translate.instant('PROGRESSIVE_LOAN.ERROR'), undefined, {
      duration: 3000,
    });
  }
}
