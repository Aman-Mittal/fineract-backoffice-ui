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

export const environment = {
  production: false,
  fineractApiUrl: '/fineract-provider/api/v1',
  /**
   * Enables role-based access control (RBAC) in the UI. When `false`, the
   * sidebar shows all navigation items and permission/institution directives
   * render everything, preserving pre-RBAC behavior for existing deployments.
   * When `true`, the sidebar filters by permissions and institution config.
   */
  rbacEnabled: true,
};
