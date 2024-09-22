import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { Category } from '../../../models/category';
import { Product } from '../../../models/product';
import { ProductService } from '../../../core/services/product.service';
import { CategoryService } from '../../../core/services/category.service';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputSwitchModule } from 'primeng/inputswitch';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { FileUploadModule } from 'primeng/fileupload';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-cadastrar-produto',
  templateUrl: './cadastrar-produto.component.html',
  imports: [
    InputTextModule,
    FormsModule,
    FloatLabelModule,
    InputTextareaModule,
    InputSwitchModule,
    ReactiveFormsModule,
    DropdownModule,
    InputNumberModule,
    FileUploadModule,
    ToastModule,
  ],
  standalone: true,
  styleUrl: './cadastrar-produto.component.css',
  providers: [MessageService],
})
export class CadastrarProdutoComponent implements OnInit {
  categories: Category[] = []; // Categorias carregadas
  selectedCategory: Category | null = null; // Categoria selecionada
  userId: string = ''; // UserId obtido do usuário logado

  // FormGroup para controlar os valores do formulário
  formGroup: FormGroup = new FormGroup({
    name: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
    slug: new FormControl('', Validators.required),
    price: new FormControl(null, Validators.required),
    stock: new FormControl(null, Validators.required),
    isActive: new FormControl(true),
    categoryId: new FormControl(null, Validators.required),
    image: new FormControl(null),
  });

  newProduct: Product = this.initializeProduct();

  constructor(
    private messageService: MessageService,
    private productService: ProductService,
    private categoryService: CategoryService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCategories(); // Carregar as categorias
    // this.userId = this.authService.getLoggedUserId(); // Obtém o userId do usuário logado
  }

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

  // Método para carregar as categorias
  loadCategories(): void {
    this.categoryService.getCategory().subscribe(
      (response: Category[]) => {
        this.categories = response;
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

  onSubmit() {
    if (this.formGroup.invalid) {
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Preencha todos os campos corretamente.',
      });
      return;
    }

    const formValues = this.formGroup.value;

    this.newProduct = {
      ...this.newProduct,
      name: formValues.name,
      description: formValues.description,
      slug: this.generateSlug(formValues.name),
      price: formValues.price,
      stock: formValues.stock,
      image: formValues.image,
      isActive: formValues.isActive,
      categoryId: formValues.categoryId.id,
      userId: this.userId, // Define o ID do usuário logado
    };

    this.productService.addProduct(this.newProduct).subscribe(
      (response) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Produto cadastrado com sucesso!',
        });
        this.router.navigate(['/listar-produtos']);
      },
      (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Ocorreu um erro ao cadastrar o produto.',
        });
      }
    );
  }
}
