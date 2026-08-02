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
import { FormsModule } from '@angular/forms';
import { JsonPipe } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { NotificationService } from '../../core/services/notification.service';
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonInput,
  IonItem,
  IonLabel,
  IonTextarea,
} from '@ionic/angular/standalone';
import {
  InterOperationService,
  InteropQuoteRequestData,
  InteropQuoteResponseData,
} from '../../api';

const ERROR_OCCURRED = 'Error occurred';

@Component({
  selector: 'app-interop-quotes',
  standalone: true,
  imports: [
    FormsModule,
    JsonPipe,
    TranslateModule,
    IonButton,
    IonInput,
    IonTextarea,
    IonItem,
    IonLabel,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonCard,
  ],
  template: `
    <ion-card>
      <ion-card-header>
        <ion-card-title>{{ 'INTEROP.QUOTES_TITLE' | translate }}</ion-card-title>
      </ion-card-header>
      <ion-card-content>
        <!-- Section 1: Get Quote -->
        <section>
          <h3>{{ 'INTEROP.GET_QUOTE' | translate }}</h3>
          <div class="form-row">
            <ion-item fill="outline">
              <ion-label position="stacked">{{ 'INTEROP.TX_CODE' | translate }}</ion-label>
              <ion-input
                [attr.aria-label]="'INTEROP.TX_CODE' | translate"
                [(ngModel)]="transactionCode"
              ></ion-input>
            </ion-item>

            <ion-item fill="outline">
              <ion-label position="stacked">{{ 'INTEROP.QUOTE_CODE' | translate }}</ion-label>
              <ion-input
                [attr.aria-label]="'INTEROP.QUOTE_CODE' | translate"
                [(ngModel)]="quoteCode"
              ></ion-input>
            </ion-item>
          </div>

          <ion-button
            color="primary"
            (click)="loadQuote()"
            [disabled]="!transactionCode || !quoteCode"
          >
            {{ 'INTEROP.GET_QUOTE' | translate }}
          </ion-button>
        </section>

        <hr class="divider" />

        <!-- Section 2: Create Quote -->
        <section>
          <h3>{{ 'INTEROP.CREATE_QUOTE' | translate }}</h3>
          <ion-item fill="outline" class="full-width">
            <ion-label position="stacked">{{ 'INTEROP.QUOTE_BODY' | translate }}</ion-label>
            <ion-textarea
              [attr.aria-label]="'INTEROP.QUOTE_BODY' | translate"
              rows="10"
              [(ngModel)]="quoteBodyJson"
            ></ion-textarea>
          </ion-item>

          <ion-button color="secondary" (click)="createQuote()">
            {{ 'INTEROP.CREATE_QUOTE' | translate }}
          </ion-button>
        </section>

        @if (result()) {
          <h3 style="margin-top: 16px;">Result</h3>
          <pre>{{ result() | json }}</pre>
        }
      </ion-card-content>
    </ion-card>
  `,
  styles: [
    `
      .form-row {
        display: flex;
        gap: 16px;
        flex-wrap: wrap;
        margin-bottom: 16px;
      }
      ion-item {
        width: 300px;
      }
      .full-width {
        width: 100%;
        display: block;
      }
      button {
        margin-bottom: 8px;
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
export class InteropQuotesComponent {
  private interopService = inject(InterOperationService);
  private notifications = inject(NotificationService);

  readonly result = signal<InteropQuoteResponseData | null>(null);

  transactionCode = '';
  quoteCode = '';
  quoteBodyJson = '{}';

  loadQuote(): void {
    this.result.set(null);
    this.interopService
      .getInteroperationTransactionsTransactionCodeQuotesQuoteCode(
        this.transactionCode,
        this.quoteCode,
      )
      .subscribe({
        next: (data) => this.result.set(data),
        error: (err: { message?: string }) =>
          this.notifications.error(err.message || ERROR_OCCURRED),
      });
  }

  createQuote(): void {
    this.result.set(null);
    let body: InteropQuoteRequestData;
    try {
      body = JSON.parse(this.quoteBodyJson) as InteropQuoteRequestData;
    } catch {
      this.notifications.error('Invalid JSON');
      return;
    }
    this.interopService.postInteroperationQuotes(body).subscribe({
      next: (data) => this.result.set(data),
      error: (err: { message?: string }) => this.notifications.error(err.message || ERROR_OCCURRED),
    });
  }
}
