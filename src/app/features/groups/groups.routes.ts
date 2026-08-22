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

import { authGuard } from '../../core/guards/auth.guard';
import { permissionGuard } from '../../core/guards/permission.guard';
import { Routes } from '@angular/router';

export const GROUPS_ROUTES: Routes = [
  {
    path: '',
    canActivate: [authGuard, permissionGuard],
    data: { permissions: 'READ_GROUP' },
    title: 'nav.groups',
    loadComponent: () => import('./groups-list.component').then((m) => m.GroupsListComponent),
  },
  {
    path: 'create',
    canActivate: [authGuard, permissionGuard],
    data: { permissions: 'CREATE_GROUP' },
    title: 'GROUPS.CREATE_GROUP',
    loadComponent: () => import('./group-form.component').then((m) => m.GroupFormComponent),
  },
  {
    path: 'edit/:id',
    canActivate: [authGuard, permissionGuard],
    data: { permissions: 'UPDATE_GROUP' },
    title: 'GROUPS.EDIT_GROUP',
    loadComponent: () => import('./group-form.component').then((m) => m.GroupFormComponent),
  },
  {
    path: 'view/:id',
    canActivate: [authGuard, permissionGuard],
    data: { permissions: 'READ_GROUP' },
    title: 'GROUPS.GROUP_DETAILS',
    loadComponent: () => import('./group-view.component').then((m) => m.GroupViewComponent),
  },
  {
    path: ':groupId/notes/create',
    canActivate: [authGuard, permissionGuard],
    data: { permissions: 'CREATE_GROUPNOTE' },
    title: 'GROUPS.ADD_NOTE',
    loadComponent: () =>
      import('./group-note-form.component').then((m) => m.GroupNoteFormComponent),
  },
  {
    path: ':groupId/notes/edit/:id',
    canActivate: [authGuard, permissionGuard],
    data: { permissions: 'UPDATE_GROUPNOTE' },
    title: 'GROUPS.EDIT_NOTE',
    loadComponent: () =>
      import('./group-note-form.component').then((m) => m.GroupNoteFormComponent),
  },
  {
    path: ':groupId/glim/create',
    canActivate: [authGuard, permissionGuard],
    data: { permissions: 'CREATE_LOAN' },
    title: 'GROUPS.CREATE_GLIM_LOAN',
    loadComponent: () =>
      import('./glim/create-glim-account.component').then((m) => m.CreateGlimAccountComponent),
  },
  {
    path: ':groupId/glim/view',
    canActivate: [authGuard, permissionGuard],
    data: { permissions: 'READ_LOAN' },
    title: 'GROUPS.GLIM_ACCOUNT_OVERVIEW',
    loadComponent: () =>
      import('./glim/glim-account-view.component').then((m) => m.GlimAccountViewComponent),
  },
  {
    path: ':groupId/glim/view/:glimId',
    canActivate: [authGuard, permissionGuard],
    data: { permissions: 'READ_LOAN' },
    title: 'GROUPS.GLIM_ACCOUNT_OVERVIEW',
    loadComponent: () =>
      import('./glim/glim-account-view.component').then((m) => m.GlimAccountViewComponent),
  },
  {
    path: ':groupId/gsim/create',
    canActivate: [authGuard, permissionGuard],
    data: { permissions: 'CREATE_SAVINGSACCOUNT' },
    title: 'GROUPS.CREATE_GSIM_SAVINGS',
    loadComponent: () =>
      import('./gsim/create-gsim-account.component').then((m) => m.CreateGsimAccountComponent),
  },
  {
    path: ':groupId/gsim/view',
    canActivate: [authGuard, permissionGuard],
    data: { permissions: 'READ_SAVINGSACCOUNT' },
    title: 'GROUPS.GSIM_ACCOUNT_OVERVIEW',
    loadComponent: () =>
      import('./gsim/gsim-account-view.component').then((m) => m.GsimAccountViewComponent),
  },
];
