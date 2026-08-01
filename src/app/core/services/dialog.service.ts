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

import { Injectable, inject } from '@angular/core';
import { ModalController } from '@ionic/angular/standalone';
import { TranslateService } from '@ngx-translate/core';
import type { ConfirmDialogData } from '../../shared/components/confirm-dialog/confirm-dialog.component';

export type { ConfirmDialogData };

/** Component constructor accepted by {@link DialogService.open}. */
type ComponentRef = new (...args: never[]) => unknown;

/**
 * Application-wide modal dialogs.
 *
 * Wraps Ionic's `ModalController` so call sites deal in promises of results rather than
 * controller lifecycles, and so confirmations share one implementation.
 */
@Injectable({ providedIn: 'root' })
export class DialogService {
  private readonly modalController = inject(ModalController);
  private readonly translate = inject(TranslateService);

  /**
   * Opens a component as a modal and resolves with the value it was dismissed with,
   * or `undefined` if it was dismissed without one (backdrop click, escape).
   */
  async open<T>(
    component: ComponentRef,
    data?: Record<string, unknown>,
    cssClass?: string | string[],
  ): Promise<T | undefined> {
    // `[x].flat()` normalises both accepted shapes — a single class or an array.
    const callerClasses = cssClass ? [cssClass].flat() : [];

    const modal = await this.modalController.create({
      component,
      componentProps: data,
      // Every dialog gets `app-dialog`, which is what gives its body a scroll
      // container — see src/styles/_dialogs.scss. Without it a dialog taller than
      // the viewport puts its own action buttons out of reach.
      cssClass: ['app-dialog', ...callerClasses],
    });

    await modal.present();

    const { data: result } = await modal.onWillDismiss<T>();
    return result;
  }

  /**
   * Opens a confirmation dialog and resolves `true` only if the user explicitly confirmed.
   *
   * Loaded lazily so that the confirm dialog component does not pull the whole shared
   * component barrel into every consumer's bundle.
   */
  async confirm(data: ConfirmDialogData): Promise<boolean> {
    const { ConfirmDialogComponent } =
      await import('../../shared/components/confirm-dialog/confirm-dialog.component');

    const result = await this.open<boolean>(ConfirmDialogComponent as ComponentRef, {
      data: {
        confirmText: this.translate.instant('COMMON.CONFIRM'),
        cancelText: this.translate.instant('COMMON.CANCEL'),
        ...data,
      },
    });

    return result === true;
  }
}
