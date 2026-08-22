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

import { GsimAccountViewComponent } from './gsim-account-view.component';
import { GroupsService } from '../../../api';
import { provideFakeAdapters } from '../../../testing/adapters';
import { createSpyObj, SpyObj } from '../../../testing/mocks';

const PARENT = {
  id: 201,
  accountNo: '000000201',
  productName: 'Group Savings Product',
  status: { code: 'savingsAccountStatusType.active', value: 'Active' },
  childGSIMAccounts: [
    {
      id: 202,
      displayName: 'Amina Yusuf',
      accountNo: '000000202',
      productName: 'Group Savings Product',
      clientId: 11,
      status: { code: 'savingsAccountStatusType.active', value: 'Active' },
    },
  ],
};

function createComponent() {
  const groupsService: SpyObj<GroupsService> = createSpyObj(['getGroupsGroupIdGsimaccounts']);
  const adapters = provideFakeAdapters();

  TestBed.configureTestingModule({
    imports: [GsimAccountViewComponent],
    providers: [
      provideNoopAnimations(),
      ...adapters.providers,
      { provide: GroupsService, useValue: groupsService },
      { provide: Router, useValue: createSpyObj(['navigate']) },
      { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => '7' } } } },
    ],
  });

  const fixture: ComponentFixture<GsimAccountViewComponent> =
    TestBed.createComponent(GsimAccountViewComponent);
  const component = fixture.componentInstance;
  const routerSpy = TestBed.inject(Router) as unknown as SpyObj<Router>;
  return { fixture, component, groupsService, routerSpy };
}

describe('GsimAccountViewComponent', () => {
  it('lists every GSIM parent the group has, each with its child accounts', () => {
    const { component, groupsService, fixture } = createComponent();
    groupsService.getGroupsGroupIdGsimaccounts.mockReturnValue(
      of(JSON.stringify([PARENT])) as unknown as ReturnType<
        GroupsService['getGroupsGroupIdGsimaccounts']
      >,
    );

    fixture.detectChanges();

    expect(groupsService.getGroupsGroupIdGsimaccounts).toHaveBeenCalledWith(7);
    expect(component.parents()).toEqual([PARENT]);
  });

  it('navigates to the child savings account when a row is opened', () => {
    const { component, groupsService, fixture, routerSpy } = createComponent();
    groupsService.getGroupsGroupIdGsimaccounts.mockReturnValue(
      of(JSON.stringify([PARENT])) as unknown as ReturnType<
        GroupsService['getGroupsGroupIdGsimaccounts']
      >,
    );
    fixture.detectChanges();

    component.onOpenSavings(202);

    expect(routerSpy.navigate).toHaveBeenCalledWith(['/products/savings-accounts/view', 202]);
  });

  it('reports an empty state when the group has made no GSIM applications', () => {
    const { component, groupsService, fixture } = createComponent();
    groupsService.getGroupsGroupIdGsimaccounts.mockReturnValue(
      of('[]') as unknown as ReturnType<GroupsService['getGroupsGroupIdGsimaccounts']>,
    );

    fixture.detectChanges();

    expect(component.parents()).toEqual([]);
    expect(component.isLoading()).toBe(false);
  });
});
