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
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { DataTableComponent, ColumnDef, CellTemplateDirective } from '../../shared';
import { GlobalConfigurationService, GetGlobalConfigurationsResponse } from '../../api';

/**
 * Component for managing global system configurations.
 */
@Component({
  selector: 'app-global-configurations',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatSlideToggleModule,
    DataTableComponent,
    CellTemplateDirective,
  ],
  template: `
    <app-data-table
      title="nav.globalConfigurations"
      helpTextKey="HELP.GLOBAL_CONFIG_DESC"
      [columns]="columns"
      [data]="configurations"
      [totalRecords]="configurations.length"
      [showSearch]="true"
      [localLogic]="true"
    >
      <ng-template appCellTemplate="enabled" let-config>
        <mat-slide-toggle
          [checked]="!!config['enabled']"
          (change)="onToggleConfig(config)"
          [attr.aria-label]="'Toggle ' + config['name']"
        >
        </mat-slide-toggle>
      </ng-template>

      <ng-template appCellTemplate="actions" let-config>
        <button
          mat-icon-button
          color="primary"
          [attr.aria-label]="'COMMON.EDIT' | translate"
          matTooltip="Edit Configuration"
          (click)="onEditConfig(config)"
        >
          <mat-icon>edit</mat-icon>
        </button>
      </ng-template>
    </app-data-table>
  `,
})
export class GlobalConfigurationsListComponent implements OnInit {
  private readonly configService = inject(GlobalConfigurationService);

  readonly columns: ColumnDef[] = [
    { key: 'name', label: 'SETTINGS.CONFIG_NAME', sortable: true },
    { key: 'enabled', label: 'COMMON.ENABLED', sortable: true },
    { key: 'value', label: 'COMMON.VALUE', sortable: true },
    { key: 'actions', label: 'COMMON.ACTIONS', sortable: false },
  ];

  configurations: Record<string, unknown>[] = [];

  ngOnInit(): void {
    this.loadConfigurations();
  }

  private loadConfigurations(): void {
    this.configService.retrieveConfiguration().subscribe({
      next: (data: GetGlobalConfigurationsResponse) => {
        this.configurations =
          (data.globalConfiguration as unknown as Record<string, unknown>[]) || [];
      },
      error: (err) => console.error('Failed to load configurations', err),
    });
  }

  onToggleConfig(config: Record<string, unknown>): void {
    // Implementation for quick toggle
    console.log('Toggle config', config['name'], !config['enabled']);
  }

  onEditConfig(config: Record<string, unknown>): void {
    // Implementation for detailed edit (e.g. numeric value)
    console.log('Edit config', config['name']);
  }
}
