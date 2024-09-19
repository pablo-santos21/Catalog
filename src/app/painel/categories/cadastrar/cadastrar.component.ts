import { Component } from '@angular/core';
import { Category } from '../../../models/category';
import { CategoryService } from '../../../core/services/category.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-cadastrar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cadastrar.component.html',
  styleUrl: './cadastrar.component.css',
})
export class CadastrarComponent {
  // Valores do formulário
  name: string = '';
  description: string = '';
  slug: string = '';
  categoryExists: boolean = false;

  // Injete o serviço CategoryService no construtor
  constructor(private categoryService: CategoryService) {}

  // Método para gerar automaticamente o slug com base no nome
  generateSlug(name: string): string {
    return name
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-');
  }

  // Método para envio do formulário
  onSubmit() {
    // Gerar slug automaticamente com base no nome
    this.slug = this.generateSlug(this.name);

    // Criação do objeto categoria
    const newCategory: Category = {
      id: 0,
      name: this.name,
      description: this.description,
      slug: this.slug,
    };

    // Chama o serviço para cadastrar a categoria
    this.categoryService.addCategory(newCategory).subscribe(
      (response) => {
        console.log('Categoria cadastrada com sucesso!', response);

        this.name = '';
        this.description = '';
        this.slug = '';
      },
      (error) => {
        console.error('Erro ao cadastrar a categoria:', error);

        // Verifica se o erro é 409 (Conflito) para indicar que a categoria já existe
        if (error.status === 409) {
          this.categoryExists = true;

          // Foca no campo de nome para o usuário corrigir
          const nameInput = document.getElementById('name');
          if (nameInput) {
            nameInput.focus();
          }
        }
      }
    );
  }
}
