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
import { StatusBadgeComponent } from './status-badge.component';

describe('StatusBadgeComponent', () => {
  let component: StatusBadgeComponent;
  let fixture: ComponentFixture<StatusBadgeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatusBadgeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(StatusBadgeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('statusName', () => {
    it('should return UNKNOWN if status is undefined', () => {
      component.status = undefined;
      expect(component.statusName).toBe('UNKNOWN');
    });

    it('should return status if status is a string', () => {
      component.status = 'Active';
      expect(component.statusName).toBe('Active');
    });

    it('should return value from object if value is present', () => {
      component.status = { value: 'Approved', code: 'approved' };
      expect(component.statusName).toBe('Approved');
    });

    it('should return code from object if value is absent', () => {
      component.status = { code: 'pending.approval' };
      expect(component.statusName).toBe('pending.approval');
    });
  });

  describe('colorClass', () => {
    it('should return status-default for unknown status', () => {
      component.status = undefined;
      expect(component.colorClass).toBe('status-default');
    });

    it('should return status-active for active status', () => {
      component.status = 'Active';
      expect(component.colorClass).toBe('status-active');

      component.status = { code: 'clientStatusType.active' };
      expect(component.colorClass).toBe('status-active');

      component.status = { value: 'Approved' };
      expect(component.colorClass).toBe('status-active');
    });

    it('should return status-pending for pending status', () => {
      component.status = 'Pending';
      expect(component.colorClass).toBe('status-pending');

      component.status = { value: 'Submitted and pending approval' };
      expect(component.colorClass).toBe('status-pending');
    });

    it('should return status-closed for closed/rejected/deleted status', () => {
      component.status = 'Closed';
      expect(component.colorClass).toBe('status-closed');

      component.status = { value: 'Rejected' };
      expect(component.colorClass).toBe('status-closed');

      component.status = { code: 'deleted' };
      expect(component.colorClass).toBe('status-closed');
    });

    it('should return status-default for unmapped status', () => {
      component.status = 'SomeRandomStatus';
      expect(component.colorClass).toBe('status-default');
    });
  });
});
