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

import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonGrid,
  IonRow,
  IonCol,
  IonItem,
  IonLabel,
  IonInput,
  IonSelect,
  IonSelectOption,
  IonToggle,
  IonButton,
} from '@ionic/angular/standalone';
import {
  ClientsAddressService,
  ClientAddressRequest,
  CodeValueData,
  AddressData,
} from '../../../api';

@Component({
  selector: 'app-client-address-form',
  standalone: true,
  imports: [
    FormsModule,
    TranslateModule,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonGrid,
    IonRow,
    IonCol,
    IonItem,
    IonLabel,
    IonInput,
    IonSelect,
    IonSelectOption,
    IonToggle,
    IonButton,
  ],
  template: `
    <div class="form-container">
      <ion-card>
        <ion-card-header>
          <ion-card-title>
            {{
              isEditMode
                ? ('CLIENTS.EDIT_ADDRESS' | translate)
                : ('CLIENTS.ADD_ADDRESS' | translate)
            }}
          </ion-card-title>
        </ion-card-header>

        <ion-card-content>
          <form #addressForm="ngForm" (ngSubmit)="onSubmit()" class="address-form">
            <ion-grid class="ion-no-padding">
              <ion-row>
                <ion-col size="12" size-md="6">
                  <ion-item fill="outline">
                    <ion-label position="stacked">{{
                      'CLIENTS.ADDRESS_TYPE' | translate
                    }}</ion-label>
                    <ion-select
                      [attr.aria-label]="'CLIENTS.ADDRESS_TYPE' | translate"
                      interface="popover"
                      name="addressTypeId"
                      [(ngModel)]="address.addressTypeId"
                      required
                      id="address-type-select"
                      data-testid="address-type-select"
                    >
                      @for (type of addressTypes(); track type.id) {
                        <ion-select-option [value]="type.id">{{ type.name }}</ion-select-option>
                      }
                    </ion-select>
                  </ion-item>
                </ion-col>

                <ion-col size="12" size-md="6">
                  <ion-item fill="outline">
                    <ion-label position="stacked">{{
                      'CLIENTS.ADDRESS_LINE_1' | translate
                    }}</ion-label>
                    <ion-input
                      [attr.aria-label]="'CLIENTS.ADDRESS_LINE_1' | translate"
                      type="text"
                      name="addressLine1"
                      [(ngModel)]="address.addressLine1"
                      required
                      id="address-line1-input"
                      data-testid="address-line1-input"
                    ></ion-input>
                  </ion-item>
                </ion-col>

                <ion-col size="12" size-md="6">
                  <ion-item fill="outline">
                    <ion-label position="stacked">{{
                      'CLIENTS.ADDRESS_LINE_2' | translate
                    }}</ion-label>
                    <ion-input
                      [attr.aria-label]="'CLIENTS.ADDRESS_LINE_2' | translate"
                      type="text"
                      name="addressLine2"
                      [(ngModel)]="address.addressLine2"
                      id="address-line2-input"
                      data-testid="address-line2-input"
                    ></ion-input>
                  </ion-item>
                </ion-col>

                <ion-col size="12" size-md="6">
                  <ion-item fill="outline">
                    <ion-label position="stacked">{{
                      'CLIENTS.ADDRESS_LINE_3' | translate
                    }}</ion-label>
                    <ion-input
                      [attr.aria-label]="'CLIENTS.ADDRESS_LINE_3' | translate"
                      type="text"
                      name="addressLine3"
                      [(ngModel)]="address.addressLine3"
                      id="address-line3-input"
                      data-testid="address-line3-input"
                    ></ion-input>
                  </ion-item>
                </ion-col>

                <ion-col size="12" size-md="6">
                  <ion-item fill="outline">
                    <ion-label position="stacked">{{ 'CLIENTS.CITY' | translate }}</ion-label>
                    <ion-input
                      [attr.aria-label]="'CLIENTS.CITY' | translate"
                      type="text"
                      name="city"
                      [(ngModel)]="address.city"
                      id="address-city-input"
                      data-testid="address-city-input"
                    ></ion-input>
                  </ion-item>
                </ion-col>

                <ion-col size="12" size-md="6">
                  <ion-item fill="outline">
                    <ion-label position="stacked">{{
                      'CLIENTS.TOWN_VILLAGE' | translate
                    }}</ion-label>
                    <ion-input
                      [attr.aria-label]="'CLIENTS.TOWN_VILLAGE' | translate"
                      type="text"
                      name="townVillage"
                      [(ngModel)]="address.townVillage"
                      id="address-town-input"
                      data-testid="address-town-input"
                    ></ion-input>
                  </ion-item>
                </ion-col>

                <ion-col size="12" size-md="6">
                  <ion-item fill="outline">
                    <ion-label position="stacked">{{
                      'CLIENTS.COUNTY_DISTRICT' | translate
                    }}</ion-label>
                    <ion-input
                      [attr.aria-label]="'CLIENTS.COUNTY_DISTRICT' | translate"
                      type="text"
                      name="countyDistrict"
                      [(ngModel)]="address.countyDistrict"
                      id="address-county-input"
                      data-testid="address-county-input"
                    ></ion-input>
                  </ion-item>
                </ion-col>

                <ion-col size="12" size-md="6">
                  <ion-item fill="outline">
                    <ion-label position="stacked">{{ 'CLIENTS.STATE' | translate }}</ion-label>
                    <ion-select
                      [attr.aria-label]="'CLIENTS.STATE' | translate"
                      interface="popover"
                      name="stateProvinceId"
                      [(ngModel)]="address.stateProvinceId"
                      id="address-state-select"
                      data-testid="address-state-select"
                    >
                      @for (state of states(); track state.id) {
                        <ion-select-option [value]="state.id">{{ state.name }}</ion-select-option>
                      }
                    </ion-select>
                  </ion-item>
                </ion-col>

                <ion-col size="12" size-md="6">
                  <ion-item fill="outline">
                    <ion-label position="stacked">{{ 'CLIENTS.COUNTRY' | translate }}</ion-label>
                    <ion-select
                      [attr.aria-label]="'CLIENTS.COUNTRY' | translate"
                      interface="popover"
                      name="countryId"
                      [(ngModel)]="address.countryId"
                      id="address-country-select"
                      data-testid="address-country-select"
                    >
                      @for (country of countries(); track country.id) {
                        <ion-select-option [value]="country.id">{{
                          country.name
                        }}</ion-select-option>
                      }
                    </ion-select>
                  </ion-item>
                </ion-col>

                <ion-col size="12" size-md="6">
                  <ion-item fill="outline">
                    <ion-label position="stacked">{{
                      'CLIENTS.POSTAL_CODE' | translate
                    }}</ion-label>
                    <ion-input
                      [attr.aria-label]="'CLIENTS.POSTAL_CODE' | translate"
                      type="text"
                      name="postalCode"
                      [(ngModel)]="address.postalCode"
                      id="address-postal-input"
                      data-testid="address-postal-input"
                    ></ion-input>
                  </ion-item>
                </ion-col>

                <ion-col size="12" size-md="6">
                  <ion-item fill="outline">
                    <ion-label position="stacked">{{ 'CLIENTS.LATITUDE' | translate }}</ion-label>
                    <ion-input
                      [attr.aria-label]="'CLIENTS.LATITUDE' | translate"
                      type="number"
                      name="latitude"
                      [(ngModel)]="address.latitude"
                      id="address-latitude-input"
                      data-testid="address-latitude-input"
                    ></ion-input>
                  </ion-item>
                </ion-col>

                <ion-col size="12" size-md="6">
                  <ion-item fill="outline">
                    <ion-label position="stacked">{{ 'CLIENTS.LONGITUDE' | translate }}</ion-label>
                    <ion-input
                      [attr.aria-label]="'CLIENTS.LONGITUDE' | translate"
                      type="number"
                      name="longitude"
                      [(ngModel)]="address.longitude"
                      id="address-longitude-input"
                      data-testid="address-longitude-input"
                    ></ion-input>
                  </ion-item>
                </ion-col>

                <ion-col size="12">
                  <ion-item>
                    <ion-label>{{ 'COMMON.ACTIVE' | translate }}</ion-label>
                    <ion-toggle
                      name="isActive"
                      [(ngModel)]="address.isActive"
                      id="address-active-toggle"
                      data-testid="address-active-toggle"
                      slot="end"
                    ></ion-toggle>
                  </ion-item>
                </ion-col>
              </ion-row>
            </ion-grid>

            <div class="form-actions">
              <ion-button
                fill="clear"
                color="medium"
                type="button"
                (click)="onCancel()"
                id="address-cancel-btn"
                data-testid="address-cancel-btn"
              >
                {{ 'COMMON.CANCEL' | translate }}
              </ion-button>
              <ion-button
                color="primary"
                type="submit"
                [disabled]="!addressForm.form.valid"
                id="address-submit-btn"
                data-testid="address-submit-btn"
              >
                {{ 'COMMON.SAVE' | translate }}
              </ion-button>
            </div>
          </form>
        </ion-card-content>
      </ion-card>
    </div>
  `,
})
export class ClientAddressFormComponent implements OnInit {
  private readonly addressService = inject(ClientsAddressService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  private readonly clientViewPath = '/clients/view';

  clientId!: number;
  addressId?: number;
  isEditMode = false;

  addressTypes = signal<CodeValueData[]>([]);
  states = signal<CodeValueData[]>([]);
  countries = signal<CodeValueData[]>([]);

  address: ClientAddressRequest = {
    addressTypeId: undefined,
    addressLine1: '',
    addressLine2: '',
    addressLine3: '',
    city: '',
    townVillage: '',
    countyDistrict: '',
    stateProvinceId: undefined,
    countryId: undefined,
    postalCode: '',
    latitude: undefined,
    longitude: undefined,
    isActive: true,
  };

  ngOnInit(): void {
    this.clientId = Number(this.route.snapshot.paramMap.get('clientId'));
    this.addressId = Number(this.route.snapshot.paramMap.get('id'));

    this.loadTemplate();

    if (this.addressId) {
      this.isEditMode = true;
      this.loadAddressData();
    }
  }

  loadTemplate(): void {
    this.addressService.getClientAddressesTemplate().subscribe((data: AddressData) => {
      this.addressTypes.set(data.addressTypeIdOptions || []);
      this.states.set(data.stateProvinceIdOptions || []);
      this.countries.set(data.countryIdOptions || []);
    });
  }

  loadAddressData(): void {
    this.addressService.getClientClientidAddresses(this.clientId).subscribe((data) => {
      const addr = data.find((a) => a.addressId === this.addressId);
      if (addr) {
        this.address = {
          addressId: addr.addressId,
          addressTypeId: addr.addressTypeId,
          addressLine1: addr.addressLine1,
          addressLine2: addr.addressLine2,
          addressLine3: addr.addressLine3,
          city: addr.city,
          townVillage: addr.townVillage,
          countyDistrict: addr.countyDistrict,
          stateProvinceId: addr.stateProvinceId,
          countryId: addr.countryId,
          postalCode: addr.postalCode,
          latitude: addr.latitude,
          longitude: addr.longitude,
          isActive: addr.isActive,
        };
      }
    });
  }

  onSubmit(): void {
    if (this.isEditMode) {
      this.addressService.putClientClientidAddresses(this.clientId, this.address).subscribe({
        next: () => this.router.navigate([this.clientViewPath, this.clientId]),
        error: (err) => console.error('Failed to update address', err),
      });
    } else {
      // For creation, Fineract uses a 'type' query param in addClientAddress
      this.addressService
        .postClientClientidAddresses(this.clientId, this.address, this.address.addressTypeId)
        .subscribe({
          next: () => this.router.navigate([this.clientViewPath, this.clientId]),
          error: (err) => console.error('Failed to add address', err),
        });
    }
  }

  onCancel(): void {
    this.router.navigate([this.clientViewPath, this.clientId]);
  }
}
