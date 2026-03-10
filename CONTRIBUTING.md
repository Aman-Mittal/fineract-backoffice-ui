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

# Contributing to Fineract Backoffice UI

Thank you for your interest in contributing! This project is a GSOC 2026 initiative for Apache Fineract.

## How to Contribute

1.  **Fork the repository** on GitHub.
2.  **Clone your fork** locally.
3.  **Create a feature branch** for your changes.
4.  **Implement your changes**, following the [Code Style Guide](STYLE.md).
5.  **Run local checks**:
    - `npm run lint`
    - `npm run format:check`
    - `npm run test`
6.  **Ensure License Headers**: All new files must include the Apache License 2.0 header. You can verify this with `./scripts/check-license.sh`.
7.  **Submit a Pull Request** against the `develop` branch.

## Pull Request Guidelines

- Provide a clear description of the changes.
- Link to any related Jira issues or GSOC proposals.
- Ensure CI checks pass.
- New features should include unit tests.
