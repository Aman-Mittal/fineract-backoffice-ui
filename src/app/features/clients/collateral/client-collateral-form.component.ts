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
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {
  ClientCollateralManagementService,
  ClientCollateralCreateRequest,
  LoanCollateralTemplateData,
} from '../../../api';
import { FINERACT_LOCALE } from '../../../core/utils/date-formatter';

/**
 * Create / edit form for a client collateral. The selectable collateral product
 * options come from the collateral template endpoint; core fields are the collateral
 * (product) id and quantity. Editing only updates the quantity.
 */
@Component({
  selector: 'app-client-collateral-form',
  standalone: true,
  imports: [
    FormsModule,
    TranslateModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatProgressSpinnerModule,
  ],
  template: `
    <div class="form-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>
            {{
              isEditMode
                ? ('CLIENT_COLLATERAL.EDIT' | translate)
                : ('CLIENT_COLLATERAL.CREATE' | translate)
            }}
          </mat-card-title>
        </mat-card-header>

        <mat-card-content>
          <form #collateralForm="ngForm" (ngSubmit)="onSubmit()" class="collateral-form">
            <mat-form-field appearance="outline">
              <mat-label>{{ 'CLIENT_COLLATERAL.PRODUCT' | translate }}</mat-label>
              <mat-select
                name="collateralId"
                [(ngModel)]="collateral.collateralId"
                [disabled]="isEditMode"
                required
              >
                @for (opt of collateralProductOptions; track opt.collateralId) {
                  <mat-option [value]="opt.collateralId">{{ opt.name }}</mat-option>
                }
              </mat-select>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>{{ 'CLIENT_COLLATERAL.QUANTITY' | translate }}</mat-label>
              <input
                matInput
                type="number"
                name="quantity"
                [(ngModel)]="collateral.quantity"
                required
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
                [disabled]="collateralForm.invalid || isSaving"
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
      .collateral-form {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }
      mat-form-field {
        width: 100%;
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
export class ClientCollateralFormComponent implements OnInit {
  private readonly collateralService = inject(ClientCollateralManagementService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  clientId!: number;
  collateralId: number | null = null;
  isEditMode = false;
  isSaving = false;

  collateral: ClientCollateralCreateRequest = {};
  collateralProductOptions: LoanCollateralTemplateData[] = [];

  ngOnInit(): void {
    this.clientId = Number(this.route.snapshot.paramMap.get('clientId'));

    this.collateralService.getClientsClientIdCollateralsTemplate(this.clientId).subscribe((tpl) => {
      this.collateralProductOptions = tpl ?? [];
    });

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.collateralId = +id;
      this.isEditMode = true;
      this.load();
    }
  }

  load(): void {
    if (!this.collateralId) return;
    this.collateralService
      .getClientsClientIdCollateralsClientCollateralId(this.clientId, this.collateralId)
      .subscribe((data) => {
        this.collateral = {
          collateralId: data.id,
          quantity: data.quantity,
        };
      });
  }

  onSubmit(): void {
    this.isSaving = true;
    const request$ =
      this.isEditMode && this.collateralId
        ? this.collateralService.putClientsClientIdCollateralsCollateralId(
            this.clientId,
            this.collateralId,
            { quantity: this.collateral.quantity, locale: FINERACT_LOCALE },
          )
        : this.collateralService.postClientsClientIdCollaterals(this.clientId, {
            collateralId: this.collateral.collateralId,
            quantity: this.collateral.quantity,
            locale: FINERACT_LOCALE,
          });

    request$.subscribe({
      next: () => this.router.navigate(['/clients', this.clientId, 'collaterals']),
      error: () => (this.isSaving = false),
    });
  }

  onCancel(): void {
    this.router.navigate(['/clients', this.clientId, 'collaterals']);
  }
}
