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

import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-help-icon',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatTooltipModule, TranslateModule],
  template: `
    <mat-icon
      class="help-icon"
      [matTooltip]="helpTextKey | translate"
      matTooltipPosition="above"
      aria-hidden="false"
      [attr.aria-label]="'COMMON.HELP' | translate"
    >
      help_outline
    </mat-icon>
  `,
  styles: [
    `
      .help-icon {
        font-size: 18px;
        height: 18px;
        width: 18px;
        color: #757575;
        cursor: help;
        vertical-align: middle;
        margin-left: 8px;
      }
      .help-icon:hover {
        color: #1976d2;
      }
    `,
  ],
})
export class HelpIconComponent {
  @Input({ required: true }) helpTextKey!: string;
}
