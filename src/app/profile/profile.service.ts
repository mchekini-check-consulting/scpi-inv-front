import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import {ProfileRequest, ProfileResponse} from '../models/profile.model';


@Injectable({ providedIn: 'root' })
export class ProfileService {
  private apiUrl = '/api/profile';

  constructor(private http: HttpClient) {}

  saveProfile(data: ProfileRequest): Observable<ProfileResponse> {

    return this.http.post<ProfileResponse>(this.apiUrl, data).pipe(
      catchError((err) => {
        console.error('Erreur HTTP dans le service :', err);
        return of({ id: 0, status: '', children: 0, incomeInvestor: 0 });
      })
    );
  }

  getProfiles(): Observable<ProfileResponse[]> {
    return this.http.get<ProfileResponse[]>(this.apiUrl);
  }
}
