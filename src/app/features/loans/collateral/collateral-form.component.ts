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
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import {
  LoanCollateralService,
  LoansLoanIdCollateralsRequest,
  LoansLoandIdCollateralsCollateralIdRequest,
  CollateralData,
  CodeValueData,
  GetLoansLoanIdCollateralsResponse,
} from '../../../api';

/**
 * Component for adding or editing loan collateral.
 */
@Component({
  selector: 'app-collateral-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatTooltipModule,
  ],
  template: `
    <div class="form-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>
            {{
              isEditMode
                ? ('LOANS.EDIT_COLLATERAL' | translate)
                : ('LOANS.ADD_COLLATERAL' | translate)
            }}
          </mat-card-title>
        </mat-card-header>

        <mat-card-content>
          <form #collateralForm="ngForm" (ngSubmit)="onSubmit()" class="collateral-form">
            <div class="form-grid">
              <!-- Collateral Type -->
              <mat-form-field
                appearance="outline"
                [matTooltip]="'HELP.COLLATERAL_TYPE_DESC' | translate"
              >
                <mat-label>{{ 'COMMON.TYPE' | translate }}</mat-label>
                <mat-select
                  name="collateralTypeId"
                  [(ngModel)]="selectedCollateralTypeId"
                  required
                  [disabled]="isEditMode"
                >
                  @for (type of collateralTypes; track type.id) {
                    <mat-option [value]="type.id">{{ type.name }}</mat-option>
                  }
                </mat-select>
              </mat-form-field>

              <!-- Value -->
              <mat-form-field
                appearance="outline"
                [matTooltip]="'HELP.COLLATERAL_VALUE_DESC' | translate"
              >
                <mat-label>{{ 'COMMON.VALUE' | translate }}</mat-label>
                <input matInput type="number" name="value" [(ngModel)]="collateralValue" required />
              </mat-form-field>

              <!-- Description -->
              <mat-form-field
                appearance="outline"
                class="full-width"
                [matTooltip]="'HELP.COLLATERAL_DESC' | translate"
              >
                <mat-label>{{ 'COMMON.DESCRIPTION' | translate }}</mat-label>
                <textarea
                  matInput
                  name="description"
                  [(ngModel)]="collateralDescription"
                  required
                  rows="3"
                ></textarea>
              </mat-form-field>
            </div>

            <div class="form-actions">
              <button mat-button type="button" (click)="onCancel()">
                {{ 'COMMON.CANCEL' | translate }}
              </button>
              <button
                mat-raised-button
                color="primary"
                type="submit"
                [disabled]="collateralForm.invalid || isSaving"
              >
                {{ isSaving ? ('COMMON.SAVING' | translate) : ('COMMON.SAVE' | translate) }}
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
        max-width: 800px;
        margin: 0 auto;
      }
      .collateral-form {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }
      .form-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 16px;
      }
      .full-width {
        grid-column: span 2;
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
export class CollateralFormComponent implements OnInit {
  private readonly collateralService = inject(LoanCollateralService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  loanId: number | null = null;
  collateralId: number | null = null;
  isEditMode = false;
  isSaving = false;

  collateralTypes: CodeValueData[] = [];

  // Binding variables
  selectedCollateralTypeId: number | null = null;
  collateralValue = 0;
  collateralDescription = '';

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const loanIdParam = params.get('loanId');
      const collateralIdParam = params.get('id');

      if (loanIdParam) {
        this.loanId = +loanIdParam;
        this.loadTemplate();

        if (collateralIdParam) {
          this.collateralId = +collateralIdParam;
          this.isEditMode = true;
          this.loadCollateral();
        }
      }
    });
  }

  private loadTemplate(): void {
    if (!this.loanId) return;
    this.collateralService.newCollateralTemplate(this.loanId).subscribe({
      next: (template: CollateralData) => {
        this.collateralTypes = template.allowedCollateralTypes || [];
      },
      error: (err) => console.error('Failed to load collateral template', err),
    });
  }

  private loadCollateral(): void {
    if (!this.loanId || !this.collateralId) return;
    this.collateralService.retrieveCollateralDetails1(this.loanId, this.collateralId).subscribe({
      next: (data: GetLoansLoanIdCollateralsResponse) => {
        this.selectedCollateralTypeId = data.type?.id || null;
        this.collateralValue = data.value || 0;
        this.collateralDescription = data.description || '';
      },
      error: (err) => console.error('Failed to load collateral details', err),
    });
  }

  onSubmit(): void {
    if (!this.loanId) return;
    this.isSaving = true;

    const requestPayload = {
      collateralTypeId: this.selectedCollateralTypeId,
      value: this.collateralValue,
      description: this.collateralDescription,
    };

    if (this.isEditMode && this.collateralId) {
      this.collateralService
        .updateCollateral(
          this.loanId,
          this.collateralId,
          requestPayload as LoansLoandIdCollateralsCollateralIdRequest,
        )
        .subscribe({
          next: () => this.router.navigate(['/loans', this.loanId, 'collateral']),
          error: () => (this.isSaving = false),
        });
    } else {
      this.collateralService
        .createCollateral(this.loanId, requestPayload as LoansLoanIdCollateralsRequest)
        .subscribe({
          next: () => this.router.navigate(['/loans', this.loanId, 'collateral']),
          error: () => (this.isSaving = false),
        });
    }
  }

  onCancel(): void {
    if (this.loanId) {
      this.router.navigate(['/loans', this.loanId, 'collateral']);
    }
  }
}
