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

import { Directive, TemplateRef, ViewContainerRef, effect, inject, input } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { ConfigService } from '../../core/services/config.service';

/**
 * Structural directive to conditionally include an element based on the user's Fineract permissions.
 *
 * Usage:
 * <button *appHasPermission="'CREATE_CLIENT'">Create Client</button>
 * <button *appHasPermission="['CREATE_CLIENT', 'UPDATE_CLIENT']">Actions</button>
 * <button *appHasPermission="['CREATE_CLIENT', 'UPDATE_CLIENT']; matchAll: true">Strict Action</button>
 */
@Directive({
  selector: '[appHasPermission]',
  standalone: true,
})
export class HasPermissionDirective {
  private readonly templateRef = inject(TemplateRef<unknown>);
  private readonly viewContainer = inject(ViewContainerRef);
  private readonly authService = inject(AuthService);
  private readonly config = inject(ConfigService);

  /** Permission, or permissions, the element requires. */
  readonly appHasPermission = input<string | string[]>([]);
  /** AND semantics for an array. Default is OR — any one of them is enough. */
  readonly appHasPermissionMatchAll = input(false);

  private hasView = false;

  constructor() {
    // One effect over every input the decision depends on, rather than an updateView() call
    // per setter plus one for the session. Signal inputs are tracked like any other signal, so
    // the directive re-evaluates when the permissions change, when the user changes, and when a
    // deployment toggles RBAC — the last of which previously needed reading the signal here
    // purely to register the dependency.
    effect(() => this.updateView());
  }

  private updateView(): void {
    // When RBAC is disabled, render everything regardless of permissions.
    if (!this.config.rbacEnabled()) {
      this.showTemplate();
      return;
    }

    // Reading `currentUser` registers the dependency; `hasPermission` reads it internally,
    // but not through a signal this effect would see.
    this.authService.currentUser();

    const permissions = this.appHasPermission();
    if (!permissions || permissions.length === 0) {
      this.showTemplate();
      return;
    }

    if (this.authService.hasPermission(permissions, this.appHasPermissionMatchAll())) {
      this.showTemplate();
    } else {
      this.hideTemplate();
    }
  }

  private showTemplate(): void {
    if (!this.hasView) {
      this.viewContainer.createEmbeddedView(this.templateRef);
      this.hasView = true;
    }
  }

  private hideTemplate(): void {
    if (this.hasView) {
      this.viewContainer.clear();
      this.hasView = false;
    }
  }
}
