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

import { Injectable, inject, signal } from '@angular/core';
import { STORAGE } from '../adapters';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly storage = inject(STORAGE);

  readonly isDarkMode = signal<boolean>(false);

  constructor() {
    const savedTheme = this.storage.readRaw('theme');

    if (savedTheme === 'dark') {
      this.setDarkMode(true);
    } else if (savedTheme === 'light') {
      this.setDarkMode(false);
    } else {
      // No explicit choice saved yet: honour the OS/browser preference instead of
      // always defaulting to light.
      const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
      this.setDarkMode(prefersDark);
    }
  }

  toggleDarkMode() {
    this.setDarkMode(!this.isDarkMode());
  }

  private setDarkMode(isDark: boolean) {
    this.isDarkMode.set(isDark);
    if (isDark) {
      document.documentElement.setAttribute('data-theme', 'dark');
      this.storage.writeRaw('theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
      this.storage.writeRaw('theme', 'light');
    }
  }
}
