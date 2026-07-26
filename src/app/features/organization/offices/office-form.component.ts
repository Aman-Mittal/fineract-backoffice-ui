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
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonInput,
  IonItem,
  IonLabel,
  IonSelect,
  IonSelectOption,
  IonSpinner,
} from '@ionic/angular/standalone';
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
    FormsModule,
    TranslateModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    IonButton,
    IonSpinner,
    IonInput,
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
    <div class="form-container">
      <ion-card>
        <ion-card-header>
          <ion-card-title>
            {{
              isEditMode
                ? ('OFFICES.EDIT_OFFICE' | translate)
                : ('OFFICES.CREATE_OFFICE' | translate)
            }}
          </ion-card-title>
        </ion-card-header>

        <ion-card-content>
          <form #officeForm="ngForm" (ngSubmit)="onSubmit()" class="office-form">
            <div class="form-grid">
              <ion-item fill="outline" [attr.title]="'HELP.OFFICE_NAME_DESC' | translate">
                <ion-label position="stacked">{{ 'OFFICES.NAME' | translate }}</ion-label>
                <ion-input name="name" [(ngModel)]="office.name" required></ion-input>
              </ion-item>

              <ion-item fill="outline" [attr.title]="'HELP.PARENT_OFFICE_DESC' | translate">
                <ion-label position="stacked">{{ 'OFFICES.PARENT' | translate }}</ion-label>
                <ion-select
                  name="parentId"
                  [(ngModel)]="office.parentId"
                  required
                  [disabled]="isEditMode"
                >
                  @for (o of offices; track o.id) {
                    <ion-select-option [value]="o.id">{{ o.name }}</ion-select-option>
                  }
                </ion-select>
              </ion-item>

              <ion-item fill="outline" [attr.title]="'HELP.EXTERNAL_ID_DESC' | translate">
                <ion-label position="stacked">{{ 'OFFICES.EXTERNAL_ID' | translate }}</ion-label>
                <ion-input name="externalId" [(ngModel)]="office.externalId"></ion-input>
              </ion-item>

              <mat-form-field
                appearance="outline"
                [attr.title]="'HELP.OPENING_DATE_DESC' | translate"
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
              <ion-button fill="clear" type="button" (click)="onCancel()" [disabled]="isSaving">
                {{ 'COMMON.CANCEL' | translate }}
              </ion-button>
              <ion-button color="primary" type="submit" [disabled]="officeForm.invalid || isSaving">
                @if (isSaving) {
                  <ion-spinner name="crescent"></ion-spinner>
                  {{ 'COMMON.SAVING' | translate }}
                } @else {
                  {{ 'COMMON.SAVE' | translate }}
                }
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
    this.officesService.getOffices(true).subscribe((offices) => {
      this.offices = offices;
    });
  }

  loadOfficeData() {
    if (!this.officeId) return;
    this.officesService.getOfficesOfficeId(this.officeId).subscribe((data) => {
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
    const formattedDate = `${this.openingDate.getFullYear()}-${String(
      this.openingDate.getMonth() + 1,
    ).padStart(2, '0')}-${String(this.openingDate.getDate()).padStart(2, '0')}`;

    if (this.isEditMode && this.officeId) {
      const payload: PutOfficesOfficeIdRequest = {
        name: this.office.name,
        externalId: this.office.externalId,
        openingDate: formattedDate,
        dateFormat: 'yyyy-MM-dd',
        locale: 'en',
      };
      this.officesService.putOfficesOfficeId(this.officeId, payload).subscribe({
        next: () => this.router.navigate([this.LIST_PATH]),
        error: () => (this.isSaving = false),
      });
    } else {
      this.office.openingDate = formattedDate;
      this.office.dateFormat = 'yyyy-MM-dd';
      this.office.locale = 'en';
      this.officesService.postOffices(this.office).subscribe({
        next: () => this.router.navigate([this.LIST_PATH]),
        error: () => (this.isSaving = false),
      });
    }
  }

  onCancel() {
    this.router.navigate([this.LIST_PATH]);
  }
}
