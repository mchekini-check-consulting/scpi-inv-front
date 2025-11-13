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
      next: (permissions) => {
      },
      error: (error) => {
        console.error('❌ Erreur lors du chargement des permissions:', error);
      }
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

  decodeJwt(token: string): any {
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