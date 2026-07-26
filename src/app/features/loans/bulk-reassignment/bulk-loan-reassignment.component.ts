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
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { forkJoin } from 'rxjs';

import { BulkLoansService, OfficesService, StaffService } from '../../../api';
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonItem,
  IonLabel,
  IonSelect,
  IonSelectOption,
  IonSpinner,
} from '@ionic/angular/standalone';

interface Office {
  id?: number;
  name?: string;
}

interface StaffMember {
  id?: number;
  displayName?: string;
  officeId?: number;
}

@Component({
  selector: 'app-bulk-loan-reassignment',
  standalone: true,
  imports: [
    FormsModule,
    TranslateModule,
    MatSnackBarModule,
    IonButton,
    IonSpinner,
    IonItem,
    IonLabel,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonCard,
    IonSelectOption,
    IonSelect,
  ],
  template: `
    <ion-card>
      <ion-card-header>
        <ion-card-title>{{ 'BULK_LOANS.TITLE' | translate }}</ion-card-title>
      </ion-card-header>
      <ion-card-content>
        <div class="form-container">
          <ion-item fill="outline">
            <ion-label position="stacked">{{ 'BULK_LOANS.OFFICE' | translate }}</ion-label>
            <ion-select [(ngModel)]="selectedOfficeId" (ngModelChange)="onOfficeChange()">
              @for (office of offices; track office.id) {
                <ion-select-option [value]="office.id">{{ office.name }}</ion-select-option>
              }
            </ion-select>
          </ion-item>

          <ion-item fill="outline">
            <ion-label position="stacked">{{ 'BULK_LOANS.FROM_OFFICER' | translate }}</ion-label>
            <ion-select [(ngModel)]="selectedFromOfficerId" [disabled]="!selectedOfficeId">
              @for (officer of filteredStaff; track officer.id) {
                <ion-select-option [value]="officer.id">{{
                  officer.displayName
                }}</ion-select-option>
              }
            </ion-select>
          </ion-item>

          <ion-item fill="outline">
            <ion-label position="stacked">{{ 'BULK_LOANS.TO_OFFICER' | translate }}</ion-label>
            <ion-select [(ngModel)]="selectedToOfficerId" [disabled]="!selectedFromOfficerId">
              @for (officer of toOfficerList; track officer.id) {
                <ion-select-option [value]="officer.id">{{
                  officer.displayName
                }}</ion-select-option>
              }
            </ion-select>
          </ion-item>
        </div>
      </ion-card-content>
      <div class="card-actions form-actions">
        @if (isLoading) {
          <ion-spinner name="crescent"></ion-spinner>
        }
        <ion-button
          color="primary"
          [disabled]="
            !selectedOfficeId || !selectedFromOfficerId || !selectedToOfficerId || isLoading
          "
          (click)="onReassign()"
        >
          {{ 'BULK_LOANS.REASSIGN' | translate }}
        </ion-button>
      </div>
    </ion-card>
  `,
})
export class BulkLoanReassignmentComponent implements OnInit {
  private bulkLoansService = inject(BulkLoansService);
  private officesService = inject(OfficesService);
  private staffService = inject(StaffService);
  private snackBar = inject(MatSnackBar);

  offices: Office[] = [];
  allStaff: StaffMember[] = [];
  filteredStaff: StaffMember[] = [];

  selectedOfficeId: number | null = null;
  selectedFromOfficerId: number | null = null;
  selectedToOfficerId: number | null = null;
  isLoading = false;

  get toOfficerList(): StaffMember[] {
    return this.filteredStaff.filter((officer) => officer.id !== this.selectedFromOfficerId);
  }

  ngOnInit(): void {
    forkJoin({
      offices: this.officesService.getOffices(),
      staff: this.staffService.getStaff(),
    }).subscribe({
      next: ({ offices, staff }) => {
        this.offices = offices as Office[];
        const staffResponse = staff as { staffMembers?: StaffMember[] };
        this.allStaff =
          staffResponse.staffMembers ?? (Array.isArray(staff) ? (staff as StaffMember[]) : []);
        this.filteredStaff = [...this.allStaff];
      },
    });
  }

  onOfficeChange(): void {
    this.selectedFromOfficerId = null;
    this.selectedToOfficerId = null;
    if (this.selectedOfficeId) {
      const byOffice = this.allStaff.filter((s) => s.officeId === this.selectedOfficeId);
      this.filteredStaff = byOffice.length > 0 ? byOffice : [...this.allStaff];
    } else {
      this.filteredStaff = [...this.allStaff];
    }
  }

  onReassign(): void {
    if (!this.selectedFromOfficerId || !this.selectedToOfficerId) return;

    this.isLoading = true;
    const body = JSON.stringify({
      fromLoanOfficerId: this.selectedFromOfficerId,
      toLoanOfficerId: this.selectedToOfficerId,
      locale: 'en',
    });

    this.bulkLoansService.postLoansLoanreassignment(body).subscribe({
      next: () => {
        this.isLoading = false;
        this.snackBar.open('BULK_LOANS.SUCCESS', 'OK', { duration: 3000 });
        this.selectedOfficeId = null;
        this.selectedFromOfficerId = null;
        this.selectedToOfficerId = null;
        this.filteredStaff = [...this.allStaff];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }
}
