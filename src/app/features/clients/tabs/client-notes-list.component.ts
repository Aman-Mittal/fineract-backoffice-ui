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

import { Component, Input, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import {
  DataTableComponent,
  ColumnDef,
  HasPermissionDirective,
  CellTemplateDirective,
} from '../../../shared';
import { NotesService, NoteData } from '../../../api';

@Component({
  selector: 'app-client-notes-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TranslateModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    DataTableComponent,
    HasPermissionDirective,
    CellTemplateDirective,
  ],
  template: `
    <div class="tab-actions">
      <button
        mat-raised-button
        color="primary"
        [routerLink]="['/clients', clientId, 'notes', 'create']"
        *appHasPermission="'CREATE_NOTE'"
      >
        <mat-icon>add</mat-icon>
        {{ 'CLIENTS.ADD_NOTE' | translate }}
      </button>
    </div>

    <app-data-table
      [data]="notes()"
      [columns]="columns"
      [isLoading]="isLoading()"
      [localLogic]="true"
    >
      <ng-template appCellTemplate="createdOn" let-row>
        {{ row.createdOn | date: 'medium' }}
      </ng-template>

      <ng-template appCellTemplate="actions" let-row>
        <div class="action-buttons">
          <button
            mat-icon-button
            color="primary"
            [routerLink]="['/clients', clientId, 'notes', 'edit', row.id]"
            *appHasPermission="'UPDATE_NOTE'"
            [matTooltip]="'COMMON.EDIT' | translate"
          >
            <mat-icon>edit</mat-icon>
          </button>
          <button
            mat-icon-button
            color="warn"
            (click)="onDelete(row.id)"
            *appHasPermission="'DELETE_NOTE'"
            [matTooltip]="'COMMON.DELETE' | translate"
          >
            <mat-icon>delete</mat-icon>
          </button>
        </div>
      </ng-template>
    </app-data-table>
  `,
  styles: [
    `
      .tab-actions {
        display: flex;
        justify-content: flex-end;
        margin-bottom: 16px;
      }
      .action-buttons {
        display: flex;
        gap: 8px;
      }
    `,
  ],
})
export class ClientNotesListComponent implements OnInit {
  @Input({ required: true }) clientId!: number;

  private readonly noteService = inject(NotesService);

  notes = signal<NoteData[]>([]);
  isLoading = signal<boolean>(false);

  columns: ColumnDef[] = [
    {
      key: 'note',
      label: 'COMMON.NOTE',
    },
    {
      key: 'createdByUsername',
      label: 'CLIENTS.CREATED_BY',
    },
    {
      key: 'createdOn',
      label: 'CLIENTS.CREATED_ON',
    },
    {
      key: 'actions',
      label: 'COMMON.ACTIONS',
    },
  ];

  ngOnInit(): void {
    this.loadNotes();
  }

  loadNotes(): void {
    this.isLoading.set(true);
    this.noteService.retrieveNotesByResource('clients', this.clientId).subscribe({
      next: (data: NoteData[]) => {
        this.notes.set(data);
        this.isLoading.set(false);
      },
      error: (err: unknown) => {
        console.error('Failed to load client notes', err);
        this.isLoading.set(false);
      },
    });
  }

  onDelete(id: number): void {
    if (confirm('Are you sure you want to delete this note?')) {
      this.noteService.deleteNote('clients', this.clientId, id).subscribe({
        next: () => this.loadNotes(),
        error: (err) => console.error('Failed to delete note', err),
      });
    }
  }
}
