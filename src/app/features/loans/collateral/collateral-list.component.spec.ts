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
import { CollateralListComponent } from './collateral-list.component';
import {
  LoanCollateralService,
  CollateralData,
  DeleteLoansLoanIdCollateralsCollateralIdResponse,
} from '../../../api';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { HttpEvent } from '@angular/common/http';

describe('CollateralListComponent', () => {
  let component: CollateralListComponent;
  let fixture: ComponentFixture<CollateralListComponent>;
  let collateralServiceSpy: jasmine.SpyObj<LoanCollateralService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    collateralServiceSpy = jasmine.createSpyObj('LoanCollateralService', [
      'retrieveCollateralDetails',
      'deleteCollateral',
    ]);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [CollateralListComponent, TranslateModule.forRoot()],
      providers: [
        provideNoopAnimations(),
        { provide: LoanCollateralService, useValue: collateralServiceSpy },
        { provide: Router, useValue: routerSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of({ get: () => '123' }),
          },
        },
      ],
    }).compileComponents();

    collateralServiceSpy.retrieveCollateralDetails.and.returnValue(
      of([]) as unknown as Observable<HttpEvent<CollateralData[]>>,
    );
    fixture = TestBed.createComponent(CollateralListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load collaterals on init', () => {
    expect(component.loanId).toBe(123);
    expect(collateralServiceSpy.retrieveCollateralDetails).toHaveBeenCalledWith(123);
  });

  it('should navigate to create on onCreateCollateral', () => {
    component.onCreateCollateral();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/loans', 123, 'collateral', 'create']);
  });

  it('should navigate to edit on onEditCollateral', () => {
    const mockCollateral = { id: 456 };
    component.onEditCollateral(mockCollateral as unknown as CollateralData);
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/loans', 123, 'collateral', 'edit', 456]);
  });

  it('should call delete and reload on onDeleteCollateral', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    collateralServiceSpy.deleteCollateral.and.returnValue(
      of({}) as unknown as Observable<HttpEvent<DeleteLoansLoanIdCollateralsCollateralIdResponse>>,
    );

    component.onDeleteCollateral({ id: 456 } as unknown as CollateralData);

    expect(collateralServiceSpy.deleteCollateral).toHaveBeenCalledWith(123, 456);
    expect(collateralServiceSpy.retrieveCollateralDetails).toHaveBeenCalledTimes(2);
  });
});
