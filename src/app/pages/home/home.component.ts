import { Component, OnInit } from '@angular/core';

// Componentes
import { CarouselModule } from 'primeng/carousel';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { CardModule } from 'primeng/card';

// Requisições
import { Category } from '../../models/category';
import { CategoryService } from '../../core/services/category.service';
import { Product } from '../../models/product';
import { ProductService } from '../../core/services/product.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CarouselModule, ButtonModule, TagModule, CardModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  category: Category[] = [];
  products: Product[] = [];

  // responsiveOptions: any[] | undefined;

  constructor(
    private service: CategoryService,
    private produto: ProductService
  ) {}

  ngOnInit(): void {
    this.OnCategory();
    this.OnProduct();
  }

  OnCategory() {
    this.service.getCategory().subscribe((data) => {
      this.category = data;
    });
  }

  OnProduct() {
    this.produto.getProduct().subscribe((data) => {
      this.products = this.shuffleArray(data); // Chame o método de embaralhamento
    });
  }

  shuffleArray(array: any[]): any[] {
    return array
      .map((value) => ({ value, sort: Math.random() })) // Cria um novo array com valores e números aleatórios
      .sort((a, b) => a.sort - b.sort) // Ordena os valores aleatoriamente
      .map(({ value }) => value); // Retorna apenas os valores, sem os números aleatórios
  }
}
