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
import { OfficesService, GetOfficesResponse } from '../../../api';

@Component({
  selector: 'app-offices-list',
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
      title="nav.organization"
      helpTextKey="HELP.OFFICES_DESC"
      createButtonLabel="OFFICES.CREATE_OFFICE"
      [columns]="columns"
      [data]="offices"
      [totalRecords]="offices.length"
      [localLogic]="true"
      (create)="onCreateOffice()"
    >
      <ng-template appCellTemplate="openingDate" let-office>
        {{ formatArrayDate(office.openingDate) }}
      </ng-template>

      <ng-template appCellTemplate="actions" let-office>
        <button
          mat-icon-button
          color="primary"
          [attr.aria-label]="'COMMON.EDIT' | translate"
          [matTooltip]="'COMMON.EDIT' | translate"
          (click)="onEditOffice(office)"
        >
          <mat-icon>edit</mat-icon>
        </button>
      </ng-template>
    </app-data-table>
  `,
})
export class OfficesListComponent implements OnInit {
  private readonly officesService = inject(OfficesService);
  private readonly router = inject(Router);

  readonly columns: ColumnDef[] = [
    { key: 'name', label: 'OFFICES.NAME', sortable: true },
    { key: 'externalId', label: 'OFFICES.EXTERNAL_ID', sortable: true },
    { key: 'openingDate', label: 'OFFICES.OPENING_DATE', sortable: true },
    { key: 'actions', label: 'COMMON.ACTIONS', sortable: false },
  ];

  offices: GetOfficesResponse[] = [];

  ngOnInit(): void {
    this.officesService.getOffices(true).subscribe({
      next: (data: GetOfficesResponse[]) => {
        this.offices = data || [];
      },
      error: (err: unknown) => {
        console.error('Failed to load offices', err);
      },
    });
  }

  onCreateOffice(): void {
    this.router.navigate(['/organization/offices/create']);
  }

  onEditOffice(office: GetOfficesResponse): void {
    this.router.navigate(['/organization/offices/edit', office.id]);
  }

  /**
   * Formats a Fineract array date [YYYY, MM, DD] into a readable string.
   *
   * @param dateArray - The raw date value from the API.
   * @returns A formatted date string or a placeholder if invalid.
   */
  formatArrayDate(dateArray: unknown): string {
    if (!dateArray || !Array.isArray(dateArray) || dateArray.length < 3) {
      return '-';
    }
    return `${dateArray[0]}-${String(dateArray[1]).padStart(2, '0')}-${String(dateArray[2]).padStart(2, '0')}`;
  }
}
