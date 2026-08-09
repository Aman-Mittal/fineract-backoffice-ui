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

import { Component, computed, input, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonItem, IonLabel, IonSelect, IonSelectOption } from '@ionic/angular/standalone';

import { TranslatePipe } from '../../../core/adapters';
import { GlAccountOption } from './product-accounting.model';

/**
 * One GL-account slot: a labelled picker over the accounts a product may map into it.
 *
 * Options are always passed in, never fetched. They come from the product template alongside
 * every other option list on the form, so fetching here would be a second round trip for data
 * the parent already holds — and, on a tenant with a large chart of accounts, one per slot.
 *
 * The option text carries the GL code as well as the name. Charts of accounts are organised by
 * code, and an accountant filling this in is reading from a numbered list; a name alone leaves
 * them guessing which "Interest Income" is meant.
 */
@Component({
  selector: 'app-gl-account-select',
  standalone: true,
  imports: [FormsModule, TranslatePipe, IonItem, IonLabel, IonSelect, IonSelectOption],
  template: `
    <ion-item fill="outline" class="form-item">
      <!--
        The label is the field name and nothing else. An asterisk here would be the only one in
        the application, and it would also land inside the label's text, which is what every
        label-scoped locator in the suite matches on.
      -->
      <ion-label position="stacked">{{ label() | appTranslate }}</ion-label>
      <!--
        The accessible name comes from aria-label, not from the ion-label above it. Ionic
        associates a select with its own label property or a slotted label only; a sibling
        ion-label is decorative, so without this the control announces as unlabelled.
      -->
      <ion-select
        [attr.aria-label]="label() | appTranslate"
        interface="popover"
        [name]="name()"
        [attr.data-testid]="testId()"
        [ngModel]="accountId()"
        (ngModelChange)="accountId.set($event)"
        [required]="required()"
        [disabled]="!options().length"
        placeholder="{{ 'PRODUCTS.ACCOUNTING.SELECT_ACCOUNT' | appTranslate }}"
      >
        @for (account of options(); track account.id) {
          <ion-select-option [value]="account.id">{{ optionLabel(account) }}</ion-select-option>
        }
      </ion-select>
    </ion-item>
  `,
  styles: [
    `
      .form-item {
        width: 100%;
      }
    `,
  ],
})
export class GlAccountSelectComponent {
  /** Translation key for the visible label. */
  readonly label = input.required<string>();
  /** Form control name — the request key of the slot, which keeps them unique within the form. */
  readonly name = input.required<string>();
  readonly options = input<GlAccountOption[]>([]);
  readonly required = input(false);
  readonly testId = input<string>();

  readonly accountId = model<number | undefined>(undefined);

  /** The disabled state is derived, so a template that reads it twice cannot disagree with itself. */
  readonly hasOptions = computed(() => this.options().length > 0);

  optionLabel(account: GlAccountOption): string {
    return account.glCode ? `${account.glCode} — ${account.name}` : (account.name ?? '');
  }
}
