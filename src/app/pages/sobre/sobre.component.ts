import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sobre',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sobre.component.html',
  styleUrl: './sobre.component.css',
})
export class SobreComponent implements OnInit {
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
