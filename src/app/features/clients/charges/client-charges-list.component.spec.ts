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
import { ClientChargesListComponent } from './client-charges-list.component';
import { ClientChargesService } from '../../../api';
import { ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { of } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { provideNoopAnimations } from '@angular/platform-browser/animations';

describe('ClientChargesListComponent', () => {
  let component: ClientChargesListComponent;
  let fixture: ComponentFixture<ClientChargesListComponent>;
  let serviceSpy: jasmine.SpyObj<ClientChargesService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    serviceSpy = jasmine.createSpyObj('ClientChargesService', [
      'getClientsClientIdCharges',
      'deleteClientsClientIdChargesChargeId',
    ]);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    serviceSpy.getClientsClientIdCharges.and.returnValue(
      of({
        pageItems: [{ id: 1, name: 'Fee', amount: 100 }],
      }) as unknown as ReturnType<ClientChargesService['getClientsClientIdCharges']>,
    );

    await TestBed.configureTestingModule({
      imports: [ClientChargesListComponent, TranslateModule.forRoot()],
      providers: [
        { provide: ClientChargesService, useValue: serviceSpy },
        { provide: Router, useValue: routerSpy },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: convertToParamMap({ clientId: '1' }) } },
        },
        provideNoopAnimations(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ClientChargesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should load client charges on init', () => {
    expect(component).toBeTruthy();
    expect(serviceSpy.getClientsClientIdCharges).toHaveBeenCalledWith(1);
    expect(component.charges.length).toBe(1);
  });

  it('should delete after confirmation and reload', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    serviceSpy.deleteClientsClientIdChargesChargeId.and.returnValue(
      of({}) as unknown as ReturnType<ClientChargesService['deleteClientsClientIdChargesChargeId']>,
    );

    component.onDelete({ id: 5, name: 'X' });

    expect(serviceSpy.deleteClientsClientIdChargesChargeId).toHaveBeenCalledWith(1, 5);
    expect(serviceSpy.getClientsClientIdCharges).toHaveBeenCalledTimes(2);
  });

  it('should not delete when cancelled', () => {
    spyOn(window, 'confirm').and.returnValue(false);
    component.onDelete({ id: 5, name: 'X' });
    expect(serviceSpy.deleteClientsClientIdChargesChargeId).not.toHaveBeenCalled();
  });
});
