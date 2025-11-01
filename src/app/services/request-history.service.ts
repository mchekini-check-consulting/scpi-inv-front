import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { RequestHistory } from '../models/request-history.model';
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root',
})
export class RequestHistoryService {

  constructor(private http: HttpClient) {}

  getRequestHistory(): Observable<RequestHistory[]> {
    const mockRequests: RequestHistory[] = [
      {
        id: 1,
        status: 'SUCCESS',
        date: new Date('2023-10-01T10:00:00'),
      },
      {
        id: 2,
        status: 'FAILED',
        date: new Date('2023-10-02T14:30:00'),
      },
      {
        id: 3,
        status: 'PENDING',
        date: new Date('2023-10-02T14:30:00'),
      }
    ];
    return of(mockRequests); // simule une réponse HTTP
  }
}
