import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Scpi, ScpiDetail, ScpiWithRates} from '../model/scpi.model';
import {ScpiInvestment} from '../model/scpi-investment.model';
import {ScpiRepartition} from '../model/scpi-repartition.model';
import {DistributionRateChartResponse} from '../model/distribution-rate.model';
import {ScpiSummary} from '../model/scheduled-payment.model';
import {FiscalityResponse, SimulationResponseDTO} from '../model/scpi-simulator.model';
import {PageResponse} from "../model/PageResponse";
import {ScpiFiltersOptions} from "../model/ScpiFiltersOptions";


@Injectable({
  providedIn: 'root'
})
export class ScpiService {
  private apiUrl = '/api/v1/scpi';

  constructor(private http: HttpClient) {}

  getScpiPage(page: number, size: number, filters: any): Observable<PageResponse<Scpi>> {
    let params = new HttpParams()
      .set('page', page)
      .set('size', size);

    if (filters.countries?.length) {
      filters.countries.forEach((c: string) => params = params.append('countries', c));
    }
    if (filters.sectors?.length) {
      filters.sectors.forEach((s: string) => params = params.append('sectors', s));
    }
    if (filters.rentFrequencies?.length) {
      filters.rentFrequencies.forEach((f: string) => params = params.append('rentFrequencies', f));
    }

    if (filters.minimumSubscription !== null && filters.minimumSubscription !== undefined) {
      params = params.set('minimumSubscription', filters.minimumSubscription);
    }
    if (filters.yield !== null && filters.yield !== undefined) {
      params = params.set('yield', filters.yield);
    }

    return this.http.get<PageResponse<Scpi>>(this.apiUrl, { params });
  }

  getScpiFiltersOptions(): Observable<ScpiFiltersOptions> {
    return this.http.get<ScpiFiltersOptions>(`${this.apiUrl}/filters-options`);
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

  getSimulations(): Observable<any[]> {
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

    getScpiScheduledPayment(): Observable<ScpiSummary[]> {
      return this.http.get<ScpiSummary[]>(`${this.apiUrl}/scpiScheduledPayment`);
    }

  calculerImpactFiscalGlobal(revenuScpiBrut: number,locations: { label: string; percentage: number }[]): Observable<FiscalityResponse> {
    return this.http.post<FiscalityResponse>(`${this.apiUrl}/simulations/fiscalite`,{ revenuScpiBrut, locations }
    );
  }

  exportSimulationPdf(id: number) {
  return this.http.get(`${this.apiUrl}/simulations/${id}/export-pdf`,{ responseType: 'blob' }
  );
  }
}

