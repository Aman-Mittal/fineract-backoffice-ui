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

import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AuthService } from '../core/services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import {
  MatAutocompleteModule,
  MatAutocompleteSelectedEvent,
} from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged, switchMap, of } from 'rxjs';
import { GuidanceService } from '../core/services/guidance.service';
import { SidebarService } from '../core/services/sidebar.service';
import { ThemeService } from '../core/services/theme.service';
import { SearchAPIService, GetSearchResponse, BusinessDateManagementService } from '../api';

/**
 * Top-level application header component.
 *
 * Contains the branding logo, application title, current user information,
 * language selector, and the global logout action.
 */
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TranslateModule,
    MatIconModule,
    MatTooltipModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
  ],
  template: `
    <header class="header" role="banner">
      <div class="logo-section">
        <button
          class="toggle-btn"
          (click)="sidebarService.toggle()"
          [attr.aria-label]="'Toggle Sidebar'"
        >
          <mat-icon>{{ sidebarService.isCollapsed() ? 'menu' : 'menu_open' }}</mat-icon>
        </button>
        <img src="favicon.png" alt="Fineract Logo" class="logo" />
        <span class="app-title">{{ 'app.title' | translate }}</span>
      </div>

      <div class="search-section">
        <mat-form-field appearance="outline" class="global-search-field">
          <mat-icon matPrefix>search</mat-icon>
          <input
            matInput
            [placeholder]="'COMMON.SEARCH' | translate"
            [(ngModel)]="searchQuery"
            [matAutocomplete]="auto"
            (input)="onSearchKeyUp()"
          />
          <mat-autocomplete
            #auto="matAutocomplete"
            (optionSelected)="onResultSelected($event)"
            [displayWith]="displayFn"
          >
            @for (result of searchResults(); track result.entityId) {
              <mat-option [value]="result">
                <div class="search-result-item">
                  <span class="result-type">{{ result.entityType }}</span>
                  <span class="result-name">{{ result.entityName }}</span>
                  @if (result.entityAccountNo) {
                    <span class="result-acc">#{{ result.entityAccountNo }}</span>
                  }
                </div>
              </mat-option>
            }
          </mat-autocomplete>
        </mat-form-field>
      </div>

      <div class="header-actions">
        <div class="system-info">
          <div class="info-group">
            <span class="label">{{ 'COMMON.BUSINESS_DATE' | translate }}:</span>
            <span class="value">{{ businessDate() }}</span>
          </div>
          <div class="info-group">
            <span class="label">{{ 'COMMON.RENDER_TIME' | translate }}:</span>
            <span class="value">{{ renderTime() }}</span>
          </div>
        </div>

        <button
          class="theme-toggle-btn"
          (click)="themeService.toggleDarkMode()"
          [matTooltip]="'COMMON.TOGGLE_THEME' | translate"
        >
          <mat-icon>{{ themeService.isDarkMode() ? 'light_mode' : 'dark_mode' }}</mat-icon>
        </button>

        <button class="tour-btn" (click)="startTour()" [attr.aria-label]="'Help Tour'">
          <mat-icon>explore</mat-icon>
          Guide
        </button>

        <div class="user-info">
          <span class="username">{{ authService.username() }}</span>
          <span class="office">{{ authService.officeName() }}</span>
        </div>

        <select
          id="lang-select"
          #langSelect
          (change)="switchLanguage(langSelect.value)"
          [attr.aria-label]="'app.language.select' | translate"
        >
          <option value="en" [selected]="translate.getCurrentLang() === 'en'">
            {{ 'app.language.en' | translate }}
          </option>
          <option value="hi" [selected]="translate.getCurrentLang() === 'hi'">
            {{ 'app.language.hi' | translate }}
          </option>
          <option value="ko" [selected]="translate.getCurrentLang() === 'ko'">
            {{ 'app.language.ko' | translate }}
          </option>
        </select>

        <button class="logout-btn" (click)="logout()" [attr.aria-label]="'app.logout' | translate">
          {{ 'app.logout' | translate }}
        </button>
      </div>
    </header>
  `,
  styles: [
    `
      .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 1.5rem;
        height: 64px;
        background-color: var(--card-bg);
        color: var(--text-color);
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        z-index: 1000;
        transition:
          background-color 0.2s,
          color 0.2s;
      }
      .logo-section {
        display: flex;
        align-items: center;
        gap: 1rem;
      }
      .search-section {
        flex: 1;
        max-width: 500px;
        margin: 0 2rem;
      }
      .global-search-field {
        width: 100%;
      }
      .global-search-field ::ng-deep .mat-mdc-form-field-wrapper {
        padding-bottom: 0;
      }
      .global-search-field ::ng-deep .mat-mdc-form-field-flex {
        height: 40px;
        align-items: center;
      }
      .search-result-item {
        display: flex;
        gap: 12px;
        align-items: center;
        font-size: 14px;
      }
      .result-type {
        background: #f0f2f5;
        padding: 2px 6px;
        border-radius: 4px;
        font-size: 11px;
        text-transform: uppercase;
        color: #666;
        font-weight: 600;
      }
      .result-acc {
        color: #888;
        font-size: 12px;
      }
      .system-info {
        display: flex;
        flex-direction: column;
        gap: 2px;
        font-size: 11px;
        margin-right: 1rem;
        padding: 4px 8px;
        background: rgba(0, 0, 0, 0.05);
        border-radius: 4px;
      }
      .info-group {
        display: flex;
        gap: 6px;
        white-space: nowrap;
      }
      .system-info .label {
        font-weight: 600;
        color: var(--text-muted);
        text-transform: uppercase;
      }
      .system-info .value {
        color: var(--primary-color);
        font-family: 'Roboto Mono', monospace;
      }
      .toggle-btn {
        background: none;
        border: none;
        color: #555;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0.5rem;
        border-radius: 4px;
        transition:
          background-color 0.2s,
          color 0.2s;
      }
      .toggle-btn:hover {
        background-color: #f0f2f5;
        color: #111;
      }
      .toggle-btn mat-icon {
        font-size: 24px;
        width: 24px;
        height: 24px;
      }
      .logo {
        height: 32px;
        width: 32px;
      }
      .app-title {
        font-size: 1.25rem;
        font-weight: 600;
        color: var(--primary-color);
      }
      .header-actions {
        display: flex;
        align-items: center;
        gap: 1.5rem;
      }
      .user-info {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        line-height: 1.2;
      }
      .username {
        font-weight: 600;
        font-size: 0.9rem;
        color: var(--text-color);
      }
      .office {
        font-size: 0.75rem;
        color: #666;
      }
      select {
        padding: 0.25rem 0.5rem;
        border-radius: 4px;
        border: 1px solid #ddd;
      }
      .logout-btn {
        padding: 0.5rem 1rem;
        background-color: #f44336;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 0.875rem;
      }
      .logout-btn:hover {
        background-color: #d32f2f;
      }
      .theme-toggle-btn {
        background: none;
        border: none;
        color: #555;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0.5rem;
        border-radius: 50%;
        transition: background-color 0.2s;
      }
      .theme-toggle-btn:hover {
        background-color: #f0f2f5;
      }
      .tour-btn {
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 0.5rem 0.75rem;
        background-color: #3f51b5;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 0.875rem;
        font-weight: 500;
        transition: background-color 0.2s;
      }
      .tour-btn:hover {
        background-color: #303f9f;
      }
      .tour-btn mat-icon {
        font-size: 18px;
        width: 18px;
        height: 18px;
      }
    `,
  ],
})
export class HeaderComponent implements OnInit {
  protected readonly authService = inject(AuthService);
  protected readonly translate = inject(TranslateService);
  protected readonly guidanceService = inject(GuidanceService);
  protected readonly sidebarService = inject(SidebarService);
  protected readonly themeService = inject(ThemeService);
  private readonly router = inject(Router);
  private readonly searchService = inject(SearchAPIService);
  private readonly businessDateService = inject(BusinessDateManagementService);

