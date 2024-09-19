import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CategoryService } from '../../core/services/category.service';
import { Category } from '../../models/category';
import { Router } from '@angular/router';

// PRIMENG
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';

@Component({
  selector: 'app-categories',
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
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css'], // Corrigido de 'styleUrl' para 'styleUrls'
})
export class CategoriesComponent implements OnInit {
  categories: Category[] = [];

  name: string = '';
  description: string = '';
  slug: string = '';

  showEditModal: boolean = false;
  showCreateModal: boolean = false;
  isLoading: boolean = false;

  categoryExists: boolean = false;
  categoryErrorMessage: string = '';
  editCategory: Category = {
    id: 0,
    name: '',
    description: '',
    slug: '',
  };

  constructor(
    private categoryService: CategoryService,
    private router: Router,
    private messageService: MessageService
  ) {}

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
    this.loadCategories(); // Chama o método para carregar as categorias ao iniciar o componente
  }

  loadCategories(): void {
    this.isLoading = true;
    this.categoryService.getCategory().subscribe(
      (response) => {
        this.categories = response; // Armazena as categorias retornadas na variável
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
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]/g, '');
  }

  onSubmit() {
    if (!this.name || !this.description) {
      console.error('Preencha todos os campos antes de enviar.');

      if (!this.name) {
        this.categoryErrorMessage = 'O campo nome é obrigatório.';
      }

      if (!this.description) {
        this.categoryErrorMessage = 'O campo descrição é obrigatório.';
      }

      return;
    }

    this.slug = this.generateSlug(this.name);

    const newCategory: Category = {
      id: 0,
      name: this.name,
      description: this.description,
      slug: this.slug,
    };

    this.categoryService.addCategory(newCategory).subscribe(
      (response) => {
        console.log('Categoria cadastrada com sucesso!', response);
        this.closeModal(); // Fechar o modal após o sucesso
        this.name = '';
        this.description = '';
        this.slug = '';
        this.loadCategories();
        this.showSuccess();
      },
      (error) => {
        console.error('Erro ao cadastrar a categoria:', error);

        if (error.status === 409) {
          this.categoryExists = true;
          this.categoryErrorMessage = 'Categoria já existe.';

          const nameInput = document.getElementById('name');
          if (nameInput) {
            nameInput.focus();
          }
        }
      }
    );
  }

  navigateToCreateCategory() {
    this.router.navigate(['/cadastrar-categoria']);
  }

  deleteCategory(id: number): void {
    if (confirm('Você tem certeza que deseja excluir esta categoria?')) {
      this.categoryService.deleteCategory(id).subscribe(
        () => {
          this.categories = this.categories.filter(
            (category) => category.id !== id
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

  editCategoryModal(category: Category): void {
    this.editCategory = { ...category };
    this.showEditModal = true;
    this.categoryExists = false;
    this.categoryErrorMessage = '';
  }

  createCategoryModal(): void {
    this.showCreateModal = true;
    this.categoryExists = false;
    this.categoryErrorMessage = '';
  }

  closeModal(): void {
    this.showEditModal = false;
    this.showCreateModal = false;
  }

  onEditSubmit(): void {
    this.editCategory.slug = this.generateSlug(this.editCategory.name);

    this.categoryService.updateCategory(this.editCategory).subscribe(
      (response) => {
        console.log('Categoria atualizada com sucesso!', response);
        this.showEditModal = false;
        this.categoryExists = false;
        this.categoryErrorMessage = '';
        this.loadCategories();
        this.showSuccess();
      },
      (error) => {
        console.error('Erro ao atualizar a categoria:', error);
        // Atualize o tratamento de erro para refletir o status da API
        if (error.status === 409) {
          this.categoryExists = true;
          this.categoryErrorMessage = 'Categoria já existe.';
        } else {
          this.categoryExists = false;
          this.categoryErrorMessage = 'Erro ao atualizar a categoria.';
        }
      }
    );
  }
}
