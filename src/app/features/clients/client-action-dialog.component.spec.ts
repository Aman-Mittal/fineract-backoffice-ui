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
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { of, Observable } from 'rxjs';
import {
  ClientActionDialogComponent,
  ClientActionDialogData,
} from './client-action-dialog.component';
import { CodesService, CodeValuesService } from '../../api';

describe('ClientActionDialogComponent', () => {
  let component: ClientActionDialogComponent;
  let fixture: ComponentFixture<ClientActionDialogComponent>;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<ClientActionDialogComponent>>;
  let codesServiceSpy: jasmine.SpyObj<CodesService>;
  let codeValuesServiceSpy: jasmine.SpyObj<CodeValuesService>;

  const defaultDialogData: ClientActionDialogData = {
    title: 'Activate Client',
    command: 'activate',
    clientId: 1,
  };

  const setupTestBed = (data: ClientActionDialogData) => {
    dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);
    codesServiceSpy = jasmine.createSpyObj('CodesService', ['getCodesNameCodeName']);
    codeValuesServiceSpy = jasmine.createSpyObj('CodeValuesService', ['getCodesCodeIdCodevalues']);

    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), NoopAnimationsModule, ClientActionDialogComponent],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefSpy },
        { provide: MAT_DIALOG_DATA, useValue: data },
        { provide: CodesService, useValue: codesServiceSpy },
        { provide: CodeValuesService, useValue: codeValuesServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ClientActionDialogComponent);
    component = fixture.componentInstance;
  };

  describe('with Activate command', () => {
    beforeEach(() => {
      setupTestBed(defaultDialogData);
      fixture.detectChanges();
    });

    it('should create and configure simple layout without reason', () => {
      expect(component).toBeTruthy();
      expect(component.dateLabel).toBe('ACTIONS.ACTIVATION_DATE');
      expect(component.showReasonDropdown).toBeFalse();
      expect(component.isValid).toBeTrue();
    });

    it('should close dialog with data on confirmation', () => {
      component.onConfirm();
      expect(dialogRefSpy.close).toHaveBeenCalledWith({
        actionDate: jasmine.any(Date),
        reasonId: undefined,
        note: '',
      });
    });

    it('should close dialog without data on cancel', () => {
      component.onCancel();
      expect(dialogRefSpy.close).toHaveBeenCalledWith();
    });

    it('should be invalid if actionDate is null/falsy', () => {
      component.actionDate = null as unknown as Date;
      expect(component.isValid).toBeFalse();
    });
  });

  describe('with Reject command (requiring reasons)', () => {
    const rejectData: ClientActionDialogData = {
      title: 'Reject Client',
      command: 'reject',
      clientId: 1,
    };

    beforeEach(() => {
      setupTestBed(rejectData);
      codesServiceSpy.getCodesNameCodeName.and.returnValue(
        of({ id: 10, name: 'ClientRejectReason' }) as unknown as Observable<never>,
      );
      codeValuesServiceSpy.getCodesCodeIdCodevalues.and.returnValue(
        of([
          { id: 101, name: 'Duplicate Client' },
          { id: 102, name: 'Other' },
        ]) as unknown as Observable<never>,
      );
      fixture.detectChanges();
    });

    it('should fetch and populate reject reason options', () => {
      expect(codesServiceSpy.getCodesNameCodeName).toHaveBeenCalledWith('ClientRejectReason');
      expect(codeValuesServiceSpy.getCodesCodeIdCodevalues).toHaveBeenCalledWith(10);
      expect(component.reasonOptions.length).toBe(2);
      expect(component.showReasonDropdown).toBeTrue();
      expect(component.reasonLabel).toBe('ACTIONS.REJECTION_REASON');
    });

    it('should be invalid initially because reasonId is not set', () => {
      expect(component.isValid).toBeFalse();
    });

    it('should become valid when reasonId is set', () => {
      component.reasonId = 101;
      expect(component.isValid).toBeTrue();
    });

    it('should pass reasonId and note to close event on confirm', () => {
      component.reasonId = 101;
      component.note = 'Rejecting due to duplicates';
      component.onConfirm();
      expect(dialogRefSpy.close).toHaveBeenCalledWith({
        actionDate: jasmine.any(Date),
        reasonId: 101,
        note: 'Rejecting due to duplicates',
      });
    });
  });
});
