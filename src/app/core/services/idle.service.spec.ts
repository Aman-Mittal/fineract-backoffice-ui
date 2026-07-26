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

import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { IdleService } from './idle.service';
import { AuthService } from './auth.service';
import { ModalController } from '@ionic/angular/standalone';

describe('IdleService', () => {
  let service: IdleService;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let modalControllerSpy: jasmine.SpyObj<ModalController>;
  let modalSpy: jasmine.SpyObj<HTMLIonModalElement>;

  beforeEach(() => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['logout', 'isAuthenticated']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    modalControllerSpy = jasmine.createSpyObj<ModalController>('ModalController', ['create']);
    modalSpy = jasmine.createSpyObj<HTMLIonModalElement>('IonModal', [
      'present',
      'dismiss',
      'onWillDismiss',
    ]);
    modalSpy.present.and.resolveTo();
    modalSpy.dismiss.and.resolveTo(true);
    modalSpy.onWillDismiss.and.resolveTo({ data: undefined } as never);
    modalControllerSpy.create.and.resolveTo(modalSpy);

    TestBed.configureTestingModule({
      providers: [
        IdleService,
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ModalController, useValue: modalControllerSpy },
      ],
    });

    authServiceSpy.isAuthenticated.and.returnValue(false);
  });

  it('should be created', () => {
    service = TestBed.inject(IdleService);
    expect(service).toBeTruthy();
  });

  it('should show warning dialog before timeout', fakeAsync(() => {
    authServiceSpy.isAuthenticated.and.returnValue(true);
    modalSpy.onWillDismiss.and.resolveTo({ data: true } as never);

    service = TestBed.inject(IdleService);

    // Total 15m, Warning at 13m. Advance to 13m
    tick(13 * 60 * 1000 + 1000);

    expect(modalControllerSpy.create).toHaveBeenCalled();
    service.ngOnDestroy();
  }));

  it('should logout if user does not respond to warning', fakeAsync(() => {
    authServiceSpy.isAuthenticated.and.returnValue(true);
    // The user never answers the warning, so the hard logout timer must fire.
    modalSpy.onWillDismiss.and.returnValue(new Promise(() => undefined) as never);

    service = TestBed.inject(IdleService);

    // Advance to 13m (warning shows)
    tick(13 * 60 * 1000 + 1000);
    expect(modalControllerSpy.create).toHaveBeenCalled();

    // Advance remaining 2m
    tick(2 * 60 * 1000 + 1000);

    expect(authServiceSpy.logout).toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalled();

    service.ngOnDestroy();
  }));
});
