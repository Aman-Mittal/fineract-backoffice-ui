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

import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SpmSurveysService, SurveyData } from '../../../api';

/**
 * Create / edit form for an SPM survey. Captures the core survey metadata
 * (key, name, country code, description); questions/components are managed elsewhere.
 */
@Component({
  selector: 'app-spm-surveys-form',
  standalone: true,
  imports: [
    FormsModule,
    TranslateModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
  ],
  template: `
    <div class="form-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>
            {{ isEditMode ? ('SPM_SURVEYS.EDIT' | translate) : ('SPM_SURVEYS.CREATE' | translate) }}
          </mat-card-title>
        </mat-card-header>

        <mat-card-content>
          <form #surveyForm="ngForm" (ngSubmit)="onSubmit()" class="spm-form">
            <mat-form-field appearance="outline">
              <mat-label>{{ 'SPM_SURVEYS.KEY' | translate }}</mat-label>
              <input matInput name="key" [(ngModel)]="survey.key" required />
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>{{ 'SPM_SURVEYS.NAME' | translate }}</mat-label>
              <input matInput name="name" [(ngModel)]="survey.name" required />
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>{{ 'SPM_SURVEYS.COUNTRY_CODE' | translate }}</mat-label>
              <input matInput name="countryCode" [(ngModel)]="survey.countryCode" />
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>{{ 'SPM_SURVEYS.DESCRIPTION' | translate }}</mat-label>
              <input matInput name="description" [(ngModel)]="survey.description" />
            </mat-form-field>

            <div class="form-actions">
              <button mat-button type="button" (click)="onCancel()" [disabled]="isSaving">
                {{ 'COMMON.CANCEL' | translate }}
              </button>
              <button
                mat-raised-button
                color="primary"
                type="submit"
                [disabled]="surveyForm.invalid || isSaving"
              >
                @if (isSaving) {
                  <mat-spinner
                    diameter="20"
                    style="margin-right: 8px; display: inline-block; vertical-align: middle;"
                  ></mat-spinner>
                  {{ 'COMMON.SAVING' | translate }}
                } @else {
                  {{ 'COMMON.SAVE' | translate }}
                }
              </button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [
    `
      .form-container {
        padding: 24px;
        max-width: 600px;
        margin: 0 auto;
      }
      .spm-form {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }
      mat-form-field {
        width: 100%;
      }
      .form-actions {
        display: flex;
        justify-content: flex-end;
        gap: 12px;
        margin-top: 16px;
      }
    `,
  ],
})
export class SpmSurveysFormComponent implements OnInit {
  private readonly surveysService = inject(SpmSurveysService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  private readonly LIST_PATH = '/spm/surveys';

  surveyId: number | null = null;
  isEditMode = false;
  isSaving = false;

  survey: SurveyData = { key: '', name: '' };

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.surveyId = +id;
        this.isEditMode = true;
        this.load();
      }
    });
  }

  load(): void {
    if (!this.surveyId) return;
    this.surveysService.getSurveysId(this.surveyId).subscribe((data) => {
      this.survey = {
        key: data.key,
        name: data.name,
        countryCode: data.countryCode,
        description: data.description,
      };
    });
  }

  onSubmit(): void {
    this.isSaving = true;
    const request$ =
      this.isEditMode && this.surveyId
        ? this.surveysService.putSurveysId(this.surveyId, this.survey)
        : this.surveysService.postSurveys(this.survey);

    request$.subscribe({
      next: () => this.router.navigate([this.LIST_PATH]),
      error: () => (this.isSaving = false),
    });
  }

  onCancel(): void {
    this.router.navigate([this.LIST_PATH]);
  }
}
