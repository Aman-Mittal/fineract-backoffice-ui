import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="login-container">
      <div class="login-card">
        <h1>Fineract Backoffice</h1>
        <p class="subtitle">Sign in to continue</p>

        @if (auth.isAuthenticated()) {
          <div class="authenticated">
            <p>You are signed in.</p>
            <button type="button" (click)="goToHome()">Go to Home</button>
            <button type="button" class="secondary" (click)="auth.logout()">Sign Out</button>
          </div>
        } @else {
          <p class="hint">
            You will be redirected to the Fineract server to sign in with your credentials.
            Ensure Fineract is running with OAuth2 enabled.
          </p>
          <button type="button" class="primary" (click)="login()">Sign in with Fineract</button>
        }
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      min-height: 60vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem;
    }
    .login-card {
      max-width: 420px;
      padding: 2rem;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      background: #fff;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    }
    h1 {
      margin: 0 0 0.25rem;
      font-size: 1.5rem;
      font-weight: 600;
    }
    .subtitle {
      margin: 0 0 1.5rem;
      color: #666;
      font-size: 0.9rem;
    }
    .hint {
      margin: 0 0 1.5rem;
      color: #555;
      font-size: 0.85rem;
      line-height: 1.4;
    }
    .authenticated p {
      margin: 0 0 1rem;
    }
    button {
      display: block;
      width: 100%;
      padding: 0.75rem 1rem;
      margin-bottom: 0.5rem;
      font-size: 0.95rem;
      font-weight: 500;
      border: 1px solid #1976d2;
      border-radius: 6px;
      cursor: pointer;
      transition: background 0.15s;
    }
    button.primary {
      background: #1976d2;
      color: #fff;
    }
    button.primary:hover {
      background: #1565c0;
    }
    button.secondary {
      background: #fff;
      color: #1976d2;
    }
    button.secondary:hover {
      background: #f5f5f5;
    }
  `],
})
export class LoginComponent {
  constructor(
    public auth: AuthService,
    private router: Router
  ) {}

  login(): void {
    this.auth.login();
  }

  goToHome(): void {
    this.router.navigate(['/home']);
  }
}
