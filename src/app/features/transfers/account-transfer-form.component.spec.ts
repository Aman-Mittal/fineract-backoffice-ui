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
import { AccountTransferFormComponent } from './account-transfer-form.component';
import { AccountTransfersService, OfficesService, ClientService } from '../../api';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError, Observable } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { MatNativeDateModule } from '@angular/material/core';

describe('AccountTransferFormComponent', () => {
  let component: AccountTransferFormComponent;
  let fixture: ComponentFixture<AccountTransferFormComponent>;
  let transfersServiceSpy: jasmine.SpyObj<AccountTransfersService>;
  let officesServiceSpy: jasmine.SpyObj<OfficesService>;
  let clientServiceSpy: jasmine.SpyObj<ClientService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let activatedRouteQueryParams: Record<string, string>;

  beforeEach(async () => {
    transfersServiceSpy = jasmine.createSpyObj('AccountTransfersService', ['postAccounttransfers']);
    officesServiceSpy = jasmine.createSpyObj('OfficesService', ['getOffices']);
    clientServiceSpy = jasmine.createSpyObj('ClientService', [
      'getClients',
      'getClientsClientIdAccounts',
    ]);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    officesServiceSpy.getOffices.and.returnValue(
      of([{ id: 1, name: 'Head Office' }]) as unknown as Observable<never>,
    );
    clientServiceSpy.getClients.and.returnValue(
      of({ pageItems: [{ id: 10, displayName: 'John Doe' }] }) as unknown as Observable<never>,
    );
    clientServiceSpy.getClientsClientIdAccounts.and.returnValue(
      of({
        savingsAccounts: [{ id: 22, accountNo: 'S01', productName: 'Savings A' }],
        loanAccounts: [{ id: 11, accountNo: 'L01', productName: 'Loan A' }],
      }) as unknown as Observable<never>,
    );

    activatedRouteQueryParams = {
      fromOfficeId: '1',
      fromClientId: '10',
      fromAccountId: '22',
      fromAccountType: '2',
    };

    await TestBed.configureTestingModule({
      imports: [AccountTransferFormComponent, TranslateModule.forRoot(), MatNativeDateModule],
      providers: [
        { provide: AccountTransfersService, useValue: transfersServiceSpy },
        { provide: OfficesService, useValue: officesServiceSpy },
        { provide: ClientService, useValue: clientServiceSpy },
        { provide: Router, useValue: routerSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              queryParams: activatedRouteQueryParams,
            },
          },
        },
        provideNoopAnimations(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AccountTransferFormComponent);
    component = fixture.componentInstance;
    routerSpy.navigate.calls.reset();
  });

  it('should create and load offices, client list, and accounts on init', () => {
    fixture.detectChanges();

    expect(component).toBeTruthy();
    expect(officesServiceSpy.getOffices).toHaveBeenCalled();
    expect(clientServiceSpy.getClients).toHaveBeenCalled();
    expect(clientServiceSpy.getClientsClientIdAccounts).toHaveBeenCalledWith(10);
    expect(component.fromAccounts().length).toBe(1);
    expect(component.fromAccounts()[0].id).toBe(22);
  });

  it('should support switching office and loading clients', () => {
    fixture.detectChanges();
    component.request.toOfficeId = '1';
    component.onOfficeChange('to');

    expect(clientServiceSpy.getClients).toHaveBeenCalledWith(
      1,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
    );
    expect(component.toClients().length).toBe(1);
  });

  it('should load loan accounts when account type changes to loan', () => {
    fixture.detectChanges();
    component.request.toClientId = '10';
    component.request.toAccountType = '1';
    component.onAccountTypeChange('to');

    expect(clientServiceSpy.getClientsClientIdAccounts).toHaveBeenCalledWith(10);
    expect(component.toAccounts().length).toBe(1);
    expect(component.toAccounts()[0].id).toBe(11); // Loan A
  });

  it('should submit transfer request successfully', () => {
    transfersServiceSpy.postAccounttransfers.and.returnValue(
      of({}) as unknown as Observable<never>,
    );
    fixture.detectChanges();

    component.request.fromOfficeId = '1';
    component.request.fromClientId = '10';
    component.request.fromAccountId = '22';
    component.request.fromAccountType = '2';
    component.request.toOfficeId = '1';
    component.request.toClientId = '10';
    component.request.toAccountId = '22';
    component.request.toAccountType = '2';
    component.request.transferAmount = '100';
    component.request.transferDescription = 'Payment';
    component.transferDate = new Date(2026, 5, 16);

    component.onSubmit();

    expect(transfersServiceSpy.postAccounttransfers).toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/clients/view', '10']);
  });

  it('should handle submission error', () => {
    transfersServiceSpy.postAccounttransfers.and.returnValue(
      throwError(() => new Error('Error')) as unknown as Observable<never>,
    );
    spyOn(console, 'error');
    fixture.detectChanges();

    component.onSubmit();
    expect(console.error).toHaveBeenCalled();
  });

  it('should navigate away on cancel', () => {
    fixture.detectChanges();
    routerSpy.navigate.calls.reset();
    component.onCancel();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/clients/view', '10']);
  });

  it('should navigate to clients list on cancel if no client ID is set', () => {
    fixture.detectChanges();
    component.request.fromClientId = undefined;
    routerSpy.navigate.calls.reset();
    component.onCancel();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/clients']);
  });
});
