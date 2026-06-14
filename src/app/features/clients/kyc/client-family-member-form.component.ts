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

import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { ClientFamilyMemberService, ClientFamilyMemberRequest, CodeValueData } from '../../../api';
import {
  formatDateToFineract,
  FINERACT_DATE_FORMAT,
  FINERACT_LOCALE,
} from '../../../core/utils/date-formatter';

@Component({
  selector: 'app-client-family-member-form',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    TranslateModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
  ],
  template: `
    <div class="form-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>
            {{
              isEditMode
                ? ('CLIENTS.EDIT_FAMILY_MEMBER' | translate)
                : ('CLIENTS.ADD_FAMILY_MEMBER' | translate)
            }}
          </mat-card-title>
        </mat-card-header>

        <mat-card-content>
          <form #familyForm="ngForm" (ngSubmit)="onSubmit()" class="family-form">
            <div class="form-grid">
              <mat-form-field appearance="outline">
                <mat-label>{{ 'CLIENTS.FIRST_NAME' | translate }}</mat-label>
                <input matInput name="firstName" [(ngModel)]="member.firstName" required />
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>{{ 'CLIENTS.MIDDLE_NAME' | translate }}</mat-label>
                <input matInput name="middleName" [(ngModel)]="member.middleName" />
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>{{ 'CLIENTS.LAST_NAME' | translate }}</mat-label>
                <input matInput name="lastName" [(ngModel)]="member.lastName" required />
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>{{ 'CLIENTS.RELATIONSHIP' | translate }}</mat-label>
                <mat-select name="relationshipId" [(ngModel)]="member.relationshipId" required>
                  @for (opt of relationshipOptions(); track opt.id) {
                    <mat-option [value]="opt.id">{{ opt.name }}</mat-option>
                  }
                </mat-select>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>{{ 'CLIENTS.GENDER' | translate }}</mat-label>
                <mat-select name="genderId" [(ngModel)]="member.genderId">
                  @for (opt of genderOptions(); track opt.id) {
                    <mat-option [value]="opt.id">{{ opt.name }}</mat-option>
                  }
                </mat-select>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>{{ 'CLIENTS.MARITAL_STATUS' | translate }}</mat-label>
                <mat-select name="maritalStatusId" [(ngModel)]="member.maritalStatusId">
                  @for (opt of maritalStatusOptions(); track opt.id) {
                    <mat-option [value]="opt.id">{{ opt.name }}</mat-option>
                  }
                </mat-select>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>{{ 'CLIENTS.PROFESSION' | translate }}</mat-label>
                <mat-select name="professionId" [(ngModel)]="member.professionId">
                  @for (opt of professionOptions(); track opt.id) {
                    <mat-option [value]="opt.id">{{ opt.name }}</mat-option>
                  }
                </mat-select>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>{{ 'CLIENTS.QUALIFICATION' | translate }}</mat-label>
                <input matInput name="qualification" [(ngModel)]="member.qualification" />
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>{{ 'CLIENTS.MOBILE_NO' | translate }}</mat-label>
                <input matInput name="mobileNumber" [(ngModel)]="member.mobileNumber" />
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>{{ 'CLIENTS.DATE_OF_BIRTH' | translate }}</mat-label>
                <input
                  matInput
                  [matDatepicker]="dobPicker"
                  name="dateOfBirth"
                  [(ngModel)]="dateOfBirth"
                />
                <mat-datepicker-toggle matSuffix [for]="dobPicker"></mat-datepicker-toggle>
                <mat-datepicker #dobPicker></mat-datepicker>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>{{ 'CLIENTS.AGE' | translate }}</mat-label>
                <input matInput type="number" name="age" [(ngModel)]="member.age" />
              </mat-form-field>
            </div>

            <div class="checkbox-group">
              <mat-checkbox name="isDependent" [(ngModel)]="member.isDependent">
                {{ 'CLIENTS.IS_DEPENDENT' | translate }}
              </mat-checkbox>
            </div>

            <div class="form-actions">
              <button mat-button type="button" (click)="onCancel()">
                {{ 'COMMON.CANCEL' | translate }}
              </button>
              <button
                mat-raised-button
                color="primary"
                type="submit"
                [disabled]="!familyForm.form.valid"
              >
                {{ 'COMMON.SAVE' | translate }}
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
        max-width: 800px;
        margin: 0 auto;
      }
      .family-form {
        display: flex;
        flex-direction: column;
        gap: 16px;
        padding-top: 16px;
      }
      .form-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 16px;
      }
      .checkbox-group {
        margin: 8px 0;
      }
      .form-actions {
        display: flex;
        justify-content: flex-end;
        gap: 12px;
        margin-top: 16px;
      }
    `,
  ],
})
export class ClientFamilyMemberFormComponent implements OnInit {
  private readonly familyService = inject(ClientFamilyMemberService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  private readonly clientViewPath = '/clients/view';

  clientId!: number;
  memberId?: number;
  isEditMode = false;

  relationshipOptions = signal<CodeValueData[]>([]);
  genderOptions = signal<CodeValueData[]>([]);
  maritalStatusOptions = signal<CodeValueData[]>([]);
  professionOptions = signal<CodeValueData[]>([]);

  dateOfBirth?: Date;

  member: ClientFamilyMemberRequest = {
    firstName: '',
    middleName: '',
    lastName: '',
    relationshipId: undefined,
    genderId: undefined,
    maritalStatusId: undefined,
    professionId: undefined,
    qualification: '',
    mobileNumber: '',
    age: undefined,
    isDependent: false,
  };

  ngOnInit(): void {
    this.clientId = Number(this.route.snapshot.paramMap.get('clientId'));
    this.memberId = Number(this.route.snapshot.paramMap.get('id'));

    this.loadTemplate();

    if (this.memberId) {
      this.isEditMode = true;
      this.loadMemberData();
    }
  }

  loadTemplate(): void {
    this.familyService.getTemplate2(this.clientId).subscribe((data) => {
      this.relationshipOptions.set(data.relationshipIdOptions || []);
      this.genderOptions.set(data.genderIdOptions || []);
      this.maritalStatusOptions.set(data.maritalStatusIdOptions || []);
      this.professionOptions.set(data.professionIdOptions || []);
    });
  }

  loadMemberData(): void {
    this.familyService.getFamilyMember(this.memberId!, this.clientId).subscribe((data) => {
      this.member = {
        firstName: data.firstName,
        middleName: data.middleName,
        lastName: data.lastName,
        relationshipId: data.relationshipId,
        genderId: data.genderId,
        maritalStatusId: data.maritalStatusId,
        professionId: data.professionId,
        qualification: data.qualification,
        mobileNumber: data.mobileNumber,
        age: data.age,
        isDependent: data.isDependent,
      };
      if (data.dateOfBirth) {
        const dob = data.dateOfBirth as unknown as number[];
        this.dateOfBirth = new Date(dob[0], dob[1] - 1, dob[2]);
      }
    });
  }

  onSubmit(): void {
    const payload: ClientFamilyMemberRequest = {
      ...this.member,
      dateOfBirth: this.dateOfBirth ? formatDateToFineract(this.dateOfBirth) : undefined,
      dateFormat: FINERACT_DATE_FORMAT,
      locale: FINERACT_LOCALE,
    };

    if (this.isEditMode) {
      this.familyService
        .updateClientFamilyMembers(this.memberId!, this.clientId, payload)
        .subscribe({
          next: () => this.router.navigate([this.clientViewPath, this.clientId]),
          error: (err) => console.error('Failed to update family member', err),
        });
    } else {
      this.familyService.addClientFamilyMembers(this.clientId, payload).subscribe({
        next: () => this.router.navigate([this.clientViewPath, this.clientId]),
        error: (err) => console.error('Failed to add family member', err),
      });
    }
  }

  onCancel(): void {
    this.router.navigate([this.clientViewPath, this.clientId]);
  }
}
