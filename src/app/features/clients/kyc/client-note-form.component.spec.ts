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
import { ClientNoteFormComponent } from './client-note-form.component';
import { NotesService } from '../../../api';
import { ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { of } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { provideNoopAnimations } from '@angular/platform-browser/animations';

describe('ClientNoteFormComponent', () => {
  let component: ClientNoteFormComponent;
  let fixture: ComponentFixture<ClientNoteFormComponent>;
  let noteServiceSpy: jasmine.SpyObj<NotesService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    noteServiceSpy = jasmine.createSpyObj('NotesService', [
      'getResourceTypeResourceIdNotesNoteId',
      'putResourceTypeResourceIdNotesNoteId',
      'postResourceTypeResourceIdNotes',
    ]);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [ClientNoteFormComponent, TranslateModule.forRoot()],
      providers: [
        { provide: NotesService, useValue: noteServiceSpy },
        { provide: Router, useValue: routerSpy },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: convertToParamMap({ clientId: '7' }) } },
        },
        provideNoopAnimations(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ClientNoteFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create in add mode', () => {
    expect(component).toBeTruthy();
    expect(component.isEditMode).toBeFalse();
    expect(component.clientId).toBe(7);
  });

  it('should post a NoteCreateRequest on submit', () => {
    noteServiceSpy.postResourceTypeResourceIdNotes.and.returnValue(
      of({}) as unknown as ReturnType<NotesService['postResourceTypeResourceIdNotes']>,
    );
    component.note = { note: 'Follow up next week' };

    component.onSubmit();

    expect(noteServiceSpy.postResourceTypeResourceIdNotes).toHaveBeenCalledWith(
      'clients',
      7,
      jasmine.objectContaining({ note: 'Follow up next week' }),
    );
  });
});
