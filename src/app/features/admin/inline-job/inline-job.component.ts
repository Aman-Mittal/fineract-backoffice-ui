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
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TranslateModule } from '@ngx-translate/core';
import { InlineJobService } from '../../../api';

@Component({
  selector: 'app-inline-job',
  standalone: true,
  imports: [
    FormsModule,
    JsonPipe,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    TranslateModule,
  ],
  template: `
    <mat-card>
      <mat-card-header>
        <mat-card-title>{{ 'INLINE_JOB.TITLE' | translate }}</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>{{ 'INLINE_JOB.JOB_NAME' | translate }}</mat-label>
          <input matInput [(ngModel)]="jobName" required />
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>{{ 'INLINE_JOB.BODY' | translate }}</mat-label>
          <textarea matInput [(ngModel)]="jobBody" rows="6" placeholder="{}"></textarea>
        </mat-form-field>

        @if (error()) {
          <p class="error-text">{{ error() }}</p>
        }
      </mat-card-content>
      <mat-card-actions>
        <button
          mat-raised-button
          color="primary"
          (click)="runJob()"
          [disabled]="isRunning || !jobName.trim()"
        >
          @if (isRunning) {
            <mat-spinner diameter="20"></mat-spinner>
          } @else {
            {{ 'INLINE_JOB.RUN' | translate }}
          }
        </button>
      </mat-card-actions>
    </mat-card>

    @if (result() !== null) {
      <mat-card class="results-card">
        <mat-card-header>
          <mat-card-title>{{ 'INLINE_JOB.RESULT' | translate }}</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <pre><code>{{ result() | json }}</code></pre>
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
export class InlineJobComponent {
  private inlineJobService = inject(InlineJobService);

  jobName = '';
  jobBody = '';
  result = signal<any>(null);
  isRunning = false;
  error = signal<string | null>(null);

  runJob(): void {
    this.error.set(null);
    this.result.set(null);

    let body: any;
    if (this.jobBody.trim()) {
      try {
        body = JSON.parse(this.jobBody);
      } catch (e: any) {
        this.error.set(e.message);
        return;
      }
    }

    this.isRunning = true;
    this.inlineJobService.postJobsJobNameInline(this.jobName.trim(), body).subscribe({
      next: (response: any) => {
        this.result.set(response ?? {});
        this.isRunning = false;
      },
      error: (err: any) => {
        this.error.set(err?.message ?? 'Request failed');
        this.isRunning = false;
      },
    });
  }
}
