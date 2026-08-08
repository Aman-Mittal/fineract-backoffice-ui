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
import {
  IonButton,
  IonDatetime,
  IonDatetimeButton,
  IonItem,
  IonLabel,
  IonModal,
  IonSelect,
  IonSelectOption,
} from '@ionic/angular/standalone';

import { BusinessDateManagementService, GroupsService } from '../../api';
import { OVERLAY, TranslatePipe } from '../../core/adapters';
import { toIsoDate } from '../../core/utils/date-formatter';

export interface GroupActionDialogData {
  /** Translation key for the heading. */
  title: string;
  /** The Fineract command this dialog collects arguments for. */
  command: 'activate' | 'close';
  /**
   * ISO `YYYY-MM-DD`: the earliest date the platform will accept for this command, taken from
   * a date Fineract has already stamped — the group's submitted-on date for an activation, its
   * activation date for a closure. Optional, because a caller that has neither is no worse off
   * than before. See {@link GroupActionDialogComponent.applyMinDate}.
   */
  minDate?: string;
}

export interface GroupActionResult {
  /** ISO `YYYY-MM-DD`; the caller converts to Fineract's `dd MMMM yyyy`. */
  actionDate: string;
  closureReasonId?: number;
}

/**
 * Collects the date — and, for a closure, the reason — that a group lifecycle command needs.
 *
 * Closure reasons come from `GET /groups/template?command=close` rather than from
 * `CodesService`. It is the same underlying `GroupClosureReason` code, but asking the command's
 * own template means the list is whatever the platform will actually accept for this command,
 * and it is one round trip instead of two.
 *
 * That code ships with no values. An institution that has not populated it cannot close a group
 * at all — the platform rejects the request for a missing `closureReasonId` — so an empty list
 * says so on screen instead of presenting an empty dropdown and a confirm button that fails.
 */
