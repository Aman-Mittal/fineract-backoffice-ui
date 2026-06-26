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

import { Injectable, signal } from '@angular/core';

/**
 * Service to manage the global loading state of the application.
 */
@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  /** Signal representing whether any process is currently loading */
  isLoading = signal(false);

  /** Set to track multiple concurrent loading processes */
  private loadingMap = new Map<string, boolean>();

  /**
   * Sets the loading state for a specific key.
   * @param loading Whether the process is loading
   * @param url The URL or key to track
   */
  setLoading(loading: boolean, url: string): void {
    if (!url) {
      this.isLoading.set(loading);
      return;
    }

    if (loading) {
      this.loadingMap.set(url, true);
    } else if (!loading && this.loadingMap.has(url)) {
      this.loadingMap.delete(url);
    }

    this.isLoading.set(this.loadingMap.size > 0);
  }
}
