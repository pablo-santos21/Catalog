import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ScheduledEvent } from '../../models/scheduled-event';
import { ScheduledEventService } from '../../core/services/scheduled-event.service';
import { TypeEvent } from '../../models/TypeEvent';

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './events.component.html',
  styleUrl: './events.component.css',
})
export class EventsComponent implements OnInit {
  eventos: ScheduledEvent[] = [];
  typeEvents: TypeEvent[] = [];

  constructor(private service: ScheduledEventService) {}

  currentIndex: number = 0;
  events = [
    {
      image: '../../../assets/background/testesd.png',
      title: 'Evento Natureza',
      description: 'Explore a beleza da natureza no nosso próximo evento!',
    },
    {
      image: '../../../assets/background/image.png',
      title: 'Evento na Cidade',
      description: 'Descubra novos lugares na cidade com amigos e família!',
    },
    {
      image: '../../../assets/background/prato.png',
      title: 'Aventura ao Ar Livre',
      description: 'Uma experiência única de aventura ao ar livre!',
    },
  ];

  ngOnInit(): void {
    this.autoSlide();

    this.service.getScheduledEvent().subscribe((data) => {
      this.eventos = data;
    });
  }

  nextSlide(): void {
    this.currentIndex = (this.currentIndex + 1) % this.events.length;
  }

  prevSlide(): void {
    this.currentIndex =
      (this.currentIndex - 1 + this.events.length) % this.events.length;
  }

  autoSlide(): void {
    setInterval(() => {
      this.nextSlide();
    }, 5000);
  }
}
