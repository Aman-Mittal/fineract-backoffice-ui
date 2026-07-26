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
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NotificationService } from '../../../core/services/notification.service';
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardTitle,
  IonCheckbox,
  IonItem,
  IonLabel,
  IonList,
  IonSpinner,
} from '@ionic/angular/standalone';
import {
  CurrencyService,
  CurrencyConfigurationData,
  CurrencyData,
  CurrencyUpdateRequest,
} from '../../../api';

@Component({
  selector: 'app-currencies',
  standalone: true,
  imports: [
    TranslateModule,
    IonButton,
    IonSpinner,
    IonCardContent,
    IonCardTitle,
    IonCard,
    IonItem,
    IonLabel,
    IonList,
    IonCheckbox,
  ],
  template: `
    <ion-card>
      <ion-card-title>{{ 'CURRENCIES.TITLE' | translate }}</ion-card-title>
      <ion-card-content>
        @if (isLoading) {
          <div class="form-container" style="display:flex;justify-content:center;padding:2rem;">
            <ion-spinner name="crescent"></ion-spinner>
          </div>
        } @else {
          <div class="form-container" style="display:flex;gap:1rem;align-items:flex-start;">
            <div style="flex:1;">
              <h3>{{ 'CURRENCIES.AVAILABLE' | translate }}</h3>
              <ion-list>
                @for (currency of availableCurrencies; track currency.code) {
                  <ion-item>
                    <ion-checkbox
                      justify="start"
                      labelPlacement="end"
                      [checked]="availableSelection.has(currency.code!)"
                      (ionChange)="toggle(availableSelection, currency.code!, $event)"
                    >
                      {{ currency.displayLabel ?? currency.name }}
                    </ion-checkbox>
                  </ion-item>
                }
              </ion-list>
            </div>

            <div
              style="display:flex;flex-direction:column;gap:0.5rem;justify-content:center;padding-top:3rem;"
            >
              <ion-button color="primary" (click)="addSelected()">
                {{ 'CURRENCIES.ADD' | translate }} →
              </ion-button>
              <ion-button (click)="removeSelected()">
                ← {{ 'CURRENCIES.REMOVE' | translate }}
              </ion-button>
            </div>

            <div style="flex:1;">
              <h3>{{ 'CURRENCIES.SELECTED' | translate }}</h3>
              <ion-list>
                @for (currency of selectedCurrencies; track currency.code) {
                  <ion-item>
                    <ion-checkbox
                      justify="start"
                      labelPlacement="end"
                      [checked]="selectedSelection.has(currency.code!)"
                      (ionChange)="toggle(selectedSelection, currency.code!, $event)"
                    >
                      {{ currency.displayLabel ?? currency.name }}
                    </ion-checkbox>
                  </ion-item>
                }
              </ion-list>
            </div>
          </div>

          <div class="form-actions">
            <ion-button color="primary" (click)="save()">
              {{ 'CURRENCIES.SAVE' | translate }}
            </ion-button>
          </div>
        }
      </ion-card-content>
    </ion-card>
  `,
  styles: [],
})
export class CurrenciesComponent implements OnInit {
  private currencyService = inject(CurrencyService);
  private notifications = inject(NotificationService);
  private translate = inject(TranslateService);

  isLoading = true;
  availableCurrencies: CurrencyData[] = [];
  selectedCurrencies: CurrencyData[] = [];

  ngOnInit(): void {
    this.currencyService.getCurrencies().subscribe({
      next: (data: CurrencyConfigurationData) => {
        const selectedCodes = new Set((data.selectedCurrencyOptions ?? []).map((c) => c.code));
        this.selectedCurrencies = data.selectedCurrencyOptions ?? [];
        this.availableCurrencies = (data.currencyOptions ?? []).filter(
          (c) => !selectedCodes.has(c.code),
        );
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  /**
   * Checked codes on each side. mat-selection-list tracked this itself; ion-list does not,
   * so the two panes hold their own selection.
   */
  readonly availableSelection = new Set<string>();
  readonly selectedSelection = new Set<string>();

  toggle(selection: Set<string>, code: string, event: Event): void {
    const checked = (event as CustomEvent<{ checked?: boolean }>).detail?.checked;
    if (checked) selection.add(code);
    else selection.delete(code);
  }

  addSelected(): void {
    const toAdd = this.availableCurrencies.filter((c) => this.availableSelection.has(c.code!));
    const addCodes = new Set(toAdd.map((c) => c.code));
    this.selectedCurrencies = [...this.selectedCurrencies, ...toAdd];
    this.availableCurrencies = this.availableCurrencies.filter((c) => !addCodes.has(c.code));
    this.availableSelection.clear();
  }

  removeSelected(): void {
    const toRemove = this.selectedCurrencies.filter((c) => this.selectedSelection.has(c.code!));
    const removeCodes = new Set(toRemove.map((c) => c.code));
    this.availableCurrencies = [...this.availableCurrencies, ...toRemove];
    this.selectedCurrencies = this.selectedCurrencies.filter((c) => !removeCodes.has(c.code));
    this.selectedSelection.clear();
  }

  save(): void {
    const body: CurrencyUpdateRequest = {
      currencies: this.selectedCurrencies.map((c) => c.code as string),
    };
    this.currencyService.putCurrencies(body).subscribe({
      next: () => {
        this.translate.get('CURRENCIES.SAVED_SUCCESS').subscribe((msg: string) => {
          this.notifications.success(msg);
        });
      },
      error: () => {
        this.notifications.error('Save failed');
      },
    });
  }
}
