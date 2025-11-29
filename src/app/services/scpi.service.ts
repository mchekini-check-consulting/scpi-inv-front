import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Scpi,ScpiDetail, ScpiPage,ScpiWithRates } from '../models/scpi.model';
import { ScpiInvestment } from '../models/scpi-investment.model';
import { ScpiRepartition } from '../models/scpi-repartition.model';
import { DistributionRateChartResponse } from '../models/distribution-rate.model';
import { SimulationResponseDTO } from '../models/scpi-simulator.model';

@Injectable({
  providedIn: 'root'
})
export class ScpiService {
  private apiUrl = '/api/v1/scpi';
  portfolioSubject: any;
  taxRateSubject: any;
  portfolio$: any;

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

  getScpiForSimulator(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/scpis-full-ownership`);
  }

  saveSimulation(payload: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/simulations`, payload);
  }

  getMySimulations(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/simulations`);
  }

  deleteSimulation(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/simulations/${id}`);
  }

  deleteScpiFromSimulation(simulationId: number, scpiId: number) {
  return this.http.delete<SimulationResponseDTO>(`${this.apiUrl}/simulations/${simulationId}/scpis/${scpiId}`
  );
}
    updateScpiShares(simulationId: number, scpiId: number, shares: number): Observable<SimulationResponseDTO> {
      return this.http.put<SimulationResponseDTO>(`${this.apiUrl}/simulations/${simulationId}/scpis/${scpiId}`,
        { shares }
      );
    }

    getSimulationById(simulationId: number): Observable<SimulationResponseDTO> {
      return this.http.get<SimulationResponseDTO>(`${this.apiUrl}/simulations/${simulationId}`);
    }


}
 
