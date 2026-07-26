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
import { HelpIconComponent } from '../../shared';
import { CreateOfficeDialogComponent } from '../../shared/components/create-office-dialog/create-office-dialog.component';
import { DialogService } from '../../core/services/dialog.service';
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonCheckbox,
  IonDatetime,
  IonDatetimeButton,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonModal,
  IonSelect,
  IonSelectOption,
  IonSpinner,
} from '@ionic/angular/standalone';
import {
  ClientService,
  PostClientsRequest,
  PutClientsClientIdRequest,
  OfficesService,
  GetOfficesResponse,
} from '../../api';
import {
  formatDateToFineract,
  FINERACT_DATE_FORMAT,
  FINERACT_LOCALE,
  toIsoDate,
} from '../../core/utils/date-formatter';

@Component({
  selector: 'app-client-form',
  standalone: true,
  imports: [
    FormsModule,
    TranslateModule,
    HelpIconComponent,
    IonIcon,
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
    IonCheckbox,
    IonDatetime,
    IonDatetimeButton,
    IonModal,
  ],
  template: `
    <div class="form-container">
      <ion-card>
        <ion-card-header>
          <ion-card-title>
            {{
              isEditMode
                ? ('CLIENTS.EDIT_CLIENT' | translate)
                : ('CLIENTS.CREATE_CLIENT' | translate)
            }}
            <app-help-icon helpTextKey="HELP.CLIENTS_CONTRACTS_DESC"></app-help-icon>
          </ion-card-title>
        </ion-card-header>

        <ion-card-content>
          <form #clientForm="ngForm" (ngSubmit)="onSubmit()" class="client-form">
            <div class="form-grid">
              <!-- Legal Form -->
              <ion-item fill="outline" [attr.title]="'HELP.LEGAL_FORM_DESC' | translate">
                <ion-label position="stacked">{{ 'CLIENTS.LEGAL_FORM' | translate }}</ion-label>
                <ion-select
                  interface="popover"
                  name="legalFormId"
                  [(ngModel)]="client.legalFormId"
                  required
                  [disabled]="isEditMode"
                >
                  <ion-select-option [value]="1">{{
                    'CLIENTS.PERSON' | translate
                  }}</ion-select-option>
                  <ion-select-option [value]="2">{{
                    'CLIENTS.ENTITY' | translate
                  }}</ion-select-option>
                </ion-select>
              </ion-item>

              <!-- Office -->
              <div class="office-field-container">
                <ion-item fill="outline" [attr.title]="'HELP.OFFICE_DESC' | translate">
                  <ion-label position="stacked">{{ 'COMMON.OFFICE' | translate }}</ion-label>
                  <ion-select
                    interface="popover"
                    name="officeId"
                    [(ngModel)]="client.officeId"
                    required
                    [disabled]="isEditMode"
                  >
                    @for (office of offices; track office.id) {
                      <ion-select-option [value]="office.id">{{ office.name }}</ion-select-option>
                    }
                  </ion-select>
                </ion-item>
                @if (!isEditMode) {
                  <ion-button
                    fill="clear"
                    type="button"
                    color="primary"
                    [attr.title]="'CLIENTS.ADD_NEW_OFFICE' | translate"
                    (click)="addOffice()"
                  >
                    <ion-icon name="add-circle-outline"></ion-icon>
                  </ion-button>
                }
              </div>

              <!-- Submitted On Date -->
              <ion-item fill="outline" [attr.title]="'HELP.SUBMITTED_ON_DESC' | translate">
                <ion-label position="stacked">{{ 'COMMON.SUBMITTED_ON' | translate }}</ion-label>
                <ion-datetime-button datetime="submittedOnDate-picker"></ion-datetime-button>
                <ion-modal [keepContentsMounted]="true">
                  <ng-template>
                    <ion-datetime
                      id="submittedOnDate-picker"
                      data-testid="submittedOnDate-picker"
                      presentation="date"
                      name="submittedOnDate"
                      [(ngModel)]="submittedOnDate"
                      required
                      [disabled]="isEditMode"
                    ></ion-datetime>
                  </ng-template>
                </ion-modal>
              </ion-item>

              <!-- Activation Date -->
              <ion-item fill="outline" [attr.title]="'HELP.ACTIVATION_DATE_DESC' | translate">
                <ion-label position="stacked">{{ 'COMMON.ACTIVATION_DATE' | translate }}</ion-label>
                <ion-datetime-button datetime="activationDate-picker"></ion-datetime-button>
                <ion-modal [keepContentsMounted]="true">
                  <ng-template>
                    <ion-datetime
                      id="activationDate-picker"
                      data-testid="activationDate-picker"
                      presentation="date"
                      name="activationDate"
                      [(ngModel)]="activationDate"
                      required
                      [disabled]="isEditMode"
                    ></ion-datetime>
                  </ng-template>
                </ion-modal>
              </ion-item>

              <!-- Active -->
              <div class="checkbox-container">
                <ion-checkbox name="active" [(ngModel)]="client.active" [disabled]="isEditMode">
                  {{ 'COMMON.ACTIVE' | translate }}
                </ion-checkbox>
                <ion-icon
                  [attr.title]="'HELP.ACTIVE_DESC' | translate"
                  class="help-icon"
                  name="help-circle-outline"
                ></ion-icon>
              </div>

              <!-- Entity fields -->
              @if (client.legalFormId === 2) {
                <ion-item
                  fill="outline"
                  [attr.title]="'HELP.FULL_NAME_DESC' | translate"
                  class="full-width"
                >
                  <ion-label position="stacked">{{ 'CLIENTS.COMPANY_NAME' | translate }}</ion-label>
                  <ion-input name="fullname" [(ngModel)]="client.fullname" required></ion-input>
                </ion-item>
              }

              <!-- Person fields -->
              @if (client.legalFormId === 1) {
                <ion-item fill="outline" [attr.title]="'HELP.FIRST_NAME_DESC' | translate">
                  <ion-label position="stacked">{{ 'CLIENTS.FIRST_NAME' | translate }}</ion-label>
                  <ion-input name="firstname" [(ngModel)]="client.firstname" required></ion-input>
                </ion-item>

                <ion-item fill="outline" [attr.title]="'HELP.MIDDLE_NAME_DESC' | translate">
                  <ion-label position="stacked">{{ 'CLIENTS.MIDDLE_NAME' | translate }}</ion-label>
                  <ion-input name="middlename" [(ngModel)]="client.middlename"></ion-input>
                </ion-item>

                <ion-item fill="outline" [attr.title]="'HELP.LAST_NAME_DESC' | translate">
                  <ion-label position="stacked">{{ 'CLIENTS.LAST_NAME' | translate }}</ion-label>
                  <ion-input name="lastname" [(ngModel)]="client.lastname" required></ion-input>
                </ion-item>

                <ion-item fill="outline" [attr.title]="'HELP.DATE_OF_BIRTH_DESC' | translate">
                  <ion-label position="stacked">{{
                    'CLIENTS.DATE_OF_BIRTH' | translate
                  }}</ion-label>
                  <ion-datetime-button datetime="dateOfBirth-picker"></ion-datetime-button>
                  <ion-modal [keepContentsMounted]="true">
                    <ng-template>
                      <ion-datetime
                        id="dateOfBirth-picker"
                        data-testid="dateOfBirth-picker"
                        presentation="date"
                        name="dateOfBirth"
                        [(ngModel)]="dateOfBirth"
                      ></ion-datetime>
                    </ng-template>
                  </ion-modal>
                </ion-item>
              }

              <!-- Common fields -->
              <ion-item fill="outline" [attr.title]="'HELP.EXTERNAL_ID_DESC' | translate">
                <ion-label position="stacked">{{ 'COMMON.EXTERNAL_ID' | translate }}</ion-label>
                <ion-input name="externalId" [(ngModel)]="client.externalId"></ion-input>
              </ion-item>

              <ion-item fill="outline" [attr.title]="'HELP.MOBILE_NO_DESC' | translate">
                <ion-label position="stacked">{{ 'COMMON.MOBILE_NO' | translate }}</ion-label>
                <ion-input name="mobileNo" [(ngModel)]="client.mobileNo"></ion-input>
              </ion-item>

              <ion-item fill="outline" [attr.title]="'HELP.EMAIL_DESC' | translate">
                <ion-label position="stacked">{{ 'COMMON.EMAIL' | translate }}</ion-label>
                <ion-input name="emailAddress" [(ngModel)]="client.emailAddress"></ion-input>
              </ion-item>
            </div>

            <div class="form-actions">
              <ion-button fill="clear" type="button" (click)="onCancel()" [disabled]="isSaving">
                {{ 'COMMON.CANCEL' | translate }}
              </ion-button>
              @if (isEditMode && !originalActive) {
                <ion-button
                  color="secondary"
                  type="button"
                  (click)="onActivate()"
                  [disabled]="isSaving || !activationDate"
                >
                  @if (isSaving) {
                    <ion-spinner name="crescent"></ion-spinner>
                    {{ 'COMMON.SAVING' | translate }}
                  } @else {
                    {{ 'CLIENTS.ACTIVATE_CLIENT' | translate }}
                  }
                </ion-button>
              }
              <ion-button color="primary" type="submit" [disabled]="clientForm.invalid || isSaving">
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
      .checkbox-container {
        display: flex;
        align-items: center;
        gap: 8px;
        height: 60px;
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
  private readonly dialogService = inject(DialogService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  private readonly LIST_PATH = '/clients';
  private readonly DATE_FORMAT = 'yyyy-MM-dd';
  private readonly LOCALE_EN = 'en';

  clientId: number | null = null;
  isEditMode = false;
  isSaving = false;
  originalActive = false;

  // Use strictly typed OpenAPI models
  client: PostClientsRequest = {
    legalFormId: 1,
    active: true,
  };

  submittedOnDate = toIsoDate(new Date());
  activationDate = toIsoDate(new Date());
  dateOfBirth: string | null = null;
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
    this.officesService.getOffices(true).subscribe((offices) => {
      this.offices = offices;
    });
  }

  addOffice(): Promise<void> {
    return this.dialogService.open<number>(CreateOfficeDialogComponent).then((newOfficeId) => {
      if (!newOfficeId) return;
      // Reload offices and select the new one
      this.officesService.getOffices(true).subscribe((offices) => {
        this.offices = offices;
        this.client.officeId = newOfficeId;
      });
    });
  }

  loadClientData() {
    if (!this.clientId) return;
    this.clientService.getClientsClientId(this.clientId).subscribe((data) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const clientData = data as any;
      const actDateArray = clientData.activationDate as unknown as number[];
      if (actDateArray) {
        this.activationDate = toIsoDate(
          new Date(actDateArray[0], actDateArray[1] - 1, actDateArray[2]),
        );
      }

      const subDateArray = clientData.submittedOnDate as unknown as number[];
      if (subDateArray) {
        this.submittedOnDate = toIsoDate(
          new Date(subDateArray[0], subDateArray[1] - 1, subDateArray[2]),
        );
      } else if (actDateArray) {
        this.submittedOnDate = toIsoDate(
          new Date(actDateArray[0], actDateArray[1] - 1, actDateArray[2]),
        );
      }

      const dobArray = clientData.dateOfBirth as unknown as number[];
      if (dobArray) {
        this.dateOfBirth = toIsoDate(new Date(dobArray[0], dobArray[1] - 1, dobArray[2]));
      }

      this.originalActive = !!clientData.active;

      const legalFormId = clientData.legalForm?.id || 1;

      this.client = {
        firstname: clientData.firstname,
        lastname: clientData.lastname,
        middlename: clientData.middlename,
        fullname: clientData.fullname,
        externalId: clientData.externalId,
        mobileNo: clientData.mobileNo,
        emailAddress: clientData.emailAddress,
        officeId: clientData.officeId,
        active: clientData.active,
        legalFormId: legalFormId,
      };
    });
  }

  onActivate() {
    if (!this.clientId || !this.activationDate) return;
    this.isSaving = true;

    const activationPayload = {
      activationDate: formatDateToFineract(this.activationDate),
      dateFormat: FINERACT_DATE_FORMAT,
      locale: FINERACT_LOCALE,
    };

    this.clientService.postClientsClientId(this.clientId, activationPayload, 'activate').subscribe({
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

    if (this.isEditMode && this.clientId) {
      // Use Record<string, unknown> to bypass OpenAPI schema restrictions on update
      const payload: Record<string, unknown> = {
        externalId: this.client.externalId,
        mobileNo: this.client.mobileNo,
        emailAddress: this.client.emailAddress,
      };

      if (this.client.legalFormId === 2) {
        payload['fullname'] = this.client.fullname;
      } else {
        payload['firstname'] = this.client.firstname;
        payload['lastname'] = this.client.lastname;
        payload['middlename'] = this.client.middlename;
        if (this.dateOfBirth) {
          payload['dateOfBirth'] = formatDateToFineract(this.dateOfBirth);
          payload['locale'] = FINERACT_LOCALE;
          payload['dateFormat'] = FINERACT_DATE_FORMAT;
        }
      }

      this.clientService
        .putClientsClientId(this.clientId, payload as PutClientsClientIdRequest)
        .subscribe({
          next: () => this.router.navigate([this.LIST_PATH]),
          error: () => (this.isSaving = false),
        });
    } else {
      // Post mode
      this.client.activationDate = formatDateToFineract(this.activationDate);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (this.client as any).submittedOnDate = formatDateToFineract(this.submittedOnDate);
      this.client.dateFormat = FINERACT_DATE_FORMAT;
      this.client.locale = FINERACT_LOCALE;

      if (this.dateOfBirth) {
        this.client.dateOfBirth = formatDateToFineract(this.dateOfBirth);
      }

      if (this.client.legalFormId === 2) {
        // Entity: omit person name fields
        delete this.client.firstname;
        delete this.client.lastname;
        delete this.client.middlename;
        delete this.client.dateOfBirth;
      } else {
        // Person: omit entity name field
        delete this.client.fullname;
      }

      this.clientService.postClients(this.client).subscribe({
        next: () => this.router.navigate([this.LIST_PATH]),
        error: () => (this.isSaving = false),
      });
    }
  }

  onCancel() {
    this.router.navigate([this.LIST_PATH]);
  }
}
