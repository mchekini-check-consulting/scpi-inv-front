


import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}
  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean | UrlTree> {
    if (!this.auth.isLoggedIn()) {
      localStorage.setItem('redirectUrl', state.url);
      await this.auth.login();
      return false;
    }


  const requiredRoles = route.data['roles'] as string[] | undefined;
  if (requiredRoles?.length && !requiredRoles.some(role => this.auth.hasRole(role))) {
    await this.auth.logout();
    return this.router.parseUrl('/forbidden');
  }

  return true;
}
}
