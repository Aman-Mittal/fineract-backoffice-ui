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
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {
  TellerCashManagementService,
  OfficesService,
  PostTellersRequest,
  PutTellersRequest,
  GetOfficesResponse,
} from '../../api';

/**
 * Component for creating and editing branch tellers.
 *
 * Provides a template-driven form that binds directly to Fineract OpenAPI
 * request models. Supports the full lifecycle of teller entity management.
 *
 * @example
 * <app-teller-form></app-teller-form>
 */
@Component({
  selector: 'app-teller-form',
  standalone: true,
  imports: [
    FormsModule,
    TranslateModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
  ],
  template: `
    <div class="form-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>
            {{
              isEditMode
                ? ('TELLERS.EDIT_TELLER' | translate)
                : ('TELLERS.CREATE_TELLER' | translate)
            }}
          </mat-card-title>
        </mat-card-header>

        <mat-card-content>
          <form #tellerForm="ngForm" (ngSubmit)="onSubmit()" class="teller-form">
            <div class="form-grid">
              <!-- Name -->
              <mat-form-field
                appearance="outline"
                [matTooltip]="'HELP.TELLER_NAME_DESC' | translate"
              >
                <mat-label>{{ 'TELLERS.NAME' | translate }}</mat-label>
                <input matInput name="name" [(ngModel)]="teller.name" required />
              </mat-form-field>

              <!-- Office -->
              <mat-form-field
                appearance="outline"
                [matTooltip]="'HELP.TELLER_OFFICE_DESC' | translate"
              >
                <mat-label>{{ 'TELLERS.OFFICE' | translate }}</mat-label>
                <mat-select
                  name="officeId"
                  [(ngModel)]="teller.officeId"
                  required
                  [disabled]="isEditMode"
                >
                  @for (office of offices; track office.id) {
                    <mat-option [value]="office.id">{{ office.name }}</mat-option>
                  }
                </mat-select>
              </mat-form-field>

              <!-- Description -->
              <mat-form-field
                appearance="outline"
                [matTooltip]="'HELP.TELLER_DESCRIPTION_DESC' | translate"
                class="full-width"
              >
                <mat-label>{{ 'TELLERS.DESCRIPTION' | translate }}</mat-label>
                <textarea
                  matInput
                  name="description"
                  [(ngModel)]="teller.description"
                  rows="3"
                ></textarea>
              </mat-form-field>

              <!-- Start Date -->
              <mat-form-field
                appearance="outline"
                [matTooltip]="'HELP.TELLER_START_DATE_DESC' | translate"
              >
                <mat-label>{{ 'TELLERS.START_DATE' | translate }}</mat-label>
                <input
                  matInput
                  [matDatepicker]="picker"
                  name="startDate"
                  [(ngModel)]="startDate"
                  required
                />
                <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
                <mat-datepicker #picker></mat-datepicker>
              </mat-form-field>

              <!-- Status -->
              <mat-form-field
                appearance="outline"
                [matTooltip]="'HELP.TELLER_STATUS_DESC' | translate"
              >
                <mat-label>{{ 'TELLERS.STATUS' | translate }}</mat-label>
                <mat-select name="status" [(ngModel)]="teller.status" required>
                  <mat-option value="ACTIVE">{{ 'COMMON.ACTIVE' | translate }}</mat-option>
                  <mat-option value="INACTIVE">{{ 'COMMON.INACTIVE' | translate }}</mat-option>
                </mat-select>
              </mat-form-field>

              <!-- Usage -->
              <mat-form-field
                appearance="outline"
                [matTooltip]="'HELP.TELLER_USAGE_DESC' | translate"
              >
                <mat-label>{{ 'TELLERS.USAGE' | translate }}</mat-label>
                <mat-select name="usage" [(ngModel)]="usage" required>
                  <mat-option [value]="1">Cashier</mat-option>
                </mat-select>
              </mat-form-field>
            </div>

            <div class="form-actions">
              <button mat-button type="button" (click)="onCancel()" [disabled]="isSaving">
                {{ 'COMMON.CANCEL' | translate }}
              </button>
              <button
                mat-raised-button
                color="primary"
                type="submit"
                [disabled]="tellerForm.invalid || isSaving"
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
      .teller-form {
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
export class TellerFormComponent implements OnInit {
  /** Service for teller management API calls */
  private readonly tellerService = inject(TellerCashManagementService);
  /** Service for retrieving office hierarchy */
  private readonly officesService = inject(OfficesService);
  /** Router for post-submission navigation */
  private readonly router = inject(Router);
  /** Activated route for retrieving the teller ID in edit mode */
  private readonly route = inject(ActivatedRoute);

  /** Base path for the teller list view */
  private readonly LIST_PATH = '/tellers';

  /** The unique identifier for the teller being edited */
  tellerId: number | null = null;
  /** Indicates if the component is in edit mode */
  isEditMode = false;
  /** State of the save operation */
  isSaving = false;

  /** Post request model instance for template data binding */
  teller: PostTellersRequest = {
    status: 'ACTIVE',
  };

  /** Usage value, not in PostTellersRequest but needed for form */
  usage = 1;

  /** Formatted start date for Fineract API */
  startDate: Date = new Date();
  /** List of available offices for teller assignment */
  offices: GetOfficesResponse[] = [];

  /**
   * Component initialization.
   * Loads office data and checks for edit mode parameters.
   */
  ngOnInit(): void {
    this.loadOffices();
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.tellerId = +id;
        this.isEditMode = true;
        this.loadTellerData();
      }
    });
  }

  /**
   * Retrieves the office list from the API.
   */
  private loadOffices(): void {
    this.officesService.getOffices(true).subscribe((data) => {
      this.offices = data;
    });
  }

  /**
   * Retrieves existing teller data for population in edit mode.
   */
  private loadTellerData(): void {
    if (!this.tellerId) return;
    this.tellerService.getTellersTellerId(this.tellerId).subscribe((data) => {
      const dateArray = data.startDate as unknown as number[];
      if (dateArray) {
        this.startDate = new Date(dateArray[0], dateArray[1] - 1, dateArray[2]);
      }
      this.teller = {
        name: data.name,
        officeId: data.officeId,
        description: (data as Record<string, unknown>)['description'] as string,
        status: data.status as PostTellersRequest.StatusEnum,
      };
    });
  }

  /**
   * Form-submission handler.
   * Dispatches create or update requests based on the current mode.
   */
  onSubmit(): void {
    this.isSaving = true;
    const formattedDate = `${this.startDate.getFullYear()}-${String(this.startDate.getMonth() + 1).padStart(2, '0')}-${String(this.startDate.getDate()).padStart(2, '0')}`;

    if (this.isEditMode && this.tellerId) {
      const payload: Record<string, unknown> = {
        name: this.teller.name,
        description: this.teller.description,
        startDate: formattedDate,
        status: this.teller.status === 'ACTIVE' ? 300 : 400,
        dateFormat: 'yyyy-MM-dd',
        locale: 'en',
      };
      this.tellerService.putTellersTellerId(this.tellerId, payload as PutTellersRequest).subscribe({
        next: () => this.router.navigate([this.LIST_PATH]),
        error: () => (this.isSaving = false),
      });
    } else {
      const payload: Record<string, unknown> = {
        ...this.teller,
        startDate: formattedDate,
        status: this.teller.status === 'ACTIVE' ? 300 : 400,
        dateFormat: 'yyyy-MM-dd',
        locale: 'en',
      };

      this.tellerService.postTellers(payload as PostTellersRequest).subscribe({
        next: () => this.router.navigate([this.LIST_PATH]),
        error: () => (this.isSaving = false),
      });
    }
  }

  /**
   * Handles user cancellation of the form operation.
   */
  onCancel(): void {
    this.router.navigate([this.LIST_PATH]);
  }
}
