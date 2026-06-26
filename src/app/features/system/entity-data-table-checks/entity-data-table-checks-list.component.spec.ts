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
import { EntityDataTableChecksListComponent } from './entity-data-table-checks-list.component';
import { EntityDataTableService } from '../../../api';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { provideNoopAnimations } from '@angular/platform-browser/animations';

describe('EntityDataTableChecksListComponent', () => {
  let component: EntityDataTableChecksListComponent;
  let fixture: ComponentFixture<EntityDataTableChecksListComponent>;
  let serviceSpy: jasmine.SpyObj<EntityDataTableService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    serviceSpy = jasmine.createSpyObj('EntityDataTableService', [
      'getEntityDatatableChecks',
      'deleteEntityDatatableChecksEntityDatatableCheckId',
    ]);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    serviceSpy.getEntityDatatableChecks.and.returnValue(
      of([{ id: 1, entity: 'm_client', datatableName: 'dt' }]) as unknown as ReturnType<
        EntityDataTableService['getEntityDatatableChecks']
      >,
    );

    await TestBed.configureTestingModule({
      imports: [EntityDataTableChecksListComponent, TranslateModule.forRoot()],
      providers: [
        { provide: EntityDataTableService, useValue: serviceSpy },
        { provide: Router, useValue: routerSpy },
        provideNoopAnimations(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EntityDataTableChecksListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should load checks on init', () => {
    expect(component).toBeTruthy();
    expect(serviceSpy.getEntityDatatableChecks).toHaveBeenCalled();
    expect(component.checks.length).toBe(1);
  });

  it('should navigate to create', () => {
    component.onCreate();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/system/entity-data-table-checks/create']);
  });

  it('should delete after confirmation and reload', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    serviceSpy.deleteEntityDatatableChecksEntityDatatableCheckId.and.returnValue(
      of({}) as unknown as ReturnType<
        EntityDataTableService['deleteEntityDatatableChecksEntityDatatableCheckId']
      >,
    );

    component.onDelete({ id: 5 });

    expect(serviceSpy.deleteEntityDatatableChecksEntityDatatableCheckId).toHaveBeenCalledWith(5);
    expect(serviceSpy.getEntityDatatableChecks).toHaveBeenCalledTimes(2);
  });

  it('should not delete when cancelled', () => {
    spyOn(window, 'confirm').and.returnValue(false);
    component.onDelete({ id: 5 });
    expect(serviceSpy.deleteEntityDatatableChecksEntityDatatableCheckId).not.toHaveBeenCalled();
  });
});
