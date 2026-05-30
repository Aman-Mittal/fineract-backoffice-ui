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
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {
  UsersService,
  PostUsersRequest,
  PutUsersUserIdRequest,
  GetUsersTemplateResponse,
  RoleData,
} from '../../../api';

/**
 * Component for creating and editing system users.
 */
@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [
    FormsModule,
    TranslateModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCheckboxModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
  ],
  template: `
    <div class="form-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>
            {{ isEditMode ? ('USERS.EDIT_USER' | translate) : ('USERS.CREATE_USER' | translate) }}
          </mat-card-title>
        </mat-card-header>

        <mat-card-content>
          <form #userForm="ngForm" (ngSubmit)="onSubmit()" class="user-form">
            <div class="form-grid">
              <mat-form-field appearance="outline">
                <mat-label>{{ 'USERS.USERNAME' | translate }}</mat-label>
                <input
                  matInput
                  name="username"
                  [(ngModel)]="user.username"
                  required
                  [disabled]="isEditMode"
                />
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>{{ 'CLIENTS.FIRST_NAME' | translate }}</mat-label>
                <input matInput name="firstname" [(ngModel)]="user.firstname" required />
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>{{ 'CLIENTS.LAST_NAME' | translate }}</mat-label>
                <input matInput name="lastname" [(ngModel)]="user.lastname" required />
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>{{ 'COMMON.EMAIL' | translate }}</mat-label>
                <input matInput type="email" name="email" [(ngModel)]="user.email" required />
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>{{ 'COMMON.OFFICE' | translate }}</mat-label>
                <mat-select name="officeId" [(ngModel)]="user.officeId" required>
                  @for (office of offices; track office['id']) {
                    <mat-option [value]="office['id']">{{ office['name'] }}</mat-option>
                  }
                </mat-select>
              </mat-form-field>

              @if (!isEditMode) {
                <mat-form-field appearance="outline">
                  <mat-label>{{ 'USERS.PASSWORD' | translate }}</mat-label>
                  <input
                    matInput
                    type="password"
                    name="password"
                    [(ngModel)]="user.password"
                    required
                  />
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>{{ 'USERS.REPEAT_PASSWORD' | translate }}</mat-label>
                  <input
                    matInput
                    type="password"
                    name="repeatPassword"
                    [(ngModel)]="user.repeatPassword"
                    required
                  />
                </mat-form-field>
              }

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>{{ 'USERS.ROLES' | translate }}</mat-label>
                <mat-select name="roles" [(ngModel)]="user.roles" multiple required>
                  @for (role of availableRoles; track role.id) {
                    <mat-option [value]="role.id">{{ role.name }}</mat-option>
                  }
                </mat-select>
              </mat-form-field>
            </div>

            <div class="checkbox-container">
              <mat-checkbox name="passwordNeverExpires" [(ngModel)]="user.passwordNeverExpires">
                {{ 'USERS.PASSWORD_NEVER_EXPIRES' | translate }}
              </mat-checkbox>
            </div>

            <div class="form-actions">
              <button mat-button type="button" (click)="onCancel()" [disabled]="isSaving">
                {{ 'COMMON.CANCEL' | translate }}
              </button>
              <button
                mat-raised-button
                color="primary"
                type="submit"
                [disabled]="userForm.invalid || isSaving"
              >
                @if (isSaving) {
                  <mat-spinner
                    diameter="20"
                    style="margin-right: 8px; display: inline-block; vertical-align: middle;"
                  ></mat-spinner>
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
      .user-form {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }
      .form-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 16px;
      }
      .full-width {
        grid-column: span 2;
      }
      mat-form-field {
        width: 100%;
      }
      .checkbox-container {
        padding: 8px 0;
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
export class UserFormComponent implements OnInit {
  private readonly usersService = inject(UsersService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  private readonly LIST_PATH = '/security/users';

  userId: number | null = null;
  isEditMode = false;
  isSaving = false;

  user: PostUsersRequest = {
    passwordNeverExpires: false,
    roles: [],
  };

  offices: Record<string, unknown>[] = [];
  availableRoles: RoleData[] = [];

  ngOnInit(): void {
    this.loadMetadata();
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.userId = +id;
        this.isEditMode = true;
        this.loadUserData();
      }
    });
  }

  private loadMetadata(): void {
    this.usersService.template22().subscribe((template: GetUsersTemplateResponse) => {
      this.offices = (template.allowedOffices as unknown as Record<string, unknown>[]) || [];
      this.availableRoles = template.availableRoles || [];
    });
  }

  private loadUserData(): void {
    if (!this.userId) return;
    this.usersService.retrieveOne31(this.userId).subscribe((data) => {
      this.user = {
        username: data.username,
        firstname: data.firstname,
        lastname: data.lastname,
        email: data.email,
        officeId: data.officeId,
        passwordNeverExpires: data.passwordNeverExpires,
        roles: data.selectedRoles?.map((r) => r.id!) || [],
      };
    });
  }

  onSubmit(): void {
    this.isSaving = true;

    if (this.isEditMode && this.userId) {
      const putRequest: PutUsersUserIdRequest = {
        firstname: this.user.firstname,
        lastname: this.user.lastname,
        email: this.user.email,
        officeId: this.user.officeId,
        roles: this.user.roles,
      };

      this.usersService.update26(this.userId, putRequest).subscribe({
        next: () => this.router.navigate([this.LIST_PATH]),
        error: () => (this.isSaving = false),
      });
    } else {
      this.usersService.create15(this.user).subscribe({
        next: () => this.router.navigate([this.LIST_PATH]),
        error: () => (this.isSaving = false),
      });
    }
  }

  onCancel(): void {
    this.router.navigate([this.LIST_PATH]);
  }
}
