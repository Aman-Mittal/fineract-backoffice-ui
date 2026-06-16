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
import { TranslateModule } from '@ngx-translate/core';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NotificationService, GetNotification } from '../../../api';

/**
 * Notifications: list user notifications (read / unread) and mark them all read
 * via the notifications endpoint.
 */
@Component({
  selector: 'app-notifications-config',
  standalone: true,
  imports: [
    TranslateModule,
    MatCardModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
  ],
  template: `
    <div class="form-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>{{ 'NOTIFICATIONS_CONFIG.TITLE' | translate }}</mat-card-title>
        </mat-card-header>

        <mat-card-content>
          @if (notifications.length) {
            <mat-list>
              @for (note of notifications; track note.id) {
                <mat-list-item>
                  <mat-icon matListItemIcon>
                    {{ note.isRead ? 'drafts' : 'markunread' }}
                  </mat-icon>
                  <span matListItemTitle>{{ note.content }}</span>
                  <span matListItemLine>{{ note.createdAt }}</span>
                </mat-list-item>
              }
            </mat-list>
          } @else {
            <p>{{ 'NOTIFICATIONS_CONFIG.EMPTY' | translate }}</p>
          }

          <div class="form-actions">
            <button
              mat-raised-button
              color="primary"
              type="button"
              [disabled]="isSaving"
              (click)="onMarkAllRead()"
            >
              @if (isSaving) {
                <mat-spinner
                  diameter="20"
                  style="margin-right: 8px; display: inline-block; vertical-align: middle;"
                ></mat-spinner>
                {{ 'COMMON.SAVING' | translate }}
              } @else {
                {{ 'NOTIFICATIONS_CONFIG.MARK_ALL_READ' | translate }}
              }
            </button>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [
    `
      .form-container {
        padding: 24px;
        max-width: 600px;
        margin: 0 auto;
      }
      .form-actions {
        display: flex;
        justify-content: flex-end;
        gap: 12px;
        margin-top: 16px;
      }
    `,
  ],
})
export class NotificationsConfigComponent implements OnInit {
  private readonly service = inject(NotificationService);

  notifications: GetNotification[] = [];
  isSaving = false;

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.service.getNotifications().subscribe((data) => {
      this.notifications = data.pageItems ?? [];
    });
  }

  onMarkAllRead(): void {
    this.isSaving = true;
    this.service.putNotifications().subscribe({
      next: () => {
        this.isSaving = false;
        this.load();
      },
      error: () => (this.isSaving = false),
    });
  }
}
