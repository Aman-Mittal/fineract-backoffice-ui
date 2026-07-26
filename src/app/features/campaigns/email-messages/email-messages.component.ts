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
import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { TranslateModule } from '@ngx-translate/core';
import { DefaultService } from '../../../api';
import { NotificationService } from '../../../core/services/notification.service';
import { CdkTableModule } from '@angular/cdk/table';
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonInput,
  IonItem,
  IonLabel,
  IonTextarea,
} from '@ionic/angular/standalone';

interface EmailMessage {
  id: number;
  to?: string;
  subject?: string;
  status?: string;
  sentDate?: string;
}

const SUCCESS_MSG = 'EMAIL_MESSAGES.SUCCESS';

@Component({
  selector: 'app-email-messages',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTabsModule,
    CdkTableModule,
    TranslateModule,
    IonButton,
    IonInput,
    IonTextarea,
    IonItem,
    IonLabel,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonCard,
  ],
  template: `
    <div class="container">
      <ion-card>
        <ion-card-header>
          <ion-card-title>{{ 'EMAIL_MESSAGES.TITLE' | translate }}</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <mat-tab-group [(selectedIndex)]="activeTab" (selectedIndexChange)="onTabChange($event)">
            <!-- Tab: Messages -->
            <mat-tab [label]="'EMAIL_MESSAGES.MESSAGES_TAB' | translate">
              <div class="tab-content">
                <ion-button color="primary" (click)="showCreateForm = !showCreateForm">
                  {{ 'EMAIL_MESSAGES.CREATE' | translate }}
                </ion-button>

                @if (showCreateForm) {
                  <div class="create-form">
                    <ion-item fill="outline" class="full-width">
                      <ion-label position="stacked">{{
                        'EMAIL_MESSAGES.TO' | translate
                      }}</ion-label>
                      <ion-input type="email" [(ngModel)]="newTo"></ion-input>
                    </ion-item>
                    <ion-item fill="outline" class="full-width">
                      <ion-label position="stacked">{{
                        'EMAIL_MESSAGES.SUBJECT' | translate
                      }}</ion-label>
                      <ion-input [(ngModel)]="newSubject"></ion-input>
                    </ion-item>
                    <ion-item fill="outline" class="full-width">
                      <ion-label position="stacked">{{
                        'EMAIL_MESSAGES.BODY' | translate
                      }}</ion-label>
                      <ion-textarea rows="4" [(ngModel)]="newBody"></ion-textarea>
                    </ion-item>
                    <ion-button color="accent" (click)="createMessage()">
                      {{ 'EMAIL_MESSAGES.CREATE' | translate }}
                    </ion-button>
                  </div>
                }

                <cdk-table [dataSource]="messages()" class="full-width">
                  <ng-container cdkColumnDef="id">
                    <cdk-header-cell *cdkHeaderCellDef>ID</cdk-header-cell>
                    <cdk-cell *cdkCellDef="let row">{{ row.id }}</cdk-cell>
                  </ng-container>
                  <ng-container cdkColumnDef="to">
                    <cdk-header-cell *cdkHeaderCellDef>{{
                      'EMAIL_MESSAGES.TO' | translate
                    }}</cdk-header-cell>
                    <cdk-cell *cdkCellDef="let row">{{ row.to }}</cdk-cell>
                  </ng-container>
                  <ng-container cdkColumnDef="subject">
                    <cdk-header-cell *cdkHeaderCellDef>{{
                      'EMAIL_MESSAGES.SUBJECT' | translate
                    }}</cdk-header-cell>
                    <cdk-cell *cdkCellDef="let row">{{ row.subject }}</cdk-cell>
                  </ng-container>
                  <ng-container cdkColumnDef="status">
                    <cdk-header-cell *cdkHeaderCellDef>Status</cdk-header-cell>
                    <cdk-cell *cdkCellDef="let row">{{ row.status }}</cdk-cell>
                  </ng-container>
                  <ng-container cdkColumnDef="actions">
                    <cdk-header-cell *cdkHeaderCellDef>Actions</cdk-header-cell>
                    <cdk-cell *cdkCellDef="let row">
                      <ion-button
                        fill="clear"
                        color="warn"
                        (click)="deleteMessage(row.id)"
                        [title]="'EMAIL_MESSAGES.DELETE' | translate"
                      >
                        &#x1F5D1;
                      </ion-button>
                    </cdk-cell>
                  </ng-container>
                  <cdk-header-row *cdkHeaderRowDef="msgColumns"></cdk-header-row>
                  <cdk-row *cdkRowDef="let row; columns: msgColumns"></cdk-row>
                </cdk-table>
              </div>
            </mat-tab>

            <!-- Tab: Pending -->
            <mat-tab [label]="'EMAIL_MESSAGES.PENDING_TAB' | translate">
              <div class="tab-content">
                <cdk-table [dataSource]="pending()" class="full-width">
                  <ng-container cdkColumnDef="id">
                    <cdk-header-cell *cdkHeaderCellDef>ID</cdk-header-cell>
                    <cdk-cell *cdkCellDef="let row">{{ row.id }}</cdk-cell>
                  </ng-container>
                  <ng-container cdkColumnDef="to">
                    <cdk-header-cell *cdkHeaderCellDef>{{
                      'EMAIL_MESSAGES.TO' | translate
                    }}</cdk-header-cell>
                    <cdk-cell *cdkCellDef="let row">{{ row.to }}</cdk-cell>
                  </ng-container>
                  <ng-container cdkColumnDef="subject">
                    <cdk-header-cell *cdkHeaderCellDef>{{
                      'EMAIL_MESSAGES.SUBJECT' | translate
                    }}</cdk-header-cell>
                    <cdk-cell *cdkCellDef="let row">{{ row.subject }}</cdk-cell>
                  </ng-container>
                  <ng-container cdkColumnDef="sentDate">
                    <cdk-header-cell *cdkHeaderCellDef>{{
                      'EMAIL_MESSAGES.SENT_DATE' | translate
                    }}</cdk-header-cell>
                    <cdk-cell *cdkCellDef="let row">{{ row.sentDate }}</cdk-cell>
                  </ng-container>
                  <cdk-header-row *cdkHeaderRowDef="queueColumns"></cdk-header-row>
                  <cdk-row *cdkRowDef="let row; columns: queueColumns"></cdk-row>
                </cdk-table>
              </div>
            </mat-tab>

            <!-- Tab: Sent -->
            <mat-tab [label]="'EMAIL_MESSAGES.SENT_TAB' | translate">
              <div class="tab-content">
                <cdk-table [dataSource]="sent()" class="full-width">
                  <ng-container cdkColumnDef="id">
                    <cdk-header-cell *cdkHeaderCellDef>ID</cdk-header-cell>
                    <cdk-cell *cdkCellDef="let row">{{ row.id }}</cdk-cell>
                  </ng-container>
                  <ng-container cdkColumnDef="to">
                    <cdk-header-cell *cdkHeaderCellDef>{{
                      'EMAIL_MESSAGES.TO' | translate
                    }}</cdk-header-cell>
                    <cdk-cell *cdkCellDef="let row">{{ row.to }}</cdk-cell>
                  </ng-container>
                  <ng-container cdkColumnDef="subject">
                    <cdk-header-cell *cdkHeaderCellDef>{{
                      'EMAIL_MESSAGES.SUBJECT' | translate
                    }}</cdk-header-cell>
                    <cdk-cell *cdkCellDef="let row">{{ row.subject }}</cdk-cell>
                  </ng-container>
                  <ng-container cdkColumnDef="sentDate">
                    <cdk-header-cell *cdkHeaderCellDef>{{
                      'EMAIL_MESSAGES.SENT_DATE' | translate
                    }}</cdk-header-cell>
                    <cdk-cell *cdkCellDef="let row">{{ row.sentDate }}</cdk-cell>
                  </ng-container>
                  <cdk-header-row *cdkHeaderRowDef="queueColumns"></cdk-header-row>
                  <cdk-row *cdkRowDef="let row; columns: queueColumns"></cdk-row>
                </cdk-table>
              </div>
            </mat-tab>

            <!-- Tab: Failed -->
            <mat-tab [label]="'EMAIL_MESSAGES.FAILED_TAB' | translate">
              <div class="tab-content">
                <cdk-table [dataSource]="failed()" class="full-width">
                  <ng-container cdkColumnDef="id">
                    <cdk-header-cell *cdkHeaderCellDef>ID</cdk-header-cell>
                    <cdk-cell *cdkCellDef="let row">{{ row.id }}</cdk-cell>
                  </ng-container>
                  <ng-container cdkColumnDef="to">
                    <cdk-header-cell *cdkHeaderCellDef>{{
                      'EMAIL_MESSAGES.TO' | translate
                    }}</cdk-header-cell>
                    <cdk-cell *cdkCellDef="let row">{{ row.to }}</cdk-cell>
                  </ng-container>
                  <ng-container cdkColumnDef="subject">
                    <cdk-header-cell *cdkHeaderCellDef>{{
                      'EMAIL_MESSAGES.SUBJECT' | translate
                    }}</cdk-header-cell>
                    <cdk-cell *cdkCellDef="let row">{{ row.subject }}</cdk-cell>
                  </ng-container>
                  <ng-container cdkColumnDef="sentDate">
                    <cdk-header-cell *cdkHeaderCellDef>{{
                      'EMAIL_MESSAGES.SENT_DATE' | translate
                    }}</cdk-header-cell>
                    <cdk-cell *cdkCellDef="let row">{{ row.sentDate }}</cdk-cell>
                  </ng-container>
                  <cdk-header-row *cdkHeaderRowDef="queueColumns"></cdk-header-row>
                  <cdk-row *cdkRowDef="let row; columns: queueColumns"></cdk-row>
                </cdk-table>
              </div>
            </mat-tab>

            <!-- Tab: Config -->
            <mat-tab [label]="'EMAIL_MESSAGES.CONFIG_TAB' | translate">
              <div class="tab-content">
                <ion-item fill="outline" class="full-width">
                  <ion-label position="stacked">Configuration JSON</ion-label>
                  <ion-textarea rows="10" [(ngModel)]="configJson"></ion-textarea>
                </ion-item>
                <ion-button color="primary" (click)="saveConfig()">
                  {{ 'EMAIL_MESSAGES.SAVE_CONFIG' | translate }}
                </ion-button>
              </div>
            </mat-tab>
          </mat-tab-group>
        </ion-card-content>
      </ion-card>
    </div>
  `,
  styles: [
    `
      .container {
        padding: 16px;
      }
      .tab-content {
        padding: 16px 0;
        display: flex;
        flex-direction: column;
        gap: 16px;
      }
      .full-width {
        width: 100%;
      }
      .create-form {
        display: flex;
        flex-direction: column;
        gap: 8px;
        padding: 16px;
        border: 1px solid #e0e0e0;
        border-radius: 4px;
      }
    `,
  ],
})
export class EmailMessagesComponent implements OnInit {
  private defaultService = inject(DefaultService);
  private notifications = inject(NotificationService);

