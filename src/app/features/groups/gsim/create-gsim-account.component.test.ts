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
import { ActivatedRoute, Router } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { of, throwError } from 'rxjs';

import { CreateGsimAccountComponent } from './create-gsim-account.component';
import { GroupDetail } from '../group-detail.model';
import { BASE_PATH, SavingsAccountService, SavingsProductService } from '../../../api';
import { provideFakeAdapters } from '../../../testing/adapters';
import { createSpyObj, SpyObj } from '../../../testing/mocks';

const API = '/api';

const GROUP: GroupDetail = {
  id: 7,
  activeClientMembers: [
    { id: 11, displayName: 'Amina Yusuf' },
    { id: 12, displayName: 'Beatrice Wanjiru' },
  ],
};

function createComponent() {
  const productService: SpyObj<SavingsProductService> = createSpyObj(['getSavingsproducts']);
  productService.getSavingsproducts.mockReturnValue(
    of([{ id: 3, name: 'Group Savings Product' }]) as unknown as ReturnType<
      SavingsProductService['getSavingsproducts']
    >,
  );

  const savingsService: SpyObj<SavingsAccountService> = createSpyObj(['postSavingsaccountsGsim']);

  const adapters = provideFakeAdapters();

  TestBed.configureTestingModule({
    imports: [CreateGsimAccountComponent],
    providers: [
      provideNoopAnimations(),
      provideHttpClient(),
      provideHttpClientTesting(),
      ...adapters.providers,
      { provide: BASE_PATH, useValue: API },
      { provide: SavingsProductService, useValue: productService },
      { provide: SavingsAccountService, useValue: savingsService },
      { provide: Router, useValue: createSpyObj(['navigate']) },
      { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => '7' } } } },
    ],
  });

  const httpMock = TestBed.inject(HttpTestingController);
  const fixture: ComponentFixture<CreateGsimAccountComponent> = TestBed.createComponent(
    CreateGsimAccountComponent,
  );
  const component = fixture.componentInstance;
  fixture.detectChanges();

  const routerSpy = TestBed.inject(Router) as unknown as SpyObj<Router>;
  return { fixture, component, savingsService, httpMock, routerSpy };
}

function flushMembers(httpMock: HttpTestingController, body: GroupDetail = GROUP): void {
  httpMock.expectOne((req) => req.url === `${API}/v1/groups/7`).flush(body);
}

describe('CreateGsimAccountComponent', () => {
  it('cannot submit until at least one member is selected', () => {
    const { component, httpMock } = createComponent();
    flushMembers(httpMock);

    expect(component.canSubmit()).toBe(false);
    component.onMemberSelectedChange(component.members()[0], true);
    expect(component.canSubmit()).toBe(true);
    httpMock.verify();
  });

  it('marks only the first selected member as the GSIM parent', () => {
    const { component, httpMock, savingsService } = createComponent();
    flushMembers(httpMock);
    savingsService.postSavingsaccountsGsim.mockReturnValue(
      of('{}') as unknown as ReturnType<SavingsAccountService['postSavingsaccountsGsim']>,
    );

    component.productId = 3;
    component.interestRate = 5;
    const [first, second] = component.members();
    component.onMemberSelectedChange(first, true);
    component.onMemberSelectedChange(second, true);

    component.onSubmit();

    expect(savingsService.postSavingsaccountsGsim).toHaveBeenCalledTimes(1);
    const [rawBody] = savingsService.postSavingsaccountsGsim.mock.calls[0];
    const { clientArray } = JSON.parse(rawBody as string);

    expect(clientArray).toHaveLength(2);
    expect(clientArray[0]).toMatchObject({
      clientId: 11,
      groupId: 7,
      productId: 3,
      isGSIM: true,
      isParentAccount: true,
    });
    expect(clientArray[1]).toMatchObject({ clientId: 12, isParentAccount: false });
    httpMock.verify();
  });

  it('navigates to the GSIM overview on success', () => {
    const { component, httpMock, savingsService, routerSpy } = createComponent();
    flushMembers(httpMock);
    savingsService.postSavingsaccountsGsim.mockReturnValue(
      of('{}') as unknown as ReturnType<SavingsAccountService['postSavingsaccountsGsim']>,
    );

    component.onMemberSelectedChange(component.members()[0], true);
    component.onSubmit();

    expect(routerSpy.navigate).toHaveBeenCalledWith(['/groups', 7, 'gsim', 'view']);
    expect(component.isSaving()).toBe(false);
    httpMock.verify();
  });

  it('reports an error and does not navigate when the request fails', () => {
    const { component, httpMock, savingsService, routerSpy } = createComponent();
    flushMembers(httpMock);
    savingsService.postSavingsaccountsGsim.mockReturnValue(
      throwError(() => new Error('boom')) as unknown as ReturnType<
        SavingsAccountService['postSavingsaccountsGsim']
      >,
    );

    component.onMemberSelectedChange(component.members()[0], true);
    component.onSubmit();

    expect(routerSpy.navigate).not.toHaveBeenCalled();
    expect(component.isSaving()).toBe(false);
    httpMock.verify();
  });
});
