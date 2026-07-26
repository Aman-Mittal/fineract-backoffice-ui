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
import { ProvisioningCategoryService, ProvisioningCategoryData } from '../../../api';
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
} from '@ionic/angular/standalone';

/**
 * Create / edit form for a provisioning category (name + description).
 */
@Component({
  selector: 'app-provisioning-categories-form',
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
  ],
  template: `
    <div class="form-container">
      <ion-card>
        <ion-card-header>
          <ion-card-title>
            {{
              isEditMode
                ? ('PROVISIONING_CATEGORIES.EDIT' | translate)
                : ('PROVISIONING_CATEGORIES.CREATE' | translate)
            }}
          </ion-card-title>
        </ion-card-header>

        <ion-card-content>
          <form #categoryForm="ngForm" (ngSubmit)="onSubmit()" class="provisioning-form">
            <ion-item fill="outline">
              <ion-label position="stacked">{{
                'PROVISIONING_CATEGORIES.NAME' | translate
              }}</ion-label>
              <ion-input
                name="categoryName"
                [(ngModel)]="category.categoryName"
                required
              ></ion-input>
            </ion-item>

            <ion-item fill="outline">
              <ion-label position="stacked">{{
                'PROVISIONING_CATEGORIES.DESCRIPTION' | translate
              }}</ion-label>
              <ion-input
                name="categoryDescription"
                [(ngModel)]="category.categoryDescription"
              ></ion-input>
            </ion-item>

            <div class="form-actions">
              <ion-button fill="clear" type="button" (click)="onCancel()" [disabled]="isSaving">
                {{ 'COMMON.CANCEL' | translate }}
              </ion-button>
              <ion-button
                color="primary"
                type="submit"
                [disabled]="categoryForm.invalid || isSaving"
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
      .provisioning-form {
        display: flex;
        flex-direction: column;
        gap: 16px;
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
