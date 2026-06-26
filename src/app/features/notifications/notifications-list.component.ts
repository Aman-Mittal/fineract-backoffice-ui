/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements. See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership. The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License. You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import { Component, OnInit, signal, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NotificationService, GetNotificationsResponse, GetNotification } from '../../api';

@Component({
  selector: 'app-notifications-list',
  standalone: true,
  imports: [
    FormsModule,
    DatePipe,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatSnackBarModule,
    TranslateModule,
  ],
  template: `
    <mat-card>
      <mat-card-header>
        <mat-card-title>{{ 'NOTIFICATIONS.TITLE' | translate }}</mat-card-title>
        <div class="header-actions">
          <mat-checkbox [(ngModel)]="showUnreadOnly" (change)="onFilterChange()">
            {{ 'NOTIFICATIONS.SHOW_UNREAD' | translate }}
          </mat-checkbox>
          <button mat-raised-button color="primary" (click)="markAllRead()">
            {{ 'NOTIFICATIONS.MARK_ALL_READ' | translate }}
          </button>
        </div>
      </mat-card-header>

      <mat-card-content>
        @if (isLoading) {
          <div class="spinner-container">
            <mat-spinner diameter="40"></mat-spinner>
          </div>
        }

        @if (!isLoading) {
          <table mat-table [dataSource]="notifications()">
            <ng-container matColumnDef="content">
              <th mat-header-cell *matHeaderCellDef>{{ 'NOTIFICATIONS.MESSAGE' | translate }}</th>
              <td mat-cell *matCellDef="let row">{{ row.content }}</td>
            </ng-container>

            <ng-container matColumnDef="isRead">
              <th mat-header-cell *matHeaderCellDef>{{ 'NOTIFICATIONS.READ' | translate }}</th>
              <td mat-cell *matCellDef="let row">
                <mat-chip-set>
                  <mat-chip [color]="row.isRead ? 'primary' : 'warn'" highlighted>
                    {{ (row.isRead ? 'NOTIFICATIONS.READ' : 'NOTIFICATIONS.UNREAD') | translate }}
                  </mat-chip>
                </mat-chip-set>
              </td>
            </ng-container>

            <ng-container matColumnDef="createdAt">
              <th mat-header-cell *matHeaderCellDef>{{ 'NOTIFICATIONS.DATE' | translate }}</th>
              <td mat-cell *matCellDef="let row">{{ row.createdAt | date: 'medium' }}</td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
          </table>
        }
      </mat-card-content>
    </mat-card>
  `,
  styles: [
    `
      mat-card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .header-actions {
        display: flex;
        align-items: center;
        gap: 16px;
        margin-left: auto;
      }
      .spinner-container {
        display: flex;
        justify-content: center;
        padding: 32px;
      }
      table {
        width: 100%;
      }
    `,
  ],
})
export class NotificationsListComponent implements OnInit {
  private notificationService = inject(NotificationService);
  private snackBar = inject(MatSnackBar);
  private translate = inject(TranslateService);

  notifications = signal<GetNotification[]>([]);
  showUnreadOnly = false;
  isLoading = false;

  displayedColumns = ['content', 'isRead', 'createdAt'];

  ngOnInit(): void {
    this.loadNotifications();
  }

  loadNotifications(): void {
    this.isLoading = true;
    const isRead = this.showUnreadOnly ? false : undefined;
    this.notificationService
      .getNotifications(undefined, undefined, undefined, undefined, isRead)
      .subscribe({
        next: (response: GetNotificationsResponse) => {
          this.notifications.set(response.pageItems ?? []);
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
        },
      });
  }

  onFilterChange(): void {
    this.loadNotifications();
  }

  markAllRead(): void {
    this.notificationService.putNotifications().subscribe({
      next: () => {
        this.translate.get('NOTIFICATIONS.ALL_READ_SUCCESS').subscribe((msg: string) => {
          this.snackBar.open(msg, undefined, { duration: 3000 });
        });
        this.loadNotifications();
      },
    });
  }
}
