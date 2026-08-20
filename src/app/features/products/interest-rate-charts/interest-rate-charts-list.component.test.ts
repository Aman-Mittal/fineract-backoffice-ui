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

import { createSpyObj, SpyObj } from '../../../testing/mocks';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InterestRateChartsListComponent } from './interest-rate-charts-list.component';
import { InterestRateChartService } from '../../../api';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { provideTranslateTesting } from '../../../testing/i18n-testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { DialogService } from '../../../core/services/dialog.service';

describe('InterestRateChartsListComponent', () => {
  let component: InterestRateChartsListComponent;
  let fixture: ComponentFixture<InterestRateChartsListComponent>;
  let serviceSpy: SpyObj<InterestRateChartService>;
  let routerSpy: SpyObj<Router>;
  let dialogService: SpyObj<DialogService>;

  beforeEach(async () => {
    serviceSpy = createSpyObj(['getInterestratecharts', 'deleteInterestratechartsChartId']);
    routerSpy = createSpyObj(['navigate']);
    dialogService = createSpyObj(['confirm']);
    dialogService.confirm.mockResolvedValue(true);
    serviceSpy.getInterestratecharts.mockReturnValue(
      of([
        { id: 1, fromDate: '01 January 2024', savingsProductName: 'Prod A' },
      ]) as unknown as ReturnType<InterestRateChartService['getInterestratecharts']>,
    );

    await TestBed.configureTestingModule({
      imports: [InterestRateChartsListComponent],
      providers: [
        ...provideTranslateTesting(),
        { provide: InterestRateChartService, useValue: serviceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: DialogService, useValue: dialogService },
        provideNoopAnimations(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(InterestRateChartsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should load charts on init', () => {
    expect(component).toBeTruthy();
    expect(serviceSpy.getInterestratecharts).toHaveBeenCalled();
    expect(component.charts()).toHaveLength(1);
  });

  it('should navigate to a chart slabs view', () => {
    component.onSlabs({ id: 7 });
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/products/interest-rate-charts', 7, 'slabs']);
  });

  it('should navigate to edit with the chart id', () => {
    component.onEdit({ id: 3 });
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/products/interest-rate-charts/edit', 3]);
  });

  it('should delete after confirmation and reload', async () => {
    serviceSpy.deleteInterestratechartsChartId.mockReturnValue(
      of({}) as unknown as ReturnType<InterestRateChartService['deleteInterestratechartsChartId']>,
    );

    component.onDelete({ id: 5 });

    await fixture.whenStable();

    expect(serviceSpy.deleteInterestratechartsChartId).toHaveBeenCalledWith(5);
    expect(serviceSpy.getInterestratecharts).toHaveBeenCalledTimes(2);
  });

  it('should not delete when cancelled', async () => {
    dialogService.confirm.mockResolvedValue(false);
    component.onDelete({ id: 5 });
    await fixture.whenStable();
    expect(serviceSpy.deleteInterestratechartsChartId).not.toHaveBeenCalled();
  });
});
