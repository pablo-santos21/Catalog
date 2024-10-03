import { Component, OnInit } from '@angular/core';
import { Product } from '../../models/product';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../core/services/product.service';
import { Category } from '../../models/category';
import { PaginatorModule } from 'primeng/paginator';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { PagedResult } from '../../core/services/paged-result';
import { TableLazyLoadEvent } from 'primeng/table'; // Importar TableLazyLoadEvent

@Component({
  selector: 'app-produtos',
  standalone: true,
  imports: [CommonModule, PaginatorModule, ProgressSpinnerModule],
  templateUrl: './produtos.component.html',
  styleUrls: ['./produtos.component.css'],
})
export class ProdutosComponent implements OnInit {
  produtos: Product[] = [];
  categoria: Category[] = [];
  totalRecords: number = 0;

  first: number = 0; // Índice inicial
  rows: number = 8; // Número de itens por página

  constructor(private service: ProductService) {}

  ngOnInit(): void {
    this.loadProducts(this.first, this.rows);
  }

  // Método para carregar os produtos com paginação
  loadProducts(pageIndex: number, pageSize: number): void {
    const page = pageIndex / pageSize + 1; // Ajuste para o backend
    this.service
      .getProducts(page, pageSize)
      .subscribe((data: PagedResult<Product>) => {
        this.produtos = data.itens; // Verifique se 'itens' é o nome correto
        this.totalRecords = data.totalCount; // totalCount para a paginação
      });
  }

  // Método chamado quando há mudança de página ou de número de registros por página
  onPageChange(event: TableLazyLoadEvent): void {
    // Usando TableLazyLoadEvent
    this.first = event.first ?? 0; // Captura a posição inicial (0 se undefined)
    this.rows = event.rows ?? 10; // Captura o número de linhas (10 se undefined)

    // Aqui você pode verificar se rows é null
    const rowCount = this.rows !== null ? this.rows : 10; // Usar 10 se rows for null

    this.loadProducts(this.first, rowCount); // Recarrega os produtos para a nova página
  }
}
