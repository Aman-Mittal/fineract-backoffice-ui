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
import { BulkImportComponent } from './bulk-import.component';
import {
  BulkImportService,
  ClientService,
  LoansService,
  SavingsAccountService,
  JournalEntriesService,
} from '../../../api';
import { of } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { provideNoopAnimations } from '@angular/platform-browser/animations';

describe('BulkImportComponent', () => {
  let component: BulkImportComponent;
  let fixture: ComponentFixture<BulkImportComponent>;
  let bulkImportServiceSpy: jasmine.SpyObj<BulkImportService>;

  beforeEach(async () => {
    bulkImportServiceSpy = jasmine.createSpyObj('BulkImportService', [
      'getImports',
      'getImportsDownloadOutputTemplate',
    ]);
    bulkImportServiceSpy.getImports.and.returnValue(
      of([]) as unknown as ReturnType<BulkImportService['getImports']>,
    );

    await TestBed.configureTestingModule({
      imports: [BulkImportComponent, TranslateModule.forRoot()],
      providers: [
        { provide: BulkImportService, useValue: bulkImportServiceSpy },
        { provide: ClientService, useValue: {} },
        { provide: LoansService, useValue: {} },
        { provide: SavingsAccountService, useValue: {} },
        { provide: JournalEntriesService, useValue: {} },
        provideNoopAnimations(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BulkImportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create and load import history on init', () => {
    expect(component).toBeTruthy();
    expect(bulkImportServiceSpy.getImports).toHaveBeenCalled();
  });

  it('should download a result by coercing the id to a number', () => {
    spyOn(window.URL, 'createObjectURL').and.returnValue('blob:fake');
    spyOn(window.URL, 'revokeObjectURL');
    bulkImportServiceSpy.getImportsDownloadOutputTemplate.and.returnValue(
      of(new Blob()) as unknown as ReturnType<
        BulkImportService['getImportsDownloadOutputTemplate']
      >,
    );

    component.onDownloadResult('42');

    expect(bulkImportServiceSpy.getImportsDownloadOutputTemplate).toHaveBeenCalledWith(42);
  });
});
