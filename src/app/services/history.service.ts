import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {History} from '../models/history.model';
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root',
})
export class HistoryService {

  constructor(private http: HttpClient) {
  }

  getHistory(): Observable<History[]> {
    return this.http.get<History[]>("/api/v1/history");
  }

  getHistoryDetailsByInvestmentId(id: number): Observable<History[]> {
    return this.http.get<History[]>("/api/v1/history/investment/" + id);
  }
}
