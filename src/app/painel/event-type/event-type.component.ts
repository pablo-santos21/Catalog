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
import { TypeEvent } from '../../models/TypeEvent';
import { TypeEventService } from '../../core/services/type-event.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-event-type',
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
  templateUrl: './event-type.component.html',
  styleUrl: './event-type.component.css',
})
export class EventTypeComponent {
  typeEvents: TypeEvent[] = [];

  name: string = '';
  slug: string = '';

  showEditModal: boolean = false;
  showCreateModal: boolean = false;
  isLoading: boolean = false;

  typeEventExists: boolean = false;
  typeEventErrorMessage: string = '';
  editTypeEvent: TypeEvent = {
    id: 0,
    name: '',
    slug: '',
  };

  constructor(
    private typeEventService: TypeEventService,
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
    this.loadTypeEvent();
  }

  loadTypeEvent(): void {
    this.isLoading = true;
    this.typeEventService.getTypeEvent().subscribe(
      (response) => {
        this.typeEvents = response; // Armazena as categorias retornadas na variável
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
    if (!this.name) {
      console.error('Preencha todos os campos antes de enviar.');

      if (!this.name) {
        this.typeEventErrorMessage = 'O campo nome é obrigatório.';
      }

      return;
    }

    this.slug = this.generateSlug(this.name);

    const newTypeEvent: TypeEvent = {
      id: 0,
      name: this.name,
      slug: this.slug,
    };

    this.typeEventService.addTypeEvent(newTypeEvent).subscribe(
      (response) => {
        console.log('Categoria cadastrada com sucesso!', response);
        this.closeModal(); // Fechar o modal após o sucesso
        this.name = '';
        this.slug = '';
        this.loadTypeEvent();
        this.showSuccess();
      },
      (error) => {
        console.error('Erro ao cadastrar a categoria:', error);

        if (error.status === 409) {
          this.typeEventExists = true;
          this.typeEventErrorMessage = 'Categoria já existe.';

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

  deleteTypeEvent(id: number): void {
    if (confirm('Você tem certeza que deseja excluir esta categoria?')) {
      this.typeEventService.deleteTypeEvent(id).subscribe(
        () => {
          this.typeEvents = this.typeEvents.filter(
            (typeEvents) => typeEvents.id !== id
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

  editTypeEventModal(typeEvents: TypeEvent): void {
    this.editTypeEvent = { ...typeEvents };
    this.showEditModal = true;
    this.typeEventExists = false;
    this.typeEventErrorMessage = '';
  }

  createTypeEventModal(): void {
    this.showCreateModal = true;
    this.typeEventExists = false;
    this.typeEventErrorMessage = '';
  }

  closeModal(): void {
    this.showEditModal = false;
    this.showCreateModal = false;
  }

  onEditSubmit(): void {
    this.editTypeEvent.slug = this.generateSlug(this.editTypeEvent.name);

    this.typeEventService.updateTypeEvent(this.editTypeEvent).subscribe(
      (response) => {
        console.log('Categoria atualizada com sucesso!', response);
        this.showEditModal = false;
        this.typeEventExists = false;
        this.typeEventErrorMessage = '';
        this.loadTypeEvent();
        this.showSuccess();
      },
      (error) => {
        console.error('Erro ao atualizar a categoria:', error);
        // Atualize o tratamento de erro para refletir o status da API
        if (error.status === 409) {
          this.typeEventExists = true;
          this.typeEventErrorMessage = 'Categoria já existe.';
        } else {
          this.typeEventExists = false;
          this.typeEventErrorMessage = 'Erro ao atualizar a categoria.';
        }
      }
    );
  }
}
