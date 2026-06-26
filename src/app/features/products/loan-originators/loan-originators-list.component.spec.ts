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
import { LoanOriginatorsListComponent } from './loan-originators-list.component';
import { LoanOriginatorsService } from '../../../api';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { provideNoopAnimations } from '@angular/platform-browser/animations';

describe('LoanOriginatorsListComponent', () => {
  let component: LoanOriginatorsListComponent;
  let fixture: ComponentFixture<LoanOriginatorsListComponent>;
  let serviceSpy: jasmine.SpyObj<LoanOriginatorsService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    serviceSpy = jasmine.createSpyObj('LoanOriginatorsService', [
      'getLoanOriginators',
      'deleteLoanOriginatorsOriginatorId',
    ]);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    serviceSpy.getLoanOriginators.and.returnValue(
      of([{ id: 1, name: 'Originator A', externalId: 'EXT-1' }]) as unknown as ReturnType<
        LoanOriginatorsService['getLoanOriginators']
      >,
    );

    await TestBed.configureTestingModule({
      imports: [LoanOriginatorsListComponent, TranslateModule.forRoot()],
      providers: [
        { provide: LoanOriginatorsService, useValue: serviceSpy },
        { provide: Router, useValue: routerSpy },
        provideNoopAnimations(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoanOriginatorsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should load originators on init', () => {
    expect(component).toBeTruthy();
    expect(serviceSpy.getLoanOriginators).toHaveBeenCalled();
    expect(component.originators.length).toBe(1);
  });

  it('should navigate to edit with the originator id', () => {
    component.onEdit({ id: 3, name: 'X' });
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/products/loan-originators/edit', 3]);
  });

  it('should delete after confirmation and reload', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    serviceSpy.deleteLoanOriginatorsOriginatorId.and.returnValue(
      of({}) as unknown as ReturnType<LoanOriginatorsService['deleteLoanOriginatorsOriginatorId']>,
    );

    component.onDelete({ id: 5, name: 'Y' });

    expect(serviceSpy.deleteLoanOriginatorsOriginatorId).toHaveBeenCalledWith(5);
    expect(serviceSpy.getLoanOriginators).toHaveBeenCalledTimes(2);
  });

  it('should not delete when cancelled', () => {
    spyOn(window, 'confirm').and.returnValue(false);
    component.onDelete({ id: 5, name: 'Y' });
    expect(serviceSpy.deleteLoanOriginatorsOriginatorId).not.toHaveBeenCalled();
  });
});
