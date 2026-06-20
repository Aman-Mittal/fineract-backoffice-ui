import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import {
  BusinessDateManagementService,
  BusinessDateResponse,
  BusinessDateUpdateRequest,
} from '../../../api';
import {
  formatDateToFineract,
  FINERACT_DATE_FORMAT,
  FINERACT_LOCALE,
} from '../../../core/utils/date-formatter';

@Component({
  selector: 'app-business-dates',
  standalone: true,
  imports: [
    FormsModule,
    TranslateModule,
    MatCardModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
  ],
  template: `
    <div class="page-header">
      <h2>{{ 'BUSINESS_DATES.TITLE' | translate }}</h2>
    </div>

    @if (isLoading) {
      <div class="loading-spinner">
        <mat-spinner diameter="48"></mat-spinner>
      </div>
    }

    @if (!isLoading) {
      <div class="form-grid">
        <!-- Business Date Card -->
        <mat-card>
          <mat-card-header>
            <mat-card-title>{{ 'BUSINESS_DATES.BUSINESS_DATE_LABEL' | translate }}</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            @if (businessDateEntry?.description) {
              <p>{{ businessDateEntry?.description }}</p>
            }
            <p>
              <strong>{{ 'BUSINESS_DATES.CURRENT_DATE' | translate }}:</strong>
              {{ businessDateEntry?.date }}
            </p>
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>{{ 'BUSINESS_DATES.NEW_DATE' | translate }}</mat-label>
              <input
                matInput
                [matDatepicker]="businessDatePicker"
                [(ngModel)]="businessDate"
                name="businessDate"
              />
              <mat-datepicker-toggle
                matIconSuffix
                [for]="businessDatePicker"
              ></mat-datepicker-toggle>
              <mat-datepicker #businessDatePicker></mat-datepicker>
            </mat-form-field>
          </mat-card-content>
          <mat-card-actions>
            <button
              mat-raised-button
              color="primary"
              (click)="updateDate('BUSINESS_DATE')"
              [disabled]="!businessDate"
            >
              {{ 'BUSINESS_DATES.UPDATE' | translate }}
            </button>
          </mat-card-actions>
        </mat-card>

        <!-- COB Date Card -->
        <mat-card>
          <mat-card-header>
            <mat-card-title>{{ 'BUSINESS_DATES.COB_DATE_LABEL' | translate }}</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            @if (cobDateEntry?.description) {
              <p>{{ cobDateEntry?.description }}</p>
            }
            <p>
              <strong>{{ 'BUSINESS_DATES.CURRENT_DATE' | translate }}:</strong>
              {{ cobDateEntry?.date }}
            </p>
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>{{ 'BUSINESS_DATES.NEW_DATE' | translate }}</mat-label>
              <input
                matInput
                [matDatepicker]="cobDatePicker"
                [(ngModel)]="cobDate"
                name="cobDate"
              />
              <mat-datepicker-toggle matIconSuffix [for]="cobDatePicker"></mat-datepicker-toggle>
              <mat-datepicker #cobDatePicker></mat-datepicker>
            </mat-form-field>
          </mat-card-content>
          <mat-card-actions>
            <button
              mat-raised-button
              color="primary"
              (click)="updateDate('COB_DATE')"
              [disabled]="!cobDate"
            >
              {{ 'BUSINESS_DATES.UPDATE' | translate }}
            </button>
          </mat-card-actions>
        </mat-card>
      </div>
    }
  `,
  styles: [
    `
      .page-header {
        margin-bottom: 24px;
      }
      .loading-spinner {
        display: flex;
        justify-content: center;
        padding: 48px;
      }
      .form-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 24px;
      }
      .full-width {
        width: 100%;
      }
      mat-card-content {
        padding-top: 16px;
      }
      mat-card-actions {
        padding: 8px 16px 16px;
      }
      @media (max-width: 768px) {
        .form-grid {
          grid-template-columns: 1fr;
        }
      }
    `,
  ],
})
export class BusinessDatesComponent implements OnInit {
  private businessDateService = inject(BusinessDateManagementService);
  private snackBar = inject(MatSnackBar);

  isLoading = false;

  businessDateEntry: BusinessDateResponse | null = null;
  cobDateEntry: BusinessDateResponse | null = null;

  businessDate: Date | null = null;
  cobDate: Date | null = null;

  ngOnInit(): void {
    this.loadBusinessDates();
  }

  private loadBusinessDates(): void {
    this.isLoading = true;
    this.businessDateService.getBusinessdate().subscribe({
      next: (dates: BusinessDateResponse[]) => {
        this.businessDateEntry = dates.find((d) => d.type === 'BUSINESS_DATE') ?? null;
        this.cobDateEntry = dates.find((d) => d.type === 'COB_DATE') ?? null;

        if (this.businessDateEntry?.date) {
          this.businessDate = new Date(this.businessDateEntry.date);
        }
        if (this.cobDateEntry?.date) {
          this.cobDate = new Date(this.cobDateEntry.date);
        }
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.snackBar.open('Failed to load business dates', 'Close', { duration: 4000 });
      },
    });
  }

  updateDate(type: string): void {
    const dateValue = type === 'BUSINESS_DATE' ? this.businessDate : this.cobDate;
    if (!dateValue) return;

    const body: BusinessDateUpdateRequest = {
      type: type as BusinessDateUpdateRequest.TypeEnum,
      date: formatDateToFineract(dateValue),
      dateFormat: FINERACT_DATE_FORMAT,
      locale: FINERACT_LOCALE,
    };

    this.businessDateService.postBusinessdate(body).subscribe({
      next: () => {
        this.snackBar.open('BUSINESS_DATES.UPDATE_SUCCESS', 'Close', { duration: 3000 });
        this.loadBusinessDates();
      },
      error: () => {
        this.snackBar.open('Failed to update business date', 'Close', { duration: 4000 });
      },
    });
  }
}
