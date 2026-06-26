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
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { GuarantorsService, GuarantorsRequest, EnumOptionData } from '../../../api';
import {
  formatDateToFineract,
  FINERACT_DATE_FORMAT,
  FINERACT_LOCALE,
} from '../../../core/utils/date-formatter';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

/**
 * Create / edit form for a loan guarantor. The guarantor-type options come from the
 * guarantor template endpoint; external (person) guarantors capture name/address,
 * while internal guarantors reference an existing client (entityId).
 */
@Component({
  selector: 'app-guarantor-form',
  standalone: true,
  imports: [
    FormsModule,
    TranslateModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  template: `
    <div class="form-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>
            {{ isEditMode ? ('GUARANTORS.EDIT' | translate) : ('GUARANTORS.CREATE' | translate) }}
          </mat-card-title>
        </mat-card-header>

        <mat-card-content>
          <form #guarantorForm="ngForm" (ngSubmit)="onSubmit()" class="guarantor-form">
            <mat-form-field appearance="outline">
              <mat-label>{{ 'GUARANTORS.TYPE' | translate }}</mat-label>
              <mat-select name="guarantorTypeId" [(ngModel)]="guarantor.guarantorTypeId" required>
                @for (opt of guarantorTypeOptions; track opt.id) {
                  <mat-option [value]="opt.id">{{ opt.value }}</mat-option>
                }
              </mat-select>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>{{ 'GUARANTORS.ENTITY_ID' | translate }}</mat-label>
              <input matInput type="number" name="entityId" [(ngModel)]="guarantor.entityId" />
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>{{ 'GUARANTORS.FIRST_NAME' | translate }}</mat-label>
              <input matInput name="firstname" [(ngModel)]="guarantor.firstname" />
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>{{ 'GUARANTORS.LAST_NAME' | translate }}</mat-label>
              <input matInput name="lastname" [(ngModel)]="guarantor.lastname" />
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>{{ 'GUARANTORS.ADDRESS_LINE1' | translate }}</mat-label>
              <input matInput name="addressLine1" [(ngModel)]="guarantor.addressLine1" />
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>{{ 'GUARANTORS.MOBILE_NUMBER' | translate }}</mat-label>
              <input matInput name="mobileNumber" [(ngModel)]="guarantor.mobileNumber" />
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>{{ 'GUARANTORS.SAVINGS_ID' | translate }}</mat-label>
              <input matInput type="number" name="savingsId" [(ngModel)]="guarantor.savingsId" />
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>{{ 'GUARANTORS.CLIENT_RELATIONSHIP_TYPE_ID' | translate }}</mat-label>
              <input
                matInput
                type="number"
                name="clientRelationshipTypeId"
                [(ngModel)]="guarantor.clientRelationshipTypeId"
              />
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>{{ 'GUARANTORS.AMOUNT' | translate }}</mat-label>
              <input matInput type="number" name="amount" [(ngModel)]="guarantor.amount" />
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>{{ 'GUARANTORS.DOB' | translate }}</mat-label>
              <input matInput [matDatepicker]="dobPicker" name="dobDate" [(ngModel)]="dobDate" />
              <mat-datepicker-toggle matSuffix [for]="dobPicker"></mat-datepicker-toggle>
              <mat-datepicker #dobPicker></mat-datepicker>
            </mat-form-field>

            <div class="form-actions">
              <button mat-button type="button" (click)="onCancel()" [disabled]="isSaving">
                {{ 'COMMON.CANCEL' | translate }}
              </button>
              <button
                mat-raised-button
                color="primary"
                type="submit"
                [disabled]="guarantorForm.invalid || isSaving"
              >
                @if (isSaving) {
                  <mat-spinner
                    diameter="20"
                    style="margin-right: 8px; display: inline-block; vertical-align: middle;"
                  ></mat-spinner>
                  {{ 'COMMON.SAVING' | translate }}
                } @else {
                  {{ 'COMMON.SAVE' | translate }}
                }
              </button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [
    `
      .form-container {
        padding: 24px;
        max-width: 600px;
        margin: 0 auto;
      }
      .guarantor-form {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }
    `,
  ],
})
export class GuarantorFormComponent implements OnInit {
  private readonly guarantorsService = inject(GuarantorsService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  loanId!: number;
  guarantorId: number | null = null;
  isEditMode = false;
  isSaving = false;

  guarantor: GuarantorsRequest = {};
  guarantorTypeOptions: EnumOptionData[] = [];
  dobDate: Date | null = null;

  ngOnInit(): void {
    this.loanId = Number(this.route.snapshot.paramMap.get('loanId'));

    this.guarantorsService.getLoansLoanIdGuarantorsTemplate(this.loanId).subscribe((tpl) => {
      this.guarantorTypeOptions = tpl.guarantorTypeOptions ?? [];
    });

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.guarantorId = +id;
      this.isEditMode = true;
      this.load();
    }
  }

  load(): void {
    if (!this.guarantorId) return;
    this.guarantorsService
      .getLoansLoanIdGuarantorsGuarantorId(this.loanId, this.guarantorId)
      .subscribe((data) => {
        this.guarantor = {
          guarantorTypeId: data.guarantorTypeId,
          entityId: data.entityId,
          firstname: data.firstname,
          lastname: data.lastname,
          addressLine1: data.addressLine1,
          mobileNumber: data.mobileNumber,
          savingsId: data.savingsId,
          clientRelationshipTypeId: data.clientRelationshipTypeId,
          amount: data.amount,
        };
        if (data.dob) {
          const dob = data.dob as unknown as number[];
          this.dobDate = Array.isArray(dob)
            ? new Date(dob[0], dob[1] - 1, dob[2])
            : new Date(data.dob);
        }
      });
  }

  onSubmit(): void {
    this.isSaving = true;
    const payload: GuarantorsRequest = {
      ...this.guarantor,
      locale: FINERACT_LOCALE,
      dateFormat: FINERACT_DATE_FORMAT,
    };
    if (this.dobDate) {
      payload.dob = formatDateToFineract(this.dobDate);
    }
    const request$ =
      this.isEditMode && this.guarantorId
        ? this.guarantorsService.putLoansLoanIdGuarantorsGuarantorId(
            this.loanId,
            this.guarantorId,
            payload,
          )
        : this.guarantorsService.postLoansLoanIdGuarantors(this.loanId, payload);

    request$.subscribe({
      next: () => this.router.navigate(['/loans', this.loanId, 'guarantors']),
      error: () => (this.isSaving = false),
    });
  }

  onCancel(): void {
    this.router.navigate(['/loans', this.loanId, 'guarantors']);
  }
}
