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
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ColumnDef, CellTemplateDirective } from '../../../shared';
import { DataTableComponent } from '../../../shared/components/data-table/data-table.component';
import { AccountNumberFormatService, GetAccountNumberFormatsIdResponse } from '../../../api';

@Component({
  selector: 'app-account-number-formats-list',
  standalone: true,
  imports: [
    TranslateModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    DataTableComponent,
    CellTemplateDirective,
  ],
  template: `
    <app-data-table
      [title]="'ACCOUNT_NUMBER_FORMATS.TITLE' | translate"
      createButtonLabel="ACCOUNT_NUMBER_FORMATS.TITLE"
      [columns]="columns"
      [data]="formats"
      [totalRecords]="formats.length"
      [localLogic]="true"
      (create)="onCreate()"
    >
      <ng-template appCellTemplate="accountType" let-row>
        {{ row.accountType?.value ?? '-' }}
      </ng-template>

      <ng-template appCellTemplate="prefixType" let-row>
        {{ row.prefixType?.value ?? '-' }}
      </ng-template>

      <ng-template appCellTemplate="actions" let-row>
        <button
          mat-icon-button
          color="primary"
          [attr.aria-label]="'COMMON.EDIT' | translate"
          [matTooltip]="'COMMON.EDIT' | translate"
          (click)="onEdit(row)"
        >
          <mat-icon>edit</mat-icon>
        </button>
        <button
          mat-icon-button
          color="warn"
          [attr.aria-label]="'COMMON.DELETE' | translate"
          [matTooltip]="'COMMON.DELETE' | translate"
          (click)="onDelete(row)"
        >
          <mat-icon>delete</mat-icon>
        </button>
      </ng-template>
    </app-data-table>
  `,
})
export class AccountNumberFormatsListComponent implements OnInit {
  private readonly accountNumberFormatService = inject(AccountNumberFormatService);
  private readonly router = inject(Router);

  readonly columns: ColumnDef[] = [
    { key: 'accountType', label: 'ACCOUNT_NUMBER_FORMATS.ACCOUNT_TYPE', sortable: true },
    { key: 'prefixType', label: 'ACCOUNT_NUMBER_FORMATS.PREFIX_TYPE', sortable: true },
    { key: 'actions', label: 'COMMON.ACTIONS', sortable: false },
  ];

  formats: GetAccountNumberFormatsIdResponse[] = [];

  ngOnInit(): void {
    this.loadFormats();
  }

  private loadFormats(): void {
    this.accountNumberFormatService.getAccountnumberformats().subscribe({
      next: (data: GetAccountNumberFormatsIdResponse[]) => {
        this.formats = data || [];
      },
      error: (err: unknown) => {
        console.error('Failed to load account number formats', err);
      },
    });
  }

  onCreate(): void {
    this.router.navigate(['/organization/account-number-formats/create']);
  }

  onEdit(row: GetAccountNumberFormatsIdResponse): void {
    this.router.navigate(['/organization/account-number-formats/edit', row.id]);
  }

  onDelete(row: GetAccountNumberFormatsIdResponse): void {
    if (!row.id) return;
    const confirmed = window.confirm(
      `Delete account number format for "${row.accountType?.value ?? row.id}"?`,
    );
    if (!confirmed) return;
    this.accountNumberFormatService
      .deleteAccountnumberformatsAccountNumberFormatId(row.id)
      .subscribe({
        next: () => {
          this.formats = this.formats.filter((f) => f.id !== row.id);
        },
        error: (err: unknown) => {
          console.error('Failed to delete account number format', err);
        },
      });
  }
}
