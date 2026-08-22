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

import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonCheckbox,
  IonDatetime,
  IonDatetimeButton,
  IonInput,
  IonItem,
  IonLabel,
  IonModal,
  IonSelect,
  IonSelectOption,
  IonSpinner,
} from '@ionic/angular/standalone';

import { I18N, TranslatePipe } from '../../../core/adapters';
import { NotificationService } from '../../../core/services/notification.service';
import {
  FINERACT_DATE_FORMAT,
  FINERACT_LOCALE,
  formatDateToFineract,
  toIsoDate,
} from '../../../core/utils/date-formatter';
import {
  BASE_PATH,
  GetSavingsProductsResponse,
  SavingsAccountService,
  SavingsProductService,
} from '../../../api';
import { GroupDetail } from '../group-detail.model';

interface GsimMemberRow {
  id: number;
  displayName: string;
  selected: boolean;
}

/**
 * Creates a GSIM (Group Savings In individual Monitoring) application: one savings account per
 * selected group member, sharing the same product, submitted as a single request to the
 * dedicated `/savingsaccounts/gsim` endpoint.
 *
 * Mirrors web-app's `create-gsim-account.component.ts`: the first member selected (in selection
 * order) is the GSIM parent (`isParentAccount: true`); every other selected member's entry
 * carries `isParentAccount: false`. Unlike GLIM's request model, `PostSavingsAccountsRequest`
 * has nothing describing this shape at all — the generated client's `postSavingsaccountsGsim`
 * takes a raw string body, so the payload is built and stringified by hand rather than through
 * any typed model.
 */
@Component({
  selector: 'app-create-gsim-account',
  standalone: true,
  imports: [
    FormsModule,
    TranslatePipe,
    IonButton,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonCheckbox,
    IonDatetime,
    IonDatetimeButton,
    IonInput,
    IonItem,
    IonLabel,
    IonModal,
    IonSelect,
    IonSelectOption,
    IonSpinner,
  ],
  template: `
    <div class="form-container">
      <ion-card>
        <ion-card-header>
          <ion-card-title>{{ 'GROUPS.CREATE_GSIM_SAVINGS' | appTranslate }}</ion-card-title>
        </ion-card-header>

        <ion-card-content>
          @if (isLoading()) {
            <ion-spinner data-testid="gsim-form-loading" />
          } @else {
            <form #gsimForm="ngForm" (ngSubmit)="onSubmit()" class="gsim-form">
              <div class="form-grid">
                <ion-item fill="outline">
                  <ion-label position="stacked">{{ 'COMMON.PRODUCT' | appTranslate }}</ion-label>
                  <ion-select
                    [attr.aria-label]="'COMMON.PRODUCT' | appTranslate"
                    interface="popover"
                    name="productId"
                    [(ngModel)]="productId"
                    required
                  >
                    @for (product of products(); track product.id) {
                      <ion-select-option [value]="product.id">{{ product.name }}</ion-select-option>
                    }
                  </ion-select>
                </ion-item>

                <ion-item fill="outline">
                  <ion-label position="stacked">{{
                    'COMMON.SUBMITTED_ON' | appTranslate
                  }}</ion-label>
                  <ion-datetime-button datetime="submittedOnDate-picker" />
                  <ion-modal [keepContentsMounted]="true">
                    <ng-template>
                      <ion-datetime
                        id="submittedOnDate-picker"
                        data-testid="submittedOnDate-picker"
                        presentation="date"
                        name="submittedOnDate"
                        [ngModel]="submittedOnDate()"
                        (ngModelChange)="submittedOnDate.set($event)"
                        required
                      />
                    </ng-template>
                  </ion-modal>
                </ion-item>

                <ion-item fill="outline">
                  <ion-label position="stacked">{{
                    'COMMON.INTEREST_RATE' | appTranslate
                  }}</ion-label>
                  <ion-input
                    [attr.aria-label]="'COMMON.INTEREST_RATE' | appTranslate"
                    type="number"
                    name="nominalAnnualInterestRate"
                    [(ngModel)]="interestRate"
                  />
                </ion-item>
              </div>

              <h2>{{ 'GROUPS.MEMBERS' | appTranslate }}</h2>
              @if (members().length === 0) {
                <p data-testid="gsim-no-members">{{ 'GROUPS.NO_ACTIVE_MEMBERS' | appTranslate }}</p>
              } @else {
                <table class="members-table" data-testid="gsim-members-table">
                  <tbody>
                    @for (member of members(); track member.id) {
                      <tr>
                        <td>
                          <ion-checkbox
                            [attr.aria-label]="member.displayName"
                            [ngModel]="member.selected"
                            (ngModelChange)="onMemberSelectedChange(member, $event)"
                            [name]="'select-' + member.id"
                          />
                        </td>
                        <td>{{ member.displayName }}</td>
                      </tr>
                    }
                  </tbody>
                </table>
              }

              <div class="form-actions">
                <ion-button fill="clear" type="button" (click)="onCancel()" [disabled]="isSaving()">
                  {{ 'COMMON.CANCEL' | appTranslate }}
                </ion-button>
                <ion-button
                  color="primary"
                  type="submit"
                  [disabled]="gsimForm.invalid || !canSubmit() || isSaving()"
                >
                  @if (isSaving()) {
                    <ion-spinner name="crescent" />
                    {{ 'COMMON.SAVING' | appTranslate }}
                  } @else {
                    {{ 'COMMON.SAVE' | appTranslate }}
                  }
                </ion-button>
              </div>
            </form>
          }
        </ion-card-content>
      </ion-card>
    </div>
  `,
  styles: [
    `
      .form-container {
        padding: 24px;
        max-width: 900px;
        margin: 0 auto;
      }
      .gsim-form {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }
      .form-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 16px;
      }
      h2 {
        font-size: 1rem;
        margin: 8px 0;
      }
      .members-table {
        width: 100%;
        border-collapse: collapse;
      }
      .members-table td {
        padding: 8px;
        border-bottom: 1px solid var(--ion-color-light-shade);
      }
      .form-actions {
        display: flex;
        justify-content: flex-end;
        gap: 8px;
      }
    `,
  ],
})
export class CreateGsimAccountComponent implements OnInit {
  private readonly httpClient = inject(HttpClient);
  private readonly basePath = inject(BASE_PATH);
  private readonly productService = inject(SavingsProductService);
  private readonly savingsService = inject(SavingsAccountService);
  private readonly notifications = inject(NotificationService);
  private readonly i18n = inject(I18N);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  groupId = 0;

