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
import { TaxGroupService, TaxComponentData, PostTaxesGroupRequest } from '../../../api';
import { FINERACT_DATE_FORMAT, FINERACT_LOCALE } from '../../../core/utils/date-formatter';

/**
 * Create / edit form for a tax group: a name plus a selection of tax components.
 */
@Component({
  selector: 'app-tax-group-form',
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
            {{ isEditMode ? ('TAX_GROUPS.EDIT' | translate) : ('TAX_GROUPS.CREATE' | translate) }}
          </mat-card-title>
        </mat-card-header>

        <mat-card-content>
          <form #tgForm="ngForm" (ngSubmit)="onSubmit()" class="tg-form">
            <mat-form-field appearance="outline">
              <mat-label>{{ 'TAX_GROUPS.NAME' | translate }}</mat-label>
              <input matInput name="name" [(ngModel)]="name" required />
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>{{ 'TAX_GROUPS.COMPONENTS' | translate }}</mat-label>
              <mat-select name="components" [(ngModel)]="selectedComponentIds" multiple required>
                @for (c of availableComponents; track c.id) {
                  <mat-option [value]="c.id">{{ c.name }}</mat-option>
                }
              </mat-select>
            </mat-form-field>

            <div class="form-actions">
              <button mat-button type="button" (click)="onCancel()" [disabled]="isSaving">
                {{ 'COMMON.CANCEL' | translate }}
              </button>
              <button
                mat-raised-button
                color="primary"
                type="submit"
                [disabled]="tgForm.invalid || isSaving"
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
      .tg-form {
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
export class TaxGroupFormComponent implements OnInit {
  private readonly taxGroupService = inject(TaxGroupService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  private readonly LIST_PATH = '/products/tax-groups';

  groupId: number | null = null;
  isEditMode = false;
  isSaving = false;

  name = '';
  selectedComponentIds: number[] = [];
  availableComponents: TaxComponentData[] = [];

  ngOnInit(): void {
    this.loadTemplate();
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.groupId = +id;
        this.isEditMode = true;
        this.load();
      }
    });
  }

  loadTemplate(): void {
    this.taxGroupService.getTaxesGroupTemplate().subscribe((template) => {
      this.availableComponents = template.taxComponents || [];
    });
  }

  load(): void {
    if (!this.groupId) return;
    this.taxGroupService.getTaxesGroupTaxGroupId(this.groupId).subscribe((data) => {
      this.name = data.name ?? '';
      this.selectedComponentIds = Array.from(data.taxAssociations ?? [])
        .map((a) => a.taxComponent?.id)
        .filter((id): id is number => id != null);
    });
  }

  onSubmit(): void {
    this.isSaving = true;
    // `taxComponents` is generated as a `Set` which would not JSON-serialize; pass an array and cast.
    const payload = {
      name: this.name,
      taxComponents: this.selectedComponentIds.map((id) => ({ taxComponentId: id })),
      dateFormat: FINERACT_DATE_FORMAT,
      locale: FINERACT_LOCALE,
    } as unknown as PostTaxesGroupRequest;

    const request$ =
      this.isEditMode && this.groupId
        ? this.taxGroupService.putTaxesGroupTaxGroupId(this.groupId, payload)
        : this.taxGroupService.postTaxesGroup(payload);

    request$.subscribe({
      next: () => this.router.navigate([this.LIST_PATH]),
      error: () => (this.isSaving = false),
    });
  }

  onCancel(): void {
    this.router.navigate([this.LIST_PATH]);
  }
}
