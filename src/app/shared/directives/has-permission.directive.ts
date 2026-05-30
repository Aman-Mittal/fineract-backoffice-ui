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

import { Directive, Input, TemplateRef, ViewContainerRef, inject, effect } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';

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

  private permissions: string | string[] = [];
  private matchAllValue = false;
  private hasView = false;

  constructor() {
    // React to authentication changes or signal changes automatically
    effect(() => {
      // Access signal to register dependency
      this.authService.currentUser();
      this.updateView();
    });
  }

  @Input()
  set appHasPermission(val: string | string[]) {
    this.permissions = val;
    this.updateView();
  }

  @Input()
  set appHasPermissionMatchAll(val: boolean) {
    this.matchAllValue = val;
    this.updateView();
  }

  private updateView(): void {
    if (!this.permissions || this.permissions.length === 0) {
      this.showTemplate();
      return;
    }

    const isAuthorized = this.authService.hasPermission(this.permissions, this.matchAllValue);

    if (isAuthorized) {
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
