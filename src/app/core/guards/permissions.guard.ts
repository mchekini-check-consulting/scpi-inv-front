import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { PermissionService } from '../service/permission.service';
import { PERMISSION_MAPPING } from '../config/permission.config';

@Injectable({
  providedIn: 'root'
})
export class PermissionGuard implements CanActivate {
  
  constructor(
    private permissionService: PermissionService,
    private router: Router
  ) {}

  async canActivate(route: ActivatedRouteSnapshot): Promise<boolean> {
    const feature = route.data['feature'];
    
    if (!feature) {
      return true;
    }

    const requiredPermission = PERMISSION_MAPPING[feature];
    
    if (!requiredPermission) {
      return true;
    }

    if (!this.permissionService.isLoaded()) {
      await this.permissionService.initializeSync();
    }

    const hasPermission = this.permissionService.hasPermission(requiredPermission);
    
    if (!hasPermission) {
      this.router.navigate(['/dashboard/scpi']);
      return false;
    }

    return true;
  }
}