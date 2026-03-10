import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-auth-callback',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="callback-container">
      @if (error) {
        <p class="error">{{ error }}</p>
        <a routerLink="/">Return to login</a>
      } @else {
        <p>Completing sign in...</p>
      }
    </div>
  `,
  styles: [`
    .callback-container {
      min-height: 40vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 2rem;
    }
    .error {
      color: #c62828;
      margin-bottom: 1rem;
    }
    a {
      color: #1976d2;
      text-decoration: none;
    }
    a:hover {
      text-decoration: underline;
    }
  `],
})
export class AuthCallbackComponent implements OnInit {
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    const code = this.route.snapshot.queryParamMap.get('code');
    const errorParam = this.route.snapshot.queryParamMap.get('error');

    if (errorParam) {
      this.error = `Authentication failed: ${errorParam}`;
      return;
    }

    if (!code) {
      this.error = 'No authorization code received.';
      return;
    }

    this.auth.handleCallback(code).then((success) => {
      if (success) {
        this.router.navigate(['/home']);
      } else {
        this.error = 'Failed to complete sign in. Please try again.';
      }
    });
  }
}
