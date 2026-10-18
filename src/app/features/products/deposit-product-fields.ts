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
 * Turns a modelled absence back into an omission, for the deposit product forms.
 *
 * `DepositProduct` states a figure the product does not carry as `null`, which is right for a
 * model — a product with no maximum term and one capped at nothing are different products. It is
 * wrong for the request these forms build, because `onSubmit` spreads the form's record straight
 * into the update body and the platform validates a null against the field's enumeration instead
 * of skipping it:
 *
 * > The parameter `maxDepositTermTypeId` must be one of [ 0, 1, 2, 3 ] .
 *
 * Measured against a running Fineract: a fixed deposit product with no maximum term — which is
 * every product the create form makes, since the form does not ask for one — could not be saved
 * at all once its absent fields travelled as nulls. An omitted field is left as it is, which is
 * what "the product does not state one" has to mean on the way out as well as in.
 *
 * Shared by both product forms deliberately: they send the same twenty-odd fields, and a second
 * copy of this would be a second place for the distinction to be lost.
 */
export function absent<T>(value: T | null | undefined): T | undefined {
  return value ?? undefined;
}
