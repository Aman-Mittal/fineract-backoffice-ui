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
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { of } from 'rxjs';

import { GlimAccountViewComponent } from './glim-account-view.component';
import { GroupsService, LoansService } from '../../../api';
import { provideFakeAdapters } from '../../../testing/adapters';
import { createSpyObj, SpyObj } from '../../../testing/mocks';

const ROW = {
  childLoanId: 501,
  clientId: 11,
  clientName: 'Amina Yusuf',
  childLoanAccountNo: '000000501',
  childPrincipalAmount: 500,
  parentPrincipalAmount: 1200,
  status: { code: 'loanStatusType.active', value: 'Active' },
};

function createComponent(glimId: string | null) {
  const loansService: SpyObj<LoansService> = createSpyObj(['getLoansGlimAccountGlimId']);
  const groupsService: SpyObj<GroupsService> = createSpyObj(['getGroupsGroupIdGlimaccounts']);

  const adapters = provideFakeAdapters();

  TestBed.configureTestingModule({
    imports: [GlimAccountViewComponent],
    providers: [
      provideNoopAnimations(),
      ...adapters.providers,
      { provide: LoansService, useValue: loansService },
      { provide: GroupsService, useValue: groupsService },
      { provide: Router, useValue: createSpyObj(['navigate']) },
      {
        provide: ActivatedRoute,
        useValue: {
          snapshot: {
            paramMap: { get: (key: string) => (key === 'groupId' ? '7' : glimId) },
          },
        },
      },
    ],
  });

  const fixture: ComponentFixture<GlimAccountViewComponent> =
    TestBed.createComponent(GlimAccountViewComponent);
  const component = fixture.componentInstance;
  const routerSpy = TestBed.inject(Router) as unknown as SpyObj<Router>;
  return { fixture, component, loansService, groupsService, routerSpy };
}

describe('GlimAccountViewComponent', () => {
  it('reads one specific GLIM application when a glimId is present', () => {
    const { component, loansService, groupsService, fixture } = createComponent('42');
    loansService.getLoansGlimAccountGlimId.mockReturnValue(
      of(JSON.stringify([ROW])) as unknown as ReturnType<LoansService['getLoansGlimAccountGlimId']>,
    );

    fixture.detectChanges();

    expect(loansService.getLoansGlimAccountGlimId).toHaveBeenCalledWith(42);
    expect(groupsService.getGroupsGroupIdGlimaccounts).not.toHaveBeenCalled();
    expect(component.rows()).toEqual([ROW]);
  });

  it('falls back to every GLIM application for the group when no glimId is given', () => {
    const { component, loansService, groupsService, fixture } = createComponent(null);
    groupsService.getGroupsGroupIdGlimaccounts.mockReturnValue(
      of(JSON.stringify([ROW])) as unknown as ReturnType<
        GroupsService['getGroupsGroupIdGlimaccounts']
      >,
    );

    fixture.detectChanges();

    expect(groupsService.getGroupsGroupIdGlimaccounts).toHaveBeenCalledWith(7);
    expect(loansService.getLoansGlimAccountGlimId).not.toHaveBeenCalled();
    expect(component.rows()).toEqual([ROW]);
  });

  it('navigates to the child loan when a row is opened', () => {
    const { component, loansService, fixture, routerSpy } = createComponent('42');
    loansService.getLoansGlimAccountGlimId.mockReturnValue(
      of(JSON.stringify([ROW])) as unknown as ReturnType<LoansService['getLoansGlimAccountGlimId']>,
    );
    fixture.detectChanges();

    component.onOpenLoan(501);

    expect(routerSpy.navigate).toHaveBeenCalledWith(['/loans/view', 501]);
  });

  it('reports an empty state when the group has made no GLIM applications', () => {
    const { component, groupsService, fixture } = createComponent(null);
    groupsService.getGroupsGroupIdGlimaccounts.mockReturnValue(
      of('[]') as unknown as ReturnType<GroupsService['getGroupsGroupIdGlimaccounts']>,
    );

    fixture.detectChanges();

    expect(component.rows()).toEqual([]);
    expect(component.isLoading()).toBe(false);
  });
});
