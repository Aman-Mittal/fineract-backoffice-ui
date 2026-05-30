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
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { HelpIconComponent } from '../../shared';
import { CreateOfficeDialogComponent } from '../../shared/components/create-office-dialog/create-office-dialog.component';
import {
  ClientService,
  PostClientsRequest,
  PutClientsClientIdRequest,
  OfficesService,
  GetOfficesResponse,
} from '../../api';

@Component({
  selector: 'app-client-form',
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
    MatProgressSpinnerModule,
    HelpIconComponent,
    MatDialogModule,
  ],
  template: `
    <div class="form-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>
            {{
              isEditMode
                ? ('CLIENTS.EDIT_CLIENT' | translate)
                : ('CLIENTS.CREATE_CLIENT' | translate)
            }}
            <app-help-icon helpTextKey="HELP.CLIENTS_CONTRACTS_DESC"></app-help-icon>
          </mat-card-title>
        </mat-card-header>

        <mat-card-content>
          <form #clientForm="ngForm" (ngSubmit)="onSubmit()" class="client-form">
            <div class="form-grid">
              <!-- Legal Form -->
              <mat-form-field
                appearance="outline"
                [matTooltip]="'HELP.LEGAL_FORM_DESC' | translate"
              >
                <mat-label>{{ 'CLIENTS.LEGAL_FORM' | translate }}</mat-label>
                <mat-select
                  name="legalFormId"
                  [(ngModel)]="client.legalFormId"
                  required
                  [disabled]="isEditMode"
                >
                  <mat-option [value]="1">{{ 'CLIENTS.PERSON' | translate }}</mat-option>
                  <mat-option [value]="2">{{ 'CLIENTS.ENTITY' | translate }}</mat-option>
                </mat-select>
              </mat-form-field>

              <!-- First Name -->
              <mat-form-field
                appearance="outline"
                [matTooltip]="'HELP.FIRST_NAME_DESC' | translate"
              >
                <mat-label>{{ 'CLIENTS.FIRST_NAME' | translate }}</mat-label>
                <input matInput name="firstname" [(ngModel)]="client.firstname" required />
              </mat-form-field>

              <!-- Last Name -->
              <mat-form-field appearance="outline" [matTooltip]="'HELP.LAST_NAME_DESC' | translate">
                <mat-label>{{ 'CLIENTS.LAST_NAME' | translate }}</mat-label>
                <input matInput name="lastname" [(ngModel)]="client.lastname" required />
              </mat-form-field>

              <!-- External ID -->
              <mat-form-field
                appearance="outline"
                [matTooltip]="'HELP.EXTERNAL_ID_DESC' | translate"
              >
                <mat-label>{{ 'COMMON.EXTERNAL_ID' | translate }}</mat-label>
                <input matInput name="externalId" [(ngModel)]="client.externalId" />
              </mat-form-field>

              <!-- Mobile No -->
              <mat-form-field appearance="outline" [matTooltip]="'HELP.MOBILE_NO_DESC' | translate">
                <mat-label>{{ 'COMMON.MOBILE_NO' | translate }}</mat-label>
                <input matInput name="mobileNo" [(ngModel)]="client.mobileNo" />
              </mat-form-field>

              <!-- Email -->
              <mat-form-field appearance="outline" [matTooltip]="'HELP.EMAIL_DESC' | translate">
                <mat-label>{{ 'COMMON.EMAIL' | translate }}</mat-label>
                <input matInput name="emailAddress" [(ngModel)]="client.emailAddress" />
              </mat-form-field>

              <!-- Office -->
              <div class="office-field-container">
                <mat-form-field appearance="outline" [matTooltip]="'HELP.OFFICE_DESC' | translate">
                  <mat-label>{{ 'COMMON.OFFICE' | translate }}</mat-label>
                  <mat-select
                    name="officeId"
                    [(ngModel)]="client.officeId"
                    required
                    [disabled]="isEditMode"
                  >
                    @for (office of offices; track office.id) {
                      <mat-option [value]="office.id">{{ office.name }}</mat-option>
                    }
                  </mat-select>
                </mat-form-field>
                @if (!isEditMode) {
                  <button
                    mat-icon-button
                    type="button"
                    color="primary"
                    matTooltip="Add New Office"
                    (click)="addOffice()"
                  >
                    <mat-icon>add_circle</mat-icon>
                  </button>
                }
              </div>

              <!-- Activation Date -->
              <mat-form-field
                appearance="outline"
                [matTooltip]="'HELP.ACTIVATION_DATE_DESC' | translate"
              >
                <mat-label>{{ 'COMMON.ACTIVATION_DATE' | translate }}</mat-label>
                <input
                  matInput
                  [matDatepicker]="picker"
                  name="activationDate"
                  [(ngModel)]="activationDate"
                  required
                  [disabled]="isEditMode"
                />
                <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
                <mat-datepicker #picker></mat-datepicker>
              </mat-form-field>

              <!-- Active -->
              <div class="checkbox-container">
                <mat-checkbox name="active" [(ngModel)]="client.active" [disabled]="isEditMode">
                  {{ 'COMMON.ACTIVE' | translate }}
                </mat-checkbox>
                <mat-icon [matTooltip]="'HELP.ACTIVE_DESC' | translate" class="help-icon"
                  >help_outline</mat-icon
                >
              </div>
            </div>

            <div class="form-actions">
              <button mat-button type="button" (click)="onCancel()" [disabled]="isSaving">
                {{ 'COMMON.CANCEL' | translate }}
              </button>
              @if (isEditMode && !originalActive) {
                <button
                  mat-raised-button
                  color="accent"
                  type="button"
                  (click)="onActivate()"
                  [disabled]="isSaving || !activationDate"
                >
                  @if (isSaving) {
                    <mat-spinner diameter="20" style="margin-right: 8px; display: inline-block; vertical-align: middle;"></mat-spinner>
                    {{ 'COMMON.SAVING' | translate }}
                  } @else {
                    Activate Client
                  }
                </button>
              }
              <button
                mat-raised-button
                color="primary"
                type="submit"
                [disabled]="clientForm.invalid || isSaving"
              >
                @if (isSaving) {
                  <mat-spinner diameter="20" style="margin-right: 8px; display: inline-block; vertical-align: middle;"></mat-spinner>
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
      .client-form {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }
      .form-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 16px;
      }
      .office-field-container {
        display: flex;
        align-items: center;
        gap: 4px;
      }
      mat-form-field {
        width: 100%;
      }
      .checkbox-container {
        display: flex;
        align-items: center;
        gap: 8px;
        height: 60px;
      }
      .form-actions {
        display: flex;
        justify-content: flex-end;
        gap: 12px;
        margin-top: 16px;
      }
      .help-icon {
        font-size: 18px;
        width: 18px;
        height: 18px;
        color: #7f8c8d;
        cursor: help;
      }
    `,
  ],
})
export class ClientFormComponent implements OnInit {
  private readonly clientService = inject(ClientService);
  private readonly officesService = inject(OfficesService);
  private readonly dialog = inject(MatDialog);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  private readonly LIST_PATH = '/clients';

