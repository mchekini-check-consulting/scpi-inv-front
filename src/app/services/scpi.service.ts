import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Scpi, ScpiPage } from '../models/scpi.model';


@Injectable({
  providedIn: 'root'
})
export class ScpiService {
  private apiUrl = '/api/v1/scpi';

  constructor(private http: HttpClient) {}

  getScpiPage(page: number, pageSize: number = 20): Observable<ScpiPage> {
    return this.http.get<Scpi[]>(this.apiUrl).pipe(
      map(scpis => {
        const start = page * pageSize;
        const end = start + pageSize;
        
        return {
          data: scpis.slice(start, end),
          total: scpis.length,
          page,
          pageSize
        };
      })
    );
  }
}