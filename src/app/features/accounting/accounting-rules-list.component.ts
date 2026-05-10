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
import { RouterModule, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AccountingRulesService } from '../../api/api/accountingRules.service';
import { AccountingRuleData } from '../../api/model/models';
import {
  DataTableComponent,
  ColumnDef,
} from '../../shared/components/data-table/data-table.component';
import { CellTemplateDirective } from '../../shared/components/data-table/cell-template.directive';

@Component({
  selector: 'app-accounting-rules-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    DataTableComponent,
    CellTemplateDirective,
  ],
  template: `
    <div class="container">
      <app-data-table
        title="nav.accountingRules"
        [data]="rules"
        [columns]="columns"
        [localLogic]="true"
        createButtonLabel="ACCOUNTING_RULES.CREATE"
        (create)="onCreate()"
      >
        <ng-template appCellTemplate="debitAccounts" let-row>
          {{ row.debitAccounts?.[0]?.name || '' }}
        </ng-template>
        <ng-template appCellTemplate="creditAccounts" let-row>
          {{ row.creditAccounts?.[0]?.name || '' }}
        </ng-template>
        <ng-template appCellTemplate="actions" let-row>
          <button mat-icon-button color="primary" (click)="onEdit(row)">
            <mat-icon>edit</mat-icon>
          </button>
          <button mat-icon-button color="warn" (click)="onDelete(row)">
            <mat-icon>delete</mat-icon>
          </button>
        </ng-template>
      </app-data-table>
    </div>
  `,
  styles: [
    `
      .container {
        padding: 20px;
      }
    `,
  ],
})
export class AccountingRulesListComponent implements OnInit {
  private accountingRulesService = inject(AccountingRulesService);
  private router = inject(Router);

  rules: AccountingRuleData[] = [];
  columns: ColumnDef[] = [
    { key: 'name', label: 'COMMON.NAME', sortable: true },
    { key: 'officeName', label: 'COMMON.OFFICE', sortable: true },
    { key: 'debitAccounts', label: 'JOURNAL_ENTRIES.DEBITS' },
    { key: 'creditAccounts', label: 'JOURNAL_ENTRIES.CREDITS' },
    { key: 'actions', label: 'COMMON.ACTIONS' },
  ];

  ngOnInit() {
    this.loadRules();
  }

  loadRules() {
    this.accountingRulesService.retrieveAllAccountingRules().subscribe((rules) => {
      this.rules = rules;
    });
  }

  onCreate() {
    this.router.navigate(['/accounting/rules/create']);
  }

  onEdit(rule: AccountingRuleData) {
    this.router.navigate(['/accounting/rules/edit', rule.id]);
  }

  onDelete(rule: AccountingRuleData) {
    if (confirm('Are you sure you want to delete this accounting rule?')) {
      this.accountingRulesService.deleteAccountingRule(rule.id!).subscribe(() => {
        this.loadRules();
      });
    }
  }
}
