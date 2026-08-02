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
import { BrowserDownloadAdapter } from './browser-download.adapter';

/**
 * Saving a file to the user's machine.
 *
 * Four features each built the same object-URL-and-anchor dance by hand, in five slightly
 * different ways. The variation is the problem, not the repetition:
 *
 * - **Filenames came straight from the server.** `client-documents-list` set
 *   `a.download = doc.fileName` with whatever Fineract stored — a value another user uploaded.
 *   A download name is not an XSS sink, but it is attacker-influenced text written to the
 *   filesystem, and `../` or a trailing `.exe` in it is worth removing once here rather than
 *   remembering at four call sites.
 * - **Revocation was manual.** Every site called `revokeObjectURL` on the success path only.
 *   A throw between create and revoke leaks the blob for the life of the document, which for
 *   a back office left open all day means the memory is never returned.
 * - **Two sites appended the anchor to `document.body` and two did not**, a difference that
 *   matters in Firefox and was clearly discovered rather than decided.
 *
 * The contract also states the capability in terms a non-browser host could satisfy, which is
 * what makes the feature code portable rather than merely tidier.
 */
export interface DownloadAdapter {
  /**
   * Saves `content` as a file named `filename`.
   *
   * The name is sanitised — path separators removed, length bounded — so callers may pass a
   * server-supplied value directly.
   */
  save(content: Blob, filename: string): void;

  /** Saves text as a file, wrapping it in a `Blob` with the given MIME type. */
  saveText(text: string, filename: string, mimeType?: string): void;
}

/** Injection token for the active {@link DownloadAdapter}. */
export const DOWNLOAD = new InjectionToken<DownloadAdapter>('DownloadAdapter', {
  providedIn: 'root',
  factory: () => inject(BrowserDownloadAdapter),
});
