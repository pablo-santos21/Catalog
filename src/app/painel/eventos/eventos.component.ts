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
import { EventLocation, ScheduledEvent } from '../../models/scheduled-event';
import { Router } from '@angular/router';
import { ScheduledEventService } from '../../core/services/scheduled-event.service';
import { Estates } from '../../models/Estates';

@Component({
  selector: 'app-eventos',
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
  templateUrl: './eventos.component.html',
  styleUrl: './eventos.component.css',
})
export class EventosComponent {
  scheduledEvents: ScheduledEvent[] = [];

  editScheduledEvent: ScheduledEvent = this.initializeScheduledEvent();
  newScheduledEvent: ScheduledEvent = this.initializeScheduledEvent();

  showEditModal: boolean = false;
  showCreateModal: boolean = false;
  isLoading: boolean = false;

  scheduledEventExists: boolean = false;
  scheduledEventErrorMessage: string = '';

  // editScheduledEvent: ScheduledEvent = {
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
    private scheduledEventService: ScheduledEventService,
    private router: Router,
    private messageService: MessageService
  ) {}

  initializeScheduledEvent(): ScheduledEvent {
    return {
      id: 0,
      title: '',
      description: '',
      local: 'Presencial',
      city: '',
      state: Estates.RS,
      neighborhood: '',
      createdAt: new Date(),
      updateAt: new Date(),
      eventDate: undefined,
      occurred: false,
      slug: '',
      typeEventId: 0,
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
    this.loadScheduledEvent();
  }

  loadScheduledEvent(): void {
    this.isLoading = true;
    this.scheduledEventService.getScheduledEvent().subscribe(
      (response) => {
        this.scheduledEvents = response; // Armazena as categorias retornadas na variável
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
    if (!this.newScheduledEvent.title) {
      console.error('Preencha todos os campos antes de enviar.');
      return;
    }

    // Gera o slug com base no título
    this.newScheduledEvent.slug = this.generateSlug(
      this.newScheduledEvent.title
    );

    // Chama o serviço para adicionar o novo evento agendado
    this.scheduledEventService
      .addScheduledEvent(this.newScheduledEvent)
      .subscribe(
        (response) => {
          console.log('Evento agendado com sucesso!', response);
          this.closeModal(); // Fecha o modal após o sucesso
          this.newScheduledEvent = this.initializeScheduledEvent(); // Reseta o formulário
          this.loadScheduledEvent(); // Atualiza a lista de eventos
          this.showSuccess(); // Exibe mensagem de sucesso
        },
        (error) => {
          console.error('Erro ao agendar o evento:', error);

          if (error.status === 409) {
            this.scheduledEventExists = true;
            this.scheduledEventErrorMessage = 'Evento já existe.';

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

  deleteScheduledEvent(id: number): void {
    if (confirm('Você tem certeza que deseja excluir esta categoria?')) {
      this.scheduledEventService.deleteScheduledEvent(id).subscribe(
        () => {
          this.scheduledEvents = this.scheduledEvents.filter(
            (scheduledEvents) => scheduledEvents.id !== id
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

  editScheduledEventModal(scheduledEvent: ScheduledEvent): void {
    this.editScheduledEvent = { ...scheduledEvent };
    this.showEditModal = true;
    this.scheduledEventExists = false;
    this.scheduledEventErrorMessage = '';
  }

  createScheduledEventModal(): void {
    this.newScheduledEvent = this.initializeScheduledEvent();
    this.showCreateModal = true;
    this.scheduledEventExists = false;
    this.scheduledEventErrorMessage = '';
  }

  closeModal(): void {
    this.showEditModal = false;
    this.showCreateModal = false;
  }

  onEditSubmit(): void {
    if (this.editScheduledEvent.title) {
      this.editScheduledEvent.slug = this.generateSlug(
        this.editScheduledEvent.title
      );

      this.scheduledEventService
        .updateScheduledEvent(this.editScheduledEvent)
        .subscribe(
          (response) => {
            console.log('Categoria atualizada com sucesso!', response);
            this.showEditModal = false;
            this.scheduledEventExists = false;
            this.scheduledEventErrorMessage = '';
            this.loadScheduledEvent();
            this.showSuccess();
          },
          (error) => {
            console.error('Erro ao atualizar a categoria:', error);
            // Atualize o tratamento de erro para refletir o status da API
            if (error.status === 409) {
              this.scheduledEventExists = true;
              this.scheduledEventErrorMessage = 'Categoria já existe.';
            } else {
              this.scheduledEventExists = false;
              this.scheduledEventErrorMessage =
                'Erro ao atualizar a categoria.';
            }
          }
        );
    }
  }
}
