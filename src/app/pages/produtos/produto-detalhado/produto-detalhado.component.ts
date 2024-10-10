import { Component, OnInit } from '@angular/core';
import { Product } from '../../../models/product';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-produto-detalhado',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './produto-detalhado.component.html',
  styleUrl: './produto-detalhado.component.css',
})
export class ProdutoDetalhadoComponent implements OnInit {
  produto: Product | null = null;
  slug: string = '';

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService // Serviço para obter produto
  ) {}

  ngOnInit(): void {
    // Pega o slug da URL
    this.slug = this.route.snapshot.paramMap.get('slug') ?? '';

    if (this.slug) {
      this.loadProductDetails(this.slug);
    }
  }

  // Método para carregar os detalhes do produto pelo slug
  loadProductDetails(slug: string): void {
    this.productService.GetProductByNameAsync(slug).subscribe(
      (response: Product) => {
        this.produto = response; // Armazena o produto obtido
      },
      (error) => {
        console.error('Erro ao carregar produto:', error);
      }
    );
  }
}
