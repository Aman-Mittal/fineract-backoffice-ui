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

/**
 * The Vitest counterparts of `jasmine.SpyObj<T>` and `jasmine.createSpyObj`.
 *
 * These exist so the Karma-to-Vitest migration (DOCS/adr/0004-vitest-migration.md) is a
 * mechanical rename at 358 type annotations and 413 construction sites across 172 specs,
 * rather than 172 individual decisions about how to type a partial mock. Vitest ships
 * `MockedObject<T>`, but it describes an object where *every* member is already a mock, which
 * is not what a spec that lists four methods of a fifty-method generated API service has.
 *
 * ## The soundness this deliberately preserves
 *
 * `SpyObj<T>` claims every member of `T` while {@link createSpyObj} only creates the ones it
 * was given. That is unsound, and it is unsound in exactly the way `jasmine.SpyObj<T>` already
 * was — reaching for an unlisted method returned `undefined` under Jasmine too. Reproducing the
 * existing degree of unsoundness is the point: a migration that also tightened types would
 * produce compile errors that look like migration breakage but are really pre-existing gaps in
 * the specs, and separating the two afterwards is far more work than it sounds.
 *
 * Tightening this is worth doing — as its own change, against a suite that is already green on
 * the new runner, where every error it surfaces is unambiguously a spec that was lying.
 */

import type { Mock } from 'vitest';

/**
 * `T` with every method replaced by a Vitest mock of the same signature.
 *
 * Non-method members are left as declared, so a mocked service's plain fields still typecheck
 * against their real types.
 */
export type SpyObj<T> = {
  [K in keyof T]: T[K] extends (...args: infer A) => infer R ? Mock<(...args: A) => R> : T[K];
};

/**
 * Builds a mock of `T` exposing the named methods, each a `vi.fn()`.
 *
 * Unlike `jasmine.createSpyObj` this takes no name string. Jasmine used it to label the spy in
 * failure output; Vitest reports the variable the mock is bound to, so the argument carried no
 * diagnostic value and dropping it removes a redundant literal from 413 call sites.
 *
 * ```ts
 * let clients: SpyObj<ClientsService>;
 * clients = createSpyObj<ClientsService>(['getClients', 'postClients']);
 * clients.getClients.mockReturnValue(of([]));
 * ```
 */
export function createSpyObj<T>(methods: readonly (keyof T)[]): SpyObj<T> {
  const mock = {} as Record<keyof T, unknown>;
  for (const method of methods) {
    mock[method] = vi.fn();
  }
  return mock as SpyObj<T>;
}
