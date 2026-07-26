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
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { NotificationService } from '../../../core/services/notification.service';
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonCheckbox,
  IonInput,
  IonItem,
  IonLabel,
  IonSelect,
  IonSelectOption,
} from '@ionic/angular/standalone';
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
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    IonButton,
    IonInput,
    IonItem,
    IonLabel,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonCard,
    IonSelectOption,
    IonSelect,
    IonCheckbox,
  ],
  template: `
    <div class="form-container">
      <ion-card>
        <ion-card-header>
          <ion-card-title>
            {{
              isEditMode
                ? ('ORGANIZATION.EDIT_STAFF' | translate)
                : ('ORGANIZATION.CREATE_STAFF' | translate)
            }}
          </ion-card-title>
        </ion-card-header>

        <ion-card-content>
          <form #staffForm="ngForm" (ngSubmit)="onSubmit()" class="staff-form">
            <div class="form-grid">
              <ion-item fill="outline">
                <ion-label position="stacked">{{ 'COMMON.OFFICE' | translate }}</ion-label>
                <ion-select
                  name="officeId"
                  [(ngModel)]="staff.officeId"
                  required
                  [disabled]="isEditMode"
                >
                  @for (office of offices(); track office.id) {
                    <ion-select-option [value]="office.id">{{ office.name }}</ion-select-option>
                  }
                </ion-select>
              </ion-item>

              <ion-item fill="outline">
                <ion-label position="stacked">{{ 'CLIENTS.FIRST_NAME' | translate }}</ion-label>
                <ion-input
                  name="firstname"
                  [(ngModel)]="staff.firstname"
                  required
                  [disabled]="isEditMode"
                ></ion-input>
              </ion-item>

              <ion-item fill="outline">
                <ion-label position="stacked">{{ 'CLIENTS.LAST_NAME' | translate }}</ion-label>
                <ion-input
                  name="lastname"
                  [(ngModel)]="staff.lastname"
                  required
                  [disabled]="isEditMode"
                ></ion-input>
              </ion-item>

              <ion-item fill="outline">
                <ion-label position="stacked">{{ 'COMMON.EXTERNAL_ID' | translate }}</ion-label>
                <ion-input name="externalId" [(ngModel)]="staff.externalId"></ion-input>
              </ion-item>

              <ion-item fill="outline">
                <ion-label position="stacked">{{ 'CLIENTS.MOBILE_NO' | translate }}</ion-label>
                <ion-input
                  name="mobileNo"
                  [(ngModel)]="staff.mobileNo"
                  [disabled]="isEditMode"
                ></ion-input>
              </ion-item>

              <ion-item fill="outline">
                <ion-label position="stacked">{{ 'COMMON.EMAIL' | translate }}</ion-label>
                <ion-input
                  type="email"
                  name="emailAddress"
                  [(ngModel)]="staff.emailAddress"
                ></ion-input>
              </ion-item>

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
              <ion-checkbox name="isLoanOfficer" [(ngModel)]="staff.isLoanOfficer">
                {{ 'ORGANIZATION.IS_LOAN_OFFICER' | translate }}
              </ion-checkbox>

              <ion-checkbox name="forceStatus" [(ngModel)]="staff.forceStatus">
                Force Status
              </ion-checkbox>

              @if (!isEditMode) {
                <ion-checkbox name="isActive" [(ngModel)]="staff.isActive">
                  {{ 'COMMON.ACTIVE' | translate }}
                </ion-checkbox>
              }
            </div>

            <div class="form-actions">
              <ion-button fill="clear" type="button" (click)="onCancel()">
                {{ 'COMMON.CANCEL' | translate }}
              </ion-button>
              <ion-button color="primary" type="submit" [disabled]="!staffForm.form.valid">
                {{ 'COMMON.SAVE' | translate }}
              </ion-button>
            </div>
          </form>
        </ion-card-content>
      </ion-card>
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
  private readonly notifications = inject(NotificationService);

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
        error: () => this.notifications.error('Operation failed. Please try again.'),
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
        error: () => this.notifications.error('Operation failed. Please try again.'),
      });
    }
  }

  onCancel(): void {
    this.router.navigate([this.staffListPath]);
  }
}
