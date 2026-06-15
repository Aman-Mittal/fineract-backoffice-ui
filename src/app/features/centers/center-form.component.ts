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
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {
  CentersService,
  OfficesService,
  PostCentersRequest,
  PostCentersCenterIdRequest,
  PutCentersCenterIdRequest,
  GetOfficesResponse,
} from '../../api';

/**
 * Component for creating and editing community centers.
 *
 * Centers are administrative groupings of groups in Fineract.
 * This component handles the lifecycle of center entities, ensuring
 * mandatory fields like activationDate are correctly handled for new entities.
 */
@Component({
  selector: 'app-center-form',
  standalone: true,
  imports: [
    FormsModule,
    TranslateModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCheckboxModule,
    MatTooltipModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatProgressSpinnerModule,
  ],
  template: `
    <div class="form-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>
            {{
              isEditMode
                ? ('CENTERS.EDIT_CENTER' | translate)
                : ('CENTERS.CREATE_CENTER' | translate)
            }}
          </mat-card-title>
        </mat-card-header>

        <mat-card-content>
          <form #centerForm="ngForm" (ngSubmit)="onSubmit()" class="center-form">
            <div class="form-grid">
              <!-- Name -->
              <mat-form-field
                appearance="outline"
                [matTooltip]="'HELP.CENTER_NAME_DESC' | translate"
              >
                <mat-label>{{ 'CENTERS.NAME' | translate }}</mat-label>
                <input matInput name="name" [(ngModel)]="center.name" required />
              </mat-form-field>

              <!-- Office -->
              <mat-form-field appearance="outline" [matTooltip]="'HELP.OFFICE_DESC' | translate">
                <mat-label>{{ 'COMMON.OFFICE' | translate }}</mat-label>
                <mat-select
                  name="officeId"
                  [(ngModel)]="center.officeId"
                  required
                  [disabled]="isEditMode"
                >
                  @for (office of offices; track office.id) {
                    <mat-option [value]="office.id">{{ office.name }}</mat-option>
                  }
                </mat-select>
              </mat-form-field>

              <!-- Activation Date -->
              @if (!isEditMode) {
                <mat-form-field
                  appearance="outline"
                  [matTooltip]="'HELP.ACTIVATION_DATE_DESC' | translate"
                >
                  <mat-label>{{ 'COMMON.ACTIVATION_DATE' | translate }}</mat-label>
                  <input
                    matInput
                    [matDatepicker]="picker"
                    name="activationDate"
                    [(ngModel)]="activationDate"
                    [required]="!!center.active"
                  />
                  <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
                  <mat-datepicker #picker></mat-datepicker>
                </mat-form-field>
              }

              <!-- Active -->
              <div class="checkbox-container">
                <mat-checkbox name="active" [(ngModel)]="center.active" [disabled]="isEditMode">
                  {{ 'COMMON.ACTIVE' | translate }}
                </mat-checkbox>
                <mat-icon [matTooltip]="'HELP.ACTIVE_DESC' | translate" class="help-icon"
                  >help_outline</mat-icon
                >
              </div>
            </div>

            <div class="form-actions">
              <button mat-button type="button" (click)="onCancel()" [disabled]="isSaving">
                {{ 'COMMON.CANCEL' | translate }}
              </button>
              @if (isEditMode && !originalActive) {
                <button
                  mat-raised-button
                  color="accent"
                  type="button"
                  (click)="onActivate()"
                  [disabled]="isSaving || !activationDate"
                >
                  @if (isSaving) {
                    <mat-spinner
                      diameter="20"
                      style="margin-right: 8px; display: inline-block; vertical-align: middle;"
                    ></mat-spinner>
                    {{ 'COMMON.SAVING' | translate }}
                  } @else {
                    Activate Center
                  }
                </button>
              }
              <button
                mat-raised-button
                color="primary"
                type="submit"
                [disabled]="centerForm.invalid || isSaving"
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
        max-width: 900px;
        margin: 0 auto;
      }
      .center-form {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }
      .form-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 16px;
      }
      mat-form-field {
        width: 100%;
      }
      .checkbox-container {
        display: flex;
        align-items: center;
        gap: 8px;
        height: 60px;
      }
      .form-actions {
        display: flex;
        justify-content: flex-end;
        gap: 12px;
        margin-top: 16px;
      }
      .help-icon {
        font-size: 18px;
        width: 18px;
        height: 18px;
        color: #7f8c8d;
        cursor: help;
      }
    `,
  ],
})
export class CenterFormComponent implements OnInit {
  /** Service for center operations */
  private readonly centersService = inject(CentersService);
  /** Service for office data retrieval */
  private readonly officesService = inject(OfficesService);
  /** Activated route for parameter access */
  private readonly route = inject(ActivatedRoute);
  /** Router for navigation */
  private readonly router = inject(Router);