  searchQuery = '';
  searchResults = signal<GetSearchResponse[]>([]);
  private searchSubject = new Subject<string>();

  businessDate = signal<string>('-');
  renderTime = signal<string>('-');

  ngOnInit(): void {
    this.loadSystemInfo();
    this.searchSubject
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((query) => {
          if (!query || query.length < 2) return of([]);
          return this.searchService.searchData(query, 'clients,loans,savings');
        }),
      )
      .subscribe((results) => {
        this.searchResults.set(results);
      });
  }

  private loadSystemInfo() {
    this.businessDateService.getBusinessDates().subscribe({
      next: (dates) => {
        const bd = dates.find((d) => d.type === 'BUSINESS_DATE');
        if (bd && bd.date) {
          const d = bd.date as unknown as number[];
          this.businessDate.set(new Date(d[0], d[1] - 1, d[2]).toLocaleDateString());
        }
      },
    });

    const updateTime = () => {
      this.renderTime.set(
        new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      );
    };
    updateTime();
    setInterval(updateTime, 60000);
  }

  onSearchKeyUp() {
    this.searchSubject.next(this.searchQuery);
  }

  onResultSelected(event: MatAutocompleteSelectedEvent) {
    const result = event.option.value as GetSearchResponse;
    setTimeout(() => (this.searchQuery = ''), 0);

    if (result.entityType === 'CLIENT') {
      this.router.navigate(['/clients/view', result.entityId]);
    } else if (result.entityType === 'LOAN') {
      this.router.navigate(['/loans/view', result.entityId]);
    } else if (result.entityType === 'SAVINGSACCOUNT') {
      this.router.navigate(['/savings/view', result.entityId]);
    }
  }

  displayFn() {
    return '';
  }
  /**
   * Switches the application language at runtime.
   * @param lang - The target language code (e.g., 'en', 'hi', 'ko')
   */
  switchLanguage(lang: string) {
    this.translate.use(lang);
  }

  /**
   * Triggers the tour on the current active route.
   */
  startTour() {
    this.guidanceService.startTour(this.router.url);
  }

  /**
   * Triggers the global logout process and redirects to the login screen.
   */
  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