  clientId: number | null = null;
  isEditMode = false;
  isSaving = false;
  originalActive = false;

  // Use strictly typed OpenAPI models
  client: PostClientsRequest = {
    legalFormId: 1,
    active: true,
  };

  activationDate: Date = new Date();
  offices: GetOfficesResponse[] = [];

  ngOnInit() {
    this.loadOffices();
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.clientId = +id;
        this.isEditMode = true;
        this.loadClientData();
      }
    });
  }

  loadOffices() {
    this.officesService.retrieveOffices(true).subscribe((offices) => {
      this.offices = offices;
    });
  }

  addOffice() {
    const dialogRef = this.dialog.open(CreateOfficeDialogComponent, {
      width: '500px',
    });

    dialogRef.afterClosed().subscribe((newOfficeId) => {
      if (newOfficeId) {
        // Reload offices and select the new one
        this.officesService.retrieveOffices(true).subscribe((offices) => {
          this.offices = offices;
          this.client.officeId = newOfficeId;
        });
      }
    });
  }

  loadClientData() {
    if (!this.clientId) return;
    this.clientService.retrieveOne11(this.clientId).subscribe((clientData) => {
      const actDateArray = clientData.activationDate as unknown as number[];
      if (actDateArray) {
        this.activationDate = new Date(actDateArray[0], actDateArray[1] - 1, actDateArray[2]);
      }

      this.originalActive = !!clientData.active;

      this.client = {
        firstname: clientData.firstname,
        lastname: clientData.lastname,
        externalId: clientData.externalId,
        mobileNo: (clientData as Record<string, unknown>)['mobileNo'] as string,
        emailAddress: clientData.emailAddress,
        officeId: clientData.officeId,
        active: clientData.active,
        legalFormId: 1, // Default to person
      };
    });
  }

  onActivate() {
    if (!this.clientId || !this.activationDate) return;
    this.isSaving = true;

    const formattedDate = `${this.activationDate.getFullYear()}-${String(
      this.activationDate.getMonth() + 1,
    ).padStart(2, '0')}-${String(this.activationDate.getDate()).padStart(2, '0')}`;

    const activationPayload = {
      activationDate: formattedDate,
      dateFormat: 'yyyy-MM-dd',
      locale: 'en',
    };

    this.clientService.activate1(this.clientId, activationPayload, 'activate').subscribe({
      next: () => {
        this.isSaving = false;
        this.originalActive = true;
        this.client.active = true;
      },
      error: () => (this.isSaving = false),
    });
  }

  onSubmit() {
    this.isSaving = true;
    const formattedDate = `${this.activationDate.getFullYear()}-${String(
      this.activationDate.getMonth() + 1,
    ).padStart(2, '0')}-${String(this.activationDate.getDate()).padStart(2, '0')}`;

    if (this.isEditMode && this.clientId) {
      // Use PutClientsClientIdRequest strictly
      const payload: PutClientsClientIdRequest = {
        externalId: this.client.externalId,
      };

      this.clientService.update10(this.clientId, payload).subscribe({
        next: () => this.router.navigate([this.LIST_PATH]),
        error: () => (this.isSaving = false),
      });
    } else {
      // Post mode
      this.client.activationDate = formattedDate;
      this.client.dateFormat = 'yyyy-MM-dd';
      this.client.locale = 'en';

      this.clientService.create6(this.client).subscribe({
        next: () => this.router.navigate([this.LIST_PATH]),
        error: () => (this.isSaving = false),
      });
    }
  }

  onCancel() {
    this.router.navigate([this.LIST_PATH]);
  }
}
