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

import { Component, Input, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import {
  DataTableComponent,
  ColumnDef,
  HasPermissionDirective,
  CellTemplateDirective,
} from '../../../shared';
import { ClientIdentifierService, ClientIdentifierData } from '../../../api';

@Component({
  selector: 'app-client-identifiers-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TranslateModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    DataTableComponent,
    HasPermissionDirective,
    CellTemplateDirective,
  ],
  template: `
    <div class="tab-actions">
      <button
        mat-raised-button
        color="primary"
        [routerLink]="['/clients', clientId, 'identifiers', 'create']"
        *appHasPermission="'CREATE_CLIENTIDENTIFIER'"
      >
        <mat-icon>add</mat-icon>
        {{ 'CLIENTS.ADD_IDENTIFIER' | translate }}
      </button>
    </div>

    <app-data-table
      [data]="identifiers()"
      [columns]="columns"
      [isLoading]="isLoading()"
      [localLogic]="true"
    >
      <ng-template appCellTemplate="actions" let-row>
        <div class="action-buttons">
          <button
            mat-icon-button
            color="primary"
            [routerLink]="['/clients', clientId, 'identifiers', 'edit', row.id]"
            *appHasPermission="'UPDATE_CLIENTIDENTIFIER'"
            [matTooltip]="'COMMON.EDIT' | translate"
          >
            <mat-icon>edit</mat-icon>
          </button>
          <button
            mat-icon-button
            color="warn"
            (click)="onDelete(row.id)"
            *appHasPermission="'DELETE_CLIENTIDENTIFIER'"
            [matTooltip]="'COMMON.DELETE' | translate"
          >
            <mat-icon>delete</mat-icon>
          </button>
        </div>
      </ng-template>
    </app-data-table>
  `,
  styles: [
    `
      .tab-actions {
        display: flex;
        justify-content: flex-end;
        margin-bottom: 16px;
      }
      .action-buttons {
        display: flex;
        gap: 8px;
      }
    `,
  ],
})
export class ClientIdentifiersListComponent implements OnInit {
  @Input({ required: true }) clientId!: number;

  private readonly identifierService = inject(ClientIdentifierService);
  private readonly router = inject(Router);

  identifiers = signal<ClientIdentifierData[]>([]);
  isLoading = signal<boolean>(false);

  columns: ColumnDef[] = [
    {
      key: 'documentType.name',
      label: 'CLIENTS.DOCUMENT_TYPE',
    },
    {
      key: 'documentKey',
      label: 'CLIENTS.DOCUMENT_KEY',
    },
    {
      key: 'description',
      label: 'COMMON.DESCRIPTION',
    },
    {
      key: 'status',
      label: 'COMMON.STATUS',
    },
    {
      key: 'actions',
      label: 'COMMON.ACTIONS',
    },
  ];

  ngOnInit(): void {
    this.loadIdentifiers();
  }

  loadIdentifiers(): void {
    this.isLoading.set(true);
    this.identifierService.retrieveAllClientIdentifiers(this.clientId).subscribe({
      next: (data) => {
        this.identifiers.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to load client identifiers', err);
        this.isLoading.set(false);
      },
    });
  }

  onDelete(id: number): void {
    if (confirm('Are you sure you want to delete this identifier?')) {
      this.identifierService.deleteClientIdentifier(this.clientId, id).subscribe({
        next: () => this.loadIdentifiers(),
        error: (err) => console.error('Failed to delete identifier', err),
      });
    }
  }
}
