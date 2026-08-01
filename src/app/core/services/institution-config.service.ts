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

import { Injectable, computed, inject, signal } from '@angular/core';
import { ConfigService } from './config.service';

/**
 * Category of institution the deployment serves. Determines which
 * product features (see {@link InstitutionFeature}) are exposed.
 */
export type InstitutionType = 'mfis' | 'cb' | 'cu' | 'universal';

/**
 * Group-lending product features that can be toggled by institution type.
 */
export type InstitutionFeature = 'groups' | 'centers' | 'collection_sheet';

/**
 * What each institution type exposes when `config.json` does not say otherwise.
 *
 * Exported so a deployment overriding one type in configuration can see what it is
 * departing from, and so the type guard has a stable list of valid keys.
 */
export const DEFAULT_FEATURE_MATRIX: Record<InstitutionType, readonly InstitutionFeature[]> = {
  mfis: ['groups', 'centers', 'collection_sheet'],
  cb: [],
  cu: ['groups'],
  universal: ['groups', 'centers', 'collection_sheet'],
};

/**
 * Service that persists the deployment's institution type to local storage
 * and answers whether a given group-lending feature is enabled for it.
 *
 * This is the single source of truth for mode-based feature toggles. It is
 * consumed by RBAC sidebar filtering (issue #113) alongside permission checks.
 *
 * Both the default type and the matrix come from `config.json`, so a deployment can name
 * the kind of institution it serves once, for everyone, rather than relying on each user's
 * local storage happening to hold the right value.
 */
@Injectable({
  providedIn: 'root',
})
export class InstitutionConfigService {
  private readonly config = inject(ConfigService);
  private readonly storageKey = 'fineract_institution_type';

  /** Which features each institution type exposes, as configured for this deployment. */
  private readonly featureMatrix = computed<Record<InstitutionType, readonly InstitutionFeature[]>>(
    () => ({ ...DEFAULT_FEATURE_MATRIX, ...this.config.config().institutionFeatures }),
  );

  private readonly _institutionType = signal<InstitutionType>(this.getStored());

  /** Readonly access to the current institution type signal. */
  readonly institutionType = this._institutionType.asReadonly();

  /**
   * Persists the institution type to local storage and updates the signal.
   * @param type - The institution type to set
   */
  setInstitutionType(type: InstitutionType): void {
    localStorage.setItem(this.storageKey, type);
    this._institutionType.set(type);
  }

  /**
   * Returns whether the given feature is enabled for the current institution type.
   * @param feature - The feature to check
   */
  isFeatureEnabled(feature: InstitutionFeature): boolean {
    return this.featureMatrix()[this._institutionType()].includes(feature);
  }

  /**
   * Retrieves the initial institution type from local storage, falling back to the type
   * this deployment configured when absent or invalid (e.g. a tampered or legacy value).
   * @returns The resolved institution type
   */
  private getStored(): InstitutionType {
    const stored = localStorage.getItem(this.storageKey);
    return this.isInstitutionType(stored) ? stored : this.config.config().institutionType;
  }

  /**
   * Type guard validating a raw string against the {@link InstitutionType} union.
   * @param value - The value read from local storage
   */
  private isInstitutionType(value: string | null): value is InstitutionType {
    return value !== null && Object.keys(DEFAULT_FEATURE_MATRIX).includes(value);
  }
}
