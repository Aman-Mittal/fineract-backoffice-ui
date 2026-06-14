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
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { NotesService, NoteRequest } from '../../../api';

@Component({
  selector: 'app-client-note-form',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    TranslateModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  template: `
    <div class="form-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>
            {{ isEditMode ? ('CLIENTS.EDIT_NOTE' | translate) : ('CLIENTS.ADD_NOTE' | translate) }}
          </mat-card-title>
        </mat-card-header>

        <mat-card-content>
          <form #noteForm="ngForm" (ngSubmit)="onSubmit()" class="note-form">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>{{ 'COMMON.NOTE' | translate }}</mat-label>
              <textarea matInput name="note" [(ngModel)]="note.note" required rows="6"></textarea>
            </mat-form-field>

            <div class="form-actions">
              <button mat-button type="button" (click)="onCancel()">
                {{ 'COMMON.CANCEL' | translate }}
              </button>
              <button
                mat-raised-button
                color="primary"
                type="submit"
                [disabled]="!noteForm.form.valid"
              >
                {{ 'COMMON.SAVE' | translate }}
              </button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [
    `
      .form-container {
        padding: 24px;
        max-width: 600px;
        margin: 0 auto;
      }
      .note-form {
        display: flex;
        flex-direction: column;
        gap: 16px;
        padding-top: 16px;
      }
      .full-width {
        width: 100%;
      }
      .form-actions {
        display: flex;
        justify-content: flex-end;
        gap: 12px;
      }
    `,
  ],
})
export class ClientNoteFormComponent implements OnInit {
  private readonly noteService = inject(NotesService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  private readonly clientViewPath = '/clients/view';

  clientId!: number;
  noteId?: number;
  isEditMode = false;

  note: NoteRequest = {
    note: '',
  };

  ngOnInit(): void {
    this.clientId = Number(this.route.snapshot.paramMap.get('clientId'));
    this.noteId = Number(this.route.snapshot.paramMap.get('id'));

    if (this.noteId) {
      this.isEditMode = true;
      this.loadNoteData();
    }
  }

  loadNoteData(): void {
    this.noteService.retrieveNote('clients', this.clientId, this.noteId!).subscribe((data) => {
      this.note = {
        note: data.note,
      };
    });
  }

  onSubmit(): void {
    if (this.isEditMode) {
      this.noteService.updateNote('clients', this.clientId, this.noteId!, this.note).subscribe({
        next: () => this.router.navigate([this.clientViewPath, this.clientId]),
        error: (err) => console.error('Failed to update note', err),
      });
    } else {
      this.noteService.addNewNote('clients', this.clientId, this.note).subscribe({
        next: () => this.router.navigate([this.clientViewPath, this.clientId]),
        error: (err) => console.error('Failed to add note', err),
      });
    }
  }

  onCancel(): void {
    this.router.navigate([this.clientViewPath, this.clientId]);
  }
}
