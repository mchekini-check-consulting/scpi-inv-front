    import { Injectable } from '@angular/core';
    import { OAuthService } from 'angular-oauth2-oidc';
    import { authConfig } from '../auth.config';
    import { Router } from '@angular/router';

    @Injectable({ providedIn: 'root' })
    export class AuthService {
    constructor(private oauthService: OAuthService, private router: Router) {
        this.oauthService.setStorage(localStorage);
        this.oauthService.configure(authConfig);
        this.oauthService.setupAutomaticSilentRefresh();
    }

    async init(): Promise<void> {
        await this.oauthService.loadDiscoveryDocumentAndTryLogin();

        if (this.oauthService.hasValidAccessToken()) {
        const redirectUrl = localStorage.getItem('redirectUrl');
        if (redirectUrl) {
            localStorage.removeItem('redirectUrl');
            await this.router.navigateByUrl(redirectUrl);
        }
        } else {
        console.log('[AuthService] Pas de token (non connecté)');
        }
    }

    async login(): Promise<void> {
        await this.oauthService.initLoginFlow();
    }

    async logout(): Promise<void> {
        const idToken = this.oauthService.getIdToken();
          const logoutUrl = `${authConfig.logoutUrl}?id_token_hint=${idToken}&post_logout_redirect_uri=${window.location.origin}`;
    window.location.href = logoutUrl;
        localStorage.clear();
        sessionStorage.clear();
        this.oauthService.logOut({ logoutUrl });
        if (idToken) {
  
  } else {
    await this.router.navigateByUrl('/forbidden');
  }
    }

    isLoggedIn(): boolean {
        return this.oauthService.hasValidAccessToken();
    }

    get accessToken(): string | null {
        return this.oauthService.getAccessToken();
    }

    hasRole(role: string): boolean {
        const token = this.oauthService.getAccessToken();
        if (!token) return false;
        const claims = this.decodeJwt(token);
        const allRoles = [
        ...(claims.realm_access?.roles || []),
        ...(claims.resource_access?.['scpi-invest-front']?.roles || []),
        ];
        return allRoles.includes(role);
    }

    private decodeJwt(token: string): any {
        try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64)
            .split('')
            .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
            .join('')
        );
        return JSON.parse(jsonPayload);
        } catch {
        return null;
        }
    }
    }
