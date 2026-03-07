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

# Code Style Guide

This project follows strict engineering standards to ensure high-quality, maintainable code.

## General Principles

- **Strict Mode**: TypeScript strict mode is mandatory.
- **Standalone Components**: Use the Angular standalone component model (default for Angular 20+).
- **Immutability**: Prefer immutable data patterns and `readonly` properties.
- **Signal-First**: Use Angular Signals for state management where appropriate.

## Architecture

- **Core**: Contains singleton services, interceptors, and application-wide utilities.
- **Shared**: Contains reusable components, pipes, and directives.
- **Features**: Domain-specific modules and components organized by feature area (e.g., `clients`, `loans`).
- **Layout**: Contains top-level layout components like `navbar` and `sidebar`.

## Naming Conventions

- **Components**: `kebab-case.component.ts` (e.g., `user-profile.component.ts`).
- **Services**: `kebab-case.service.ts` (e.g., `client-data.service.ts`).
- **Interfaces/Models**: `kebab-case.model.ts` (e.g., `client-summary.model.ts`).

## Formatting and Linting

- **Prettier**: Code must be formatted using Prettier. Run `npm run format` to automatically apply formatting.
- **ESLint**: Code must pass all linting rules. Run `npm run lint` to check for issues.

## Testing

- **Unit Tests**: Every service and complex component should have corresponding `spec.ts` files with comprehensive unit tests.
- **Test Coverage**: Aim for at least 80% statement coverage.

## Internationalization (i18n)

- **No Hardcoded Strings**: All user-facing text must use translation keys and follow the project's i18n strategy.
