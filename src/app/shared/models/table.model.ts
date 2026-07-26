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

/**
 * Sort direction. The empty string means "unsorted", matching the tri-state cycle
 * of the table's sortable column headers.
 */
export type SortDirection = 'asc' | 'desc' | '';

/** Emitted when the user changes the sorted column or direction. */
export interface SortEvent {
  /** Key of the column being sorted, from `ColumnDef.key`. */
  active: string;
  direction: SortDirection;
}

/** Emitted when the user changes page or page size. */
export interface PageEvent {
  /** Zero-based index of the current page. */
  pageIndex: number;
  pageSize: number;
  /** Total number of records, as far as the caller knows it. */
  length: number;
}
