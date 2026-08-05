<!--
Licensed to the Apache Software Foundation (ASF) under one
or more contributor license agreements.  See the NOTICE file
distributed with this work for additional information
regarding copyright ownership.  The ASF licenses this file
to you under the Apache License, Version 2.0 (the
"License"); you may not use this file except in compliance
with the License.  You may obtain a copy of the License at

  http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing,
software distributed under the License is distributed on an
"AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, either express or implied.  See the License for the
specific language governing permissions and limitations
under the License.
-->

## What and why

<!-- One or two sentences explaining what changed and why. -->

Closes #

## Verification

<!-- List what you ran and what you checked. Note whether the UI was exercised with mocks, a real Fineract backend, or both. -->

-

## Screenshots

<!-- Add screenshots or a short recording for UI changes. Write "Not applicable" for non-UI changes. -->

## Checklist

<!-- Check each item, or explain why it does not apply. -->

- [ ] I did not hand-edit generated files under `src/app/api/`.
- [ ] New component or service code uses the adapter boundary in `src/app/core/adapters/` instead of direct browser globals or imperative third-party APIs.
- [ ] User-facing strings use translation keys.
- [ ] I added or updated tests appropriate to this change, or explained why tests were not needed.
- [ ] UI workflow changes include suitable e2e coverage, including real-backend testing where relevant.
