import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UploadFileService {
  private uploadUrl = 'http://localhost:5062/v1/aws/upload';

  constructor(private client: HttpClient) {}

  uploadImageToS3(file: File, bucketName: string): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('nameBucket', bucketName);

    const token = localStorage.getItem('Bearer');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.client.post<any>(this.uploadUrl, formData, { headers });
  }

  uploadImage(file: File): Observable<{ url: string }> {
    const formData = new FormData();
    formData.append('file', file);

    // Faz a requisição POST para o backend
    return this.client.post<{ url: string }>(
      `${this.uploadUrl}?nameBucket=tesouros-produto`,
      formData
    );
  }

  uploadImageEvent(file: File): Observable<{ url: string }> {
    const formData = new FormData();
    formData.append('file', file);

    // Faz a requisição POST para o backend
    return this.client.post<{ url: string }>(
      `${this.uploadUrl}?nameBucket=tesouros`,
      formData
    );
  }
}
