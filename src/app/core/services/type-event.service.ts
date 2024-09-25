import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TypeEvent } from '../../models/TypeEvent';

@Injectable({
  providedIn: 'root',
})
export class TypeEventService {
  private apiUrl = 'http://localhost:5062/v1/TypesEvent';

  constructor(private client: HttpClient) {}

  getTypeEvent(): Observable<TypeEvent[]> {
    return this.client.get<TypeEvent[]>(`${this.apiUrl}/test`);
  }

  // Método para obter uma categoria por ID
  getTypeEventById(id: number): Observable<TypeEvent> {
    return this.client.get<TypeEvent>(`${this.apiUrl}/${id}`);
  }

  // Método para adicionar uma nova categoria
  addTypeEvent(typeEvent: TypeEvent): Observable<TypeEvent> {
    const token = localStorage.getItem('Bearer'); // Obtém o token JWT do localStorage
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`, // Adiciona o token no cabeçalho Authorization
    });

    return this.client.post<TypeEvent>(this.apiUrl, typeEvent, { headers });
  }

  updateTypeEvent(typeEvent: TypeEvent): Observable<TypeEvent> {
    const token = localStorage.getItem('Bearer');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.client.put<TypeEvent>(
      `${this.apiUrl}/${typeEvent.id}`,
      typeEvent,
      {
        headers,
      }
    );
  }

  // Método para excluir uma categoria
  deleteTypeEvent(id: number): Observable<string> {
    const token = localStorage.getItem('Bearer'); // Obtém o token JWT do localStorage
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`, // Adiciona o token no cabeçalho Authorization
    });
    return this.client.delete<string>(`${this.apiUrl}/${id}`, { headers });
  }
}