  activeTab = 0;
  messages = signal<EmailMessage[]>([]);
  pending = signal<EmailMessage[]>([]);
  sent = signal<EmailMessage[]>([]);
  failed = signal<EmailMessage[]>([]);
  configJson = '';

  showCreateForm = false;
  newTo = '';
  newSubject = '';
  newBody = '';

  msgColumns = ['id', 'to', 'subject', 'status', 'actions'];
  queueColumns = ['id', 'to', 'subject', 'sentDate'];

  ngOnInit(): void {
    this.loadMessages();
  }

  parseJson(raw: string): EmailMessage[] {
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [parsed];
    } catch {
      return [];
    }
  }

  onTabChange(index: number): void {
    this.activeTab = index;
    switch (index) {
      case 0:
        this.loadMessages();
        break;
      case 1:
        this.loadPending();
        break;
      case 2:
        this.loadSent();
        break;
      case 3:
        this.loadFailed();
        break;
      case 4:
        this.loadConfig();
        break;
    }
  }

  loadMessages(): void {
    this.defaultService.getEmail().subscribe({
      next: (raw) => this.messages.set(this.parseJson(raw as string)),
      error: () => this.messages.set([]),
    });
  }

  loadPending(): void {
    this.defaultService.getEmailPendingEmail().subscribe({
      next: (raw) => this.pending.set(this.parseJson(raw as string)),
      error: () => this.pending.set([]),
    });
  }

  loadSent(): void {
    this.defaultService.getEmailSentEmail().subscribe({
      next: (raw) => this.sent.set(this.parseJson(raw as string)),
      error: () => this.sent.set([]),
    });
  }

  loadFailed(): void {
    this.defaultService.getEmailFailedEmail().subscribe({
      next: (raw) => this.failed.set(this.parseJson(raw as string)),
      error: () => this.failed.set([]),
    });
  }

  loadConfig(): void {
    this.defaultService.getEmailConfiguration().subscribe({
      next: (raw) => {
        this.configJson = typeof raw === 'string' ? raw : JSON.stringify(raw, null, 2);
      },
      error: () => {
        this.configJson = '';
      },
    });
  }

  createMessage(): void {
    const body = { to: this.newTo, subject: this.newSubject, body: this.newBody };
    this.defaultService.postEmail(JSON.stringify(body)).subscribe({
      next: () => {
        this.notifications.success(SUCCESS_MSG);
        this.newTo = '';
        this.newSubject = '';
        this.newBody = '';
        this.showCreateForm = false;
        this.loadMessages();
      },
    });
  }

  deleteMessage(id: number): void {
    this.defaultService.deleteEmailResourceId(id).subscribe({
      next: () => {
        this.notifications.success(SUCCESS_MSG);
        this.loadMessages();
      },
    });
  }

  saveConfig(): void {
    let parsed: unknown;
    try {
      parsed = JSON.parse(this.configJson);
    } catch {
      this.notifications.error('Invalid JSON');
      return;
    }
    this.defaultService.putEmailConfiguration(JSON.stringify(parsed)).subscribe({
      next: () => {
        this.notifications.success(SUCCESS_MSG);
      },
    });
  }
}
