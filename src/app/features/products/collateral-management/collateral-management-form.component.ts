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
  CollateralManagementService,
  CollateralProductCreateRequest,
  CurrencyData,
} from '../../../api';

/**
 * Create / edit form for a collateral product master-data record.
 * Currency options come from the collateral-management template endpoint.
 */
@Component({
  selector: 'app-collateral-management-form',
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
                ? ('COLLATERAL_MANAGEMENT.EDIT' | translate)
                : ('COLLATERAL_MANAGEMENT.CREATE' | translate)
            }}
          </ion-card-title>
        </ion-card-header>

        <ion-card-content>
          <form #collateralForm="ngForm" (ngSubmit)="onSubmit()" class="collateral-form">
            <ion-item fill="outline">
              <ion-label position="stacked">{{
                'COLLATERAL_MANAGEMENT.NAME' | translate
              }}</ion-label>
              <ion-input
                [attr.aria-label]="'COLLATERAL_MANAGEMENT.NAME' | translate"
                name="name"
                [(ngModel)]="collateral.name"
                required
              ></ion-input>
            </ion-item>

            <ion-item fill="outline">
              <ion-label position="stacked">{{
                'COLLATERAL_MANAGEMENT.QUALITY' | translate
              }}</ion-label>
              <ion-input
                [attr.aria-label]="'COLLATERAL_MANAGEMENT.QUALITY' | translate"
                name="quality"
                [(ngModel)]="collateral.quality"
                required
              ></ion-input>
            </ion-item>

            <ion-item fill="outline">
              <ion-label position="stacked">{{
                'COLLATERAL_MANAGEMENT.UNIT_TYPE' | translate
              }}</ion-label>
              <ion-input
                [attr.aria-label]="'COLLATERAL_MANAGEMENT.UNIT_TYPE' | translate"
                name="unitType"
                [(ngModel)]="collateral.unitType"
                required
              ></ion-input>
            </ion-item>

            <ion-item fill="outline">
              <ion-label position="stacked">{{
                'COLLATERAL_MANAGEMENT.BASE_PRICE' | translate
              }}</ion-label>
              <ion-input
                [attr.aria-label]="'COLLATERAL_MANAGEMENT.BASE_PRICE' | translate"
                type="number"
                name="basePrice"
                [(ngModel)]="collateral.basePrice"
                required
              ></ion-input>
            </ion-item>

            <ion-item fill="outline">
              <ion-label position="stacked">{{
                'COLLATERAL_MANAGEMENT.PCT_TO_BASE' | translate
              }}</ion-label>
              <ion-input
                [attr.aria-label]="'COLLATERAL_MANAGEMENT.PCT_TO_BASE' | translate"
                type="number"
                name="pctToBase"
                [(ngModel)]="collateral.pctToBase"
                required
              ></ion-input>
            </ion-item>

            <ion-item fill="outline">
              <ion-label position="stacked">{{
                'COLLATERAL_MANAGEMENT.CURRENCY' | translate
              }}</ion-label>
              <ion-select
                [attr.aria-label]="'COLLATERAL_MANAGEMENT.CURRENCY' | translate"
                interface="popover"
                name="currency"
                [(ngModel)]="collateral.currency"
                required
              >
                @for (opt of currencyOptions; track opt.code) {
                  <ion-select-option [value]="opt.code"
                    >{{ opt.name }} ({{ opt.code }})</ion-select-option
                  >
                }
              </ion-select>
            </ion-item>

            <div class="form-actions">
              <ion-button fill="clear" type="button" (click)="onCancel()" [disabled]="isSaving">
                {{ 'COMMON.CANCEL' | translate }}
              </ion-button>
              <ion-button
                color="primary"
                type="submit"
                [disabled]="collateralForm.invalid || isSaving"
              >
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
      .collateral-form {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }
    `,
  ],
})
export class CollateralManagementFormComponent implements OnInit {
  private readonly collateralService = inject(CollateralManagementService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  private readonly LIST_PATH = '/products/collateral-management';

  collateralId: number | null = null;
  isEditMode = false;
  isSaving = false;

  collateral: CollateralProductCreateRequest = {
    name: '',
    quality: '',
    unitType: '',
    basePrice: 0,
    pctToBase: 0,
    currency: '',
    locale: 'en',
  };
  currencyOptions: CurrencyData[] = [];

  ngOnInit(): void {
    this.collateralService.getCollateralManagementTemplate().subscribe((currencies) => {
      this.currencyOptions = currencies ?? [];
    });

    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.collateralId = +id;
        this.isEditMode = true;
        this.load();
      }
    });
  }

  load(): void {
    if (!this.collateralId) return;
    this.collateralService
      .getCollateralManagementCollateralId(this.collateralId)
      .subscribe((data) => {
        this.collateral = {
          name: data.name ?? '',
          quality: data.quality ?? '',
          unitType: data.unitType ?? '',
          basePrice: data.basePrice ?? 0,
          pctToBase: data.pctToBase ?? 0,
          currency: data.currency ?? '',
          locale: 'en',
        };
      });
  }

  onSubmit(): void {
    this.isSaving = true;
    const request$ =
      this.isEditMode && this.collateralId
        ? this.collateralService.putCollateralManagementCollateralId(
            this.collateralId,
            this.collateral,
          )
        : this.collateralService.postCollateralManagement(this.collateral);

    request$.subscribe({
      next: () => this.router.navigate([this.LIST_PATH]),
      error: () => (this.isSaving = false),
    });
  }

  onCancel(): void {
    this.router.navigate([this.LIST_PATH]);
  }
}
