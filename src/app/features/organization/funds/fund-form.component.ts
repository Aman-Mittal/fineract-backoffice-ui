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
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FundsService, FundRequest } from '../../../api';

/**
 * Create / edit form for an organization fund. A fund has just a name and an
 * optional external id (Fineract does not expose a delete endpoint for funds).
 */
@Component({
  selector: 'app-fund-form',
  standalone: true,
  imports: [
    FormsModule,
    TranslateModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
  ],
  template: `
    <div class="form-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>
            {{ isEditMode ? ('FUNDS.EDIT_FUND' | translate) : ('FUNDS.CREATE_FUND' | translate) }}
          </mat-card-title>
        </mat-card-header>

        <mat-card-content>
          <form #fundForm="ngForm" (ngSubmit)="onSubmit()" class="fund-form">
            <mat-form-field appearance="outline">
              <mat-label>{{ 'FUNDS.NAME' | translate }}</mat-label>
              <input matInput name="name" [(ngModel)]="fund.name" required />
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>{{ 'FUNDS.EXTERNAL_ID' | translate }}</mat-label>
              <input matInput name="externalId" [(ngModel)]="fund.externalId" />
            </mat-form-field>

            <div class="form-actions">
              <button mat-button type="button" (click)="onCancel()" [disabled]="isSaving">
                {{ 'COMMON.CANCEL' | translate }}
              </button>
              <button
                mat-raised-button
                color="primary"
                type="submit"
                [disabled]="fundForm.invalid || isSaving"
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
      .fund-form {
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
export class FundFormComponent implements OnInit {
  private readonly fundsService = inject(FundsService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  private readonly LIST_PATH = '/organization/funds';

  fundId: number | null = null;
  isEditMode = false;
  isSaving = false;

  fund: FundRequest = { name: '', externalId: '' };

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.fundId = +id;
        this.isEditMode = true;
        this.loadFund();
      }
    });
  }

  loadFund(): void {
    if (!this.fundId) return;
    this.fundsService.getFundsFundId(this.fundId).subscribe((data) => {
      this.fund = { name: data.name, externalId: data.externalId };
    });
  }

  onSubmit(): void {
    this.isSaving = true;
    const request$ =
      this.isEditMode && this.fundId
        ? this.fundsService.putFundsFundId(this.fundId, this.fund)
        : this.fundsService.postFunds(this.fund);

    request$.subscribe({
      next: () => this.router.navigate([this.LIST_PATH]),
      error: () => (this.isSaving = false),
    });
  }

  onCancel(): void {
    this.router.navigate([this.LIST_PATH]);
  }
}
