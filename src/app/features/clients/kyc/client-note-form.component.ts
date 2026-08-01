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
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonItem,
  IonLabel,
  IonTextarea,
  IonButton,
} from '@ionic/angular/standalone';
import { NotesService, NoteCreateRequest } from '../../../api';

@Component({
  selector: 'app-client-note-form',
  standalone: true,
  imports: [
    FormsModule,
    TranslateModule,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonItem,
    IonLabel,
    IonTextarea,
    IonButton,
  ],
  template: `
    <div class="form-container">
      <ion-card>
        <ion-card-header>
          <ion-card-title>
            {{ isEditMode ? ('CLIENTS.EDIT_NOTE' | translate) : ('CLIENTS.ADD_NOTE' | translate) }}
          </ion-card-title>
        </ion-card-header>

        <ion-card-content>
          <form #noteForm="ngForm" (ngSubmit)="onSubmit()" class="note-form">
            <ion-item fill="outline" class="full-width">
              <ion-label position="stacked">{{ 'COMMON.NOTE' | translate }}</ion-label>
              <ion-textarea
                [attr.aria-label]="'COMMON.NOTE' | translate"
                name="note"
                [(ngModel)]="note.note"
                required
                rows="6"
                id="client-note-textarea"
                data-testid="client-note-textarea"
              ></ion-textarea>
            </ion-item>

            <div class="form-actions">
              <ion-button
                fill="clear"
                color="medium"
                type="button"
                (click)="onCancel()"
                id="client-note-cancel-btn"
                data-testid="client-note-cancel-btn"
              >
                {{ 'COMMON.CANCEL' | translate }}
              </ion-button>
              <ion-button
                color="primary"
                type="submit"
                [disabled]="!noteForm.form.valid"
                id="client-note-submit-btn"
                data-testid="client-note-submit-btn"
              >
                {{ 'COMMON.SAVE' | translate }}
              </ion-button>
            </div>
          </form>
        </ion-card-content>
      </ion-card>
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

  note: NoteCreateRequest = {
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
    this.noteService
      .getResourceTypeResourceIdNotesNoteId('clients', this.clientId, this.noteId!)
      .subscribe((data) => {
        this.note = {
          note: data.note ?? '',
        };
      });
  }

  onSubmit(): void {
    if (this.isEditMode) {
      this.noteService
        .putResourceTypeResourceIdNotesNoteId('clients', this.clientId, this.noteId!, this.note)
        .subscribe({
          next: () => this.router.navigate([this.clientViewPath, this.clientId]),
          error: (err) => console.error('Failed to update note', err),
        });
    } else {
      this.noteService
        .postResourceTypeResourceIdNotes('clients', this.clientId, this.note)
        .subscribe({
          next: () => this.router.navigate([this.clientViewPath, this.clientId]),
          error: (err) => console.error('Failed to add note', err),
        });
    }
  }

  onCancel(): void {
    this.router.navigate([this.clientViewPath, this.clientId]);
  }
}
