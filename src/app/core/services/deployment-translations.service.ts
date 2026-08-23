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

import { Injectable, effect, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { I18N } from '../adapters';
import { skipErrorToast, skipLoading } from '../http/http-context';

/** Where a deployment puts its own strings. Gitignored upstream; absent on most deployments. */
const OVERLAY_PREFIX = 'branding/i18n/';

/**
 * Merges a deployment's own strings over the shipped catalogue.
 *
 * "Call them Members, not Clients" arrives as a branding request and is answered as a translation
 * one. The catalogues in `assets/i18n/` are upstream's, and a deployment editing them conflicts
 * on every release that touches a key; this reads a parallel file the deployment owns and layers
 * it on top, so restating any label in the product costs no upstream file at all.
 *
 * Loading is per-language and re-runs on every switch, because the overlay for `hi` says nothing
 * about what `en` should read. A missing file is the normal case and is not reported.
 *
 * The merge is one-way and never undone: switching away from a language and back re-applies the
 * overlay over a catalogue that already has it, which is idempotent. ngx-translate's own loader
 * refetches the base catalogue on a cold switch, so the overlay has to be re-applied after it
 * rather than once at startup — that is why this watches the active language instead.
 */
@Injectable({ providedIn: 'root' })
export class DeploymentTranslationsService {
  private readonly http = inject(HttpClient);
  private readonly i18n = inject(I18N);

  /** Languages whose overlay has been fetched, so a re-entrant switch does not refetch. */
  private readonly applied = new Set<string>();

  constructor() {
    effect(() => {
      const lang = this.i18n.currentLang();
      if (lang) {
        void this.applyOverlay(lang);
      }
    });
  }

  private async applyOverlay(lang: string): Promise<void> {
    if (this.applied.has(lang)) return;
    this.applied.add(lang);

    let overlay: Record<string, unknown> | null = null;
    try {
      overlay = await firstValueFrom(
        this.http.get<Record<string, unknown>>(`${OVERLAY_PREFIX}${lang}.json`, {
          context: skipLoading(skipErrorToast()),
        }),
      );
    } catch {
      // Absent is the expected case. A deployment that ships no strings of its own is not an
      // error, and reporting one on every startup would train operators to ignore the console.
      return;
    }

    if (overlay && typeof overlay === 'object') {
      this.i18n.setTranslation(lang, overlay, true);
    }
  }
}
