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

import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MixReportService } from '../../../api';
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonInput,
  IonItem,
  IonLabel,
  IonSpinner,
} from '@ionic/angular/standalone';

/**
 * Read-only view of the generated MIX (XBRL) report. The endpoint returns the report as
 * an XML string for an optional date range / currency, which is shown verbatim.
 */
@Component({
  selector: 'app-mix-report',
  standalone: true,
  imports: [
    FormsModule,
    TranslateModule,
    IonButton,
    IonSpinner,
    IonInput,
    IonItem,
    IonLabel,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonCard,
  ],
  template: `
    <div class="report-container">
      <ion-card>
        <ion-card-header>
          <ion-card-title>{{ 'MIX_REPORT.TITLE' | translate }}</ion-card-title>
        </ion-card-header>

        <ion-card-content>
          <form #reportForm="ngForm" (ngSubmit)="onGenerate()" class="mix-report-form">
            <ion-item fill="outline">
              <ion-label position="stacked">{{ 'MIX_REPORT.START_DATE' | translate }}</ion-label>
              <ion-input
                [attr.aria-label]="'MIX_REPORT.START_DATE' | translate"
                name="startDate"
                [(ngModel)]="startDate"
                placeholder="yyyy-MM-dd"
              ></ion-input>
            </ion-item>

            <ion-item fill="outline">
              <ion-label position="stacked">{{ 'MIX_REPORT.END_DATE' | translate }}</ion-label>
              <ion-input
                [attr.aria-label]="'MIX_REPORT.END_DATE' | translate"
                name="endDate"
                [(ngModel)]="endDate"
                placeholder="yyyy-MM-dd"
              ></ion-input>
            </ion-item>

            <ion-item fill="outline">
              <ion-label position="stacked">{{ 'MIX_REPORT.CURRENCY' | translate }}</ion-label>
              <ion-input
                [attr.aria-label]="'MIX_REPORT.CURRENCY' | translate"
                name="currency"
                [(ngModel)]="currency"
              ></ion-input>
            </ion-item>

            <div class="form-actions">
              <ion-button color="primary" type="submit" [disabled]="isLoading()">
                @if (isLoading()) {
                  <ion-spinner name="crescent"></ion-spinner>
                  {{ 'MIX_REPORT.GENERATING' | translate }}
                } @else {
                  {{ 'MIX_REPORT.GENERATE' | translate }}
                }
              </ion-button>
            </div>
          </form>

          @if (report) {
            <pre class="mix-report-output">{{ report }}</pre>
          }
        </ion-card-content>
      </ion-card>
    </div>
  `,
  styles: [
    `
      .report-container {
        padding: 24px;
        max-width: 900px;
        margin: 0 auto;
      }
      .mix-report-form {
        display: flex;
        flex-wrap: wrap;
        gap: 16px;
        align-items: center;
      }
      .form-actions {
        display: flex;
        justify-content: flex-end;
      }
      .mix-report-output {
        margin-top: 16px;
        padding: 16px;
        background: rgba(0, 0, 0, 0.04);
        white-space: pre-wrap;
        word-break: break-all;
        max-height: 500px;
        overflow: auto;
      }
    `,
  ],
})
export class MixReportComponent {
  private readonly reportService = inject(MixReportService);

  startDate?: string;
  endDate?: string;
  currency?: string;
  readonly isLoading = signal(false);
  report = '';

  onGenerate(): void {
    this.isLoading.set(true);
    this.reportService.getMixreport(this.startDate, this.endDate, this.currency).subscribe({
      next: (data: string) => {
        this.report = data || '';
        this.isLoading.set(false);
      },
      error: (err: unknown) => {
        console.error('Failed to generate MIX report', err);
        this.isLoading.set(false);
      },
    });
  }
}
