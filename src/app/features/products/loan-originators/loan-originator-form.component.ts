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
import {
  LoanOriginatorsService,
  PostLoanOriginatorsRequest,
  GetCodeValuesDataResponse,
} from '../../../api';

/**
 * Create / edit form for a loan originator master-data record.
 * Originator-type, channel-type and status options come from the originator template endpoint.
 */
@Component({
  selector: 'app-loan-originator-form',
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
  ],
  template: `
    <div class="form-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>
            {{
              isEditMode
                ? ('LOAN_ORIGINATORS.EDIT' | translate)
                : ('LOAN_ORIGINATORS.CREATE' | translate)
            }}
          </mat-card-title>
        </mat-card-header>

        <mat-card-content>
          <form #originatorForm="ngForm" (ngSubmit)="onSubmit()" class="originator-form">
            <mat-form-field appearance="outline">
              <mat-label>{{ 'LOAN_ORIGINATORS.NAME' | translate }}</mat-label>
              <input matInput name="name" [(ngModel)]="originator.name" required />
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>{{ 'LOAN_ORIGINATORS.EXTERNAL_ID' | translate }}</mat-label>
              <input matInput name="externalId" [(ngModel)]="originator.externalId" />
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>{{ 'LOAN_ORIGINATORS.ORIGINATOR_TYPE' | translate }}</mat-label>
              <mat-select name="originatorTypeId" [(ngModel)]="originator.originatorTypeId">
                @for (opt of originatorTypeOptions; track opt.id) {
                  <mat-option [value]="opt.id">{{ opt.name }}</mat-option>
                }
              </mat-select>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>{{ 'LOAN_ORIGINATORS.CHANNEL_TYPE' | translate }}</mat-label>
              <mat-select name="channelTypeId" [(ngModel)]="originator.channelTypeId">
                @for (opt of channelTypeOptions; track opt.id) {
                  <mat-option [value]="opt.id">{{ opt.name }}</mat-option>
                }
              </mat-select>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>{{ 'LOAN_ORIGINATORS.STATUS' | translate }}</mat-label>
              <mat-select name="status" [(ngModel)]="originator.status">
                @for (opt of statusOptions; track opt) {
                  <mat-option [value]="opt">{{ opt }}</mat-option>
                }
              </mat-select>
            </mat-form-field>

            <div class="form-actions">
              <button mat-button type="button" (click)="onCancel()" [disabled]="isSaving">
                {{ 'COMMON.CANCEL' | translate }}
              </button>
              <button
                mat-raised-button
                color="primary"
                type="submit"
                [disabled]="originatorForm.invalid || isSaving"
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
      .originator-form {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }
    `,
  ],
})
export class LoanOriginatorFormComponent implements OnInit {
  private readonly originatorsService = inject(LoanOriginatorsService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  private readonly LIST_PATH = '/products/loan-originators';

  originatorId: number | null = null;
  isEditMode = false;
  isSaving = false;

  originator: PostLoanOriginatorsRequest = { name: '' };
  originatorTypeOptions: GetCodeValuesDataResponse[] = [];
  channelTypeOptions: GetCodeValuesDataResponse[] = [];
  statusOptions: string[] = [];

  ngOnInit(): void {
    this.originatorsService.getLoanOriginatorsTemplate().subscribe((tpl) => {
      this.originatorTypeOptions = tpl.originatorTypeOptions ?? [];
      this.channelTypeOptions = tpl.channelTypeOptions ?? [];
      this.statusOptions = tpl.statusOptions ? Array.from(tpl.statusOptions) : [];
    });

    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.originatorId = +id;
        this.isEditMode = true;
        this.load();
      }
    });
  }

  load(): void {
    if (!this.originatorId) return;
    this.originatorsService.getLoanOriginatorsOriginatorId(this.originatorId).subscribe((data) => {
      this.originator = {
        name: data.name ?? '',
        externalId: data.externalId,
        originatorTypeId: data.originatorType?.id,
        channelTypeId: data.channelType?.id,
        status: data.status,
      };
    });
  }

  onSubmit(): void {
    this.isSaving = true;
    const request$ =
      this.isEditMode && this.originatorId
        ? this.originatorsService.putLoanOriginatorsOriginatorId(this.originatorId, {
            name: this.originator.name,
            originatorTypeId: this.originator.originatorTypeId,
            channelTypeId: this.originator.channelTypeId,
            status: this.originator.status,
          })
        : this.originatorsService.postLoanOriginators(this.originator);

    request$.subscribe({
      next: () => this.router.navigate([this.LIST_PATH]),
      error: () => (this.isSaving = false),
    });
  }

  onCancel(): void {
    this.router.navigate([this.LIST_PATH]);
  }
}
