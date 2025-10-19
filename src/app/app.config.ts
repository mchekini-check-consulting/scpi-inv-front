import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection, APP_INITIALIZER } from '@angular/core';
import { provideRouter } from '@angular/router';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';
import { routes } from './app.routes';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { AuthInterceptor } from './core/interceptors/auth.interceptor';
import { OAuthModule } from 'angular-oauth2-oidc';
import { AuthService } from './core/services/auth.service';

export function initializeApp(authService: AuthService): () => Promise<void> {
  return () => authService.init();
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    providePrimeNG({ theme: { preset: Aura } }),
    provideHttpClient(withInterceptorsFromDi()),
    importProvidersFrom(OAuthModule.forRoot()),
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: APP_INITIALIZER, useFactory: initializeApp, deps: [AuthService], multi: true },
  ],
};
