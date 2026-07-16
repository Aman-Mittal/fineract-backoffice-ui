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

import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { DataTablesService, ResultsetColumnHeaderData } from '../../../api';

export interface DatatableEntryDialogData {
  datatableName: string;
  apptableId: number;
  columns: ResultsetColumnHeaderData[];
}

const AUDIT_COLUMN_NAMES = new Set(['created_at', 'updated_at']);

@Component({
  selector: 'app-datatable-entry-dialog',
  standalone: true,
  imports: [
    FormsModule,
    TranslateModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSnackBarModule,
  ],
  template: `
    <h2 mat-dialog-title>{{ 'SYSTEM.ADD_ENTRY' | translate }}</h2>
    <mat-dialog-content>
      <form #entryForm="ngForm" class="entry-form">
        @for (col of dataColumns; track col.columnName) {
          @if (isDropdownColumn(col)) {
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>{{ col.columnName }}</mat-label>
              <mat-select
                [name]="col.columnName!"
                [(ngModel)]="values[col.columnName!]"
                [required]="!!col.mandatory"
              >
                @for (option of col.columnValues; track $any(option).id) {
                  <mat-option [value]="$any(option).id">{{ $any(option).value }}</mat-option>
                }
              </mat-select>
            </mat-form-field>
          } @else if (isBooleanColumn(col)) {
            <mat-checkbox [name]="col.columnName!" [(ngModel)]="values[col.columnName!]">
              {{ col.columnName }}
            </mat-checkbox>
          } @else if (isDateColumn(col)) {
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>{{ col.columnName }}</mat-label>
              <input
                matInput
                [matDatepicker]="picker"
                [name]="col.columnName!"
                [(ngModel)]="values[col.columnName!]"
                [required]="!!col.mandatory"
              />
              <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
              <mat-datepicker #picker></mat-datepicker>
            </mat-form-field>
          } @else if (isNumericColumn(col)) {
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>{{ col.columnName }}</mat-label>
              <input
                matInput
                type="number"
                [name]="col.columnName!"
                [(ngModel)]="values[col.columnName!]"
                [required]="!!col.mandatory"
              />
            </mat-form-field>
          } @else {
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>{{ col.columnName }}</mat-label>
              @if (col.columnDisplayType === 'TEXT') {
                <textarea
                  matInput
                  [name]="col.columnName!"
                  [(ngModel)]="values[col.columnName!]"
                  [required]="!!col.mandatory"
                  rows="3"
                ></textarea>
              } @else {
                <input
                  matInput
                  [maxlength]="col.columnLength ?? null"
                  [name]="col.columnName!"
                  [(ngModel)]="values[col.columnName!]"
                  [required]="!!col.mandatory"
                />
              }
            </mat-form-field>
          }
        }
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()" [disabled]="isSaving">
        {{ 'COMMON.CANCEL' | translate }}
      </button>
      <button
        mat-raised-button
        color="primary"
        [disabled]="entryForm.invalid || isSaving"
        (click)="onSubmit()"
      >
        {{ isSaving ? ('COMMON.SAVING' | translate) : ('COMMON.SAVE' | translate) }}
      </button>
    </mat-dialog-actions>
  `,
  styles: [
    `
      .entry-form {
        display: flex;
        flex-direction: column;
        gap: 12px;
        padding-top: 8px;
        min-width: 400px;
      }
      .full-width {
        width: 100%;
      }
    `,
  ],
})
export class DatatableEntryDialogComponent {
  private readonly datatablesService = inject(DataTablesService);
  private readonly dialogRef = inject(MatDialogRef<DatatableEntryDialogComponent>);
  private readonly snackBar = inject(MatSnackBar);
  readonly data = inject<DatatableEntryDialogData>(MAT_DIALOG_DATA);

  values: Record<string, unknown> = {};
  isSaving = false;

  readonly dataColumns: ResultsetColumnHeaderData[] = this.data.columns.filter(
    (col) => !col.isColumnPrimaryKey && !AUDIT_COLUMN_NAMES.has(col.columnName ?? ''),
  );

  isDropdownColumn(col: ResultsetColumnHeaderData): boolean {
    return !!col.columnValues && col.columnValues.length > 0;
  }

  isBooleanColumn(col: ResultsetColumnHeaderData): boolean {
    return col.columnDisplayType === 'BOOLEAN';
  }

  isDateColumn(col: ResultsetColumnHeaderData): boolean {
    return col.columnDisplayType === 'DATE' || col.columnDisplayType === 'DATETIME';
  }

  isNumericColumn(col: ResultsetColumnHeaderData): boolean {
    return col.columnDisplayType === 'INTEGER' || col.columnDisplayType === 'DECIMAL';
  }

  onSubmit(): void {
    this.isSaving = true;

    const body: Record<string, unknown> = { ...this.values };
    const hasDateColumn = this.dataColumns.some((col) => this.isDateColumn(col));
    for (const col of this.dataColumns) {
      if (this.isDateColumn(col) && body[col.columnName!] instanceof Date) {
        const date = body[col.columnName!] as Date;
        body[col.columnName!] =
          `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
      }
    }
    if (hasDateColumn) {
      body['dateFormat'] = 'yyyy-MM-dd';
    }
    body['locale'] = 'en';

    this.datatablesService
      .postDatatablesDatatableApptableId(
        this.data.datatableName,
        this.data.apptableId,
        JSON.stringify(body),
      )
      .subscribe({
        next: () => this.dialogRef.close(true),
        error: () => {
          this.isSaving = false;
          this.snackBar.open('Operation failed. Please try again.', 'Close', { duration: 3000 });
        },
      });
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
