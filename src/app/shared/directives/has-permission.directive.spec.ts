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

import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { HasPermissionDirective } from './has-permission.directive';
import { AuthService } from '../../core/services/auth.service';
import { environment } from '../../../environments/environment';

@Component({
  template: `
    <div id="single-permission" *appHasPermission="'CREATE_CLIENT'">Single</div>
    <div id="multiple-permission" *appHasPermission="['CREATE_CLIENT', 'UPDATE_CLIENT']">
      Multiple
    </div>
    <div
      id="strict-permission"
      *appHasPermission="['CREATE_CLIENT', 'UPDATE_CLIENT']; matchAll: true"
    >
      Strict
    </div>
  `,
  standalone: true,
  imports: [HasPermissionDirective],
})
class TestComponent {}

const SINGLE_PERMISSION_SELECTOR = '#single-permission';
const MULTIPLE_PERMISSION_SELECTOR = '#multiple-permission';
const STRICT_PERMISSION_SELECTOR = '#strict-permission';

describe('HasPermissionDirective', () => {
  let fixture: ComponentFixture<TestComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  const originalRbacEnabled = environment.rbacEnabled;

  beforeEach(() => {
    environment.rbacEnabled = true;
    authServiceSpy = jasmine.createSpyObj('AuthService', ['hasPermission'], {
      currentUser: () => ({ permissions: ['CREATE_CLIENT'] }),
    });

    TestBed.configureTestingModule({
      imports: [TestComponent],
      providers: [{ provide: AuthService, useValue: authServiceSpy }],
    });
  });

  afterEach(() => {
    environment.rbacEnabled = originalRbacEnabled;
  });

  it('should render elements when permission is granted', () => {
    authServiceSpy.hasPermission.and.returnValue(true);
    fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();

    const singleEl = fixture.debugElement.query(By.css(SINGLE_PERMISSION_SELECTOR));
    const multipleEl = fixture.debugElement.query(By.css(MULTIPLE_PERMISSION_SELECTOR));
    const strictEl = fixture.debugElement.query(By.css(STRICT_PERMISSION_SELECTOR));

    expect(singleEl).toBeTruthy();
    expect(multipleEl).toBeTruthy();
    expect(strictEl).toBeTruthy();
  });

  it('should hide elements when permission is denied', () => {
    authServiceSpy.hasPermission.and.returnValue(false);
    fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();

    const singleEl = fixture.debugElement.query(By.css(SINGLE_PERMISSION_SELECTOR));
    const multipleEl = fixture.debugElement.query(By.css(MULTIPLE_PERMISSION_SELECTOR));
    const strictEl = fixture.debugElement.query(By.css(STRICT_PERMISSION_SELECTOR));

    expect(singleEl).toBeNull();
    expect(multipleEl).toBeNull();
    expect(strictEl).toBeNull();
  });

  it('should render everything when RBAC is disabled, even without permission', () => {
    environment.rbacEnabled = false;
    authServiceSpy.hasPermission.and.returnValue(false);
    fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();

    const singleEl = fixture.debugElement.query(By.css(SINGLE_PERMISSION_SELECTOR));
    const multipleEl = fixture.debugElement.query(By.css(MULTIPLE_PERMISSION_SELECTOR));
    const strictEl = fixture.debugElement.query(By.css(STRICT_PERMISSION_SELECTOR));

    expect(singleEl).toBeTruthy();
    expect(multipleEl).toBeTruthy();
    expect(strictEl).toBeTruthy();
    expect(authServiceSpy.hasPermission).not.toHaveBeenCalled();
  });
});
