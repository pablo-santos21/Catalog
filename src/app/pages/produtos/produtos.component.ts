import { Component, HostListener, OnInit } from '@angular/core';
import { Product } from '../../models/product';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../core/services/product.service';
import { Category } from '../../models/category';
import { PaginatorModule } from 'primeng/paginator';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { PagedResult } from '../../core/services/paged-result';
import { TableLazyLoadEvent } from 'primeng/table';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-produtos',
  standalone: true,
  imports: [CommonModule, PaginatorModule, ProgressSpinnerModule, RouterModule],
  templateUrl: './produtos.component.html',
  styleUrls: ['./produtos.component.css'],
})
export class ProdutosComponent implements OnInit {
  produtos: Product[] = [];
  categoria: Category[] = [];
  showModal: boolean = false;
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

  //Modal
  showProductModal(): void {
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      this.closeModal();
    }
  }

  onBackdropClick(event: MouseEvent): void {
    console.log('Backdrop clicked');
    const modal = document.getElementById('modalProd');
    const clickedInsideModal = modal && modal.contains(event.target as Node);
    console.log('Clicked inside modal:', clickedInsideModal);
    if (!clickedInsideModal) {
      this.closeModal();
    }
  }
}
