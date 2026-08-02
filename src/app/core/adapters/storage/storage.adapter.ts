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

import { InjectionToken, inject } from '@angular/core';
import { WebStorageAdapter } from './web-storage.adapter';
import type { StorageKey, StorageScope } from './storage-keys';

export { STORAGE_KEYS } from './storage-keys';
export type { StorageKey, StorageScope } from './storage-keys';

/**
 * Key-value persistence, stated as what the application needs rather than as Web Storage.
 *
 * Two things this buys beyond swappability. Reads never throw: `JSON.parse` on a corrupted
 * or hand-edited value returns the fallback rather than taking down whichever service happened
 * to read it during bootstrap — `AuthService.getStoredSession()` parsed unguarded, so one bad
 * character in `fineract_session` left the app on a blank screen with no route to the login
 * page. And writes are confined to `STORAGE_KEYS`, so the set of things the origin persists
 * stays reviewable.
 */
export interface StorageAdapter {
  /** Reads and parses a value, returning `fallback` when absent or unparseable. */
  read<T>(key: StorageKey, fallback: T): T;

  /** Reads a raw string value, or `null` when absent. */
  readRaw(key: StorageKey): string | null;

  /** Serialises and stores a value. */
  write(key: StorageKey, value: unknown): void;

  /** Stores a raw string value. */
  writeRaw(key: StorageKey, value: string): void;

  /** Removes a single key. */
  remove(key: StorageKey): void;

  /**
   * Removes every key in a scope.
   *
   * `clearScope('session')` is what sign-out needs: it drops whatever tab-scoped state exists
   * without the caller having to remember the list.
   */
  clearScope(scope: StorageScope): void;
}

/**
 * Injection token for the active {@link StorageAdapter}.
 *
 * Defaults to the Web Storage implementation, so nothing needs configuring for it to work.
 */
export const STORAGE = new InjectionToken<StorageAdapter>('StorageAdapter', {
  providedIn: 'root',
  factory: () => inject(WebStorageAdapter),
});
