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
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CacheService, CacheData } from '../../../api';

/**
 * Cache configuration: list available cache types and switch the enabled one
 * via the caches endpoint.
 */
@Component({
  selector: 'app-cache',
  standalone: true,
  imports: [
    FormsModule,
    TranslateModule,
    MatCardModule,
    MatFormFieldModule,
    MatRadioModule,
    MatButtonModule,
    MatProgressSpinnerModule,
  ],
  template: `
    <div class="form-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>{{ 'CACHE.TITLE' | translate }}</mat-card-title>
        </mat-card-header>

        <mat-card-content>
          <mat-radio-group class="cache-group" [(ngModel)]="selectedCacheType">
            @for (cache of caches; track cache.cacheType?.id) {
              <mat-radio-button [value]="cache.cacheType?.id">
                {{ cache.cacheType?.value }}
              </mat-radio-button>
            }
          </mat-radio-group>

          <div class="form-actions">
            <button
              mat-raised-button
              color="primary"
              type="button"
              [disabled]="selectedCacheType === null || isSaving"
              (click)="onSave()"
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
      .cache-group {
        display: flex;
        flex-direction: column;
        gap: 12px;
      }
    `,
  ],
})
export class CacheComponent implements OnInit {
  private readonly service = inject(CacheService);

  caches: CacheData[] = [];
  selectedCacheType: number | null = null;
  isSaving = false;

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.service.getCaches().subscribe((data) => {
      this.caches = data ?? [];
      const enabled = this.caches.find((c) => c.enabled);
      this.selectedCacheType = enabled?.cacheType?.id ?? null;
    });
  }

  onSave(): void {
    if (this.selectedCacheType === null) return;
    this.isSaving = true;
    this.service.putCaches({ cacheType: this.selectedCacheType }).subscribe({
      next: () => {
        this.isSaving = false;
        this.load();
      },
      error: () => (this.isSaving = false),
    });
  }
}
