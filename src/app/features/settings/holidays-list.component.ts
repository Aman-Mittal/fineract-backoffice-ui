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
import {
  DataTableComponent,
  ColumnDef,
  CellTemplateDirective,
  StatusBadgeComponent,
} from '../../shared';
import { HolidaysService, GetHolidaysResponse } from '../../api';

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
      (create)="onCreateHoliday()"
    >
      <ng-template appCellTemplate="fromDate" let-holiday>
        {{ formatArrayDate(holiday.fromDate) }}
      </ng-template>

      <ng-template appCellTemplate="toDate" let-holiday>
        {{ formatArrayDate(holiday.toDate) }}
      </ng-template>

      <ng-template appCellTemplate="status" let-holiday>
        <app-status-badge [status]="holiday.status"></app-status-badge>
      </ng-template>
    </app-data-table>
  `,
})
export class HolidaysListComponent implements OnInit {
  private readonly holidaysService = inject(HolidaysService);
  private readonly router = inject(Router);

  readonly columns: ColumnDef[] = [
    { key: 'name', label: 'COMMON.NAME', sortable: true },
    { key: 'fromDate', label: 'COMMON.FROM_DATE', sortable: true },
    { key: 'toDate', label: 'COMMON.TO_DATE', sortable: true },
    { key: 'status', label: 'COMMON.STATUS', sortable: true },
  ];

  holidays: GetHolidaysResponse[] = [];

  ngOnInit(): void {
    this.loadHolidays();
  }

  private loadHolidays(): void {
    // Note: retrieveAllHolidays needs officeId. Defaulting to 1 (Head Office).
    this.holidaysService.retrieveAllHolidays(1).subscribe({
      next: (data) => {
        this.holidays = data || [];
      },
      error: (err) => console.error('Failed to load holidays', err),
    });
  }

  onCreateHoliday(): void {
    this.router.navigate(['/settings/holidays/create']);
  }

  formatArrayDate(dateArray: unknown): string {
    if (!dateArray || !Array.isArray(dateArray) || dateArray.length < 3) {
      return '-';
    }
    return `${dateArray[0]}-${String(dateArray[1]).padStart(2, '0')}-${String(dateArray[2]).padStart(2, '0')}`;
  }
}
