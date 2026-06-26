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
import { EntityMappingListComponent } from './entity-mapping-list.component';
import { FineractEntityService } from '../../../api';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { provideNoopAnimations } from '@angular/platform-browser/animations';

describe('EntityMappingListComponent', () => {
  let component: EntityMappingListComponent;
  let fixture: ComponentFixture<EntityMappingListComponent>;
  let serviceSpy: jasmine.SpyObj<FineractEntityService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    serviceSpy = jasmine.createSpyObj('FineractEntityService', [
      'getEntitytoentitymapping',
      'deleteEntitytoentitymappingMapId',
    ]);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    serviceSpy.getEntitytoentitymapping.and.returnValue(
      of(JSON.stringify([{ id: 1, fromId: 10, toId: 20 }])) as unknown as ReturnType<
        FineractEntityService['getEntitytoentitymapping']
      >,
    );

    await TestBed.configureTestingModule({
      imports: [EntityMappingListComponent, TranslateModule.forRoot()],
      providers: [
        { provide: FineractEntityService, useValue: serviceSpy },
        { provide: Router, useValue: routerSpy },
        provideNoopAnimations(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EntityMappingListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should parse and load mappings on init', () => {
    expect(component).toBeTruthy();
    expect(serviceSpy.getEntitytoentitymapping).toHaveBeenCalled();
    expect(component.mappings.length).toBe(1);
    expect(component.mappings[0].fromId).toBe(10);
  });

  it('should navigate to edit with the mapping id', () => {
    component.onEdit({ id: 3 });
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/system/entity-mapping/edit', 3]);
  });

  it('should delete after confirmation and reload', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    serviceSpy.deleteEntitytoentitymappingMapId.and.returnValue(
      of('{}') as unknown as ReturnType<FineractEntityService['deleteEntitytoentitymappingMapId']>,
    );

    component.onDelete({ id: 5 });

    expect(serviceSpy.deleteEntitytoentitymappingMapId).toHaveBeenCalledWith(5);
    expect(serviceSpy.getEntitytoentitymapping).toHaveBeenCalledTimes(2);
  });

  it('should not delete when cancelled', () => {
    spyOn(window, 'confirm').and.returnValue(false);
    component.onDelete({ id: 5 });
    expect(serviceSpy.deleteEntitytoentitymappingMapId).not.toHaveBeenCalled();
  });
});
