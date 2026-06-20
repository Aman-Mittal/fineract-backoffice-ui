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
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TranslateModule } from '@ngx-translate/core';
import { BatchAPIService } from '../../../api';

@Component({
  selector: 'app-batch-operations',
  standalone: true,
  imports: [
    FormsModule,
    JsonPipe,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    TranslateModule,
  ],
  template: `
    <mat-card>
      <mat-card-header>
        <mat-card-title>{{ 'BATCH_OPERATIONS.TITLE' | translate }}</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>{{ 'BATCH_OPERATIONS.INPUT' | translate }}</mat-label>
          <textarea matInput [(ngModel)]="batchInput" rows="10" placeholder="[]"></textarea>
        </mat-form-field>

        <mat-checkbox [(ngModel)]="enclosingTransaction">
          {{ 'BATCH_OPERATIONS.ENCLOSE' | translate }}
        </mat-checkbox>

        @if (error()) {
          <p class="error-text">{{ 'BATCH_OPERATIONS.PARSE_ERROR' | translate }}: {{ error() }}</p>
        }
      </mat-card-content>
      <mat-card-actions>
        <button mat-raised-button color="primary" (click)="submit()" [disabled]="isSubmitting">
          @if (isSubmitting) {
            <mat-spinner diameter="20"></mat-spinner>
          } @else {
            {{ 'BATCH_OPERATIONS.SUBMIT' | translate }}
          }
        </button>
      </mat-card-actions>
    </mat-card>

    @if (results().length > 0) {
      <mat-card class="results-card">
        <mat-card-header>
          <mat-card-title>{{ 'BATCH_OPERATIONS.RESULTS' | translate }}</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <pre><code>{{ results() | json }}</code></pre>
        </mat-card-content>
      </mat-card>
    }
  `,
  styles: [
    `
      .full-width {
        width: 100%;
      }
      .error-text {
        color: red;
        margin-top: 8px;
      }
      .results-card {
        margin-top: 16px;
      }
      pre {
        background: #f5f5f5;
        padding: 16px;
        border-radius: 4px;
        overflow: auto;
      }
      mat-spinner {
        display: inline-block;
      }
    `,
  ],
})
export class BatchOperationsComponent {
  private batchApiService = inject(BatchAPIService);

  batchInput = '';
  enclosingTransaction = false;
  results = signal<any[]>([]);
  error = signal<string | null>(null);
  isSubmitting = false;

  submit(): void {
    this.error.set(null);
    this.results.set([]);

    let parsed: any[];
    try {
      parsed = JSON.parse(this.batchInput);
      if (!Array.isArray(parsed)) {
        throw new Error('Input must be a JSON array');
      }
    } catch (e: any) {
      this.error.set(e.message);
      return;
    }

    this.isSubmitting = true;
    this.batchApiService.postBatches(parsed, this.enclosingTransaction).subscribe({
      next: (response: any) => {
        this.results.set(Array.isArray(response) ? response : [response]);
        this.isSubmitting = false;
      },
      error: (err: any) => {
        this.error.set(err?.message ?? 'Request failed');
        this.isSubmitting = false;
      },
    });
  }
}
