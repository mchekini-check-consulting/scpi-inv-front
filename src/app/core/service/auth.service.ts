import { Injectable } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';
import { Router } from '@angular/router';
import { authConfig } from '../config/auth.config';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { PermissionService } from '../../services/permission.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private isLoggedOut = false;
  private emailCheckInterval: any = null;
  userInfo$ = new BehaviorSubject<any>(null);

  constructor(
    private oauthService: OAuthService,
    private router: Router,
    private http: HttpClient,
    private permissionService: PermissionService
  ) {
    this.oauthService.setStorage(localStorage);
    this.oauthService.configure(authConfig);
    this.oauthService.setupAutomaticSilentRefresh();
  }

  async init(): Promise<void> {
    await this.oauthService.loadDiscoveryDocumentAndTryLogin();

    if (this.oauthService.hasValidAccessToken()) {
      const claims = this.decodeJwt(this.oauthService.getAccessToken()!);
      this.userInfo$.next(claims);

      this.loadUserPermissions();

      const redirectUrl = localStorage.getItem('redirectUrl');
      if (redirectUrl) {
        localStorage.removeItem('redirectUrl');
        await this.router.navigateByUrl(redirectUrl);
      }
    } else {
      this.userInfo$.next(null);
    }
  }

  private loadUserPermissions(): void {
    this.permissionService.loadUserPermissions().subscribe({
      next: (permissions) => {},
      error: (error) => {
        console.error('❌ Erreur lors du chargement des permissions:', error);
      },
    });
  }

  async login(): Promise<void> {
    await this.oauthService.initLoginFlow();
  }

  async logout(): Promise<void> {
    this.isLoggedOut = true;
    this.oauthService.logOut();
    this.oauthService.logOut(true);
    // @ts-ignore
    this.oauthService.clearHashAfterLogin();
    // Nettoyage local
    localStorage.clear();
    sessionStorage.clear();
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

  /**
   * Récupère le rôle business de l'utilisateur (standard ou premium)
   * Par défaut: standard
   * Si l'utilisateur a premium (même avec standard): retourne premium
   */
  getUserRole(): 'standard' | 'premium' {
    const token = this.oauthService.getAccessToken();

    // Si pas de token, retour par défaut
    if (!token) {
      console.log('⚠️ Pas de token, rôle par défaut: standard');
      return 'standard';
    }

    const claims = this.decodeJwt(token);

    // Si pas de roles dans le token, retour par défaut
    if (!claims?.realm_access?.roles) {
      console.log('⚠️ Pas de rôles dans le token, rôle par défaut: standard');
      return 'standard';
    }

    const roles = claims.realm_access.roles;

    console.log('🔍 Rôles dans le token:', roles);

    // Priorité : premium > standard
    // Si l'utilisateur a premium (même avec standard), il est premium
    if (roles.includes('premium')) {
      console.log('✅ Utilisateur PREMIUM détecté');
      return 'premium';
    }

    // Sinon, standard par défaut
    console.log('✅ Utilisateur STANDARD détecté');
    return 'standard';
  }

  decodeJwt(token: string): any {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch {
      return null;
    }
  }

  getCurrentUserEmail(): string | null {
    const userInfo = this.userInfo$.getValue();
    return userInfo?.email || userInfo?.preferred_username || null;
  }
}
