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

import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
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
import {
  MixMappingService,
  MixTaxonomyMappingData,
  MixTaxonomyMappingUpdateRequest,
} from '../../../api';

/**
 * Configuration screen for the MIX XBRL taxonomy -> general-ledger mapping.
 * Loads the current mapping config, lets the user edit it, and saves it back.
 */
@Component({
  selector: 'app-mix-mapping',
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
          <ion-card-title>{{ 'MIX_MAPPING.TITLE' | translate }}</ion-card-title>
        </ion-card-header>

        <ion-card-content>
          <form #mappingForm="ngForm" (ngSubmit)="onSubmit()" class="mix-form">
            <ion-item fill="outline">
              <ion-label position="stacked">{{ 'MIX_MAPPING.IDENTIFIER' | translate }}</ion-label>
              <ion-input
                [attr.aria-label]="'MIX_MAPPING.IDENTIFIER' | translate"
                name="identifier"
                [(ngModel)]="mapping().identifier"
              ></ion-input>
            </ion-item>

            <ion-item fill="outline">
              <ion-label position="stacked">{{ 'MIX_MAPPING.CURRENCY' | translate }}</ion-label>
              <ion-input
                [attr.aria-label]="'MIX_MAPPING.CURRENCY' | translate"
                name="currency"
                [(ngModel)]="mapping().currency"
              ></ion-input>
            </ion-item>

            <ion-item fill="outline">
              <ion-label position="stacked">{{ 'MIX_MAPPING.CONFIG' | translate }}</ion-label>
              <ion-textarea
                [attr.aria-label]="'MIX_MAPPING.CONFIG' | translate"
                rows="10"
                name="config"
                [(ngModel)]="mapping().config"
              ></ion-textarea>
            </ion-item>

            <div class="form-actions">
              <ion-button
                color="primary"
                type="submit"
                [disabled]="mappingForm.invalid || isSaving()"
              >
                @if (isSaving()) {
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
        max-width: 700px;
        margin: 0 auto;
      }
      .mix-form {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }
    `,
  ],
})
export class MixMappingComponent implements OnInit {
  private readonly mappingService = inject(MixMappingService);

  readonly isSaving = signal(false);
  readonly mapping = signal<MixTaxonomyMappingData>({});

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.mappingService.getMixmapping().subscribe({
      next: (data: MixTaxonomyMappingData) => {
        this.mapping.set(data || {});
      },
      error: (err: unknown) => console.error('Failed to load MIX mapping', err),
    });
  }

  onSubmit(): void {
    this.isSaving.set(true);
    const request: MixTaxonomyMappingUpdateRequest = {
      identifier: this.mapping().identifier,
      currency: this.mapping().currency,
      config: this.mapping().config,
    };
    this.mappingService.putMixmapping(request).subscribe({
      next: () => this.isSaving.set(false),
      error: () => this.isSaving.set(false),
    });
  }
}
