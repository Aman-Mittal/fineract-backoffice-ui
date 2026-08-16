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

import { ComponentFixture } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AccessDeniedComponent } from './access-denied.component';
import { renderComponent } from '../../testing/render';
import { provideIonicTesting } from '../../testing/ionic-testing';
import { provideFakeAdapters } from '../../testing/adapters';

describe('AccessDeniedComponent', () => {
  let fixture: ComponentFixture<AccessDeniedComponent>;
  let host: HTMLElement;

  beforeEach(async () => {
    fixture = await renderComponent(AccessDeniedComponent, {
      providers: [provideRouter([]), ...provideIonicTesting(), ...provideFakeAdapters().providers],
    });
    host = fixture.nativeElement as HTMLElement;
  });

  it('states what happened in a single top-level heading', () => {
    const headings = host.querySelectorAll('h1');
    expect(headings).toHaveSize(1);
    expect(headings[0].textContent?.trim()).toBeTruthy();
  });

  it('takes focus on the heading, because the user did not ask for this navigation', () => {
    // A guard redirect changes the page without the user acting. Leaving focus wherever the
    // previous screen left it gives a screen-reader user no reason for the change.
    expect(document.activeElement).toBe(host.querySelector('h1'));
  });

  it('announces itself without interrupting', () => {
    const region = host.querySelector('[aria-live]');
    expect(region).not.toBeNull();
    expect(region?.getAttribute('aria-live')).toBe('polite');
    expect(region?.getAttribute('role')).toBe('alert');
  });

  it('offers a way out that does not depend on any permission', () => {
    const back = host.querySelector('[data-testid="access-denied-dashboard"]');
    expect(back).not.toBeNull();
    expect(back?.getAttribute('ng-reflect-router-link') ?? back?.outerHTML).toContain('/dashboard');
  });

  it('renders translated copy rather than raw keys', () => {
    // The fake i18n adapter echoes the key back, so a missed `| appTranslate` would show up as
    // the literal key. Every visible string must have gone through the pipe.
    const text = host.textContent ?? '';
    expect(text).toContain('ACCESS_DENIED.TITLE');
    expect(text).toContain('ACCESS_DENIED.MESSAGE');
    expect(text).toContain('ACCESS_DENIED.HINT');
    expect(text).toContain('ACCESS_DENIED.BACK_TO_DASHBOARD');
  });

  it('hides the decorative icon from assistive technology', () => {
    expect(host.querySelector('ion-icon')?.getAttribute('aria-hidden')).toBe('true');
  });
});
