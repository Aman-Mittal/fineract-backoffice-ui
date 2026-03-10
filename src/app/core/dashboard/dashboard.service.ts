import { Injectable } from '@angular/core';
import { Observable, forkJoin, map, catchError, of } from 'rxjs';
import { FetchAuthenticatedUserDetailsService } from '../../api/api/fetchAuthenticatedUserDetails.service';
import { ClientService } from '../../api/api/client.service';
import { LoansService } from '../../api/api/loans.service';
import { SavingsAccountService } from '../../api/api/savingsAccount.service';
import { AccountTransfersService } from '../../api/api/accountTransfers.service';
import { GetUserDetailsResponse } from '../../api/model/getUserDetailsResponse';
import { GetAccountTransfersPageItems } from '../../api/model/getAccountTransfersPageItems';

export interface UserInfo {
  username: string;
  displayName: string;
  roles: string[];
  officeName: string;
}

export interface OrganizationSummary {
  customerCount: number;
  savingsAccountCount: number;
  loanCount: number;
}

export interface DashboardData {
  user: UserInfo | null;
  summary: OrganizationSummary;
  recentTransactions: GetAccountTransfersPageItems[];
}

@Injectable({ providedIn: 'root' })
export class DashboardService {
  constructor(
    private userDetails: FetchAuthenticatedUserDetailsService,
    private clientService: ClientService,
    private loansService: LoansService,
    private savingsService: SavingsAccountService,
    private accountTransfersService: AccountTransfersService
  ) {}

  loadDashboard(): Observable<DashboardData> {
    return forkJoin({
      user: this.userDetails.fetchAuthenticatedUserData().pipe(
        map((u) => this.mapUser(u)),
        catchError(() => of(null))
      ),
      clients: this.clientService.retrieveAll21(undefined, undefined, undefined, undefined, undefined, undefined, undefined, 0, 1).pipe(
        map((r) => r.totalFilteredRecords ?? 0),
        catchError(() => of(0))
      ),
      savings: this.savingsService.retrieveAll33(undefined, 0, 1).pipe(
        map((r) => r.totalFilteredRecords ?? 0),
        catchError(() => of(0))
      ),
      loans: this.loansService.retrieveAll27(undefined, 0, 1).pipe(
        map((r) => r.totalFilteredRecords ?? 0),
        catchError(() => of(0))
      ),
      transfers: this.accountTransfersService.retrieveAll18(undefined, 0, 5, 'transferDate', 'DESC').pipe(
        map((r) => this.toArray(r.pageItems)),
        catchError(() => of([]))
      ),
    }).pipe(
      map(({ user, clients, savings, loans, transfers }) => ({
        user,
        summary: {
          customerCount: clients,
          savingsAccountCount: savings,
          loanCount: loans,
        },
        recentTransactions: transfers,
      }))
    );
  }

  private mapUser(u: GetUserDetailsResponse): UserInfo {
    const roles = (u.roles ?? []).map((r) => r.name ?? '').filter(Boolean);
    return {
      username: u.username ?? '',
      displayName: u.staffDisplayName ?? u.username ?? 'User',
      roles,
      officeName: u.officeName ?? '',
    };
  }

  private toArray<T>(items: Set<T> | T[] | undefined): T[] {
    if (!items) return [];
    return Array.isArray(items) ? items : Array.from(items);
  }
}
