import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UploadResponse } from '../model/UploadResponse';

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
}
