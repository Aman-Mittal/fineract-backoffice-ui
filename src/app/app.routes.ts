import { Routes } from '@angular/router';
import { authGuard } from './core/auth/auth.guard';
import { LoginComponent } from './features/login/login.component';
import { AuthCallbackComponent } from './features/auth-callback/auth-callback.component';
import { HomeComponent } from './features/home/home.component';

export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'auth/callback', component: AuthCallbackComponent },
  { path: 'home', component: HomeComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];
