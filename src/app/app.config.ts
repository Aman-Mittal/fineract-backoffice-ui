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

import {
  ApplicationConfig,
  importProvidersFrom,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
  APP_INITIALIZER,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { TranslateModule } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';
import { MatPaginatorIntl } from '@angular/material/paginator';

import { routes } from './app.routes';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { errorInterceptor } from './core/interceptors/error.interceptor';
import { loadingInterceptor } from './core/interceptors/loading.interceptor';
import { ConfigService } from './core/services/config.service';
import { CustomPaginatorIntl } from './core/utils/custom-paginator-intl';

import { BASE_PATH } from './api/variables';

/**
 * Factory function to load configuration before app bootstrap
 */
export function initializeApp(configService: ConfigService) {
  return () => configService.loadConfig();
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor, errorInterceptor, loadingInterceptor])),
    provideAnimationsAsync(),
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      deps: [ConfigService],
      multi: true,
    },
    {
      provide: BASE_PATH,
      useFactory: (configService: ConfigService) => {
        const url = configService.apiUrl;
        console.log('Initializing API BASE_PATH:', url);
        return url.endsWith('/v1') ? url.substring(0, url.length - 3) : url;
      },
      deps: [ConfigService],
    },
    importProvidersFrom(
      TranslateModule.forRoot({
        defaultLanguage: 'en',
      }),
    ),
    provideTranslateHttpLoader({
      prefix: 'assets/i18n/',
      suffix: '.json',
    }),
    {
      provide: MatPaginatorIntl,
      useClass: CustomPaginatorIntl,
    },
  ],
};
