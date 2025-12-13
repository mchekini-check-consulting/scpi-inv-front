import { Injectable } from '@angular/core';
import {
  InvestmentRequestDTO,
  MonthlyRevenue,
} from '../model/investment.model';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { InvestorPortfolioDistribution, PortfolioSummary } from '../model/scpi-investment.model';
import { ScheduledPaymentRequest, ScpiSummary } from '../model/scheduled-payment.model';

@Injectable({
  providedIn: 'root',
})
export class InvestmentService {
  constructor(private http: HttpClient) {}

  private apiUrl = '/api/v1';

  createInvestment(investment: InvestmentRequestDTO): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/investment`, investment);
  }

  getMyPortfolio(
    sortBy: 'date' | 'amount' = 'date'
  ): Observable<PortfolioSummary> {
    const params = new HttpParams().set('sortBy', sortBy);
    return this.http.get<PortfolioSummary>(
      `${this.apiUrl}/investment/my-portfolio`,
      { params }
    );
  }

  getPortfolioDistribution(): Observable<InvestorPortfolioDistribution> {
    return this.http.get<InvestorPortfolioDistribution>(
      `${this.apiUrl}/investment/portfolio-distribution`
    );
  }

  getMonthlyRevenue(
    months: number = 6,
    year?: number,
    scpiId?: number
  ): Observable<MonthlyRevenue> {
    let params = `months=${months}`;

    if (year) {
      params += `&year=${year}`;
    }

    if (scpiId) {
      params += `&scpiId=${scpiId}`;
    }

    return this.http.get<MonthlyRevenue>(
      `${this.apiUrl}/investment/monthly-revenue?${params}`
    );
  }

  getFullMonthlyRevenueHistory(
    year?: number,
    scpiId?: number
  ): Observable<MonthlyRevenue> {
    let params = '';

    if (year) {
      params += `?year=${year}`;
    }

    if (scpiId) {
      params += params ? `&scpiId=${scpiId}` : `?scpiId=${scpiId}`;
    }

    return this.http.get<MonthlyRevenue>(
      `${this.apiUrl}/investment/monthly-revenue/full-history${params}`
    );
  }


  hasInvested(scpiId: number): Observable<boolean> {
    const params = new HttpParams().set('scpiId', scpiId.toString());
    return this.http.get<boolean>(`${this.apiUrl}/investment/hasinvested`, { params });
  }



}
