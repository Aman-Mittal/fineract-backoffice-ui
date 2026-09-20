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

import { Component, computed, input } from '@angular/core';
import { IonButton } from '@ionic/angular/standalone';
import { IconComponent } from '../icon/icon.component';
import { SpinnerComponent } from '../spinner/spinner.component';

/** What the action means, not what it looks like. */
export type UiButtonIntent = 'primary' | 'secondary' | 'danger' | 'neutral';
/** How much visual weight it carries among its neighbours. */
export type UiButtonEmphasis = 'solid' | 'outline' | 'quiet';

const INTENT_COLOR: Record<UiButtonIntent, string> = {
  primary: 'primary',
  secondary: 'secondary',
  danger: 'danger',
  neutral: 'medium',
};

const EMPHASIS_FILL: Record<UiButtonEmphasis, 'solid' | 'outline' | 'clear'> = {
  solid: 'solid',
  outline: 'outline',
  quiet: 'clear',
};

/**
 * A button.
 *
 * ## `type` is required, and that is the point
 *
 * `ion-button` defaults to `type="submit"`, so an ordinary action placed anywhere inside a
 * `<form>` submits it — silently, and only on the screens where someone happened to wrap the
 * markup in a form. Eighty-two call sites in this repository pass `type="button"` to say "no,
 * really, do not submit", which is a default being worked around rather than used. Here the
 * caller has to say which it is, so neither behaviour can be inherited by accident.
 *
 * ## Intent and emphasis rather than colour and fill
 *
 * `intent` says what the action means and `emphasis` how loudly it says it; the mapping onto
 * the vendor's `color`/`fill` is private. ADR 0005 asks for this separation so that replacing
 * the renderer is not also a redesign: `danger` stays danger whatever the palette underneath
 * calls it.
 *
 * ## Accessible name
 *
 * A button with an icon and no text needs `label`, because the icon is decorative and there is
 * nothing else to announce. `scripts/check-a11y-names.mjs` fails the build otherwise — a
 * screen reader would announce a nameless button, which is unusable rather than merely
 * untidy.
 *
 * ## Busy
 *
 * `busy` swaps the icon for a spinner, disables the control and sets `aria-busy`. It is
 * separate from `disabled` because the two mean different things to a reader: "working on it"
 * against "not available to you".
 */
@Component({
  selector: 'app-button',
  standalone: true,
  imports: [IonButton, IconComponent, SpinnerComponent],
  template: `
    <ion-button
      data-testid="ui-button"
      [type]="type()"
      [color]="color()"
      [fill]="fill()"
      [size]="size() === 'small' ? 'small' : undefined"
      [disabled]="disabled() || busy()"
      [attr.aria-label]="label() ?? null"
      [attr.aria-busy]="busy() ? 'true' : null"
    >
      @if (busy()) {
        <app-spinner slot="start" />
      } @else if (icon(); as iconName) {
        <app-icon slot="start" [name]="iconName" />
      }
      <ng-content />
    </ion-button>
  `,
  styles: [
    `
      :host {
        display: inline-flex;
      }
      /* The vendor owns the control's own metrics; the host must not add a second box. */
      ion-button {
        margin: 0;
      }
    `,
  ],
})
export class ButtonComponent {
  /**
   * Submit the surrounding form, or perform an ordinary action. No default: see the class
   * comment for why inheriting one is the bug this replaces.
   */
  readonly type = input.required<'button' | 'submit'>();
  readonly intent = input<UiButtonIntent>('primary');
  readonly emphasis = input<UiButtonEmphasis>('solid');
  readonly size = input<'small' | 'medium'>('medium');
  readonly disabled = input(false);
  /** Working on it, as distinct from unavailable: shows a spinner and blocks further presses. */
  readonly busy = input(false);
  /** A name registered in `src/app/core/icons.ts`, shown before the content. */
  readonly icon = input<string>();
  /** Already-translated accessible name. Required when there is an icon and no text. */
  readonly label = input<string>();

  protected readonly color = computed(() => INTENT_COLOR[this.intent()]);
  protected readonly fill = computed(() => EMPHASIS_FILL[this.emphasis()]);
}
