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
import { InstitutionConfigService, InstitutionType } from './institution-config.service';

describe('InstitutionConfigService', () => {
  const STORAGE_KEY = 'fineract_institution_type';

  let service: InstitutionConfigService;

  const createService = () => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [InstitutionConfigService],
    });
    service = TestBed.inject(InstitutionConfigService);
  };

  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should be created', () => {
    createService();
    expect(service).toBeTruthy();
  });

  it('should default to "universal" when nothing is stored', () => {
    createService();
    expect(service.institutionType()).toBe('universal');
    expect(service.isFeatureEnabled('groups')).toBeTrue();
    expect(service.isFeatureEnabled('centers')).toBeTrue();
    expect(service.isFeatureEnabled('collection_sheet')).toBeTrue();
  });

  it('should read a valid persisted institution type on init', () => {
    localStorage.setItem(STORAGE_KEY, 'cb');
    createService();
    expect(service.institutionType()).toBe('cb');
  });

  it('should fall back to "universal" when the stored value is invalid', () => {
    localStorage.setItem(STORAGE_KEY, 'not-a-real-type');
    createService();
    expect(service.institutionType()).toBe('universal');
  });

  it('should persist to local storage and update the signal on set', () => {
    createService();
    service.setInstitutionType('mfis');
    expect(service.institutionType()).toBe('mfis');
    expect(localStorage.getItem(STORAGE_KEY)).toBe('mfis');
  });

  describe('isFeatureEnabled matrix', () => {
    const cases: Array<{
      type: InstitutionType;
      groups: boolean;
      centers: boolean;
      collection_sheet: boolean;
    }> = [
      { type: 'mfis', groups: true, centers: true, collection_sheet: true },
      { type: 'cb', groups: false, centers: false, collection_sheet: false },
      { type: 'cu', groups: true, centers: false, collection_sheet: false },
      { type: 'universal', groups: true, centers: true, collection_sheet: true },
    ];

    cases.forEach(({ type, groups, centers, collection_sheet }) => {
      it(`should resolve features correctly for "${type}"`, () => {
        createService();
        service.setInstitutionType(type);
        expect(service.isFeatureEnabled('groups')).toBe(groups);
        expect(service.isFeatureEnabled('centers')).toBe(centers);
        expect(service.isFeatureEnabled('collection_sheet')).toBe(collection_sheet);
      });
    });
  });
});
