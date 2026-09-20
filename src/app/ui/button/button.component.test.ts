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

import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter, Router } from '@angular/router';
import { IonButton } from '@ionic/angular/standalone';
import { provideIonicTesting } from '../../testing/ionic-testing';
import { ButtonComponent } from './button.component';

/**
 * The button's public contract, asserted through a host so that content projection and form
 * participation are exercised the way a feature uses them.
 *
 * Two things shape what is asserted here and what is not.
 *
 * Ionic's custom elements do not upgrade under jsdom, so there is no native `<button>` in the
 * tree and no reflected attributes to read. What the caller's inputs become is observable only
 * on the `IonButton` directive, and that mapping is exactly this component's job — so the seam
 * is read there. It is the one place a vendor name legitimately appears in a test, and it is
 * inside `src/app/ui`, where ADR 0005 allows it.
 *
 * What is NOT pinned is which colour a given intent maps to. `intent`/`emphasis` exist so the
 * mapping can change without touching callers, and asserting the value would defeat that; the
 * test pins only that two different intents stay distinguishable.
 *
 * Real form submission and real disabled-click suppression are browser facts, not jsdom ones,
 * and belong in the e2e suite rather than here.
 */
@Component({
  standalone: true,
  imports: [ButtonComponent],
  template: `
    <form (ngSubmit)="submitted.set(submitted() + 1)">
      <app-button
        [type]="type()"
        [intent]="intent()"
        [disabled]="disabled()"
        [busy]="busy()"
        [icon]="icon()"
        [link]="link()"
        [label]="label()"
        (click)="clicked.set(clicked() + 1)"
      >
        {{ text() }}
      </app-button>
    </form>
  `,
})
class HostComponent {
  readonly type = signal<'button' | 'submit'>('button');
  readonly intent = signal<'primary' | 'danger'>('primary');
  readonly disabled = signal(false);
  readonly busy = signal(false);
  readonly icon = signal<string | undefined>(undefined);
  readonly link = signal<unknown[] | undefined>(undefined);
  readonly label = signal<string | undefined>(undefined);
  readonly text = signal('Add entry');
  readonly clicked = signal(0);
  readonly submitted = signal(0);
}

describe('ButtonComponent public contract', () => {
  let fixture: ComponentFixture<HostComponent>;
  let host: HostComponent;
  const ionButton = (): HTMLElement => fixture.nativeElement.querySelector('ion-button');
  /** The vendor seam: what this component's app-level inputs actually resolved to. */
  const vendor = (): IonButton =>
    fixture.debugElement.query(By.directive(IonButton)).componentInstance as IonButton;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent],
      // A catch-all so a navigation that fires resolves, rather than failing as an unmatched URL
      // and hiding whether the wiring worked.
      providers: [provideIonicTesting(), provideRouter([{ path: '**', children: [] }])],
    }).compileComponents();
    fixture = TestBed.createComponent(HostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('projects its label and reports presses', () => {
    expect(fixture.nativeElement.textContent).toContain('Add entry');
    ionButton().click();
    expect(host.clicked()).toBe(1);
  });

  it('does not submit the surrounding form unless the caller asked for it', () => {
    // The regression this guards: ion-button defaults to type="submit", so an ordinary action
    // inside a form submits it. `type` is required precisely so that cannot be inherited.
    expect(vendor().type).toBe('button');
    host.type.set('submit');
    fixture.detectChanges();
    expect(vendor().type).toBe('submit');
  });

  it('keeps intents distinguishable without exposing the vendor palette', () => {
    const primary = vendor().color;
    host.intent.set('danger');
    fixture.detectChanges();
    expect(vendor().color).not.toBe(primary);
  });

  it('blocks presses while disabled', () => {
    host.disabled.set(true);
    fixture.detectChanges();
    expect(vendor().disabled).toBe(true);
  });

  it('shows a spinner instead of the icon while busy, and says so', () => {
    host.icon.set('add-outline');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('app-icon')).not.toBeNull();
    expect(fixture.nativeElement.querySelector('app-spinner')).toBeNull();

    host.busy.set(true);
    fixture.detectChanges();
    // Busy is not the same state as disabled to a reader, but it does block a second press.
    expect(ionButton().getAttribute('aria-busy')).toBe('true');
    expect(vendor().disabled).toBe(true);
    expect(fixture.nativeElement.querySelector('app-spinner')).not.toBeNull();
    expect(fixture.nativeElement.querySelector('app-icon')).toBeNull();
  });

  it('carries an accessible name when there is an icon and no text', () => {
    host.text.set('');
    host.icon.set('add-outline');
    host.label.set('Add entry');
    fixture.detectChanges();
    expect(ionButton().getAttribute('aria-label')).toBe('Add entry');
    // The icon beside a name must not be announced a second time.
    expect(
      fixture.nativeElement.querySelector('app-icon ion-icon').getAttribute('aria-hidden'),
    ).toBe('true');
  });

  it('does not navigate when no link was given', async () => {
    const navigate = vi.spyOn(TestBed.inject(Router), 'navigate');
    ionButton().click();
    await fixture.whenStable();
    expect(navigate).not.toHaveBeenCalled();
    expect(host.clicked()).toBe(1);
  });

  it('navigates when a link is given', async () => {
    host.link.set(['/clients', 7, 'notes']);
    fixture.detectChanges();
    const navigate = vi.spyOn(TestBed.inject(Router), 'navigate');
    ionButton().click();
    await fixture.whenStable();
    expect(navigate).toHaveBeenCalledWith(
      ['/clients', 7, 'notes'],
      expect.objectContaining({ relativeTo: expect.anything() }),
    );
  });

  it('leaves aria-label off a button that already reads its own text', () => {
    expect(ionButton().hasAttribute('aria-label')).toBe(false);
    expect(ionButton().hasAttribute('aria-busy')).toBe(false);
  });
});

/**
 * A second suite with no router in the injector at all.
 *
 * This is the property the `link` design exists to preserve: `app-button` is a base primitive,
 * and the great majority of its call sites never navigate. Binding `routerLink` internally
 * would drag `ActivatedRoute` into every one of their injectors — it broke seven unrelated
 * `EntityDatatablesComponent` cases when tried, and those failures were correct.
 */
describe('ButtonComponent without a router', () => {
  it('renders and reports presses with no router provided', async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent],
      providers: [provideIonicTesting()],
    }).compileComponents();
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('ion-button') as HTMLElement;
    expect(button).not.toBeNull();
    button.click();
    expect(fixture.componentInstance.clicked()).toBe(1);
  });
});
