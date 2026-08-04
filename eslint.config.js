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
            // Adapter boundary — DOCS/adr/0003-adapter-boundary.md.
            //
            // `<ion-*>` components are deliberately NOT restricted: they are the UI layer
            // (AGENTS.md) and migrate one component at a time. What is restricted is Ionic's
            // *imperative* surface, which services reach for and which has lifecycle
            // semantics worth testing without a component library present.
            {
              group: ['@ionic/angular', '@ionic/angular/*'],
              importNames: [
                'ModalController',
                'ToastController',
                'AlertController',
                'LoadingController',
                'ActionSheetController',
                'PopoverController',
              ],
              message:
                "Use the OVERLAY adapter from 'app/core/adapters' instead of Ionic's controllers. Ion* components are unaffected. See DOCS/adr/0003-adapter-boundary.md.",
            },
            {
              group: ['@ngx-translate/*'],
              message:
                "Use the I18N adapter (or the | appTranslate pipe) from 'app/core/adapters'. See DOCS/adr/0003-adapter-boundary.md.",
            },
          ],
        },
      ],
      // Web Storage is a trust boundary (security.md §4) and reached through globals rather
      // than imports, so the boundary needs a second rule to hold. `STORAGE_KEYS` is the
      // reviewable inventory of what this origin persists; a direct `localStorage.setItem`
      // silently leaves it.
      'no-restricted-globals': [
        'error',
        {
          name: 'localStorage',
          message:
            "Use the STORAGE adapter from 'app/core/adapters'. See DOCS/adr/0003-adapter-boundary.md.",
        },
        {
          name: 'sessionStorage',
          message:
            "Use the STORAGE adapter from 'app/core/adapters'. See DOCS/adr/0003-adapter-boundary.md.",
        },
      ],
      // Object URLs leak when the revoke is skipped on a throw, which every hand-rolled
      // download in this repo did. The DOWNLOAD adapter revokes in a `finally`.
      'no-restricted-properties': [
        'error',
        {
          object: 'URL',
          property: 'createObjectURL',
          message:
            "Use the DOWNLOAD adapter from 'app/core/adapters', which revokes the object URL even on failure. See DOCS/adr/0003-adapter-boundary.md.",
        },
      ],
    },
  },
  {
    // The adapter implementations are the one place each restricted dependency is allowed —
    // that is what makes them adapters. Nothing else may reach past the boundary.
    files: [
      'src/app/core/adapters/**/*.ts',
      // `TranslateModule.forRoot()` and `provideTranslateHttpLoader()` configure the library
      // itself, which is composition-root work rather than a call site.
      'src/app/app.config.ts',
      // The fakes must implement the same contracts, and the storage spec asserts against
      // real Web Storage to prove the adapter writes where its scope says it does.
      'src/app/testing/adapters.ts',
      // Same composition-root argument as app.config.ts, for specs: a spec that renders a
      // shared component still using `| translate` needs the library configured. Keeping that
      // in one helper stops `TranslateModule.forRoot()` from being re-imported by every spec,
      // which is what would actually erode the boundary.
      'src/app/testing/i18n-testing.ts',
    ],
    rules: {
      'no-restricted-imports': 'off',
      'no-restricted-globals': 'off',
      'no-restricted-properties': 'off',
    },
  },
  {
    files: ['**/*.html'],
    extends: [...angular.configs.templateRecommended, ...angular.configs.templateAccessibility],
    rules: {},
  },
);
