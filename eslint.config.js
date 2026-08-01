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

// @ts-check
const eslint = require('@eslint/js');
const tseslint = require('typescript-eslint');
const angular = require('angular-eslint');
const sonarjs = require('eslint-plugin-sonarjs');

module.exports = tseslint.config(
  {
    // Build and report output, not source. coverage/ in particular holds one .html per
    // source file, which the template parser tries to read as an Angular template and
    // fails on — 405 parse errors that have nothing to do with the code.
    ignores: [
      'src/app/api/**',
      'dist/**',
      'node_modules/**',
      'coverage/**',
      'playwright-report/**',
      'test-results/**',
      '.angular/**',
    ],
  },
  {
    files: ['**/*.ts'],
    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.recommended,
      ...tseslint.configs.stylistic,
      ...angular.configs.tsRecommended,
      sonarjs.configs.recommended,
    ],
    processor: angular.processInlineTemplates,
    rules: {
      '@angular-eslint/directive-selector': [
        'error',
        {
          type: 'attribute',
          prefix: 'app',
          style: 'camelCase',
        },
      ],
      '@angular-eslint/component-selector': [
        'error',
        {
          type: 'element',
          prefix: 'app',
          style: 'kebab-case',
        },
      ],
      'sonarjs/no-duplicate-string': 'error',
      // The three rules below are on globally with every current violation recorded in
      // eslint-suppressions.json. That file only shrinks: CI runs --prune-suppressions, so a
      // fixed violation cannot be re-introduced, and anything new fails immediately. Turning
      // them on per-directory instead would leave new code in unmigrated features unlinted,
      // which is the opposite of what a migration needs.
      //
      // Not enabled: @angular-eslint/no-uncalled-signals, which catches the way a signal
      // conversion goes wrong — reading `count` where `count()` was meant. It requires typed
      // linting (parserOptions.projectService), and this config has none; adding it changes
      // the cost of every lint run, so it is worth doing deliberately rather than in passing.
      //
      // Reports 0 today, and that is the point: as of v22 OnPush *is* the default, so a
      // component is only reported when it explicitly opts out with Eager (or the deprecated
      // Default). Nothing here does. The rule keeps it that way — reaching for Eager to make a
      // stale binding render would paper over the missing notification rather than fix it,
      // which is the whole of what audit-async-state.mjs is counting.
      '@angular-eslint/prefer-on-push-component-change-detection': 'error',
      // input()/output() over the decorators: signal inputs are what let a component be
      // OnPush-correct without ngOnChanges.
      '@angular-eslint/prefer-signals': 'error',
      '@angular-eslint/prefer-output-emitter-ref': 'error',
      // The UI layer is Ionic. Angular Material has been fully removed and must not come
      // back; this rule replaced the migration ratchet once its count reached zero.
      //
      // @angular/cdk is deliberately not restricted — it is the unstyled primitives package
      // (cdk-table, virtual scroll, a11y) and is still used by the shared data table.
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@angular/material', '@angular/material/*'],
              message:
                'Angular Material has been removed. Use Ionic (@ionic/angular/standalone) — see STYLE.md for the component mapping. @angular/cdk is still allowed.',
            },
          ],
        },
      ],
    },
  },
  {
    files: ['**/*.html'],
    extends: [...angular.configs.templateRecommended, ...angular.configs.templateAccessibility],
    rules: {},
  },
);
