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
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {
  RolesService,
  PostRolesRequest,
  PutRolesRoleIdRequest,
  PutRolesRoleIdPermissionsRequest,
  GetRolesRoleIdPermissionsResponse,
} from '../../../api';

/**
 * Component for creating and editing system roles and their permissions.
 */
@Component({
  selector: 'app-role-form',
  standalone: true,
  imports: [
    FormsModule,
    TranslateModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatTooltipModule,
    MatDividerModule,
    MatProgressSpinnerModule,
  ],
  template: `
    <div class="form-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>
            {{ isEditMode ? ('ROLES.EDIT_ROLE' | translate) : ('ROLES.CREATE_ROLE' | translate) }}
          </mat-card-title>
        </mat-card-header>

        <mat-card-content>
          <form #roleForm="ngForm" (ngSubmit)="onSubmit()" class="role-form">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>{{ 'COMMON.NAME' | translate }}</mat-label>
              <input
                matInput
                name="name"
                [(ngModel)]="role.name"
                required
                [disabled]="isEditMode"
              />
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>{{ 'COMMON.DESCRIPTION' | translate }}</mat-label>
              <textarea
                matInput
                name="description"
                [(ngModel)]="role.description"
                required
                rows="2"
              ></textarea>
            </mat-form-field>

            @if (isEditMode) {
              <mat-divider></mat-divider>
              <div class="permissions-section">
                <h3>{{ 'ROLES.PERMISSIONS' | translate }}</h3>
                <div class="permissions-grid">
                  @for (perm of permissions; track perm['code']) {
                    <div class="permission-item">
                      <mat-checkbox
                        [name]="'perm_' + perm['code']"
                        [(ngModel)]="permissionMappings[perm['code'] + '']"
                      >
                        {{ perm['code'] }}
                      </mat-checkbox>
                    </div>
                  }
                </div>
              </div>
            }

            <div class="form-actions">
              <button mat-button type="button" (click)="onCancel()" [disabled]="isSaving">
                {{ 'COMMON.CANCEL' | translate }}
              </button>
              <button
                mat-raised-button
                color="primary"
                type="submit"
                [disabled]="roleForm.invalid || isSaving"
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
        max-width: 1000px;
        margin: 0 auto;
      }
      .role-form {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }
      .full-width {
        width: 100%;
      }
      .permissions-section {
        margin-top: 16px;
      }
      .permissions-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 8px;
        max-height: 400px;
        overflow-y: auto;
        padding: 8px;
        border: 1px solid #eee;
        border-radius: 4px;
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
export class RoleFormComponent implements OnInit {
  private readonly rolesService = inject(RolesService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  private readonly LIST_PATH = '/security/roles';

  roleId: number | null = null;
  isEditMode = false;
  isSaving = false;

  role: PostRolesRequest = {};
  permissions: Record<string, unknown>[] = [];
  permissionMappings: Record<string, boolean> = {};

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.roleId = +id;
        this.isEditMode = true;
        this.loadRoleData();
      }
    });
  }

  private loadRoleData(): void {
    if (!this.roleId) return;
    this.rolesService.retrieveRole(this.roleId).subscribe((data) => {
      this.role = {
        name: data.name,
        description: data.description,
      };
      this.loadPermissions();
    });
  }

  private loadPermissions(): void {
    if (!this.roleId) return;
    this.rolesService
      .retrieveRolePermissions(this.roleId)
      .subscribe((data: GetRolesRoleIdPermissionsResponse) => {
        this.permissions = (data.permissionUsageData as unknown as Record<string, unknown>[]) || [];
        this.permissions.forEach((p) => {
          this.permissionMappings[p['code'] + ''] = (p['selected'] as boolean) || false;
        });
      });
  }

  onSubmit(): void {
    this.isSaving = true;

    if (this.isEditMode && this.roleId) {
      const roleUpdate: PutRolesRoleIdRequest = {
        description: this.role.description,
      };

      // Update role description
      this.rolesService.updateRole(this.roleId, roleUpdate).subscribe({
        next: () => {
          // Then update permissions
          const permUpdate: PutRolesRoleIdPermissionsRequest = {
            permissions: this.permissionMappings,
          };
          this.rolesService.updateRolePermissions(this.roleId!, permUpdate).subscribe({
            next: () => this.router.navigate([this.LIST_PATH]),
            error: () => (this.isSaving = false),
          });
        },
        error: () => (this.isSaving = false),
      });
    } else {
      this.rolesService.createRole(this.role).subscribe({
        next: () => this.router.navigate([this.LIST_PATH]),
        error: () => (this.isSaving = false),
      });
    }
  }

  onCancel(): void {
    this.router.navigate([this.LIST_PATH]);
  }
}
