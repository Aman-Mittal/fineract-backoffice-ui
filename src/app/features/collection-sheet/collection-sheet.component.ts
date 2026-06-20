import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { JsonPipe } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import {
  CollectionSheetService,
  OfficesService,
  CollectionSheetRequest,
  PostCollectionSheetResponse,
} from '../../api';
import { formatDateToFineract, FINERACT_DATE_FORMAT } from '../../core/utils/date-formatter';

@Component({
  selector: 'app-collection-sheet',
  standalone: true,
  imports: [
    FormsModule,
    JsonPipe,
    TranslateModule,
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
  ],
  template: `
    <mat-card>
      <mat-card-header>
        <mat-card-title>{{ 'COLLECTION_SHEET.TITLE' | translate }}</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        @if (isLoading) {
          <div class="spinner-container">
            <mat-spinner diameter="48"></mat-spinner>
          </div>
        }

        @if (!generated && !isLoading) {
          <form #filterForm="ngForm" (ngSubmit)="generate()">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>{{ 'COLLECTION_SHEET.OFFICE' | translate }}</mat-label>
              <mat-select name="officeId" [(ngModel)]="request.officeId" required>
                @for (office of offices; track office.id) {
                  <mat-option [value]="office.id">{{ office.name }}</mat-option>
                }
              </mat-select>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>{{ 'COLLECTION_SHEET.DATE' | translate }}</mat-label>
              <input
                matInput
                [matDatepicker]="picker"
                name="transactionDate"
                [(ngModel)]="transactionDate"
                required
              />
              <mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>
              <mat-datepicker #picker></mat-datepicker>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>{{ 'COLLECTION_SHEET.STAFF' | translate }}</mat-label>
              <input matInput type="number" name="staffId" [(ngModel)]="staffId" />
            </mat-form-field>

            <div class="actions">
              <button
                mat-raised-button
                color="primary"
                type="submit"
                [disabled]="filterForm.invalid"
              >
                {{ 'COLLECTION_SHEET.GENERATE' | translate }}
              </button>
            </div>
          </form>
        }

        @if (generated && !isLoading) {
          <h3>{{ 'COLLECTION_SHEET.RESULTS' | translate }}</h3>
          <pre class="json-output">{{ collectionData | json }}</pre>
          <div class="actions">
            <button mat-button (click)="back()">
              {{ 'COLLECTION_SHEET.BACK' | translate }}
            </button>
            <button mat-raised-button color="primary" (click)="save()">
              {{ 'COLLECTION_SHEET.SAVE' | translate }}
            </button>
          </div>
        }
      </mat-card-content>
    </mat-card>
  `,
  styles: [
    `
      mat-card {
        max-width: 640px;
        margin: 24px auto;
      }
      .full-width {
        width: 100%;
        margin-bottom: 12px;
      }
      .actions {
        display: flex;
        gap: 8px;
        justify-content: flex-end;
        margin-top: 8px;
      }
      .spinner-container {
        display: flex;
        justify-content: center;
        padding: 32px;
      }
      .json-output {
        background: #f5f5f5;
        padding: 16px;
        border-radius: 4px;
        overflow: auto;
        max-height: 400px;
        font-size: 12px;
      }
    `,
  ],
})
export class CollectionSheetComponent implements OnInit {
  private collectionSheetService = inject(CollectionSheetService);
  private officesService = inject(OfficesService);
  private snackBar = inject(MatSnackBar);

  generated = false;
  isLoading = false;
  collectionData: PostCollectionSheetResponse | null = null;
  transactionDate: Date = new Date();
  staffId: number | null = null;
  request: CollectionSheetRequest = { locale: 'en' };

  offices: { id?: number; name?: string }[] = [];

  ngOnInit(): void {
    this.officesService.getOffices().subscribe({
      next: (res: unknown) => {
        this.offices = Array.isArray(res) ? (res as { id?: number; name?: string }[]) : [];
      },
      error: () => {
        this.snackBar.open('Failed to load offices', 'Close', { duration: 3000 });
      },
    });
  }

  private buildBody(): CollectionSheetRequest {
    return {
      ...this.request,
      transactionDate: formatDateToFineract(this.transactionDate),
      dateFormat: FINERACT_DATE_FORMAT,
    };
  }

  generate(): void {
    this.isLoading = true;
    const body = this.buildBody();
    this.collectionSheetService.postCollectionsheet(body, 'generate').subscribe({
      next: (res: PostCollectionSheetResponse) => {
        this.collectionData = res;
        this.generated = true;
        this.isLoading = false;
      },
      error: () => {
        this.snackBar.open('Failed to generate collection sheet', 'Close', { duration: 3000 });
        this.isLoading = false;
      },
    });
  }

  save(): void {
    this.isLoading = true;
    const body = this.buildBody();
    this.collectionSheetService.postCollectionsheet(body, 'save').subscribe({
      next: () => {
        this.snackBar.open('Collection sheet saved successfully', 'Close', { duration: 3000 });
        this.isLoading = false;
        this.back();
      },
      error: () => {
        this.snackBar.open('Failed to save collection sheet', 'Close', { duration: 3000 });
        this.isLoading = false;
      },
    });
  }

  back(): void {
    this.generated = false;
    this.collectionData = null;
  }
}
