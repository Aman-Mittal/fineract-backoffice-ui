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
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { provideFakeAdapters } from '../../../testing/adapters';
import { provideTranslateTesting } from '../../../testing/i18n-testing';
import { provideIonicTesting } from '../../../testing/ionic-testing';
import { ClientFamilyMemberFormComponent } from './client-family-member-form.component';

describe('Family member optional create DOB', () => {
  let fixture: ComponentFixture<ClientFamilyMemberFormComponent>;
  let component: ClientFamilyMemberFormComponent;
  let http: HttpTestingController;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientFamilyMemberFormComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        ...provideFakeAdapters().providers,
        ...provideTranslateTesting(),
        provideIonicTesting(),
        { provide: Router, useValue: { navigate: vi.fn() } },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { paramMap: { get: (key: string) => (key === 'clientId' ? '7' : null) } },
          },
        },
      ],
    }).compileComponents();
    http = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(ClientFamilyMemberFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    http
      .expectOne((request) => request.url.endsWith('/clients/7/familymembers/template'))
      .flush({});
    await fixture.whenStable();
    fixture.detectChanges();
  });
  afterEach(() => http.verify());
  async function chooseDate() {
    fixture.nativeElement
      .querySelector('#family-dob-picker')
      .dispatchEvent(new CustomEvent('ionChange', { detail: { value: '1990-01-05T00:00:00' } }));
    await fixture.whenStable();
    fixture.detectChanges();
  }
  async function clearDate() {
    const clear = fixture.nativeElement.querySelector('[data-testid="clear-family-date-of-birth"]');
    expect(clear).not.toBeNull();
    clear.click();
    await fixture.whenStable();
    fixture.detectChanges();
  }
  const takeCreate = () =>
    http.expectOne(
      (request) => request.method === 'POST' && request.url.endsWith('/clients/7/familymembers'),
    );
  it('shows Not set for an absent DOB and sends no fabricated date', () => {
    const button = fixture.nativeElement.querySelector(
      'ion-datetime-button[datetime="family-dob-picker"]',
    );
    expect(button.querySelector('[slot="date-target"]')?.textContent ?? '').toContain(
      'CLIENTS.DATE_OF_BIRTH_NOT_SET',
    );
    component.onSubmit();
    const request = takeCreate();
    expect(JSON.parse(request.request.serializeBody() as string)).not.toHaveProperty('dateOfBirth');
    request.flush({ resourceId: 8 });
  });
  it('preserves the explicitly chosen calendar day', async () => {
    await chooseDate();
    component.onSubmit();
    const request = takeCreate();
    expect(request.request.body.dateOfBirth).toBe('05 January 1990');
    request.flush({ resourceId: 8 });
  });
  it('clears without submitting and resets the linked picker', async () => {
    await chooseDate();
    await clearDate();
    expect(component.dateOfBirth).toBeUndefined();
    expect(fixture.nativeElement.querySelector('#family-dob-picker').value).toBeNull();
    http.expectNone((request) => request.method === 'POST');
    component.onSubmit();
    const request = takeCreate();
    expect(JSON.parse(request.request.serializeBody() as string)).not.toHaveProperty('dateOfBirth');
    request.flush({ resourceId: 8 });
  });
  it('omits the prior date after a rejected create is cleared and retried', async () => {
    const log = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    try {
      await chooseDate();
      component.onSubmit();
      const first = takeCreate();
      expect(first.request.body.dateOfBirth).toBe('05 January 1990');
      first.flush({}, { status: 400, statusText: 'Synthetic failure' });
      await clearDate();
      component.onSubmit();
      const retry = takeCreate();
      expect(JSON.parse(retry.request.serializeBody() as string)).not.toHaveProperty('dateOfBirth');
      retry.flush({ resourceId: 8 });
    } finally {
      log.mockRestore();
    }
  });
  it('preserves existing edit serialization without offering create-only clearing', async () => {
    component.isEditMode = true;
    component.memberId = 8;
    await chooseDate();
    expect(
      fixture.nativeElement.querySelector('[data-testid="clear-family-date-of-birth"]'),
    ).toBeNull();
    expect(fixture.nativeElement.querySelector('[slot="date-target"]')).toBeNull();
    component.onSubmit();
    const request = http.expectOne(
      (request) => request.method === 'PUT' && request.url.endsWith('/clients/7/familymembers/8'),
    );
    expect(request.request.body.dateOfBirth).toBe('05 January 1990');
    request.flush({ resourceId: 8 });
  });
});
