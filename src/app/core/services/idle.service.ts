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

import { Injectable, inject, NgZone, OnDestroy, effect } from '@angular/core';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { fromEvent, merge, Subscription, throttleTime } from 'rxjs';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { InactivityDialogComponent } from '../../layout/inactivity-dialog.component';

/**
 * Service responsible for monitoring user activity and managing session timeouts.
 *
 * When a user is authenticated, it listens for global activity events (mouse, keyboard, etc.)
 * and maintains an idle timer. If the user is inactive for a set period, it displays a
 * warning dialog and eventually logs the user out.
 */
@Injectable({
  providedIn: 'root',
})
export class IdleService implements OnDestroy {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly ngZone = inject(NgZone);
  private readonly dialog = inject(MatDialog);

  private idleSubscription?: Subscription;
  private timeoutId: ReturnType<typeof setTimeout> | null = null;
  private dialogRef: MatDialogRef<InactivityDialogComponent> | null = null;

  // Configuration
  /** Total time of inactivity allowed before forced logout (15 minutes) */
  private readonly IDLE_TIMEOUT = 15 * 60 * 1000;
  /** Time before final logout when the warning dialog should be shown (2 minutes) */
  private readonly WARNING_TIME = 2 * 60 * 1000;

  constructor() {
    // Automatically start/stop monitoring based on authentication state
    effect(() => {
      if (this.authService.isAuthenticated()) {
        this.startMonitoring();
      } else {
        this.stopMonitoring();
      }
    });
  }

  /**
   * Initializes activity monitoring using global window events.
   *
   * Events are throttled and monitoring runs outside the Angular zone
   * to avoid unnecessary change detection cycles.
   */
  private startMonitoring(): void {
    this.stopMonitoring();

    this.ngZone.runOutsideAngular(() => {
      const activityEvents$ = merge(
        fromEvent(window, 'mousemove'),
        fromEvent(window, 'keydown'),
        fromEvent(window, 'click'),
        fromEvent(window, 'scroll'),
        fromEvent(window, 'touchstart'),
      ).pipe(throttleTime(5000));

      this.idleSubscription = activityEvents$.subscribe(() => {
        // Only reset the timer if the warning dialog is not currently open
        if (!this.dialogRef) {
          this.resetTimer();
        }
      });
    });

    this.resetTimer();
  }

  /**
   * Stops monitoring and performs cleanup of subscriptions and timers.
   */
  private stopMonitoring(): void {
    this.clearTimers();
    this.idleSubscription?.unsubscribe();
    this.closeDialog();
  }

  /**
   * Clears the current inactivity timeout timer.
   */
  private clearTimers(): void {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
  }

  /**
   * Resets the inactivity timer to wait until the next warning threshold.
   */
  private resetTimer(): void {
    this.clearTimers();

    const timeToWarning = this.IDLE_TIMEOUT - this.WARNING_TIME;

    this.timeoutId = setTimeout(() => {
      this.showInactivityWarning();
    }, timeToWarning);
  }

  /**
   * Opens the inactivity warning dialog and sets a final logout timer.
   */
  private showInactivityWarning(): void {
    this.ngZone.run(() => {
      if (this.dialogRef) return;

      this.dialogRef = this.dialog.open(InactivityDialogComponent, {
        disableClose: true,
        width: '400px',
      });

      this.dialogRef.afterClosed().subscribe((shouldExtend: boolean) => {
        this.dialogRef = null;
        if (shouldExtend) {
          this.resetTimer();
        } else {
          this.logoutDueToInactivity();
        }
      });

      // Also set a hard logout timeout if the user fails to respond to the dialog
      this.timeoutId = setTimeout(() => {
        this.logoutDueToInactivity();
      }, this.WARNING_TIME);
    });
  }

  /**
   * Forces a user logout and redirects to the login page due to inactivity.
   */
  private logoutDueToInactivity(): void {
    this.ngZone.run(() => {
      if (this.authService.isAuthenticated()) {
        console.warn('Session expired due to inactivity.');
        this.closeDialog();
        this.authService.logout();
        this.router.navigate(['/login'], { queryParams: { reason: 'inactivity' } });
      }
    });
  }

  /**
   * Safely closes the warning dialog if it is open.
   */
  private closeDialog(): void {
    if (this.dialogRef) {
      this.dialogRef.close();
      this.dialogRef = null;
    }
  }

  /**
   * Angular lifecycle hook to ensure cleanup when the service is destroyed.
   */
  ngOnDestroy(): void {
    this.stopMonitoring();
  }
}
