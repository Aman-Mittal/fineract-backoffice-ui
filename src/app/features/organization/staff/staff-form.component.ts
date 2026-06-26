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

import { Component, OnInit, inject, signal } from '@angular/core';
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
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import {
  StaffService,
  StaffCreateRequest,
  StaffUpdateRequest,
  OfficesService,
  GetOfficesResponse,
} from '../../../api';
import {
  formatDateToFineract,
  FINERACT_DATE_FORMAT,
  FINERACT_LOCALE,
} from '../../../core/utils/date-formatter';

@Component({
  selector: 'app-staff-form',
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
    MatIconModule,
    MatSnackBarModule,
  ],
  template: `
    <div class="form-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>
            {{
              isEditMode
                ? ('ORGANIZATION.EDIT_STAFF' | translate)
                : ('ORGANIZATION.CREATE_STAFF' | translate)
            }}
          </mat-card-title>
        </mat-card-header>

        <mat-card-content>
          <form #staffForm="ngForm" (ngSubmit)="onSubmit()" class="staff-form">
            <div class="form-grid">
              <mat-form-field appearance="outline">
                <mat-label>{{ 'COMMON.OFFICE' | translate }}</mat-label>
                <mat-select
                  name="officeId"
                  [(ngModel)]="staff.officeId"
                  required
                  [disabled]="isEditMode"
                >
                  @for (office of offices(); track office.id) {
                    <mat-option [value]="office.id">{{ office.name }}</mat-option>
                  }
                </mat-select>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>{{ 'CLIENTS.FIRST_NAME' | translate }}</mat-label>
                <input
                  matInput
                  name="firstname"
                  [(ngModel)]="staff.firstname"
                  required
                  [disabled]="isEditMode"
                />
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>{{ 'CLIENTS.LAST_NAME' | translate }}</mat-label>
                <input
                  matInput
                  name="lastname"
                  [(ngModel)]="staff.lastname"
                  required
                  [disabled]="isEditMode"
                />
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>{{ 'COMMON.EXTERNAL_ID' | translate }}</mat-label>
                <input matInput name="externalId" [(ngModel)]="staff.externalId" />
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>{{ 'CLIENTS.MOBILE_NO' | translate }}</mat-label>
                <input
                  matInput
                  name="mobileNo"
                  [(ngModel)]="staff.mobileNo"
                  [disabled]="isEditMode"
                />
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>{{ 'COMMON.EMAIL' | translate }}</mat-label>
                <input matInput type="email" name="emailAddress" [(ngModel)]="staff.emailAddress" />
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>{{ 'ACTIONS.ACTIVATION_DATE' | translate }}</mat-label>
                <input
                  matInput
                  [matDatepicker]="joiningPicker"
                  name="joiningDate"
                  [(ngModel)]="joiningDate"
                  [disabled]="isEditMode"
                />
                <mat-datepicker-toggle matSuffix [for]="joiningPicker"></mat-datepicker-toggle>
                <mat-datepicker #joiningPicker></mat-datepicker>
              </mat-form-field>
            </div>

            <div class="checkbox-group">
              <mat-checkbox name="isLoanOfficer" [(ngModel)]="staff.isLoanOfficer">
                {{ 'ORGANIZATION.IS_LOAN_OFFICER' | translate }}
              </mat-checkbox>

              <mat-checkbox name="forceStatus" [(ngModel)]="staff.forceStatus">
                Force Status
              </mat-checkbox>

              @if (!isEditMode) {
                <mat-checkbox name="isActive" [(ngModel)]="staff.isActive">
                  {{ 'COMMON.ACTIVE' | translate }}
                </mat-checkbox>
              }
            </div>

            <div class="form-actions">
              <button mat-button type="button" (click)="onCancel()">
                {{ 'COMMON.CANCEL' | translate }}
              </button>
              <button
                mat-raised-button
                color="primary"
                type="submit"
                [disabled]="!staffForm.form.valid"
              >
                {{ 'COMMON.SAVE' | translate }}
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
      .staff-form {
        display: flex;
        flex-direction: column;
        gap: 16px;
        padding-top: 16px;
      }
      .form-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 16px;
      }
      .checkbox-group {
        display: flex;
        flex-wrap: wrap;
        gap: 24px;
        margin: 8px 0;
      }
    `,
  ],
})
export class StaffFormComponent implements OnInit {
  private readonly staffService = inject(StaffService);
  private readonly officesService = inject(OfficesService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly snackBar = inject(MatSnackBar);

  private readonly staffListPath = '/organization/staff';

  staffId?: number;
  isEditMode = false;
  offices = signal<GetOfficesResponse[]>([]);
  joiningDate: Date = new Date();

  staff: Partial<StaffCreateRequest> = {
    officeId: undefined,
    firstname: '',
    lastname: '',
    externalId: '',
    mobileNo: '',
    isLoanOfficer: false,
    isActive: true,
    forceStatus: false,
  };

  ngOnInit(): void {
    this.loadOffices();
    this.staffId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.staffId) {
      this.isEditMode = true;
      this.loadStaffData();
    }
  }

  loadOffices(): void {
    this.officesService.getOffices().subscribe((data) => this.offices.set(data));
  }

  loadStaffData(): void {
    this.staffService.getStaffStaffId(this.staffId!).subscribe((data) => {
      this.staff = {
        officeId: data.officeId,
        firstname: data.firstname,
        lastname: data.lastname,
        externalId: data.externalId,
        mobileNo: data.mobileNo,
        isLoanOfficer: data.isLoanOfficer,
        isActive: data.isActive,
        forceStatus:
          ((data as Record<string, unknown>)['forceStatus'] as boolean | undefined) ?? false,
        emailAddress: (data as Record<string, unknown>)['emailAddress'] as string | undefined,
      };
      if (data.joiningDate) {
        const jd = data.joiningDate as unknown as number[];
        this.joiningDate = new Date(jd[0], jd[1] - 1, jd[2]);
      }
    });
  }

  onSubmit(): void {
    if (this.isEditMode) {
      const updatePayload: StaffUpdateRequest = {
        externalId: this.staff.externalId,
        isLoanOfficer: this.staff.isLoanOfficer,
      };
      this.staffService.putStaffStaffId(this.staffId!, updatePayload).subscribe({
        next: () => this.router.navigate([this.staffListPath]),
        error: () =>
          this.snackBar.open('Operation failed. Please try again.', 'Close', { duration: 3000 }),
      });
    } else {
      const payload = {
        ...this.staff,
        joiningDate: formatDateToFineract(this.joiningDate),
        dateFormat: FINERACT_DATE_FORMAT,
        locale: FINERACT_LOCALE,
      } as StaffCreateRequest;
      this.staffService.postStaff(payload).subscribe({
        next: () => this.router.navigate([this.staffListPath]),
        error: () =>
          this.snackBar.open('Operation failed. Please try again.', 'Close', { duration: 3000 }),
      });
    }
  }

  onCancel(): void {
    this.router.navigate([this.staffListPath]);
  }
}
