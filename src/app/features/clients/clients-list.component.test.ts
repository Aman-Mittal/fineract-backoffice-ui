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

import { createSpyObj, SpyObj } from '../../testing/mocks';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs';

import { ClientsListComponent } from './clients-list.component';
import { ClientService } from '../../api';
import { provideIonicTesting } from '../../testing/ionic-testing';
import { provideTranslateTesting } from '../../testing/i18n-testing';

describe('ClientsListComponent', () => {
  let fixture: ComponentFixture<ClientsListComponent>;
  let serviceSpy: SpyObj<ClientService>;

  beforeEach(async () => {
    serviceSpy = createSpyObj(['getClients']);
    serviceSpy.getClients.mockReturnValue(
      of({ totalFilteredRecords: 0, pageItems: [] }) as unknown as ReturnType<
        ClientService['getClients']
      >,
    );

    await TestBed.configureTestingModule({
      imports: [ClientsListComponent],
      providers: [
        provideNoopAnimations(),
        provideIonicTesting(),
        ...provideTranslateTesting(),
        { provide: ClientService, useValue: serviceSpy },
        { provide: Router, useValue: createSpyObj(['navigate']) },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ClientsListComponent);
    fixture.detectChanges();
  });

  it('does not filter the main list by legal form', () => {
    // 13th positional argument to getClients — see #534.
    const legalForm = serviceSpy.getClients.mock.calls[0][12];
    expect(legalForm).toBeUndefined();
  });
});
