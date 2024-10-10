import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ScheduledEvent } from '../../models/scheduled-event';
import { ScheduledEventService } from '../../core/services/scheduled-event.service';
import { TypeEvent } from '../../models/TypeEvent';
import { PagedResult } from '../../core/services/paged-result';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { PaginatorModule } from 'primeng/paginator';

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [CommonModule, TableModule, ProgressSpinnerModule, PaginatorModule],
  templateUrl: './events.component.html',
  styleUrl: './events.component.css',
})
export class EventsComponent implements OnInit {
  eventos: ScheduledEvent[] = [];
  typeEvents: TypeEvent[] = [];
  totalRecords: number = 0;

  first: number = 0;
  rows: number = 8;

  constructor(private service: ScheduledEventService) {}

  currentIndex: number = 0;
  events = [
    {
      image: '../../../assets/background/arlivre.jpg',
      title: 'Evento Natureza',
      description: 'Explore a beleza da natureza no nosso próximo evento!',
    },
    {
      image: '../../../assets/background/eventos.jpg',
      title: 'Evento na Cidade',
      description: 'Descubra novos lugares na cidade com amigos e família!',
    },
    {
      image: '../../../assets/background/passeios.jpg',
      title: 'Aventura ao Ar Livre',
      description: 'Uma experiência única de aventura ao ar livre!',
    },
  ];

  nextSlide(): void {
    this.currentIndex = (this.currentIndex + 1) % this.events.length;
  }

  prevSlide(): void {
    this.currentIndex =
      (this.currentIndex - 1 + this.events.length) % this.events.length;
  }

  ngOnInit(): void {
    this.autoSlide();
    this.loadEvents(this.first, this.rows);
  }

  loadEvents(pageIndex: number, pageSize: number): void {
    const page = pageIndex / pageSize + 1;
    this.service
      .GetAllEventPagAsync(page, pageSize)
      .subscribe((data: PagedResult<ScheduledEvent>) => {
        this.eventos = data.itens; // Verifique se 'itens' é o nome correto no seu backend
        this.totalRecords = data.totalCount; // totalCount para a paginação
      });
  }

  onPageChange(event: TableLazyLoadEvent): void {
    // Usando TableLazyLoadEvent
    this.first = event.first ?? 0; // Captura a posição inicial (0 se undefined)
    this.rows = event.rows ?? 10; // Captura o número de linhas (10 se undefined)

    // Aqui você pode verificar se rows é null
    const rowCount = this.rows !== null ? this.rows : 10; // Usar 10 se rows for null

    this.loadEvents(this.first, rowCount); // Recarrega os produtos para a nova página
  }

  autoSlide(): void {
    setInterval(() => {
      this.nextSlide();
    }, 5000);
  }
}
