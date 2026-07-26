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
import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonGrid,
  IonRow,
  IonCol,
  IonItem,
  IonLabel,
  IonSelect,
  IonSelectOption,
  IonInput,
  IonTextarea,
  IonToggle,
  IonButton,
  IonSpinner,
  IonDatetime,
  IonDatetimeButton,
  IonModal,
} from '@ionic/angular/standalone';
import {
  TellerCashManagementService,
  StaffService,
  PostTellersTellerIdCashiersRequest,
  StaffData,
} from '../../../api';

@Component({
  selector: 'app-cashier-form',
  standalone: true,
  imports: [
    FormsModule,
    TranslateModule,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonGrid,
    IonRow,
    IonCol,
    IonItem,
    IonLabel,
    IonSelect,
    IonSelectOption,
    IonInput,
    IonTextarea,
    IonToggle,
    IonButton,
    IonSpinner,
    IonDatetime,
    IonDatetimeButton,
    IonModal,
  ],
  template: `
    <div class="form-container">
      <ion-card>
        <ion-card-header>
          <ion-card-title>{{ 'TELLERS.ALLOCATE_CASHIER' | translate }}</ion-card-title>
        </ion-card-header>

        <ion-card-content>
          <form #cashierForm="ngForm" (ngSubmit)="onSubmit()" class="cashier-form">
            <ion-grid class="ion-no-padding">
              <ion-row>
                <!-- Staff Selection -->
                <ion-col size="12" size-md="6">
                  <ion-item fill="outline" [attr.title]="'HELP.CASHIER_STAFF_DESC' | translate">
                    <ion-label position="stacked">{{ 'TELLERS.STAFF' | translate }}</ion-label>
                    <ion-select
                      name="staffId"
                      [(ngModel)]="cashier.staffId"
                      required
                      id="cashier-staff-select"
                      data-testid="cashier-staff-select"
                    >
                      @for (member of staff; track member.id) {
                        <ion-select-option [value]="member.id">{{
                          member.displayName
                        }}</ion-select-option>
                      }
                    </ion-select>
                  </ion-item>
                </ion-col>

                <!-- Start Date -->
                <ion-col size="12" size-md="6">
                  <ion-item fill="outline">
                    <ion-label position="stacked">{{ 'TELLERS.START_DATE' | translate }}</ion-label>
                    <ion-datetime-button datetime="cashier-start-date-picker"></ion-datetime-button>
                    <ion-modal [keepContentsMounted]="true">
                      <ng-template>
                        <ion-datetime
                          id="cashier-start-date-picker"
                          data-testid="cashier-start-date-picker"
                          presentation="date"
                          (ionChange)="onStartDateChange($event)"
                        ></ion-datetime>
                      </ng-template>
                    </ion-modal>
                  </ion-item>
                </ion-col>

                <!-- End Date -->
                <ion-col size="12" size-md="6">
                  <ion-item fill="outline">
                    <ion-label position="stacked">{{ 'TELLERS.END_DATE' | translate }}</ion-label>
                    <ion-datetime-button datetime="cashier-end-date-picker"></ion-datetime-button>
                    <ion-modal [keepContentsMounted]="true">
                      <ng-template>
                        <ion-datetime
                          id="cashier-end-date-picker"
                          data-testid="cashier-end-date-picker"
                          presentation="date"
                          (ionChange)="onEndDateChange($event)"
                        ></ion-datetime>
                      </ng-template>
                    </ion-modal>
                  </ion-item>
                </ion-col>

                <!-- Full Time Toggle -->
                <ion-col size="12" size-md="6">
                  <ion-item>
                    <ion-label>{{ 'TELLERS.IS_FULL_TIME' | translate }}</ion-label>
                    <ion-toggle
                      name="isFullDay"
                      [(ngModel)]="cashier.isFullDay"
                      id="cashier-full-day-toggle"
                      data-testid="cashier-full-day-toggle"
                      slot="end"
                    ></ion-toggle>
                  </ion-item>
                </ion-col>

                <!-- Description -->
                <ion-col size="12">
                  <ion-item fill="outline" class="full-width">
                    <ion-label position="stacked">{{ 'COMMON.NOTE' | translate }}</ion-label>
                    <ion-textarea
                      name="description"
                      [(ngModel)]="cashier.description"
                      rows="2"
                      id="cashier-description-textarea"
                      data-testid="cashier-description-textarea"
                    ></ion-textarea>
                  </ion-item>
                </ion-col>
              </ion-row>
            </ion-grid>

            <div class="form-actions">
              <ion-button
                fill="clear"
                color="medium"
                type="button"
                (click)="onCancel()"
                [disabled]="isSaving"
                id="cashier-cancel-btn"
                data-testid="cashier-cancel-btn"
              >
                {{ 'COMMON.CANCEL' | translate }}
              </ion-button>
              <ion-button
                color="primary"
                type="submit"
                [disabled]="cashierForm.invalid || isSaving"
                id="cashier-submit-btn"
                data-testid="cashier-submit-btn"
              >
                @if (isSaving) {
                  <ion-spinner name="crescent" slot="start"></ion-spinner>
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
})
export class CashierFormComponent implements OnInit {
  private readonly tellerService = inject(TellerCashManagementService);
  private readonly staffService = inject(StaffService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  tellerId = 0;
  isSaving = false;

  cashier: PostTellersTellerIdCashiersRequest = {
    isFullDay: true,
  };

  startDate: Date = new Date();
  endDate: Date = new Date();
  staff: StaffData[] = [];

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.tellerId = +params['tellerId'];
    });
    this.loadStaff();
  }

  onStartDateChange(event: CustomEvent): void {
    if (event.detail.value) {
      this.startDate = new Date(event.detail.value as string);
    }
  }

  onEndDateChange(event: CustomEvent): void {
    if (event.detail.value) {
      this.endDate = new Date(event.detail.value as string);
    }
  }

  private loadStaff(): void {
    this.staffService.getStaff().subscribe({
      next: (data: StaffData[]) => {
        this.staff = data || [];
      },
      error: (err: unknown) => {
        console.error('Failed to load staff', err);
      },
    });
  }

  onSubmit(): void {
    this.isSaving = true;

    const formattedStartDate = `${this.startDate.getFullYear()}-${String(this.startDate.getMonth() + 1).padStart(2, '0')}-${String(this.startDate.getDate()).padStart(2, '0')}`;
    const formattedEndDate = `${this.endDate.getFullYear()}-${String(this.endDate.getMonth() + 1).padStart(2, '0')}-${String(this.endDate.getDate()).padStart(2, '0')}`;

    this.cashier.startDate = formattedStartDate;
    this.cashier.endDate = formattedEndDate;
    this.cashier.dateFormat = 'yyyy-MM-dd';
    this.cashier.locale = 'en';

    this.tellerService.postTellersTellerIdCashiers(this.tellerId, this.cashier).subscribe({
      next: () => this.router.navigate(['/tellers', this.tellerId, 'cashiers']),
      error: () => (this.isSaving = false),
    });
  }

  onCancel(): void {
    this.router.navigate(['/tellers', this.tellerId, 'cashiers']);
  }
}
