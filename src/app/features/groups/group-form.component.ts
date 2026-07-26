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
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
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
  IonSpinner,
} from '@ionic/angular/standalone';
import {
  GroupsService,
  OfficesService,
  PostGroupsRequest,
  PostGroupsGroupIdRequest,
  PutGroupsGroupIdRequest,
  GetOfficesResponse,
} from '../../api';

/**
 * Component for creating and editing self-help groups.
 *
 * This component manages group lifecycle operations, including mandatory
 * activation date handling for new active groups.
 */
@Component({
  selector: 'app-group-form',
  standalone: true,
  imports: [
    FormsModule,
    TranslateModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
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
    IonCheckbox,
  ],
  template: `
    <div class="form-container">
      <ion-card>
        <ion-card-header>
          <ion-card-title>
            {{
              isEditMode ? ('GROUPS.EDIT_GROUP' | translate) : ('GROUPS.CREATE_GROUP' | translate)
            }}
          </ion-card-title>
        </ion-card-header>

        <ion-card-content>
          <form #groupForm="ngForm" (ngSubmit)="onSubmit()" class="group-form">
            <div class="form-grid">
              <!-- Name -->
              <ion-item fill="outline" [attr.title]="'HELP.GROUP_NAME_DESC' | translate">
                <ion-label position="stacked">{{ 'GROUPS.NAME' | translate }}</ion-label>
                <ion-input name="name" [(ngModel)]="group.name" required></ion-input>
              </ion-item>

              <!-- Office -->
              <ion-item fill="outline" [attr.title]="'HELP.OFFICE_DESC' | translate">
                <ion-label position="stacked">{{ 'COMMON.OFFICE' | translate }}</ion-label>
                <ion-select
                  name="officeId"
                  [(ngModel)]="group.officeId"
                  required
                  [disabled]="isEditMode"
                >
                  @for (office of offices; track office.id) {
                    <ion-select-option [value]="office.id">{{ office.name }}</ion-select-option>
                  }
                </ion-select>
              </ion-item>

              <!-- Activation Date -->
              @if (!isEditMode) {
                <mat-form-field
                  appearance="outline"
                  [attr.title]="'HELP.ACTIVATION_DATE_DESC' | translate"
                >
                  <mat-label>{{ 'COMMON.ACTIVATION_DATE' | translate }}</mat-label>
                  <input
                    matInput
                    [matDatepicker]="picker"
                    name="activationDate"
                    [(ngModel)]="activationDate"
                    [required]="!!group.active"
                  />
                  <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
                  <mat-datepicker #picker></mat-datepicker>
                </mat-form-field>
              }

              <!-- Active -->
              <div class="checkbox-container">
                <ion-checkbox name="active" [(ngModel)]="group.active" [disabled]="isEditMode">
                  {{ 'COMMON.ACTIVE' | translate }}
                </ion-checkbox>
                <mat-icon [attr.title]="'HELP.ACTIVE_DESC' | translate" class="help-icon"
                  >help_outline</mat-icon
                >
              </div>
            </div>

            <div class="form-actions">
              <ion-button fill="clear" type="button" (click)="onCancel()" [disabled]="isSaving">
                {{ 'COMMON.CANCEL' | translate }}
              </ion-button>
              @if (isEditMode && !originalActive) {
                <ion-button
                  color="accent"
                  type="button"
                  (click)="onActivate()"
                  [disabled]="isSaving || !activationDate"
                >
                  @if (isSaving) {
                    <ion-spinner name="crescent"></ion-spinner>
                    {{ 'COMMON.SAVING' | translate }}
                  } @else {
                    Activate Group
                  }
                </ion-button>
              }
              <ion-button color="primary" type="submit" [disabled]="groupForm.invalid || isSaving">
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
      .group-form {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }
      .form-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 16px;
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
export class GroupFormComponent implements OnInit {
  private readonly groupsService = inject(GroupsService);
  private readonly officesService = inject(OfficesService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  private readonly DATE_FORMAT = 'yyyy-MM-dd';
  private readonly LIST_PATH = '/groups';

  groupId: number | null = null;
  isEditMode = false;
  isSaving = false;
  originalActive = false;

  group: PostGroupsRequest = {
    active: true,
  };

  activationDate: Date = new Date();
  offices: GetOfficesResponse[] = [];

  ngOnInit(): void {
    this.loadOffices();
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.groupId = +id;
        this.isEditMode = true;
        this.loadGroupData();
      }
    });
  }

  private loadOffices(): void {
    this.officesService.getOffices(true).subscribe((offices) => {
      this.offices = offices;
    });
  }

  private loadGroupData(): void {
    if (!this.groupId) return;
    this.groupsService.getGroupsGroupId(this.groupId).subscribe((data) => {
      this.originalActive = !!(data as Record<string, unknown>)['active'];
      this.group = {
        name: data.name,
        officeId: data.officeId,
        active: this.originalActive,
      };
    });
  }

  onActivate(): void {
    if (!this.groupId || !this.activationDate) return;
    this.isSaving = true;

    const formattedDate = `${this.activationDate.getFullYear()}-${String(
      this.activationDate.getMonth() + 1,
    ).padStart(2, '0')}-${String(this.activationDate.getDate()).padStart(2, '0')}`;

    const payload = {
      activationDate: formattedDate,
      dateFormat: this.DATE_FORMAT,
      locale: 'en',
    };

    this.groupsService
      .postGroupsGroupId(this.groupId, payload as PostGroupsGroupIdRequest, 'activate')
      .subscribe({
        next: () => {
          this.isSaving = false;
          this.originalActive = true;
          this.group.active = true;
        },
        error: () => (this.isSaving = false),
      });
  }

  /**
   * Submits the form, ensuring mandatory activationDate is formatted correctly.
   */
  onSubmit(): void {
    this.isSaving = true;

    if (this.isEditMode && this.groupId) {
      const payload: PutGroupsGroupIdRequest = {
        name: this.group.name,
      };
      this.groupsService.putGroupsGroupId(this.groupId, payload).subscribe({
        next: () => this.router.navigate([this.LIST_PATH]),
        error: () => (this.isSaving = false),
      });
    } else {
      const formattedDate = `${this.activationDate.getFullYear()}-${String(
        this.activationDate.getMonth() + 1,
      ).padStart(2, '0')}-${String(this.activationDate.getDate()).padStart(2, '0')}`;

      // Assert as Record to include mandatory undocumented fields for activation
      const payload: Record<string, unknown> = {
        ...this.group,
        activationDate: formattedDate,
        dateFormat: this.DATE_FORMAT,
        locale: 'en',
      };

      this.groupsService.postGroups(payload as PostGroupsRequest).subscribe({
        next: () => this.router.navigate([this.LIST_PATH]),
        error: () => (this.isSaving = false),
      });
    }
  }

  onCancel(): void {
    this.router.navigate([this.LIST_PATH]);
  }
}
