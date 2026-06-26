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
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { HooksService, HookCreateRequest, HookTemplateData } from '../../../api';

/**
 * Create / edit form for a Fineract hook. The hook "name" is the template type and is
 * selected from the template endpoint; display name and active flag are editable.
 */
@Component({
  selector: 'app-hooks-form',
  standalone: true,
  imports: [
    FormsModule,
    TranslateModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatButtonModule,
    MatProgressSpinnerModule,
  ],
  template: `
    <div class="form-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>
            {{ isEditMode ? ('HOOKS.EDIT' | translate) : ('HOOKS.CREATE' | translate) }}
          </mat-card-title>
        </mat-card-header>

        <mat-card-content>
          <form #hookForm="ngForm" (ngSubmit)="onSubmit()" class="entity-form">
            <mat-form-field appearance="outline">
              <mat-label>{{ 'HOOKS.NAME' | translate }}</mat-label>
              <mat-select name="name" [(ngModel)]="hook.name" required [disabled]="isEditMode">
                @for (tpl of templateOptions; track tpl.id) {
                  <mat-option [value]="tpl.name">{{ tpl.name }}</mat-option>
                }
              </mat-select>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>{{ 'HOOKS.DISPLAY_NAME' | translate }}</mat-label>
              <input matInput name="displayName" [(ngModel)]="hook.displayName" required />
            </mat-form-field>

            <mat-checkbox name="isActive" [(ngModel)]="hook.isActive">
              {{ 'HOOKS.IS_ACTIVE' | translate }}
            </mat-checkbox>

            <div class="form-actions">
              <button mat-button type="button" (click)="onCancel()" [disabled]="isSaving">
                {{ 'COMMON.CANCEL' | translate }}
              </button>
              <button
                mat-raised-button
                color="primary"
                type="submit"
                [disabled]="hookForm.invalid || isSaving"
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
      .entity-form {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }
    `,
  ],
})
export class HooksFormComponent implements OnInit {
  private readonly hooksService = inject(HooksService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  private readonly LIST_PATH = '/system/hooks';

  hookId: number | null = null;
  isEditMode = false;
  isSaving = false;

  hook: HookCreateRequest = { name: '', displayName: '', isActive: true };
  templateOptions: HookTemplateData[] = [];

  ngOnInit(): void {
    this.hooksService.getHooksTemplate().subscribe((tpl) => {
      this.templateOptions = tpl.templates ?? [];
    });

    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.hookId = +id;
        this.isEditMode = true;
        this.load();
      }
    });
  }

  load(): void {
    if (!this.hookId) return;
    this.hooksService.getHooksHookId(this.hookId).subscribe((data) => {
      this.hook = {
        name: data.name,
        displayName: data.displayName,
        isActive: data.isActive,
        templateId: data.templateId,
      };
    });
  }

  onSubmit(): void {
    this.isSaving = true;
    const request$ =
      this.isEditMode && this.hookId
        ? this.hooksService.putHooksHookId(this.hookId, this.hook)
        : this.hooksService.postHooks(this.hook);

    request$.subscribe({
      next: () => this.router.navigate([this.LIST_PATH]),
      error: () => (this.isSaving = false),
    });
  }

  onCancel(): void {
    this.router.navigate([this.LIST_PATH]);
  }
}
