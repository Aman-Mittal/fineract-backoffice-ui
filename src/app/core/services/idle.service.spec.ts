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
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';

describe('IdleService', () => {
  let service: IdleService;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let dialogSpy: jasmine.SpyObj<MatDialog>;

  beforeEach(() => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['logout', 'isAuthenticated']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);

    TestBed.configureTestingModule({
      providers: [
        IdleService,
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: MatDialog, useValue: dialogSpy },
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
    const dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['afterClosed', 'close']);
    dialogRefSpy.afterClosed.and.returnValue(of(true));
    dialogSpy.open.and.returnValue(dialogRefSpy);

    service = TestBed.inject(IdleService);

    // Total 15m, Warning at 13m. Advance to 13m
    tick(13 * 60 * 1000 + 1000);

    expect(dialogSpy.open).toHaveBeenCalled();
    service.ngOnDestroy();
  }));

  it('should logout if user does not respond to warning', fakeAsync(() => {
    authServiceSpy.isAuthenticated.and.returnValue(true);
    const dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['afterClosed', 'close']);
    dialogRefSpy.afterClosed.and.returnValue(of(null)); // Still open or closed without action
    dialogSpy.open.and.returnValue(dialogRefSpy);

    service = TestBed.inject(IdleService);

    // Advance to 13m (warning shows)
    tick(13 * 60 * 1000 + 1000);
    expect(dialogSpy.open).toHaveBeenCalled();

    // Advance remaining 2m
    tick(2 * 60 * 1000 + 1000);

    expect(authServiceSpy.logout).toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalled();

    service.ngOnDestroy();
  }));
});
