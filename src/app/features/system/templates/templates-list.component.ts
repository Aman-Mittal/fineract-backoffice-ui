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
import { TranslateModule } from '@ngx-translate/core';
import { TemplatesService, TemplateData } from '../../../api';
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonIcon,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-templates-list',
  standalone: true,
  imports: [
    MatTableModule,
    TranslateModule,
    IonIcon,
    IonButton,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonCard,
  ],
  template: `
    <ion-card>
      <ion-card-header>
        <ion-card-title>{{ 'TEMPLATES.TITLE' | translate }}</ion-card-title>
        <span class="spacer"></span>
        <ion-button color="primary" (click)="onCreate()">
          <ion-icon name="add-outline"></ion-icon>
          {{ 'TEMPLATES.CREATE_TITLE' | translate }}
        </ion-button>
      </ion-card-header>
      <ion-card-content>
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
              <ion-button fill="clear" color="primary" (click)="onEdit(row)">
                <ion-icon name="create-outline"></ion-icon>
              </ion-button>
              <ion-button fill="clear" color="warn" (click)="onDelete(row)">
                <ion-icon name="trash-outline"></ion-icon>
              </ion-button>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
        </table>
      </ion-card-content>
    </ion-card>
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
