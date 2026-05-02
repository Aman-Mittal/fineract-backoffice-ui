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
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { GroupsService, OfficesService, PostGroupsRequest, PutGroupsGroupIdRequest, GetOfficesResponse } from '../../api';

@Component({
  selector: 'app-group-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCheckboxModule,
    MatTooltipModule,
    MatIconModule
  ],
  template: `
    <div class="form-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>
            {{ isEditMode ? ('GROUPS.EDIT_GROUP' | translate) : ('GROUPS.CREATE_GROUP' | translate) }}
          </mat-card-title>
        </mat-card-header>
        
        <mat-card-content>
          <form #groupForm="ngForm" (ngSubmit)="onSubmit()" class="group-form">
            <div class="form-grid">
              <mat-form-field appearance="outline" [matTooltip]="'HELP.GROUP_NAME_DESC' | translate">
                <mat-label>{{ 'GROUPS.NAME' | translate }}</mat-label>
                <input matInput name="name" [(ngModel)]="group.name" required>
              </mat-form-field>

              <mat-form-field appearance="outline" [matTooltip]="'HELP.OFFICE_DESC' | translate">
                <mat-label>{{ 'COMMON.OFFICE' | translate }}</mat-label>
                <mat-select name="officeId" [(ngModel)]="group.officeId" required [disabled]="isEditMode">
                  @for (office of offices; track office.id) {
                    <mat-option [value]="office.id">{{ office.name }}</mat-option>
                  }
                </mat-select>
              </mat-form-field>

              <div class="checkbox-container">
                <mat-checkbox name="active" [(ngModel)]="group.active" [disabled]="isEditMode">
                  {{ 'COMMON.ACTIVE' | translate }}
                </mat-checkbox>
                <mat-icon [matTooltip]="'HELP.ACTIVE_DESC' | translate" class="help-icon">help_outline</mat-icon>
              </div>
            </div>

            <div class="form-actions">
              <button mat-button type="button" (click)="onCancel()">{{ 'COMMON.CANCEL' | translate }}</button>
              <button mat-raised-button color="primary" type="submit" [disabled]="groupForm.invalid || isSaving">
                {{ isSaving ? ('COMMON.SAVING' | translate) : ('COMMON.SAVE' | translate) }}
              </button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .form-container {
      padding: 24px;
      max-width: 900px;
      margin: 0 auto;
    }
    .group-form {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    .form-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 16px;
    }
    mat-form-field {
      width: 100%;
    }
    .checkbox-container {
      display: flex;
      align-items: center;
      gap: 8px;
      height: 60px;
    }
    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      margin-top: 16px;
    }
    .help-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
      color: #7f8c8d;
      cursor: help;
    }
  `]
})
export class GroupFormComponent implements OnInit {
  private readonly groupsService = inject(GroupsService);
  private readonly officesService = inject(OfficesService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  private readonly LIST_PATH = '/groups';

  groupId: number | null = null;
  isEditMode = false;
  isSaving = false;
  
  group: PostGroupsRequest = {
    active: true
  };
  
  offices: GetOfficesResponse[] = [];

  ngOnInit() {
    this.loadOffices();
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.groupId = +id;
        this.isEditMode = true;
        this.loadGroupData();
      }
    });
  }

  loadOffices() {
    this.officesService.retrieveOffices(true).subscribe(offices => {
      this.offices = offices;
    });
  }

  loadGroupData() {
    if (!this.groupId) return;
    this.groupsService.retrieveOne15(this.groupId).subscribe(data => {
      this.group = {
        name: data.name,
        officeId: data.officeId,
        active: (data as Record<string, unknown>)['active'] as boolean
      };
    });
  }

  onSubmit() {
    this.isSaving = true;
    if (this.isEditMode && this.groupId) {
      const payload: PutGroupsGroupIdRequest = {
        name: this.group.name
      };
      this.groupsService.update13(this.groupId, payload).subscribe({
        next: () => this.router.navigate([this.LIST_PATH]),
        error: () => this.isSaving = false
      });
    } else {
      this.groupsService.create8(this.group).subscribe({
        next: () => this.router.navigate([this.LIST_PATH]),
        error: () => this.isSaving = false
      });
    }
  }

  onCancel() {
    this.router.navigate([this.LIST_PATH]);
  }
}
