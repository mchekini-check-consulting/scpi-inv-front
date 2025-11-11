import { Injectable } from '@angular/core';
import { InvestmentRequestDTO } from '../models/investment.model';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class InvestmentService {

  constructor(private http: HttpClient) { }

  private apiUrl = '/api';

  createInvestment(investment: InvestmentRequestDTO): Observable<void> {
  return this.http.post<void>(`${this.apiUrl}/investment`, investment);
}
}
