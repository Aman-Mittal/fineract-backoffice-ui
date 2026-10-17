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
import { Router } from '@angular/router';
import { I18N } from '../adapters';
import {
  extractMutationResourceId,
  isMakerCheckerPending,
} from '../utils/mutation-response';
import { NotificationService } from './notification.service';

export interface MutationOutcomeOptions {
  /** Translated message when the change applied immediately. */
  successMessage: string;
  /** Router commands for the affected record (view page). */
  recordRoute: (recordId: number) => unknown[];
  /** API response from create, update, or command. */
  response?: unknown;
  /** Known record id for updates and actions when the response omits one. */
  recordId?: number;
  /** Where to go when maker-checker queues a create with no id yet. */
  fallbackRoute?: unknown[];
}

/**
 * Shared post-mutation behaviour: confirm success (or maker-checker queue) and
 * navigate to the record the operator was working on instead of a list page.
 */
@Injectable({ providedIn: 'root' })
export class MutationOutcomeService {
  private readonly router = inject(Router);
  private readonly notifications = inject(NotificationService);
  private readonly i18n = inject(I18N);

  complete(options: MutationOutcomeOptions): void {
    const pending = isMakerCheckerPending(options.response);
    const message = pending
      ? this.i18n.translate('COMMON.MUTATION_SUBMITTED_FOR_APPROVAL')
      : options.successMessage;

    void this.notifications.success(message);

    const resolvedId =
      options.recordId ?? extractMutationResourceId(options.response);

    if (resolvedId !== undefined) {
      void this.router.navigate(options.recordRoute(resolvedId));
      return;
    }

    if (options.fallbackRoute) {
      void this.router.navigate(options.fallbackRoute);
    }
  }
}
