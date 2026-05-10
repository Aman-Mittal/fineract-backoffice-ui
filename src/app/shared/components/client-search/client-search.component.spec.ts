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

import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ClientSearchComponent } from './client-search.component';
import { ClientService, GetClientsResponse } from '../../../api';
import { Observable, of } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { HttpEvent } from '@angular/common/http';

describe('ClientSearchComponent', () => {
  let component: ClientSearchComponent;
  let fixture: ComponentFixture<ClientSearchComponent>;
  let clientServiceSpy: jasmine.SpyObj<ClientService>;

  beforeEach(async () => {
    clientServiceSpy = jasmine.createSpyObj('ClientService', ['retrieveAll21', 'retrieveOne11']);

    await TestBed.configureTestingModule({
      imports: [ClientSearchComponent, NoopAnimationsModule, TranslateModule.forRoot()],
      providers: [{ provide: ClientService, useValue: clientServiceSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(ClientSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should search for clients when input changes', fakeAsync(() => {
    const mockResponse = {
      pageItems: [{ id: 1, displayName: 'John Doe', accountNo: '001' }],
    };
    clientServiceSpy.retrieveAll21.and.returnValue(
      of(mockResponse) as unknown as Observable<HttpEvent<GetClientsResponse>>,
    );

    component.searchControl.setValue('John');
    tick(300); // Debounce time

    expect(clientServiceSpy.retrieveAll21).toHaveBeenCalledWith(
      undefined,
      undefined,
      'John%',
      undefined,
      undefined,
      undefined,
      undefined,
      0,
      20,
    );
    expect(component.filteredClients.length).toBe(1);
    expect(component.filteredClients[0]['displayName']).toBe('John Doe');
  }));

  it('should emit selected client id', () => {
    spyOn(component.clientSelected, 'emit');
    const mockClient = { id: 123, displayName: 'Test Client' };

    component.onSelected(mockClient as unknown as Record<string, unknown>);

    expect(component.clientSelected.emit).toHaveBeenCalledWith(123);
  });
});
