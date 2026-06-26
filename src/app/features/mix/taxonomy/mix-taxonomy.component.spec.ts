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
import { MixTaxonomyComponent } from './mix-taxonomy.component';
import { MixTaxonomyService } from '../../../api';
import { of } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { provideNoopAnimations } from '@angular/platform-browser/animations';

describe('MixTaxonomyComponent', () => {
  let component: MixTaxonomyComponent;
  let fixture: ComponentFixture<MixTaxonomyComponent>;
  let serviceSpy: jasmine.SpyObj<MixTaxonomyService>;

  beforeEach(async () => {
    serviceSpy = jasmine.createSpyObj('MixTaxonomyService', ['getMixtaxonomy']);
    serviceSpy.getMixtaxonomy.and.returnValue(
      of([{ id: 1, name: 'Assets', namespace: 'mix' }]) as unknown as ReturnType<
        MixTaxonomyService['getMixtaxonomy']
      >,
    );

    await TestBed.configureTestingModule({
      imports: [MixTaxonomyComponent, TranslateModule.forRoot()],
      providers: [{ provide: MixTaxonomyService, useValue: serviceSpy }, provideNoopAnimations()],
    }).compileComponents();

    fixture = TestBed.createComponent(MixTaxonomyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should load taxonomy on init', () => {
    expect(component).toBeTruthy();
    expect(serviceSpy.getMixtaxonomy).toHaveBeenCalled();
    expect(component.taxonomy.length).toBe(1);
  });
});
