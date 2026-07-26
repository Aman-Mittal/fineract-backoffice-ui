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

import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';
import {
  DataTableComponent,
  ColumnDef,
  HasPermissionDirective,
  CellTemplateDirective,
} from '../../../shared';
import { StaffService, StaffData } from '../../../api';
import { IonButton, IonIcon } from '@ionic/angular/standalone';

@Component({
  selector: 'app-staff-list',
  standalone: true,
  imports: [
    RouterModule,
    TranslateModule,
    MatIconModule,
    DataTableComponent,
    HasPermissionDirective,
    CellTemplateDirective,
    IonIcon,
    IonButton,
  ],
  template: `
    <app-data-table
      title="ORGANIZATION.STAFF"
      [columns]="columns"
      [data]="staff()"
      [isLoading]="isLoading()"
      [localLogic]="true"
    >
      <ion-button
        headerActions
        color="primary"
        [routerLink]="['create']"
        *appHasPermission="'CREATE_STAFF'"
      >
        <ion-icon name="add-outline"></ion-icon>
        {{ 'ORGANIZATION.CREATE_STAFF' | translate }}
      </ion-button>

      <ng-template appCellTemplate="isLoanOfficer" let-row>
        <mat-icon [color]="row.isLoanOfficer ? 'primary' : 'warn'">
          {{ row.isLoanOfficer ? 'check_circle' : 'cancel' }}
        </mat-icon>
      </ng-template>

      <ng-template appCellTemplate="isActive" let-row>
        <mat-icon [color]="row.isActive ? 'primary' : 'warn'">
          {{ row.isActive ? 'check_circle' : 'cancel' }}
        </mat-icon>
      </ng-template>

      <ng-template appCellTemplate="actions" let-row>
        <div class="action-buttons">
          <ion-button
            fill="clear"
            color="primary"
            [routerLink]="['edit', row.id]"
            *appHasPermission="'UPDATE_STAFF'"
            [attr.title]="'COMMON.EDIT' | translate"
          >
            <ion-icon name="create-outline"></ion-icon>
          </ion-button>
        </div>
      </ng-template>
    </app-data-table>
  `,
  styles: [
    `
      .action-buttons {
        display: flex;
        gap: 8px;
      }
    `,
  ],
})
export class StaffListComponent implements OnInit {
  private readonly staffService = inject(StaffService);

  staff = signal<StaffData[]>([]);
  isLoading = signal<boolean>(false);

  columns: ColumnDef[] = [
    {
      key: 'displayName',
      label: 'COMMON.NAME',
    },
    {
      key: 'officeName',
      label: 'COMMON.OFFICE',
    },
    {
      key: 'isLoanOfficer',
      label: 'ORGANIZATION.IS_LOAN_OFFICER',
    },
    {
      key: 'isActive',
      label: 'COMMON.ACTIVE',
    },
    {
      key: 'actions',
      label: 'COMMON.ACTIONS',
    },
  ];

  ngOnInit(): void {
    this.loadStaff();
  }

  loadStaff(): void {
    this.isLoading.set(true);
    this.staffService.getStaff(undefined, undefined, undefined, 'all').subscribe({
      next: (data) => {
        this.staff.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to load staff', err);
        this.isLoading.set(false);
      },
    });
  }
}
