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
  CollateralManagementService,
  CollateralProductCreateRequest,
  CurrencyData,
} from '../../../api';

/**
 * Create / edit form for a collateral product master-data record.
 * Currency options come from the collateral-management template endpoint.
 */
@Component({
  selector: 'app-collateral-management-form',
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
            {{
              isEditMode
                ? ('COLLATERAL_MANAGEMENT.EDIT' | translate)
                : ('COLLATERAL_MANAGEMENT.CREATE' | translate)
            }}
          </mat-card-title>
        </mat-card-header>

        <mat-card-content>
          <form #collateralForm="ngForm" (ngSubmit)="onSubmit()" class="collateral-form">
            <mat-form-field appearance="outline">
              <mat-label>{{ 'COLLATERAL_MANAGEMENT.NAME' | translate }}</mat-label>
              <input matInput name="name" [(ngModel)]="collateral.name" required />
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>{{ 'COLLATERAL_MANAGEMENT.QUALITY' | translate }}</mat-label>
              <input matInput name="quality" [(ngModel)]="collateral.quality" required />
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>{{ 'COLLATERAL_MANAGEMENT.UNIT_TYPE' | translate }}</mat-label>
              <input matInput name="unitType" [(ngModel)]="collateral.unitType" required />
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>{{ 'COLLATERAL_MANAGEMENT.BASE_PRICE' | translate }}</mat-label>
              <input
                matInput
                type="number"
                name="basePrice"
                [(ngModel)]="collateral.basePrice"
                required
              />
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>{{ 'COLLATERAL_MANAGEMENT.PCT_TO_BASE' | translate }}</mat-label>
              <input
                matInput
                type="number"
                name="pctToBase"
                [(ngModel)]="collateral.pctToBase"
                required
              />
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>{{ 'COLLATERAL_MANAGEMENT.CURRENCY' | translate }}</mat-label>
              <mat-select name="currency" [(ngModel)]="collateral.currency" required>
                @for (opt of currencyOptions; track opt.code) {
                  <mat-option [value]="opt.code">{{ opt.name }} ({{ opt.code }})</mat-option>
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
                [disabled]="collateralForm.invalid || isSaving"
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
      .collateral-form {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }
    `,
  ],
})
export class CollateralManagementFormComponent implements OnInit {
  private readonly collateralService = inject(CollateralManagementService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  private readonly LIST_PATH = '/products/collateral-management';

  collateralId: number | null = null;
  isEditMode = false;
  isSaving = false;

  collateral: CollateralProductCreateRequest = {
    name: '',
    quality: '',
    unitType: '',
    basePrice: 0,
    pctToBase: 0,
    currency: '',
    locale: 'en',
  };
  currencyOptions: CurrencyData[] = [];

  ngOnInit(): void {
    this.collateralService.getCollateralManagementTemplate().subscribe((currencies) => {
      this.currencyOptions = currencies ?? [];
    });

    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.collateralId = +id;
        this.isEditMode = true;
        this.load();
      }
    });
  }

  load(): void {
    if (!this.collateralId) return;
    this.collateralService
      .getCollateralManagementCollateralId(this.collateralId)
      .subscribe((data) => {
        this.collateral = {
          name: data.name ?? '',
          quality: data.quality ?? '',
          unitType: data.unitType ?? '',
          basePrice: data.basePrice ?? 0,
          pctToBase: data.pctToBase ?? 0,
          currency: data.currency ?? '',
          locale: 'en',
        };
      });
  }

  onSubmit(): void {
    this.isSaving = true;
    const request$ =
      this.isEditMode && this.collateralId
        ? this.collateralService.putCollateralManagementCollateralId(
            this.collateralId,
            this.collateral,
          )
        : this.collateralService.postCollateralManagement(this.collateral);

    request$.subscribe({
      next: () => this.router.navigate([this.LIST_PATH]),
      error: () => (this.isSaving = false),
    });
  }

  onCancel(): void {
    this.router.navigate([this.LIST_PATH]);
  }
}
