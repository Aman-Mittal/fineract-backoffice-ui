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
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { BulkLoansService } from '../../../api';
import {
  formatDateToFineract,
  FINERACT_DATE_FORMAT,
  FINERACT_LOCALE,
} from '../../../core/utils/date-formatter';

/**
 * Minimal option shape shared by office and loan-officer dropdowns returned by the
 * loan-reassignment template endpoint.
 */
interface ReassignmentOption {
  id?: number;
  name?: string;
  displayName?: string;
}

/**
 * Template payload for bulk loan reassignment. The generated `getLoansLoanreassignmentTemplate`
 * is typed as `string` (raw OpenAPI), but the endpoint actually returns office and loan-officer
 * option lists, so the response is read through this loose shape.
 */
interface ReassignmentTemplate {
  officeOptions?: ReassignmentOption[];
  loanOfficerOptions?: ReassignmentOption[];
}

/**
 * Bulk Loan Reassignment — single action screen that moves every loan currently
 * assigned to one loan officer over to another within an office, on a given date.
 */
@Component({
  selector: 'app-bulk-reassignment',
  standalone: true,
  imports: [
    FormsModule,
    TranslateModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
  ],
  template: `
    <div class="form-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>{{ 'BULK_REASSIGNMENT.TITLE' | translate }}</mat-card-title>
        </mat-card-header>

        <mat-card-content>
          <form #reassignForm="ngForm" (ngSubmit)="onSubmit()" class="reassign-form">
            <mat-form-field appearance="outline">
              <mat-label>{{ 'BULK_REASSIGNMENT.OFFICE' | translate }}</mat-label>
              <mat-select
                name="officeId"
                [(ngModel)]="officeId"
                (selectionChange)="onOfficeChange()"
                required
              >
                @for (opt of officeOptions; track opt.id) {
                  <mat-option [value]="opt.id">{{ opt.name }}</mat-option>
                }
              </mat-select>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>{{ 'BULK_REASSIGNMENT.FROM_OFFICER' | translate }}</mat-label>
              <mat-select name="fromLoanOfficerId" [(ngModel)]="fromLoanOfficerId" required>
                @for (opt of loanOfficerOptions; track opt.id) {
                  <mat-option [value]="opt.id">{{ opt.displayName }}</mat-option>
                }
              </mat-select>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>{{ 'BULK_REASSIGNMENT.TO_OFFICER' | translate }}</mat-label>
              <mat-select name="toLoanOfficerId" [(ngModel)]="toLoanOfficerId" required>
                @for (opt of loanOfficerOptions; track opt.id) {
                  <mat-option [value]="opt.id">{{ opt.displayName }}</mat-option>
                }
              </mat-select>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>{{ 'BULK_REASSIGNMENT.ASSIGNMENT_DATE' | translate }}</mat-label>
              <input
                matInput
                [matDatepicker]="picker"
                name="assignmentDate"
                [(ngModel)]="assignmentDate"
                required
              />
              <mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>
              <mat-datepicker #picker></mat-datepicker>
            </mat-form-field>

            <div class="form-actions">
              <button mat-button type="button" (click)="onCancel()" [disabled]="isSaving">
                {{ 'COMMON.CANCEL' | translate }}
              </button>
              <button
                mat-raised-button
                color="primary"
                type="submit"
                [disabled]="reassignForm.invalid || isSaving"
              >
                @if (isSaving) {
                  <mat-spinner
                    diameter="20"
                    style="margin-right: 8px; display: inline-block; vertical-align: middle;"
                  ></mat-spinner>
                  {{ 'COMMON.SAVING' | translate }}
                } @else {
                  {{ 'BULK_REASSIGNMENT.REASSIGN' | translate }}
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
      .reassign-form {
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
export class BulkReassignmentComponent implements OnInit {
  private readonly bulkLoansService = inject(BulkLoansService);
  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);

  private readonly LIST_PATH = '/loans';

  isSaving = false;

  officeId: number | null = null;
  fromLoanOfficerId: number | null = null;
  toLoanOfficerId: number | null = null;
  assignmentDate: Date | null = null;

  officeOptions: ReassignmentOption[] = [];
  loanOfficerOptions: ReassignmentOption[] = [];

  ngOnInit(): void {
    this.loadTemplate();
  }

  loadTemplate(officeId?: number): void {
    this.bulkLoansService.getLoansLoanreassignmentTemplate(officeId).subscribe((tpl) => {
      const template = tpl as unknown as ReassignmentTemplate;
      this.officeOptions = template.officeOptions ?? [];
      this.loanOfficerOptions = template.loanOfficerOptions ?? [];
    });
  }

  onOfficeChange(): void {
    this.fromLoanOfficerId = null;
    this.toLoanOfficerId = null;
    this.loadTemplate(this.officeId ?? undefined);
  }

  onSubmit(): void {
    this.isSaving = true;
    const body = JSON.stringify({
      officeId: this.officeId,
      fromLoanOfficerId: this.fromLoanOfficerId,
      toLoanOfficerId: this.toLoanOfficerId,
      assignmentDate: formatDateToFineract(this.assignmentDate),
      dateFormat: FINERACT_DATE_FORMAT,
      locale: FINERACT_LOCALE,
    });

    this.bulkLoansService.postLoansLoanreassignment(body).subscribe({
      next: () => {
        this.snackBar.open('Loans reassigned successfully', 'Close', { duration: 3000 });
        this.router.navigate([this.LIST_PATH]);
      },
      error: () => (this.isSaving = false),
    });
  }

  onCancel(): void {
    this.router.navigate([this.LIST_PATH]);
  }
}
