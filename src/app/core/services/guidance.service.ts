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

import { Injectable, signal, computed } from '@angular/core';

export interface TourStep {
  titleKey: string;
  descriptionKey: string;
  targetSelector?: string;
}

const TAB_GROUP_SELECTOR = '.tab-group';
const HEADER_ACTIONS_SELECTOR = 'button[headerActions]';

@Injectable({
  providedIn: 'root',
})
export class GuidanceService {
  readonly isPlaying = signal<boolean>(false);
  readonly currentStepIndex = signal<number>(0);
  readonly activeSteps = signal<TourStep[]>([]);

  readonly currentStep = computed(() => {
    const steps = this.activeSteps();
    const idx = this.currentStepIndex();
    return steps.length > 0 && idx >= 0 && idx < steps.length ? steps[idx] : null;
  });

  private readonly tours: Record<string, TourStep[]> = {
    dashboard: [
      {
        titleKey: 'GUIDE.DASHBOARD_WELCOME_TITLE',
        descriptionKey: 'GUIDE.DASHBOARD_WELCOME_DESC',
      },
      {
        titleKey: 'GUIDE.DASHBOARD_ENV_TITLE',
        descriptionKey: 'GUIDE.DASHBOARD_ENV_DESC',
        targetSelector: 'ul',
      },
    ],
    clients: [
      {
        titleKey: 'GUIDE.CLIENTS_TITLE',
        descriptionKey: 'GUIDE.CLIENTS_DESC',
      },
      {
        titleKey: 'GUIDE.CLIENTS_SEARCH_TITLE',
        descriptionKey: 'GUIDE.CLIENTS_SEARCH_DESC',
        targetSelector: 'app-search-filter',
      },
      {
        titleKey: 'GUIDE.CLIENTS_CREATE_TITLE',
        descriptionKey: 'GUIDE.CLIENTS_CREATE_DESC',
        targetSelector: HEADER_ACTIONS_SELECTOR,
      },
    ],
    'clients-view': [
      {
        titleKey: 'GUIDE.CLIENTS_VIEW_TITLE',
        descriptionKey: 'GUIDE.CLIENTS_VIEW_DESC',
      },
      {
        titleKey: 'GUIDE.CLIENTS_VIEW_TABS_TITLE',
        descriptionKey: 'GUIDE.CLIENTS_VIEW_TABS_DESC',
        targetSelector: TAB_GROUP_SELECTOR,
      },
      {
        titleKey: 'GUIDE.CLIENTS_VIEW_ACTIONS_TITLE',
        descriptionKey: 'GUIDE.CLIENTS_VIEW_ACTIONS_DESC',
        targetSelector: '.actions-area',
      },
    ],
    loans: [
      {
        titleKey: 'GUIDE.LOANS_TITLE',
        descriptionKey: 'GUIDE.LOANS_DESC',
      },
      {
        titleKey: 'GUIDE.LOANS_FILTER_TITLE',
        descriptionKey: 'GUIDE.LOANS_FILTER_DESC',
        targetSelector: '.filter-row',
      },
    ],
    'loans-view': [
      {
        titleKey: 'GUIDE.LOANS_VIEW_TITLE',
        descriptionKey: 'GUIDE.LOANS_VIEW_DESC',
      },
      {
        titleKey: 'GUIDE.LOANS_VIEW_TABS_TITLE',
        descriptionKey: 'GUIDE.LOANS_VIEW_TABS_DESC',
        targetSelector: TAB_GROUP_SELECTOR,
      },
    ],
    'savings-view': [
      {
        titleKey: 'GUIDE.SAVINGS_VIEW_TITLE',
        descriptionKey: 'GUIDE.SAVINGS_VIEW_DESC',
      },
      {
        titleKey: 'GUIDE.SAVINGS_VIEW_TABS_TITLE',
        descriptionKey: 'GUIDE.SAVINGS_VIEW_TABS_DESC',
        targetSelector: TAB_GROUP_SELECTOR,
      },
      {
        titleKey: 'GUIDE.SAVINGS_VIEW_ACTIONS_TITLE',
        descriptionKey: 'GUIDE.SAVINGS_VIEW_ACTIONS_DESC',
        targetSelector: '.actions-area',
      },
    ],
    savings: [
      {
        titleKey: 'GUIDE.SAVINGS_TITLE',
        descriptionKey: 'GUIDE.SAVINGS_DESC',
      },
      {
        titleKey: 'GUIDE.SAVINGS_SEARCH_TITLE',
        descriptionKey: 'GUIDE.SAVINGS_SEARCH_DESC',
        targetSelector: 'app-search-filter',
      },
      {
        titleKey: 'GUIDE.SAVINGS_CREATE_TITLE',
        descriptionKey: 'GUIDE.SAVINGS_CREATE_DESC',
        targetSelector: HEADER_ACTIONS_SELECTOR,
      },
    ],
    shares: [
      {
        titleKey: 'GUIDE.SHARES_TITLE',
        descriptionKey: 'GUIDE.SHARES_DESC',
      },
      {
        titleKey: 'GUIDE.SHARES_CREATE_TITLE',
        descriptionKey: 'GUIDE.SHARES_CREATE_DESC',
        targetSelector: HEADER_ACTIONS_SELECTOR,
      },
    ],
    'shares-create': [
      {
        titleKey: 'GUIDE.SHARES_CREATE_FORM_TITLE',
        descriptionKey: 'GUIDE.SHARES_CREATE_FORM_DESC',
      },
      {
        titleKey: 'GUIDE.SHARES_PREREQ_TITLE',
        descriptionKey: 'GUIDE.SHARES_PREREQ_DESC',
        targetSelector: '.info-banner',
      },
      {
        titleKey: 'GUIDE.SHARES_CLIENT_TITLE',
        descriptionKey: 'GUIDE.SHARES_CLIENT_DESC',
        targetSelector: 'app-client-search',
      },
      {
        titleKey: 'GUIDE.SHARES_PRODUCT_TITLE',
        descriptionKey: 'GUIDE.SHARES_PRODUCT_DESC',
        targetSelector: 'mat-select[name="productId"]',
      },
      {
        titleKey: 'GUIDE.SHARES_SAVINGS_TITLE',
        descriptionKey: 'GUIDE.SHARES_SAVINGS_DESC',
        targetSelector: 'mat-select[name="savingsAccountId"]',
      },
    ],
  };

