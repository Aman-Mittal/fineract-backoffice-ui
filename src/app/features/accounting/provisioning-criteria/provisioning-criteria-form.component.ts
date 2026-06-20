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
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ProvisioningCriteriaService, PostProvisioningCriteriaRequest } from '../../../api';

/**
 * Create / edit form for a provisioning criteria. The full criteria record carries
 * per-category definitions and a loan-product mapping; those arrays are complex and
 * are preserved as-is on edit. This form edits only the criteria name.
 */
@Component({
  selector: 'app-provisioning-criteria-form',
  standalone: true,
  imports: [
    FormsModule,
    TranslateModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
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
                ? ('PROVISIONING_CRITERIA.EDIT' | translate)
                : ('PROVISIONING_CRITERIA.CREATE' | translate)
            }}
          </mat-card-title>
        </mat-card-header>

        <mat-card-content>
          <form #criteriaForm="ngForm" (ngSubmit)="onSubmit()" class="provisioning-form">
            <mat-form-field appearance="outline">
              <mat-label>{{ 'PROVISIONING_CRITERIA.NAME' | translate }}</mat-label>
              <input matInput name="criteriaName" [(ngModel)]="criteria.criteriaName" required />
            </mat-form-field>

            <p class="form-note">{{ 'PROVISIONING_CRITERIA.DEFINITIONS_NOTE' | translate }}</p>

            <div class="form-actions">
              <button mat-button type="button" (click)="onCancel()" [disabled]="isSaving">
                {{ 'COMMON.CANCEL' | translate }}
              </button>
              <button
                mat-raised-button
                color="primary"
                type="submit"
                [disabled]="criteriaForm.invalid || isSaving"
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
      .provisioning-form {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }
      .form-note {
        color: rgba(0, 0, 0, 0.6);
        font-size: 0.875rem;
      }
    `,
  ],
})
export class ProvisioningCriteriaFormComponent implements OnInit {
  private readonly criteriaService = inject(ProvisioningCriteriaService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  private readonly LIST_PATH = '/accounting/provisioning-criteria';

  criteriaId: number | null = null;
  isEditMode = false;
  isSaving = false;

  criteria: PostProvisioningCriteriaRequest = { criteriaName: '' };

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.criteriaId = +id;
        this.isEditMode = true;
        this.load();
      }
    });
  }

  load(): void {
    if (!this.criteriaId) return;
    this.criteriaService.getProvisioningcriteriaCriteriaId(this.criteriaId).subscribe((data) => {
      this.criteria = {
        criteriaName: data.criteriaName,
        loanProducts: data.loanProducts,
        provisioningcriteria: data.provisioningcriteria,
      };
    });
  }

  onSubmit(): void {
    this.isSaving = true;
    const request$ =
      this.isEditMode && this.criteriaId
        ? this.criteriaService.putProvisioningcriteriaCriteriaId(this.criteriaId, this.criteria)
        : this.criteriaService.postProvisioningcriteria(this.criteria);

    request$.subscribe({
      next: () => this.router.navigate([this.LIST_PATH]),
      error: () => (this.isSaving = false),
    });
  }

  onCancel(): void {
    this.router.navigate([this.LIST_PATH]);
  }
}
