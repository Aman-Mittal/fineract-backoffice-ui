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

import { extractMutationResourceId, isMakerCheckerPending } from './mutation-response';

describe('mutation-response', () => {
  it('extractMutationResourceId prefers explicit resource fields', () => {
    expect(extractMutationResourceId({ clientId: 7 })).toBe(7);
    expect(extractMutationResourceId({ savingsId: 12 })).toBe(12);
    expect(extractMutationResourceId({ resourceId: 3, clientId: 7 })).toBe(3);
  });

  it('isMakerCheckerPending when commandId is set without a resource id', () => {
    expect(isMakerCheckerPending({ commandId: 99 })).toBe(true);
    expect(isMakerCheckerPending({ commandId: 99, clientId: 5 })).toBe(false);
  });
});
