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

import { DepositAccountViewComponent } from './deposit-account-view.component';
import { FixedDepositAccountService, RecurringDepositAccountService } from '../../api';
import { DialogService } from '../../core/services/dialog.service';
import { provideIonicTesting } from '../../testing/ionic-testing';
import { provideTranslateTesting } from '../../testing/i18n-testing';
import { toIsoDate } from '../../core/utils/date-formatter';

const PENDING = {
  id: 100,
  value: 'Submitted and pending approval',
  submittedAndPendingApproval: true,
  approved: false,
  active: false,
};

describe('DepositAccountViewComponent', () => {
  let fixture: ComponentFixture<DepositAccountViewComponent>;
  let component: DepositAccountViewComponent;
  let fdService: jasmine.SpyObj<FixedDepositAccountService>;
  let dialogService: jasmine.SpyObj<DialogService>;

  /** The account as the platform returns it, with the timeline the commands are floored on. */
  function account(status: object, timeline: object = { submittedOnDate: [2026, 8, 9] }): object {
    return { id: 7, status, timeline, currency: { displaySymbol: '$' } };
  }

  async function setup(data: object): Promise<void> {
    TestBed.resetTestingModule();

    fdService = jasmine.createSpyObj('FixedDepositAccountService', [
      'getFixeddepositaccountsAccountId',
      'postFixeddepositaccountsAccountId',
    ]);
    fdService.getFixeddepositaccountsAccountId.and.returnValue(of(data) as never);
    fdService.postFixeddepositaccountsAccountId.and.returnValue(of({}) as never);

    const rdService = jasmine.createSpyObj('RecurringDepositAccountService', [
      'getRecurringdepositaccountsAccountId',
      'postRecurringdepositaccountsAccountId',
    ]);

    dialogService = jasmine.createSpyObj('DialogService', ['confirm', 'open']);
    dialogService.confirm.and.resolveTo(true);

    await TestBed.configureTestingModule({
      imports: [DepositAccountViewComponent],
      providers: [
        provideNoopAnimations(),
        provideIonicTesting(),
        ...provideTranslateTesting(),
        { provide: FixedDepositAccountService, useValue: fdService },
        { provide: RecurringDepositAccountService, useValue: rdService },
        { provide: DialogService, useValue: dialogService },
        {
          provide: Router,
          useValue: { url: '/products/fixed-deposits/view/7', navigate: () => undefined },
        },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => '7' } } } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DepositAccountViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  /** The body of the most recent command, and the command name. */
  function lastCommand(): { command: string; body: Record<string, unknown> } {
    const args = fdService.postFixeddepositaccountsAccountId.calls.mostRecent().args;
    return { body: args[1] as Record<string, unknown>, command: args[2] as string };
  }

  it('loads the account through the generated service rather than a name that does not exist', async () => {
    await setup(account(PENDING));

    // The regression this guards: the screen used to look the method up as
    // `service['retrieveOne14']`, which is on neither service, so it threw out of ngOnInit and
    // the whole template — wrapped in @if (account()) — rendered as nothing.
    expect(fdService.getFixeddepositaccountsAccountId).toHaveBeenCalledWith(7);
    expect(component.account()).toBeTruthy();
  });

  it('offers only the actions the account status allows', async () => {
    await setup(account(PENDING));
    expect(component.isPending()).toBe(true);
    expect(component.isApproved()).toBe(false);
    expect(component.isActive()).toBe(false);

    await setup(account({ id: 300, value: 'Active', active: true }));
    expect(component.isActive()).toBe(true);
    expect(component.isPending()).toBe(false);
  });

  it('sends undoapproval with an empty body', async () => {
    await setup(account({ id: 200, value: 'Approved', approved: true }));

    component.onUndoApproval();
    await fixture.whenStable();

    // The command refuses `locale` and `dateFormat` outright, which every other command here
    // requires — so a uniformly built payload makes exactly this one fail.
    const { command, body } = lastCommand();
    expect(command).toBe('undoapproval');
    expect(body).toEqual({});
  });

  it('floors a command date at the date the platform stamped', async () => {
    // A tenant whose timezone is already on tomorrow: approving "today" by the browser's clock
    // would be approving before submission, which the platform refuses.
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const [year, month, day] = toIsoDate(tomorrow).split('-').map(Number);
    await setup(account(PENDING, { submittedOnDate: [year, month, day] }));

    component.onApprove();
    await fixture.whenStable();

    const { body } = lastCommand();
    expect(body['approvedOnDate']).toContain(String(year));
    expect(body['approvedOnDate']).toContain(String(day).padStart(2, '0'));
  });

  it('keeps today when the stamped date is already behind it', async () => {
    await setup(account(PENDING, { submittedOnDate: [2020, 1, 2] }));

    component.onApprove();
    await fixture.whenStable();

    const today = new Date();
    expect(lastCommand().body['approvedOnDate']).toContain(String(today.getFullYear()));
  });

  it('closes with the closure type the dialog collected, and no withdrawBalance', async () => {
    await setup(
      account({ id: 300, value: 'Active', active: true }, { activatedOnDate: [2026, 1, 1] }),
    );
    dialogService.open.and.resolveTo({ onAccountClosureId: 100 });

    component.onPrematureClose();
    await fixture.whenStable();
    await fixture.whenStable();

    const { command, body } = lastCommand();
    expect(command).toBe('prematureClose');
    // `onAccountClosureId` is mandatory; `withdrawBalance` — which the savings screens send — is
    // not a parameter these commands accept at all.
    expect(body['onAccountClosureId']).toBe(100);
    expect('withdrawBalance' in body).toBe(false);
  });

  it('sends nothing when the closure dialog is dismissed', async () => {
    await setup(account({ id: 300, value: 'Active', active: true }));
    dialogService.open.and.resolveTo(undefined);

    component.onClose();
    await fixture.whenStable();

    expect(fdService.postFixeddepositaccountsAccountId).not.toHaveBeenCalled();
  });
});
