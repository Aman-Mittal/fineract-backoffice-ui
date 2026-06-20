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
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { forkJoin } from 'rxjs';

import { BulkLoansService, OfficesService, StaffService } from '../../../api';

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
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
  ],
  template: `
    <mat-card>
      <mat-card-header>
        <mat-card-title>{{ 'BULK_LOANS.TITLE' | translate }}</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <div class="form-container">
          <mat-form-field appearance="outline">
            <mat-label>{{ 'BULK_LOANS.OFFICE' | translate }}</mat-label>
            <mat-select [(ngModel)]="selectedOfficeId" (ngModelChange)="onOfficeChange()">
              @for (office of offices; track office.id) {
                <mat-option [value]="office.id">{{ office.name }}</mat-option>
              }
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>{{ 'BULK_LOANS.FROM_OFFICER' | translate }}</mat-label>
            <mat-select [(ngModel)]="selectedFromOfficerId" [disabled]="!selectedOfficeId">
              @for (officer of filteredStaff; track officer.id) {
                <mat-option [value]="officer.id">{{ officer.displayName }}</mat-option>
              }
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>{{ 'BULK_LOANS.TO_OFFICER' | translate }}</mat-label>
            <mat-select [(ngModel)]="selectedToOfficerId" [disabled]="!selectedFromOfficerId">
              @for (officer of toOfficerList; track officer.id) {
                <mat-option [value]="officer.id">{{ officer.displayName }}</mat-option>
              }
            </mat-select>
          </mat-form-field>
        </div>
      </mat-card-content>
      <mat-card-actions class="form-actions">
        @if (isLoading) {
          <mat-spinner diameter="24"></mat-spinner>
        }
        <button
          mat-raised-button
          color="primary"
          [disabled]="
            !selectedOfficeId || !selectedFromOfficerId || !selectedToOfficerId || isLoading
          "
          (click)="onReassign()"
        >
          {{ 'BULK_LOANS.REASSIGN' | translate }}
        </button>
      </mat-card-actions>
    </mat-card>
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
