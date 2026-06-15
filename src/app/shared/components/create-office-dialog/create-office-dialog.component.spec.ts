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
import { CreateOfficeDialogComponent } from './create-office-dialog.component';
import { MatDialogRef } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { OfficesService, GetOfficesResponse, PostOfficesResponse } from '../../../api';
import { Observable, of, throwError } from 'rxjs';
import { HttpEvent } from '@angular/common/http';

describe('CreateOfficeDialogComponent', () => {
  let component: CreateOfficeDialogComponent;
  let fixture: ComponentFixture<CreateOfficeDialogComponent>;
  let mockDialogRef: jasmine.SpyObj<MatDialogRef<CreateOfficeDialogComponent>>;
  let mockOfficesService: jasmine.SpyObj<OfficesService>;

  beforeEach(async () => {
    mockDialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);
    mockOfficesService = jasmine.createSpyObj('OfficesService', ['getOffices', 'postOffices']);

    mockOfficesService.getOffices.and.returnValue(
      of([{ id: 1, name: 'Head Office' }] as GetOfficesResponse[]) as unknown as Observable<
        HttpEvent<GetOfficesResponse[]>
      >,
    );
    mockOfficesService.postOffices.and.returnValue(
      of({ resourceId: 10, officeId: 10 } as PostOfficesResponse) as unknown as Observable<
        HttpEvent<PostOfficesResponse>
      >,
    );

    await TestBed.configureTestingModule({
      imports: [CreateOfficeDialogComponent, TranslateModule.forRoot()],
      providers: [
        provideNoopAnimations(),
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: OfficesService, useValue: mockOfficesService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateOfficeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(mockOfficesService.getOffices).toHaveBeenCalledWith(true);
    expect(component.offices.length).toBe(1);
  });

  it('should close dialog on cancel', () => {
    component.onCancel();
    expect(mockDialogRef.close).toHaveBeenCalled();
  });

  it('should submit office data and close dialog with resourceId', () => {
    component.office.name = 'Test Office';
    component.openingDate = new Date(2026, 0, 15); // Month is 0-indexed in JS Date

    component.onSubmit();

    expect(component.isSaving).toBe(true);
    expect(mockOfficesService.postOffices).toHaveBeenCalled();
    const args = mockOfficesService.postOffices.calls.mostRecent().args[0];
    expect(args.name).toBe('Test Office');
    expect(args.openingDate).toBe('2026-01-15');

    expect(mockDialogRef.close).toHaveBeenCalledWith(10);
  });

  it('should reset isSaving to false on error during submit', () => {
    mockOfficesService.postOffices.and.returnValue(throwError(() => new Error('Error')));

    component.onSubmit();

    expect(component.isSaving).toBe(false);
    expect(mockDialogRef.close).not.toHaveBeenCalled();
  });
});
