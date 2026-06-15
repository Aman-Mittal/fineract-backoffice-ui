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
import { JournalEntriesListComponent } from './journal-entries-list.component';
import { JournalEntriesService, GetJournalEntriesTransactionIdResponse } from '../../api';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { HttpEvent } from '@angular/common/http';

describe('JournalEntriesListComponent', () => {
  let component: JournalEntriesListComponent;
  let fixture: ComponentFixture<JournalEntriesListComponent>;
  let journalEntriesServiceSpy: jasmine.SpyObj<JournalEntriesService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    journalEntriesServiceSpy = jasmine.createSpyObj('JournalEntriesService', ['getJournalentries']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [JournalEntriesListComponent, TranslateModule.forRoot()],
      providers: [
        { provide: JournalEntriesService, useValue: journalEntriesServiceSpy },
        { provide: Router, useValue: routerSpy },
        provideNoopAnimations(),
      ],
    }).compileComponents();

    journalEntriesServiceSpy.getJournalentries.and.returnValue(
      of({ pageItems: [], totalFilteredRecords: 0 }) as unknown as Observable<
        HttpEvent<GetJournalEntriesTransactionIdResponse>
      >,
    );
    fixture = TestBed.createComponent(JournalEntriesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load journal entries on init', () => {
    expect(journalEntriesServiceSpy.getJournalentries).toHaveBeenCalled();
  });

  it('should navigate to create on onCreateEntry', () => {
    component.onCreateEntry();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/accounting/journal-entries/create']);
  });
});
