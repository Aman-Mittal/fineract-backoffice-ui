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

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import type { Observable } from 'rxjs';
import { createSpyObj, SpyObj } from '../../../testing/mocks';
import { provideTestConfig } from '../../../testing/config';
import { provideIonicTesting } from '../../../testing/ionic-testing';
import { provideTranslateTesting } from '../../../testing/i18n-testing';
import { AuthService } from '../../../core/services/auth.service';
import { NotesService } from '../../../api';
import { DialogService } from '../../../core/services/dialog.service';
import { ButtonComponent } from '../../../ui/button/button.component';
import { ClientNotesListComponent } from './client-notes-list.component';

/**
 * Regression cover for the ADR 0005 button migration.
 *
 * The assertions are about what a template rewrite can silently drop — router commands,
 * accessible name, click handler, icon, and the `*appHasPermission` guard — rather than about
 * this screen's own logic. A dropped guard shows an action to someone who may not perform it.
 */
describe('ClientNotesListComponent button contract after the ui migration', () => {
  let fixture: ComponentFixture<ClientNotesListComponent>;
  let notesService: SpyObj<NotesService>;
  let dialogService: SpyObj<DialogService>;
  let authService: SpyObj<AuthService>;

  const NOTE = { id: 3, note: 'Called the client', createdOn: 1_757_000_000_000 };

  /**
   * Read from the component instances, not the DOM: Ionic lifts `aria-label` into its shadow
   * root, and that forwarding is the primitive's own concern. What matters here is that the
   * call site passes the right inputs.
   */
  const rendered = (): ButtonComponent[] =>
    fixture.debugElement.queryAll(By.directive(ButtonComponent)).map((d) => d.componentInstance);
  const labelled = (name: string): ButtonComponent => rendered().find((b) => b.label() === name)!;

  async function render(permitted: (permission: string) => boolean): Promise<void> {
    notesService = createSpyObj<NotesService>(['getResourceTypeResourceIdNotes']);
    notesService.getResourceTypeResourceIdNotes.mockReturnValue(
      of([NOTE]) as unknown as Observable<never>,
    );
    dialogService = createSpyObj<DialogService>(['open', 'confirm']);
    authService = Object.assign(createSpyObj<AuthService>(['hasPermission']), {
      currentUser: () => ({ permissions: [] }),
    });
    authService.hasPermission.mockImplementation((p: unknown) =>
      Array.isArray(p) ? p.some((one) => permitted(String(one))) : permitted(String(p)),
    );

    await TestBed.configureTestingModule({
      imports: [ClientNotesListComponent],
      providers: [
        { provide: NotesService, useValue: notesService },
        { provide: DialogService, useValue: dialogService },
        { provide: AuthService, useValue: authService },
        provideTestConfig({ rbacEnabled: true }),
        provideIonicTesting(),
        // This screen and app-data-table still use `| translate` directly; see the helper.
        provideTranslateTesting(),
        provideRouter([{ path: '**', children: [] }]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ClientNotesListComponent);
    fixture.componentRef.setInput('clientId', 42);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  }

  it('still links to the create screen, as a link rather than a button', async () => {
    await render(() => true);

    // The create button is the one with no accessible-name override: it reads its own text.
    const create = rendered().find((b) => b.label() === undefined)!;
    expect(create.link()).toEqual(['/clients', 42, 'notes', 'create']);

    // An href, not just a click handler: these actions were anchors before the migration and
    // have to stay middle-clickable and announced as links.
    const anchor = fixture.nativeElement.querySelector('.tab-actions ion-button') as HTMLElement;
    expect(anchor.getAttribute('href')).toBe('/clients/42/notes/create');
  });

  it('keeps an accessible name on the row actions, on the control that is reached', async () => {
    await render(() => true);
    const names = rendered().map((b) => b.label());
    expect(names).toContain('COMMON.EDIT');
    expect(names).toContain('COMMON.DELETE');
    // The edit action navigates; the icon it was given survived the rewrite too.
    expect(labelled('COMMON.EDIT').link()).toEqual(['/clients', 42, 'notes', 'edit', NOTE.id]);
    expect(labelled('COMMON.EDIT').icon()).toBe('create-outline');
    expect(labelled('COMMON.DELETE').icon()).toBe('trash-outline');
    // Every one of them declares its type, so none can inherit the vendor's submit default.
    expect(rendered().map((b) => b.type())).toEqual(['button', 'button', 'button']);
  });

  it('still calls the delete handler when the row action is pressed', async () => {
    await render(() => true);
    const onDelete = vi.spyOn(fixture.componentInstance, 'onDelete');

    const remove = fixture.debugElement
      .queryAll(By.directive(ButtonComponent))
      .find((d) => (d.componentInstance as ButtonComponent).label() === 'COMMON.DELETE')!;
    (remove.nativeElement as HTMLElement)
      .querySelector('ion-button')!
      .dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect(onDelete).toHaveBeenCalledWith(NOTE.id);
  });

  it('hides every action the user has no permission for', async () => {
    await render(() => false);
    expect(rendered()).toHaveLength(0);
  });

  it('hides only the actions withheld, not the ones granted', async () => {
    await render((permission) => permission === 'DELETE_CLIENTNOTE');
    expect(rendered().map((b) => b.label())).toEqual(['COMMON.DELETE']);
  });
});
