import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

const TOKEN_KEY = 'fineract_access_token';
const REFRESH_TOKEN_KEY = 'fineract_refresh_token';
const CODE_VERIFIER_KEY = 'fineract_code_verifier';
const TENANT_KEY = 'fineract_tenant';

export interface TokenResponse {
  access_token: string;
  refresh_token?: string;
  token_type: string;
  expires_in?: number;
  scope?: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly oauth2 = environment.oauth2;
  private readonly apiUrl = environment.fineractApiUrl;

  isAuthenticated = signal<boolean>(false);
  tenantId = signal<string>(environment.defaultTenant);

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.isAuthenticated.set(!!this.getAccessToken());
    this.tenantId.set(localStorage.getItem(TENANT_KEY) ?? environment.defaultTenant);
  }

  getAccessToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  }

  getTenantId(): string {
    return this.tenantId() || environment.defaultTenant;
  }

  /** Generate PKCE code_verifier and code_challenge */
  private async generatePKCE(): Promise<{ verifier: string; challenge: string }> {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    const verifier = this.base64UrlEncode(array);

    const encoder = new TextEncoder();
    const data = encoder.encode(verifier);
    const hash = await crypto.subtle.digest('SHA-256', data);
    const challenge = this.base64UrlEncode(new Uint8Array(hash));

    return { verifier, challenge };
  }

  private base64UrlEncode(buffer: Uint8Array): string {
    const base64 = btoa(String.fromCharCode(...buffer));
    return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }

  /** Initiate OAuth2 login - redirects to Fineract authorize endpoint */
  async login(): Promise<void> {
    const { verifier, challenge } = await this.generatePKCE();
    sessionStorage.setItem(CODE_VERIFIER_KEY, verifier);

    const params = new URLSearchParams({
      response_type: 'code',
      client_id: this.oauth2.clientId,
      redirect_uri: this.oauth2.redirectUri,
      scope: this.oauth2.scopes,
      code_challenge: challenge,
      code_challenge_method: 'S256',
      state: this.base64UrlEncode(crypto.getRandomValues(new Uint8Array(16))),
    });

    window.location.href = `${this.apiUrl}/oauth2/authorize?${params.toString()}`;
  }

  /** Handle OAuth2 callback - exchange code for token */
  async handleCallback(code: string, state?: string): Promise<boolean> {
    const verifier = sessionStorage.getItem(CODE_VERIFIER_KEY);
    if (!verifier) {
      console.error('Code verifier not found - PKCE flow broken');
      return false;
    }
    sessionStorage.removeItem(CODE_VERIFIER_KEY);

    const body = new HttpParams()
      .set('grant_type', 'authorization_code')
      .set('code', code)
      .set('redirect_uri', this.oauth2.redirectUri)
      .set('client_id', this.oauth2.clientId)
      .set('code_verifier', verifier);

    try {
      const tokenUrl = `${this.apiUrl}/oauth2/token`;
      const response = await firstValueFrom(
        this.http.post<TokenResponse>(tokenUrl, body.toString(), {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          withCredentials: true,
        })
      );

      if (response?.access_token) {
        localStorage.setItem(TOKEN_KEY, response.access_token);
        if (response.refresh_token) {
          localStorage.setItem(REFRESH_TOKEN_KEY, response.refresh_token);
        }
        localStorage.setItem(TENANT_KEY, this.getTenantId());
        this.isAuthenticated.set(true);
        return true;
      }
    } catch (err) {
      console.error('Token exchange failed', err);
    }
    return false;
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(TENANT_KEY);
    sessionStorage.removeItem(CODE_VERIFIER_KEY);
    this.isAuthenticated.set(false);
    this.router.navigate(['/']);
  }
}
