import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="home-container">
      <header class="home-header">
        <h1>Fineract Backoffice</h1>
        <div class="user-actions">
          <span class="tenant">Tenant: {{ auth.getTenantId() }}</span>
          <button type="button" (click)="auth.logout()">Sign Out</button>
        </div>
      </header>
      <main class="home-content">
        <p>Welcome. You are signed in.</p>
        <p>Role-specific dashboards and tasks will be available here.</p>
      </main>
    </div>
  `,
  styles: [`
    .home-container {
      padding: 1.5rem;
    }
    .home-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid #eee;
    }
    .home-header h1 {
      margin: 0;
      font-size: 1.25rem;
      font-weight: 600;
    }
    .user-actions {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    .tenant {
      font-size: 0.875rem;
      color: #666;
    }
    button {
      padding: 0.5rem 1rem;
      font-size: 0.875rem;
      background: #fff;
      border: 1px solid #ccc;
      border-radius: 4px;
      cursor: pointer;
    }
    button:hover {
      background: #f5f5f5;
    }
    .home-content {
      color: #555;
      line-height: 1.6;
    }
  `],
})
export class HomeComponent {
  constructor(public auth: AuthService) {}
}
