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
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {
  WorkingCapitalBreachService,
  WorkingCapitalBreachRequest,
  StringEnumOptionData,
} from '../../../api';

/**
 * Create / edit form for a working-capital covenant breach definition.
 * Calculation-type and frequency-type options come from the breach template endpoint.
 */
@Component({
  selector: 'app-wc-breach-form',
  standalone: true,
  imports: [
    FormsModule,
    TranslateModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatProgressSpinnerModule,
  ],
  template: `
    <div class="form-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>
            {{ isEditMode ? ('WC_BREACH.EDIT' | translate) : ('WC_BREACH.CREATE' | translate) }}
          </mat-card-title>
        </mat-card-header>

        <mat-card-content>
          <form #breachForm="ngForm" (ngSubmit)="onSubmit()" class="wc-form">
            <mat-form-field appearance="outline">
              <mat-label>{{ 'WC_BREACH.NAME' | translate }}</mat-label>
              <input matInput name="name" [(ngModel)]="breach.name" required />
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>{{ 'WC_BREACH.BREACH_AMOUNT' | translate }}</mat-label>
              <input matInput type="number" name="breachAmount" [(ngModel)]="breach.breachAmount" />
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>{{ 'WC_BREACH.CALCULATION_TYPE' | translate }}</mat-label>
              <mat-select name="calcType" [(ngModel)]="breach.breachAmountCalculationType">
                @for (opt of calculationTypeOptions; track opt.id) {
                  <mat-option [value]="opt.code">{{ opt.value }}</mat-option>
                }
              </mat-select>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>{{ 'WC_BREACH.FREQUENCY' | translate }}</mat-label>
              <input
                matInput
                type="number"
                name="breachFrequency"
                [(ngModel)]="breach.breachFrequency"
              />
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>{{ 'WC_BREACH.FREQUENCY_TYPE' | translate }}</mat-label>
              <mat-select name="freqType" [(ngModel)]="breach.breachFrequencyType">
                @for (opt of frequencyTypeOptions; track opt.id) {
                  <mat-option [value]="opt.code">{{ opt.value }}</mat-option>
                }
              </mat-select>
            </mat-form-field>

            <div class="form-actions">
              <button mat-button type="button" (click)="onCancel()" [disabled]="isSaving">
                {{ 'COMMON.CANCEL' | translate }}
              </button>
              <button
                mat-raised-button
                color="primary"
                type="submit"
                [disabled]="breachForm.invalid || isSaving"
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
      .wc-form {
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
export class WcBreachFormComponent implements OnInit {
  private readonly breachService = inject(WorkingCapitalBreachService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  private readonly LIST_PATH = '/working-capital/breach';

  breachId: number | null = null;
  isEditMode = false;
  isSaving = false;

  breach: WorkingCapitalBreachRequest = { name: '' };
  calculationTypeOptions: StringEnumOptionData[] = [];
  frequencyTypeOptions: StringEnumOptionData[] = [];

  ngOnInit(): void {
    this.breachService.getWorkingCapitalBreachTemplate().subscribe((tpl) => {
      this.calculationTypeOptions = tpl.breachAmountCalculationTypeOptions ?? [];
      this.frequencyTypeOptions = tpl.breachFrequencyTypeOptions ?? [];
    });

    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.breachId = +id;
        this.isEditMode = true;
        this.load();
      }
    });
  }

  load(): void {
    if (!this.breachId) return;
    this.breachService.getWorkingCapitalBreachBreachesBreachId(this.breachId).subscribe((data) => {
      this.breach = {
        name: data.name,
        breachAmount: data.breachAmount,
        breachAmountCalculationType: data.breachAmountCalculationType?.code,
        breachFrequency: data.breachFrequency,
        breachFrequencyType: data.breachFrequencyType?.code,
      };
    });
  }

  onSubmit(): void {
    this.isSaving = true;
    const request$ =
      this.isEditMode && this.breachId
        ? this.breachService.putWorkingCapitalBreachBreachesBreachId(this.breachId, this.breach)
        : this.breachService.postWorkingCapitalBreachBreaches(this.breach);

    request$.subscribe({
      next: () => this.router.navigate([this.LIST_PATH]),
      error: () => (this.isSaving = false),
    });
  }

  onCancel(): void {
    this.router.navigate([this.LIST_PATH]);
  }
}
