import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UploadResponse } from '../model/UploadResponse';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DocumentService {
  private readonly API_URL = `${environment.apiUrl}/document`;

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
}
