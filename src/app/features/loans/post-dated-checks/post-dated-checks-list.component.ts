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
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ColumnDef, CellTemplateDirective } from '../../../shared';
import { DataTableComponent } from '../../../shared/components/data-table/data-table.component';
import { RepaymentWithPostDatedChecksService, GetPostDatedChecks } from '../../../api';
import { IonButton, IonIcon } from '@ionic/angular/standalone';

/**
 * Lists post-dated checks for a specific loan and allows editing or deleting a check.
 * There is no create action for this feature. The loan id is taken from the route.
 */
@Component({
  selector: 'app-post-dated-checks-list',
  standalone: true,
  imports: [TranslateModule, DataTableComponent, CellTemplateDirective, IonIcon, IonButton],
  template: `
    <app-data-table
      title="POST_DATED_CHECKS.TITLE"
      helpTextKey="HELP.POST_DATED_CHECKS_DESC"
      [columns]="columns"
      [data]="checks"
      [totalRecords]="checks.length"
      [showSearch]="false"
      [localLogic]="true"
    >
      <ng-template appCellTemplate="actions" let-row>
        <ion-button
          fill="clear"
          color="primary"
          [attr.aria-label]="'COMMON.EDIT' | translate"
          [attr.title]="'COMMON.EDIT' | translate"
          (click)="onEdit(row)"
        >
          <ion-icon name="create-outline"></ion-icon>
        </ion-button>
        <ion-button
          fill="clear"
          color="danger"
          [attr.aria-label]="'COMMON.DELETE' | translate"
          [attr.title]="'COMMON.DELETE' | translate"
          (click)="onDelete(row)"
        >
          <ion-icon name="trash-outline"></ion-icon>
        </ion-button>
      </ng-template>
    </app-data-table>
  `,
})
export class PostDatedChecksListComponent implements OnInit {
  private readonly checkService = inject(RepaymentWithPostDatedChecksService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  loanId: number | null = null;

  readonly columns: ColumnDef[] = [
    { key: 'name', label: 'POST_DATED_CHECKS.NAME', sortable: true },
    { key: 'amount', label: 'POST_DATED_CHECKS.AMOUNT', sortable: true },
    { key: 'accountNo', label: 'POST_DATED_CHECKS.ACCOUNT_NO', sortable: true },
    { key: 'date', label: 'POST_DATED_CHECKS.DATE', sortable: true },
    { key: 'actions', label: 'COMMON.ACTIONS', sortable: false },
  ];

  checks: GetPostDatedChecks[] = [];

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('loanId');
    if (id) {
      this.loanId = +id;
      this.load();
    }
  }

  load(): void {
    if (!this.loanId) return;
    this.checkService.getLoansLoanIdPostdatedchecks(this.loanId).subscribe({
      next: (data: GetPostDatedChecks[]) => {
        this.checks = data || [];
      },
      error: (err: unknown) => {
        console.error('Failed to load post-dated checks', err);
      },
    });
  }

  onEdit(row: GetPostDatedChecks): void {
    if (this.loanId && row.id) {
      this.router.navigate(['/loans', this.loanId, 'post-dated-checks', 'edit', row.id]);
    }
  }

  onDelete(row: GetPostDatedChecks): void {
    if (!this.loanId || !row.id || !window.confirm('Delete this post-dated check?')) return;
    this.checkService
      .deleteLoansLoanIdPostdatedchecksPostDatedCheckId(row.id, this.loanId)
      .subscribe({
        next: () => this.load(),
        error: (err: unknown) => console.error('Failed to delete post-dated check', err),
      });
  }
}
