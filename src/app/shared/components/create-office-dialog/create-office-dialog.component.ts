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
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { OfficesService, PostOfficesRequest, GetOfficesResponse } from '../../../api';

/**
 * Dialog for inline creation of a branch office.
 */
@Component({
  selector: 'app-create-office-dialog',
  standalone: true,
  imports: [
    FormsModule,
    TranslateModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTooltipModule,
  ],
  template: `
    <h2 mat-dialog-title>{{ 'OFFICES.CREATE_OFFICE' | translate }}</h2>
    <mat-dialog-content>
      <form #officeForm="ngForm" class="office-form">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>{{ 'OFFICES.NAME' | translate }}</mat-label>
          <input matInput name="name" [(ngModel)]="office.name" required />
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>{{ 'OFFICES.PARENT' | translate }}</mat-label>
          <mat-select name="parentId" [(ngModel)]="office.parentId" required>
            @for (o of offices; track o.id) {
              <mat-option [value]="o.id">{{ o.name }}</mat-option>
            }
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>{{ 'OFFICES.OPENING_DATE' | translate }}</mat-label>
          <input
            matInput
            [matDatepicker]="picker"
            name="openingDate"
            [(ngModel)]="openingDate"
            required
          />
          <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
          <mat-datepicker #picker></mat-datepicker>
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">{{ 'COMMON.CANCEL' | translate }}</button>
      <button
        mat-raised-button
        color="primary"
        [disabled]="officeForm.invalid || isSaving"
        (click)="onSubmit()"
      >
        {{ isSaving ? ('COMMON.SAVING' | translate) : ('COMMON.SAVE' | translate) }}
      </button>
    </mat-dialog-actions>
  `,
  styles: [
    `
      .office-form {
        display: flex;
        flex-direction: column;
        gap: 12px;
        padding-top: 8px;
        min-width: 400px;
      }
      .full-width {
        width: 100%;
      }
    `,
  ],
})
export class CreateOfficeDialogComponent implements OnInit {
  private readonly officesService = inject(OfficesService);
  private readonly dialogRef = inject(MatDialogRef<CreateOfficeDialogComponent>);

  office: PostOfficesRequest = {
    parentId: 1, // Default to head office
  };
  openingDate = new Date();
  offices: GetOfficesResponse[] = [];
  isSaving = false;

  ngOnInit() {
    this.officesService.getOffices(true).subscribe((offices) => {
      this.offices = offices;
    });
  }

  onSubmit() {
    this.isSaving = true;
    this.office.openingDate = `${this.openingDate.getFullYear()}-${String(this.openingDate.getMonth() + 1).padStart(2, '0')}-${String(this.openingDate.getDate()).padStart(2, '0')}`;
    this.office.dateFormat = 'yyyy-MM-dd';
    this.office.locale = 'en';

    this.officesService.postOffices(this.office).subscribe({
      next: (response) => this.dialogRef.close(response.resourceId),
      error: () => (this.isSaving = false),
    });
  }

  onCancel() {
    this.dialogRef.close();
  }
}
