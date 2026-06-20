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
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {
  MixMappingService,
  MixTaxonomyMappingData,
  MixTaxonomyMappingUpdateRequest,
} from '../../../api';

/**
 * Configuration screen for the MIX XBRL taxonomy -> general-ledger mapping.
 * Loads the current mapping config, lets the user edit it, and saves it back.
 */
@Component({
  selector: 'app-mix-mapping',
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
          <mat-card-title>{{ 'MIX_MAPPING.TITLE' | translate }}</mat-card-title>
        </mat-card-header>

        <mat-card-content>
          <form #mappingForm="ngForm" (ngSubmit)="onSubmit()" class="mix-form">
            <mat-form-field appearance="outline">
              <mat-label>{{ 'MIX_MAPPING.IDENTIFIER' | translate }}</mat-label>
              <input matInput name="identifier" [(ngModel)]="mapping.identifier" />
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>{{ 'MIX_MAPPING.CURRENCY' | translate }}</mat-label>
              <input matInput name="currency" [(ngModel)]="mapping.currency" />
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>{{ 'MIX_MAPPING.CONFIG' | translate }}</mat-label>
              <textarea matInput rows="10" name="config" [(ngModel)]="mapping.config"></textarea>
            </mat-form-field>

            <div class="form-actions">
              <button
                mat-raised-button
                color="primary"
                type="submit"
                [disabled]="mappingForm.invalid || isSaving"
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
        max-width: 700px;
        margin: 0 auto;
      }
      .mix-form {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }
    `,
  ],
})
export class MixMappingComponent implements OnInit {
  private readonly mappingService = inject(MixMappingService);

  isSaving = false;
  mapping: MixTaxonomyMappingData = {};

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.mappingService.getMixmapping().subscribe({
      next: (data: MixTaxonomyMappingData) => {
        this.mapping = data || {};
      },
      error: (err: unknown) => console.error('Failed to load MIX mapping', err),
    });
  }

  onSubmit(): void {
    this.isSaving = true;
    const request: MixTaxonomyMappingUpdateRequest = {
      identifier: this.mapping.identifier,
      currency: this.mapping.currency,
      config: this.mapping.config,
    };
    this.mappingService.putMixmapping(request).subscribe({
      next: () => (this.isSaving = false),
      error: () => (this.isSaving = false),
    });
  }
}
