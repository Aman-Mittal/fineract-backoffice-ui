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
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { TranslateModule } from '@ngx-translate/core';
import { DefaultService } from '../../../api';

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
    MatCardModule,
    MatTabsModule,
    MatTableModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
    TranslateModule,
  ],
  template: `
    <div class="container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>{{ 'EMAIL_MESSAGES.TITLE' | translate }}</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <mat-tab-group [(selectedIndex)]="activeTab" (selectedIndexChange)="onTabChange($event)">
            <!-- Tab: Messages -->
            <mat-tab [label]="'EMAIL_MESSAGES.MESSAGES_TAB' | translate">
              <div class="tab-content">
                <button
                  mat-raised-button
                  color="primary"
                  (click)="showCreateForm = !showCreateForm"
                >
                  {{ 'EMAIL_MESSAGES.CREATE' | translate }}
                </button>

                @if (showCreateForm) {
                  <div class="create-form">
                    <mat-form-field appearance="outline" class="full-width">
                      <mat-label>{{ 'EMAIL_MESSAGES.TO' | translate }}</mat-label>
                      <input matInput type="email" [(ngModel)]="newTo" />
                    </mat-form-field>
                    <mat-form-field appearance="outline" class="full-width">
                      <mat-label>{{ 'EMAIL_MESSAGES.SUBJECT' | translate }}</mat-label>
                      <input matInput [(ngModel)]="newSubject" />
                    </mat-form-field>
                    <mat-form-field appearance="outline" class="full-width">
                      <mat-label>{{ 'EMAIL_MESSAGES.BODY' | translate }}</mat-label>
                      <textarea matInput rows="4" [(ngModel)]="newBody"></textarea>
                    </mat-form-field>
                    <button mat-raised-button color="accent" (click)="createMessage()">
                      {{ 'EMAIL_MESSAGES.CREATE' | translate }}
                    </button>
                  </div>
                }

                <mat-table [dataSource]="messages()" class="full-width">
                  <ng-container matColumnDef="id">
                    <mat-header-cell *matHeaderCellDef>ID</mat-header-cell>
                    <mat-cell *matCellDef="let row">{{ row.id }}</mat-cell>
                  </ng-container>
                  <ng-container matColumnDef="to">
                    <mat-header-cell *matHeaderCellDef>{{
                      'EMAIL_MESSAGES.TO' | translate
                    }}</mat-header-cell>
                    <mat-cell *matCellDef="let row">{{ row.to }}</mat-cell>
                  </ng-container>
                  <ng-container matColumnDef="subject">
                    <mat-header-cell *matHeaderCellDef>{{
                      'EMAIL_MESSAGES.SUBJECT' | translate
                    }}</mat-header-cell>
                    <mat-cell *matCellDef="let row">{{ row.subject }}</mat-cell>
                  </ng-container>
                  <ng-container matColumnDef="status">
                    <mat-header-cell *matHeaderCellDef>Status</mat-header-cell>
                    <mat-cell *matCellDef="let row">{{ row.status }}</mat-cell>
                  </ng-container>
                  <ng-container matColumnDef="actions">
                    <mat-header-cell *matHeaderCellDef>Actions</mat-header-cell>
                    <mat-cell *matCellDef="let row">
                      <button
                        mat-icon-button
                        color="warn"
                        (click)="deleteMessage(row.id)"
                        [title]="'EMAIL_MESSAGES.DELETE' | translate"
                      >
                        &#x1F5D1;
                      </button>
                    </mat-cell>
                  </ng-container>
                  <mat-header-row *matHeaderRowDef="msgColumns"></mat-header-row>
                  <mat-row *matRowDef="let row; columns: msgColumns"></mat-row>
                </mat-table>
              </div>
            </mat-tab>

            <!-- Tab: Pending -->
            <mat-tab [label]="'EMAIL_MESSAGES.PENDING_TAB' | translate">
              <div class="tab-content">
                <mat-table [dataSource]="pending()" class="full-width">
                  <ng-container matColumnDef="id">
                    <mat-header-cell *matHeaderCellDef>ID</mat-header-cell>
                    <mat-cell *matCellDef="let row">{{ row.id }}</mat-cell>
                  </ng-container>
                  <ng-container matColumnDef="to">
                    <mat-header-cell *matHeaderCellDef>{{
                      'EMAIL_MESSAGES.TO' | translate
                    }}</mat-header-cell>
                    <mat-cell *matCellDef="let row">{{ row.to }}</mat-cell>
                  </ng-container>
                  <ng-container matColumnDef="subject">
                    <mat-header-cell *matHeaderCellDef>{{
                      'EMAIL_MESSAGES.SUBJECT' | translate
                    }}</mat-header-cell>
                    <mat-cell *matCellDef="let row">{{ row.subject }}</mat-cell>
                  </ng-container>
                  <ng-container matColumnDef="sentDate">
                    <mat-header-cell *matHeaderCellDef>{{
                      'EMAIL_MESSAGES.SENT_DATE' | translate
                    }}</mat-header-cell>
                    <mat-cell *matCellDef="let row">{{ row.sentDate }}</mat-cell>
                  </ng-container>
                  <mat-header-row *matHeaderRowDef="queueColumns"></mat-header-row>
                  <mat-row *matRowDef="let row; columns: queueColumns"></mat-row>
                </mat-table>
              </div>
            </mat-tab>

            <!-- Tab: Sent -->
            <mat-tab [label]="'EMAIL_MESSAGES.SENT_TAB' | translate">
              <div class="tab-content">
                <mat-table [dataSource]="sent()" class="full-width">
                  <ng-container matColumnDef="id">
                    <mat-header-cell *matHeaderCellDef>ID</mat-header-cell>
                    <mat-cell *matCellDef="let row">{{ row.id }}</mat-cell>
                  </ng-container>
                  <ng-container matColumnDef="to">
                    <mat-header-cell *matHeaderCellDef>{{
                      'EMAIL_MESSAGES.TO' | translate
                    }}</mat-header-cell>
                    <mat-cell *matCellDef="let row">{{ row.to }}</mat-cell>
                  </ng-container>
                  <ng-container matColumnDef="subject">
                    <mat-header-cell *matHeaderCellDef>{{
                      'EMAIL_MESSAGES.SUBJECT' | translate
                    }}</mat-header-cell>
                    <mat-cell *matCellDef="let row">{{ row.subject }}</mat-cell>
                  </ng-container>
                  <ng-container matColumnDef="sentDate">
                    <mat-header-cell *matHeaderCellDef>{{
                      'EMAIL_MESSAGES.SENT_DATE' | translate
                    }}</mat-header-cell>
                    <mat-cell *matCellDef="let row">{{ row.sentDate }}</mat-cell>
                  </ng-container>
                  <mat-header-row *matHeaderRowDef="queueColumns"></mat-header-row>
                  <mat-row *matRowDef="let row; columns: queueColumns"></mat-row>
                </mat-table>
              </div>
            </mat-tab>

            <!-- Tab: Failed -->
            <mat-tab [label]="'EMAIL_MESSAGES.FAILED_TAB' | translate">
              <div class="tab-content">
                <mat-table [dataSource]="failed()" class="full-width">
                  <ng-container matColumnDef="id">
                    <mat-header-cell *matHeaderCellDef>ID</mat-header-cell>
                    <mat-cell *matCellDef="let row">{{ row.id }}</mat-cell>
                  </ng-container>
                  <ng-container matColumnDef="to">
                    <mat-header-cell *matHeaderCellDef>{{
                      'EMAIL_MESSAGES.TO' | translate
                    }}</mat-header-cell>
                    <mat-cell *matCellDef="let row">{{ row.to }}</mat-cell>
                  </ng-container>
                  <ng-container matColumnDef="subject">
                    <mat-header-cell *matHeaderCellDef>{{
                      'EMAIL_MESSAGES.SUBJECT' | translate
                    }}</mat-header-cell>
                    <mat-cell *matCellDef="let row">{{ row.subject }}</mat-cell>
                  </ng-container>
                  <ng-container matColumnDef="sentDate">
                    <mat-header-cell *matHeaderCellDef>{{
                      'EMAIL_MESSAGES.SENT_DATE' | translate
                    }}</mat-header-cell>
                    <mat-cell *matCellDef="let row">{{ row.sentDate }}</mat-cell>
                  </ng-container>
                  <mat-header-row *matHeaderRowDef="queueColumns"></mat-header-row>
                  <mat-row *matRowDef="let row; columns: queueColumns"></mat-row>
                </mat-table>
              </div>
            </mat-tab>

            <!-- Tab: Config -->
            <mat-tab [label]="'EMAIL_MESSAGES.CONFIG_TAB' | translate">
              <div class="tab-content">
                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>Configuration JSON</mat-label>
                  <textarea matInput rows="10" [(ngModel)]="configJson"></textarea>
                </mat-form-field>
                <button mat-raised-button color="primary" (click)="saveConfig()">
                  {{ 'EMAIL_MESSAGES.SAVE_CONFIG' | translate }}
                </button>
              </div>
            </mat-tab>
          </mat-tab-group>
        </mat-card-content>
      </mat-card>
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
  private snackBar = inject(MatSnackBar);

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
        this.snackBar.open(SUCCESS_MSG, undefined, { duration: 3000 });
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
        this.snackBar.open(SUCCESS_MSG, undefined, { duration: 3000 });
        this.loadMessages();
      },
    });
  }

  saveConfig(): void {
    let parsed: unknown;
    try {
      parsed = JSON.parse(this.configJson);
    } catch {
      this.snackBar.open('Invalid JSON', undefined, { duration: 3000 });
      return;
    }
    this.defaultService.putEmailConfiguration(JSON.stringify(parsed)).subscribe({
      next: () => {
        this.snackBar.open(SUCCESS_MSG, undefined, { duration: 3000 });
      },
    });
  }
}
