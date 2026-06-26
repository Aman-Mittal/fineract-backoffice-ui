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
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TaxComponentsService, PostTaxesComponentsRequest } from '../../../api';
import {
  formatDateToFineract,
  FINERACT_DATE_FORMAT,
  FINERACT_LOCALE,
} from '../../../core/utils/date-formatter';

/**
 * Create / edit form for a tax component (name, percentage, start date).
 */
@Component({
  selector: 'app-tax-component-form',
  standalone: true,
  imports: [
    FormsModule,
    TranslateModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatProgressSpinnerModule,
  ],
  template: `
    <div class="form-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>
            {{
              isEditMode
                ? ('TAX_COMPONENTS.EDIT' | translate)
                : ('TAX_COMPONENTS.CREATE' | translate)
            }}
          </mat-card-title>
        </mat-card-header>

        <mat-card-content>
          <form #tcForm="ngForm" (ngSubmit)="onSubmit()" class="tc-form">
            <mat-form-field appearance="outline">
              <mat-label>{{ 'TAX_COMPONENTS.NAME' | translate }}</mat-label>
              <input matInput name="name" [(ngModel)]="component.name" required />
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>{{ 'TAX_COMPONENTS.PERCENTAGE' | translate }}</mat-label>
              <input
                matInput
                type="number"
                name="percentage"
                [(ngModel)]="component.percentage"
                required
              />
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>{{ 'TAX_COMPONENTS.START_DATE' | translate }}</mat-label>
              <input
                matInput
                [matDatepicker]="picker"
                name="startDate"
                [(ngModel)]="startDate"
                [disabled]="isEditMode"
              />
              <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
              <mat-datepicker #picker></mat-datepicker>
            </mat-form-field>

            <div class="form-actions">
              <button mat-button type="button" (click)="onCancel()" [disabled]="isSaving">
                {{ 'COMMON.CANCEL' | translate }}
              </button>
              <button
                mat-raised-button
                color="primary"
                type="submit"
                [disabled]="tcForm.invalid || isSaving"
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
      .tc-form {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }
    `,
  ],
})
export class TaxComponentFormComponent implements OnInit {
  private readonly taxComponentsService = inject(TaxComponentsService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  private readonly LIST_PATH = '/products/tax-components';

  componentId: number | null = null;
  isEditMode = false;
  isSaving = false;

  component: PostTaxesComponentsRequest = { name: '', percentage: undefined };
  startDate: Date = new Date();

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.componentId = +id;
        this.isEditMode = true;
        this.load();
      }
    });
  }

  load(): void {
    if (!this.componentId) return;
    this.taxComponentsService
      .getTaxesComponentTaxComponentId(this.componentId)
      .subscribe((data) => {
        this.component = { name: data.name, percentage: data.percentage };
        const arr = data.startDate as unknown as number[];
        if (Array.isArray(arr) && arr.length >= 3) {
          this.startDate = new Date(arr[0], arr[1] - 1, arr[2]);
        }
      });
  }

  onSubmit(): void {
    this.isSaving = true;
    // Start date is immutable once set on the server, so only send it on create.
    const payload: PostTaxesComponentsRequest = {
      ...this.component,
      dateFormat: FINERACT_DATE_FORMAT,
      locale: FINERACT_LOCALE,
    };
    if (!this.isEditMode) {
      payload.startDate = formatDateToFineract(this.startDate);
    }

    const request$ =
      this.isEditMode && this.componentId
        ? this.taxComponentsService.putTaxesComponentTaxComponentId(this.componentId, payload)
        : this.taxComponentsService.postTaxesComponent(payload);

    request$.subscribe({
      next: () => this.router.navigate([this.LIST_PATH]),
      error: () => (this.isSaving = false),
    });
  }

  onCancel(): void {
    this.router.navigate([this.LIST_PATH]);
  }
}
