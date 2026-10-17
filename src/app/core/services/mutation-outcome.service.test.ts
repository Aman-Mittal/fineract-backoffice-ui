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
import { Router } from '@angular/router';
import { createSpyObj, SpyObj } from '../../testing/mocks';
import { FakeOverlayAdapter, provideFakeAdapters } from '../../testing/adapters';
import { MutationOutcomeService } from './mutation-outcome.service';

describe('MutationOutcomeService', () => {
  let service: MutationOutcomeService;
  let routerSpy: SpyObj<Router>;
  let overlay: FakeOverlayAdapter;

  beforeEach(() => {
    routerSpy = createSpyObj(['navigate']);
    routerSpy.navigate.mockResolvedValue(true);

    const fakes = provideFakeAdapters();
    overlay = fakes.overlay;

    TestBed.configureTestingModule({
      providers: [...fakes.providers, { provide: Router, useValue: routerSpy }],
    });

    service = TestBed.inject(MutationOutcomeService);
  });

  it('shows success and navigates to the record view', () => {
    service.complete({
      response: { clientId: 42 },
      successMessage: 'Client created.',
      recordRoute: (id) => ['/clients/view', id],
    });

    expect(overlay.lastToast?.message).toBe('Client created.');
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/clients/view', 42]);
  });

  it('shows maker-checker message and uses fallback when no id is returned', () => {
    service.complete({
      response: { commandId: 9 },
      successMessage: 'Client created.',
      recordRoute: (id) => ['/clients/view', id],
      fallbackRoute: ['/clients'],
    });

    expect(overlay.lastToast?.message).toBe('COMMON.MUTATION_SUBMITTED_FOR_APPROVAL');
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/clients']);
  });
});
