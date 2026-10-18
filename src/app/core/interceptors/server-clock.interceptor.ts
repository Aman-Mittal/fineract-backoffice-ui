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

import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { tap } from 'rxjs/operators';

import { PlatformDateService } from '../services/platform-date.service';

/**
 * Learns the platform's clock from the traffic the application already makes.
 *
 * Every HTTP response carries a `Date` header, and it is one of the few headers a browser
 * exposes without the server opting in (CORS-safelisted). Reading it costs nothing and removes
 * the browser's clock from every date this application defaults — which is the defect behind
 * #758: a browser ahead of the tenant offers a date the platform refuses as "in the future",
 * and the user is left editing dates by trial and error.
 *
 * Deliberately not a request of its own. A clock that needs fetching would be stale by the time
 * a form asked for it, and would add a round trip to every cold start.
 */
export const serverClockInterceptor: HttpInterceptorFn = (req, next) => {
  const platformDate = inject(PlatformDateService);
  return next(req).pipe(
    tap((event) => {
      if (!(event instanceof HttpResponse)) return;
      const header = event.headers.get('Date');
      if (header) {
        platformDate.recordServerTime(new Date(header));
      }
    }),
  );
};
