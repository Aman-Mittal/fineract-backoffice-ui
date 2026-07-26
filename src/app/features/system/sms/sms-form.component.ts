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
import { SMSService, SmsCreationRequest, SmsUpdateRequest } from '../../../api';
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonInput,
  IonItem,
  IonLabel,
  IonSpinner,
  IonTextarea,
} from '@ionic/angular/standalone';

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
    IonButton,
    IonSpinner,
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
    <div class="form-container">
      <ion-card>
        <ion-card-header>
          <ion-card-title>
            {{ isEditMode ? ('SMS.EDIT' | translate) : ('SMS.CREATE' | translate) }}
          </ion-card-title>
        </ion-card-header>

        <ion-card-content>
          <form #smsForm="ngForm" (ngSubmit)="onSubmit()" class="entity-form">
            <ion-item fill="outline">
              <ion-label position="stacked">{{ 'SMS.MESSAGE' | translate }}</ion-label>
              <ion-textarea name="message" [(ngModel)]="message" required></ion-textarea>
            </ion-item>

            <ion-item fill="outline">
              <ion-label position="stacked">{{ 'SMS.MOBILE_NO' | translate }}</ion-label>
              <ion-input name="mobileNo" [(ngModel)]="mobileNo" [disabled]="isEditMode"></ion-input>
            </ion-item>

            <ion-item fill="outline">
              <ion-label position="stacked">{{ 'SMS.CLIENT_ID' | translate }}</ion-label>
              <ion-input
                type="number"
                name="clientId"
                [(ngModel)]="clientId"
                [disabled]="isEditMode"
              ></ion-input>
            </ion-item>

            <div class="form-actions">
              <ion-button fill="clear" type="button" (click)="onCancel()" [disabled]="isSaving">
                {{ 'COMMON.CANCEL' | translate }}
              </ion-button>
              <ion-button color="primary" type="submit" [disabled]="smsForm.invalid || isSaving">
                @if (isSaving) {
                  <ion-spinner name="crescent"></ion-spinner>
                  {{ 'COMMON.SAVING' | translate }}
                } @else {
                  {{ 'COMMON.SAVE' | translate }}
                }
              </ion-button>
            </div>
          </form>
        </ion-card-content>
      </ion-card>
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
