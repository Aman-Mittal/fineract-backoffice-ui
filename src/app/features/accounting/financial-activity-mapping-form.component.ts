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
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MappingFinancialActivitiesToAccountsService } from '../../api/api/mappingFinancialActivitiesToAccounts.service';

@Component({
  selector: 'app-financial-activity-mapping-form',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
  ],
  template: `
    <div class="container">
      <h1>{{ isEdit ? 'Edit' : 'Define' }} Financial Activity Mapping</h1>

      <form [formGroup]="mappingForm" (ngSubmit)="onSubmit()">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Financial Activity</mat-label>
          <mat-select formControlName="financialActivityId" required>
            @for (activity of activities; track activity['id']) {
              <mat-option [value]="activity['id']">
                {{ activity['name'] }}
              </mat-option>
            }
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>GL Account</mat-label>
          <mat-select formControlName="glAccountId" required>
            @for (account of filteredAccounts; track account['id']) {
              <mat-option [value]="account['id']">
                {{ account['name'] }} ({{ account['glCode'] }})
              </mat-option>
            }
          </mat-select>
        </mat-form-field>

        <div class="actions">
          <button mat-button type="button" routerLink="/accounting/financial-activity-mappings">
            Cancel
          </button>
          <button mat-raised-button color="primary" type="submit" [disabled]="mappingForm.invalid">
            {{ isEdit ? 'Update' : 'Define' }}
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [
    `
      .container {
        padding: 20px;
        max-width: 600px;
        margin: 0 auto;
      }
      .full-width {
        width: 100%;
        margin-bottom: 15px;
      }
      .actions {
        display: flex;
        justify-content: flex-end;
        gap: 10px;
        margin-top: 20px;
      }
    `,
  ],
})
export class FinancialActivityMappingFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private financialActivityService = inject(MappingFinancialActivitiesToAccountsService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  mappingForm: FormGroup;
  isEdit = false;
  mappingId?: number;

  activities: Record<string, unknown>[] = [];
  glAccountOptions: Record<string, unknown> = {};
  filteredAccounts: Record<string, unknown>[] = [];

  constructor() {
    this.mappingForm = this.fb.group({
      financialActivityId: ['', Validators.required],
      glAccountId: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.mappingId = Number(this.route.snapshot.paramMap.get('id'));
    this.isEdit = !!this.mappingId;

    this.loadTemplate();

    this.mappingForm.get('financialActivityId')?.valueChanges.subscribe((activityId) => {
      this.updateFilteredAccounts(activityId);
    });

    if (this.isEdit) {
      this.loadMapping();
    }
  }

  loadTemplate() {
    this.financialActivityService.retrieveTemplate().subscribe((template) => {
      const templateData = template as Record<string, unknown>;
      this.activities = (templateData['financialActivityOptions'] as Record<string, unknown>[]) || [];
      this.glAccountOptions = (templateData['glAccountOptions'] as Record<string, unknown>) || {};
      const currentActivityId = this.mappingForm.get('financialActivityId')?.value;
      if (currentActivityId) {
        this.updateFilteredAccounts(currentActivityId);
      }
    });
  }

  loadMapping() {
    this.financialActivityService.retreive(this.mappingId!).subscribe((mapping) => {
      const mappingData = mapping as Record<string, unknown>;
      const financialActivityData = mappingData['financialActivityData'] as
        | Record<string, unknown>
        | undefined;
      const glAccountData = mappingData['glAccountData'] as Record<string, unknown> | undefined;
      this.mappingForm.patchValue({
        financialActivityId: financialActivityData?.['id'],
        glAccountId: glAccountData?.['id'],
      });
    });
  }

  updateFilteredAccounts(activityId: number) {
    if (activityId >= 100 && activityId < 200) {
      this.filteredAccounts =
        (this.glAccountOptions['assetAccountOptions'] as Record<string, unknown>[]) || [];
    } else if (activityId >= 200 && activityId < 300) {
      this.filteredAccounts =
        (this.glAccountOptions['liabilityAccountOptions'] as Record<string, unknown>[]) || [];
    } else if (activityId >= 300 && activityId < 400) {
      this.filteredAccounts =
        (this.glAccountOptions['equityAccountOptions'] as Record<string, unknown>[]) || [];
    } else {
      this.filteredAccounts = [];
    }
  }

  onSubmit() {
    if (this.mappingForm.invalid) return;

    const request = this.mappingForm.value;
    const obs = this.isEdit
      ? (this.financialActivityService.updateGLAccount(
          this.mappingId!,
          request,
        ) as Observable<unknown>)
      : (this.financialActivityService.createGLAccount(request) as Observable<unknown>);

    obs.subscribe(() => {
      this.router.navigate(['/accounting/financial-activity-mappings']);
    });
  }
}
