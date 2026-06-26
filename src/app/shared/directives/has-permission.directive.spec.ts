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

describe('HasPermissionDirective', () => {
  let fixture: ComponentFixture<TestComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(() => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['hasPermission'], {
      currentUser: () => ({ permissions: ['CREATE_CLIENT'] }),
    });

    TestBed.configureTestingModule({
      imports: [TestComponent],
      providers: [{ provide: AuthService, useValue: authServiceSpy }],
    });
  });

  it('should render elements when permission is granted', () => {
    authServiceSpy.hasPermission.and.returnValue(true);
    fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();

    const singleEl = fixture.debugElement.query(By.css('#single-permission'));
    const multipleEl = fixture.debugElement.query(By.css('#multiple-permission'));
    const strictEl = fixture.debugElement.query(By.css('#strict-permission'));

    expect(singleEl).toBeTruthy();
    expect(multipleEl).toBeTruthy();
    expect(strictEl).toBeTruthy();
  });

  it('should hide elements when permission is denied', () => {
    authServiceSpy.hasPermission.and.returnValue(false);
    fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();

    const singleEl = fixture.debugElement.query(By.css('#single-permission'));
    const multipleEl = fixture.debugElement.query(By.css('#multiple-permission'));
    const strictEl = fixture.debugElement.query(By.css('#strict-permission'));

    expect(singleEl).toBeNull();
    expect(multipleEl).toBeNull();
    expect(strictEl).toBeNull();
  });
});
