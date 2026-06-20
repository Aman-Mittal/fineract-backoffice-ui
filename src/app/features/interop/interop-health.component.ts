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
import { Component, signal, inject } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TranslateModule } from '@ngx-translate/core';
import { InterOperationService } from '../../api';

@Component({
  selector: 'app-interop-health',
  standalone: true,
  imports: [JsonPipe, MatCardModule, MatButtonModule, MatProgressSpinnerModule, TranslateModule],
  template: `
    <mat-card>
      <mat-card-header>
        <mat-card-title>{{ 'INTEROP.HEALTH_TITLE' | translate }}</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <button mat-raised-button color="primary" (click)="checkHealth()" [disabled]="isLoading">
          {{ 'INTEROP.CHECK_HEALTH' | translate }}
        </button>

        @if (isLoading) {
          <mat-spinner diameter="40" style="margin-top: 16px;"></mat-spinner>
        }

        @if (health()) {
          <h3>{{ 'INTEROP.HEALTH_STATUS' | translate }}</h3>
          <pre>{{ health() | json }}</pre>
        }
      </mat-card-content>
    </mat-card>
  `,
  styles: [
    `
      button {
        margin-bottom: 16px;
      }
      pre {
        background: #f5f5f5;
        padding: 12px;
        border-radius: 4px;
        overflow: auto;
      }
    `,
  ],
})
export class InteropHealthComponent {
  private interopService = inject(InterOperationService);

  health = signal<any>(null);
  isLoading = false;

  checkHealth(): void {
    this.isLoading = true;
    this.health.set(null);
    this.interopService.getInteroperationHealth().subscribe({
      next: (data: any) => {
        this.health.set(data);
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }
}
