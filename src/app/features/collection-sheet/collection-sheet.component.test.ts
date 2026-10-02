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
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { of } from 'rxjs';

import { CollectionSheetComponent } from './collection-sheet.component';
import { CollectionSheetService, OfficesService, StaffService } from '../../api';
import { NotificationService } from '../../core/services/notification.service';
import { provideIonicTesting } from '../../testing/ionic-testing';
import { provideTranslateTesting } from '../../testing/i18n-testing';
import { createSpyObj, SpyObj } from '../../testing/mocks';

describe('CollectionSheetComponent', () => {
  let component: CollectionSheetComponent;
  let fixture: ComponentFixture<CollectionSheetComponent>;
  let collectionSheetSpy: SpyObj<CollectionSheetService>;
  let officesSpy: SpyObj<OfficesService>;
  let staffSpy: SpyObj<StaffService>;

  beforeEach(async () => {
    collectionSheetSpy = createSpyObj<CollectionSheetService>(['postCollectionsheet']);
    officesSpy = createSpyObj<OfficesService>(['getOffices']);
    staffSpy = createSpyObj<StaffService>(['getStaff']);

    officesSpy.getOffices.mockReturnValue(
      of([{ id: 1, name: 'Head Office' }]) as unknown as ReturnType<OfficesService['getOffices']>,
    );
    staffSpy.getStaff.mockReturnValue(
      of([{ id: 4, displayName: 'Cashier, E2E' }]) as unknown as ReturnType<
        StaffService['getStaff']
      >,
    );

    await TestBed.configureTestingModule({
      imports: [CollectionSheetComponent],
      providers: [
        provideIonicTesting(),
        provideNoopAnimations(),
        ...provideTranslateTesting(),
        { provide: CollectionSheetService, useValue: collectionSheetSpy },
        { provide: OfficesService, useValue: officesSpy },
        { provide: StaffService, useValue: staffSpy },
        {
          provide: NotificationService,
          useValue: createSpyObj<NotificationService>(['success', 'error']),
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CollectionSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  /**
   * The staff field used to be `<ion-input type="number">`, so the operator had to know a staff
   * member's database id. Fineract scopes staff by office, which is why the list only loads once
   * an office is chosen.
   */
  describe('the staff picker', () => {
    it('loads the chosen office staff', () => {
      component.onOfficeChange(1);

      expect(staffSpy.getStaff).toHaveBeenCalledWith(1);
      expect(component.staff()).toEqual([{ id: 4, displayName: 'Cashier, E2E' }]);
    });

    it('clears a selection made against a different office', () => {
      component.onOfficeChange(1);
      component.staffId = 4;

      component.onOfficeChange(2);

      expect(component.staffId).toBeNull();
    });

    it('asks for nothing when the office is cleared', () => {
      component.onOfficeChange(undefined);

      expect(staffSpy.getStaff).not.toHaveBeenCalled();
      expect(component.staff()).toEqual([]);
    });
  });

  /**
   * `staffId` is a field of its own rather than part of `request`, and `buildBody()` spread
   * `request` alone — so whatever the operator chose was collected and then dropped.
   */
  describe('the generate request', () => {
    function generateAndReadBody(): Record<string, unknown> {
      collectionSheetSpy.postCollectionsheet.mockReturnValue(
        of({}) as unknown as ReturnType<CollectionSheetService['postCollectionsheet']>,
      );
      component.generate();
      return collectionSheetSpy.postCollectionsheet.mock.calls[0][0] as Record<string, unknown>;
    }

    it('carries the chosen staff member', () => {
      component.request.officeId = 1;
      component.staffId = 4;

      expect(generateAndReadBody()).toMatchObject({ officeId: 1, staffId: 4 });
    });

    it('omits staffId entirely when none was chosen', () => {
      component.request.officeId = 1;

      expect(generateAndReadBody()).not.toHaveProperty('staffId');
    });
  });

  /**
   * `command=generate` answers 200 with an empty body when nothing is due. The screen used to
   * render the literal text `null` under "Collection Results" and still offer Save.
   */
  describe('an empty sheet', () => {
    function generate(response: unknown): void {
      collectionSheetSpy.postCollectionsheet.mockReturnValue(
        of(response) as unknown as ReturnType<CollectionSheetService['postCollectionsheet']>,
      );
      component.request.officeId = 1;
      component.generate();
      fixture.detectChanges();
    }

    it('says so, and offers nothing to save', () => {
      generate(null);

      expect(component.hasSheet()).toBe(false);
      expect(
        fixture.nativeElement.querySelector('[data-testid="collection-sheet-empty"]'),
      ).not.toBeNull();
      expect(
        fixture.nativeElement.querySelector('[data-testid="collection-sheet-results"]'),
      ).toBeNull();
    });

    it('treats a body with no fields the same way', () => {
      generate({});

      expect(component.hasSheet()).toBe(false);
    });

    it('shows the sheet when there is one', () => {
      generate({ groups: [{ groupId: 7 }] });

      expect(component.hasSheet()).toBe(true);
      expect(
        fixture.nativeElement.querySelector('[data-testid="collection-sheet-results"]'),
      ).not.toBeNull();
      expect(
        fixture.nativeElement.querySelector('[data-testid="collection-sheet-empty"]'),
      ).toBeNull();
    });
  });
});
