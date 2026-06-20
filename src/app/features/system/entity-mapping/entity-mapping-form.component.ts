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
import { FineractEntityService } from '../../../api';

/**
 * Local request/response shape for an entity-to-entity mapping. The generated service
 * exchanges raw JSON `string` bodies, so payloads are stringified / parsed through this
 * minimal interface.
 */
interface EntityMappingPayload {
  relId?: number;
  fromId?: number;
  toId?: number;
}

/**
 * Create / edit form for an entity-to-entity mapping. The relationship id selects which
 * mapping type is created; from/to ids identify the linked entities.
 */
@Component({
  selector: 'app-entity-mapping-form',
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
                ? ('ENTITY_MAPPING.EDIT' | translate)
                : ('ENTITY_MAPPING.CREATE' | translate)
            }}
          </mat-card-title>
        </mat-card-header>

        <mat-card-content>
          <form #mappingForm="ngForm" (ngSubmit)="onSubmit()" class="entity-form">
            <mat-form-field appearance="outline">
              <mat-label>{{ 'ENTITY_MAPPING.REL_ID' | translate }}</mat-label>
              <input
                matInput
                type="number"
                name="relId"
                [(ngModel)]="relId"
                required
                [disabled]="isEditMode"
              />
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>{{ 'ENTITY_MAPPING.FROM_ID' | translate }}</mat-label>
              <input matInput type="number" name="fromId" [(ngModel)]="payload.fromId" required />
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>{{ 'ENTITY_MAPPING.TO_ID' | translate }}</mat-label>
              <input matInput type="number" name="toId" [(ngModel)]="payload.toId" required />
            </mat-form-field>

            <div class="form-actions">
              <button mat-button type="button" (click)="onCancel()" [disabled]="isSaving">
                {{ 'COMMON.CANCEL' | translate }}
              </button>
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
export class EntityMappingFormComponent implements OnInit {
  private readonly entityService = inject(FineractEntityService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  private readonly LIST_PATH = '/system/entity-mapping';

  mapId: number | null = null;
  isEditMode = false;
  isSaving = false;

  relId: number | undefined;
  payload: EntityMappingPayload = {};

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.mapId = +id;
        this.isEditMode = true;
        this.load();
      }
    });
  }

  load(): void {
    if (!this.mapId) return;
    this.entityService.getEntitytoentitymappingMapId(this.mapId).subscribe((body: string) => {
      const data = body ? (JSON.parse(body) as EntityMappingPayload) : {};
      this.payload = { fromId: data.fromId, toId: data.toId };
      this.relId = data.relId;
    });
  }

  onSubmit(): void {
    this.isSaving = true;
    const body = JSON.stringify({ fromId: this.payload.fromId, toId: this.payload.toId });
    const request$ =
      this.isEditMode && this.mapId
        ? this.entityService.putEntitytoentitymappingMapId(this.mapId, body)
        : this.entityService.postEntitytoentitymappingRelId(this.relId ?? 0, body);

    request$.subscribe({
      next: () => this.router.navigate([this.LIST_PATH]),
      error: () => (this.isSaving = false),
    });
  }

  onCancel(): void {
    this.router.navigate([this.LIST_PATH]);
  }
}
