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
import { ShareAccountFormComponent } from './share-account-form.component';
import { ShareAccountService, AccountRequest, ClientService } from '../../../api';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { MatNativeDateModule } from '@angular/material/core';

describe('ShareAccountFormComponent', () => {
  let component: ShareAccountFormComponent;
  let fixture: ComponentFixture<ShareAccountFormComponent>;
  let shareServiceSpy: jasmine.SpyObj<ShareAccountService>;
  let clientServiceSpy: jasmine.SpyObj<ClientService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    shareServiceSpy = jasmine.createSpyObj('ShareAccountService', [
      'createAccount',
      'updateAccount',
      'template7',
      'retrieveAccount']);
    clientServiceSpy = jasmine.createSpyObj('ClientService', ['retrieveAll21', 'retrieveOne11']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [
        ShareAccountFormComponent,
        TranslateModule.forRoot(),
        MatNativeDateModule],
      providers: [provideNoopAnimations(), 
        { provide: ShareAccountService, useValue: shareServiceSpy },
        { provide: ClientService, useValue: clientServiceSpy },
        { provide: Router, useValue: routerSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of({ get: () => null }),
          },
        }],
    }).compileComponents();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    shareServiceSpy.template7.and.returnValue(of({ productOptions: [] }) as any);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    clientServiceSpy.retrieveAll21.and.returnValue(of({ pageItems: [] }) as any);
    fixture = TestBed.createComponent(ShareAccountFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should format payload with yyyy-MM-dd date on submission', () => {
    component.isEditMode = false;
    component.account = { clientId: 1, productId: 1, requestedShares: 100 };
    component.applicationDate = new Date(2026, 4, 15);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    shareServiceSpy.createAccount.and.returnValue(of({}) as any);

    component.onSubmit();

    const expectedPayload = jasmine.objectContaining({
      clientId: 1,
      productId: 1,
      requestedShares: 100,
      applicationDate: '2026-05-15',
      submittedDate: '2026-05-15',
      dateFormat: 'yyyy-MM-dd',
      locale: 'en',
    });

    expect(shareServiceSpy.createAccount).toHaveBeenCalledWith(
      'share',
      expectedPayload as AccountRequest,
    );
  });
});
