import { Component, OnInit } from '@angular/core';

// Componentes
import { CarouselModule } from 'primeng/carousel';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { CardModule } from 'primeng/card';

// Requisições
import { Category } from '../../models/category';
import { CategoryService } from '../../core/services/category.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CarouselModule, ButtonModule, TagModule, CardModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  category: Category[] = [];

  // responsiveOptions: any[] | undefined;

  constructor(private service: CategoryService) {}

  ngOnInit(): void {
    this.service.getCategory().subscribe((data) => {
      this.category = data;
    });
  }
}
