import { Injectable } from '@angular/core';
import { InvestmentRequestDTO } from '../models/investment.model';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { PortfolioSummary } from '../models/scpi-investment.model';

@Injectable({
  providedIn: 'root',
})
export class InvestmentService {
  constructor(private http: HttpClient) {}

  private apiUrl = '/api';

  createInvestment(investment: InvestmentRequestDTO): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/investment`, investment);
  }

  getMyPortfolio(sortBy: 'date' | 'amount' = 'date'): Observable<PortfolioSummary> {
    const params = new HttpParams().set('sortBy', sortBy);
    return this.http.get<PortfolioSummary>(`${this.apiUrl}/investment/my-portfolio`, { params });
  }
}