  startTour(routeUrl: string): void {
    let matchedTourKey = 'dashboard';

    if (routeUrl.includes('/clients/view')) {
      matchedTourKey = 'clients-view';
    } else if (routeUrl.includes('/clients')) {
      matchedTourKey = 'clients';
    } else if (routeUrl.includes('/loans/view')) {
      matchedTourKey = 'loans-view';
    } else if (routeUrl.includes('/loans')) {
      matchedTourKey = 'loans';
    } else if (routeUrl.includes('/products/savings-accounts/view')) {
      matchedTourKey = 'savings-view';
    } else if (routeUrl.includes('/products/savings-accounts')) {
      matchedTourKey = 'savings';
    } else if (routeUrl.includes('/products/shares/create')) {
      matchedTourKey = 'shares-create';
    } else if (routeUrl.includes('/products/shares')) {
      matchedTourKey = 'shares';
    }

    const steps = this.tours[matchedTourKey] || [];
    if (steps.length > 0) {
      this.activeSteps.set(steps);
      this.currentStepIndex.set(0);
      this.isPlaying.set(true);
    }
  }

  nextStep(): void {
    if (this.currentStepIndex() < this.activeSteps().length - 1) {
      this.currentStepIndex.update((i) => i + 1);
    } else {
      this.endTour();
    }
  }

  previousStep(): void {
    if (this.currentStepIndex() > 0) {
      this.currentStepIndex.update((i) => i - 1);
    }
  }

  endTour(): void {
    this.isPlaying.set(false);
    this.activeSteps.set([]);
    this.currentStepIndex.set(0);
  }
}
