// message.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  private messageSource = new BehaviorSubject<string | null>(null);
  currentMessage = this.messageSource.asObservable();

  changeMessage(message: string | null) {
    this.messageSource.next(message);
  }
}
