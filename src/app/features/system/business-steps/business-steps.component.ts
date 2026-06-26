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
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BusinessStepConfigurationService, BusinessStep } from '../../../api';

/**
 * Business step configuration: pick a job, load its configured steps, reorder them
 * and save the new order via the business-step configuration endpoint.
 */
@Component({
  selector: 'app-business-steps',
  standalone: true,
  imports: [
    FormsModule,
    TranslateModule,
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatProgressSpinnerModule,
  ],
  template: `
    <div class="form-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>{{ 'BUSINESS_STEPS.TITLE' | translate }}</mat-card-title>
        </mat-card-header>

        <mat-card-content>
          <mat-form-field appearance="outline">
            <mat-label>{{ 'BUSINESS_STEPS.JOB' | translate }}</mat-label>
            <mat-select [(ngModel)]="selectedJob" (selectionChange)="loadSteps()">
              @for (job of jobNames; track job) {
                <mat-option [value]="job">{{ job }}</mat-option>
              }
            </mat-select>
          </mat-form-field>

          @if (steps.length) {
            <mat-list>
              @for (step of steps; track step.stepName; let i = $index) {
                <mat-list-item>
                  <span matListItemTitle>{{ step.stepName }}</span>
                  <span matListItemMeta>
                    <button mat-icon-button type="button" [disabled]="i === 0" (click)="moveUp(i)">
                      <mat-icon>arrow_upward</mat-icon>
                    </button>
                    <button
                      mat-icon-button
                      type="button"
                      [disabled]="i === steps.length - 1"
                      (click)="moveDown(i)"
                    >
                      <mat-icon>arrow_downward</mat-icon>
                    </button>
                  </span>
                </mat-list-item>
              }
            </mat-list>
          } @else if (selectedJob) {
            <p>{{ 'BUSINESS_STEPS.NO_STEPS' | translate }}</p>
          }

          <div class="form-actions">
            <button
              mat-raised-button
              color="primary"
              type="button"
              [disabled]="!steps.length || isSaving"
              (click)="onSave()"
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
    `,
  ],
})
export class BusinessStepsComponent implements OnInit {
  private readonly service = inject(BusinessStepConfigurationService);

  jobNames: string[] = [];
  selectedJob = '';
  steps: BusinessStep[] = [];
  isSaving = false;

  ngOnInit(): void {
    this.service.getJobsNames().subscribe((data) => {
      this.jobNames = data.businessJobs ?? [];
    });
  }

  loadSteps(): void {
    if (!this.selectedJob) return;
    this.service.getJobsJobNameSteps(this.selectedJob).subscribe((data) => {
      this.steps = [...(data.businessSteps ?? [])].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    });
  }

  moveUp(index: number): void {
    if (index <= 0) return;
    [this.steps[index - 1], this.steps[index]] = [this.steps[index], this.steps[index - 1]];
  }

  moveDown(index: number): void {
    if (index >= this.steps.length - 1) return;
    [this.steps[index + 1], this.steps[index]] = [this.steps[index], this.steps[index + 1]];
  }

  onSave(): void {
    if (!this.selectedJob) return;
    this.isSaving = true;
    const businessSteps: BusinessStep[] = this.steps.map((step, i) => ({
      stepName: step.stepName,
      order: i + 1,
    }));
    this.service.putJobsJobNameSteps(this.selectedJob, { businessSteps }).subscribe({
      next: () => (this.isSaving = false),
      error: () => (this.isSaving = false),
    });
  }
}
