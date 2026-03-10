import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { LoginComponent } from './login.component';
import { AuthService } from '../../core/auth/auth.service';
import { signal } from '@angular/core';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let mockAuthService: { login: ReturnType<typeof jest.fn>; logout: ReturnType<typeof jest.fn>; isAuthenticated: ReturnType<typeof signal<boolean>> };
  let mockRouter: { navigate: ReturnType<typeof jest.fn> };

  beforeEach(async () => {
    mockAuthService = {
      login: jest.fn(),
      logout: jest.fn(),
      isAuthenticated: signal(false),
    };
    mockRouter = { navigate: jest.fn() };

    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should show Sign in button when not authenticated', () => {
    mockAuthService.isAuthenticated = signal(false);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Sign in with Fineract');
    expect(compiled.textContent).toContain('Fineract Backoffice');
  });

  it('should show authenticated state when user is signed in', () => {
    mockAuthService.isAuthenticated = signal(true);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('You are signed in.');
    expect(compiled.textContent).toContain('Go to Home');
    expect(compiled.textContent).toContain('Sign Out');
  });

  it('should call auth.login() when Sign in button is clicked', () => {
    mockAuthService.isAuthenticated = signal(false);
    fixture.detectChanges();
    const signInButton = fixture.nativeElement.querySelector('button.primary');
    signInButton?.click();
    expect(mockAuthService.login).toHaveBeenCalled();
  });

  it('should call auth.logout() when Sign Out is clicked', () => {
    mockAuthService.isAuthenticated = signal(true);
    fixture.detectChanges();
    const signOutButton = fixture.nativeElement.querySelector('button.secondary');
    signOutButton?.click();
    expect(mockAuthService.logout).toHaveBeenCalled();
  });

  it('should navigate to /home when Go to Home is clicked', () => {
    mockAuthService.isAuthenticated = signal(true);
    fixture.detectChanges();
    const goToHomeButton = fixture.nativeElement.querySelector(
      'button:not(.secondary)'
    );
    goToHomeButton?.click();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/home']);
  });
});
