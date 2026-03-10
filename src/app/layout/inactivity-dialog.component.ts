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
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';

/**
 * Modal dialog that warns the user about an impending session timeout.
 *
 * Provides options to either extend the current session or logout immediately.
 */
@Component({
  selector: 'app-inactivity-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, TranslateModule],
  template: `
    <h2 mat-dialog-title>{{ 'idle.warning.title' | translate }}</h2>
    <mat-dialog-content>
      <p>{{ 'idle.warning.message' | translate }}</p>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onLogout()">{{ 'app.logout' | translate }}</button>
      <button mat-raised-button color="primary" (click)="onExtend()">
        {{ 'idle.warning.extend' | translate }}
      </button>
    </mat-dialog-actions>
  `,
  styles: [
    `
      mat-dialog-content {
        min-width: 300px;
      }
    `,
  ],
})
export class InactivityDialogComponent {
  private readonly dialogRef = inject(MatDialogRef<InactivityDialogComponent>);

  /**
   * Closes the dialog and signals that the session should be extended.
   */
  onExtend(): void {
    this.dialogRef.close(true);
  }

  /**
   * Closes the dialog and signals that the user wishes to logout.
   */
  onLogout(): void {
    this.dialogRef.close(false);
  }
}
