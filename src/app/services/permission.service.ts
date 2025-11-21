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
  private apiUrl = '/validation-api/api/v1/permissions';
  
  private permissionsSubject = new BehaviorSubject<string[]>([]);
  public permissions$ = this.permissionsSubject.asObservable();

  private userPermissionsSubject = new BehaviorSubject<UserPermissions | null>(null);
  public userPermissions$ = this.userPermissionsSubject.asObservable();

  constructor(private http: HttpClient) {}

  loadUserPermissions(): Observable<UserPermissions> {
    return this.http.get<UserPermissions>(`${this.apiUrl}/me`).pipe(
      tap(response => {
        this.permissionsSubject.next(response.permissions);
        this.userPermissionsSubject.next(response);
      
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