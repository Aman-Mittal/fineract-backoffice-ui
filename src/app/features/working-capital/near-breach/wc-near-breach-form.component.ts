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
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonInput,
  IonItem,
  IonLabel,
  IonSelect,
  IonSelectOption,
  IonSpinner,
} from '@ionic/angular/standalone';
import {
  WorkingCapitalNearBreachService,
  WorkingCapitalNearBreachRequest,
  WorkingCapitalBreachService,
  StringEnumOptionData,
} from '../../../api';

/**
 * Create / edit form for a working-capital near-breach (early-warning) threshold.
 */
@Component({
  selector: 'app-wc-near-breach-form',
  standalone: true,
  imports: [
    FormsModule,
    TranslateModule,
    IonButton,
    IonSpinner,
    IonInput,
    IonItem,
    IonLabel,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonCard,
    IonSelectOption,
    IonSelect,
  ],
  template: `
    <div class="form-container">
      <ion-card>
        <ion-card-header>
          <ion-card-title>
            {{
              isEditMode
                ? ('WC_NEAR_BREACH.EDIT' | translate)
                : ('WC_NEAR_BREACH.CREATE' | translate)
            }}
          </ion-card-title>
        </ion-card-header>

        <ion-card-content>
          <form #nbForm="ngForm" (ngSubmit)="onSubmit()" class="wc-form">
            <ion-item fill="outline">
              <ion-label position="stacked">{{ 'WC_NEAR_BREACH.NAME' | translate }}</ion-label>
              <ion-input
                [attr.aria-label]="'WC_NEAR_BREACH.NAME' | translate"
                name="name"
                [(ngModel)]="item.nearBreachName"
                required
              ></ion-input>
            </ion-item>

            <ion-item fill="outline">
              <ion-label position="stacked">{{ 'WC_NEAR_BREACH.THRESHOLD' | translate }}</ion-label>
              <ion-input
                [attr.aria-label]="'WC_NEAR_BREACH.THRESHOLD' | translate"
                type="number"
                name="threshold"
                [(ngModel)]="item.nearBreachThreshold"
              ></ion-input>
            </ion-item>

            <ion-item fill="outline">
              <ion-label position="stacked">{{ 'WC_NEAR_BREACH.FREQUENCY' | translate }}</ion-label>
              <ion-input
                [attr.aria-label]="'WC_NEAR_BREACH.FREQUENCY' | translate"
                type="number"
                name="frequency"
                [(ngModel)]="item.nearBreachFrequency"
              ></ion-input>
            </ion-item>

            <ion-item fill="outline">
              <ion-label position="stacked">{{
                'WC_NEAR_BREACH.FREQUENCY_TYPE' | translate
              }}</ion-label>
              <ion-select
                [attr.aria-label]="'WC_NEAR_BREACH.FREQUENCY_TYPE' | translate"
                interface="popover"
                name="frequencyType"
                [(ngModel)]="item.nearBreachFrequencyType"
              >
                @for (opt of frequencyTypeOptions; track opt.id) {
                  <ion-select-option [value]="opt.code">{{ opt.value }}</ion-select-option>
                }
              </ion-select>
            </ion-item>

            <div class="form-actions">
              <ion-button fill="clear" type="button" (click)="onCancel()" [disabled]="isSaving">
                {{ 'COMMON.CANCEL' | translate }}
              </ion-button>
              <ion-button color="primary" type="submit" [disabled]="nbForm.invalid || isSaving">
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
      .wc-form {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }
    `,
  ],
})
export class WcNearBreachFormComponent implements OnInit {
  private readonly service = inject(WorkingCapitalNearBreachService);
  private readonly breachService = inject(WorkingCapitalBreachService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  private readonly LIST_PATH = '/working-capital/near-breach';

  itemId: number | null = null;
  isEditMode = false;
  isSaving = false;

  item: WorkingCapitalNearBreachRequest = { nearBreachName: '' };
  frequencyTypeOptions: StringEnumOptionData[] = [];

  ngOnInit(): void {
    this.breachService.getWorkingCapitalBreachTemplate().subscribe((tpl) => {
      this.frequencyTypeOptions = tpl.breachFrequencyTypeOptions ?? [];
    });

    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.itemId = +id;
        this.isEditMode = true;
        this.load();
      }
    });
  }

  load(): void {
    if (!this.itemId) return;
    this.service.getWorkingCapitalNearBreachBreachId(this.itemId).subscribe((data) => {
      this.item = {
        nearBreachName: data.name,
        nearBreachThreshold: data.threshold,
        nearBreachFrequency: data.frequency,
        nearBreachFrequencyType: data.frequencyType?.code,
      };
    });
  }

  onSubmit(): void {
    this.isSaving = true;
    const request$ =
      this.isEditMode && this.itemId
        ? this.service.putWorkingCapitalNearBreachBreachId(this.itemId, this.item)
        : this.service.postWorkingCapitalNearBreach(this.item);

    request$.subscribe({
      next: () => this.router.navigate([this.LIST_PATH]),
      error: () => (this.isSaving = false),
    });
  }

  onCancel(): void {
    this.router.navigate([this.LIST_PATH]);
  }
}
