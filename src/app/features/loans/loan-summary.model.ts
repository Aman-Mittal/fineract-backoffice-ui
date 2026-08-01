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
 * The few loan fields a sub-page shows so the user can tell which loan they are working on.
 *
 * Read from `GET /loans/{id}`, which returns far more than this. Naming the subset keeps the
 * three pages that display it agreeing on what "loan context" means, and keeps the field
 * declarations to one line — an inline object type is what stopped `codemod-signals.mjs`
 * converting them.
 */
export interface LoanSummary {
  accountNo?: string;
  clientName?: string;
  loanProductName?: string;
}
