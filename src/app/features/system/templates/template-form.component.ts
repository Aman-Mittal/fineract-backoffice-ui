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
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';
import {
  TemplatesService,
  TemplateData,
  TemplateCreateRequest,
  TemplateUpdateRequest,
} from '../../../api';

@Component({
  selector: 'app-template-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    TranslateModule,
  ],
  template: `
    <mat-card>
      <mat-card-header>
        <mat-card-title>
          {{ (isEditMode ? 'TEMPLATES.EDIT_TITLE' : 'TEMPLATES.CREATE_TITLE') | translate }}
        </mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>{{ 'TEMPLATES.NAME' | translate }}</mat-label>
            <input matInput formControlName="name" />
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>{{ 'TEMPLATES.ENTITY' | translate }}</mat-label>
            <mat-select formControlName="entity">
              @for (opt of entityOptions; track opt.id) {
                <mat-option [value]="opt.id">{{ opt.label | translate }}</mat-option>
              }
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>{{ 'TEMPLATES.TYPE' | translate }}</mat-label>
            <mat-select formControlName="type">
              @for (opt of typeOptions; track opt.id) {
                <mat-option [value]="opt.id">{{ opt.label | translate }}</mat-option>
              }
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>{{ 'TEMPLATES.TEXT' | translate }}</mat-label>
            <textarea matInput formControlName="text" rows="10"></textarea>
          </mat-form-field>

          <div class="form-actions">
            <button mat-raised-button color="primary" type="submit" [disabled]="form.invalid">
              {{ 'TEMPLATES.SAVE' | translate }}
            </button>
            <button mat-button type="button" (click)="onCancel()">
              {{ 'TEMPLATES.CANCEL' | translate }}
            </button>
          </div>
        </form>
      </mat-card-content>
    </mat-card>
  `,
  styles: [
    `
      .full-width {
        width: 100%;
        display: block;
        margin-bottom: 16px;
      }
      .form-actions {
        display: flex;
        gap: 8px;
      }
    `,
  ],
})
export class TemplateFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly templatesService = inject(TemplatesService);

  private readonly TEMPLATES_PATH = '/system/templates';

  form!: FormGroup;
  isEditMode = false;
  templateId?: number;

  entityOptions = [
    { id: 0, label: 'TEMPLATES.ENTITY_CLIENT' },
    { id: 1, label: 'TEMPLATES.ENTITY_LOAN' },
  ];

  typeOptions = [
    { id: 0, label: 'TEMPLATES.TYPE_DOCUMENT' },
    { id: 2, label: 'TEMPLATES.TYPE_SMS' },
  ];

  ngOnInit(): void {
    this.form = this.fb.group({
      name: ['', Validators.required],
      entity: [null],
      type: [null],
      text: [''],
    });

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.templateId = +id;
      this.templatesService
        .getTemplatesTemplateId(this.templateId)
        .subscribe((data: TemplateData) => {
          this.form.patchValue({
            name: data.name ?? '',
            entity: data.entity ?? null,
            type: data.type ?? null,
            text: data.text ?? '',
          });
        });
    }
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    const payload: TemplateCreateRequest | TemplateUpdateRequest = {
      name: this.form.value.name,
      entity: this.form.value.entity,
      type: this.form.value.type,
      text: this.form.value.text,
    };

    if (this.isEditMode && this.templateId != null) {
      this.templatesService
        .putTemplatesTemplateId(this.templateId, payload as TemplateUpdateRequest)
        .subscribe(() => this.router.navigate([this.TEMPLATES_PATH]));
    } else {
      this.templatesService
        .postTemplates(payload as TemplateCreateRequest)
        .subscribe(() => this.router.navigate([this.TEMPLATES_PATH]));
    }
  }

  onCancel(): void {
    this.router.navigate([this.TEMPLATES_PATH]);
  }
}