  readonly isLoading = signal(true);
  readonly isSaving = signal(false);
  readonly members = signal<GsimMemberRow[]>([]);
  readonly products = signal<GetSavingsProductsResponse[]>([]);

  productId: number | null = null;
  interestRate: number | null = null;
  readonly submittedOnDate = signal(toIsoDate(new Date()));

  readonly selectedMembers = computed(() => this.members().filter((member) => member.selected));
  readonly canSubmit = computed(() => this.selectedMembers().length > 0);

  ngOnInit(): void {
    this.groupId = Number(this.route.snapshot.paramMap.get('groupId'));
    this.loadProducts();
    this.loadMembers();
  }

  private loadProducts(): void {
    this.productService.getSavingsproducts().subscribe({
      next: (data) => this.products.set(data ?? []),
      error: () => this.notifications.error(this.i18n.translate('GROUPS.GSIM_TEMPLATE_FAILED')),
    });
  }

  private loadMembers(): void {
    this.httpClient
      .get<GroupDetail>(`${this.basePath}/v1/groups/${this.groupId}`, {
        params: { associations: 'all' },
      })
      .subscribe({
        next: (detail) => {
          const source = detail.activeClientMembers ?? detail.clientMembers ?? [];
          this.members.set(
            source
              .filter((member) => member.id !== undefined)
              .map((member) => ({
                id: member.id as number,
                displayName: member.displayName ?? '',
                selected: false,
              })),
          );
          this.isLoading.set(false);
        },
        error: () => {
          this.isLoading.set(false);
          this.notifications.error(this.i18n.translate('GROUPS.GSIM_TEMPLATE_FAILED'));
        },
      });
  }

  /**
   * Mutating `member.selected` in place would leave `selectedMembers`/`canSubmit` — both
   * `computed()` over the `members` signal — showing a stale value: a signal only notifies its
   * computeds when its own value changes identity, not when a property on an object it already
   * holds changes. Replacing the array gives it a new identity without rebuilding each row.
   */
  onMemberSelectedChange(member: GsimMemberRow, selected: boolean): void {
    member.selected = selected;
    this.members.update((list) => [...list]);
  }

  onSubmit(): void {
    const selected = this.selectedMembers();
    if (selected.length === 0) return;

    this.isSaving.set(true);
    const submittedOn = formatDateToFineract(this.submittedOnDate());

    const clientArray = selected.map((member, index) => ({
      productId: this.productId,
      clientId: member.id,
      groupId: this.groupId,
      isGSIM: true,
      isParentAccount: index === 0,
      nominalAnnualInterestRate: this.interestRate ?? undefined,
      submittedOnDate: submittedOn,
      dateFormat: FINERACT_DATE_FORMAT,
      locale: FINERACT_LOCALE,
    }));

    this.savingsService.postSavingsaccountsGsim(JSON.stringify({ clientArray })).subscribe({
      next: () => {
        this.isSaving.set(false);
        this.notifications.success(this.i18n.translate('GROUPS.GSIM_CREATED'));
        this.router.navigate(['/groups', this.groupId, 'gsim', 'view']);
      },
      error: () => {
        this.isSaving.set(false);
        this.notifications.error(this.i18n.translate('GROUPS.GSIM_CREATE_FAILED'));
      },
    });
  }

  onCancel(): void {
    this.router.navigate(['/groups/view', this.groupId]);
  }
}
