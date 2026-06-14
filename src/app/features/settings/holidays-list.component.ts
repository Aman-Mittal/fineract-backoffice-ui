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
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import {
  DataTableComponent,
  ColumnDef,
  CellTemplateDirective,
  StatusBadgeComponent,
} from '../../shared';
import {
  HolidaysService,
  OfficesService,
  GetHolidaysResponse,
  GetOfficesResponse,
} from '../../api';

/**
 * Inline Dialog component for activation confirmation.
 */
@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [TranslateModule, MatDialogModule, MatButtonModule],
  template: `
    <h2 mat-dialog-title>{{ data.title | translate }}</h2>
    <mat-dialog-content>
      <p>{{ data.message | translate: data.params }}</p>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button [mat-dialog-close]="false">{{ 'COMMON.CANCEL' | translate }}</button>
      <button mat-raised-button color="primary" [mat-dialog-close]="true">
        {{ 'COMMON.CONFIRM' | translate }}
      </button>
    </mat-dialog-actions>
  `,
})
export class ConfirmDialogComponent {
  readonly data = inject<{ title: string; message: string; params?: Record<string, unknown> }>(
    MAT_DIALOG_DATA,
  );
}

/**
 * Component for listing office holidays.
 */
@Component({
  selector: 'app-holidays-list',
  standalone: true,
  imports: [
    TranslateModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatSelectModule,
    MatDialogModule,
    MatSnackBarModule,
    DataTableComponent,
    CellTemplateDirective,
    StatusBadgeComponent,
  ],
  template: `
    <app-data-table
      title="nav.holidays"
      helpTextKey="HELP.HOLIDAYS_DESC"
      createButtonLabel="SETTINGS.CREATE_HOLIDAY"
      [columns]="columns"
      [data]="holidays"
      [totalRecords]="holidays.length"
      [showSearch]="true"
      [localLogic]="true"
      [isLoading]="isLoading"
      (create)="onCreateHoliday()"
    >
      <div filters class="office-filter-container">
        <mat-form-field appearance="outline" class="office-filter-field">
          <mat-label>{{ 'HOLIDAYS.APPLICABLE_OFFICES' | translate }}</mat-label>
          <mat-select [value]="selectedOfficeId" (selectionChange)="onOfficeChange($event.value)">
            @for (office of offices; track office.id) {
              <mat-option [value]="office.id">{{ office.name }}</mat-option>
            }
          </mat-select>
        </mat-form-field>
      </div>

      <ng-template appCellTemplate="fromDate" let-holiday>
        {{ formatArrayDate(holiday.fromDate) }}
      </ng-template>

      <ng-template appCellTemplate="toDate" let-holiday>
        {{ formatArrayDate(holiday.toDate) }}
      </ng-template>

      <ng-template appCellTemplate="status" let-holiday>
        <app-status-badge [status]="holiday.status"></app-status-badge>
      </ng-template>

      <ng-template appCellTemplate="actions" let-holiday>
        @if (holiday.status?.code === 'holidayStatusType.pending.for.activation') {
          <button
            mat-icon-button
            color="primary"
            [matTooltip]="'HOLIDAYS.ACTIVATE' | translate"
            (click)="onActivateHoliday(holiday)"
          >
            <mat-icon>check_circle</mat-icon>
          </button>
        }
      </ng-template>
    </app-data-table>
  `,
  styles: [
    `
      .office-filter-container {
        display: flex;
        align-items: center;
        margin-left: 16px;
      }
      .office-filter-field {
        min-width: 250px;
        margin-top: 8px;
      }
    `,
  ],
})
export class HolidaysListComponent implements OnInit {
  private readonly holidaysService = inject(HolidaysService);
  private readonly officesService = inject(OfficesService);
  private readonly router = inject(Router);
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);

  readonly columns: ColumnDef[] = [
    { key: 'name', label: 'COMMON.NAME', sortable: true },
    { key: 'fromDate', label: 'COMMON.FROM_DATE', sortable: true },
    { key: 'toDate', label: 'COMMON.TO_DATE', sortable: true },
    { key: 'status', label: 'COMMON.STATUS', sortable: true },
    { key: 'actions', label: 'COMMON.ACTIONS', sortable: false },
  ];

  holidays: GetHolidaysResponse[] = [];
  offices: GetOfficesResponse[] = [];
  selectedOfficeId = 1;
  isLoading = false;

  ngOnInit(): void {
    this.loadOffices();
  }

  private loadOffices(): void {
    this.isLoading = true;
    this.officesService.retrieveOffices(true).subscribe({
      next: (data) => {
        this.offices = data || [];
        if (this.offices.length > 0) {
          const hasOffice1 = this.offices.some((o) => o.id === 1);
          this.selectedOfficeId = hasOffice1 ? 1 : this.offices[0].id!;
        }
        this.loadHolidays();
      },
      error: (err) => {
        console.error('Failed to load offices', err);
        this.loadHolidays();
      },
    });
  }

  private loadHolidays(): void {
    this.isLoading = true;
    this.holidaysService.retrieveAllHolidays(this.selectedOfficeId).subscribe({
      next: (data) => {
        this.holidays = data || [];
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Failed to load holidays', err);
      },
    });
  }

  onOfficeChange(officeId: number): void {
    this.selectedOfficeId = officeId;
    this.loadHolidays();
  }

  onCreateHoliday(): void {
    this.router.navigate(['/settings/holidays/create']);
  }

  onActivateHoliday(holiday: GetHolidaysResponse): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'HOLIDAYS.ACTIVATE_TITLE',
        message: 'HOLIDAYS.ACTIVATE_CONFIRM',
        params: { name: holiday.name },
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.isLoading = true;
        this.holidaysService.handleCommands1(holiday.id!, {}, 'activate').subscribe({
          next: () => {
            this.snackBar.open('Holiday activated successfully', 'Close', { duration: 3000 });
            this.loadHolidays();
          },
          error: (err) => {
            this.isLoading = false;
            console.error('Failed to activate holiday', err);
            this.snackBar.open('Failed to activate holiday', 'Close', { duration: 3000 });
          },
        });
      }
    });
  }

  formatArrayDate(dateArray: unknown): string {
    if (!dateArray || !Array.isArray(dateArray) || dateArray.length < 3) {
      return '-';
    }
    return `${dateArray[0]}-${String(dateArray[1]).padStart(2, '0')}-${String(dateArray[2]).padStart(2, '0')}`;
  }
}
