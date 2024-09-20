import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { Product } from '../../models/product';
import { ProductService } from '../../core/services/product.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    InputTextModule,
    FormsModule,
    FloatLabelModule,
    CommonModule,
    ProgressSpinnerModule,
    ToastModule,
    ButtonModule,
    RippleModule,
  ],
  providers: [MessageService],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css',
})
export class ProductsComponent {
  products: Product[] = [];

  editProduct: Product = this.initializeProduct();
  newProduct: Product = this.initializeProduct();

  showEditModal: boolean = false;
  showCreateModal: boolean = false;
  isLoading: boolean = false;

  productExists: boolean = false;
  productErrorMessage: string = '';

  // editProduct: Product = {
  //   id: 0,
  //   title: '',
  //   description: '',
  //   local: 'Presencial',
  //   city: '',
  //   state: Estates.RS,
  //   neighborhood: '',
  //   createdAt: new Date(),
  //   updateAt: new Date(),
  //   eventDate: undefined,
  //   occurred: false,
  //   slug: '',
  //   typeEventId: 0,
  // };

  constructor(
    private productService: ProductService,
    private router: Router,
    private messageService: MessageService
  ) {}

  initializeProduct(): Product {
    return {
      id: 0,
      name: '',
      description: '',
      slug: '',
      price: 0,
      stock: 0,
      image: [],
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: '',
      categoryId: 0,
    };
  }

  showSuccess() {
    this.messageService.add({
      severity: 'success',
      summary: 'Sucesso',
      detail: 'Categoria salva com sucesso!',
    });
  }

  showError() {
    this.messageService.add({
      severity: 'error',
      summary: 'Deletado',
      detail: 'Categoria deletada!',
    });
  }

  ngOnInit(): void {
    this.loadProduct();
  }

  loadProduct(): void {
    this.isLoading = true;
    this.productService.getProduct().subscribe(
      (response) => {
        this.products = response; // Armazena as categorias retornadas na variável
        this.isLoading = false;
        console.log('Categorias carregadas com sucesso!', response);
      },
      (error) => {
        console.error('Erro ao carregar as categorias:', error);
        this.isLoading = false;
      }
    );
  }

  generateSlug(name: string): string {
    return name
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]/g, '');
  }

  onSubmit() {
    // Verifica se o título está vazio
    if (!this.newProduct.name) {
      console.error('Preencha todos os campos antes de enviar.');
      return;
    }

    // Gera o slug com base no título
    this.newProduct.slug = this.generateSlug(this.newProduct.name);

    // Chama o serviço para adicionar o novo evento agendado
    this.productService.addProduct(this.newProduct).subscribe(
      (response) => {
        console.log('Evento agendado com sucesso!', response);
        this.closeModal(); // Fecha o modal após o sucesso
        this.newProduct = this.initializeProduct(); // Reseta o formulário
        this.loadProduct(); // Atualiza a lista de eventos
        this.showSuccess(); // Exibe mensagem de sucesso
      },
      (error) => {
        console.error('Erro ao agendar o evento:', error);

        if (error.status === 409) {
          this.productExists = true;
          this.productErrorMessage = 'Evento já existe.';

          const nameInput = document.getElementById('name');
          if (nameInput) {
            nameInput.focus();
          }
        }
      }
    );
  }

  // navigateToCreateCategory() {
  //   this.router.navigate(['/cadastrar-categoria']);
  // }

  deleteProduct(id: number): void {
    if (confirm('Você tem certeza que deseja excluir esta categoria?')) {
      this.productService.deleteProduct(id).subscribe(
        () => {
          this.products = this.products.filter(
            (products) => products.id !== id
          );
          alert('Categoria excluída com sucesso.');
          this.showError();
        },
        (error) => {
          console.error('Erro ao excluir categoria', error);
          alert('Erro ao excluir categoria.');
        }
      );
    }
  }

  editProductModal(product: Product): void {
    this.editProduct = { ...product };
    this.showEditModal = true;
    this.productExists = false;
    this.productErrorMessage = '';
  }

  createProductModal(): void {
    this.newProduct = this.initializeProduct();
    this.showCreateModal = true;
    this.productExists = false;
    this.productErrorMessage = '';
  }

  closeModal(): void {
    this.showEditModal = false;
    this.showCreateModal = false;
  }

  onEditSubmit(): void {
    if (this.editProduct.name) {
      this.editProduct.slug = this.generateSlug(this.editProduct.name);

      this.productService.updateProduct(this.editProduct).subscribe(
        (response) => {
          console.log('Categoria atualizada com sucesso!', response);
          this.showEditModal = false;
          this.productExists = false;
          this.productErrorMessage = '';
          this.loadProduct();
          this.showSuccess();
        },
        (error) => {
          console.error('Erro ao atualizar a categoria:', error);
          // Atualize o tratamento de erro para refletir o status da API
          if (error.status === 409) {
            this.productExists = true;
            this.productErrorMessage = 'Categoria já existe.';
          } else {
            this.productExists = false;
            this.productErrorMessage = 'Erro ao atualizar a categoria.';
          }
        }
      );
    }
  }
}
