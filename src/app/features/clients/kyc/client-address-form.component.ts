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
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
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
    CommonModule,
    RouterModule,
    FormsModule,
    TranslateModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCheckboxModule,
    MatIconModule,
  ],
  template: `
    <div class="form-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>
            {{
              isEditMode
                ? ('CLIENTS.EDIT_ADDRESS' | translate)
                : ('CLIENTS.ADD_ADDRESS' | translate)
            }}
          </mat-card-title>
        </mat-card-header>

        <mat-card-content>
          <form #addressForm="ngForm" (ngSubmit)="onSubmit()" class="address-form">
            <div class="form-grid">
              <mat-form-field appearance="outline">
                <mat-label>{{ 'CLIENTS.ADDRESS_TYPE' | translate }}</mat-label>
                <mat-select name="addressTypeId" [(ngModel)]="address.addressTypeId" required>
                  @for (type of addressTypes(); track type.id) {
                    <mat-option [value]="type.id">{{ type.name }}</mat-option>
                  }
                </mat-select>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>{{ 'CLIENTS.ADDRESS_LINE_1' | translate }}</mat-label>
                <input matInput name="addressLine1" [(ngModel)]="address.addressLine1" required />
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>{{ 'CLIENTS.ADDRESS_LINE_2' | translate }}</mat-label>
                <input matInput name="addressLine2" [(ngModel)]="address.addressLine2" />
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>{{ 'CLIENTS.ADDRESS_LINE_3' | translate }}</mat-label>
                <input matInput name="addressLine3" [(ngModel)]="address.addressLine3" />
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>{{ 'CLIENTS.CITY' | translate }}</mat-label>
                <input matInput name="city" [(ngModel)]="address.city" />
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>{{ 'CLIENTS.TOWN_VILLAGE' | translate }}</mat-label>
                <input matInput name="townVillage" [(ngModel)]="address.townVillage" />
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>{{ 'CLIENTS.COUNTY_DISTRICT' | translate }}</mat-label>
                <input matInput name="countyDistrict" [(ngModel)]="address.countyDistrict" />
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>{{ 'CLIENTS.STATE' | translate }}</mat-label>
                <mat-select name="stateProvinceId" [(ngModel)]="address.stateProvinceId">
                  @for (state of states(); track state.id) {
                    <mat-option [value]="state.id">{{ state.name }}</mat-option>
                  }
                </mat-select>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>{{ 'CLIENTS.COUNTRY' | translate }}</mat-label>
                <mat-select name="countryId" [(ngModel)]="address.countryId">
                  @for (country of countries(); track country.id) {
                    <mat-option [value]="country.id">{{ country.name }}</mat-option>
                  }
                </mat-select>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>{{ 'CLIENTS.POSTAL_CODE' | translate }}</mat-label>
                <input matInput name="postalCode" [(ngModel)]="address.postalCode" />
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>{{ 'CLIENTS.LATITUDE' | translate }}</mat-label>
                <input matInput type="number" name="latitude" [(ngModel)]="address.latitude" />
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>{{ 'CLIENTS.LONGITUDE' | translate }}</mat-label>
                <input matInput type="number" name="longitude" [(ngModel)]="address.longitude" />
              </mat-form-field>
            </div>

            <div class="checkbox-group">
              <mat-checkbox name="isActive" [(ngModel)]="address.isActive">
                {{ 'COMMON.ACTIVE' | translate }}
              </mat-checkbox>
            </div>

            <div class="form-actions">
              <button mat-button type="button" (click)="onCancel()">
                {{ 'COMMON.CANCEL' | translate }}
              </button>
              <button
                mat-raised-button
                color="primary"
                type="submit"
                [disabled]="!addressForm.form.valid"
              >
                {{ 'COMMON.SAVE' | translate }}
              </button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [
    `
      .form-container {
        padding: 24px;
        max-width: 800px;
        margin: 0 auto;
      }
      .address-form {
        display: flex;
        flex-direction: column;
        gap: 16px;
        padding-top: 16px;
      }
      .form-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 16px;
      }
      .checkbox-group {
        margin: 8px 0;
      }
      .form-actions {
        display: flex;
        justify-content: flex-end;
        gap: 12px;
        margin-top: 16px;
      }
    `,
  ],
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
    this.addressService.getAddressesTemplate().subscribe((data: AddressData) => {
      this.addressTypes.set(data.addressTypeIdOptions || []);
      this.states.set(data.stateProvinceIdOptions || []);
      this.countries.set(data.countryIdOptions || []);
    });
  }

  loadAddressData(): void {
    this.addressService.getAddresses1(this.clientId).subscribe((data) => {
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
      this.addressService.updateClientAddress(this.clientId, this.address).subscribe({
        next: () => this.router.navigate([this.clientViewPath, this.clientId]),
        error: (err) => console.error('Failed to update address', err),
      });
    } else {
      // For creation, Fineract uses a 'type' query param in addClientAddress
      this.addressService
        .addClientAddress(this.clientId, this.address, this.address.addressTypeId)
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
