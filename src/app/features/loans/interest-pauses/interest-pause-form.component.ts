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
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { LoanInterestPauseService, InterestPauseRequestDto } from '../../../api';
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonSpinner,
} from '@ionic/angular/standalone';
import {
  formatDateToFineract,
  FINERACT_DATE_FORMAT,
  FINERACT_LOCALE,
} from '../../../core/utils/date-formatter';

/**
 * Create form for an interest pause period on a loan. Submits a start/end date pair
 * formatted with the Fineract date format and locale. The loan id is taken from the route.
 */
@Component({
  selector: 'app-interest-pause-form',
  standalone: true,
  imports: [
    FormsModule,
    TranslateModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    IonButton,
    IonSpinner,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonCard,
  ],
  template: `
    <div class="form-container">
      <ion-card>
        <ion-card-header>
          <ion-card-title>{{ 'INTEREST_PAUSES.CREATE' | translate }}</ion-card-title>
        </ion-card-header>

        <ion-card-content>
          <form #pauseForm="ngForm" (ngSubmit)="onSubmit()" class="pause-form">
            <mat-form-field appearance="outline">
              <mat-label>{{ 'INTEREST_PAUSES.START_DATE' | translate }}</mat-label>
              <input
                matInput
                [matDatepicker]="startPicker"
                name="startDate"
                [(ngModel)]="startDate"
                required
              />
              <mat-datepicker-toggle matSuffix [for]="startPicker"></mat-datepicker-toggle>
              <mat-datepicker #startPicker></mat-datepicker>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>{{ 'INTEREST_PAUSES.END_DATE' | translate }}</mat-label>
              <input
                matInput
                [matDatepicker]="endPicker"
                name="endDate"
                [(ngModel)]="endDate"
                required
              />
              <mat-datepicker-toggle matSuffix [for]="endPicker"></mat-datepicker-toggle>
              <mat-datepicker #endPicker></mat-datepicker>
            </mat-form-field>

            <div class="form-actions">
              <ion-button fill="clear" type="button" (click)="onCancel()" [disabled]="isSaving">
                {{ 'COMMON.CANCEL' | translate }}
              </ion-button>
              <ion-button color="primary" type="submit" [disabled]="pauseForm.invalid || isSaving">
                @if (isSaving) {
                  <ion-spinner name="crescent"></ion-spinner>
                  {{ 'COMMON.SAVING' | translate }}
                } @else {
                  {{ 'COMMON.SAVE' | translate }}
                }
              </ion-button>
            </div>
          </form>
        </ion-card-content>
      </ion-card>
    </div>
  `,
  styles: [
    `
      .form-container {
        padding: 24px;
        max-width: 600px;
        margin: 0 auto;
      }
      .pause-form {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }
    `,
  ],
})
export class InterestPauseFormComponent implements OnInit {
  private readonly pauseService = inject(LoanInterestPauseService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  loanId: number | null = null;
  isSaving = false;

  startDate: Date | null = null;
  endDate: Date | null = null;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('loanId');
    if (id) {
      this.loanId = +id;
    }
  }

  onSubmit(): void {
    if (!this.loanId) return;
    this.isSaving = true;

    const request: InterestPauseRequestDto = {
      startDate: formatDateToFineract(this.startDate),
      endDate: formatDateToFineract(this.endDate),
      dateFormat: FINERACT_DATE_FORMAT,
      locale: FINERACT_LOCALE,
    };

    this.pauseService.postLoansLoanIdInterestPauses(this.loanId, request).subscribe({
      next: () => this.router.navigate(['/loans', this.loanId, 'interest-pauses']),
      error: () => (this.isSaving = false),
    });
  }

  onCancel(): void {
    this.router.navigate(['/loans', this.loanId, 'interest-pauses']);
  }
}
