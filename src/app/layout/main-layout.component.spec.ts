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
import { MainLayoutComponent } from './main-layout.component';
import { AuthService, UserSession } from '../core/services/auth.service';
import { GuidanceService } from '../core/services/guidance.service';
import { TranslateModule } from '@ngx-translate/core';
import { Router, RouterModule } from '@angular/router';
import { signal } from '@angular/core';

function keydown(overrides: Partial<KeyboardEvent> & { target: EventTarget }): KeyboardEvent {
  return {
    key: '',
    altKey: false,
    ctrlKey: false,
    shiftKey: false,
    preventDefault: jasmine.createSpy('preventDefault'),
    ...overrides,
  } as unknown as KeyboardEvent;
}

describe('MainLayoutComponent', () => {
  let component: MainLayoutComponent;
  let fixture: ComponentFixture<MainLayoutComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    const mockSession: UserSession = {
      username: 'mifos',
      base64EncodedAuthenticationKey: 'YmFzZTY0',
      authenticated: true,
      officeId: 1,
      officeName: 'Head Office',
      userId: 1,
      permissions: ['ALL_FUNCTIONS'],
    };

    authServiceSpy = jasmine.createSpyObj('AuthService', ['hasPermission'], {
      username: signal('mifos'),
      officeName: signal('Head Office'),
      currentUser: signal<UserSession | null>(mockSession),
    });
    authServiceSpy.hasPermission.and.returnValue(true);

    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), RouterModule.forRoot([]), MainLayoutComponent],
      providers: [{ provide: AuthService, useValue: authServiceSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(MainLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render header and sidebar', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-header')).toBeTruthy();
    expect(compiled.querySelector('app-sidebar')).toBeTruthy();
  });

  describe('global keyboard shortcuts', () => {
    it('navigates to the bound route on a shortcut keydown', () => {
      const navigateSpy = spyOn(TestBed.inject(Router), 'navigate');

      component.onKeydown(keydown({ key: 'c', altKey: true, target: document.body }));

      expect(navigateSpy).toHaveBeenCalledWith(['/clients/create']);
    });

    it('starts the guidance tour for the current route on the help shortcut', () => {
      spyOnProperty(TestBed.inject(Router), 'url').and.returnValue('/dashboard');
      const startTourSpy = spyOn(TestBed.inject(GuidanceService), 'startTour');

      component.onKeydown(keydown({ key: 'h', altKey: true, target: document.body }));

      expect(startTourSpy).toHaveBeenCalledWith('/dashboard');
    });

    it('ignores keydown events while typing into a form control', () => {
      const navigateSpy = spyOn(TestBed.inject(Router), 'navigate');
      const input = document.createElement('input');

      component.onKeydown(keydown({ key: 'c', altKey: true, target: input }));

      expect(navigateSpy).not.toHaveBeenCalled();
    });

    it('ignores unbound key combinations', () => {
      const navigateSpy = spyOn(TestBed.inject(Router), 'navigate');

      component.onKeydown(keydown({ key: 'z', altKey: true, target: document.body }));

      expect(navigateSpy).not.toHaveBeenCalled();
    });
  });
});
