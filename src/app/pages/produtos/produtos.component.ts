import { Component, HostListener, OnInit } from '@angular/core';
import { Product } from '../../models/product';
import { CommonModule } from '@angular/common';
import { Category } from '../../models/category';
import { PaginatorModule } from 'primeng/paginator';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { PagedResult } from '../../core/services/paged-result';
import { TableLazyLoadEvent } from 'primeng/table';
import { RouterModule } from '@angular/router';
import { ProductService } from '../../core/services/product.service';

@Component({
  selector: 'app-produtos',
  standalone: true,
  imports: [CommonModule, PaginatorModule, ProgressSpinnerModule, RouterModule],
  templateUrl: './produtos.component.html',
  styleUrls: ['./produtos.component.css'],
})
export class ProdutosComponent implements OnInit {
  produtos: Product[] = [];
  selectedProduct: any = null;
  showModal: boolean = false;
  totalRecords: number = 0;

  first: number = 0;
  rows: number = 8;

  constructor(private service: ProductService) {}

  ngOnInit(): void {
    this.loadProduct(this.first, this.rows);
  }

  loadProduct(pageIndex: number, pageSize: number): void {
    const page = pageIndex / pageSize + 1;
    this.service
      .GetAllProductsAsync(page, pageSize)
      .subscribe((data: PagedResult<Product>) => {
        this.produtos = data.itens;
        this.totalRecords = data.totalCount;
      });
  }

  onPageChange(event: TableLazyLoadEvent): void {
    this.first = event.first ?? 0;
    this.rows = event.rows ?? 10;
    this.loadProduct(this.first, this.rows);
  }

  showProductModal(produto: Product): void {
    this.selectedProduct = produto;
    this.showModal = true;
    console.log(produto);
  }

  closeModal(): void {
    this.showModal = false;
    this.selectedProduct = null;
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      this.closeModal();
    }
  }

  onBackdropClick(event: MouseEvent): void {
    const modal = document.getElementById('modalProd');
    const clickedInsideModal = modal && modal.contains(event.target as Node);
    if (!clickedInsideModal) {
      this.closeModal();
    }
  }
}
