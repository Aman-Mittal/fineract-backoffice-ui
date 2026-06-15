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
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { PaymentTypeService, PaymentTypeCreateRequest } from '../../../api';

/**
 * Create / edit form for a payment type.
 */
@Component({
  selector: 'app-payment-type-form',
  standalone: true,
  imports: [
    FormsModule,
    TranslateModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatButtonModule,
    MatProgressSpinnerModule,
  ],
  template: `
    <div class="form-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>
            {{
              isEditMode ? ('PAYMENT_TYPES.EDIT' | translate) : ('PAYMENT_TYPES.CREATE' | translate)
            }}
          </mat-card-title>
        </mat-card-header>

        <mat-card-content>
          <form #ptForm="ngForm" (ngSubmit)="onSubmit()" class="pt-form">
            <mat-form-field appearance="outline">
              <mat-label>{{ 'PAYMENT_TYPES.NAME' | translate }}</mat-label>
              <input matInput name="name" [(ngModel)]="paymentType.name" required />
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>{{ 'COMMON.DESCRIPTION' | translate }}</mat-label>
              <input matInput name="description" [(ngModel)]="paymentType.description" />
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>{{ 'PAYMENT_TYPES.POSITION' | translate }}</mat-label>
              <input matInput type="number" name="position" [(ngModel)]="paymentType.position" />
            </mat-form-field>

            <mat-checkbox name="isCashPayment" [(ngModel)]="paymentType.isCashPayment">
              {{ 'PAYMENT_TYPES.IS_CASH' | translate }}
            </mat-checkbox>

            <div class="form-actions">
              <button mat-button type="button" (click)="onCancel()" [disabled]="isSaving">
                {{ 'COMMON.CANCEL' | translate }}
              </button>
              <button
                mat-raised-button
                color="primary"
                type="submit"
                [disabled]="ptForm.invalid || isSaving"
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
      .pt-form {
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
export class PaymentTypeFormComponent implements OnInit {
  private readonly paymentTypeService = inject(PaymentTypeService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  private readonly LIST_PATH = '/organization/payment-types';

  paymentTypeId: number | null = null;
  isEditMode = false;
  isSaving = false;

  paymentType: PaymentTypeCreateRequest = {
    name: '',
    description: '',
    position: undefined,
    isCashPayment: false,
    isSystemDefined: false,
  };

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.paymentTypeId = +id;
        this.isEditMode = true;
        this.load();
      }
    });
  }

  load(): void {
    if (!this.paymentTypeId) return;
    this.paymentTypeService.getPaymenttypesPaymentTypeId(this.paymentTypeId).subscribe((data) => {
      this.paymentType = {
        name: data.name ?? '',
        description: data.description,
        position: data.position,
        isCashPayment: data.isCashPayment,
        isSystemDefined: data.isSystemDefined ?? false,
      };
    });
  }

  onSubmit(): void {
    this.isSaving = true;
    const request$ =
      this.isEditMode && this.paymentTypeId
        ? this.paymentTypeService.putPaymenttypesPaymentTypeId(this.paymentTypeId, this.paymentType)
        : this.paymentTypeService.postPaymenttypes(this.paymentType);

    request$.subscribe({
      next: () => this.router.navigate([this.LIST_PATH]),
      error: () => (this.isSaving = false),
    });
  }

  onCancel(): void {
    this.router.navigate([this.LIST_PATH]);
  }
}
