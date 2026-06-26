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
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { TranslateModule } from '@ngx-translate/core';
import {
  InterOperationService,
  InteropIdentifierAccountResponseData,
  InteropIdentifierRequestData,
} from '../../api';

type IdType =
  | 'MSISDN'
  | 'EMAIL'
  | 'PERSONAL_ID'
  | 'BUSINESS'
  | 'DEVICE'
  | 'ACCOUNT_ID'
  | 'IBAN'
  | 'ALIAS'
  | 'BBAN';

const CLOSE_LABEL = 'Close';
const ERROR_OCCURRED = 'Error occurred';

@Component({
  selector: 'app-interop-party-lookup',
  standalone: true,
  imports: [
    FormsModule,
    JsonPipe,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    TranslateModule,
  ],
  template: `
    <mat-card>
      <mat-card-header>
        <mat-card-title>{{ 'INTEROP.PARTY_TITLE' | translate }}</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <div class="form-row">
          <mat-form-field>
            <mat-label>{{ 'INTEROP.ID_TYPE' | translate }}</mat-label>
            <input matInput [(ngModel)]="idType" placeholder="e.g. MSISDN" />
          </mat-form-field>

          <mat-form-field>
            <mat-label>{{ 'INTEROP.ID_VALUE' | translate }}</mat-label>
            <input matInput [(ngModel)]="idValue" />
          </mat-form-field>

          <mat-form-field>
            <mat-label>{{ 'INTEROP.SUB_ID' | translate }}</mat-label>
            <input matInput [(ngModel)]="subIdOrType" />
          </mat-form-field>
        </div>

        <div class="button-row">
          <button mat-raised-button color="primary" (click)="lookup()" [disabled]="isLoading">
            {{ 'INTEROP.LOOKUP' | translate }}
          </button>
          <button mat-raised-button color="accent" (click)="register()" [disabled]="isLoading">
            {{ 'INTEROP.REGISTER' | translate }}
          </button>
          <button mat-raised-button color="warn" (click)="deregister()" [disabled]="isLoading">
            {{ 'INTEROP.DEREGISTER' | translate }}
          </button>
        </div>

        @if (isLoading) {
          <mat-spinner diameter="40"></mat-spinner>
        }

        @if (result()) {
          <h3>{{ 'INTEROP.RESULT' | translate }}</h3>
          <pre>{{ result() | json }}</pre>
        }
      </mat-card-content>
    </mat-card>
  `,
  styles: [
    `
      .form-row {
        display: flex;
        gap: 16px;
        flex-wrap: wrap;
        margin-bottom: 16px;
      }
      .button-row {
        display: flex;
        gap: 12px;
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
export class InteropPartyLookupComponent {
  private interopService = inject(InterOperationService);
  private snackBar = inject(MatSnackBar);

  result = signal<InteropIdentifierAccountResponseData | null>(null);
  isLoading = false;
  idType = '';
  idValue = '';
  subIdOrType = '';

  lookup(): void {
    if (!this.idType || !this.idValue) return;
    this.isLoading = true;
    this.result.set(null);
    const obs$ = this.subIdOrType
      ? this.interopService.getInteroperationPartiesIdTypeIdValueSubIdOrType(
          this.idType as IdType,
          this.idValue,
          this.subIdOrType,
        )
      : this.interopService.getInteroperationPartiesIdTypeIdValue(
          this.idType as IdType,
          this.idValue,
        );
    obs$.subscribe({
      next: (data) => {
        this.result.set(data);
        this.isLoading = false;
      },
      error: (err: { message?: string }) => {
        this.snackBar.open(err.message || ERROR_OCCURRED, CLOSE_LABEL, { duration: 4000 });
        this.isLoading = false;
      },
    });
  }

  register(): void {
    if (!this.idType || !this.idValue) return;
    this.isLoading = true;
    this.result.set(null);
    const body = {};
    const obs$ = this.subIdOrType
      ? this.interopService.postInteroperationPartiesIdTypeIdValueSubIdOrType(
          this.idType as IdType,
          this.idValue,
          this.subIdOrType,
          body as InteropIdentifierRequestData,
        )
      : this.interopService.postInteroperationPartiesIdTypeIdValue(
          this.idType as IdType,
          this.idValue,
          body as InteropIdentifierRequestData,
        );
    obs$.subscribe({
      next: (data) => {
        this.result.set(data);
        this.isLoading = false;
      },
      error: (err: { message?: string }) => {
        this.snackBar.open(err.message || ERROR_OCCURRED, CLOSE_LABEL, { duration: 4000 });
        this.isLoading = false;
      },
    });
  }

  deregister(): void {
    if (!this.idType || !this.idValue) return;
    this.isLoading = true;
    this.result.set(null);
    const body = {};
    const obs$ = this.subIdOrType
      ? this.interopService.deleteInteroperationPartiesIdTypeIdValueSubIdOrType(
          this.idType as IdType,
          this.idValue,
          this.subIdOrType,
          body as InteropIdentifierRequestData,
        )
      : this.interopService.deleteInteroperationPartiesIdTypeIdValue(
          this.idType as IdType,
          this.idValue,
          body as InteropIdentifierRequestData,
        );
    obs$.subscribe({
      next: (data) => {
        this.result.set(data);
        this.isLoading = false;
      },
      error: (err: { message?: string }) => {
        this.snackBar.open(err.message || ERROR_OCCURRED, CLOSE_LABEL, { duration: 4000 });
        this.isLoading = false;
      },
    });
  }
}
