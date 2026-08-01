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

import { Directive, TemplateRef, inject, input } from '@angular/core';

@Directive({
  selector: '[appCellTemplate]',
  standalone: true,
})
export class CellTemplateDirective {
  /**
   * Column this template renders, named by the directive's own selector.
   *
   * A signal input so that the map `DataTableComponent` builds from these stays correct if a
   * template's column is itself bound to an expression.
   */
  readonly columnName = input.required<string>({ alias: 'appCellTemplate' });

  public readonly template = inject(TemplateRef<unknown>);
}
