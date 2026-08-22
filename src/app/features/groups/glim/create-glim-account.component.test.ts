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
import { of } from 'rxjs';

import { CreateGlimAccountComponent } from './create-glim-account.component';
import { GroupDetail } from '../group-detail.model';
import { BASE_PATH, BatchAPIService, LoanProductsService } from '../../../api';
import { provideFakeAdapters } from '../../../testing/adapters';
import { createSpyObj, SpyObj } from '../../../testing/mocks';

const API = '/api';

const GROUP: GroupDetail = {
  id: 7,
  activeClientMembers: [
    { id: 11, displayName: 'Amina Yusuf' },
    { id: 12, displayName: 'Beatrice Wanjiru' },
  ],
  clientMembers: [
    { id: 11, displayName: 'Amina Yusuf' },
    { id: 12, displayName: 'Beatrice Wanjiru' },
    { id: 13, displayName: 'Pending Member' },
  ],
};

function createComponent() {
  const productService: SpyObj<LoanProductsService> = createSpyObj(['getLoanproducts']);
  productService.getLoanproducts.mockReturnValue(
    of([{ id: 1, name: 'Group Loan Product' }]) as unknown as ReturnType<
      LoanProductsService['getLoanproducts']
    >,
  );

  const batchService: SpyObj<BatchAPIService> = createSpyObj(['postBatches']);

  const adapters = provideFakeAdapters();

  TestBed.configureTestingModule({
    imports: [CreateGlimAccountComponent],
    providers: [
      provideNoopAnimations(),
      provideHttpClient(),
      provideHttpClientTesting(),
      ...adapters.providers,
      { provide: BASE_PATH, useValue: API },
      { provide: LoanProductsService, useValue: productService },
      { provide: BatchAPIService, useValue: batchService },
      { provide: Router, useValue: createSpyObj(['navigate']) },
      { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => '7' } } } },
    ],
  });

  const httpMock = TestBed.inject(HttpTestingController);
  const fixture: ComponentFixture<CreateGlimAccountComponent> = TestBed.createComponent(
    CreateGlimAccountComponent,
  );
  const component = fixture.componentInstance;
  fixture.detectChanges();

  const routerSpy = TestBed.inject(Router) as unknown as SpyObj<Router>;
  return { fixture, component, batchService, httpMock, routerSpy };
}

function flushMembers(httpMock: HttpTestingController, body: GroupDetail = GROUP): void {
  const request = httpMock.expectOne((req) => req.url === `${API}/v1/groups/7`);
  request.flush(body);
}

describe('CreateGlimAccountComponent', () => {
  it('loads only the active members for the principal table', () => {
    const { component, httpMock } = createComponent();
    flushMembers(httpMock);

    expect(component.members().map((member) => member.id)).toEqual([11, 12]);
    httpMock.verify();
  });

  it('cannot submit until at least one member is selected with a principal', () => {
    const { component, httpMock } = createComponent();
    flushMembers(httpMock);

    expect(component.canSubmit()).toBe(false);

    const [member] = component.members();
    component.onMemberSelectedChange(member, true);
    component.onMemberPrincipalChange(member, 500);
    expect(component.canSubmit()).toBe(true);
    httpMock.verify();
  });

  it('sends one batch request per selected member, each carrying the shared terms and totalLoan', () => {
    const { component, httpMock, batchService } = createComponent();
    flushMembers(httpMock);
    batchService.postBatches.mockReturnValue(
      of([{ statusCode: 200, body: JSON.stringify({ glimId: 42 }) }]) as unknown as ReturnType<
        BatchAPIService['postBatches']
      >,
    );

    component.terms.productId = 1;
    component.terms.numberOfRepayments = 12;
    component.terms.repaymentEvery = 1;
    component.terms.repaymentFrequencyType = 2;
    component.terms.interestRatePerPeriod = 10;
    component.terms.interestType = 0;
    component.terms.amortizationType = 1;
    component.terms.interestCalculationPeriodType = 1;
    component.terms.loanTermFrequency = 12;
    component.terms.loanTermFrequencyType = 2;

    const [first, second] = component.members();
    component.onMemberSelectedChange(first, true);
    component.onMemberPrincipalChange(first, 500);
    component.onMemberSelectedChange(second, true);
    component.onMemberPrincipalChange(second, 700);

    component.onSubmit();

    expect(batchService.postBatches).toHaveBeenCalledTimes(1);
    const [requests, enclosingTransaction] = batchService.postBatches.mock.calls[0];
    expect(enclosingTransaction).toBe(true);
    expect(requests).toHaveLength(2);
    expect(requests[0].method).toBe('POST');
    expect(requests[0].relativeUrl).toBe('loans');

    const bodies = requests.map((request) => JSON.parse(request.body as string));
    expect(bodies[0]).toMatchObject({
      loanType: 'glim',
      groupId: 7,
      clientId: 11,
      principal: 500,
      totalLoan: 1200,
      isParentAccount: true,
      productId: 1,
    });
    expect(bodies[1]).toMatchObject({
      clientId: 12,
      principal: 700,
      totalLoan: 1200,
      isParentAccount: true,
    });
    httpMock.verify();
  });

  it('navigates to the new GLIM account view using the glimId from the first batch response', () => {
    const { component, httpMock, batchService, routerSpy } = createComponent();
    flushMembers(httpMock);
    batchService.postBatches.mockReturnValue(
      of([{ statusCode: 200, body: JSON.stringify({ glimId: 99 }) }]) as unknown as ReturnType<
        BatchAPIService['postBatches']
      >,
    );

    const [member] = component.members();
    component.onMemberSelectedChange(member, true);
    component.onMemberPrincipalChange(member, 500);

    component.onSubmit();

    expect(routerSpy.navigate).toHaveBeenCalledWith(['/groups', 7, 'glim', 'view', 99]);
    expect(component.isSaving()).toBe(false);
    httpMock.verify();
  });

  it('reports an error and does not navigate when any batch item fails', () => {
    const { component, httpMock, batchService, routerSpy } = createComponent();
    flushMembers(httpMock);
    batchService.postBatches.mockReturnValue(
      of([{ statusCode: 400, body: '{}' }]) as unknown as ReturnType<
        BatchAPIService['postBatches']
      >,
    );

    const [member] = component.members();
    component.onMemberSelectedChange(member, true);
    component.onMemberPrincipalChange(member, 500);

    component.onSubmit();

    expect(routerSpy.navigate).not.toHaveBeenCalled();
    expect(component.isSaving()).toBe(false);
    httpMock.verify();
  });
});
