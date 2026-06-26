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

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OidcConfigComponent } from './oidc-config.component';
import { TenantOIDCConfigurationService } from '../../../api';
import { of } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { provideNoopAnimations } from '@angular/platform-browser/animations';

describe('OidcConfigComponent', () => {
  const NEW_ISSUER = 'https://new';
  let component: OidcConfigComponent;
  let fixture: ComponentFixture<OidcConfigComponent>;
  let serviceSpy: jasmine.SpyObj<TenantOIDCConfigurationService>;

  beforeEach(async () => {
    serviceSpy = jasmine.createSpyObj('TenantOIDCConfigurationService', [
      'getTenantsTenantIdOidcConfig',
      'postTenantsTenantIdOidcConfig',
      'putTenantsTenantIdOidcConfig',
      'deleteTenantsTenantIdOidcConfig',
    ]);
    serviceSpy.getTenantsTenantIdOidcConfig.and.returnValue(
      of(JSON.stringify({ issuer: 'https://idp', clientId: 'abc' })) as unknown as ReturnType<
        TenantOIDCConfigurationService['getTenantsTenantIdOidcConfig']
      >,
    );
    serviceSpy.putTenantsTenantIdOidcConfig.and.returnValue(
      of('') as unknown as ReturnType<
        TenantOIDCConfigurationService['putTenantsTenantIdOidcConfig']
      >,
    );
    serviceSpy.postTenantsTenantIdOidcConfig.and.returnValue(
      of('') as unknown as ReturnType<
        TenantOIDCConfigurationService['postTenantsTenantIdOidcConfig']
      >,
    );
    serviceSpy.deleteTenantsTenantIdOidcConfig.and.returnValue(
      of('') as unknown as ReturnType<
        TenantOIDCConfigurationService['deleteTenantsTenantIdOidcConfig']
      >,
    );

    await TestBed.configureTestingModule({
      imports: [OidcConfigComponent, TranslateModule.forRoot()],
      providers: [
        { provide: TenantOIDCConfigurationService, useValue: serviceSpy },
        provideNoopAnimations(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(OidcConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should parse the config string on load', () => {
    expect(component).toBeTruthy();
    expect(serviceSpy.getTenantsTenantIdOidcConfig).toHaveBeenCalledWith('default');
    expect(component.config.issuer).toBe('https://idp');
    expect(component.exists).toBeTrue();
  });

  it('should update via put when config exists', () => {
    component.config = { issuer: NEW_ISSUER };
    component.onSave();
    expect(serviceSpy.putTenantsTenantIdOidcConfig).toHaveBeenCalledWith(
      'default',
      JSON.stringify({ issuer: NEW_ISSUER }),
    );
  });

  it('should create via post when no config exists', () => {
    component.exists = false;
    component.config = { issuer: NEW_ISSUER };
    component.onSave();
    expect(serviceSpy.postTenantsTenantIdOidcConfig).toHaveBeenCalled();
  });
});
