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
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { TranslateModule } from '@ngx-translate/core';
import { TemplatesService, TemplateData } from '../../../api';

@Component({
  selector: 'app-templates-list',
  standalone: true,
  imports: [MatTableModule, MatButtonModule, MatIconModule, MatCardModule, TranslateModule],
  template: `
    <mat-card>
      <mat-card-header>
        <mat-card-title>{{ 'TEMPLATES.TITLE' | translate }}</mat-card-title>
        <span class="spacer"></span>
        <button mat-raised-button color="primary" (click)="onCreate()">
          <mat-icon>add</mat-icon>
          {{ 'TEMPLATES.CREATE_TITLE' | translate }}
        </button>
      </mat-card-header>
      <mat-card-content>
        <table mat-table [dataSource]="templates" class="full-width">
          <ng-container matColumnDef="name">
            <th mat-header-cell *matHeaderCellDef>{{ 'TEMPLATES.NAME' | translate }}</th>
            <td mat-cell *matCellDef="let row">{{ row.name }}</td>
          </ng-container>

          <ng-container matColumnDef="entity">
            <th mat-header-cell *matHeaderCellDef>{{ 'TEMPLATES.ENTITY' | translate }}</th>
            <td mat-cell *matCellDef="let row">{{ translateEntity(row.entity) }}</td>
          </ng-container>

          <ng-container matColumnDef="type">
            <th mat-header-cell *matHeaderCellDef>{{ 'TEMPLATES.TYPE' | translate }}</th>
            <td mat-cell *matCellDef="let row">{{ translateType(row.type) }}</td>
          </ng-container>

          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef></th>
            <td mat-cell *matCellDef="let row">
              <button mat-icon-button color="primary" (click)="onEdit(row)">
                <mat-icon>edit</mat-icon>
              </button>
              <button mat-icon-button color="warn" (click)="onDelete(row)">
                <mat-icon>delete</mat-icon>
              </button>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
        </table>
      </mat-card-content>
    </mat-card>
  `,
  styles: [
    `
      mat-card-header {
        display: flex;
        align-items: center;
      }
      .spacer {
        flex: 1;
      }
      .full-width {
        width: 100%;
      }
    `,
  ],
})
export class TemplatesListComponent implements OnInit {
  private readonly templatesService = inject(TemplatesService);
  private readonly router = inject(Router);

  templates: TemplateData[] = [];
  displayedColumns = ['name', 'entity', 'type', 'actions'];

  ngOnInit(): void {
    this.loadTemplates();
  }

  loadTemplates(): void {
    this.templatesService.getTemplates().subscribe((data) => {
      this.templates = data;
    });
  }

  translateEntity(entity?: number): string {
    if (entity === 0) return 'Client';
    if (entity === 1) return 'Loan';
    return '';
  }

  translateType(type?: number): string {
    if (type === 0) return 'Document';
    if (type === 2) return 'SMS';
    return '';
  }

  onCreate(): void {
    this.router.navigate(['/system/templates/create']);
  }

  onEdit(row: TemplateData): void {
    this.router.navigate(['/system/templates/edit', row.id]);
  }

  onDelete(row: TemplateData): void {
    if (confirm(`Delete template "${row.name}"?`)) {
      this.templatesService.deleteTemplatesTemplateId(row.id!).subscribe(() => {
        this.loadTemplates();
      });
    }
  }
}
