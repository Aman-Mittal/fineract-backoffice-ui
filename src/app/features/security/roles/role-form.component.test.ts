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
import { ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { createSpyObj, SpyObj } from '../../../testing/mocks';
import { provideTranslateTesting } from '../../../testing/i18n-testing';
import { provideFakeAdapters } from '../../../testing/adapters';
import { provideTestConfig } from '../../../testing/config';
import { RoleFormComponent } from './role-form.component';
import { RolesService } from '../../../api';
import { DialogService } from '../../../core/services/dialog.service';

/**
 * `permissionUsageData` as the roles endpoint reports it, reduced to two codes with a
 * navigation consequence — `READ_USER` opens `/security/users`, `READ_OFFICE` opens
 * `/organization/offices` — plus one that gates an action inside a screen rather than the
 * screen itself. That last one is what makes "no screen changed" a distinct outcome from
 * "nothing changed", which is the distinction the panel exists to draw.
 */
const PERMISSIONS = [
  { code: 'READ_USER', grouping: 'authorisation', selected: true },
  { code: 'READ_OFFICE', grouping: 'organisation', selected: false },
  { code: 'APPROVE_LOAN', grouping: 'transaction_loan', selected: false },
];

describe('RoleFormComponent', () => {
  let component: RoleFormComponent;
  let fixture: ComponentFixture<RoleFormComponent>;
  let rolesService: SpyObj<RolesService>;
  let routerSpy: SpyObj<Router>;
  let dialogService: SpyObj<DialogService>;

  async function setUp(routeId: string | null = '7'): Promise<void> {
    rolesService = createSpyObj([
      'getRolesRoleId',
      'getRolesRoleIdPermissions',
      'postRoles',
      'putRolesRoleId',
      'putRolesRoleIdPermissions',
    ]);
    routerSpy = createSpyObj(['navigate']);
    dialogService = createSpyObj(['confirm']);
    dialogService.confirm.mockResolvedValue(true);

    rolesService.getRolesRoleId.mockReturnValue(
      of({ id: 7, name: 'Branch Officer', description: 'Front desk' }) as unknown as ReturnType<
        RolesService['getRolesRoleId']
      >,
    );
    rolesService.getRolesRoleIdPermissions.mockReturnValue(
      of({ permissionUsageData: PERMISSIONS }) as unknown as ReturnType<
        RolesService['getRolesRoleIdPermissions']
      >,
    );
    rolesService.putRolesRoleId.mockReturnValue(
      of({}) as unknown as ReturnType<RolesService['putRolesRoleId']>,
    );
    rolesService.putRolesRoleIdPermissions.mockReturnValue(
      of({}) as unknown as ReturnType<RolesService['putRolesRoleIdPermissions']>,
    );

    await TestBed.configureTestingModule({
      imports: [RoleFormComponent],
      providers: [
        ...provideTranslateTesting(),
        ...provideFakeAdapters().providers,
        provideTestConfig({ rbacEnabled: true }),
        { provide: RolesService, useValue: rolesService },
        { provide: Router, useValue: routerSpy },
        { provide: DialogService, useValue: dialogService },
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of(convertToParamMap(routeId ? { id: routeId } : {})),
          },
        },
        provideNoopAnimations(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RoleFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  describe('edit mode', () => {
    beforeEach(() => setUp('7'));

    it('loads the role and marks the permissions it already holds', () => {
      expect(component.isEditMode()).toBe(true);
      expect(component.role().name).toBe('Branch Officer');
      expect(component.selected()['READ_USER']).toBe(true);
      expect(component.selected()['READ_OFFICE']).toBe(false);
    });

    it('reports no pending change before anything is touched', () => {
      expect(component.hasPendingChanges()).toBe(false);
      expect(component.permissionDiff()).toEqual({ added: [], removed: [] });
      expect(component.navImpact()).toEqual({ gained: [], lost: [] });
    });

    it('lists a permission granted since load as added', () => {
      component.setPermission('READ_OFFICE', true);
      expect(component.permissionDiff().added).toEqual(['READ_OFFICE']);
      expect(component.permissionDiff().removed).toEqual([]);
    });

    it('lists a permission revoked since load as removed', () => {
      component.setPermission('READ_USER', false);
      expect(component.permissionDiff().removed).toEqual(['READ_USER']);
    });

    it('names the screen a newly granted permission opens', () => {
      component.setPermission('READ_OFFICE', true);
      const gained = component.navImpact().gained.map((entry) => entry.route);
      expect(gained).toContain('/organization/offices');
      expect(component.navImpact().lost).toEqual([]);
    });

    it('names the screen a revoked permission closes', () => {
      component.setPermission('READ_USER', false);
      const lost = component.navImpact().lost.map((entry) => entry.route);
      expect(lost).toContain('/security/users');
      expect(component.navImpact().gained).toEqual([]);
    });

    it('reports a permission change that opens no screen as a change with no navigation impact', () => {
      component.setPermission('APPROVE_LOAN', true);
      expect(component.hasPendingChanges()).toBe(true);
      expect(component.navImpact()).toEqual({ gained: [], lost: [] });
    });

    it('groups permissions by the second segment of the code', () => {
      expect(component.groupedPermissions().map((group) => group.prefix)).toEqual([
        'LOAN',
        'OFFICE',
        'USER',
      ]);
    });

    it('narrows the matrix to codes matching the filter, case-insensitively', () => {
      component.filter.set('office');
      expect(component.visibleGroups()).toHaveLength(1);
      expect(component.visibleGroups()[0].items.map((perm) => perm.code)).toEqual(['READ_OFFICE']);
    });

    it('shows no groups when the filter matches nothing', () => {
      component.filter.set('zzz');
      expect(component.visibleGroups()).toEqual([]);
    });

    it('toggles every code in a group at once', () => {
      const userGroup = component.groupedPermissions().find((group) => group.prefix === 'USER')!;
      component.toggleGroup(userGroup, false);
      expect(component.selected()['READ_USER']).toBe(false);
    });

    it('confirms before writing a permission change, and saves when confirmed', async () => {
      component.setPermission('READ_OFFICE', true);
      await component.onSubmit();

      expect(dialogService.confirm).toHaveBeenCalled();
      expect(rolesService.putRolesRoleIdPermissions).toHaveBeenCalledWith(
        7,
        expect.objectContaining({
          permissions: expect.objectContaining({ READ_OFFICE: true }),
        }),
      );
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/security/roles']);
    });

    it('writes nothing when the confirmation is declined', async () => {
      dialogService.confirm.mockResolvedValue(false);
      component.setPermission('READ_OFFICE', true);
      await component.onSubmit();

      expect(rolesService.putRolesRoleId).not.toHaveBeenCalled();
      expect(rolesService.putRolesRoleIdPermissions).not.toHaveBeenCalled();
    });

    it('saves a description-only edit without asking', async () => {
      await component.onSubmit();
      expect(dialogService.confirm).not.toHaveBeenCalled();
      expect(rolesService.putRolesRoleId).toHaveBeenCalled();
    });

    it('marks the confirmation destructive only when something is being revoked', async () => {
      component.setPermission('READ_USER', false);
      await component.onSubmit();
      expect(dialogService.confirm).toHaveBeenCalledWith(
        expect.objectContaining({ destructive: true }),
      );
    });
  });

  describe('create mode', () => {
    beforeEach(() => setUp(null));

    it('does not fetch permissions for a role that does not exist yet', () => {
      expect(component.isEditMode()).toBe(false);
      expect(rolesService.getRolesRoleIdPermissions).not.toHaveBeenCalled();
    });

    it('opens the new role for editing so its permissions can be set', async () => {
      rolesService.postRoles.mockReturnValue(
        of({ resourceId: 42 }) as unknown as ReturnType<RolesService['postRoles']>,
      );
      component.role.set({ name: 'Teller', description: 'Cash desk' });

      await component.onSubmit();

      expect(rolesService.postRoles).toHaveBeenCalled();
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/security/roles', 'edit', 42]);
    });

    it('falls back to the list when the response carries no id', async () => {
      rolesService.postRoles.mockReturnValue(
        of({}) as unknown as ReturnType<RolesService['postRoles']>,
      );
      await component.onSubmit();
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/security/roles']);
    });
  });
});
