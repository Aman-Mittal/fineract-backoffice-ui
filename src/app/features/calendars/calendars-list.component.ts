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
import { TranslateModule } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ColumnDef, CellTemplateDirective } from '../../shared';
import { DataTableComponent } from '../../shared/components/data-table/data-table.component';
import { CalendarService, CalendarData } from '../../api';
import { formatArrayDate } from '../../core/utils/date-formatter';

/**
 * Lists the calendars (meeting schedules) attached to a single group or center.
 * The entity type ('groups' / 'centers') and entity id are read from the route
 * snapshot; create, edit and delete actions operate within that entity's collection.
 */
@Component({
  selector: 'app-calendars-list',
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
      title="CALENDARS.TITLE"
      helpTextKey="HELP.CALENDARS_DESC"
      createButtonLabel="CALENDARS.CREATE"
      [columns]="columns"
      [data]="calendars"
      [totalRecords]="calendars.length"
      [localLogic]="true"
      (create)="onCreate()"
    >
      <ng-template appCellTemplate="startDate" let-row>
        {{ formatDate(row.startDate) }}
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
export class CalendarsListComponent implements OnInit {
  private readonly calendarService = inject(CalendarService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly columns: ColumnDef[] = [
    { key: 'title', label: 'CALENDARS.TITLE_FIELD', sortable: true },
    { key: 'startDate', label: 'CALENDARS.START_DATE', sortable: false },
    { key: 'actions', label: 'COMMON.ACTIONS', sortable: false },
  ];

  entityType!: string;
  entityId!: number;
  calendars: CalendarData[] = [];

  ngOnInit(): void {
    this.entityType = this.route.snapshot.paramMap.get('entityType') ?? '';
    this.entityId = Number(this.route.snapshot.paramMap.get('entityId'));
    this.load();
  }

  load(): void {
    this.calendarService.getEntityTypeEntityIdCalendars(this.entityType, this.entityId).subscribe({
      next: (data: CalendarData[]) => {
        this.calendars = data || [];
      },
      error: (err: unknown) => {
        console.error('Failed to load calendars', err);
      },
    });
  }

  formatDate(value: string | undefined): string {
    return formatArrayDate(value);
  }

  onCreate(): void {
    this.router.navigate(['/calendars', this.entityType, this.entityId, 'create']);
  }

  onEdit(row: CalendarData): void {
    this.router.navigate(['/calendars', this.entityType, this.entityId, 'edit', row.id]);
  }

  onDelete(row: CalendarData): void {
    if (!row.id || !window.confirm('Delete this calendar?')) return;
    this.calendarService
      .deleteEntityTypeEntityIdCalendarsCalendarId(this.entityType, this.entityId, row.id)
      .subscribe({
        next: () => this.load(),
        error: (err: unknown) => console.error('Failed to delete calendar', err),
      });
  }
}
