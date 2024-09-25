import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ScheduledEvent } from '../../models/scheduled-event';

@Injectable({
  providedIn: 'root',
})
export class ScheduledEventService {
  private apiUrl = 'http://localhost:5062/v1/events';

  constructor(private client: HttpClient) {}

  getScheduledEvent(): Observable<ScheduledEvent[]> {
    return this.client.get<ScheduledEvent[]>(`${this.apiUrl}/test`);
  }

  // Método para obter uma categoria por ID
  getScheduledEventById(id: number): Observable<ScheduledEvent> {
    return this.client.get<ScheduledEvent>(`${this.apiUrl}/${id}`);
  }

  // Método para adicionar uma nova categoria
  addScheduledEvent(
    scheduledEvent: ScheduledEvent
  ): Observable<ScheduledEvent> {
    const token = localStorage.getItem('Bearer'); // Obtém o token JWT do localStorage
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`, // Adiciona o token no cabeçalho Authorization
    });

    return this.client.post<ScheduledEvent>(this.apiUrl, scheduledEvent, {
      headers,
    });
  }

  updateScheduledEvent(
    scheduledEvent: ScheduledEvent
  ): Observable<ScheduledEvent> {
    const token = localStorage.getItem('Bearer');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.client.put<ScheduledEvent>(
      `${this.apiUrl}/${scheduledEvent.id}`,
      scheduledEvent,
      {
        headers,
      }
    );
  }

  // Método para excluir uma categoria
  deleteScheduledEvent(id: number): Observable<string> {
    const token = localStorage.getItem('Bearer'); // Obtém o token JWT do localStorage
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`, // Adiciona o token no cabeçalho Authorization
    });
    return this.client.delete<string>(`${this.apiUrl}/${id}`, { headers });
  }
}
