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

import { Component, inject, effect, Renderer2, ViewEncapsulation } from '@angular/core';

import { TranslateModule } from '@ngx-translate/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { GuidanceService } from '../../../core/services/guidance.service';

@Component({
  selector: 'app-guidance-tour',
  standalone: true,
  imports: [TranslateModule, MatCardModule, MatButtonModule, MatIconModule],
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class.active]': 'guidanceService.isPlaying()',
  },
  template: `
    @if (guidanceService.isPlaying() && guidanceService.currentStep()) {
      <div class="guidance-overlay">
        <mat-card class="guidance-card">
          <mat-card-header>
            <mat-card-title>
              <mat-icon>help_outline</mat-icon>
              {{ guidanceService.currentStep()?.titleKey | translate }}
            </mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <p>{{ guidanceService.currentStep()?.descriptionKey | translate }}</p>
            <div class="progress-info">
              Step {{ guidanceService.currentStepIndex() + 1 }} of
              {{ guidanceService.activeSteps().length }}
            </div>
          </mat-card-content>
          <mat-card-actions class="guidance-actions">
            <button mat-button (click)="onExit()">Exit</button>
            <span class="guidance-spacer"></span>
            <button
              mat-button
              [disabled]="guidanceService.currentStepIndex() === 0"
              (click)="onBack()"
            >
              Back
            </button>
            <button mat-raised-button color="primary" (click)="onNext()">
              {{
                guidanceService.currentStepIndex() === guidanceService.activeSteps().length - 1
                  ? 'Finish'
                  : 'Next'
              }}
            </button>
          </mat-card-actions>
        </mat-card>
      </div>
    }
  `,
  styles: [
    `
      :host {
        display: none;
      }
      :host.active {
        display: block;
        position: fixed;
        z-index: 10000;
      }
      .guidance-overlay {
        position: fixed;
        bottom: 24px;
        right: 24px;
        z-index: 10000;
        max-width: 360px;
        animation: guidanceSlideUp 0.3s ease-out;
      }
      .guidance-card {
        border-left: 5px solid #3f51b5;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15) !important;
        background: #fff !important;
      }
      .guidance-card mat-card-title {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 16px;
        font-weight: 600;
        color: #2c3e50;
      }
      .guidance-card p {
        margin: 12px 0;
        font-size: 14px;
        color: #5f6368;
        line-height: 1.5;
      }
      .progress-info {
        font-size: 12px;
        color: #9aa0a6;
        font-weight: 500;
        margin-top: 8px;
      }
      .guidance-actions {
        display: flex;
        justify-content: flex-end;
        gap: 8px;
        padding: 8px 16px;
      }
      .guidance-spacer {
        flex: 1 1 auto;
      }

      /* Global highlight class for targeted elements */
      .guidance-highlight {
        outline: 4px solid #ff9800 !important;
        outline-offset: 4px;
        transition: outline 0.2s ease-in-out;
        z-index: 9999 !important;
        position: relative;
      }

      @keyframes guidanceSlideUp {
        from {
          transform: translateY(20px);
          opacity: 0;
        }
        to {
          transform: translateY(0);
          opacity: 1;
        }
      }
    `,
  ],
})
export class GuidanceTourComponent {
  protected readonly guidanceService = inject(GuidanceService);
  private readonly renderer = inject(Renderer2);

  private activeTarget: HTMLElement | null = null;

  constructor() {
    effect(() => {
      const step = this.guidanceService.currentStep();
      const isPlaying = this.guidanceService.isPlaying();

      // Clean up previous highlight
      if (this.activeTarget) {
        this.renderer.removeClass(this.activeTarget, 'guidance-highlight');
        this.activeTarget = null;
      }

      if (isPlaying && step?.targetSelector) {
        const el = document.querySelector(step.targetSelector) as HTMLElement;
        if (el) {
          this.activeTarget = el;
          this.renderer.addClass(el, 'guidance-highlight');
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    });
  }

  onNext() {
    this.guidanceService.nextStep();
  }

  onBack() {
    this.guidanceService.previousStep();
  }

  onExit() {
    this.guidanceService.endTour();
  }
}