@Component({
  selector: 'app-group-action-dialog',
  standalone: true,
  imports: [
    FormsModule,
    TranslatePipe,
    IonButton,
    IonItem,
    IonLabel,
    IonSelect,
    IonSelectOption,
    IonDatetime,
    IonDatetimeButton,
    IonModal,
  ],
  template: `
    <h2 class="dialog-title">{{ data().title | appTranslate }}</h2>
    <div class="dialog-content">
      <div class="dialog-form">
        <ion-item fill="outline" class="full-width">
          <ion-label position="stacked">{{ dateLabel | appTranslate }}</ion-label>
          <ion-datetime-button datetime="group-action-date"></ion-datetime-button>
          <ion-modal [keepContentsMounted]="true">
            <ng-template>
              <ion-datetime
                id="group-action-date"
                data-testid="group-action-date"
                presentation="date"
                name="actionDate"
                [ngModel]="actionDate()"
                (ngModelChange)="actionDate.set($event)"
                required
                [min]="minDate()"
                [max]="maxDate()"
              ></ion-datetime>
            </ng-template>
          </ion-modal>
        </ion-item>

        @if (data().command === 'close') {
          <ion-item fill="outline" class="full-width">
            <ion-label position="stacked">{{ 'ACTIONS.CLOSURE_REASON' | appTranslate }}</ion-label>
            <ion-select
              [attr.aria-label]="'ACTIONS.CLOSURE_REASON' | appTranslate"
              interface="popover"
              data-testid="group-closure-reason"
              name="closureReasonId"
              [(ngModel)]="closureReasonId"
              required
            >
              @for (reason of closureReasons(); track reason.id) {
                <ion-select-option [value]="reason.id">{{ reason.name }}</ion-select-option>
              }
            </ion-select>
          </ion-item>

          @if (!closureReasons().length) {
            <p class="field-note" data-testid="group-no-closure-reasons">
              {{ 'GROUPS.NO_CLOSURE_REASONS' | appTranslate }}
            </p>
          }
        }
      </div>
    </div>
    <div class="dialog-actions">
      <ion-button fill="clear" color="medium" (click)="onCancel()">
        {{ 'COMMON.CANCEL' | appTranslate }}
      </ion-button>
      <ion-button
        color="primary"
        data-testid="group-action-confirm"
        [disabled]="!isValid()"
        (click)="onConfirm()"
      >
        {{ 'COMMON.CONFIRM' | appTranslate }}
      </ion-button>
    </div>
  `,
  styles: [
    `
      .dialog-form {
        display: flex;
        flex-direction: column;
        gap: 16px;
        padding-top: 8px;
        min-width: 350px;
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
export class GroupActionDialogComponent implements OnInit {
  private readonly overlay = inject(OVERLAY);
  private readonly groupsService = inject(GroupsService);
  private readonly businessDateService = inject(BusinessDateManagementService);

  readonly data = input.required<GroupActionDialogData>();

  readonly actionDate = signal(toIsoDate(new Date()));
  readonly minDate = signal<string | undefined>(undefined);
  readonly maxDate = signal<string | undefined>(undefined);
  readonly closureReasons = signal<{ id?: number; name?: string }[]>([]);
  closureReasonId?: number;

  get dateLabel(): string {
    return this.data().command === 'activate' ? 'ACTIONS.ACTIVATION_DATE' : 'ACTIONS.CLOSURE_DATE';
  }

  ngOnInit(): void {
    this.applyMinDate();
    this.loadBusinessDate();
    if (this.data().command === 'close') {
      this.loadClosureReasons();
    }
  }

  /**
   * Floors the picker at the date the platform has already committed to, and moves the default
   * up to meet it.
   *
   * The default above comes from the browser's clock. The date it has to sit on or after —
   * the group's submitted-on date for an activation, its activation date for a closure — was
   * stamped by Fineract in the *tenant's* timezone, and the two disagree about what day it is
   * for as long as the offset between them. A browser in UTC against the stock `Asia/Kolkata`
   * tenant is a day behind from 18:30 UTC onwards, and sending that day answers
   * `error.msg.group.submittedOnDate.after.activation.date`: the group stays pending, with a
   * toast as the only sign of why. Taking the later of the two takes the browser's clock out
   * of the decision wherever the platform has already made it.
   *
   * A lexical comparison is the right one here — both sides are zero-padded `YYYY-MM-DD`, which
   * orders identically to the dates it spells, and parsing them back into `Date` would put the
   * browser's timezone back into a comparison this exists to keep it out of.
   */
  private applyMinDate(): void {
    const min = this.data().minDate;
    if (!min) return;

    this.minDate.set(min);
    if (min > this.actionDate()) {
      this.actionDate.set(min);
    }
  }

  /**
   * Defaults the date to the platform's business date, and caps the picker there.
   *
   * A tenant running with a business date behind today rejects anything after it, and the
   * message names the constraint rather than the field, so the picker enforces it instead.
   */
  private loadBusinessDate(): void {
    this.businessDateService.getBusinessdate().subscribe({
      next: (dates) => {
        const businessDate = dates.find((entry) => entry.type === 'BUSINESS_DATE');
        const parts = businessDate?.date as unknown as number[] | undefined;
        if (parts?.length) {
          const iso = toIsoDate(new Date(parts[0], parts[1] - 1, parts[2]));
          const min = this.minDate();
          // A business date earlier than the floor would leave the picker with a range it
          // cannot satisfy. The floor wins, because it is the constraint the command itself
          // validates; a business date that far behind is a tenant configuration question and
          // the platform will say so on submit.
          if (!min || iso >= min) {
            this.actionDate.set(iso);
            this.maxDate.set(iso);
          }
        }
      },
      // A tenant with the business-date module off answers 403 here. Today's date is the
      // right fallback, and the command itself still validates server-side.
      error: () => undefined,
    });
  }

  private loadClosureReasons(): void {
    this.groupsService.getGroupsTemplate(undefined, undefined, undefined, 'close').subscribe({
      next: (template) => {
        const reasons = (
          template as unknown as { closureReasons?: { id?: number; name?: string }[] }
        ).closureReasons;
        this.closureReasons.set(reasons ?? []);
      },
      error: () => this.closureReasons.set([]),
    });
  }

  isValid(): boolean {
    if (!this.actionDate()) return false;
    if (this.data().command === 'close' && !this.closureReasonId) return false;
    return true;
  }

  onCancel(): void {
    void this.overlay.dismissModal();
  }

  onConfirm(): void {
    if (!this.isValid()) return;
    void this.overlay.dismissModal<GroupActionResult>({
      actionDate: this.actionDate(),
      closureReasonId: this.closureReasonId,
    });
  }
}
