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

import { Component, inject } from '@angular/core';

import { TranslateModule } from '@ngx-translate/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Subject, of } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { DataTableComponent, CellTemplateDirective, ColumnDef } from '../../../shared';
import { MakerCheckerOr4EyeFunctionalityService, AuditData } from '../../../api';
import { ViewPayloadDialogComponent } from './view-payload-dialog.component';
import { IonButton, IonIcon } from '@ionic/angular/standalone';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-checker-inbox',
  standalone: true,
  imports: [
    TranslateModule,
    MatDialogModule,
    DataTableComponent,
    CellTemplateDirective,
    IonIcon,
    IonButton,
  ],
  template: `
    <app-data-table
      title="nav.checker_inbox"
      helpTextKey="HELP.TASKS_DESC"
      [columns]="columns"
      [data]="tasks"
      [showSearch]="false"
      (sortChange)="onSort()"
    >
      <ng-template appCellTemplate="madeOnDate" let-task>
        {{ formatDate(task.madeOnDate) }}
      </ng-template>

      <ng-template appCellTemplate="actions" let-task>
        <div class="action-buttons">
          <ion-button
            fill="clear"
            color="primary"
            title="View Payload"
            (click)="onViewPayload(task)"
          >
            <ion-icon name="eye-outline"></ion-icon>
          </ion-button>
          <ion-button fill="clear" class="approve-btn" title="Approve" (click)="onApprove(task)">
            <ion-icon name="checkmark-circle-outline"></ion-icon>
          </ion-button>
          <ion-button fill="clear" color="warn" title="Reject" (click)="onReject(task)">
            <ion-icon name="close-circle-outline"></ion-icon>
          </ion-button>
        </div>
      </ng-template>
    </app-data-table>
  `,
  styles: [
    `
      .action-buttons {
        display: flex;
        gap: 4px;
      }
      .approve-btn {
        color: #2ecc71;
      }
    `,
  ],
})
export class CheckerInboxComponent {
  private readonly makerCheckerService = inject(MakerCheckerOr4EyeFunctionalityService);
  private readonly notifications = inject(NotificationService);
  private readonly dialog = inject(MatDialog);

  columns: ColumnDef[] = [
    { key: 'id', label: 'COMMON.ID', sortable: true },
    { key: 'madeOnDate', label: 'COMMON.MADE_ON', sortable: true },
    { key: 'maker', label: 'COMMON.MAKER', sortable: true },
    { key: 'actionName', label: 'COMMON.ACTION', sortable: true },
    { key: 'entityName', label: 'COMMON.ENTITY', sortable: true },
    { key: 'actions', label: 'COMMON.ACTIONS', sortable: false },
  ];

  tasks: Record<string, unknown>[] = [];
  private refreshSubject = new Subject<void>();

  constructor() {
    this.refreshSubject
      .pipe(
        startWith({}),
        switchMap(() =>
          this.makerCheckerService.getMakercheckers().pipe(
            catchError(() => {
              this.notifications.error('Error fetching pending tasks');
              return of([]);
            }),
          ),
        ),
        map((data: AuditData[]) => {
          // Type casting to access undocumented fields returned by Fineract API
          return ((data as unknown as Record<string, unknown>[]) || []).map((item) => ({
            ...item,
            // Extract displayable values if they are nested objects
            maker: item['maker'] || item['createdByUsername'],
          }));
        }),
      )
      .subscribe((data) => {
        this.tasks = data;
      });
  }

  onSort() {
    // Local sorting handled by DataTableComponent if localLogic is true
  }

  onViewPayload(task: Record<string, unknown>) {
    this.dialog.open(ViewPayloadDialogComponent, {
      width: '600px',
      data: { payload: task['commandAsJson'] as string },
    });
  }

  onApprove(task: Record<string, unknown>) {
    this.makerCheckerService.postMakercheckersAuditId(task['id'] as number, 'approve').subscribe({
      next: () => {
        this.notifications.success('Task approved successfully');
        this.refreshSubject.next();
      },
      error: () => {
        this.notifications.error('Failed to approve task');
      },
    });
  }

  onReject(task: Record<string, unknown>) {
    if (confirm('Are you sure you want to reject this task?')) {
      this.makerCheckerService.deleteMakercheckersAuditId(task['id'] as number).subscribe({
        next: () => {
          this.notifications.success('Task rejected successfully');
          this.refreshSubject.next();
        },
        error: () => {
          this.notifications.error('Failed to reject task');
        },
      });
    }
  }

  formatDate(dateArray: unknown): string {
    if (Array.isArray(dateArray)) {
      return new Date(dateArray[0], dateArray[1] - 1, dateArray[2]).toLocaleDateString();
    }
    return (dateArray as string) || '';
  }
}
