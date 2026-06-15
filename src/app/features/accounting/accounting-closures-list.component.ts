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
import { TranslateModule } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { DataTableComponent, ColumnDef, CellTemplateDirective } from '../../shared';
import { AccountingClosureService, GetGlClosureResponse } from '../../api';

/**
 * Component for listing accounting period closures.
 *
 * Provides a view of all closed periods by office.
 */
@Component({
  selector: 'app-accounting-closures-list',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    DataTableComponent,
    CellTemplateDirective,
  ],
  template: `
    <app-data-table
      title="Accounting Closures"
      helpTextKey="HELP.ACCOUNTING_CLOSURES_DESC"
      createButtonLabel="Close Period"
      [columns]="columns"
      [data]="closures"
      [localLogic]="true"
      [showSearch]="false"
      (create)="onCreateClosure()"
    >
      <ng-template appCellTemplate="closingDate" let-closure>
        {{ closure.closingDate | date: 'mediumDate' }}
      </ng-template>

      <ng-template appCellTemplate="isClosed" let-closure>
        <span class="status-chip" [ngClass]="closure.isClosed ? 'closed' : 'open'">
          {{ closure.isClosed ? 'Closed' : 'Open' }}
        </span>
      </ng-template>

      <ng-template appCellTemplate="actions" let-closure>
        <button
          mat-icon-button
          color="warn"
          matTooltip="Re-open Period"
          (click)="onDeleteClosure(closure)"
        >
          <mat-icon>lock_open</mat-icon>
        </button>
      </ng-template>
    </app-data-table>
  `,
  styles: [
    `
      .status-chip {
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 12px;
        font-weight: bold;
      }
      .closed {
        background-color: #fce4ec;
        color: #c2185b;
      }
      .open {
        background-color: #e8f5e9;
        color: #388e3c;
      }
    `,
  ],
})
export class AccountingClosuresListComponent implements OnInit {
  private readonly closureService = inject(AccountingClosureService);
  private readonly router = inject(Router);

  readonly columns: ColumnDef[] = [
    { key: 'officeName', label: 'Office', sortable: true },
    { key: 'closingDate', label: 'Closing Date', sortable: true },
    { key: 'comments', label: 'Comments', sortable: true },
    { key: 'isClosed', label: 'Status', sortable: true },
    { key: 'actions', label: 'Actions', sortable: false },
  ];

  closures: GetGlClosureResponse[] = [];

  ngOnInit() {
    this.loadClosures();
  }

  private loadClosures() {
    this.closureService.getGlclosures().subscribe({
      next: (data) => (this.closures = data),
      error: (err) => console.error('Failed to load closures', err),
    });
  }

  onCreateClosure() {
    this.router.navigate(['/accounting/closures/create']);
  }

  onDeleteClosure(closure: GetGlClosureResponse) {
    if (closure.id && confirm('Are you sure you want to re-open this period?')) {
      this.closureService
        .deleteGlclosuresGlClosureId(closure.id)
        .subscribe(() => this.loadClosures());
    }
  }
}
