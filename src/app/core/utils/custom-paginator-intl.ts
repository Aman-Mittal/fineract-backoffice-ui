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

import { Injectable, inject } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class CustomPaginatorIntl extends MatPaginatorIntl {
  private readonly translate = inject(TranslateService);

  override itemsPerPageLabel = '';
  override nextPageLabel = '';
  override previousPageLabel = '';
  override firstPageLabel = '';
  override lastPageLabel = '';

  constructor() {
    super();
    this.translateLabels();
    this.translate.onLangChange.subscribe(() => this.translateLabels());
  }

  private translateLabels() {
    this.itemsPerPageLabel = this.translate.instant('COMMON.ITEMS_PER_PAGE') || 'Items per page:';
    this.nextPageLabel = this.translate.instant('COMMON.NEXT_PAGE') || 'Next page';
    this.previousPageLabel = this.translate.instant('COMMON.PREVIOUS_PAGE') || 'Previous page';
    this.firstPageLabel = this.translate.instant('COMMON.FIRST_PAGE') || 'First page';
    this.lastPageLabel = this.translate.instant('COMMON.LAST_PAGE') || 'Last page';
    this.changes.next();
  }

  override getRangeLabel = (page: number, pageSize: number, length: number) => {
    if (length === 0 || pageSize === 0) {
      return `0 ${this.translate.instant('COMMON.OF')} ${length}`;
    }

    length = Math.max(length, 0);
    const startIndex = page * pageSize;
    const endIndex =
      startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;

    // Fineract unknown total heuristic: if length is (offset + pageSize + 1)
    const isUnknownTotal = length > 0 && length % pageSize === 1;

    if (isUnknownTotal) {
      const manyLabel = this.translate.instant('COMMON.MANY') || 'many';
      return `${startIndex + 1} - ${endIndex} ${this.translate.instant('COMMON.OF')} ${manyLabel}`;
    }

    return `${startIndex + 1} - ${endIndex} ${this.translate.instant('COMMON.OF')} ${length}`;
  };
}
