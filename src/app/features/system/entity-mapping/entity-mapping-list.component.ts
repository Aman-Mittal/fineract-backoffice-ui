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
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ColumnDef, CellTemplateDirective } from '../../../shared';
import { DataTableComponent } from '../../../shared/components/data-table/data-table.component';
import { FineractEntityService } from '../../../api';

/**
 * Local view of an entity-to-entity mapping row. The generated service returns the raw
 * JSON body as a `string`, so the response is parsed through this minimal interface.
 */
interface EntityToEntityMapping {
  id?: number;
  relId?: number;
  fromId?: number;
  toId?: number;
  fromEnumOptionData?: { name?: string };
  toEnumOptionData?: { name?: string };
}

/**
 * Lists configured entity-to-entity mappings (e.g. office-to-loan-product access mappings).
 */
@Component({
  selector: 'app-entity-mapping-list',
  standalone: true,
  imports: [
    TranslateModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    DataTableComponent,
    CellTemplateDirective,
  ],
  template: `
    <app-data-table
      title="nav.entityMapping"
      helpTextKey="HELP.ENTITY_MAPPING_DESC"
      createButtonLabel="ENTITY_MAPPING.CREATE"
      [columns]="columns"
      [data]="mappings"
      [totalRecords]="mappings.length"
      [localLogic]="true"
      (create)="onCreate()"
    >
      <ng-template appCellTemplate="actions" let-row>
        <button
          mat-icon-button
          color="primary"
          [attr.aria-label]="'COMMON.EDIT' | translate"
          [matTooltip]="'COMMON.EDIT' | translate"
          (click)="onEdit(row)"
        >
          <mat-icon>edit</mat-icon>
        </button>
        <button
          mat-icon-button
          color="warn"
          [attr.aria-label]="'COMMON.DELETE' | translate"
          [matTooltip]="'COMMON.DELETE' | translate"
          (click)="onDelete(row)"
        >
          <mat-icon>delete</mat-icon>
        </button>
      </ng-template>
    </app-data-table>
  `,
})
export class EntityMappingListComponent implements OnInit {
  private readonly entityService = inject(FineractEntityService);
  private readonly router = inject(Router);

  readonly columns: ColumnDef[] = [
    { key: 'id', label: 'ENTITY_MAPPING.ID', sortable: true },
    { key: 'fromId', label: 'ENTITY_MAPPING.FROM_ID', sortable: true },
    { key: 'toId', label: 'ENTITY_MAPPING.TO_ID', sortable: true },
    { key: 'actions', label: 'COMMON.ACTIONS', sortable: false },
  ];

  mappings: EntityToEntityMapping[] = [];

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.entityService.getEntitytoentitymapping().subscribe({
      next: (body: string) => {
        this.mappings = body ? (JSON.parse(body) as EntityToEntityMapping[]) : [];
      },
      error: (err: unknown) => {
        console.error('Failed to load entity mappings', err);
      },
    });
  }

  onCreate(): void {
    this.router.navigate(['/system/entity-mapping/create']);
  }

  onEdit(row: EntityToEntityMapping): void {
    this.router.navigate(['/system/entity-mapping/edit', row.id]);
  }

  onDelete(row: EntityToEntityMapping): void {
    if (!row.id || !window.confirm('Delete this entity mapping?')) return;
    this.entityService.deleteEntitytoentitymappingMapId(row.id).subscribe({
      next: () => this.load(),
      error: (err: unknown) => console.error('Failed to delete entity mapping', err),
    });
  }
}
