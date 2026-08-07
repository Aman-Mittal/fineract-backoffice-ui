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

import { Component, OnInit, inject, input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged, of, switchMap } from 'rxjs';
import { catchError } from 'rxjs/operators';
import {
  IonButton,
  IonCheckbox,
  IonItem,
  IonList,
  IonSearchbar,
} from '@ionic/angular/standalone';

import { ClientService, GetClientsPageItemsResponse } from '../../api';
import { OVERLAY, TranslatePipe } from '../../core/adapters';
import { GroupClientMember } from './group-detail.model';

export interface GroupMembersDialogData {
  /** `add` searches the office for candidates; `remove` lists the group's current members. */
  mode: 'add' | 'remove';
  /** Scopes the candidate search. A group may only hold clients from its own office. */
  officeId?: number;
  /** The group's current members — the candidate list in `remove` mode, the exclusion set in `add`. */
  members: GroupClientMember[];
}

export interface GroupMembersResult {
  clientMembers: number[];
}

/**
 * Chooses the clients to associate with, or disassociate from, a group.
 *
 * The two modes differ in where the candidates come from, not in what the caller does with the
 * answer — both resolve to a list of client ids for `POST /groups/{id}?command=…`.
 *
 * **Adding** searches `GET /clients` rather than reading `clientOptions` off the group template.
 * The template's list is capped by the platform and comes back empty on a tenant of any size, so
 * a dropdown built from it silently offers nothing. Searching also scales past the point where a
 * dropdown of every client in the office would be usable.
 *
 * The search is scoped to the group's office because Fineract refuses a client from anywhere
 * else, and filtered against the current membership so that a client already in the group is not
 * offered — associating them a second time is rejected.
 */
@Component({
  selector: 'app-group-members-dialog',
  standalone: true,
  imports: [
    FormsModule,
    TranslatePipe,
    IonButton,
    IonCheckbox,
    IonItem,
    IonList,
    IonSearchbar,
  ],
  template: `
    <h2 class="dialog-title">
      {{ (data().mode === 'add' ? 'GROUPS.ADD_MEMBERS' : 'GROUPS.REMOVE_MEMBERS') | appTranslate }}
    </h2>
    <div class="dialog-content">
      @if (data().mode === 'add') {
        <ion-searchbar
          data-testid="group-member-search"
          [attr.aria-label]="'GROUPS.SEARCH_CLIENTS' | appTranslate"
          [placeholder]="'GROUPS.SEARCH_CLIENTS' | appTranslate"
          [debounce]="0"
          (ionInput)="onSearch($any($event).detail.value)"
        ></ion-searchbar>
      }

      <ion-list class="candidate-list">
        @for (candidate of candidates(); track candidate.id) {
          <ion-item>
            <ion-checkbox
              justify="start"
              labelPlacement="end"
              [attr.data-testid]="'group-member-' + candidate.id"
              [checked]="selected().has(candidate.id!)"
              (ionChange)="toggle(candidate.id!)"
            >
              {{ candidate.displayName }}
              @if (candidate.accountNo) {
                <span class="account-no">({{ candidate.accountNo }})</span>
              }
            </ion-checkbox>
          </ion-item>
        } @empty {
          <p class="field-note" data-testid="group-member-none">
            {{ emptyMessage() | appTranslate }}
          </p>
        }
      </ion-list>
    </div>
    <div class="dialog-actions">
      <ion-button fill="clear" color="medium" (click)="onCancel()">
        {{ 'COMMON.CANCEL' | appTranslate }}
      </ion-button>
      <ion-button
        color="primary"
        data-testid="group-members-confirm"
        [disabled]="!selected().size"
        (click)="onConfirm()"
      >
        {{ 'COMMON.CONFIRM' | appTranslate }}
      </ion-button>
    </div>
  `,
  styles: [
    `
      .dialog-content {
        min-width: 360px;
      }
      .candidate-list {
        max-height: 320px;
        overflow-y: auto;
      }
      .account-no {
        margin-left: 6px;
        color: var(--text-muted, #6b7280);
        font-size: 12px;
      }
      .field-note {
        margin: 12px 4px;
        font-size: 13px;
        color: var(--text-muted, #6b7280);
      }
    `,
  ],
})
export class GroupMembersDialogComponent implements OnInit {
  private readonly overlay = inject(OVERLAY);
  private readonly clientService = inject(ClientService);

  readonly data = input.required<GroupMembersDialogData>();

  readonly candidates = signal<GroupClientMember[]>([]);
  /**
   * A signal rather than a plain `Set` field: it is read from the template and mutated from a
   * checkbox handler, and under Angular 22's OnPush default a mutated-in-place Set notifies
   * nothing. Every write replaces the Set so the identity changes.
   */
  readonly selected = signal<ReadonlySet<number>>(new Set());

  private readonly searchTerm = new Subject<string>();

  ngOnInit(): void {
    if (this.data().mode === 'remove') {
      this.candidates.set(this.data().members);
      return;
    }

    this.searchTerm
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((term) =>
          this.clientService
            .getClients(
              this.data().officeId,
              undefined,
              term || undefined,
              undefined,
              undefined,
              'active',
              undefined,
              0,
              20,
            )
            .pipe(catchError(() => of(null))),
        ),
      )
      .subscribe((response) => {
        const existing = new Set(this.data().members.map((member) => member.id));
        const rows: GetClientsPageItemsResponse[] = response?.pageItems
          ? Array.from(response.pageItems)
          : [];
        this.candidates.set(rows.filter((row) => !existing.has(row.id)));
      });

    // Seeded so the dialog opens with the office's first page rather than an empty panel that
    // only fills once the operator guesses a name.
    this.searchTerm.next('');
  }

  emptyMessage(): string {
    return this.data().mode === 'add' ? 'GROUPS.NO_CLIENTS_FOUND' : 'GROUPS.NO_MEMBERS';
  }

  onSearch(term: string | null | undefined): void {
    this.searchTerm.next(term ?? '');
  }

  toggle(clientId: number): void {
    const next = new Set(this.selected());
    if (!next.delete(clientId)) next.add(clientId);
    this.selected.set(next);
  }

  onCancel(): void {
    void this.overlay.dismissModal();
  }

  onConfirm(): void {
    if (!this.selected().size) return;
    void this.overlay.dismissModal<GroupMembersResult>({
      clientMembers: [...this.selected()],
    });
  }
}
