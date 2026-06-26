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

import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  OnChanges,
  SimpleChanges,
  Output,
  inject,
} from '@angular/core';

import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TranslateModule } from '@ngx-translate/core';
import { debounceTime, distinctUntilChanged, filter, switchMap, startWith } from 'rxjs/operators';
import { ClientService, GetClientsResponse } from '../../../api';

/**
 * Reusable client search component with autocomplete.
 *
 * Allows users to search for clients by name and select one.
 * Emits the selected client's ID.
 */
@Component({
  selector: 'app-client-search',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule,
    TranslateModule,
  ],
  template: `
    <mat-form-field appearance="outline" class="full-width">
      <mat-label>{{ label | translate }}</mat-label>
      <input
        type="text"
        matInput
        [formControl]="searchControl"
        [matAutocomplete]="auto"
        [placeholder]="'COMMON.SEARCH_PLACEHOLDER' | translate"
        [required]="required"
      />
      <mat-autocomplete
        #auto="matAutocomplete"
        [displayWith]="displayFn"
        (optionSelected)="onSelected($event.option.value)"
      >
        @for (client of filteredClients; track client['id']) {
          <mat-option [value]="client">
            {{ client['displayName'] }} ({{ client['accountNo'] }})
          </mat-option>
        }
        @if (isLoading) {
          <mat-option disabled>
            {{ 'COMMON.LOADING' | translate }}
          </mat-option>
        }
        @if (!isLoading && searchControl.value && filteredClients.length === 0) {
          <mat-option disabled>
            {{ 'COMMON.NO_DATA' | translate }}
          </mat-option>
        }
      </mat-autocomplete>
    </mat-form-field>
  `,
  styles: [
    `
      .full-width {
        width: 100%;
      }
    `,
  ],
})
export class ClientSearchComponent implements OnInit, OnChanges {
  private readonly clientService = inject(ClientService);

  @Input() label = 'COMMON.CLIENT';
  @Input() required = false;
  @Input() initialClientId: number | null = null;

  @Output() clientSelected = new EventEmitter<number>();

  searchControl = new FormControl<string | Record<string, unknown>>('');
  filteredClients: Record<string, unknown>[] = [];
  isLoading = false;

  ngOnInit(): void {
    this.searchControl.valueChanges
      .pipe(
        startWith(''),
        debounceTime(300),
        distinctUntilChanged(),
        filter((value) => typeof value === 'string'),
        switchMap((value) => {
          this.isLoading = true;
          const searchTerm =
            typeof value === 'string' && value.length > 0 ? value + '%' : undefined;
          return this.clientService.getClients(
            undefined,
            undefined,
            searchTerm,
            undefined,
            undefined,
            undefined,
            undefined,
            0,
            20,
          );
        }),
      )
      .subscribe({
        next: (response: GetClientsResponse) => {
          this.filteredClients =
            (Array.from(response.pageItems || []) as Record<string, unknown>[]) || [];
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
          this.filteredClients = [];
        },
      });

    this.loadInitialClient();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['initialClientId'] && !changes['initialClientId'].isFirstChange()) {
      this.loadInitialClient();
    }
  }

  private loadInitialClient(): void {
    if (this.initialClientId) {
      this.clientService.getClientsClientId(this.initialClientId).subscribe((client) => {
        this.searchControl.setValue(client as Record<string, unknown>, { emitEvent: false });
      });
    }
  }

  displayFn(client: Record<string, unknown> | string | null): string {
    if (typeof client === 'string') {
      return client;
    }
    return client && client['displayName'] ? (client['displayName'] as string) : '';
  }

  onSelected(client: Record<string, unknown> | null): void {
    if (client && client['id']) {
      this.clientSelected.emit(client['id'] as number);
    }
  }
}
