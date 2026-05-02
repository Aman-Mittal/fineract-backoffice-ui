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
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-search-filter',
  standalone: true,
  imports: [CommonModule, MatFormFieldModule, MatInputModule, MatIconModule, MatTooltipModule],
  template: `
    <mat-form-field appearance="outline" class="search-field" [matTooltip]="tooltipText">
      <mat-label>{{ label }}</mat-label>
      <input matInput (keyup)="onKeyUp($event)" [placeholder]="placeholder" />
      <mat-icon matSuffix>search</mat-icon>
    </mat-form-field>
  `,
  styles: [
    `
      .search-field {
        width: 100%;
        max-width: 400px;
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

  onKeyUp(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.searchSubject.next(value.trim());
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }
}
