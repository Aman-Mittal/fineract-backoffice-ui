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

import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-status-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span class="status-badge" [ngClass]="colorClass">
      {{ statusName }}
    </span>
  `,
  styles: [
    `
      .status-badge {
        display: inline-flex;
        align-items: center;
        padding: 4px 12px;
        border-radius: 16px;
        font-size: 12px;
        font-weight: 600;
        letter-spacing: 0.5px;
        text-transform: uppercase;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
      }

      .status-active {
        background-color: #e6f4ea;
        color: #1e8e3e;
        border: 1px solid #ceead6;
      }

      .status-pending {
        background-color: #fef7e0;
        color: #f29900;
        border: 1px solid #feefc3;
      }

      .status-closed,
      .status-rejected {
        background-color: #fce8e6;
        color: #d93025;
        border: 1px solid #fad2cf;
      }

      .status-default {
        background-color: #f1f3f4;
        color: #5f6368;
        border: 1px solid #e8eaed;
      }
    `,
  ],
})
export class StatusBadgeComponent {
  /** The full status object or just the code string from Fineract */
  @Input() status: Record<string, unknown> | string | undefined;

  get statusName(): string {
    if (!this.status) return 'UNKNOWN';
    if (typeof this.status === 'string') return this.status;
    return (this.status['value'] as string) || (this.status['code'] as string) || 'UNKNOWN';
  }

  get colorClass(): string {
    if (!this.status) return 'status-default';

    const code =
      typeof this.status === 'string'
        ? this.status.toLowerCase()
        : (this.status['code'] as string)?.toLowerCase() || '';
    const value =
      typeof this.status === 'string'
        ? this.status.toLowerCase()
        : (this.status['value'] as string)?.toLowerCase() || '';

    if (code.includes('active') || value.includes('active') || value.includes('approved')) {
      return 'status-active';
    }
    if (code.includes('pending') || value.includes('pending') || value.includes('submitted')) {
      return 'status-pending';
    }
    if (
      code.includes('closed') ||
      value.includes('closed') ||
      code.includes('rejected') ||
      value.includes('rejected') ||
      code.includes('deleted')
    ) {
      return 'status-closed';
    }

    return 'status-default';
  }
}
