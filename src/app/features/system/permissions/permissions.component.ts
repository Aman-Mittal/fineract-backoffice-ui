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
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { PermissionsService, GetPermissionsResponse, PutPermissionsRequest } from '../../../api';

/**
 * Maker-checker permission configuration: lists permissions grouped by their
 * `grouping`, lets the user toggle maker-checker (`selected`) per permission,
 * and saves the changed flags via putPermissions.
 */
@Component({
  selector: 'app-permissions-list',
  standalone: true,
  imports: [
    FormsModule,
    TranslateModule,
    MatCardModule,
    MatTableModule,
    MatCheckboxModule,
    MatButtonModule,
  ],
  template: `
    <div class="permissions-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>{{ 'PERMISSIONS.TITLE' | translate }}</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          @for (group of groupNames; track group) {
            <h3 class="group-heading">{{ group }}</h3>
            <table mat-table [dataSource]="grouped[group]" class="permissions-table">
              <ng-container matColumnDef="code">
                <th mat-header-cell *matHeaderCellDef>{{ 'PERMISSIONS.CODE' | translate }}</th>
                <td mat-cell *matCellDef="let row">{{ row.code }}</td>
              </ng-container>
              <ng-container matColumnDef="entityName">
                <th mat-header-cell *matHeaderCellDef>{{ 'PERMISSIONS.ENTITY' | translate }}</th>
                <td mat-cell *matCellDef="let row">{{ row.entityName }}</td>
              </ng-container>
              <ng-container matColumnDef="actionName">
                <th mat-header-cell *matHeaderCellDef>{{ 'PERMISSIONS.ACTION' | translate }}</th>
                <td mat-cell *matCellDef="let row">{{ row.actionName }}</td>
              </ng-container>
              <ng-container matColumnDef="selected">
                <th mat-header-cell *matHeaderCellDef>
                  {{ 'PERMISSIONS.MAKER_CHECKER' | translate }}
                </th>
                <td mat-cell *matCellDef="let row">
                  <mat-checkbox
                    [(ngModel)]="row.selected"
                    (ngModelChange)="onToggle(row)"
                  ></mat-checkbox>
                </td>
              </ng-container>
              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
            </table>
          }
          <div class="actions">
            <button mat-raised-button color="primary" [disabled]="isSaving" (click)="onSave()">
              {{ 'COMMON.SAVE' | translate }}
            </button>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [
    `
      .permissions-container {
        padding: 16px;
      }
      .group-heading {
        margin-top: 24px;
        text-transform: capitalize;
      }
      .permissions-table {
        width: 100%;
      }
      .actions {
        margin-top: 24px;
        display: flex;
        justify-content: flex-end;
      }
    `,
  ],
})
export class PermissionsListComponent implements OnInit {
  private readonly permissionsService = inject(PermissionsService);

  readonly displayedColumns = ['code', 'entityName', 'actionName', 'selected'];

  permissions: GetPermissionsResponse[] = [];
  grouped: Record<string, GetPermissionsResponse[]> = {};
  groupNames: string[] = [];
  changed: Record<string, boolean> = {};
  isSaving = false;

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.permissionsService.getPermissions().subscribe({
      next: (data: GetPermissionsResponse[]) => {
        this.permissions = data || [];
        this.grouped = {};
        for (const p of this.permissions) {
          const key = p.grouping || 'other';
          if (!this.grouped[key]) this.grouped[key] = [];
          this.grouped[key].push(p);
        }
        this.groupNames = Object.keys(this.grouped);
        this.changed = {};
      },
      error: (err: unknown) => console.error('Failed to load permissions', err),
    });
  }

  onToggle(row: GetPermissionsResponse): void {
    if (row.code) {
      this.changed[row.code] = !!row.selected;
    }
  }

  onSave(): void {
    this.isSaving = true;
    const request: PutPermissionsRequest = { permissions: this.changed };
    this.permissionsService.putPermissions(request).subscribe({
      next: () => {
        this.isSaving = false;
        this.load();
      },
      error: (err: unknown) => {
        this.isSaving = false;
        console.error('Failed to save permissions', err);
      },
    });
  }
}
