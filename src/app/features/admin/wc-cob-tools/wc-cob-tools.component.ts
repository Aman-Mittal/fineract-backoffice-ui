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
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { WorkingCapitalLoanInternalCOBApiService } from '../../../api';

@Component({
  selector: 'app-wc-cob-tools',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, MatSnackBarModule, TranslateModule],
  template: `
    <mat-card>
      <mat-card-header>
        <mat-card-title>{{ 'WC_COB_TOOLS.TITLE' | translate }}</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <div class="actions">
          <button mat-raised-button color="primary" (click)="setLastCobRun()">
            {{ 'WC_COB_TOOLS.SET_LAST_RUN' | translate }}
          </button>
          <button mat-raised-button color="warn" (click)="deleteLastCobRun()">
            {{ 'WC_COB_TOOLS.DELETE_LAST_RUN' | translate }}
          </button>
        </div>
      </mat-card-content>
    </mat-card>
  `,
  styles: [
    `
      .actions {
        display: flex;
        gap: 16px;
        flex-wrap: wrap;
        margin-top: 8px;
      }
    `,
  ],
})
export class WcCobToolsComponent {
  private wcCobService = inject(WorkingCapitalLoanInternalCOBApiService);
  private snackBar = inject(MatSnackBar);
  private translate = inject(TranslateService);

  setLastCobRun(): void {
    this.wcCobService.postInternalWorkingCapitalLoansInternalLastCobRun().subscribe({
      next: () => this.showSuccess(),
      error: () => this.showError(),
    });
  }

  deleteLastCobRun(): void {
    this.wcCobService.deleteInternalWorkingCapitalLoansInternalLastCobRun().subscribe({
      next: () => this.showSuccess(),
      error: () => this.showError(),
    });
  }

  private showSuccess(): void {
    this.snackBar.open(this.translate.instant('WC_COB_TOOLS.SUCCESS'), undefined, {
      duration: 3000,
    });
  }

  private showError(): void {
    this.snackBar.open(this.translate.instant('WC_COB_TOOLS.ERROR'), undefined, { duration: 3000 });
  }
}
