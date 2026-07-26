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
import { TranslateModule } from '@ngx-translate/core';
import { InterOperationService } from '../../api';
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonSpinner,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-interop-health',
  standalone: true,
  imports: [
    JsonPipe,
    TranslateModule,
    IonButton,
    IonSpinner,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonCard,
  ],
  template: `
    <ion-card>
      <ion-card-header>
        <ion-card-title>{{ 'INTEROP.HEALTH_TITLE' | translate }}</ion-card-title>
      </ion-card-header>
      <ion-card-content>
        <ion-button color="primary" (click)="checkHealth()" [disabled]="isLoading">
          {{ 'INTEROP.CHECK_HEALTH' | translate }}
        </ion-button>

        @if (isLoading) {
          <ion-spinner name="crescent"></ion-spinner>
        }

        @if (health()) {
          <h3>{{ 'INTEROP.HEALTH_STATUS' | translate }}</h3>
          <pre>{{ health() | json }}</pre>
        }
      </ion-card-content>
    </ion-card>
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

  health = signal<unknown>(null);
  isLoading = false;

  checkHealth(): void {
    this.isLoading = true;
    this.health.set(null);
    this.interopService.getInteroperationHealth().subscribe({
      next: (data) => {
        this.health.set(data);
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }
}
