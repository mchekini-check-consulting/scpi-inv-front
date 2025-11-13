import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

export interface UserPermissions {
  userId: string;
  username: string;
  email: string;
  role: string;
  permissions: string[];
}

@Injectable({
  providedIn: 'root'
})
export class PermissionService {
  private apiUrl: string;
  
  private permissionsSubject = new BehaviorSubject<string[]>([]);
  public permissions$ = this.permissionsSubject.asObservable();

  private userPermissionsSubject = new BehaviorSubject<UserPermissions | null>(null);
  public userPermissions$ = this.userPermissionsSubject.asObservable();

  constructor(private http: HttpClient) {
    // 🎯 DÉTECTION AUTOMATIQUE DE L'ENVIRONNEMENT
    this.apiUrl = this.getApiUrl();
  }

  private getApiUrl(): string {
    const hostname = window.location.hostname;
    
    if (hostname.includes('qua.')) {
      return 'https://qua.scpi-doc-validation-api.check-consulting.net/api/v1/permissions';
    } else if (hostname.includes('int.')) {
      return 'https://int.scpi-doc-validation-api.check-consulting.net/api/v1/permissions';
    } else if (hostname.includes('localhost') || hostname.includes('127.0.0.1')) {
      return '/api/v1/permissions';
    } else {
      return 'https://prod.scpi-doc-validation-api.check-consulting.net/api/v1/permissions';
    }
  }

  loadUserPermissions(): Observable<UserPermissions> {
    console.log('🔗 Chargement permissions depuis:', this.apiUrl);
    return this.http.get<UserPermissions>(`${this.apiUrl}/me`).pipe(
      tap(response => {
        this.permissionsSubject.next(response.permissions);
        this.userPermissionsSubject.next(response);
        console.log('✅ Permissions chargées:', response);
      })
    );
  }

  hasPermission(permission: string): boolean {
    return this.permissionsSubject.value.includes(permission);
  }

  getPermissions(): string[] {
    return this.permissionsSubject.value;
  }

  getUserRole(): string | null {
    return this.userPermissionsSubject.value?.role || null;
  }
}