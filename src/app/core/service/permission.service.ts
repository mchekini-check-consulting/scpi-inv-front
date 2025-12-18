import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, firstValueFrom } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthService } from './auth.service';

export interface PermissionResponse {
  permissionName: string;
  description: string;
  assignedToStandard: boolean;
  assignedToPremium: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class PermissionService {
  private apiUrl = '/validation-api/v1/permissions';

  private allPermissionsSubject = new BehaviorSubject<PermissionResponse[]>([]);
  public allPermissions$ = this.allPermissionsSubject.asObservable();

  private userPermissionsSubject = new BehaviorSubject<string[]>([]);
  public userPermissions$ = this.userPermissionsSubject.asObservable();

  private currentRoleSubject = new BehaviorSubject<'standard' | 'premium'>(
    'standard'
  );
  public currentRole$ = this.currentRoleSubject.asObservable();

  private authService?: AuthService;

  constructor(private http: HttpClient, private injector: Injector) {}

  private getAuthService(): AuthService {
    if (!this.authService) {
      this.authService = this.injector.get(AuthService);
    }
    return this.authService;
  }

  initialize(): Observable<PermissionResponse[]> {
    const userRole = this.getAuthService().getUserRole();
    this.currentRoleSubject.next(userRole);

    return this.loadAllPermissions();
  }

  private permissionsLoaded = false;

  async initializeSync(): Promise<void> {
    if (this.permissionsLoaded) {
      return;
    }

    const userRole = this.getAuthService().getUserRole();
    this.currentRoleSubject.next(userRole);

    try {
      const permissions = await firstValueFrom(
        this.http.get<PermissionResponse[]>(this.apiUrl)
      );
      this.allPermissionsSubject.next(permissions);
      this.updateUserPermissions();
      this.permissionsLoaded = true;
    } catch (error) {
      console.error('Erreur chargement permissions:', error);
      this.updateUserPermissions();
      this.permissionsLoaded = true;
    }
  }

  isLoaded(): boolean {
    return this.permissionsLoaded;
  }

  loadAllPermissions(): Observable<PermissionResponse[]> {
    return this.http.get<PermissionResponse[]>(this.apiUrl).pipe(
      tap((permissions) => {
        this.allPermissionsSubject.next(permissions);
        this.updateUserPermissions();
      })
    );
  }

  private updateUserPermissions(): void {
    const currentRole = this.currentRoleSubject.value;
    const allPermissions = this.allPermissionsSubject.value;

    const filteredPermissions = allPermissions
      .filter((p) => {
        if (currentRole === 'premium') {
          return p.assignedToPremium;
        } else {
          return p.assignedToStandard;
        }
      })
      .map((p) => p.permissionName);

    this.userPermissionsSubject.next(filteredPermissions);
  }

  hasPermission(permission: string): boolean {
    return this.userPermissionsSubject.value.includes(permission);
  }

  getPermissions(): string[] {
    return this.userPermissionsSubject.value;
  }

  getUserRole(): 'standard' | 'premium' {
    return this.currentRoleSubject.value;
  }

  loadUserPermissions(): Observable<PermissionResponse[]> {
    return this.initialize();
  }
}
