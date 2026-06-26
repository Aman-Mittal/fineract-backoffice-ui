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
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ExternalEventConfigurationService } from '../../../api';

interface EventToggle {
  type: string;
  enabled: boolean;
}

/**
 * External event configuration: list configurable events with enabled toggles
 * and persist them via the external-events configuration endpoint.
 */
@Component({
  selector: 'app-external-events',
  standalone: true,
  imports: [
    FormsModule,
    TranslateModule,
    MatCardModule,
    MatSlideToggleModule,
    MatButtonModule,
    MatProgressSpinnerModule,
  ],
  template: `
    <div class="form-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>{{ 'nav.externalEvents' | translate }}</mat-card-title>
        </mat-card-header>

        <mat-card-content>
          <div class="event-list">
            @for (event of events; track event.type) {
              <mat-slide-toggle [(ngModel)]="event.enabled">{{ event.type }}</mat-slide-toggle>
            }
          </div>

          <div class="form-actions">
            <button
              mat-raised-button
              color="primary"
              type="button"
              [disabled]="!events.length || isSaving"
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
      .event-list {
        display: flex;
        flex-direction: column;
        gap: 12px;
      }
    `,
  ],
})
export class ExternalEventsComponent implements OnInit {
  private readonly service = inject(ExternalEventConfigurationService);

  events: EventToggle[] = [];
  isSaving = false;

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.service.getExternaleventsConfiguration().subscribe((data) => {
      this.events = (data.externalEventConfiguration ?? []).map((item) => ({
        type: item.type ?? '',
        enabled: item.enabled ?? false,
      }));
    });
  }

  onSave(): void {
    this.isSaving = true;
    const externalEventConfigurations: Record<string, boolean> = {};
    for (const event of this.events) {
      externalEventConfigurations[event.type] = event.enabled;
    }
    this.service.putExternaleventsConfiguration({ externalEventConfigurations }).subscribe({
      next: () => (this.isSaving = false),
      error: () => (this.isSaving = false),
    });
  }
}
