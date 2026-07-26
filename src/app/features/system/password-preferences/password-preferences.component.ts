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
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MatRadioModule } from '@angular/material/radio';
import { PasswordPreferencesService, GetPasswordPreferencesTemplateResponse } from '../../../api';
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonSpinner,
} from '@ionic/angular/standalone';

/**
 * Password preferences: select the active password-validation policy from the
 * available options and persist it via the password-preferences endpoint.
 */
@Component({
  selector: 'app-password-preferences',
  standalone: true,
  imports: [
    FormsModule,
    TranslateModule,
    MatRadioModule,
    IonButton,
    IonSpinner,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonCard,
  ],
  template: `
    <div class="form-container">
      <ion-card>
        <ion-card-header>
          <ion-card-title>{{ 'PASSWORD_PREFERENCES.TITLE' | translate }}</ion-card-title>
        </ion-card-header>

        <ion-card-content>
          <mat-radio-group class="policy-group" [(ngModel)]="selectedPolicyId">
            @for (policy of policies; track policy.id) {
              <mat-radio-button [value]="policy.id">
                {{ policy.description || policy.key }}
              </mat-radio-button>
            }
          </mat-radio-group>

          <div class="form-actions">
            <ion-button
              color="primary"
              type="button"
              [disabled]="selectedPolicyId === null || isSaving"
              (click)="onSave()"
            >
              @if (isSaving) {
                <ion-spinner name="crescent"></ion-spinner>
                {{ 'COMMON.SAVING' | translate }}
              } @else {
                {{ 'COMMON.SAVE' | translate }}
              }
            </ion-button>
          </div>
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
      .policy-group {
        display: flex;
        flex-direction: column;
        gap: 12px;
      }
    `,
  ],
})
export class PasswordPreferencesComponent implements OnInit {
  private readonly service = inject(PasswordPreferencesService);

  policies: GetPasswordPreferencesTemplateResponse[] = [];
  selectedPolicyId: number | null = null;
  isSaving = false;

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.service.getPasswordpreferences().subscribe((data) => {
      const list = Array.isArray(data)
        ? (data as GetPasswordPreferencesTemplateResponse[])
        : [data];
      this.policies = list;
      const active = this.policies.find((p) => p.active);
      this.selectedPolicyId = active?.id ?? this.policies[0]?.id ?? null;
    });
  }

  onSave(): void {
    if (this.selectedPolicyId === null) return;
    this.isSaving = true;
    this.service.putPasswordpreferences({ validationPolicyId: this.selectedPolicyId }).subscribe({
      next: () => (this.isSaving = false),
      error: () => (this.isSaving = false),
    });
  }
}
