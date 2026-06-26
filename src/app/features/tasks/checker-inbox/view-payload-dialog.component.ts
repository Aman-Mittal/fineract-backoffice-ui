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

import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';

/**
 * Dialog to display the raw JSON command payload of a pending Maker-Checker task.
 */
@Component({
  selector: 'app-view-payload-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, TranslateModule],
  template: `
    <h2 mat-dialog-title>Command Payload</h2>
    <mat-dialog-content>
      <pre class="payload-code">{{ formattedJson }}</pre>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close color="primary">CLOSE</button>
    </mat-dialog-actions>
  `,
  styles: [
    `
      .payload-code {
        background-color: #f5f5f5;
        padding: 16px;
        border-radius: 4px;
        font-family: 'Courier New', Courier, monospace;
        font-size: 0.9rem;
        overflow: auto;
        max-height: 500px;
        white-space: pre-wrap;
        word-wrap: break-word;
      }
    `,
  ],
})
export class ViewPayloadDialogComponent {
  private readonly data = inject<{ payload: string }>(MAT_DIALOG_DATA);
  formattedJson: string;

  constructor() {
    try {
      this.formattedJson = JSON.stringify(JSON.parse(this.data.payload), null, 2);
    } catch {
      this.formattedJson = this.data.payload;
    }
  }
}
