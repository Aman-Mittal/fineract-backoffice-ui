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
      'postAccountsType',
      'putAccountsTypeAccountId',
      'getAccountsTypeTemplate',
      'getAccountsTypeAccountId',
    ]);
    clientServiceSpy = jasmine.createSpyObj('ClientService', ['getClients', 'getClientsClientId']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [ShareAccountFormComponent, TranslateModule.forRoot(), MatNativeDateModule],
      providers: [
        provideNoopAnimations(),
        { provide: ShareAccountService, useValue: shareServiceSpy },
        { provide: ClientService, useValue: clientServiceSpy },
        { provide: Router, useValue: routerSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of({ get: () => null }),
            queryParams: of({}),
          },
        },
      ],
    }).compileComponents();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    shareServiceSpy.getAccountsTypeTemplate.and.returnValue(of({ productOptions: [] }) as any);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    clientServiceSpy.getClients.and.returnValue(of({ pageItems: [] }) as any);
    fixture = TestBed.createComponent(ShareAccountFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should format payload with dd MMMM yyyy date on submission', () => {
    component.isEditMode = false;
    component.account = { clientId: 1, productId: 1, requestedShares: 100 };
    component.applicationDate = new Date(2026, 4, 15);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    shareServiceSpy.postAccountsType.and.returnValue(of({}) as any);

    component.onSubmit();

    const expectedPayload = jasmine.objectContaining({
      clientId: 1,
      productId: 1,
      requestedShares: 100,
      applicationDate: '15 May 2026',
      submittedDate: '15 May 2026',
      dateFormat: 'dd MMMM yyyy',
      locale: 'en',
    });

    expect(shareServiceSpy.postAccountsType).toHaveBeenCalledWith(
      'share',
      expectedPayload as AccountRequest,
    );
  });
});
