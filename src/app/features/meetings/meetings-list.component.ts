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
import { MeetingsService, MeetingData } from '../../api';
import { formatArrayDate } from '../../core/utils/date-formatter';

/**
 * Lists the meetings recorded against a single group or center. The entity type
 * ('groups' / 'centers') and entity id are read from the route snapshot; create and
 * delete actions operate within that entity's meeting collection.
 */
@Component({
  selector: 'app-meetings-list',
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
      title="MEETINGS.TITLE"
      helpTextKey="HELP.MEETINGS_DESC"
      createButtonLabel="MEETINGS.CREATE"
      [columns]="columns"
      [data]="meetings"
      [totalRecords]="meetings.length"
      [localLogic]="true"
      (create)="onCreate()"
    >
      <ng-template appCellTemplate="meetingDate" let-row>
        {{ formatDate(row.meetingDate) }}
      </ng-template>
      <ng-template appCellTemplate="presentCount" let-row>
        {{ presentCount(row) }}
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
export class MeetingsListComponent implements OnInit {
  private readonly meetingsService = inject(MeetingsService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly columns: ColumnDef[] = [
    { key: 'meetingDate', label: 'MEETINGS.MEETING_DATE', sortable: false },
    { key: 'presentCount', label: 'MEETINGS.PRESENT_COUNT', sortable: false },
    { key: 'actions', label: 'COMMON.ACTIONS', sortable: false },
  ];

  entityType!: string;
  entityId!: number;
  meetings: MeetingData[] = [];

  ngOnInit(): void {
    this.entityType = this.route.snapshot.paramMap.get('entityType') ?? '';
    this.entityId = Number(this.route.snapshot.paramMap.get('entityId'));
    this.load();
  }

  load(): void {
    this.meetingsService.getEntityTypeEntityIdMeetings(this.entityType, this.entityId).subscribe({
      next: (data: MeetingData[]) => {
        this.meetings = data || [];
      },
      error: (err: unknown) => {
        console.error('Failed to load meetings', err);
      },
    });
  }

  formatDate(value: string | undefined): string {
    return formatArrayDate(value);
  }

  presentCount(row: MeetingData): number {
    return (row.clientsAttendance ?? []).filter((a) => a.attendanceType != null).length;
  }

  onCreate(): void {
    this.router.navigate(['/meetings', this.entityType, this.entityId, 'create']);
  }

  onEdit(row: MeetingData): void {
    this.router.navigate(['/meetings', this.entityType, this.entityId, 'edit', row.id]);
  }

  onDelete(row: MeetingData): void {
    if (!row.id || !window.confirm('Delete this meeting?')) return;
    this.meetingsService
      .deleteEntityTypeEntityIdMeetingsMeetingId(this.entityType, this.entityId, row.id)
      .subscribe({
        next: () => this.load(),
        error: (err: unknown) => console.error('Failed to delete meeting', err),
      });
  }
}
