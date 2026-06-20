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
import { Component, OnInit, signal, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { TranslateModule } from '@ngx-translate/core';
import { SurveyService } from '../../../api';

@Component({
  selector: 'app-survey-responses',
  standalone: true,
  imports: [
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
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
        <mat-card-title>{{ 'SURVEY_RESPONSES.TITLE' | translate }}</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <!-- Step 1: Select survey + client -->
        <div class="filter-row">
          <mat-form-field appearance="outline">
            <mat-label>{{ 'SURVEY_RESPONSES.SURVEY' | translate }}</mat-label>
            <mat-select [(ngModel)]="selectedSurveyName">
              @for (s of surveys(); track s.name) {
                <mat-option [value]="s.name">{{ s.name }}</mat-option>
              }
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>{{ 'SURVEY_RESPONSES.CLIENT_ID' | translate }}</mat-label>
            <input matInput type="number" [(ngModel)]="clientId" />
          </mat-form-field>

          <button mat-raised-button color="primary" (click)="loadResponses()" [disabled]="loading">
            {{ 'SURVEY_RESPONSES.LOAD' | translate }}
          </button>
        </div>

        @if (loading) {
          <mat-spinner diameter="40"></mat-spinner>
        }

        <!-- Step 2: Responses table -->
        @if (responses().length > 0) {
          <h3>{{ 'SURVEY_RESPONSES.RESPONSES' | translate }}</h3>
          <mat-table [dataSource]="responses()" class="full-width">
            <ng-container matColumnDef="id">
              <mat-header-cell *matHeaderCellDef>ID</mat-header-cell>
              <mat-cell *matCellDef="let row">{{ row.id ?? row.entryId }}</mat-cell>
            </ng-container>

            <ng-container matColumnDef="score">
              <mat-header-cell *matHeaderCellDef>Score</mat-header-cell>
              <mat-cell *matCellDef="let row">{{ row.score }}</mat-cell>
            </ng-container>

            <ng-container matColumnDef="date">
              <mat-header-cell *matHeaderCellDef>Date</mat-header-cell>
              <mat-cell *matCellDef="let row">{{ row.date }}</mat-cell>
            </ng-container>

            <ng-container matColumnDef="actions">
              <mat-header-cell *matHeaderCellDef>Actions</mat-header-cell>
              <mat-cell *matCellDef="let row">
                <button
                  mat-icon-button
                  color="warn"
                  (click)="deleteResponse(row.id ?? row.entryId)"
                  [title]="'SURVEY_RESPONSES.DELETE' | translate"
                >
                  &#x1F5D1;
                </button>
              </mat-cell>
            </ng-container>

            <mat-header-row *matHeaderRowDef="displayedColumns"></mat-header-row>
            <mat-row *matRowDef="let row; columns: displayedColumns"></mat-row>
          </mat-table>
        }

        <mat-divider class="section-divider"></mat-divider>

        <!-- Step 3: Submit new response -->
        <h3>{{ 'SURVEY_RESPONSES.SUBMIT_RESPONSE' | translate }}</h3>
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>{{ 'SURVEY_RESPONSES.RESPONSE_BODY' | translate }}</mat-label>
          <textarea matInput rows="6" [(ngModel)]="responseBody"></textarea>
        </mat-form-field>
        <button mat-raised-button color="accent" (click)="submitResponse()" [disabled]="submitting">
          {{ 'SURVEY_RESPONSES.SUBMIT' | translate }}
        </button>
      </mat-card-content>
    </mat-card>
  `,
  styles: [
    `
      .filter-row {
        display: flex;
        gap: 16px;
        align-items: center;
        flex-wrap: wrap;
        margin-bottom: 16px;
      }
      .full-width {
        width: 100%;
      }
      .section-divider {
        margin: 24px 0;
      }
      mat-spinner {
        margin: 16px auto;
      }
    `,
  ],
})
export class SurveyResponsesComponent implements OnInit {
  private surveyService = inject(SurveyService);
  private snackBar = inject(MatSnackBar);

  surveys = signal<any[]>([]);
  responses = signal<any[]>([]);
  selectedSurveyName = '';
  clientId = 0;
  responseBody = '';
  loading = false;
  submitting = false;

  displayedColumns = ['id', 'score', 'date', 'actions'];

  ngOnInit(): void {
    this.surveyService.getSurvey().subscribe({
      next: (list) => this.surveys.set(list ?? []),
      error: () => this.surveys.set([]),
    });
  }

  loadResponses(): void {
    if (!this.selectedSurveyName || !this.clientId) return;
    this.loading = true;
    this.surveyService
      .getSurveySurveyNameClientId(this.selectedSurveyName, this.clientId)
      .subscribe({
        next: (raw) => {
          try {
            const parsed = JSON.parse(raw as string);
            this.responses.set(Array.isArray(parsed) ? parsed : [parsed]);
          } catch {
            this.responses.set([]);
          }
          this.loading = false;
        },
        error: () => {
          this.responses.set([]);
          this.loading = false;
        },
      });
  }

  deleteResponse(fulfilledId: any): void {
    this.surveyService
      .deleteSurveySurveyNameClientIdFulfilledId(
        this.selectedSurveyName,
        this.clientId,
        fulfilledId,
      )
      .subscribe({
        next: () => {
          this.snackBar.open('SURVEY_RESPONSES.SUCCESS', undefined, { duration: 3000 });
          this.loadResponses();
        },
      });
  }

  submitResponse(): void {
    if (!this.selectedSurveyName || !this.clientId || !this.responseBody) return;
    let body: any;
    try {
      body = JSON.parse(this.responseBody);
    } catch {
      this.snackBar.open('Invalid JSON', undefined, { duration: 3000 });
      return;
    }
    this.submitting = true;
    this.surveyService
      .postSurveySurveyNameApptableId(this.selectedSurveyName, this.clientId, body)
      .subscribe({
        next: () => {
          this.snackBar.open('SURVEY_RESPONSES.SUCCESS', undefined, { duration: 3000 });
          this.responseBody = '';
          this.submitting = false;
          this.loadResponses();
        },
        error: () => {
          this.submitting = false;
        },
      });
  }
}
