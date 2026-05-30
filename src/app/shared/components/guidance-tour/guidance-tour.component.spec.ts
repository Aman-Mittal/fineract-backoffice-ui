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
import { By } from '@angular/platform-browser';
import { GuidanceTourComponent } from './guidance-tour.component';
import { GuidanceService } from '../../../core/services/guidance.service';
import { TranslateModule } from '@ngx-translate/core';
import { signal } from '@angular/core';

describe('GuidanceTourComponent', () => {
  let component: GuidanceTourComponent;
  let fixture: ComponentFixture<GuidanceTourComponent>;
  let guidanceServiceSpy: jasmine.SpyObj<GuidanceService>;

  beforeEach(async () => {
    guidanceServiceSpy = jasmine.createSpyObj(
      'GuidanceService',
      ['nextStep', 'previousStep', 'endTour'],
      {
        isPlaying: signal(true),
        currentStepIndex: signal(0),
        activeSteps: signal([{ titleKey: 'Title', descriptionKey: 'Desc' }]),
        currentStep: signal({ titleKey: 'Title', descriptionKey: 'Desc' }),
      },
    );

    await TestBed.configureTestingModule({
      imports: [GuidanceTourComponent, TranslateModule.forRoot()],
      providers: [{ provide: GuidanceService, useValue: guidanceServiceSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(GuidanceTourComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display card when isPlaying is true', () => {
    const cardEl = fixture.debugElement.query(By.css('.guidance-card'));
    expect(cardEl).toBeTruthy();
  });

  it('should call nextStep on next click', () => {
    const nextBtn = fixture.debugElement.queryAll(By.css('button'))[2]; // Exit, Back, Next/Finish
    nextBtn.nativeElement.click();
    expect(guidanceServiceSpy.nextStep).toHaveBeenCalled();
  });

  it('should call endTour on exit click', () => {
    const exitBtn = fixture.debugElement.queryAll(By.css('button'))[0];
    exitBtn.nativeElement.click();
    expect(guidanceServiceSpy.endTour).toHaveBeenCalled();
  });
});
