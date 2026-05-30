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

import { TestBed } from '@angular/core/testing';
import { GuidanceService } from './guidance.service';

describe('GuidanceService', () => {
  let service: GuidanceService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GuidanceService],
    });
    service = TestBed.inject(GuidanceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should start a tour on matching route', () => {
    service.startTour('/dashboard');
    expect(service.isPlaying()).toBeTrue();
    expect(service.currentStepIndex()).toBe(0);
    expect(service.currentStep()?.titleKey).toBe('GUIDE.DASHBOARD_WELCOME_TITLE');
  });

  it('should transition to next and previous steps and end tour', () => {
    service.startTour('/clients');
    expect(service.isPlaying()).toBeTrue();
    expect(service.currentStepIndex()).toBe(0);

    service.nextStep();
    expect(service.currentStepIndex()).toBe(1);
    expect(service.currentStep()?.titleKey).toBe('GUIDE.CLIENTS_SEARCH_TITLE');

    service.previousStep();
    expect(service.currentStepIndex()).toBe(0);

    service.nextStep();
    service.nextStep(); // Last step
    expect(service.currentStepIndex()).toBe(2);

    service.nextStep(); // Finish tour
    expect(service.isPlaying()).toBeFalse();
    expect(service.currentStep()).toBeNull();
  });

  it('should match savings routes', () => {
    service.startTour('/products/savings-accounts');
    expect(service.isPlaying()).toBeTrue();
    expect(service.currentStep()?.titleKey).toBe('GUIDE.SAVINGS_TITLE');

    service.endTour();
    service.startTour('/products/savings-accounts/view/123');
    expect(service.isPlaying()).toBeTrue();
    expect(service.currentStep()?.titleKey).toBe('GUIDE.SAVINGS_VIEW_TITLE');
  });
});