  /** Constant for Fineract date format */
  private readonly DATE_FORMAT = 'yyyy-MM-dd';
  /** Path for redirection */
  private readonly LIST_PATH = '/centers';

  /** Center ID in edit mode */
  centerId: number | null = null;
  /** Edit mode flag */
  isEditMode = false;
  /** Save state */
  isSaving = false;
  /** Initial active state */
  originalActive = false;

  /** Strictly typed request model from OpenAPI */
  center: PostCentersRequest = {
    active: true,
  };

  /** Activation date for new centers */
  activationDate: Date = new Date();
  /** Office options */
  offices: GetOfficesResponse[] = [];

  /**
   * Initializes the component and loads initial data.
   */
  ngOnInit(): void {
    this.loadOffices();
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.centerId = +id;
        this.isEditMode = true;
        this.loadCenterData();
      }
    });
  }

  /**
   * Retrieves the list of available offices.
   */
  private loadOffices(): void {
    this.officesService.getOffices(true).subscribe((offices) => {
      this.offices = offices;
    });
  }

  /**
   * Loads center details for editing.
   */
  private loadCenterData(): void {
    if (!this.centerId) return;
    this.centersService.getCentersCenterId(this.centerId).subscribe((data) => {
      this.originalActive = !!(data as Record<string, unknown>)['active'];
      this.center = {
        name: data.name,
        officeId: data.officeId,
        active: this.originalActive,
      };
    });
  }

  onActivate(): void {
    if (!this.centerId || !this.activationDate) return;
    this.isSaving = true;

    const formattedDate = `${this.activationDate.getFullYear()}-${String(
      this.activationDate.getMonth() + 1,
    ).padStart(2, '0')}-${String(this.activationDate.getDate()).padStart(2, '0')}`;

    const payload = {
      activationDate: formattedDate,
      dateFormat: this.DATE_FORMAT,
      locale: 'en',
    };

    this.centersService
      .postCentersCenterId(this.centerId, payload as PostCentersCenterIdRequest, 'activate')
      .subscribe({
        next: () => {
          this.isSaving = false;
          this.originalActive = true;
          this.center.active = true;
        },
        error: () => (this.isSaving = false),
      });
  }

  /**
   * Handles form submission, applying mandatory date formatting.
   */
  onSubmit(): void {
    this.isSaving = true;

    if (this.isEditMode && this.centerId) {
      const payload: PutCentersCenterIdRequest = {
        name: this.center.name,
      };
      this.centersService.putCentersCenterId(this.centerId, payload).subscribe({
        next: () => this.router.navigate([this.LIST_PATH]),
        error: () => (this.isSaving = false),
      });
    } else {
      const formattedDate = `${this.activationDate.getFullYear()}-${String(
        this.activationDate.getMonth() + 1,
      ).padStart(2, '0')}-${String(this.activationDate.getDate()).padStart(2, '0')}`;

      // Assert as Record to include mandatory undocumented fields for activation
      const payload: Record<string, unknown> = {
        ...this.center,
        activationDate: formattedDate,
        dateFormat: this.DATE_FORMAT,
        locale: 'en',
      };

      this.centersService.postCenters(payload as PostCentersRequest).subscribe({
        next: () => this.router.navigate([this.LIST_PATH]),
        error: () => (this.isSaving = false),
      });
    }
  }

  /**
   * Navigates back to the center list.
   */
  onCancel(): void {
    this.router.navigate([this.LIST_PATH]);
  }
}
