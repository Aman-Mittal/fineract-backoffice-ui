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
import { HooksListComponent } from './hooks-list.component';
import { HooksService } from '../../../api';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { provideNoopAnimations } from '@angular/platform-browser/animations';

describe('HooksListComponent', () => {
  let component: HooksListComponent;
  let fixture: ComponentFixture<HooksListComponent>;
  let serviceSpy: jasmine.SpyObj<HooksService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    serviceSpy = jasmine.createSpyObj('HooksService', ['getHooks', 'deleteHooksHookId']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    serviceSpy.getHooks.and.returnValue(
      of([{ id: 1, name: 'Web', displayName: 'My Hook', isActive: true }]) as unknown as ReturnType<
        HooksService['getHooks']
      >,
    );

    await TestBed.configureTestingModule({
      imports: [HooksListComponent, TranslateModule.forRoot()],
      providers: [
        { provide: HooksService, useValue: serviceSpy },
        { provide: Router, useValue: routerSpy },
        provideNoopAnimations(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HooksListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should load hooks on init', () => {
    expect(component).toBeTruthy();
    expect(serviceSpy.getHooks).toHaveBeenCalled();
    expect(component.hooks.length).toBe(1);
  });

  it('should navigate to edit with the hook id', () => {
    component.onEdit({ id: 3, name: 'X' });
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/system/hooks/edit', 3]);
  });

  it('should delete after confirmation and reload', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    serviceSpy.deleteHooksHookId.and.returnValue(
      of({}) as unknown as ReturnType<HooksService['deleteHooksHookId']>,
    );

    component.onDelete({ id: 5, name: 'Y' });

    expect(serviceSpy.deleteHooksHookId).toHaveBeenCalledWith(5);
    expect(serviceSpy.getHooks).toHaveBeenCalledTimes(2);
  });

  it('should not delete when cancelled', () => {
    spyOn(window, 'confirm').and.returnValue(false);
    component.onDelete({ id: 5, name: 'Y' });
    expect(serviceSpy.deleteHooksHookId).not.toHaveBeenCalled();
  });
});
