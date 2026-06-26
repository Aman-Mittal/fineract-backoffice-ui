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
import { ClientChargesService, PostClientsClientIdChargesRequest, ChargeData } from '../../../api';
import {
  formatDateToFineract,
  FINERACT_DATE_FORMAT,
  FINERACT_LOCALE,
} from '../../../core/utils/date-formatter';

/**
 * Create form for a client charge. The selectable charge definitions come from the
 * client charges template endpoint (`chargeOptions`); core fields are the charge id,
 * amount and due date.
 */
@Component({
  selector: 'app-client-charge-form',
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
          <mat-card-title>{{ 'CLIENT_CHARGES.CREATE' | translate }}</mat-card-title>
        </mat-card-header>

        <mat-card-content>
          <form #chargeForm="ngForm" (ngSubmit)="onSubmit()" class="charge-form">
            <mat-form-field appearance="outline">
              <mat-label>{{ 'CLIENT_CHARGES.CHARGE' | translate }}</mat-label>
              <mat-select name="chargeId" [(ngModel)]="charge.chargeId" required>
                @for (opt of chargeOptions; track opt.id) {
                  <mat-option [value]="opt.id">{{ opt.name }}</mat-option>
                }
              </mat-select>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>{{ 'CLIENT_CHARGES.AMOUNT' | translate }}</mat-label>
              <input matInput type="number" name="amount" [(ngModel)]="charge.amount" required />
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>{{ 'CLIENT_CHARGES.DUE_DATE' | translate }}</mat-label>
              <input matInput type="date" name="dueDate" [(ngModel)]="dueDate" required />
            </mat-form-field>

            <div class="form-actions">
              <button mat-button type="button" (click)="onCancel()" [disabled]="isSaving">
                {{ 'COMMON.CANCEL' | translate }}
              </button>
              <button
                mat-raised-button
                color="primary"
                type="submit"
                [disabled]="chargeForm.invalid || isSaving"
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
      .charge-form {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }
    `,
  ],
})
export class ClientChargeFormComponent implements OnInit {
  private readonly clientChargesService = inject(ClientChargesService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  clientId!: number;
  isSaving = false;

  charge: PostClientsClientIdChargesRequest = {};
  dueDate: string | null = null;
  chargeOptions: ChargeData[] = [];

  ngOnInit(): void {
    this.clientId = Number(this.route.snapshot.paramMap.get('clientId'));

    this.clientChargesService.getClientsClientIdChargesTemplate(this.clientId).subscribe((tpl) => {
      const template = tpl as unknown as { chargeOptions?: ChargeData[] };
      this.chargeOptions = template.chargeOptions ?? [];
    });
  }

  onSubmit(): void {
    this.isSaving = true;
    const request: PostClientsClientIdChargesRequest = {
      chargeId: this.charge.chargeId,
      amount: this.charge.amount,
      dueDate: formatDateToFineract(this.dueDate),
      dateFormat: FINERACT_DATE_FORMAT,
      locale: FINERACT_LOCALE,
    };

    this.clientChargesService.postClientsClientIdCharges(this.clientId, request).subscribe({
      next: () => this.router.navigate(['/clients', this.clientId, 'charges']),
      error: () => (this.isSaving = false),
    });
  }

  onCancel(): void {
    this.router.navigate(['/clients', this.clientId, 'charges']);
  }
}
