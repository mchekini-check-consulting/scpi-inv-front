import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { UploadResponse } from '../model/UploadResponse';
import { UserDocument } from '../../models/userDocument.model';

@Injectable({
  providedIn: 'root',
})
export class DocumentService {
  private API_URL = '/api/v1/document';

  constructor(private http: HttpClient) {}

  uploadFile(file: File, type: any): Observable<UploadResponse> {
    const formData = new FormData();
    formData.append('file', file, file.name);
    formData.append('type', type.toString());

    return this.http.post<UploadResponse>(`${this.API_URL}/upload`, formData);
  }

  downloadFile(fileName: string, type: any): Observable<any> {
    return this.http.get<any>(`${this.API_URL}/download/${fileName}`, {
      params: { type },
    });
  }

  getUploadStatus(): Observable<{
    userId: string;
    documentsUploaded: boolean;
  }> {
    return this.http.get<{ userId: string; documentsUploaded: boolean }>(
      `${this.API_URL}/status`
    );
  }
 getUserDocuments(email: string): Observable<UserDocument[]> {
    return this.http.get<UserDocument[]>(`${this.API_URL}/by-email`, {
      params: { email }
    }).pipe(
      catchError(err => {
        return of([]);
      })
    );
  }

  areRegulatoryDocumentsValidated(email: string): Observable<boolean> {
    return this.getUserDocuments(email).pipe(
      map(documents => {
        if (!documents || documents.length === 0) {
          return false;
        }
        const allValidated = documents.every(doc => doc.status === 'VALIDATED');
        return allValidated;
      })
    );
  }



}
