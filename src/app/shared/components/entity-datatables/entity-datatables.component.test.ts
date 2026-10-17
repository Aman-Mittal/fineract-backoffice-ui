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

import type { Mock } from 'vitest';
import { createSpyObj, SpyObj } from '../../../testing/mocks';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DialogService } from '../../../core/services/dialog.service';
import { provideIonicTesting } from '../../../testing/ionic-testing';
import { of, throwError, Observable, Subject } from 'rxjs';
import { EntityDatatablesComponent } from './entity-datatables.component';
import { DatatableEntryDialogComponent } from '../datatable-entry-dialog/datatable-entry-dialog.component';
import { DataTablesService, GetDataTablesResponse } from '../../../api';
import { provideTranslateTesting } from '../../../testing/i18n-testing';
import { AuthService, UserSession } from '../../../core/services/auth.service';
import { permissionsSatisfy } from '../../../core/utils/permission-matcher';
import { signal, WritableSignal } from '@angular/core';

describe('EntityDatatablesComponent', () => {
  let component: EntityDatatablesComponent;
  let fixture: ComponentFixture<EntityDatatablesComponent>;
  let datatablesServiceSpy: SpyObj<DataTablesService>;
  let dialogServiceSpy: SpyObj<DialogService>;
  let dialogSpy: Mock;

  /**
   * A session holding exactly `permissions`.
   *
   * Datatable codes are generated per table — `READ_m_client_details` and the three write verbs
   * — and the component asks `AuthService` for them by that exact spelling. A default
   * `ALL_FUNCTIONS` user keeps the pre-existing expectations describing an administrator.
   */
  function session(permissions: string[]): UserSession {
    return {
      username: 'tester',
      base64EncodedAuthenticationKey: 'key',
      authenticated: true,
      officeId: 1,
      officeName: 'Head Office',
      userId: 1,
      permissions,
    };
  }

  /**
   * The session signal the fake AuthService reads, so a test can change the held permissions
   * between renders.
   */
  let currentUser: WritableSignal<UserSession | null>;

  function grant(permissions: string[]): void {
    currentUser.set(session(permissions));
  }

  const mockDatatables: GetDataTablesResponse[] = [
    {
      registeredTableName: 'm_client_details',
      columnHeaderData: [
        // Real Fineract API responses mark the entity's own FK column (here
        // "client_id", not "id") as the primary key — that's what the
        // getColumnDefs/dialog column filtering keys off of.
        { columnName: 'client_id', isColumnPrimaryKey: true },
        { columnName: 'business_type' },
        { columnName: 'revenue' },
      ],
    },
    {
      registeredTableName: 'm_client_more_details',
      columnHeaderData: [
        { columnName: 'client_id', isColumnPrimaryKey: true },
        { columnName: 'notes' },
      ],
    },
  ];

  const mockTableDataResultSet = {
    columnHeaders: [{ columnName: 'business_type' }, { columnName: 'revenue' }],
    data: [
      ['Retail', 100_000],
      ['Corporate', 500_000],
    ],
  };

  beforeEach(async () => {
    currentUser = signal<UserSession | null>(session(['ALL_FUNCTIONS']));
    datatablesServiceSpy = createSpyObj([
      'getDatatables',
      'getDatatablesDatatableApptableId',
      'deleteDatatablesDatatableApptableId',
      'deleteDatatablesDatatableApptableIdDatatableId',
    ]);
    dialogServiceSpy = createSpyObj<DialogService>(['open', 'confirm']);
    dialogServiceSpy.open.mockResolvedValue(undefined);

    await TestBed.configureTestingModule({
      imports: [EntityDatatablesComponent],
      providers: [
        ...provideTranslateTesting(),
        provideIonicTesting(),
        { provide: DataTablesService, useValue: datatablesServiceSpy },
        { provide: DialogService, useValue: dialogServiceSpy },
        {
          provide: AuthService,
          useValue: {
            currentUser,
            // Delegates to the same matcher the real service does, so the two platform
            // shortcuts — ALL_FUNCTIONS, and ALL_FUNCTIONS_READ for a read-only request — behave
            // here as they do in production.
            hasPermission: (required: string | string[], matchAll = false) =>
              permissionsSatisfy(currentUser()?.permissions ?? [], required, matchAll),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EntityDatatablesComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('apptableName', 'client');
    fixture.componentRef.setInput('entityId', 123);

    dialogSpy = dialogServiceSpy.open;
  });

  it('selects the first named table so the rendered panel always has a selected tab', () => {
    datatablesServiceSpy.getDatatables.mockReturnValue(
      of([{ applicationTableName: 'm_client' }, ...mockDatatables]) as unknown as Observable<never>,
    );
    datatablesServiceSpy.getDatatablesDatatableApptableId.mockReturnValue(
      of(mockTableDataResultSet) as unknown as Observable<never>,
    );

    fixture.detectChanges();

    expect(component.activeTable()).toEqual(mockDatatables[0]);
    const selected = fixture.nativeElement.querySelector('[role=tab][aria-selected=true]');
    const panel = fixture.nativeElement.querySelector('[role=tabpanel]');
    expect(selected?.textContent?.trim()).toBe('m_client_details');
    expect(panel.getAttribute('aria-labelledby')).toBe(selected.id);
    expect(selected.getAttribute('aria-controls')).toBe(panel.id);
  });

  it('ignores a slow response once a later tab change has superseded it', () => {
    // Nothing cancels the in-flight request, so switching away and back leaves two running.
    // Whichever finishes last used to win, regardless of which tab is actually selected.
    const first = new Subject<unknown>();
    const second = new Subject<unknown>();
    datatablesServiceSpy.getDatatables.mockReturnValue(
      of(mockDatatables) as unknown as Observable<never>,
    );
    datatablesServiceSpy.getDatatablesDatatableApptableId
      .mockReturnValueOnce(of([{ business_type: 'Retail' }]) as unknown as Observable<never>)
      .mockReturnValueOnce(first as unknown as Observable<never>)
      .mockReturnValueOnce(second as unknown as Observable<never>);
    fixture.detectChanges();

    component.onTabChange('m_client_more_details');
    component.onTabChange('m_client_details');

    // The second tab's response lands late, after the selection moved back to the first.
    first.next([{ notes: 'from the superseded tab' }]);
    first.complete();
    expect(component.tableData()).toEqual([]);
    expect(component.isTableLoading()).toBe(true);

    second.next([{ business_type: 'Wholesale' }]);
    second.complete();
    expect(component.tableData()).toEqual([{ business_type: 'Wholesale' }]);
    expect(component.isTableLoading()).toBe(false);
  });

  it('drops the previous rows as the request goes out, so none render under the new columns', () => {
    const pending = new Subject<unknown>();
    datatablesServiceSpy.getDatatables.mockReturnValue(
      of(mockDatatables) as unknown as Observable<never>,
    );
    datatablesServiceSpy.getDatatablesDatatableApptableId
      .mockReturnValueOnce(of([{ business_type: 'Retail' }]) as unknown as Observable<never>)
      .mockReturnValueOnce(pending as unknown as Observable<never>);
    fixture.detectChanges();
    expect(component.tableData()).toEqual([{ business_type: 'Retail' }]);

    component.onTabChange('m_client_more_details');

    expect(component.tableData()).toEqual([]);
    pending.next([{ notes: 'loaded' }]);
    pending.complete();
    expect(component.tableData()).toEqual([{ notes: 'loaded' }]);
  });

  it('should create and load datatables on init', () => {
    datatablesServiceSpy.getDatatables.mockReturnValue(
      of(mockDatatables) as unknown as Observable<never>,
    );
    datatablesServiceSpy.getDatatablesDatatableApptableId.mockReturnValue(
      of(mockTableDataResultSet) as unknown as Observable<never>,
    );

    fixture.detectChanges();

    expect(component).toBeTruthy();
    expect(datatablesServiceSpy.getDatatables).toHaveBeenCalledWith('client');
    expect(component.datatables()).toEqual(mockDatatables);
    expect(component.activeTable()).toEqual(mockDatatables[0]);

    expect(datatablesServiceSpy.getDatatablesDatatableApptableId).toHaveBeenCalledWith(
      'm_client_details',
      123,
    );
    expect(component.tableData()).toEqual([
      { business_type: 'Retail', revenue: 100_000 },
      { business_type: 'Corporate', revenue: 500_000 },
    ]);
  });

  it('should handle empty datatables on load', () => {
    datatablesServiceSpy.getDatatables.mockReturnValue(of([]) as unknown as Observable<never>);

    fixture.detectChanges();

    expect(component.datatables()).toHaveLength(0);
    expect(datatablesServiceSpy.getDatatablesDatatableApptableId).not.toHaveBeenCalled();
  });

  it('should handle error when loading datatables', () => {
    vi.spyOn(console, 'error');
    datatablesServiceSpy.getDatatables.mockReturnValue(
      throwError(() => new Error('API Error')) as unknown as Observable<never>,
    );

    fixture.detectChanges();

    expect(component.isLoading()).toBe(false);
    expect(console.error).toHaveBeenCalled();
  });

  it('should handle table data response as string', () => {
    datatablesServiceSpy.getDatatables.mockReturnValue(
      of(mockDatatables) as unknown as Observable<never>,
    );
    datatablesServiceSpy.getDatatablesDatatableApptableId.mockReturnValue(
      of(JSON.stringify(mockTableDataResultSet)) as unknown as Observable<never>,
    );

    fixture.detectChanges();

    expect(component.tableData()).toHaveLength(2);
  });

  it('should handle error when loading table data', () => {
    vi.spyOn(console, 'error');
    datatablesServiceSpy.getDatatables.mockReturnValue(
      of(mockDatatables) as unknown as Observable<never>,
    );
    datatablesServiceSpy.getDatatablesDatatableApptableId.mockReturnValue(
      throwError(() => new Error('Data Error')) as unknown as Observable<never>,
    );

    fixture.detectChanges();

    expect(component.isTableLoading()).toBe(false);
    expect(console.error).toHaveBeenCalled();
  });

  it('should fetch new table data on tab change', () => {
    datatablesServiceSpy.getDatatables.mockReturnValue(
      of(mockDatatables) as unknown as Observable<never>,
    );
    datatablesServiceSpy.getDatatablesDatatableApptableId.mockReturnValue(
      of(mockTableDataResultSet) as unknown as Observable<never>,
    );

    fixture.detectChanges();

    // Trigger tab change to second tab
    const secondTab = fixture.nativeElement.querySelectorAll('[role=tab]')[1] as HTMLButtonElement;
    secondTab.click();
    fixture.detectChanges();
    expect(secondTab.getAttribute('aria-selected')).toBe('true');
    const panel = fixture.nativeElement.querySelector('[role=tabpanel]') as HTMLElement;
    expect(panel.getAttribute('aria-labelledby')).toBe(secondTab.id);
    expect(secondTab.getAttribute('aria-controls')).toBe(panel.id);

    expect(component.activeTable()).toEqual(mockDatatables[1]);
    expect(datatablesServiceSpy.getDatatablesDatatableApptableId).toHaveBeenCalledWith(
      'm_client_more_details',
      123,
    );
  });

  it('should format column defs and filter out standard ID columns', () => {
    const colDefs = component.getColumnDefs(mockDatatables[0]);
    // The data columns, plus the actions column an administrator gets.
    expect(colDefs.map((col) => col.key)).toEqual(['business_type', 'revenue', '__actions']);
  });

  /**
   * Datatable permissions are generated per table — `READ_<table>` and the three write verbs —
   * and the platform checks the exact code, with `ALL_FUNCTIONS_READ` passing reads only. The
   * tab list is filtered by the read code because a table the user cannot read has no rows to
   * show; the write controls are disabled rather than removed, and name the missing code.
   */
  describe('per-table permissions', () => {
    function render(): void {
      datatablesServiceSpy.getDatatables.mockReturnValue(
        of(mockDatatables) as unknown as ReturnType<DataTablesService['getDatatables']>,
      );
      datatablesServiceSpy.getDatatablesDatatableApptableId.mockReturnValue(
        of([]) as unknown as ReturnType<DataTablesService['getDatatablesDatatableApptableId']>,
      );
      component.loadDatatables();
    }

    it('offers only the tables the user can read', () => {
      grant(['READ_m_client_more_details']);
      render();

      expect(component.tableTabs().map((tab) => tab.value)).toEqual(['m_client_more_details']);
      // And it selects one it can read, rather than fetching rows for a table that would 403.
      expect(component.activeTable()?.registeredTableName).toBe('m_client_more_details');
      expect(datatablesServiceSpy.getDatatablesDatatableApptableId).toHaveBeenCalledWith(
        'm_client_more_details',
        123,
      );
    });

    it('shows every table to a read-only superuser, and lets them write to none', () => {
      grant(['ALL_FUNCTIONS_READ']);
      render();

      expect(component.tableTabs()).toHaveLength(2);
      expect(component.canRead(mockDatatables[0])).toBe(true);
      expect(component.canWrite(mockDatatables[0], 'CREATE')).toBe(false);
      expect(component.canWrite(mockDatatables[0], 'UPDATE')).toBe(false);
      expect(component.canWrite(mockDatatables[0], 'DELETE')).toBe(false);
      // Nothing to act on, so no column for the actions.
      expect(component.getColumnDefs(mockDatatables[0])).toHaveLength(2);
    });

    it('offers no tab at all where the user can read none of them', () => {
      grant(['READ_CLIENT']);
      render();

      expect(component.tableTabs()).toHaveLength(0);
      expect(datatablesServiceSpy.getDatatablesDatatableApptableId).not.toHaveBeenCalled();
    });

    it('names the code generated for each action on the table', () => {
      expect(component.permissionCode(mockDatatables[0], 'READ')).toBe('READ_m_client_details');
      expect(component.permissionCode(mockDatatables[0], 'DELETE')).toBe('DELETE_m_client_details');
    });

    it('offers the actions column to a user who holds either write code', () => {
      grant(['READ_m_client_details', 'DELETE_m_client_details']);

      expect(component.canWrite(mockDatatables[0], 'UPDATE')).toBe(false);
      expect(component.canWrite(mockDatatables[0], 'DELETE')).toBe(true);
      expect(component.getColumnDefs(mockDatatables[0])).toHaveLength(3);
    });
  });

  /**
   * The listing carries no `multiRow` flag, so the shape is the discriminator: a multi-row
   * table's primary key is its own `id`, while a single-row table's primary key is the entity's
   * FK. It decides whether a row is addressed by id or by entity.
   */
  describe('one row per entity, or many', () => {
    const multiRow: GetDataTablesResponse = {
      registeredTableName: 'm_client_notes',
      columnHeaderData: [
        { columnName: 'id', isColumnPrimaryKey: true },
        { columnName: 'client_id' },
        { columnName: 'note' },
      ],
    };

    it('reads the table shape rather than a flag', () => {
      expect(component.isMultiRow(multiRow)).toBe(true);
      expect(component.isMultiRow(mockDatatables[0])).toBe(false);
    });

    it('opens an edit with the row and its id for a multi-row table', async () => {
      dialogSpy.mockResolvedValue(false);

      await component.onEditEntry(multiRow, { id: 7, note: 'hello' });

      expect(dialogSpy).toHaveBeenCalledWith(
        DatatableEntryDialogComponent,
        expect.objectContaining({
          data: expect.objectContaining({ rowId: 7, row: { id: 7, note: 'hello' } }),
        }),
      );
    });

    it('opens an edit with no row id for a single-row table', async () => {
      dialogSpy.mockResolvedValue(false);

      await component.onEditEntry(mockDatatables[0], { client_id: 123, revenue: 10 });

      expect(dialogSpy).toHaveBeenCalledWith(
        DatatableEntryDialogComponent,
        expect.objectContaining({ data: expect.objectContaining({ rowId: undefined }) }),
      );
    });

    it('deletes one row of a multi-row table by its id', async () => {
      dialogServiceSpy.confirm.mockResolvedValue(true);
      datatablesServiceSpy.deleteDatatablesDatatableApptableIdDatatableId.mockReturnValue(
        of({}) as unknown as ReturnType<
          DataTablesService['deleteDatatablesDatatableApptableIdDatatableId']
        >,
      );
      datatablesServiceSpy.getDatatablesDatatableApptableId.mockReturnValue(
        of([]) as unknown as ReturnType<DataTablesService['getDatatablesDatatableApptableId']>,
      );

      await component.onDeleteEntry(multiRow, { id: 7 });

      expect(
        datatablesServiceSpy.deleteDatatablesDatatableApptableIdDatatableId,
      ).toHaveBeenCalledWith('m_client_notes', 123, 7);
    });

    it('deletes the single row of a one-row table by entity', async () => {
      dialogServiceSpy.confirm.mockResolvedValue(true);
      datatablesServiceSpy.deleteDatatablesDatatableApptableId.mockReturnValue(
        of({}) as unknown as ReturnType<DataTablesService['deleteDatatablesDatatableApptableId']>,
      );
      datatablesServiceSpy.getDatatablesDatatableApptableId.mockReturnValue(
        of([]) as unknown as ReturnType<DataTablesService['getDatatablesDatatableApptableId']>,
      );

      await component.onDeleteEntry(mockDatatables[0], { client_id: 123 });

      expect(datatablesServiceSpy.deleteDatatablesDatatableApptableId).toHaveBeenCalledWith(
        'm_client_details',
        123,
      );
    });

    it('deletes nothing when the confirmation is declined', async () => {
      dialogServiceSpy.confirm.mockResolvedValue(false);

      await component.onDeleteEntry(multiRow, { id: 7 });

      expect(
        datatablesServiceSpy.deleteDatatablesDatatableApptableIdDatatableId,
      ).not.toHaveBeenCalled();
    });
  });

  it('should open the add-entry dialog with the table columns and entity id', async () => {
    dialogSpy.mockResolvedValue(false);

    await component.onAddEntry(mockDatatables[0]);

    expect(dialogSpy).toHaveBeenCalledWith(
      DatatableEntryDialogComponent,
      expect.objectContaining({
        data: {
          datatableName: 'm_client_details',
          apptableId: 123,
          columns: mockDatatables[0].columnHeaderData,
        },
      }),
    );
  });

  it('should reload table data after a saved add-entry dialog closes', async () => {
    datatablesServiceSpy.getDatatablesDatatableApptableId.mockReturnValue(
      of(mockTableDataResultSet) as unknown as Observable<never>,
    );
    dialogSpy.mockResolvedValue(true);

    await component.onAddEntry(mockDatatables[0]);

    expect(datatablesServiceSpy.getDatatablesDatatableApptableId).toHaveBeenCalledWith(
      'm_client_details',
      123,
    );
  });

  it('should not reload table data when the dialog is dismissed without saving', async () => {
    dialogSpy.mockResolvedValue(false);
    datatablesServiceSpy.getDatatablesDatatableApptableId.mockClear();

    await component.onAddEntry(mockDatatables[0]);

    expect(datatablesServiceSpy.getDatatablesDatatableApptableId).not.toHaveBeenCalled();
  });
});
