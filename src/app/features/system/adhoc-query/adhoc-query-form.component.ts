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
import { AdhocQueryApiService, AdHocRequest, EnumOptionData } from '../../../api';

/**
 * Create / edit form for an ad-hoc SQL query definition.
 */
@Component({
  selector: 'app-adhoc-query-form',
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
            {{ isEditMode ? ('ADHOC_QUERY.EDIT' | translate) : ('ADHOC_QUERY.CREATE' | translate) }}
          </mat-card-title>
        </mat-card-header>

        <mat-card-content>
          <form #adhocForm="ngForm" (ngSubmit)="onSubmit()" class="entity-form">
            <mat-form-field appearance="outline">
              <mat-label>{{ 'ADHOC_QUERY.NAME' | translate }}</mat-label>
              <input matInput name="name" [(ngModel)]="query.name" required />
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>{{ 'ADHOC_QUERY.QUERY' | translate }}</mat-label>
              <textarea matInput name="query" [(ngModel)]="query.query" required></textarea>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>{{ 'ADHOC_QUERY.TABLE_NAME' | translate }}</mat-label>
              <input matInput name="tableName" [(ngModel)]="query.tableName" required />
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>{{ 'ADHOC_QUERY.REPORT_RUN_FREQUENCY' | translate }}</mat-label>
              <mat-select name="reportRunFrequency" [(ngModel)]="query.reportRunFrequency">
                @for (opt of frequencyOptions; track opt.id) {
                  <mat-option [value]="opt.id">{{ opt.value }}</mat-option>
                }
              </mat-select>
            </mat-form-field>

            <mat-checkbox name="isActive" [(ngModel)]="query.isActive">
              {{ 'ADHOC_QUERY.IS_ACTIVE' | translate }}
            </mat-checkbox>

            <div class="form-actions">
              <button mat-button type="button" (click)="onCancel()" [disabled]="isSaving">
                {{ 'COMMON.CANCEL' | translate }}
              </button>
              <button
                mat-raised-button
                color="primary"
                type="submit"
                [disabled]="adhocForm.invalid || isSaving"
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
export class AdhocQueryFormComponent implements OnInit {
  private readonly adhocService = inject(AdhocQueryApiService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  private readonly LIST_PATH = '/system/adhoc-query';

  queryId: number | null = null;
  isEditMode = false;
  isSaving = false;

  query: AdHocRequest = { name: '', query: '', tableName: '', isActive: true };
  frequencyOptions: EnumOptionData[] = [];

  ngOnInit(): void {
    this.adhocService.getAdhocqueryTemplate().subscribe((tpl) => {
      this.frequencyOptions = tpl.reportRunFrequencies ?? [];
    });

    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.queryId = +id;
        this.isEditMode = true;
        this.load();
      }
    });
  }

  load(): void {
    if (!this.queryId) return;
    this.adhocService.getAdhocqueryAdHocId(this.queryId).subscribe((data) => {
      this.query = {
        name: data.name,
        query: data.query,
        tableName: data.tableName,
        reportRunFrequency: data.reportRunFrequency,
        isActive: data.isActive,
      };
    });
  }

  onSubmit(): void {
    this.isSaving = true;
    const request$ =
      this.isEditMode && this.queryId
        ? this.adhocService.putAdhocqueryAdHocId(this.queryId, this.query)
        : this.adhocService.postAdhocquery(this.query);

    request$.subscribe({
      next: () => this.router.navigate([this.LIST_PATH]),
      error: () => (this.isSaving = false),
    });
  }

  onCancel(): void {
    this.router.navigate([this.LIST_PATH]);
  }
}
