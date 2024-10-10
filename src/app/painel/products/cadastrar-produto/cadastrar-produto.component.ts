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
import { UserService } from '../../../core/services/user.service';
import { UploadFileService } from '../../../core/services/upload-file.service';
import { CommonModule } from '@angular/common';

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
    CommonModule,
  ],
  standalone: true,
  styleUrl: './cadastrar-produto.component.css',
  providers: [MessageService],
})
export class CadastrarProdutoComponent implements OnInit {
  categories: Category[] = []; // Categorias carregadas
  selectedCategory: Category | null = null; // Categoria selecionada
  userId: string = ''; // UserId obtido do usuário logado
  imageUrl: string = '';
  selectedFileName: string | null = null;

  // FormGroup para controlar os valores do formulário
  formGroup: FormGroup = new FormGroup({
    name: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
    slug: new FormControl(''),
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
    private uploadFileService: UploadFileService,
    private categoryService: CategoryService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCategories(); // Carregar as categorias
    this.userId = this.userService.getUserIdFromToken() ?? '';
  }

  initializeProduct(): Product {
    return {
      id: 0,
      name: '',
      description: '',
      slug: '',
      price: 0,
      stock: 0,
      image: '',
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

  generateSlug(name: string, userId: string): string {
    const cleanName = name
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]/g, '');

    const userIdPrefix = userId.substring(0, 3);

    return `${cleanName}-${userIdPrefix}`;
  }

  // onImageUpload(event: any): void {
  //   if (event.files && event.files.length > 0) {
  //     const uploadedFile = event.files[0]; // Seleciona o arquivo enviado

  //     // Faz o upload da imagem para o S3
  //     this.productService
  //       .uploadImageToS3(uploadedFile, 'tesouros-produto')
  //       .subscribe(
  //         (response: any) => {
  //           this.imageUrl = response.Url; // URL retornada do S3
  //           console.log('Imagem carregada com sucesso:', this.imageUrl);

  //           // Atualiza o campo de imagem com a URL retornada
  //           this.formGroup.controls['image'].setValue(this.imageUrl);
  //         },
  //         (error) => {
  //           console.error('Erro ao carregar imagem:', error);
  //           this.messageService.add({
  //             severity: 'error',
  //             summary: 'Erro',
  //             detail: 'Ocorreu um erro ao carregar a imagem.',
  //           });
  //         }
  //       );
  //   }
  // }

  onImageUpload(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFileName = file.name;

      this.uploadFileService.uploadImage(file).subscribe(
        (response) => {
          this.imageUrl = response.url;
          console.log('Image uploaded and URL returned:', this.imageUrl);
        },
        (error) => {
          console.error('Error uploading image:', error);
        }
      );
    }
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
      slug: this.generateSlug(formValues.name, this.userId),
      price: formValues.price,
      stock: formValues.stock,
      image: this.imageUrl,
      isActive: formValues.isActive,
      categoryId: formValues.categoryId.id,
      userId: this.userId,
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
