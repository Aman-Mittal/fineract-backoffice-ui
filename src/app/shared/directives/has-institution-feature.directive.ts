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
import {
  InstitutionConfigService,
  InstitutionFeature,
} from '../../core/services/institution-config.service';
import { environment } from '../../../environments/environment';

/**
 * Structural directive to conditionally include an element based on whether a
 * feature is enabled for the current institution type (see
 * {@link InstitutionConfigService}).
 *
 * When RBAC is disabled (`environment.rbacEnabled === false`), the element is
 * always rendered, preserving pre-RBAC behavior.
 *
 * Usage:
 * <a *appInstitutionFeature="'groups'" routerLink="/groups">Groups</a>
 */
@Directive({
  selector: '[appInstitutionFeature]',
  standalone: true,
})
export class HasInstitutionFeatureDirective {
  private readonly templateRef = inject(TemplateRef<unknown>);
  private readonly viewContainer = inject(ViewContainerRef);
  private readonly institutionConfig = inject(InstitutionConfigService);

  private feature: InstitutionFeature | null = null;
  private hasView = false;

  constructor() {
    // React to institution type changes automatically.
    effect(() => {
      // Access signal to register dependency.
      this.institutionConfig.institutionType();
      this.updateView();
    });
  }

  @Input()
  set appInstitutionFeature(val: InstitutionFeature) {
    this.feature = val;
    this.updateView();
  }

  private updateView(): void {
    // When RBAC is disabled, render everything regardless of institution config.
    if (!environment.rbacEnabled) {
      this.showTemplate();
      return;
    }

    if (this.feature && this.institutionConfig.isFeatureEnabled(this.feature)) {
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
