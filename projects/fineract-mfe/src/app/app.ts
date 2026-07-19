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

import { Component } from '@angular/core';

@Component({
  selector: 'app-fineract-mfe',
  standalone: true,
  template: `
    <div
      style="padding: 20px; border: 2px dashed #3f51b5; border-radius: 8px; margin-top: 20px; background-color: #f5f5f5;"
    >
      <h3 style="color: #3f51b5; margin-top: 0;">Fineract Microfrontend (Remote)</h3>
      <p>This component is loaded dynamically from the Fineract Remote MFE at runtime!</p>
    </div>
  `,
})
export class FineractMfeComponent {}
