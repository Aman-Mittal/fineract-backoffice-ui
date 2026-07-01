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

import { Component, OnInit, signal, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { DecimalPipe } from '@angular/common';
import {
  ClientService,
  NotesService,
  GetClientsClientIdResponse,
  GetClientsLoanAccounts,
  GetClientsSavingsAccounts,
  PostClientsClientIdRequest,
} from '../../api';
import { StatusBadgeComponent } from '../../shared';
import { HasPermissionDirective } from '../../shared/directives/has-permission.directive';
import { resolveAccountActionType } from '../../core/utils/account-type-resolver';
import { ClientActionDialogComponent } from './client-action-dialog.component';
import {
  formatDateToFineract,
  FINERACT_DATE_FORMAT,
  FINERACT_LOCALE,
} from '../../core/utils/date-formatter';
import { ClientIdentifiersListComponent } from './tabs/client-identifiers-list.component';
import { ClientAddressesListComponent } from './tabs/client-addresses-list.component';
import { ClientFamilyMembersListComponent } from './tabs/client-family-members-list.component';
import { ClientNotesListComponent } from './tabs/client-notes-list.component';
import { ClientDocumentsListComponent } from './tabs/client-documents-list.component';
import { EntityDatatablesComponent } from '../../shared/components/entity-datatables/entity-datatables.component';

@Component({
  selector: 'app-client-view',
  standalone: true,
  imports: [
    RouterModule,
    TranslateModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatTabsModule,
    MatTableModule,
    MatTooltipModule,
    MatDialogModule,
    StatusBadgeComponent,
    HasPermissionDirective,
    ClientIdentifiersListComponent,
    ClientAddressesListComponent,
    ClientFamilyMembersListComponent,
    ClientNotesListComponent,
    ClientDocumentsListComponent,
    EntityDatatablesComponent,
    DecimalPipe,
  ],
  template: `
    <div class="view-container">
      @if (client()) {
        <div class="breadcrumb">
          <a routerLink="/clients">Clients</a> /
          <span>{{ client()?.displayName }}</span>
        </div>

        <mat-card class="header-card">
          <mat-card-content class="header-content">
            <div class="client-title-area">
              <div class="avatar-circle">
                <mat-icon>person</mat-icon>
              </div>
              <div class="title-details">
                <h2>{{ client()?.displayName }}</h2>
                <div class="subtitle-row">
                  <span class="account-no">#{{ client()?.accountNo }}</span>
                  <span class="divider">|</span>
                  <span class="office-name">{{ client()?.officeName }}</span>
                  <app-status-badge [status]="client()?.status"></app-status-badge>
                </div>
              </div>
            </div>

            <div class="actions-area">
              <button
                mat-stroked-button
                color="primary"
                (click)="onEditClient()"
                *appHasPermission="'UPDATE_CLIENT'"
              >
                <mat-icon>edit</mat-icon>
                {{ 'COMMON.EDIT' | translate }}
              </button>

              <button
                mat-stroked-button
                color="accent"
                [matMenuTriggerFor]="clientActionsMenu"
                *appHasPermission="[
                  'ACTIVATE_CLIENT',
                  'CLOSE_CLIENT',
                  'REJECT_CLIENT',
                  'WITHDRAW_CLIENT',
                  'DELETE_CLIENT',
                  'REACTIVATE_CLIENT',
                  'UNDOREJECT_CLIENT',
                  'UNDOWITHDRAW_CLIENT',
                ]"
              >
                <mat-icon>settings</mat-icon>
                {{ 'COMMON.ACTIONS' | translate }}
              </button>

              <mat-menu #clientActionsMenu="matMenu">
                @if (client()?.status?.id === 100) {
                  <button
                    mat-menu-item
                    (click)="onClientAction('activate')"
                    *appHasPermission="'ACTIVATE_CLIENT'"
                  >
                    <mat-icon>play_circle</mat-icon>
                    <span>{{ 'ACTIONS.ACTIVATE_CLIENT' | translate }}</span>
                  </button>
                  <button
                    mat-menu-item
                    (click)="onClientAction('reject')"
                    *appHasPermission="'REJECT_CLIENT'"
                  >
                    <mat-icon>report_off</mat-icon>
                    <span>{{ 'ACTIONS.REJECT_CLIENT' | translate }}</span>
                  </button>
                  <button
                    mat-menu-item
                    (click)="onClientAction('withdraw')"
                    *appHasPermission="'WITHDRAW_CLIENT'"
                  >
                    <mat-icon>cancel</mat-icon>
                    <span>{{ 'ACTIONS.WITHDRAW_CLIENT' | translate }}</span>
                  </button>
                  <button
                    mat-menu-item
                    (click)="onDeleteClient()"
                    *appHasPermission="'DELETE_CLIENT'"
                  >
                    <mat-icon>delete</mat-icon>
                    <span>{{ 'COMMON.DELETE' | translate }}</span>
                  </button>
                }
                @if (client()?.status?.id === 300) {
                  <button
                    mat-menu-item
                    (click)="onClientAction('close')"
                    *appHasPermission="'CLOSE_CLIENT'"
                  >
                    <mat-icon>close</mat-icon>
                    <span>{{ 'ACTIONS.CLOSE_CLIENT' | translate }}</span>
                  </button>
                }
                @if (client()?.status?.id === 600) {
                  <button
                    mat-menu-item
                    (click)="onClientAction('reactivate')"
                    *appHasPermission="'REACTIVATE_CLIENT'"
                  >
                    <mat-icon>replay</mat-icon>
                    <span>{{ 'ACTIONS.REACTIVATE_CLIENT' | translate }}</span>
                  </button>
                }
                @if (client()?.status?.id === 500) {
                  <button
                    mat-menu-item
                    (click)="onClientAction('undoReject')"
                    *appHasPermission="'UNDOREJECT_CLIENT'"
                  >
                    <mat-icon>undo</mat-icon>
                    <span>{{ 'ACTIONS.UNDO_REJECT_CLIENT' | translate }}</span>
                  </button>
                }
                @if (client()?.status?.id === 400) {
                  <button
                    mat-menu-item
                    (click)="onClientAction('undoWithdraw')"
                    *appHasPermission="'UNDOWITHDRAW_CLIENT'"
                  >
                    <mat-icon>undo</mat-icon>
                    <span>{{ 'ACTIONS.UNDO_WITHDRAW_CLIENT' | translate }}</span>
                  </button>
                }
              </mat-menu>

              <button mat-raised-button color="primary" [matMenuTriggerFor]="createMenu">
                <mat-icon>add</mat-icon>
                {{ 'ACTIONS.NEW_ACCOUNT' | translate }}
              </button>

              <mat-menu #createMenu="matMenu">
                <button mat-menu-item (click)="onCreateLoan()" *appHasPermission="'CREATE_LOAN'">
                  <mat-icon>account_balance</mat-icon>
                  <span>{{ 'ACTIONS.LOAN_ACCOUNT' | translate }}</span>
                </button>
                <button
                  mat-menu-item
                  (click)="onCreateSavings()"
                  *appHasPermission="'CREATE_SAVINGSACCOUNT'"
                >
                  <mat-icon>account_balance_wallet</mat-icon>
                  <span>{{ 'ACTIONS.SAVINGS_ACCOUNT' | translate }}</span>
                </button>
                <button
                  mat-menu-item
                  (click)="onCreateFixed()"
                  *appHasPermission="'CREATE_FIXEDDEPOSITACCOUNT'"
                >
                  <mat-icon>lock_clock</mat-icon>
                  <span>{{ 'ACTIONS.FIXED_DEPOSIT' | translate }}</span>
                </button>
                <button
                  mat-menu-item
                  (click)="onCreateRecurring()"
                  *appHasPermission="'CREATE_RECURRINGDEPOSITACCOUNT'"
                >
                  <mat-icon>replay_circle_filled</mat-icon>
                  <span>{{ 'ACTIONS.RECURRING_DEPOSIT' | translate }}</span>
                </button>
              </mat-menu>

              <button mat-button (click)="onBack()">
                <mat-icon>arrow_back</mat-icon>
                {{ 'COMMON.BACK' | translate }}
              </button>
            </div>
          </mat-card-content>
        </mat-card>

        <div class="content-body">
          <mat-tab-group class="tab-group" animationDuration="0ms">
            <!-- Client Details Tab -->
            <mat-tab [label]="'CLIENTS.DETAILS' | translate">
              <div class="tab-content">
                <div class="info-grid">
                  <mat-card class="info-card">
                    <mat-card-header>
                      <mat-card-title>
                        <mat-icon>badge</mat-icon>
                        {{ 'CLIENTS.GENERAL_PROFILE' | translate }}
                      </mat-card-title>
                    </mat-card-header>
                    <mat-card-content class="details-list">
                      <div class="detail-item">
                        <span class="label">{{ 'CLIENTS.FIRST_NAME' | translate }}</span>
                        <span class="value">{{ client()?.firstname || '-' }}</span>
                      </div>
                      <div class="detail-item">
                        <span class="label">{{ 'CLIENTS.LAST_NAME' | translate }}</span>
                        <span class="value">{{ client()?.lastname || '-' }}</span>
                      </div>
                      <div class="detail-item">
                        <span class="label">{{ 'COMMON.EXTERNAL_ID' | translate }}</span>
                        <span class="value">{{ client()?.externalId || '-' }}</span>
                      </div>
                      <div class="detail-item">
                        <span class="label">{{ 'CLIENTS.LEGAL_FORM' | translate }}</span>
                        <span class="value">{{ 'CLIENTS.PERSON' | translate }}</span>
                      </div>
                    </mat-card-content>
                  </mat-card>

                  <mat-card class="info-card">
                    <mat-card-header>
                      <mat-card-title>
                        <mat-icon>contact_mail</mat-icon>
                        {{ 'CLIENTS.CONTACT_STATUS' | translate }}
                      </mat-card-title>
                    </mat-card-header>
                    <mat-card-content class="details-list">
                      <div class="detail-item">
                        <span class="label">{{ 'COMMON.EMAIL' | translate }}</span>
                        <span class="value">{{ client()?.emailAddress || '-' }}</span>
                      </div>
                      <div class="detail-item">
                        <span class="label">{{ 'COMMON.ACTIVATION_DATE' | translate }}</span>
                        <span class="value">{{ formattedActivationDate }}</span>
                      </div>
                      <div class="detail-item">
                        <span class="label">{{ 'CLIENTS.TIMELINE_SUBMITTED' | translate }}</span>
                        <span class="value">{{ formattedSubmissionDate }}</span>
                      </div>
                    </mat-card-content>
                  </mat-card>
                </div>
              </div>
            </mat-tab>

            <!-- Savings Accounts Tab -->
            <mat-tab label="{{ 'CLIENTS.SAVINGS_ACCOUNTS' | translate }}">
              <div class="tab-content">
                <mat-card class="table-card">
                  <mat-card-content>
                    @if (savingsAccounts().length > 0) {
                      <table mat-table [dataSource]="savingsAccounts()" class="full-width-table">
                        <ng-container matColumnDef="accountNo">
                          <th mat-header-cell *matHeaderCellDef>
                            {{ 'COMMON.ACCOUNT_NO' | translate }}
                          </th>
                          <td mat-cell *matCellDef="let account">
                            <a
                              class="clickable-link"
                              [routerLink]="['/products/savings-accounts/view', account.id]"
                            >
                              {{ account.accountNo }}
                            </a>
                          </td>
                        </ng-container>

                        <ng-container matColumnDef="productName">
                          <th mat-header-cell *matHeaderCellDef>
                            {{ 'COMMON.PRODUCT' | translate }}
                          </th>
                          <td mat-cell *matCellDef="let account">{{ account.productName }}</td>
                        </ng-container>

                        <ng-container matColumnDef="balance">
                          <th mat-header-cell *matHeaderCellDef>
                            {{ 'COMMON.BALANCE' | translate }}
                          </th>
                          <td mat-cell *matCellDef="let account">
                            {{ account.currency?.displaySymbol }}
                            {{ account.accountBalance || 0 | number: '1.2-2' }}
                          </td>
                        </ng-container>

                        <ng-container matColumnDef="status">
                          <th mat-header-cell *matHeaderCellDef>
                            {{ 'COMMON.STATUS' | translate }}
                          </th>
                          <td mat-cell *matCellDef="let account">
                            <app-status-badge [status]="account.status"></app-status-badge>
                          </td>
                        </ng-container>

                        <ng-container matColumnDef="actions">
                          <th mat-header-cell *matHeaderCellDef>
                            {{ 'COMMON.ACTIONS' | translate }}
                          </th>
                          <td mat-cell *matCellDef="let account">
                            <button
                              mat-icon-button
                              color="primary"
                              (click)="onSavingsTransaction(account.id, 'deposit')"
                              *appHasPermission="'DEPOSIT_SAVINGSACCOUNT'"
                              [matTooltip]="'SAVINGS.DEPOSIT' | translate"
                            >
                              <mat-icon>add_circle_outline</mat-icon>
                            </button>

                            @if (account.status?.value === 'Submitted and pending approval') {
                              <button
                                mat-icon-button
                                color="accent"
                                (click)="onSavingsAction(account.id, 'approve', account)"
                                *appHasPermission="'APPROVE_SAVINGSACCOUNT'"
                                [matTooltip]="'LOANS.APPROVE' | translate"
                              >
                                <mat-icon>check_circle</mat-icon>
                              </button>
                            }

                            @if (account.status?.value === 'Approved') {
                              <button
                                mat-icon-button
                                color="primary"
                                (click)="onSavingsAction(account.id, 'activate', account)"
                                *appHasPermission="'ACTIVATE_SAVINGSACCOUNT'"
                                [matTooltip]="'LOANS.ACTIVATE' | translate"
                              >
                                <mat-icon>play_circle</mat-icon>
                              </button>
                            }

                            @if (account.status?.value === 'Active') {
                              <button
                                mat-icon-button
                                color="warn"
                                (click)="onSavingsAction(account.id, 'close', account)"
                                *appHasPermission="'CLOSE_SAVINGSACCOUNT'"
                                [matTooltip]="'LOANS.CLOSE' | translate"
                              >
                                <mat-icon>cancel</mat-icon>
                              </button>
                            }

                            <button
                              mat-icon-button
                              color="warn"
                              (click)="onSavingsTransaction(account.id, 'withdrawal')"
                              *appHasPermission="'WITHDRAW_SAVINGSACCOUNT'"
                              [matTooltip]="'SAVINGS.WITHDRAWAL' | translate"
                            >
                              <mat-icon>remove_circle_outline</mat-icon>
                            </button>
                          </td>
                        </ng-container>

                        <tr mat-header-row *matHeaderRowDef="savingsColumns"></tr>
                        <tr mat-row *matRowDef="let row; columns: savingsColumns"></tr>
                      </table>
                    } @else {
                      <div class="empty-state">
                        <mat-icon>account_balance_wallet</mat-icon>
                        <p>{{ 'CLIENTS.NO_SAVINGS_ACCOUNTS' | translate }}</p>
                      </div>
                    }
                  </mat-card-content>
                </mat-card>
              </div>
            </mat-tab>

            <!-- Loan Accounts Tab -->
            <mat-tab label="{{ 'CLIENTS.LOAN_ACCOUNTS' | translate }}">
              <div class="tab-content">
                <mat-card class="table-card">
                  <mat-card-content>
                    @if (loanAccounts().length > 0) {
                      <table mat-table [dataSource]="loanAccounts()" class="full-width-table">
                        <ng-container matColumnDef="accountNo">
                          <th mat-header-cell *matHeaderCellDef>
                            {{ 'COMMON.ACCOUNT_NO' | translate }}
                          </th>
                          <td mat-cell *matCellDef="let account">
                            <a class="clickable-link" [routerLink]="['/loans/view', account.id]">
                              {{ account.accountNo }}
                            </a>
                          </td>
                        </ng-container>

                        <ng-container matColumnDef="productName">
                          <th mat-header-cell *matHeaderCellDef>
                            {{ 'COMMON.PRODUCT' | translate }}
                          </th>
                          <td mat-cell *matCellDef="let account">{{ account.productName }}</td>
                        </ng-container>

                        <ng-container matColumnDef="principal">
                          <th mat-header-cell *matHeaderCellDef>
                            {{ 'LOANS.PRINCIPAL' | translate }}
                          </th>
                          <td mat-cell *matCellDef="let account">
                            {{ account.currency?.displaySymbol }}
                            {{ account.originalPrincipal || 0 | number: '1.2-2' }}
                          </td>
                        </ng-container>

                        <ng-container matColumnDef="status">
                          <th mat-header-cell *matHeaderCellDef>
                            {{ 'COMMON.STATUS' | translate }}
                          </th>
                          <td mat-cell *matCellDef="let account">
                            <app-status-badge [status]="account.status"></app-status-badge>
                          </td>
                        </ng-container>

                        <ng-container matColumnDef="actions">
                          <th mat-header-cell *matHeaderCellDef>
                            {{ 'COMMON.ACTIONS' | translate }}
                          </th>
                          <td mat-cell *matCellDef="let account">
                            <button
                              mat-icon-button
                              color="primary"
                              (click)="onLoanTransaction(account.id, 'repayment')"
                              *appHasPermission="'REPAYMENT_LOAN'"
                              [matTooltip]="'LOANS.REPAYMENT' | translate"
                            >
                              <mat-icon>payment</mat-icon>
                            </button>

                            @if (account.status?.value === 'Submitted and pending approval') {
                              <button
                                mat-icon-button
                                color="accent"
                                (click)="onLoanAction(account.id, 'approve')"
                                [matTooltip]="'LOANS.APPROVE' | translate"
                              >
                                <mat-icon>check_circle</mat-icon>
                              </button>
                            }

                            @if (account.status?.value === 'Approved') {
                              <button
                                mat-icon-button
                                color="accent"
                                (click)="onLoanAction(account.id, 'disburse')"
                                [matTooltip]="'LOANS.DISBURSE' | translate"
                              >
                                <mat-icon>launch</mat-icon>
                              </button>
                            }

                            @if (account.status?.active) {
                              <button
                                mat-icon-button
                                color="warn"
                                (click)="onLoanAction(account.id, 'close')"
                                *appHasPermission="'CLOSE_LOAN'"
                                [matTooltip]="'LOANS.CLOSE' | translate"
                              >
                                <mat-icon>cancel</mat-icon>
                              </button>
                            }
                          </td>
                        </ng-container>

                        <tr mat-header-row *matHeaderRowDef="loanColumns"></tr>
                        <tr mat-row *matRowDef="let row; columns: loanColumns"></tr>
                      </table>
                    } @else {
                      <div class="empty-state">
                        <mat-icon>credit_score</mat-icon>
                        <p>{{ 'CLIENTS.NO_LOAN_ACCOUNTS' | translate }}</p>
                      </div>
                    }
                  </mat-card-content>
                </mat-card>
              </div>
            </mat-tab>

            <mat-tab label="{{ 'CLIENTS.IDENTIFIERS' | translate }}">
              <div class="tab-content">
                <app-client-identifiers-list [clientId]="clientId"></app-client-identifiers-list>
              </div>
            </mat-tab>

            <mat-tab label="{{ 'CLIENTS.ADDRESSES' | translate }}">
              <div class="tab-content">
                <app-client-addresses-list [clientId]="clientId"></app-client-addresses-list>
              </div>
            </mat-tab>

            <mat-tab label="{{ 'CLIENTS.FAMILY_MEMBERS' | translate }}">
              <div class="tab-content">
                <app-client-family-members-list
                  [clientId]="clientId"
                ></app-client-family-members-list>
              </div>
            </mat-tab>

            <mat-tab label="{{ 'CLIENTS.NOTES' | translate }}">
              <div class="tab-content">
                <app-client-notes-list [clientId]="clientId"></app-client-notes-list>
              </div>
            </mat-tab>

            <mat-tab label="{{ 'CLIENTS.DOCUMENTS' | translate }}">
              <div class="tab-content">
                <app-client-documents-list [clientId]="clientId"></app-client-documents-list>
              </div>
            </mat-tab>

            <mat-tab label="{{ 'SYSTEM.CUSTOM_FIELDS' | translate }}">
              <div class="tab-content">
                <app-entity-datatables
                  apptableName="m_client"
                  [entityId]="clientId"
                ></app-entity-datatables>
              </div>
            </mat-tab>
          </mat-tab-group>
        </div>
      }
    </div>
  `,
  styles: [
    `
      .view-container {
        padding: 24px;
        max-width: 1200px;
        margin: 0 auto;
        display: flex;
        flex-direction: column;
        gap: 24px;
      }
      .breadcrumb {
        font-size: 14px;
        margin-bottom: -8px;
      }
      .breadcrumb a {
        text-decoration: none;
        color: var(--primary-color);
      }
      .header-card {
        border-radius: 12px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
      }
      .header-content {
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        gap: 16px;
      }
      .client-title-area {
        display: flex;
        align-items: center;
        gap: 16px;
      }
      .avatar-circle {
        width: 64px;
        height: 64px;
        border-radius: 50%;
        background-color: var(--primary-color, #3f51b5);
        color: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .avatar-circle mat-icon {
        font-size: 32px;
        width: 32px;
        height: 32px;
      }
      .title-details h2 {
        margin: 0 0 4px 0;
        font-size: 24px;
        font-weight: 600;
        color: var(--text-color);
      }
      .subtitle-row {
        display: flex;
        align-items: center;
        gap: 8px;
        color: #7f8c8d;
        font-size: 14px;
      }
      .divider {
        color: #bdc3c7;
      }
      .actions-area {
        display: flex;
        gap: 12px;
        align-items: center;
      }
      .tab-group {
        background-color: var(--card-bg);
        border-radius: 12px;
        box-shadow: var(--shadow-sm);
      }
      .tab-content {
        padding: 24px;
      }
      .info-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 24px;
      }
      .info-card {
        border-radius: 8px;
        border: 1px solid var(--border-color);
      }
      .info-card mat-card-header {
        margin-bottom: 12px;
      }
      .info-card mat-card-title {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 16px;
        font-weight: 600;
        color: var(--secondary-color);
      }
      .details-list {
        display: flex;
        flex-direction: column;
        gap: 12px;
      }
      .detail-item {
        display: flex;
        justify-content: space-between;
        padding-bottom: 8px;
        border-bottom: 1px solid var(--border-color);
      }
      .detail-item .label {
        color: var(--text-muted);
        font-size: 14px;
        font-weight: 500;
      }
      .detail-item .value {
        color: var(--text-color);
        font-size: 14px;
        font-weight: 600;
      }
      .table-card {
        border: 1px solid #eaedf1;
        box-shadow: none;
      }
      .full-width-table {
        width: 100%;
      }
      .empty-state {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 48px;
        color: #95a5a6;
      }
      .empty-state mat-icon {
        font-size: 48px;
        width: 48px;
        height: 48px;
        margin-bottom: 12px;
      }
      .empty-state p {
        margin: 0;
        font-size: 16px;
      }
      .clickable-link {
        color: #3f51b5;
        text-decoration: none;
        font-weight: 500;
        cursor: pointer;
      }
      .clickable-link:hover {
        text-decoration: underline;
      }
    `,
  ],
})
export class ClientViewComponent implements OnInit {
  private readonly clientService = inject(ClientService);
  private readonly notesService = inject(NotesService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly dialog = inject(MatDialog);

  clientId = 0;
  client = signal<GetClientsClientIdResponse | null>(null);
  loanAccounts = signal<GetClientsLoanAccounts[]>([]);
  savingsAccounts = signal<GetClientsSavingsAccounts[]>([]);

  savingsColumns = ['accountNo', 'productName', 'balance', 'status', 'actions'];
  loanColumns = ['accountNo', 'productName', 'principal', 'status', 'actions'];

  get formattedActivationDate(): string {
    const actDateArray = this.client()?.activationDate as unknown as number[];
    if (actDateArray && Array.isArray(actDateArray)) {
      return new Date(actDateArray[0], actDateArray[1] - 1, actDateArray[2]).toLocaleDateString();
    }
    return '-';
  }

  get formattedSubmissionDate(): string {
    const submitDateArray = this.client()?.timeline?.submittedOnDate as unknown as number[];
    if (submitDateArray && Array.isArray(submitDateArray)) {
      return new Date(
        submitDateArray[0],
        submitDateArray[1] - 1,
        submitDateArray[2],
      ).toLocaleDateString();
    }
    return '-';
  }

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.clientId = +id;
        this.loadClientData();
        this.loadClientAccounts();
      }
    });
  }

  loadClientData() {
    this.clientService.getClientsClientId(this.clientId).subscribe({
      next: (data) => this.client.set(data),
      error: (err) => console.error('Failed to load client details', err),
    });
  }

  loadClientAccounts() {
    this.clientService.getClientsClientIdAccounts(this.clientId).subscribe({
      next: (accounts) => {
        this.loanAccounts.set(Array.from(accounts.loanAccounts || []));
        this.savingsAccounts.set(Array.from(accounts.savingsAccounts || []));
      },
      error: (err) => console.error('Failed to load client accounts', err),
    });
  }

  onEditClient() {
    this.router.navigate(['/clients/edit', this.clientId]);
  }

  private buildClientActionPayload(
    command: string,
    result: { actionDate: Date; reasonId?: number; note?: string },
    formattedDate: string,
  ): Record<string, unknown> {
    const payload: Record<string, unknown> = {
      locale: FINERACT_LOCALE,
      dateFormat: FINERACT_DATE_FORMAT,
    };

    switch (command) {
      case 'activate':
        payload['activationDate'] = formattedDate;
        break;
      case 'close':
        payload['closedOnDate'] = formattedDate;
        payload['closureReasonId'] = result.reasonId;
        if (result.note) payload['comments'] = result.note;
        break;
      case 'reject':
        payload['rejectionDate'] = formattedDate;
        payload['rejectionReasonId'] = result.reasonId;
        if (result.note) payload['comments'] = result.note;
        break;
      case 'withdraw':
        payload['withdrawalDate'] = formattedDate;
        payload['withdrawalReasonId'] = result.reasonId;
        if (result.note) payload['comments'] = result.note;
        break;
      case 'reactivate':
        payload['reactivationDate'] = formattedDate;
        break;
      case 'undoReject':
      case 'undoWithdraw':
        payload['reopenedDate'] = formattedDate;
        break;
    }
    return payload;
  }

  onClientAction(command: string) {
    const dialogRef = this.dialog.open(ClientActionDialogComponent, {
      width: '400px',
      data: {
        title: `ACTIONS.${command.toUpperCase()}_CLIENT`,
        command: command,
        clientId: this.clientId,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (!result) return;

      const formattedDate = formatDateToFineract(result.actionDate);
      const payload = this.buildClientActionPayload(command, result, formattedDate);

      this.clientService
        .postClientsClientId(this.clientId, payload as PostClientsClientIdRequest, command)
        .subscribe({
          next: () => {
            const isNoteOnlyCommand =
              command === 'activate' ||
              command === 'reactivate' ||
              command === 'undoReject' ||
              command === 'undoWithdraw';

            if (result.note && isNoteOnlyCommand) {
              this.notesService
                .postResourceTypeResourceIdNotes('clients', this.clientId, { note: result.note })
                .subscribe({
                  next: () => this.loadClientData(),
                  error: (err) => {
                    console.error('Failed to save activation note', err);
                    this.loadClientData();
                  },
                });
            } else {
              this.loadClientData();
            }
          },
          error: (err) => console.error(`Failed to execute ${command}`, err),
        });
    });
  }

  onDeleteClient() {
    if (confirm('Are you sure you want to delete this client? This action cannot be undone.')) {
      this.clientService.deleteClientsClientId(this.clientId).subscribe({
        next: () => {
          this.router.navigate(['/clients']);
        },
        error: (err) => console.error('Failed to delete client', err),
      });
    }
  }

  onCreateLoan() {
    this.router.navigate(['/loans/create'], {
      queryParams: { clientId: this.clientId },
    });
  }

  onCreateSavings() {
    this.router.navigate(['/products/savings-accounts/create'], {
      queryParams: { clientId: this.clientId },
    });
  }

  onCreateFixed() {
    this.router.navigate(['/products/fixed-deposits/create'], {
      queryParams: { clientId: this.clientId },
    });
  }

  onCreateRecurring() {
    this.router.navigate(['/products/recurring-deposits/create'], {
      queryParams: { clientId: this.clientId },
    });
  }

  onSavingsTransaction(accountId: number, command: string) {
    this.router.navigate([`/products/savings-accounts/${accountId}/transactions/${command}`]);
  }

  onSavingsAction(accountId: number, command: string, account: Record<string, unknown>) {
    const type = resolveAccountActionType(account);
    this.router.navigate([`/products/${type}/${accountId}/action/${command}`]);
  }

  onLoanAction(loanId: number, command: string) {
    this.router.navigate([`/products/loan/${loanId}/action/${command}`]);
  }

  onLoanTransaction(loanId: number, type: string) {
    this.router.navigate([`/loans/${loanId}/transactions/${type}`]);
  }

  onBack() {
    this.router.navigate(['/clients']);
  }
}
