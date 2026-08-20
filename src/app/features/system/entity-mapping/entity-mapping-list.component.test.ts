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

import { createSpyObj, SpyObj } from '../../../testing/mocks';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EntityMappingListComponent } from './entity-mapping-list.component';
import { FineractEntityService } from '../../../api';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { provideTranslateTesting } from '../../../testing/i18n-testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { DialogService } from '../../../core/services/dialog.service';

describe('EntityMappingListComponent', () => {
  let component: EntityMappingListComponent;
  let fixture: ComponentFixture<EntityMappingListComponent>;
  let serviceSpy: SpyObj<FineractEntityService>;
  let routerSpy: SpyObj<Router>;
  let dialogService: SpyObj<DialogService>;

  beforeEach(async () => {
    serviceSpy = createSpyObj(['getEntitytoentitymapping', 'deleteEntitytoentitymappingMapId']);
    routerSpy = createSpyObj(['navigate']);
    dialogService = createSpyObj(['confirm']);
    dialogService.confirm.mockResolvedValue(true);
    serviceSpy.getEntitytoentitymapping.mockReturnValue(
      of(JSON.stringify([{ id: 1, fromId: 10, toId: 20 }])) as unknown as ReturnType<
        FineractEntityService['getEntitytoentitymapping']
      >,
    );

    await TestBed.configureTestingModule({
      imports: [EntityMappingListComponent],
      providers: [
        ...provideTranslateTesting(),
        { provide: FineractEntityService, useValue: serviceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: DialogService, useValue: dialogService },
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
    expect(component.mappings()).toHaveLength(1);
    expect(component.mappings()[0].fromId).toBe(10);
  });

  it('should navigate to edit with the mapping id', () => {
    component.onEdit({ id: 3 });
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/system/entity-mapping/edit', 3]);
  });

  it('should delete after confirmation and reload', async () => {
    serviceSpy.deleteEntitytoentitymappingMapId.mockReturnValue(
      of('{}') as unknown as ReturnType<FineractEntityService['deleteEntitytoentitymappingMapId']>,
    );

    component.onDelete({ id: 5 });

    await fixture.whenStable();

    expect(serviceSpy.deleteEntitytoentitymappingMapId).toHaveBeenCalledWith(5);
    expect(serviceSpy.getEntitytoentitymapping).toHaveBeenCalledTimes(2);
  });

  it('should not delete when cancelled', async () => {
    dialogService.confirm.mockResolvedValue(false);
    component.onDelete({ id: 5 });
    await fixture.whenStable();
    expect(serviceSpy.deleteEntitytoentitymappingMapId).not.toHaveBeenCalled();
  });
});
