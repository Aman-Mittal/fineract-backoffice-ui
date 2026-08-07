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
import { IonButton, IonItem, IonLabel, IonSelect, IonSelectOption } from '@ionic/angular/standalone';

import { GroupsService } from '../../api';
import { OVERLAY, TranslatePipe } from '../../core/adapters';
import { GroupClientMember, GroupRoleOption } from './group-detail.model';

export interface GroupRoleDialogData {
  officeId?: number;
  /** Only members can hold a committee role, so the group's own membership is the candidate list. */
  members: GroupClientMember[];
}

export interface GroupRoleResult {
  clientId: number;
  roleId: number;
}

/**
 * Assigns a committee role — Leader, Secretary, and whatever else the institution has defined —
 * to one of the group's members.
 *
 * Roles come from `availableRoles` on the group template, which is the `GroupRoles` code. A
 * tenant that has not populated it has no committee structure to record, so the dialog says that
 * rather than offering an empty dropdown.
 *
 * The command's payload field is `role`, not `roleId`, and it takes the *code value* id. The
 * companion `unassignRole` takes the id of the assignment instead — see
 * {@link GroupRoleAssignment}. Sending the code value id to `unassignRole` answers 404 naming a
 * "group role" that appears to exist, which is why the two ids are kept visibly distinct.
 */
@Component({
  selector: 'app-group-role-dialog',
  standalone: true,
  imports: [FormsModule, TranslatePipe, IonItem, IonLabel, IonSelect, IonSelectOption, IonButton],
  template: `
    <h2 class="dialog-title">{{ 'GROUPS.ASSIGN_ROLE' | appTranslate }}</h2>
    <div class="dialog-content">
      <ion-item fill="outline" class="full-width">
        <ion-label position="stacked">{{ 'GROUPS.MEMBER' | appTranslate }}</ion-label>
        <ion-select
          [attr.aria-label]="'GROUPS.MEMBER' | appTranslate"
          interface="popover"
          data-testid="group-role-member"
          name="clientId"
          [(ngModel)]="clientId"
        >
          @for (member of data().members; track member.id) {
            <ion-select-option [value]="member.id">{{ member.displayName }}</ion-select-option>
          }
        </ion-select>
      </ion-item>

      <ion-item fill="outline" class="full-width">
        <ion-label position="stacked">{{ 'GROUPS.ROLE' | appTranslate }}</ion-label>
        <ion-select
          [attr.aria-label]="'GROUPS.ROLE' | appTranslate"
          interface="popover"
          data-testid="group-role-select"
          name="roleId"
          [(ngModel)]="roleId"
        >
          @for (role of roles(); track role.id) {
            <ion-select-option [value]="role.id">{{ role.name }}</ion-select-option>
          }
        </ion-select>
      </ion-item>

      @if (!roles().length) {
        <p class="field-note" data-testid="group-role-none">
          {{ 'GROUPS.NO_ROLES_DEFINED' | appTranslate }}
        </p>
      }
    </div>
    <div class="dialog-actions">
      <ion-button fill="clear" color="medium" (click)="onCancel()">
        {{ 'COMMON.CANCEL' | appTranslate }}
      </ion-button>
      <ion-button
        color="primary"
        data-testid="group-role-confirm"
        [disabled]="clientId === undefined || roleId === undefined"
        (click)="onConfirm()"
      >
        {{ 'COMMON.CONFIRM' | appTranslate }}
      </ion-button>
    </div>
  `,
  styles: [
    `
      .dialog-content {
        display: flex;
        flex-direction: column;
        gap: 16px;
        min-width: 340px;
      }
      .full-width {
        width: 100%;
      }
      .field-note {
        margin: 0;
        font-size: 12px;
        color: var(--text-muted, #6b7280);
      }
    `,
  ],
})
export class GroupRoleDialogComponent implements OnInit {
  private readonly overlay = inject(OVERLAY);
  private readonly groupsService = inject(GroupsService);

  readonly data = input.required<GroupRoleDialogData>();

  readonly roles = signal<GroupRoleOption[]>([]);
  clientId?: number;
  roleId?: number;

  ngOnInit(): void {
    this.groupsService.getGroupsTemplate(this.data().officeId).subscribe({
      next: (template) => {
        const available = (template as unknown as { availableRoles?: GroupRoleOption[] })
          .availableRoles;
        this.roles.set((available ?? []).filter((role) => role.active !== false));
      },
      error: () => this.roles.set([]),
    });
  }

  onCancel(): void {
    void this.overlay.dismissModal();
  }

  onConfirm(): void {
    if (this.clientId === undefined || this.roleId === undefined) return;
    void this.overlay.dismissModal<GroupRoleResult>({
      clientId: this.clientId,
      roleId: this.roleId,
    });
  }
}
