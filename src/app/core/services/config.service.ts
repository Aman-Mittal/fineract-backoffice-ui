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

import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';

/**
 * Interface for application runtime configuration.
 */
export interface AppConfig {
  /** The base URL for the Fineract API */
  fineractApiUrl: string;
  /** The default tenant to use for authentication */
  defaultTenant: string;
}

/**
 * Service responsible for loading and managing runtime configuration.
 *
 * This service allows the application to be configured without a rebuild
 * by fetching a `config.json` file at startup. User overrides are persisted
 * in local storage.
 */
@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  private readonly http = inject(HttpClient);
  private readonly storageKey = 'fineract_runtime_config';

  // Initialize with environment fallback or stored preference
  private readonly _config = signal<AppConfig>(this.getStoredConfig());

  /** Readonly access to the current application configuration signal */
  readonly config = this._config.asReadonly();

  /**
   * Loads configuration from the public `config.json` at runtime.
   *
   * If a user-defined override exists in localStorage, the HTTP request
   * is skipped to respect the user's preference.
   */
  async loadConfig(): Promise<void> {
    // Only load from server if no user override exists in localStorage
    if (localStorage.getItem(this.storageKey)) {
      return;
    }

    try {
      const config = await firstValueFrom(
        this.http.get<AppConfig>(`config.json?cb=${new Date().getTime()}`),
      );
      this._config.set(config);
    } catch (error) {
      console.error('❌ Could not load config.json, using environment defaults.', error);
    }
  }

  /**
   * Updates the runtime API URL and persists it to local storage.
   * @param url - The new API base URL
   */
  setApiUrl(url: string): void {
    const newConfig = { ...this.config(), fineractApiUrl: url };
    this._config.set(newConfig);
    localStorage.setItem(this.storageKey, JSON.stringify(newConfig));
  }

  /**
   * Returns the current API base URL.
   */
  get apiUrl(): string {
    return this.config().fineractApiUrl;
  }

  /**
   * Retrieves the initial configuration from local storage or environment defaults.
   * @returns The resolved AppConfig
   */
  private getStoredConfig(): AppConfig {
    const stored = localStorage.getItem(this.storageKey);
    return stored
      ? JSON.parse(stored)
      : {
          fineractApiUrl: environment.fineractApiUrl,
          defaultTenant: 'default',
        };
  }
}
