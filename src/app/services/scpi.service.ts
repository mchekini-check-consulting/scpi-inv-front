import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Scpi, ScpiComparisonDTOResponse, ScpiDetail, ScpiPage, ScpiWithRates } from '../models/scpi.model';
import { ScpiInvestment } from '../models/scpi-investment.model';
import { ScpiRepartition } from '../models/scpi-repartition.model';
import { DistributionRateChartResponse } from '../models/distribution-rate.model';


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


  getScpiDetails(slug: string): Observable<ScpiDetail> {
    return this.http.get<ScpiDetail>(`${this.apiUrl}/details/${slug}`);
  }

  getScpiInvestment(id: number): Observable<ScpiInvestment> {
    return this.http.get<ScpiInvestment>(`${this.apiUrl}/${id}`);
  }

  getScpiRepartition(id: number): Observable<ScpiRepartition> {
    return this.http.get<ScpiRepartition>(`${this.apiUrl}/${id}/repartition`);
  }

   getDistributionRatesChart(scpiId?: number): Observable<DistributionRateChartResponse> {
    return this.http.get<DistributionRateChartResponse>(
      `${this.apiUrl}/${scpiId}/distribution-rates`
    );
  }
  
  getScpisForComparator(): Observable<ScpiWithRates[]> {
    return this.http.get<ScpiWithRates[]>(`${this.apiUrl}/comparator-scpis`);
  }
}
 
