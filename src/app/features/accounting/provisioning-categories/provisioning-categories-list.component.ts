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

import { Component, OnInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ColumnDef, CellTemplateDirective } from '../../../shared';
import { DataTableComponent } from '../../../shared/components/data-table/data-table.component';
import { ProvisioningCategoryService, ProvisioningCategoryData } from '../../../api';
import { TooltipDirective } from '../../../shared/directives/tooltip.directive';
import { DialogService } from '../../../core/services/dialog.service';
import { ButtonComponent } from '../../../ui/button/button.component';

/**
 * Lists provisioning categories. Categories are small master-data records
 * (name + description), so the table uses local pagination.
 */
@Component({
  selector: 'app-provisioning-categories-list',
  standalone: true,
  imports: [
    TranslateModule,
    DataTableComponent,
    CellTemplateDirective,
    ButtonComponent,
    TooltipDirective,
  ],
  template: `
    <app-data-table
      title="nav.provisioningCategories"
      helpTextKey="HELP.PROVISIONING_CATEGORIES_DESC"
      createButtonLabel="PROVISIONING_CATEGORIES.CREATE"
      createPermission="CREATE_PROVISIONCATEGORY"
      [columns]="columns"
      [data]="categories()"
      [totalRecords]="categories().length"
      [localLogic]="true"
      (create)="onCreate()"
    >
      <ng-template appCellTemplate="actions" let-row>
        <app-button
          type="button"
          intent="primary"
          emphasis="quiet"
          [label]="'COMMON.EDIT' | translate"
          icon="create-outline"
          [appTooltip]="'COMMON.EDIT' | translate"
          (click)="onEdit(row)"
        />
        <app-button
          type="button"
          intent="danger"
          emphasis="quiet"
          [label]="'COMMON.DELETE' | translate"
          icon="trash-outline"
          [appTooltip]="'COMMON.DELETE' | translate"
          (click)="onDelete(row)"
        />
      </ng-template>
    </app-data-table>
  `,
})
export class ProvisioningCategoriesListComponent implements OnInit {
  private readonly categoryService = inject(ProvisioningCategoryService);
  private readonly router = inject(Router);
  private readonly dialogService = inject(DialogService);
  private readonly translate = inject(TranslateService);

  readonly columns: ColumnDef[] = [
    { key: 'categoryName', label: 'PROVISIONING_CATEGORIES.NAME', sortable: true },
    { key: 'categoryDescription', label: 'PROVISIONING_CATEGORIES.DESCRIPTION', sortable: false },
    { key: 'actions', label: 'COMMON.ACTIONS', sortable: false },
  ];

  readonly categories = signal<ProvisioningCategoryData[]>([]);

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.categoryService.getProvisioningcategory().subscribe({
      next: (data: ProvisioningCategoryData[]) => {
        this.categories.set(data || []);
      },
      error: (err: unknown) => {
        console.error('Failed to load provisioning categories', err);
      },
    });
  }

  onCreate(): void {
    this.router.navigate(['/accounting/provisioning-categories/create']);
  }

  onEdit(row: ProvisioningCategoryData): void {
    this.router.navigate(['/accounting/provisioning-categories/edit', row.id]);
  }

  onDelete(row: ProvisioningCategoryData): void {
    if (!row.id) return;
    void this.dialogService
      .confirm({
        title: this.translate.instant('PROVISIONING_CATEGORIES.DELETE'),
        message: this.translate.instant('PROVISIONING_CATEGORIES.CONFIRM_DELETE', {
          name: row.categoryName,
        }),
        destructive: true,
      })
      .then((confirmed) => {
        if (!confirmed) return;
        this.categoryService.deleteProvisioningcategoryCategoryId(row.id!).subscribe({
          next: () => this.load(),
          error: (err: unknown) => console.error('Failed to delete provisioning category', err),
        });
      });
  }
}
