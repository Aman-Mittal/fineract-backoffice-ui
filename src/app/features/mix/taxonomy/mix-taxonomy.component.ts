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

import { Component, OnInit, inject } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ColumnDef } from '../../../shared';
import { DataTableComponent } from '../../../shared/components/data-table/data-table.component';
import { MixTaxonomyService, MixTaxonomyData } from '../../../api';

/**
 * Read-only DataTable of the MIX XBRL taxonomy elements (name, namespace, dimension, type).
 */
@Component({
  selector: 'app-mix-taxonomy',
  standalone: true,
  imports: [TranslateModule, DataTableComponent],
  template: `
    <app-data-table
      title="nav.mixTaxonomy"
      helpTextKey="HELP.MIX_TAXONOMY_DESC"
      [columns]="columns"
      [data]="taxonomy"
      [totalRecords]="taxonomy.length"
      [localLogic]="true"
    ></app-data-table>
  `,
})
export class MixTaxonomyComponent implements OnInit {
  private readonly taxonomyService = inject(MixTaxonomyService);

  readonly columns: ColumnDef[] = [
    { key: 'name', label: 'MIX_TAXONOMY.NAME', sortable: true },
    { key: 'namespace', label: 'MIX_TAXONOMY.NAMESPACE', sortable: true },
    { key: 'dimension', label: 'MIX_TAXONOMY.DIMENSION', sortable: true },
    { key: 'description', label: 'MIX_TAXONOMY.DESCRIPTION', sortable: false },
    { key: 'type', label: 'MIX_TAXONOMY.TYPE', sortable: true },
  ];

  taxonomy: MixTaxonomyData[] = [];

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.taxonomyService.getMixtaxonomy().subscribe({
      next: (data: MixTaxonomyData[]) => {
        this.taxonomy = data || [];
      },
      error: (err: unknown) => console.error('Failed to load MIX taxonomy', err),
    });
  }
}
