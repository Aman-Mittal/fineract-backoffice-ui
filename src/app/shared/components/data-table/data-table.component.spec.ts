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
import { DataTableComponent, ColumnDef } from './data-table.component';
import { TranslateModule } from '@ngx-translate/core';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { Component, ViewChild } from '@angular/core';

interface TestData {
  id: number;
  name: string;
  status: { value: string; code: string };
}

@Component({
  template: `
    <app-data-table
      [title]="'Test Table'"
      [columns]="columns"
      [data]="data"
      [localLogic]="true"
      [showSearch]="true"
      (create)="onCreate()"
      (searchChange)="onSearch($event)"
    >
    </app-data-table>
  `,
  imports: [DataTableComponent],
  providers: [provideNoopAnimations()],
  standalone: true,
})
class TestHostComponent {
  @ViewChild(DataTableComponent) dataTable!: DataTableComponent<TestData>;

  columns: ColumnDef[] = [
    { key: 'id', label: 'ID', sortable: true },
    { key: 'name', label: 'Name', sortable: true },
    { key: 'status', label: 'Status', sortable: false },
  ];

  data: TestData[] = [
    { id: 1, name: 'Alice', status: { value: 'Active', code: 'active' } },
    { id: 2, name: 'Bob', status: { value: 'Inactive', code: 'inactive' } },
  ];

  onCreate() {
    console.log('onCreate');
  }
  onSearch(val: string) {
    console.log('onSearch', val);
  }
}

describe('DataTableComponent', () => {
  let component: TestHostComponent;
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        TestHostComponent,
        TranslateModule.forRoot(),
        MatPaginatorModule,
        MatSortModule,
        MatTableModule,
      ],
      providers: [provideNoopAnimations()],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component.dataTable).toBeTruthy();
  });

  it('should set data correctly', () => {
    expect(component.dataTable.dataSource.data.length).toBe(2);
    expect(component.dataTable.dataSource.data[0].name).toBe('Alice');
  });

  it('should correctly resolve nested cell values', () => {
    const val = component.dataTable.getCellValue(component.data[0], 'status');
    expect(val).toBe('Active');
  });

  it('should resolve nested values using dot notation', () => {
    const nestedData = {
      user: {
        profile: {
          name: 'John Doe',
        },
      },
    };
    const val = component.dataTable.getCellValue(
      nestedData as unknown as Record<string, unknown> as never,
      'user.profile.name',
    );
    expect(val).toBe('John Doe');
  });

  it('should filter data locally when localLogic is true', () => {
    component.dataTable.onSearch('Alice');
    expect(component.dataTable.dataSource.filter).toBe('alice');
    expect(component.dataTable.dataSource.filteredData.length).toBe(1);
    expect(component.dataTable.dataSource.filteredData[0].name).toBe('Alice');
  });

  it('should emit create event', () => {
    spyOn(component.dataTable.create, 'emit');
    component.dataTable.onCreate();
    expect(component.dataTable.create.emit).toHaveBeenCalled();
  });

  it('should emit searchChange event', () => {
    spyOn(component.dataTable.searchChange, 'emit');
    component.dataTable.onSearch('test');
    expect(component.dataTable.searchChange.emit).toHaveBeenCalledWith('test');
  });
});
