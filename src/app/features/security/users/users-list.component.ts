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
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DataTableComponent, ColumnDef, CellTemplateDirective } from '../../../shared';
import { UsersService, GetUsersResponse } from '../../../api';

/**
 * Component for listing system users.
 */
@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    DataTableComponent,
    CellTemplateDirective,
  ],
  template: `
    <app-data-table
      title="nav.users"
      helpTextKey="HELP.USERS_DESC"
      createButtonLabel="USERS.CREATE"
      [columns]="columns"
      [data]="users"
      [totalRecords]="users.length"
      [showSearch]="true"
      [localLogic]="true"
      (create)="onCreateUser()"
    >
      <ng-template appCellTemplate="actions" let-user>
        <button
          mat-icon-button
          color="primary"
          [attr.aria-label]="'COMMON.EDIT' | translate"
          matTooltip="Edit User"
          (click)="onEditUser(user)"
        >
          <mat-icon>edit</mat-icon>
        </button>
      </ng-template>
    </app-data-table>
  `,
})
export class UsersListComponent implements OnInit {
  private readonly usersService = inject(UsersService);
  private readonly router = inject(Router);

  readonly columns: ColumnDef[] = [
    { key: 'username', label: 'USERS.USERNAME', sortable: true },
    { key: 'firstname', label: 'CLIENTS.FIRST_NAME', sortable: true },
    { key: 'lastname', label: 'CLIENTS.LAST_NAME', sortable: true },
    { key: 'email', label: 'COMMON.EMAIL', sortable: true },
    { key: 'officeName', label: 'COMMON.OFFICE', sortable: true },
    { key: 'actions', label: 'COMMON.ACTIONS', sortable: false },
  ];

  users: GetUsersResponse[] = [];

  ngOnInit(): void {
    this.loadUsers();
  }

  private loadUsers(): void {
    this.usersService.retrieveAll41().subscribe({
      next: (data) => {
        this.users = data || [];
      },
      error: (err) => console.error('Failed to load users', err),
    });
  }

  onCreateUser(): void {
    this.router.navigate(['/security/users/create']);
  }

  onEditUser(user: GetUsersResponse): void {
    this.router.navigate(['/security/users/edit', user.id]);
  }
}
