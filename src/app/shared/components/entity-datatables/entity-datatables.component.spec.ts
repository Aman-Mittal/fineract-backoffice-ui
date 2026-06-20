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
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { of, throwError, Observable } from 'rxjs';
import { EntityDatatablesComponent } from './entity-datatables.component';
import { DataTablesService, GetDataTablesResponse } from '../../../api';

describe('EntityDatatablesComponent', () => {
  let component: EntityDatatablesComponent;
  let fixture: ComponentFixture<EntityDatatablesComponent>;
  let datatablesServiceSpy: jasmine.SpyObj<DataTablesService>;

  const mockDatatables: GetDataTablesResponse[] = [
    {
      registeredTableName: 'm_client_details',
      columnHeaderData: [
        { columnName: 'id' },
        { columnName: 'client_id' },
        { columnName: 'business_type' },
        { columnName: 'revenue' },
      ],
    },
    {
      registeredTableName: 'm_client_more_details',
      columnHeaderData: [
        { columnName: 'id' },
        { columnName: 'client_id' },
        { columnName: 'notes' },
      ],
    },
  ];

  const mockTableDataResultSet = {
    columnHeaders: [{ columnName: 'business_type' }, { columnName: 'revenue' }],
    data: [
      ['Retail', 100000],
      ['Corporate', 500000],
    ],
  };

  beforeEach(async () => {
    datatablesServiceSpy = jasmine.createSpyObj('DataTablesService', [
      'getDatatables',
      'getDatatablesDatatableApptableId',
    ]);

    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), NoopAnimationsModule, EntityDatatablesComponent],
      providers: [{ provide: DataTablesService, useValue: datatablesServiceSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(EntityDatatablesComponent);
    component = fixture.componentInstance;
    component.apptableName = 'client';
    component.entityId = 123;
  });

  it('should create and load datatables on init', () => {
    datatablesServiceSpy.getDatatables.and.returnValue(
      of(mockDatatables) as unknown as Observable<never>,
    );
    datatablesServiceSpy.getDatatablesDatatableApptableId.and.returnValue(
      of(mockTableDataResultSet) as unknown as Observable<never>,
    );

    fixture.detectChanges();

    expect(component).toBeTruthy();
    expect(datatablesServiceSpy.getDatatables).toHaveBeenCalledWith('client');
    expect(component.datatables()).toEqual(mockDatatables);
    expect(component.activeTable).toEqual(mockDatatables[0]);

    expect(datatablesServiceSpy.getDatatablesDatatableApptableId).toHaveBeenCalledWith(
      'm_client_details',
      123,
    );
    expect(component.tableData()).toEqual([
      { business_type: 'Retail', revenue: 100000 },
      { business_type: 'Corporate', revenue: 500000 },
    ]);
  });

  it('should handle empty datatables on load', () => {
    datatablesServiceSpy.getDatatables.and.returnValue(of([]) as unknown as Observable<never>);

    fixture.detectChanges();

    expect(component.datatables().length).toBe(0);
    expect(datatablesServiceSpy.getDatatablesDatatableApptableId).not.toHaveBeenCalled();
  });

  it('should handle error when loading datatables', () => {
    spyOn(console, 'error');
    datatablesServiceSpy.getDatatables.and.returnValue(
      throwError(() => new Error('API Error')) as unknown as Observable<never>,
    );

    fixture.detectChanges();

    expect(component.isLoading()).toBeFalse();
    expect(console.error).toHaveBeenCalled();
  });

  it('should handle table data response as string', () => {
    datatablesServiceSpy.getDatatables.and.returnValue(
      of(mockDatatables) as unknown as Observable<never>,
    );
    datatablesServiceSpy.getDatatablesDatatableApptableId.and.returnValue(
      of(JSON.stringify(mockTableDataResultSet)) as unknown as Observable<never>,
    );

    fixture.detectChanges();

    expect(component.tableData().length).toBe(2);
  });

  it('should handle error when loading table data', () => {
    spyOn(console, 'error');
    datatablesServiceSpy.getDatatables.and.returnValue(
      of(mockDatatables) as unknown as Observable<never>,
    );
    datatablesServiceSpy.getDatatablesDatatableApptableId.and.returnValue(
      throwError(() => new Error('Data Error')) as unknown as Observable<never>,
    );

    fixture.detectChanges();

    expect(component.isTableLoading()).toBeFalse();
    expect(console.error).toHaveBeenCalled();
  });

  it('should fetch new table data on tab change', () => {
    datatablesServiceSpy.getDatatables.and.returnValue(
      of(mockDatatables) as unknown as Observable<never>,
    );
    datatablesServiceSpy.getDatatablesDatatableApptableId.and.returnValue(
      of(mockTableDataResultSet) as unknown as Observable<never>,
    );

    fixture.detectChanges();

    // Trigger tab change to second tab
    component.onTabChange({ tab: { textLabel: 'm_client_more_details' } });

    expect(component.activeTable).toEqual(mockDatatables[1]);
    expect(datatablesServiceSpy.getDatatablesDatatableApptableId).toHaveBeenCalledWith(
      'm_client_more_details',
      123,
    );
  });

  it('should format column defs and filter out standard ID columns', () => {
    const colDefs = component.getColumnDefs(mockDatatables[0]);
    expect(colDefs.length).toBe(2);
    expect(colDefs[0].key).toBe('business_type');
    expect(colDefs[1].key).toBe('revenue');
  });

  it('should log add entry details', () => {
    spyOn(console, 'log');
    component.onAddEntry(mockDatatables[0]);
    expect(console.log).toHaveBeenCalledWith('Add entry to', 'm_client_details');
  });
});
