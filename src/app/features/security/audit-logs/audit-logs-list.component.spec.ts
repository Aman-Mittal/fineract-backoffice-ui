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
import { AuditLogsListComponent } from './audit-logs-list.component';
import { AuditsService } from '../../../api';
import { MatDialog } from '@angular/material/dialog';
import { of, Observable } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';

describe('AuditLogsListComponent', () => {
  let component: AuditLogsListComponent;
  let fixture: ComponentFixture<AuditLogsListComponent>;
  let auditsServiceSpy: jasmine.SpyObj<AuditsService>;
  let dialogSpy: jasmine.SpyObj<MatDialog>;

  const MOCK_PAYLOAD = '{"key":"value"}';

  beforeEach(async () => {
    auditsServiceSpy = jasmine.createSpyObj('AuditsService', ['getAudits']);
    dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);

    const mockResponse = {
      pageItems: [
        {
          id: 1,
          resourceId: 10,
          entityName: 'Client',
          actionName: 'CREATE',
          maker: 'mifos',
          madeOnDate: '2026-06-16T12:00:00Z',
          checker: 'mifos',
          checkedOnDate: '2026-06-16T12:05:00Z',
          processingResult: 'success',
          commandAsJson: MOCK_PAYLOAD,
        },
      ],
      totalFilteredRecords: 1,
      totalRecords: 1,
    };
    auditsServiceSpy.getAudits.and.returnValue(of(mockResponse) as unknown as Observable<never>);

    await TestBed.configureTestingModule({
      imports: [AuditLogsListComponent, TranslateModule.forRoot()],
      providers: [
        { provide: AuditsService, useValue: auditsServiceSpy },
        { provide: MatDialog, useValue: dialogSpy },
        provideNoopAnimations(),
      ],
    })
      .overrideComponent(AuditLogsListComponent, {
        add: {
          providers: [{ provide: MatDialog, useValue: dialogSpy }],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(AuditLogsListComponent);
    component = fixture.componentInstance;
  });

  it('should create and load audit logs on init', () => {
    fixture.detectChanges();

    expect(component).toBeTruthy();
    expect(auditsServiceSpy.getAudits).toHaveBeenCalled();
    expect(component.auditLogs().length).toBe(1);
    expect(component.auditLogs()[0]['entityName']).toBe('Client');
  });

  it('should handle apply and reset filters', () => {
    fixture.detectChanges();

    component.activeFilters.actionName = 'CREATE';
    component.onApplyFilters();
    expect(component.pageIndex()).toBe(0);

    component.onResetFilters();
    expect(component.activeFilters.actionName).toBe('');
  });

  it('should handle pagination changes', () => {
    fixture.detectChanges();

    const pageEvent: PageEvent = { pageIndex: 2, pageSize: 20, length: 100 } as PageEvent;
    component.onPage(pageEvent);

    expect(component.pageIndex()).toBe(2);
    expect(component.pageSize()).toBe(20);
  });

  it('should handle sorting changes', () => {
    fixture.detectChanges();

    const sortEvent: Sort = { active: 'entityName', direction: 'asc' };
    component.onSort(sortEvent);

    expect(component.pageIndex()).toBe(0);
  });

  it('should open details dialog', () => {
    fixture.detectChanges();

    const mockRow = {
      id: 1,
      commandAsJson: MOCK_PAYLOAD,
    };
    component.onViewDetails(mockRow);

    expect(dialogSpy.open).toHaveBeenCalledWith(
      jasmine.any(Function),
      jasmine.objectContaining({
        width: '600px',
        data: { payload: MOCK_PAYLOAD },
      }),
    );
  });
});
