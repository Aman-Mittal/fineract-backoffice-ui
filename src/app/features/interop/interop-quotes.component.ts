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
import { Component, signal, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { JsonPipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { TranslateModule } from '@ngx-translate/core';
import {
  InterOperationService,
  InteropQuoteRequestData,
  InteropQuoteResponseData,
} from '../../api';

const CLOSE_LABEL = 'Close';
const ERROR_OCCURRED = 'Error occurred';

@Component({
  selector: 'app-interop-quotes',
  standalone: true,
  imports: [
    FormsModule,
    JsonPipe,
    MatCardModule,
    MatDividerModule,
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
        <mat-card-title>{{ 'INTEROP.QUOTES_TITLE' | translate }}</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <!-- Section 1: Get Quote -->
        <section>
          <h3>{{ 'INTEROP.GET_QUOTE' | translate }}</h3>
          <div class="form-row">
            <mat-form-field>
              <mat-label>{{ 'INTEROP.TX_CODE' | translate }}</mat-label>
              <input matInput [(ngModel)]="transactionCode" />
            </mat-form-field>

            <mat-form-field>
              <mat-label>{{ 'INTEROP.QUOTE_CODE' | translate }}</mat-label>
              <input matInput [(ngModel)]="quoteCode" />
            </mat-form-field>
          </div>

          <button
            mat-raised-button
            color="primary"
            (click)="loadQuote()"
            [disabled]="!transactionCode || !quoteCode"
          >
            {{ 'INTEROP.GET_QUOTE' | translate }}
          </button>
        </section>

        <mat-divider style="margin: 24px 0;"></mat-divider>

        <!-- Section 2: Create Quote -->
        <section>
          <h3>{{ 'INTEROP.CREATE_QUOTE' | translate }}</h3>
          <mat-form-field class="full-width">
            <mat-label>{{ 'INTEROP.QUOTE_BODY' | translate }}</mat-label>
            <textarea matInput rows="10" [(ngModel)]="quoteBodyJson"></textarea>
          </mat-form-field>

          <button mat-raised-button color="accent" (click)="createQuote()">
            {{ 'INTEROP.CREATE_QUOTE' | translate }}
          </button>
        </section>

        @if (result()) {
          <h3 style="margin-top: 16px;">Result</h3>
          <pre>{{ result() | json }}</pre>
        }
      </mat-card-content>
    </mat-card>
  `,
  styles: [
    `
      .form-row {
        display: flex;
        gap: 16px;
        flex-wrap: wrap;
        margin-bottom: 16px;
      }
      mat-form-field {
        width: 300px;
      }
      .full-width {
        width: 100%;
        display: block;
      }
      button {
        margin-bottom: 8px;
      }
      pre {
        background: #f5f5f5;
        padding: 12px;
        border-radius: 4px;
        overflow: auto;
      }
    `,
  ],
})
export class InteropQuotesComponent {
  private interopService = inject(InterOperationService);
  private snackBar = inject(MatSnackBar);

  result = signal<InteropQuoteResponseData | null>(null);

  transactionCode = '';
  quoteCode = '';
  quoteBodyJson = '{}';

  loadQuote(): void {
    this.result.set(null);
    this.interopService
      .getInteroperationTransactionsTransactionCodeQuotesQuoteCode(
        this.transactionCode,
        this.quoteCode,
      )
      .subscribe({
        next: (data) => this.result.set(data),
        error: (err: { message?: string }) =>
          this.snackBar.open(err.message || ERROR_OCCURRED, CLOSE_LABEL, { duration: 4000 }),
      });
  }

  createQuote(): void {
    this.result.set(null);
    let body: InteropQuoteRequestData;
    try {
      body = JSON.parse(this.quoteBodyJson) as InteropQuoteRequestData;
    } catch {
      this.snackBar.open('Invalid JSON', CLOSE_LABEL, { duration: 4000 });
      return;
    }
    this.interopService.postInteroperationQuotes(body).subscribe({
      next: (data) => this.result.set(data),
      error: (err: { message?: string }) =>
        this.snackBar.open(err.message || ERROR_OCCURRED, CLOSE_LABEL, { duration: 4000 }),
    });
  }
}
