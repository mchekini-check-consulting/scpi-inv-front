// src/app/core/services/scpi.service.ts

import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { Scpi, ScpiPage } from '../../shared/models/scpi.model';
import { FAKE_SCPI_DATA } from '../data/scpi-fake.data';

@Injectable({
  providedIn: 'root'
})
export class ScpiService {
  // 🔄 TODO: Remplacer par HttpClient quand l'API sera prête
  // constructor(private http: HttpClient) {}

  /**
   * Récupère une page de SCPI avec pagination
   * @param page - Numéro de page (commence à 0)
   * @param pageSize - Nombre d'éléments par page (défaut: 20)
   * @returns Observable contenant les données paginées
   * 
   * 🔄 Migration future vers API:
   * return this.http.get<ScpiPage>(`${API_URL}/scpi`, {
   *   params: { page: page.toString(), size: pageSize.toString() }
   * });
   */
  getScpiPage(page: number, pageSize: number = 20): Observable<ScpiPage> {
    // Logique de pagination
    const start = page * pageSize;
    const end = start + pageSize;
    const paginatedData = FAKE_SCPI_DATA.slice(start, end);

    // Simule une réponse API
    return of({
      data: paginatedData,
      total: FAKE_SCPI_DATA.length,
      page,
      pageSize
    }).pipe(
      delay(300) // Simule latence réseau (300ms)
    );
  }

}