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
import { TranslateService } from '@ngx-translate/core';
import { EventEmitter } from '@angular/core';
import { CustomPaginatorIntl } from './custom-paginator-intl';

describe('CustomPaginatorIntl', () => {
  let paginatorIntl: CustomPaginatorIntl;
  let translateService: TranslateService;
  let onLangChangeEmitter: EventEmitter<unknown>;

  beforeEach(() => {
    onLangChangeEmitter = new EventEmitter<unknown>();
    const translateServiceMock = {
      instant: jasmine.createSpy('instant').and.callFake((key: string) => {
        if (key === 'COMMON.ITEMS_PER_PAGE') return 'Items per page translated';
        if (key === 'COMMON.NEXT_PAGE') return 'Next page translated';
        if (key === 'COMMON.PREVIOUS_PAGE') return 'Previous page translated';
        if (key === 'COMMON.FIRST_PAGE') return 'First page translated';
        if (key === 'COMMON.LAST_PAGE') return 'Last page translated';
        if (key === 'COMMON.OF') return 'of';
        if (key === 'COMMON.MANY') return 'many';
        return '';
      }),
      onLangChange: onLangChangeEmitter,
    };

    TestBed.configureTestingModule({
      providers: [
        CustomPaginatorIntl,
        { provide: TranslateService, useValue: translateServiceMock },
      ],
    });

    translateService = TestBed.inject(TranslateService);
    paginatorIntl = TestBed.inject(CustomPaginatorIntl);
  });

  it('should be created and translate labels initially', () => {
    expect(paginatorIntl).toBeTruthy();
    expect(paginatorIntl.itemsPerPageLabel).toBe('Items per page translated');
    expect(paginatorIntl.nextPageLabel).toBe('Next page translated');
  });

  it('should re-translate labels when language changes', () => {
    // Modify instant mock for lang change
    (translateService.instant as jasmine.Spy).and.callFake((key: string) => {
      if (key === 'COMMON.ITEMS_PER_PAGE') return 'Items per page new';
      return '';
    });

    onLangChangeEmitter.emit({ lang: 'hi' });
    expect(paginatorIntl.itemsPerPageLabel).toBe('Items per page new');
  });

  it('should return range label 0 of length when length or pageSize is 0', () => {
    expect(paginatorIntl.getRangeLabel(0, 10, 0)).toBe('0 of 0');
    expect(paginatorIntl.getRangeLabel(0, 0, 10)).toBe('0 of 10');
  });

  it('should return correct range label for standard cases', () => {
    expect(paginatorIntl.getRangeLabel(0, 10, 50)).toBe('1 - 10 of 50');
    expect(paginatorIntl.getRangeLabel(1, 10, 50)).toBe('11 - 20 of 50');
    expect(paginatorIntl.getRangeLabel(4, 10, 45)).toBe('41 - 45 of 45');
  });

  it('should return correct range label for unknown total heuristic', () => {
    // If length is (offset + pageSize + 1) e.g., page 0, pageSize 10, length 11 => 11 % 10 = 1
    expect(paginatorIntl.getRangeLabel(0, 10, 11)).toBe('1 - 10 of many');
    // If page is 1, pageSize 10, offset is 10. length is 21 => 21 % 10 = 1
    expect(paginatorIntl.getRangeLabel(1, 10, 21)).toBe('11 - 20 of many');
  });

  it('should handle fallbacks when translation values are empty', () => {
    (translateService.instant as jasmine.Spy).and.returnValue(null);
    paginatorIntl['translateLabels']();
    expect(paginatorIntl.itemsPerPageLabel).toBe('Items per page:');
    expect(paginatorIntl.nextPageLabel).toBe('Next page');
    expect(paginatorIntl.previousPageLabel).toBe('Previous page');
    expect(paginatorIntl.firstPageLabel).toBe('First page');
    expect(paginatorIntl.lastPageLabel).toBe('Last page');
  });
});
