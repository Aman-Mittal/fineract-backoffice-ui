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
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import {
  DataTablesService,
  PostDataTablesRequest,
  CodesService,
  GetCodesResponse,
} from '../../../api';

@Component({
  selector: 'app-datatables-form',
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
    MatIconModule,
    MatTooltipModule,
  ],
  template: `
    <div class="form-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>
            {{
              isEditMode
                ? ('SYSTEM.EDIT_DATA_TABLE' | translate)
                : ('SYSTEM.CREATE_DATA_TABLE' | translate)
            }}
          </mat-card-title>
        </mat-card-header>

        <mat-card-content>
          <form #dtForm="ngForm" (ngSubmit)="onSubmit()" class="dt-form">
            <div class="header-grid">
              <mat-form-field appearance="outline">
                <mat-label>{{ 'SYSTEM.TABLE_NAME' | translate }}</mat-label>
                <input
                  matInput
                  name="datatableName"
                  [(ngModel)]="datatable.datatableName"
                  required
                  [disabled]="isEditMode"
                />
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>{{ 'SYSTEM.APP_TABLE' | translate }}</mat-label>
                <mat-select
                  name="apptableName"
                  [(ngModel)]="datatable.apptableName"
                  required
                  [disabled]="isEditMode"
                >
                  @for (table of appTables; track table) {
                    <mat-option [value]="table">{{ table }}</mat-option>
                  }
                </mat-select>
              </mat-form-field>
            </div>

            <div class="checkbox-row">
              <mat-checkbox
                name="multiRow"
                [(ngModel)]="datatable.multiRow"
                [disabled]="isEditMode"
              >
                {{ 'SYSTEM.MULTI_ROW' | translate }}
              </mat-checkbox>
            </div>

            <div class="columns-section">
              <h3>{{ 'SYSTEM.COLUMNS' | translate }}</h3>

              @for (column of datatable.columns; track $index; let i = $index) {
                <div class="column-row">
                  <mat-form-field appearance="outline">
                    <mat-label>{{ 'COMMON.NAME' | translate }}</mat-label>
                    <input
                      matInput
                      [name]="'colName' + i"
                      [(ngModel)]="column.name"
                      required
                      [disabled]="isEditMode"
                    />
                  </mat-form-field>

                  <mat-form-field appearance="outline">
                    <mat-label>{{ 'COMMON.TYPE' | translate }}</mat-label>
                    <mat-select
                      [name]="'colType' + i"
                      [(ngModel)]="column.type"
                      required
                      [disabled]="isEditMode"
                    >
                      @for (type of columnTypes; track type) {
                        <mat-option [value]="type">{{ type }}</mat-option>
                      }
                    </mat-select>
                  </mat-form-field>

                  @if (column.type === 'String') {
                    <mat-form-field appearance="outline">
                      <mat-label>{{ 'SYSTEM.LENGTH' | translate }}</mat-label>
                      <input
                        matInput
                        type="number"
                        [name]="'colLength' + i"
                        [(ngModel)]="column.length"
                        required
                        [disabled]="isEditMode"
                      />
                    </mat-form-field>
                  } @else if (column.type === 'Dropdown') {
                    <mat-form-field appearance="outline">
                      <mat-label>{{ 'SYSTEM.CODE' | translate }}</mat-label>
                      <mat-select
                        [name]="'colCode' + i"
                        [(ngModel)]="column.code"
                        required
                        [disabled]="isEditMode"
                      >
                        @for (code of codes(); track code.id) {
                          <mat-option [value]="code.name">{{ code.name }}</mat-option>
                        }
                      </mat-select>
                    </mat-form-field>
                  } @else {
                    <div class="placeholder-cell"></div>
                  }

                  <div class="column-checkboxes">
                    <mat-checkbox
                      [name]="'colMandatory' + i"
                      [(ngModel)]="column.mandatory"
                      [disabled]="isEditMode"
                    >
                      {{ 'SYSTEM.MANDATORY' | translate }}
                    </mat-checkbox>
                  </div>

                  @if (!isEditMode) {
                    <button mat-icon-button color="warn" type="button" (click)="removeColumn(i)">
                      <mat-icon>delete</mat-icon>
                    </button>
                  }
                </div>
              }

              @if (!isEditMode) {
                <button
                  mat-stroked-button
                  color="primary"
                  type="button"
                  (click)="addColumn()"
                  class="add-col-btn"
                >
                  <mat-icon>add</mat-icon>
                  {{ 'SYSTEM.ADD_COLUMN' | translate }}
                </button>
              }
            </div>

            <div class="form-actions">
              <button mat-button type="button" (click)="onCancel()">
                {{ 'COMMON.CANCEL' | translate }}
              </button>
              <button
                mat-raised-button
                color="primary"
                type="submit"
                [disabled]="!dtForm.form.valid"
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
        max-width: 1200px;
        margin: 0 auto;
      }
      .dt-form {
        display: flex;
        flex-direction: column;
        gap: 16px;
        padding-top: 16px;
      }
      .header-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 16px;
      }
      .checkbox-row {
        margin-bottom: 16px;
      }
      .columns-section h3 {
        margin: 16px 0;
        border-bottom: 1px solid #eee;
        padding-bottom: 8px;
        color: var(--primary-color);
      }
      .column-row {
        display: grid;
        grid-template-columns: 2fr 1.5fr 1.5fr 1fr auto;
        gap: 12px;
        align-items: center;
        margin-bottom: 8px;
      }
      .column-checkboxes {
        display: flex;
        align-items: center;
        height: 100%;
      }
      .add-col-btn {
        margin-top: 8px;
      }
      .form-actions {
        display: flex;
        justify-content: flex-end;
        gap: 12px;
        margin-top: 24px;
      }
      mat-form-field {
        width: 100%;
      }
    `,
  ],
})
export class DatatablesFormComponent implements OnInit {
  private readonly datatablesService = inject(DataTablesService);
  private readonly codesService = inject(CodesService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  private readonly dtListPath = '/system/data-tables';

  isEditMode = false;
  datatableName?: string;
  codes = signal<GetCodesResponse[]>([]);

  appTables = [
    'm_client',
    'm_group',
    'm_center',
    'm_office',
    'm_loan',
    'm_savings_account',
    'm_product_loan',
    'm_savings_product',
  ];

  columnTypes = ['String', 'Number', 'Decimal', 'Boolean', 'Date', 'DateTime', 'Dropdown', 'Text'];

  datatable: PostDataTablesRequest = {
    datatableName: '',
    apptableName: '',
    multiRow: false,
    columns: [],
  };

  ngOnInit(): void {
    this.loadCodes();
    this.datatableName = this.route.snapshot.paramMap.get('name') || undefined;
    if (this.datatableName) {
      this.isEditMode = true;
      this.loadDatatableData();
    } else {
      this.addColumn(); // Start with one empty column
    }
  }

  loadCodes(): void {
    this.codesService.retrieveCodes().subscribe((data) => this.codes.set(data));
  }

  loadDatatableData(): void {
    this.datatablesService.getDatatable(this.datatableName!).subscribe((data) => {
      this.datatable = {
        datatableName: data.registeredTableName!,
        apptableName: data.applicationTableName!,
        columns: (data.columnHeaderData || []).map((col) => ({
          name: col.columnName!,
          type: col.columnDisplayType!,
          mandatory: !col.isColumnNullable,
          length: col.columnLength,
          code: col.columnCode,
        })),
      };
    });
  }

  addColumn(): void {
    this.datatable.columns.push({
      name: '',
      type: 'String',
      mandatory: false,
      length: 10,
    });
  }

  removeColumn(index: number): void {
    this.datatable.columns.splice(index, 1);
  }

  onSubmit(): void {
    if (this.isEditMode) {
      // Fineract only supports changing column names/types/codes in specific ways via updateDatatable
      // but usually definitions are somewhat immutable. We use the service's updateDatatable.
      this.datatablesService.updateDatatable(this.datatableName!, this.datatable).subscribe({
        next: () => this.router.navigate([this.dtListPath]),
        error: (err) => console.error('Failed to update datatable', err),
      });
    } else {
      this.datatablesService.createDatatable(this.datatable).subscribe({
        next: () => this.router.navigate([this.dtListPath]),
        error: (err) => console.error('Failed to create datatable', err),
      });
    }
  }

  onCancel(): void {
    this.router.navigate([this.dtListPath]);
  }
}
