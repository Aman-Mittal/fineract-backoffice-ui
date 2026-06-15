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
import { DelinquencyManagementComponent } from './delinquency-management.component';
import { DelinquencyRangeAndBucketsManagementService } from '../../../api';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { provideNoopAnimations } from '@angular/platform-browser/animations';

describe('DelinquencyManagementComponent', () => {
  let component: DelinquencyManagementComponent;
  let fixture: ComponentFixture<DelinquencyManagementComponent>;
  let delinquencyServiceSpy: jasmine.SpyObj<DelinquencyRangeAndBucketsManagementService>;

  beforeEach(async () => {
    delinquencyServiceSpy = jasmine.createSpyObj('DelinquencyRangeAndBucketsManagementService', [
      'getDelinquencyRanges',
      'getDelinquencyBuckets',
      'deleteDelinquencyRangesDelinquencyRangeId',
      'deleteDelinquencyBucketsDelinquencyBucketId',
    ]);
    delinquencyServiceSpy.getDelinquencyRanges.and.returnValue(
      of([{ id: 1 }]) as unknown as ReturnType<
        DelinquencyRangeAndBucketsManagementService['getDelinquencyRanges']
      >,
    );
    delinquencyServiceSpy.getDelinquencyBuckets.and.returnValue(
      of([{ id: 2 }]) as unknown as ReturnType<
        DelinquencyRangeAndBucketsManagementService['getDelinquencyBuckets']
      >,
    );

    await TestBed.configureTestingModule({
      imports: [DelinquencyManagementComponent, TranslateModule.forRoot()],
      providers: [
        {
          provide: DelinquencyRangeAndBucketsManagementService,
          useValue: delinquencyServiceSpy,
        },
        provideRouter([]),
        provideNoopAnimations(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DelinquencyManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load ranges and buckets on init', () => {
    expect(delinquencyServiceSpy.getDelinquencyRanges).toHaveBeenCalled();
    expect(delinquencyServiceSpy.getDelinquencyBuckets).toHaveBeenCalled();
    expect(component.ranges().length).toBe(1);
    expect(component.buckets().length).toBe(1);
  });
});
