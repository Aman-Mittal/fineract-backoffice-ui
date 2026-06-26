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

import { TestBed } from '@angular/core/testing';
import { ThemeService } from './theme.service';

describe('ThemeService', () => {
  const DARK_THEME = 'dark';
  const THEME_KEY = 'theme';
  const DATA_THEME = 'data-theme';

  let service: ThemeService;

  beforeEach(() => {
    spyOn(localStorage, 'getItem').and.returnValue(null);
    spyOn(localStorage, 'setItem');
    spyOn(document.documentElement, 'setAttribute');
    spyOn(document.documentElement, 'removeAttribute');
  });

  const createService = () => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [ThemeService],
    });
    service = TestBed.inject(ThemeService);
  };

  it('should initialize to light mode when savedTheme is not dark', () => {
    createService();
    expect(service.isDarkMode()).toBeFalse();
    expect(document.documentElement.removeAttribute).toHaveBeenCalledWith(DATA_THEME);
    expect(localStorage.setItem).toHaveBeenCalledWith(THEME_KEY, 'light');
  });

  it('should initialize to dark mode when savedTheme is dark', () => {
    (localStorage.getItem as jasmine.Spy).and.returnValue(DARK_THEME);
    createService();
    expect(service.isDarkMode()).toBeTrue();
    expect(document.documentElement.setAttribute).toHaveBeenCalledWith(DATA_THEME, DARK_THEME);
    expect(localStorage.setItem).toHaveBeenCalledWith(THEME_KEY, DARK_THEME);
  });

  it('should toggle dark mode state', () => {
    createService();
    expect(service.isDarkMode()).toBeFalse();

    // Toggle to Dark
    service.toggleDarkMode();
    expect(service.isDarkMode()).toBeTrue();
    expect(document.documentElement.setAttribute).toHaveBeenCalledWith(DATA_THEME, DARK_THEME);
    expect(localStorage.setItem).toHaveBeenCalledWith(THEME_KEY, DARK_THEME);

    // Toggle back to Light
    service.toggleDarkMode();
    expect(service.isDarkMode()).toBeFalse();
    expect(document.documentElement.removeAttribute).toHaveBeenCalledWith(DATA_THEME);
    expect(localStorage.setItem).toHaveBeenCalledWith(THEME_KEY, 'light');
  });
});
