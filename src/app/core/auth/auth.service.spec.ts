import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let mockRouter: { navigate: ReturnType<typeof jest.fn> };

  beforeEach(() => {
    mockRouter = { navigate: jest.fn() };
    localStorage.clear();
    sessionStorage.clear();

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [{ provide: Router, useValue: mockRouter }],
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
    sessionStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should not be authenticated when no token in localStorage', () => {
    expect(service.isAuthenticated()).toBe(false);
  });

  it('getAccessToken should return token from localStorage', () => {
    expect(service.getAccessToken()).toBeNull();
    localStorage.setItem('fineract_access_token', 'my-token');
    expect(service.getAccessToken()).toBe('my-token');
  });

  it('logout should clear tokens and navigate to /', () => {
    localStorage.setItem('fineract_access_token', 'token');
    localStorage.setItem('fineract_refresh_token', 'refresh');
    service.isAuthenticated.set(true);

    service.logout();

    expect(localStorage.getItem('fineract_access_token')).toBeNull();
    expect(localStorage.getItem('fineract_refresh_token')).toBeNull();
    expect(service.isAuthenticated()).toBe(false);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
  });

  it('handleCallback should exchange code for token and set authenticated', async () => {
    sessionStorage.setItem('fineract_code_verifier', 'test-verifier');

    const handlePromise = service.handleCallback('auth-code');

    const req = httpMock.expectOne(
      (r: { url: string; method: string }) =>
        r.url.includes('/oauth2/token') && r.method === 'POST'
    );
    expect(req.request.headers.get('Content-Type')).toBe(
      'application/x-www-form-urlencoded'
    );
    req.flush({
      access_token: 'new-access-token',
      refresh_token: 'new-refresh-token',
      token_type: 'Bearer',
      expires_in: 3600,
    });

    const result = await handlePromise;
    expect(result).toBe(true);
    expect(service.getAccessToken()).toBe('new-access-token');
    expect(service.getRefreshToken()).toBe('new-refresh-token');
    expect(service.isAuthenticated()).toBe(true);
  });

  it('handleCallback should return false when code verifier is missing', async () => {
    sessionStorage.clear();
    const result = await service.handleCallback('auth-code');
    expect(result).toBe(false);
  });

  it('handleCallback should return false when token exchange fails', async () => {
    sessionStorage.setItem('fineract_code_verifier', 'test-verifier');

    const handlePromise = service.handleCallback('auth-code');

    const req = httpMock.expectOne((r: { url: string }) =>
      r.url.includes('/oauth2/token')
    );
    req.flush('Invalid grant', { status: 400, statusText: 'Bad Request' });

    const result = await handlePromise;
    expect(result).toBe(false);
  });
});
