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
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SMSService, SmsCreationRequest, SmsUpdateRequest } from '../../../api';

/**
 * Create / edit form for an individual SMS message. The Fineract create endpoint accepts
 * message + optional recipient ids; mobileNo is captured for display/targeting context.
 */
@Component({
  selector: 'app-sms-form',
  standalone: true,
  imports: [
    FormsModule,
    TranslateModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
  ],
  template: `
    <div class="form-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>
            {{ isEditMode ? ('SMS.EDIT' | translate) : ('SMS.CREATE' | translate) }}
          </mat-card-title>
        </mat-card-header>

        <mat-card-content>
          <form #smsForm="ngForm" (ngSubmit)="onSubmit()" class="entity-form">
            <mat-form-field appearance="outline">
              <mat-label>{{ 'SMS.MESSAGE' | translate }}</mat-label>
              <textarea matInput name="message" [(ngModel)]="message" required></textarea>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>{{ 'SMS.MOBILE_NO' | translate }}</mat-label>
              <input matInput name="mobileNo" [(ngModel)]="mobileNo" [disabled]="isEditMode" />
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>{{ 'SMS.CLIENT_ID' | translate }}</mat-label>
              <input
                matInput
                type="number"
                name="clientId"
                [(ngModel)]="clientId"
                [disabled]="isEditMode"
              />
            </mat-form-field>

            <div class="form-actions">
              <button mat-button type="button" (click)="onCancel()" [disabled]="isSaving">
                {{ 'COMMON.CANCEL' | translate }}
              </button>
              <button
                mat-raised-button
                color="primary"
                type="submit"
                [disabled]="smsForm.invalid || isSaving"
              >
                @if (isSaving) {
                  <mat-spinner
                    diameter="20"
                    style="margin-right: 8px; display: inline-block; vertical-align: middle;"
                  ></mat-spinner>
                  {{ 'COMMON.SAVING' | translate }}
                } @else {
                  {{ 'COMMON.SAVE' | translate }}
                }
              </button>
            </div>
          </form>
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
      .entity-form {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }
    `,
  ],
})
export class SmsFormComponent implements OnInit {
  private readonly smsService = inject(SMSService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  private readonly LIST_PATH = '/system/sms';

  smsId: number | null = null;
  isEditMode = false;
  isSaving = false;

  message = '';
  mobileNo: string | undefined;
  clientId: number | undefined;

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.smsId = +id;
        this.isEditMode = true;
        this.load();
      }
    });
  }

  load(): void {
    if (!this.smsId) return;
    this.smsService.getSmsResourceId(this.smsId).subscribe((data) => {
      this.message = data.message ?? '';
      this.mobileNo = data.mobileNo;
      this.clientId = data.clientId;
    });
  }

  onSubmit(): void {
    this.isSaving = true;
    let request$;
    if (this.isEditMode && this.smsId) {
      const update: SmsUpdateRequest = { message: this.message };
      request$ = this.smsService.putSmsResourceId(this.smsId, update);
    } else {
      const create: SmsCreationRequest = { message: this.message, clientId: this.clientId };
      request$ = this.smsService.postSms(create);
    }

    request$.subscribe({
      next: () => this.router.navigate([this.LIST_PATH]),
      error: () => (this.isSaving = false),
    });
  }

  onCancel(): void {
    this.router.navigate([this.LIST_PATH]);
  }
}
