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

import { Injectable } from '@angular/core';
// Type-only: `storage.adapter.ts` names this class as the token's default binding, so a value
// import back would close a runtime cycle. `STORAGE_KEYS` is a value, and lives in its own
// module for exactly that reason.
import type { StorageAdapter } from './storage.adapter';
import { STORAGE_KEYS, type StorageKey, type StorageScope } from './storage-keys';

/**
 * {@link StorageAdapter} backed by the browser's `localStorage` / `sessionStorage`.
 *
 * This is the only file in the application permitted to touch Web Storage directly;
 * `eslint.config.js` enforces it.
 *
 * Every operation is guarded. Web Storage throws rather than degrades in two situations a
 * back-office deployment genuinely meets: Safari's Private Browsing quota of zero, which makes
 * `setItem` throw `QuotaExceededError`, and enterprise browser policies that block storage for
 * an origin, which makes even reading throw `SecurityError`. Neither is a reason for a teller
 * to lose the screen they were on, so failures degrade to "no stored value" and the caller's
 * fallback decides what happens next.
 */
@Injectable({ providedIn: 'root' })
export class WebStorageAdapter implements StorageAdapter {
  private store(scope: StorageScope): Storage | null {
    try {
      return scope === 'session' ? sessionStorage : localStorage;
    } catch {
      // Accessing the property itself throws when the origin is denied storage.
      return null;
    }
  }

  private entry(key: StorageKey) {
    return STORAGE_KEYS[key];
  }

  readRaw(key: StorageKey): string | null {
    const { key: name, scope } = this.entry(key);
    try {
      return this.store(scope)?.getItem(name) ?? null;
    } catch {
      return null;
    }
  }

  read<T>(key: StorageKey, fallback: T): T {
    const raw = this.readRaw(key);
    if (raw === null) {
      return fallback;
    }
    try {
      return JSON.parse(raw) as T;
    } catch {
      // A value that will not parse is indistinguishable from one that was never written, and
      // treating it as absent is what keeps a hand-edited or truncated entry from bringing
      // down whichever service reads it during bootstrap.
      return fallback;
    }
  }

  write(key: StorageKey, value: unknown): void {
    this.writeRaw(key, JSON.stringify(value));
  }

  writeRaw(key: StorageKey, value: string): void {
    const { key: name, scope } = this.entry(key);
    try {
      this.store(scope)?.setItem(name, value);
    } catch {
      // Quota exceeded or storage denied. The in-memory signals that shadow these values stay
      // correct for this tab; only persistence across a reload is lost.
    }
  }

  remove(key: StorageKey): void {
    const { key: name, scope } = this.entry(key);
    try {
      this.store(scope)?.removeItem(name);
    } catch {
      /* nothing to remove if storage is unreachable */
    }
  }

  clearScope(scope: StorageScope): void {
    // Only the application's own keys are removed. `Storage.clear()` would also take out
    // anything else served from this origin — a reverse-proxied deployment can put the SPA
    // and other tools on one host, and signing out of the back office must not sign the user
    // out of whatever else lives there.
    for (const entry of Object.values(STORAGE_KEYS)) {
      if (entry.scope !== scope) continue;
      try {
        this.store(entry.scope)?.removeItem(entry.key);
      } catch {
        /* as above */
      }
    }
  }
}
