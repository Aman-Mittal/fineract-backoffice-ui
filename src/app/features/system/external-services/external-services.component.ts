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
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ExternalServicesService, PutExternalServiceRequest } from '../../../api';

interface ServiceProperty {
  name: string;
  value: string;
}

/**
 * External services configuration: pick a service (S3 / SMTP / NOTIFICATION),
 * load its name/value properties, edit and save them.
 */
@Component({
  selector: 'app-external-services',
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
          <mat-card-title>{{ 'EXTERNAL_SERVICES.TITLE' | translate }}</mat-card-title>
        </mat-card-header>

        <mat-card-content>
          <mat-form-field appearance="outline">
            <mat-label>{{ 'EXTERNAL_SERVICES.SERVICE' | translate }}</mat-label>
            <mat-select [(ngModel)]="selectedService" (selectionChange)="load()">
              @for (name of serviceNames; track name) {
                <mat-option [value]="name">{{ name }}</mat-option>
              }
            </mat-select>
          </mat-form-field>

          @for (prop of properties; track prop.name) {
            <mat-form-field appearance="outline">
              <mat-label>{{ prop.name }}</mat-label>
              <input matInput [name]="prop.name" [(ngModel)]="prop.value" />
            </mat-form-field>
          }

          <div class="form-actions">
            <button
              mat-raised-button
              color="primary"
              type="button"
              [disabled]="!properties.length || isSaving"
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
    `,
  ],
})
export class ExternalServicesComponent implements OnInit {
  private readonly service = inject(ExternalServicesService);

  readonly serviceNames = ['S3', 'SMTP', 'NOTIFICATION'];
  selectedService = '';
  properties: ServiceProperty[] = [];
  isSaving = false;

  ngOnInit(): void {
    this.selectedService = this.serviceNames[0];
    this.load();
  }

  load(): void {
    if (!this.selectedService) return;
    this.service.getExternalserviceServicename(this.selectedService).subscribe((data) => {
      const list = (data as unknown as ServiceProperty[]) ?? [];
      this.properties = list.map((p) => ({ name: p.name ?? '', value: p.value ?? '' }));
    });
  }

  onSave(): void {
    if (!this.selectedService) return;
    this.isSaving = true;
    const request: Record<string, string> = {};
    for (const prop of this.properties) {
      request[prop.name] = prop.value;
    }
    this.service
      .putExternalserviceServicename(
        this.selectedService,
        request as unknown as PutExternalServiceRequest,
      )
      .subscribe({
        next: () => (this.isSaving = false),
        error: () => (this.isSaving = false),
      });
  }
}
