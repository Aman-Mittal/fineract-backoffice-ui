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
import { ClientFormComponent } from './client-form.component';
import { ClientService, OfficesService } from '../../api';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { of, Observable } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { MatNativeDateModule } from '@angular/material/core';

describe('ClientFormComponent', () => {
  const HEAD_OFFICE = 'Head Office';

  let component: ClientFormComponent;
  let fixture: ComponentFixture<ClientFormComponent>;
  let clientServiceSpy: jasmine.SpyObj<ClientService>;
  let officesServiceSpy: jasmine.SpyObj<OfficesService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let dialogSpy: jasmine.SpyObj<MatDialog>;

  beforeEach(async () => {
    clientServiceSpy = jasmine.createSpyObj('ClientService', [
      'getClientsClientId',
      'postClients',
      'putClientsClientId',
    ]);
    officesServiceSpy = jasmine.createSpyObj('OfficesService', ['getOffices']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);

    officesServiceSpy.getOffices.and.returnValue(
      of([{ id: 1, name: HEAD_OFFICE }]) as unknown as Observable<never>,
    );
    clientServiceSpy.getClientsClientId.and.returnValue(
      of({
        id: 10,
        firstname: 'John',
        lastname: 'Doe',
        officeId: 1,
        legalFormId: 1,
        submittedOnDate: [2026, 6, 16] as unknown as number[],
        activationDate: [2026, 6, 17] as unknown as number[],
        active: true,
      }) as unknown as Observable<never>,
    );

    await TestBed.configureTestingModule({
      imports: [ClientFormComponent, TranslateModule.forRoot(), MatNativeDateModule],
      providers: [
        { provide: ClientService, useValue: clientServiceSpy },
        { provide: OfficesService, useValue: officesServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: MatDialog, useValue: dialogSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of({
              get: () => null,
            }),
            snapshot: {
              paramMap: {
                get: () => null,
              },
            },
          },
        },
        provideNoopAnimations(),
      ],
    })
      .overrideComponent(ClientFormComponent, {
        add: {
          providers: [{ provide: MatDialog, useValue: dialogSpy }],
        },
      })
      .compileComponents();
  });

  describe('Create Mode', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(ClientFormComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should create and load offices', () => {
      expect(component).toBeTruthy();
      expect(officesServiceSpy.getOffices).toHaveBeenCalled();
      expect(component.isEditMode).toBeFalse();
    });

    it('should open create office dialog and add new office', () => {
      const dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['afterClosed']);
      dialogRefSpy.afterClosed.and.returnValue(of(2));
      dialogSpy.open.and.returnValue(dialogRefSpy);

      // Initially offices has 1 office.
      component.offices = [{ id: 1, name: HEAD_OFFICE }];
      // After addOffice, getOffices should be called again and we can make it return 2 offices.
      officesServiceSpy.getOffices.and.returnValue(
        of([
          { id: 1, name: HEAD_OFFICE },
          { id: 2, name: 'Branch Office' },
        ]) as unknown as Observable<never>,
      );

      component.addOffice();

      expect(dialogSpy.open).toHaveBeenCalled();
      expect(component.offices.length).toBe(2);
      expect(component.client.officeId).toBe(2);
    });

    it('should submit client create request successfully', () => {
      clientServiceSpy.postClients.and.returnValue(
        of({ clientId: 10 }) as unknown as Observable<never>,
      );
      component.client = {
        firstname: 'John',
        lastname: 'Doe',
        officeId: 1,
        legalFormId: 1,
        active: true,
      };
      component.submittedOnDate = new Date(2026, 5, 16);
      component.activationDate = new Date(2026, 5, 17);

      component.onSubmit();

      expect(clientServiceSpy.postClients).toHaveBeenCalled();
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/clients']);
    });

    it('should handle cancel', () => {
      component.onCancel();
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/clients']);
    });
  });

  describe('Edit Mode', () => {
    it('should load client details and update successfully', async () => {
      TestBed.resetTestingModule();

      await TestBed.configureTestingModule({
        imports: [ClientFormComponent, TranslateModule.forRoot(), MatNativeDateModule],
        providers: [
          { provide: ClientService, useValue: clientServiceSpy },
          { provide: OfficesService, useValue: officesServiceSpy },
          { provide: Router, useValue: routerSpy },
          { provide: MatDialog, useValue: dialogSpy },
          {
            provide: ActivatedRoute,
            useValue: {
              paramMap: of({
                get: (key: string) => (key === 'id' ? '10' : null),
              }),
              snapshot: {
                paramMap: {
                  get: (key: string) => (key === 'id' ? '10' : null),
                },
              },
            },
          },
          provideNoopAnimations(),
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(ClientFormComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();

      expect(component.isEditMode).toBeTrue();
      expect(component.clientId).toBe(10);
      expect(clientServiceSpy.getClientsClientId).toHaveBeenCalledWith(10);

      clientServiceSpy.putClientsClientId.and.returnValue(of({}) as unknown as Observable<never>);
      component.onSubmit();

      expect(clientServiceSpy.putClientsClientId).toHaveBeenCalled();
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/clients']);
    });
  });
});
