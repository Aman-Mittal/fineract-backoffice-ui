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
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {
  TellerCashManagementService,
  StaffService,
  PostTellersTellerIdCashiersRequest,
  StaffData,
} from '../../../api';

/**
 * Component for allocating a staff member as a cashier to a teller.
 *
 * Handles the association of staff to physical tellers/drawers for a
 * defined period. Includes shift management (Full time vs specific hours).
 */
@Component({
  selector: 'app-cashier-form',
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
    MatCheckboxModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
  ],
  template: `
    <div class="form-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>{{ 'TELLERS.ALLOCATE_CASHIER' | translate }}</mat-card-title>
        </mat-card-header>

        <mat-card-content>
          <form #cashierForm="ngForm" (ngSubmit)="onSubmit()" class="cashier-form">
            <div class="form-grid">
              <!-- Staff Selection -->
              <mat-form-field
                appearance="outline"
                [matTooltip]="'HELP.CASHIER_STAFF_DESC' | translate"
              >
                <mat-label>{{ 'TELLERS.STAFF' | translate }}</mat-label>
                <mat-select name="staffId" [(ngModel)]="cashier.staffId" required>
                  @for (member of staff; track member.id) {
                    <mat-option [value]="member.id">{{ member.displayName }}</mat-option>
                  }
                </mat-select>
              </mat-form-field>

              <!-- Start Date -->
              <mat-form-field appearance="outline">
                <mat-label>{{ 'TELLERS.START_DATE' | translate }}</mat-label>
                <input
                  matInput
                  [matDatepicker]="startPicker"
                  name="startDate"
                  [(ngModel)]="startDate"
                  required
                />
                <mat-datepicker-toggle matSuffix [for]="startPicker"></mat-datepicker-toggle>
                <mat-datepicker #startPicker></mat-datepicker>
              </mat-form-field>

              <!-- End Date -->
              <mat-form-field appearance="outline">
                <mat-label>{{ 'TELLERS.END_DATE' | translate }}</mat-label>
                <input
                  matInput
                  [matDatepicker]="endPicker"
                  name="endDate"
                  [(ngModel)]="endDate"
                  required
                />
                <mat-datepicker-toggle matSuffix [for]="endPicker"></mat-datepicker-toggle>
                <mat-datepicker #endPicker></mat-datepicker>
              </mat-form-field>

              <!-- Full Time -->
              <div class="checkbox-container">
                <mat-checkbox name="isFullDay" [(ngModel)]="cashier.isFullDay">
                  {{ 'TELLERS.IS_FULL_TIME' | translate }}
                </mat-checkbox>
              </div>

              <!-- Description -->
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>{{ 'COMMON.NOTE' | translate }}</mat-label>
                <textarea
                  matInput
                  name="description"
                  [(ngModel)]="cashier.description"
                  rows="2"
                ></textarea>
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
                [disabled]="cashierForm.invalid || isSaving"
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
        max-width: 800px;
        margin: 0 auto;
      }
      .cashier-form {
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
      .checkbox-container {
        display: flex;
        align-items: center;
        height: 60px;
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
export class CashierFormComponent implements OnInit {
  /** Service for teller/cashier management */
  private readonly tellerService = inject(TellerCashManagementService);
  /** Service for staff retrieval */
  private readonly staffService = inject(StaffService);
  /** Router for navigation */
  private readonly router = inject(Router);
  /** Activated route for teller ID */
  private readonly route = inject(ActivatedRoute);

  /** Current teller identifier */
  tellerId = 0;
  /** State of the save operation */
  isSaving = false;

  /** Post request model for cashier allocation */
  cashier: PostTellersTellerIdCashiersRequest = {
    isFullDay: true,
  };

  /** Date objects for template binding */
  startDate: Date = new Date();
  endDate: Date = new Date();
  /** List of staff available for allocation */
  staff: StaffData[] = [];

  /**
   * Initializes the component and retrieves context.
   */
  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.tellerId = +params['tellerId'];
    });
    this.loadStaff();
  }

  /**
   * Retrieves active staff members.
   */
  private loadStaff(): void {
    this.staffService.retrieveAll16().subscribe({
      next: (data: StaffData[]) => {
        this.staff = data || [];
      },
      error: (err: unknown) => {
        console.error('Failed to load staff', err);
      },
    });
  }

  /**
   * Handles form submission, formatting dates for the Fineract API.
   */
  onSubmit(): void {
    this.isSaving = true;

    const formattedStartDate = `${this.startDate.getFullYear()}-${String(this.startDate.getMonth() + 1).padStart(2, '0')}-${String(this.startDate.getDate()).padStart(2, '0')}`;
    const formattedEndDate = `${this.endDate.getFullYear()}-${String(this.endDate.getMonth() + 1).padStart(2, '0')}-${String(this.endDate.getDate()).padStart(2, '0')}`;

    this.cashier.startDate = formattedStartDate;
    this.cashier.endDate = formattedEndDate;
    this.cashier.dateFormat = 'yyyy-MM-dd';
    this.cashier.locale = 'en';

    this.tellerService.createCashier(this.tellerId, this.cashier).subscribe({
      next: () => this.router.navigate(['/tellers', this.tellerId, 'cashiers']),
      error: () => (this.isSaving = false),
    });
  }

  /**
   * Navigates back to the cashier list.
   */
  onCancel(): void {
    this.router.navigate(['/tellers', this.tellerId, 'cashiers']);
  }
}
