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
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { EntityDataTableService, PostEntityDatatableChecksTemplateRequest } from '../../../api';

/**
 * Create form for an entity data-table check. No update endpoint exists, so this form is
 * create-only.
 */
@Component({
  selector: 'app-entity-data-table-checks-form',
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
          <mat-card-title>{{ 'ENTITY_DATA_TABLE_CHECKS.CREATE' | translate }}</mat-card-title>
        </mat-card-header>

        <mat-card-content>
          <form #checkForm="ngForm" (ngSubmit)="onSubmit()" class="entity-form">
            <mat-form-field appearance="outline">
              <mat-label>{{ 'ENTITY_DATA_TABLE_CHECKS.ENTITY' | translate }}</mat-label>
              <mat-select name="entity" [(ngModel)]="check.entity" required>
                @for (ent of entityOptions; track ent) {
                  <mat-option [value]="ent">{{ ent }}</mat-option>
                }
              </mat-select>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>{{ 'ENTITY_DATA_TABLE_CHECKS.DATATABLE_NAME' | translate }}</mat-label>
              <input matInput name="datatableName" [(ngModel)]="check.datatableName" required />
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>{{ 'ENTITY_DATA_TABLE_CHECKS.STATUS' | translate }}</mat-label>
              <input matInput type="number" name="status" [(ngModel)]="check.status" required />
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>{{ 'ENTITY_DATA_TABLE_CHECKS.PRODUCT_ID' | translate }}</mat-label>
              <input matInput type="number" name="productId" [(ngModel)]="check.productId" />
            </mat-form-field>

            <div class="form-actions">
              <button mat-button type="button" (click)="onCancel()" [disabled]="isSaving">
                {{ 'COMMON.CANCEL' | translate }}
              </button>
              <button
                mat-raised-button
                color="primary"
                type="submit"
                [disabled]="checkForm.invalid || isSaving"
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
export class EntityDataTableChecksFormComponent implements OnInit {
  private readonly checksService = inject(EntityDataTableService);
  private readonly router = inject(Router);

  private readonly LIST_PATH = '/system/entity-data-table-checks';

  isSaving = false;

  check: PostEntityDatatableChecksTemplateRequest = {
    entity: '',
    datatableName: '',
  };
  entityOptions: string[] = [];

  ngOnInit(): void {
    this.checksService.getEntityDatatableChecksTemplate().subscribe((tpl) => {
      this.entityOptions = tpl.entities ?? [];
    });
  }

  onSubmit(): void {
    this.isSaving = true;
    this.checksService.postEntityDatatableChecks(this.check).subscribe({
      next: () => this.router.navigate([this.LIST_PATH]),
      error: () => (this.isSaving = false),
    });
  }

  onCancel(): void {
    this.router.navigate([this.LIST_PATH]);
  }
}
