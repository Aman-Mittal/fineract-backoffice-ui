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

import { Component, EventEmitter, Input, OnInit, Output, OnDestroy } from '@angular/core';

import { IonSearchbar } from '@ionic/angular/standalone';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-search-filter',
  standalone: true,
  imports: [IonSearchbar],
  template: `
    <ion-searchbar
      class="search-field"
      [placeholder]="placeholder || label"
      (ionInput)="onInput($event)"
      id="search-filter-input"
      data-testid="search-filter-input"
      [attr.title]="tooltipText"
    ></ion-searchbar>
  `,
  styles: [
    `
      .search-field {
        width: 100%;
        max-width: 400px;
        --box-shadow: none;
        --border-radius: 8px;
        padding: 0;
      }
    `,
  ],
})
export class SearchFilterComponent implements OnInit, OnDestroy {
  @Input() label = 'Search';
  @Input() placeholder = 'Search...';
  @Input() tooltipText = 'Filter list results';
  @Output() searchChange = new EventEmitter<string>();

  private searchSubject = new Subject<string>();
  private subscription?: Subscription;

  ngOnInit() {
    this.subscription = this.searchSubject
      .pipe(debounceTime(400), distinctUntilChanged())
      .subscribe((value) => {
        this.searchChange.emit(value);
      });
  }

  onInput(event: Event | CustomEvent) {
    const customEvt = event as CustomEvent;
    const value =
      (customEvt.detail?.value as string) || (event.target as HTMLInputElement)?.value || '';
    this.searchSubject.next(value.trim());
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }
}
