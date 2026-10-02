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

import { createSpyObj } from '../../../testing/mocks';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { DefaultService } from '../../../api';
import { NotificationService } from '../../../core/services/notification.service';
import { provideTranslateTesting } from '../../../testing/i18n-testing';
import { expectLookedUp } from '../../../testing/translated-text';
import { SmsCampaignFormComponent } from './sms-campaign-form.component';

describe('SmsCampaignFormComponent', () => {
  let fixture: ComponentFixture<SmsCampaignFormComponent>;

  beforeEach(async () => {
    const api = createSpyObj<DefaultService>(['getSmscampaignsTemplate']);
    api.getSmscampaignsTemplate.mockReturnValue(
      of({}) as unknown as ReturnType<DefaultService['getSmscampaignsTemplate']>,
    );

    await TestBed.configureTestingModule({
      imports: [SmsCampaignFormComponent],
      providers: [
        ...provideTranslateTesting(),
        provideNoopAnimations(),
        { provide: DefaultService, useValue: api },
        { provide: Router, useValue: createSpyObj<Router>(['navigate']) },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: convertToParamMap({}) } } },
        {
          provide: NotificationService,
          useValue: createSpyObj<NotificationService>(['success', 'error', 'show']),
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SmsCampaignFormComponent);
    fixture.detectChanges();
  });

  it('renders the parameterized message label through the translation adapter', () => {
    expectLookedUp(fixture.nativeElement, ['SMS_CAMPAIGNS.PARAMETERIZED_MESSAGE']);
  });
});
