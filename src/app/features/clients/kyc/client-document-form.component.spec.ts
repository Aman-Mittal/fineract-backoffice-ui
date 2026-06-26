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
import { ClientDocumentFormComponent } from './client-document-form.component';
import { DocumentsService } from '../../../api';
import { ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { of } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { provideNoopAnimations } from '@angular/platform-browser/animations';

describe('ClientDocumentFormComponent', () => {
  let component: ClientDocumentFormComponent;
  let fixture: ComponentFixture<ClientDocumentFormComponent>;
  let documentServiceSpy: jasmine.SpyObj<DocumentsService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    documentServiceSpy = jasmine.createSpyObj('DocumentsService', [
      'getEntityTypeEntityIdDocumentsDocumentId',
      'putEntityTypeEntityIdDocumentsDocumentId',
      'postEntityTypeEntityIdDocuments',
    ]);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [ClientDocumentFormComponent, TranslateModule.forRoot()],
      providers: [
        { provide: DocumentsService, useValue: documentServiceSpy },
        { provide: Router, useValue: routerSpy },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: convertToParamMap({ clientId: '9' }) } },
        },
        provideNoopAnimations(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ClientDocumentFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should upload with the new postEntityTypeEntityIdDocuments signature', () => {
    documentServiceSpy.postEntityTypeEntityIdDocuments.and.returnValue(
      of({}) as unknown as ReturnType<DocumentsService['postEntityTypeEntityIdDocuments']>,
    );
    const file = new File(['hello'], 'passport.pdf', { type: 'application/pdf' });
    component.selectedFile = file;
    component.document = { name: 'Passport', description: 'ID proof' };

    component.onSubmit();

    // New 1.15 signature: (entityType, entityId, contentLength, description, file, name)
    expect(documentServiceSpy.postEntityTypeEntityIdDocuments).toHaveBeenCalledWith(
      'clients',
      9,
      file.size,
      'ID proof',
      file,
      'Passport',
    );
  });
});
