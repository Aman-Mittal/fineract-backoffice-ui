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
import { CollateralManagementListComponent } from './collateral-management-list.component';
import { CollateralManagementService } from '../../../api';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { provideNoopAnimations } from '@angular/platform-browser/animations';

describe('CollateralManagementListComponent', () => {
  let component: CollateralManagementListComponent;
  let fixture: ComponentFixture<CollateralManagementListComponent>;
  let serviceSpy: jasmine.SpyObj<CollateralManagementService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    serviceSpy = jasmine.createSpyObj('CollateralManagementService', [
      'getCollateralManagement',
      'deleteCollateralManagementCollateralId',
    ]);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    serviceSpy.getCollateralManagement.and.returnValue(
      of([{ id: 1, name: 'Gold', quality: 'High', basePrice: 1000 }]) as unknown as ReturnType<
        CollateralManagementService['getCollateralManagement']
      >,
    );

    await TestBed.configureTestingModule({
      imports: [CollateralManagementListComponent, TranslateModule.forRoot()],
      providers: [
        { provide: CollateralManagementService, useValue: serviceSpy },
        { provide: Router, useValue: routerSpy },
        provideNoopAnimations(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CollateralManagementListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should load collaterals on init', () => {
    expect(component).toBeTruthy();
    expect(serviceSpy.getCollateralManagement).toHaveBeenCalled();
    expect(component.collaterals.length).toBe(1);
  });

  it('should navigate to edit with the collateral id', () => {
    component.onEdit({ id: 3, name: 'X' });
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/products/collateral-management/edit', 3]);
  });

  it('should delete after confirmation and reload', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    serviceSpy.deleteCollateralManagementCollateralId.and.returnValue(
      of({}) as unknown as ReturnType<
        CollateralManagementService['deleteCollateralManagementCollateralId']
      >,
    );

    component.onDelete({ id: 5, name: 'Y' });

    expect(serviceSpy.deleteCollateralManagementCollateralId).toHaveBeenCalledWith(5);
    expect(serviceSpy.getCollateralManagement).toHaveBeenCalledTimes(2);
  });

  it('should not delete when cancelled', () => {
    spyOn(window, 'confirm').and.returnValue(false);
    component.onDelete({ id: 5, name: 'Y' });
    expect(serviceSpy.deleteCollateralManagementCollateralId).not.toHaveBeenCalled();
  });
});
