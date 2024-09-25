import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
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
import { Category } from '../../models/category';
import { CategoryService } from '../../core/services/category.service';

import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputSwitchModule } from 'primeng/inputswitch';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { FileUploadModule } from 'primeng/fileupload';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    InputTextModule,
    FormsModule,
    ReactiveFormsModule,
    FloatLabelModule,
    CommonModule,
    ProgressSpinnerModule,
    ToastModule,
    ButtonModule,
    RippleModule,
    InputTextareaModule,
    InputSwitchModule,
    DropdownModule,
    InputNumberModule,
    FileUploadModule,
  ],
  providers: [MessageService],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];

  editForm!: FormGroup;
  categories: Category[] = []; // Populated categories from the API

  editProduct: Product = this.initializeProduct();
  newProduct: Product = this.initializeProduct();

  showEditModal: boolean = false;
  isLoading: boolean = false;
  productExists: boolean = false;
  productErrorMessage: string = '';

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private router: Router,
    private messageService: MessageService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.loadProduct();
    this.loadCategories();
  }

  navigateToCreateProduto() {
    this.router.navigate(['/cadastrar-produto']);
  }

  // navigateToUpdateProduto() {
  //   this.router.navigate(['/editar-produto']);
  // }

  initializeForm(): void {
    this.editForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      categoryId: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      stock: [0, [Validators.required, Validators.min(0)]],
      isActive: [true],
      image: [''],
    });
  }

  initializeProduct(): Product {
    return {
      id: 0,
      name: '',
      description: '',
      slug: '',
      price: 0,
      stock: 0,
      image: ['imagem.jpg'],
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: '',
      categoryId: 0,
    };
  }

  loadProduct(): void {
    this.isLoading = true;
    this.productService.getProduct().subscribe(
      (response) => {
        this.products = response;
        this.isLoading = false;
        console.log('Produtos carregados com sucesso!', response);
      },
      (error) => {
        console.error('Erro ao carregar produtos:', error);
        this.isLoading = false;
      }
    );
  }

  loadCategories(): void {
    this.categoryService.getCategory().subscribe(
      (response: Category[]) => {
        this.categories = response;
        console.log('Categorias carregadas:', this.categories);
      },
      (error) => {
        console.error('Erro ao carregar categorias:', error);
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

  onBasicUploadAuto(event: any): void {
    if (event.files && event.files.length > 0) {
      const uploadedFile = event.files[0];
      this.newProduct.image = uploadedFile.name; // Salva o nome do arquivo ou o link
      console.log('Arquivo carregado com sucesso:', uploadedFile);
    }
  }

  deleteProduct(id: number): void {
    if (confirm('Você tem certeza que deseja excluir este produto?')) {
      this.productService.deleteProduct(id).subscribe(
        () => {
          this.products = this.products.filter((product) => product.id !== id);
          this.showError();
        },
        (error) => {
          console.error('Erro ao excluir produto', error);
        }
      );
    }
  }

  editProductModal(product: Product): void {
    this.editProduct = { ...product };
    this.editForm.patchValue(this.editProduct); // Atualiza o formulário com os dados do produto
    this.showEditModal = true;
    this.productExists = false;
    this.productErrorMessage = '';
  }

  closeModal(): void {
    this.showEditModal = false;
  }

  onEditSubmit(): void {
    if (this.editForm.valid) {
      this.editProduct = { ...this.editProduct, ...this.editForm.value };
      this.editProduct.slug = this.generateSlug(this.editProduct.name!);

      this.productService.updateProduct(this.editProduct).subscribe(
        () => {
          this.showEditModal = false;
          this.loadProduct();
          this.messageService.add({
            severity: 'success',
            summary: 'Sucesso',
            detail: 'Produto atualizado com sucesso!',
          });
        },
        (error) => {
          console.error('Erro ao atualizar produto:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Falha ao atualizar o produto.',
          });
        }
      );
    }
  }

  showSuccess() {
    this.messageService.add({
      severity: 'success',
      summary: 'Sucesso',
      detail: 'Produto cadastrado com sucesso!',
    });
  }

  showError() {
    this.messageService.add({
      severity: 'error',
      summary: 'Erro',
      detail: 'Produto excluído!',
    });
  }
}
