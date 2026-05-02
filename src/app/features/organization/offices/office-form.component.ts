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
import { CommonModule } from '@angular/common';
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
import {
  OfficesService,
  PostOfficesRequest,
  PutOfficesOfficeIdRequest,
  GetOfficesResponse,
} from '../../../api';

@Component({
  selector: 'app-office-form',
  standalone: true,
  imports: [
    CommonModule,
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
  ],
  template: `
    <div class="form-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>
            {{
              isEditMode
                ? ('OFFICES.EDIT_OFFICE' | translate)
                : ('OFFICES.CREATE_OFFICE' | translate)
            }}
          </mat-card-title>
        </mat-card-header>

        <mat-card-content>
          <form #officeForm="ngForm" (ngSubmit)="onSubmit()" class="office-form">
            <div class="form-grid">
              <mat-form-field
                appearance="outline"
                [matTooltip]="'HELP.OFFICE_NAME_DESC' | translate"
              >
                <mat-label>{{ 'OFFICES.NAME' | translate }}</mat-label>
                <input matInput name="name" [(ngModel)]="office.name" required />
              </mat-form-field>

              <mat-form-field
                appearance="outline"
                [matTooltip]="'HELP.PARENT_OFFICE_DESC' | translate"
              >
                <mat-label>{{ 'OFFICES.PARENT' | translate }}</mat-label>
                <mat-select
                  name="parentId"
                  [(ngModel)]="office.parentId"
                  required
                  [disabled]="isEditMode"
                >
                  @for (o of offices; track o.id) {
                    <mat-option [value]="o.id">{{ o.name }}</mat-option>
                  }
                </mat-select>
              </mat-form-field>

              <mat-form-field
                appearance="outline"
                [matTooltip]="'HELP.EXTERNAL_ID_DESC' | translate"
              >
                <mat-label>{{ 'OFFICES.EXTERNAL_ID' | translate }}</mat-label>
                <input matInput name="externalId" [(ngModel)]="office.externalId" />
              </mat-form-field>

              <mat-form-field
                appearance="outline"
                [matTooltip]="'HELP.OPENING_DATE_DESC' | translate"
              >
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
            </div>

            <div class="form-actions">
              <button mat-button type="button" (click)="onCancel()">
                {{ 'COMMON.CANCEL' | translate }}
              </button>
              <button
                mat-raised-button
                color="primary"
                type="submit"
                [disabled]="officeForm.invalid || isSaving"
              >
                {{ isSaving ? ('COMMON.SAVING' | translate) : ('COMMON.SAVE' | translate) }}
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
      .office-form {
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
      .form-actions {
        display: flex;
        justify-content: flex-end;
        gap: 12px;
        margin-top: 16px;
      }
    `,
  ],
})
export class OfficeFormComponent implements OnInit {
  private readonly officesService = inject(OfficesService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  private readonly LIST_PATH = '/organization/offices';

  officeId: number | null = null;
  isEditMode = false;
  isSaving = false;

  office: PostOfficesRequest = {};
  openingDate: Date = new Date();
  offices: GetOfficesResponse[] = [];

  ngOnInit() {
    this.loadOffices();
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.officeId = +id;
        this.isEditMode = true;
        this.loadOfficeData();
      }
    });
  }

  loadOffices() {
    this.officesService.retrieveOffices(true).subscribe((offices) => {
      this.offices = offices;
    });
  }

  loadOfficeData() {
    if (!this.officeId) return;
    this.officesService.retrieveOffice(this.officeId).subscribe((data) => {
      const dateArray = data.openingDate as unknown as number[];
      if (dateArray) {
        this.openingDate = new Date(dateArray[0], dateArray[1] - 1, dateArray[2]);
      }
      this.office = {
        name: data.name,
        externalId: data.externalId,
        parentId: (data as Record<string, unknown>)['parentId'] as number,
      };
    });
  }

  onSubmit() {
    this.isSaving = true;
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    const formattedDate = `${this.openingDate.getDate()} ${months[this.openingDate.getMonth()]} ${this.openingDate.getFullYear()}`;

    if (this.isEditMode && this.officeId) {
      const payload: PutOfficesOfficeIdRequest = {
        name: this.office.name,
        externalId: this.office.externalId,
        openingDate: formattedDate,
        dateFormat: 'dd MMMM yyyy',
        locale: 'en',
      };
      this.officesService.updateOffice(this.officeId, payload).subscribe({
        next: () => this.router.navigate([this.LIST_PATH]),
        error: () => (this.isSaving = false),
      });
    } else {
      this.office.openingDate = formattedDate;
      this.office.dateFormat = 'dd MMMM yyyy';
      this.office.locale = 'en';
      this.officesService.createOffice(this.office).subscribe({
        next: () => this.router.navigate([this.LIST_PATH]),
        error: () => (this.isSaving = false),
      });
    }
  }

  onCancel() {
    this.router.navigate([this.LIST_PATH]);
  }
}
