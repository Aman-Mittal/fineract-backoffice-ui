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

import { Component, computed, inject, input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
 *
 * ## Navigation
 *
 * `link` takes Angular router commands, for the call sites that navigate rather than act.
 *
 * It is deliberately NOT a `routerLink` binding. `routerLink` on the inner control would be
 * the obvious spelling, but the directive instantiates whether or not commands are supplied,
 * and it injects `ActivatedRoute` — so every button in the application would require a router
 * in its injector, including the great majority that never navigate. That is a dependency a
 * base primitive has no business imposing: it broke seven existing tests for buttons with no
 * link at all, and those tests were right to fail.
 *
 * So the router is injected optionally and reached only when `link` is set. A button without
 * one needs no router and behaves exactly as before. What this gives up against `routerLink`
 * is `href`-based middle-click and open-in-new-tab — which `ion-button` never offered anyway,
 * because it renders an `<a>` only for `href`, and a `routerLink` on it produced a `<button>`
 * with a click handler and no href. Nothing is lost that the call sites had.
 *
 * `type` is still required and still means what it says: a navigating button is not a submit.
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
      (click)="navigate()"
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
  /** Router commands for a button that navigates. Omit for one that performs an action. */
  readonly link = input<unknown[] | string>();
  /** Already-translated accessible name. Required when there is an icon and no text. */
  readonly label = input<string>();

  // Optional so that a button which never navigates imposes no router on its consumers.
  private readonly router = inject(Router, { optional: true });
  private readonly route = inject(ActivatedRoute, { optional: true });

  protected readonly color = computed(() => INTENT_COLOR[this.intent()]);
  protected readonly fill = computed(() => EMPHASIS_FILL[this.emphasis()]);

  protected navigate(): void {
    const commands = this.link();
    if (commands === undefined || !this.router) return;
    // `relativeTo` matches what `routerLink` on the same element would have resolved against,
    // so a caller's relative commands keep working.
    void this.router.navigate(Array.isArray(commands) ? commands : [commands], {
      relativeTo: this.route ?? undefined,
    });
  }
}
