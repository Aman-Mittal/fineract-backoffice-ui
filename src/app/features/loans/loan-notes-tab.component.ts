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
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialog } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { NotesService, NoteData } from '../../api';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';

// Notes are treated as an append-only audit trail (who said what, when) —
// staff can add and remove entries, but existing note text is not editable
// in place, so the record stays trustworthy for compliance review.
@Component({
  selector: 'app-loan-notes-tab',
  standalone: true,
  imports: [
    FormsModule,
    TranslateModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    DatePipe,
  ],
  template: `
    <div class="add-note-row">
      <mat-form-field appearance="outline" class="note-input">
        <mat-label>{{ 'LOANS.ADD_NOTE' | translate }}</mat-label>
        <textarea matInput rows="2" [(ngModel)]="newNoteText" name="newNote"></textarea>
      </mat-form-field>
      <button
        mat-raised-button
        color="primary"
        [disabled]="!newNoteText.trim() || isSaving()"
        (click)="onAddNote()"
      >
        <mat-icon>add</mat-icon>
        {{ 'COMMON.SAVE' | translate }}
      </button>
    </div>

    @if (isLoading()) {
      <p class="empty-state">{{ 'COMMON.LOADING' | translate }}</p>
    } @else if (notes().length === 0) {
      <p class="empty-state">{{ 'LOANS.NO_NOTES' | translate }}</p>
    } @else {
      <div class="notes-list">
        @for (note of notes(); track note.id) {
          <div class="note-item">
            <div class="note-text">{{ note.note }}</div>
            <div class="note-meta">
              <span>{{ note.createdByUsername }}</span>
              <span>&middot;</span>
              <span>{{ note.createdOn | date: 'medium' }}</span>
            </div>
            <button
              mat-icon-button
              color="warn"
              class="delete-btn"
              (click)="onDeleteNote(note.id!)"
            >
              <mat-icon>delete</mat-icon>
            </button>
          </div>
        }
      </div>
    }
  `,
  styles: [
    `
      .add-note-row {
        display: flex;
        gap: 12px;
        align-items: flex-start;
        margin-bottom: 20px;
      }
      .note-input {
        flex: 1;
      }
      .notes-list {
        display: flex;
        flex-direction: column;
        gap: 12px;
      }
      .note-item {
        position: relative;
        padding: 12px 40px 12px 16px;
        border: 1px solid var(--border-color, #e0e0e0);
        border-radius: 8px;
      }
      .note-text {
        white-space: pre-wrap;
        margin-bottom: 6px;
      }
      .note-meta {
        display: flex;
        gap: 6px;
        font-size: 12px;
        color: var(--text-muted, #7f8c8d);
      }
      .delete-btn {
        position: absolute;
        top: 4px;
        right: 4px;
      }
      .empty-state {
        color: #95a5a6;
        text-align: center;
        padding: 24px;
      }
    `,
  ],
})
export class LoanNotesTabComponent implements OnInit {
  @Input({ required: true }) loanId!: number;

  private readonly notesService = inject(NotesService);
  private readonly dialog = inject(MatDialog);
  private readonly translate = inject(TranslateService);

  notes = signal<NoteData[]>([]);
  isLoading = signal(false);
  isSaving = signal(false);
  newNoteText = '';

  ngOnInit(): void {
    this.loadNotes();
  }

  loadNotes(): void {
    this.isLoading.set(true);
    this.notesService.getResourceTypeResourceIdNotes('loans', this.loanId).subscribe({
      next: (data) => {
        this.notes.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to load loan notes', err);
        this.isLoading.set(false);
      },
    });
  }

  onAddNote(): void {
    const note = this.newNoteText.trim();
    if (!note) return;
    this.isSaving.set(true);
    this.notesService.postResourceTypeResourceIdNotes('loans', this.loanId, { note }).subscribe({
      next: () => {
        this.newNoteText = '';
        this.isSaving.set(false);
        this.loadNotes();
      },
      error: (err) => {
        console.error('Failed to add loan note', err);
        this.isSaving.set(false);
      },
    });
  }

  onDeleteNote(noteId: number): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: this.translate.instant('COMMON.DELETE'),
        message: this.translate.instant('LOANS.CONFIRM_DELETE_NOTE'),
        destructive: true,
      },
    });
    dialogRef.afterClosed().subscribe((confirmed) => {
      if (!confirmed) return;
      this.notesService
        .deleteResourceTypeResourceIdNotesNoteId('loans', this.loanId, noteId)
        .subscribe({
          next: () => this.loadNotes(),
          error: (err) => console.error('Failed to delete loan note', err),
        });
    });
  }
}
