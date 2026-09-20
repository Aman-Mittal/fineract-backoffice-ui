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

import { Component, input } from '@angular/core';
import { IonIcon } from '@ionic/angular/standalone';

/**
 * An icon, named from the application's registered set.
 *
 * ## The contract
 *
 * `name` is an entry in `src/app/core/icons.ts`; `scripts/check-icons.mjs` fails the build on a
 * name that is not registered, because an unregistered icon renders as blank space with no
 * error at runtime.
 *
 * `label` decides what assistive technology does with it, and the default is the safe one.
 * Without a label the icon is decorative — `aria-hidden` — because an icon beside its own text
 * label would otherwise be announced twice. An icon carrying meaning of its own passes a
 * translated `label` and is announced under the `img` role the vendor already sets.
 *
 * ## Why this wraps Ionic rather than an <svg>
 *
 * ADR 0005 migrates one primitive at a time and does not add a dependency to do it. The
 * ionicons set is already loaded and registered; replacing the renderer is a change behind this
 * component, and the contract above is what callers are held to in the meantime.
 */
@Component({
  selector: 'app-icon',
  standalone: true,
  imports: [IonIcon],
  template: `
    <ion-icon
      [name]="name()"
      [attr.aria-label]="label() ?? null"
      [attr.aria-hidden]="label() ? null : 'true'"
    />
  `,
  styles: [
    `
      :host {
        display: inline-flex;
        align-items: center;
      }
      ion-icon {
        font-size: inherit;
      }
    `,
  ],
})
export class IconComponent {
  /** A name registered in `src/app/core/icons.ts`. */
  readonly name = input.required<string>();
  /** Already-translated accessible name. Omit for an icon that repeats adjacent text. */
  readonly label = input<string>();
}
