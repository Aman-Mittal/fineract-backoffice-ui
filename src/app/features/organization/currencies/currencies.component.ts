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
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
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
    MatCardModule,
    MatListModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    TranslateModule,
  ],
  template: `
    <mat-card>
      <mat-card-title>{{ 'CURRENCIES.TITLE' | translate }}</mat-card-title>
      <mat-card-content>
        @if (isLoading) {
          <div class="form-container" style="display:flex;justify-content:center;padding:2rem;">
            <mat-spinner></mat-spinner>
          </div>
        } @else {
          <div class="form-container" style="display:flex;gap:1rem;align-items:flex-start;">
            <div style="flex:1;">
              <h3>{{ 'CURRENCIES.AVAILABLE' | translate }}</h3>
              <mat-selection-list #availableList>
                @for (currency of availableCurrencies; track currency.code) {
                  <mat-list-option [value]="currency">
                    {{ currency.displayLabel ?? currency.name }}
                  </mat-list-option>
                }
              </mat-selection-list>
            </div>

            <div
              style="display:flex;flex-direction:column;gap:0.5rem;justify-content:center;padding-top:3rem;"
            >
              <button
                mat-raised-button
                color="primary"
                (click)="addSelected(availableList.selectedOptions.selected)"
              >
                {{ 'CURRENCIES.ADD' | translate }} →
              </button>
              <button
                mat-raised-button
                (click)="removeSelected(selectedList.selectedOptions.selected)"
              >
                ← {{ 'CURRENCIES.REMOVE' | translate }}
              </button>
            </div>

            <div style="flex:1;">
              <h3>{{ 'CURRENCIES.SELECTED' | translate }}</h3>
              <mat-selection-list #selectedList>
                @for (currency of selectedCurrencies; track currency.code) {
                  <mat-list-option [value]="currency">
                    {{ currency.displayLabel ?? currency.name }}
                  </mat-list-option>
                }
              </mat-selection-list>
            </div>
          </div>

          <div class="form-actions">
            <button mat-raised-button color="primary" (click)="save()">
              {{ 'CURRENCIES.SAVE' | translate }}
            </button>
          </div>
        }
      </mat-card-content>
    </mat-card>
  `,
  styles: [],
})
export class CurrenciesComponent implements OnInit {
  private currencyService = inject(CurrencyService);
  private snackBar = inject(MatSnackBar);
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

  addSelected(selected: { value: CurrencyData }[]): void {
    const toAdd = selected.map((s) => s.value);
    const addCodes = new Set(toAdd.map((c) => c.code));
    this.selectedCurrencies = [...this.selectedCurrencies, ...toAdd];
    this.availableCurrencies = this.availableCurrencies.filter((c) => !addCodes.has(c.code));
  }

  removeSelected(selected: { value: CurrencyData }[]): void {
    const toRemove = selected.map((s) => s.value);
    const removeCodes = new Set(toRemove.map((c) => c.code));
    this.availableCurrencies = [...this.availableCurrencies, ...toRemove];
    this.selectedCurrencies = this.selectedCurrencies.filter((c) => !removeCodes.has(c.code));
  }

  save(): void {
    const body: CurrencyUpdateRequest = {
      currencies: this.selectedCurrencies.map((c) => c.code as string),
    };
    this.currencyService.putCurrencies(body).subscribe({
      next: () => {
        this.translate.get('CURRENCIES.SAVED_SUCCESS').subscribe((msg: string) => {
          this.snackBar.open(msg, undefined, { duration: 3000 });
        });
      },
      error: () => {
        this.snackBar.open('Save failed', undefined, { duration: 3000 });
      },
    });
  }
}
