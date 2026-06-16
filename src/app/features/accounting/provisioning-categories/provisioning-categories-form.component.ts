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
import { ProvisioningCategoryService, ProvisioningCategoryData } from '../../../api';

/**
 * Create / edit form for a provisioning category (name + description).
 */
@Component({
  selector: 'app-provisioning-categories-form',
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
                ? ('PROVISIONING_CATEGORIES.EDIT' | translate)
                : ('PROVISIONING_CATEGORIES.CREATE' | translate)
            }}
          </mat-card-title>
        </mat-card-header>

        <mat-card-content>
          <form #categoryForm="ngForm" (ngSubmit)="onSubmit()" class="provisioning-form">
            <mat-form-field appearance="outline">
              <mat-label>{{ 'PROVISIONING_CATEGORIES.NAME' | translate }}</mat-label>
              <input matInput name="categoryName" [(ngModel)]="category.categoryName" required />
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>{{ 'PROVISIONING_CATEGORIES.DESCRIPTION' | translate }}</mat-label>
              <input
                matInput
                name="categoryDescription"
                [(ngModel)]="category.categoryDescription"
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
                [disabled]="categoryForm.invalid || isSaving"
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
export class ProvisioningCategoriesFormComponent implements OnInit {
  private readonly categoryService = inject(ProvisioningCategoryService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  private readonly LIST_PATH = '/accounting/provisioning-categories';

  categoryId: number | null = null;
  isEditMode = false;
  isSaving = false;

  category: ProvisioningCategoryData = { categoryName: '' };

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.categoryId = +id;
        this.isEditMode = true;
        this.load();
      }
    });
  }

  load(): void {
    if (!this.categoryId) return;
    this.categoryService.getProvisioningcategory().subscribe((data) => {
      const found = (data || []).find((c) => c.id === this.categoryId);
      if (found) {
        this.category = {
          categoryName: found.categoryName,
          categoryDescription: found.categoryDescription,
        };
      }
    });
  }

  onSubmit(): void {
    this.isSaving = true;
    const body = JSON.stringify(this.category);
    const request$ =
      this.isEditMode && this.categoryId
        ? this.categoryService.putProvisioningcategoryCategoryId(this.categoryId, body)
        : this.categoryService.postProvisioningcategory(body);

    request$.subscribe({
      next: () => this.router.navigate([this.LIST_PATH]),
      error: () => (this.isSaving = false),
    });
  }

  onCancel(): void {
    this.router.navigate([this.LIST_PATH]);
  }
}
