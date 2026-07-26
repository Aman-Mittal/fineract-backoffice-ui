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

import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { TenantOIDCConfigurationService } from '../../../api';
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonInput,
  IonItem,
  IonLabel,
} from '@ionic/angular/standalone';

interface OidcConfig {
  issuer?: string;
  clientId?: string;
  clientSecret?: string;
  authorizationEndpoint?: string;
  tokenEndpoint?: string;
  jwksUrl?: string;
  enabled?: boolean;
}

/**
 * Tenant OIDC configuration editor. The service get/post/put endpoints exchange
 * a raw JSON string body, so the config is parsed on load and stringified on save.
 * The tenant id is a simple input (defaults to 'default').
 */
@Component({
  selector: 'app-oidc-config',
  standalone: true,
  imports: [
    FormsModule,
    TranslateModule,
    IonButton,
    IonInput,
    IonItem,
    IonLabel,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonCard,
  ],
  template: `
    <div class="oidc-container">
      <ion-card>
        <ion-card-header>
          <ion-card-title>{{ 'OIDC_CONFIG.TITLE' | translate }}</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <form class="oidc-form">
            <ion-item fill="outline">
              <ion-label position="stacked">{{ 'OIDC_CONFIG.TENANT_ID' | translate }}</ion-label>
              <ion-input name="tenantId" [(ngModel)]="tenantId"></ion-input>
            </ion-item>
            <div class="load-action">
              <ion-button fill="clear" type="button" (click)="load()">
                {{ 'OIDC_CONFIG.LOAD' | translate }}
              </ion-button>
            </div>

            <ion-item fill="outline">
              <ion-label position="stacked">{{ 'OIDC_CONFIG.ISSUER' | translate }}</ion-label>
              <ion-input name="issuer" [(ngModel)]="config.issuer"></ion-input>
            </ion-item>
            <ion-item fill="outline">
              <ion-label position="stacked">{{ 'OIDC_CONFIG.CLIENT_ID' | translate }}</ion-label>
              <ion-input name="clientId" [(ngModel)]="config.clientId"></ion-input>
            </ion-item>
            <ion-item fill="outline">
              <ion-label position="stacked">{{
                'OIDC_CONFIG.CLIENT_SECRET' | translate
              }}</ion-label>
              <ion-input name="clientSecret" [(ngModel)]="config.clientSecret"></ion-input>
            </ion-item>
            <ion-item fill="outline">
              <ion-label position="stacked">{{
                'OIDC_CONFIG.AUTH_ENDPOINT' | translate
              }}</ion-label>
              <ion-input name="authEndpoint" [(ngModel)]="config.authorizationEndpoint"></ion-input>
            </ion-item>
            <ion-item fill="outline">
              <ion-label position="stacked">{{
                'OIDC_CONFIG.TOKEN_ENDPOINT' | translate
              }}</ion-label>
              <ion-input name="tokenEndpoint" [(ngModel)]="config.tokenEndpoint"></ion-input>
            </ion-item>
            <ion-item fill="outline">
              <ion-label position="stacked">{{ 'OIDC_CONFIG.JWKS_URL' | translate }}</ion-label>
              <ion-input name="jwksUrl" [(ngModel)]="config.jwksUrl"></ion-input>
            </ion-item>

            <div class="actions">
              <ion-button fill="clear" type="button" color="warn" (click)="onDelete()">
                {{ 'COMMON.DELETE' | translate }}
              </ion-button>
              <ion-button color="primary" type="button" [disabled]="isSaving" (click)="onSave()">
                {{ 'COMMON.SAVE' | translate }}
              </ion-button>
            </div>
          </form>
        </ion-card-content>
      </ion-card>
    </div>
  `,
  styles: [
    `
      .oidc-container {
        padding: 24px;
        max-width: 600px;
        margin: 0 auto;
      }
      .oidc-form {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }
      .actions {
        display: flex;
        justify-content: flex-end;
        gap: 12px;
        margin-top: 16px;
      }
    `,
  ],
})
export class OidcConfigComponent implements OnInit {
  private readonly oidcService = inject(TenantOIDCConfigurationService);

  tenantId = 'default';
  exists = false;
  isSaving = false;
  config: OidcConfig = {};

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.oidcService.getTenantsTenantIdOidcConfig(this.tenantId).subscribe({
      next: (body: string) => {
        this.exists = !!body;
        this.config = body ? (JSON.parse(body) as OidcConfig) : {};
      },
      error: (err: unknown) => {
        this.exists = false;
        this.config = {};
        console.error('Failed to load OIDC config', err);
      },
    });
  }

  onSave(): void {
    this.isSaving = true;
    const body = JSON.stringify(this.config);
    const request$ = this.exists
      ? this.oidcService.putTenantsTenantIdOidcConfig(this.tenantId, body)
      : this.oidcService.postTenantsTenantIdOidcConfig(this.tenantId, body);
    request$.subscribe({
      next: () => {
        this.isSaving = false;
        this.load();
      },
      error: (err: unknown) => {
        this.isSaving = false;
        console.error('Failed to save OIDC config', err);
      },
    });
  }

  onDelete(): void {
    if (!window.confirm('Delete the OIDC configuration for this tenant?')) return;
    this.oidcService.deleteTenantsTenantIdOidcConfig(this.tenantId).subscribe({
      next: () => {
        this.exists = false;
        this.config = {};
      },
      error: (err: unknown) => console.error('Failed to delete OIDC config', err),
    });
  }
}
