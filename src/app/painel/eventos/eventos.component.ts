import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
} from '@angular/forms';
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
import { State, States } from '../../models/Estates';

import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputSwitchModule } from 'primeng/inputswitch';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { FileUploadModule } from 'primeng/fileupload';
import { CalendarModule } from 'primeng/calendar';
import { TypeEvent } from '../../models/TypeEvent';
import { TypeEventService } from '../../core/services/type-event.service';

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
    ReactiveFormsModule,
    InputTextareaModule,
    InputSwitchModule,
    DropdownModule,
    InputNumberModule,
    FileUploadModule,
    CalendarModule,
  ],
  providers: [MessageService],
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.css'],
})
export class EventosComponent {
  isLoading: any;
  scheduledEvents: ScheduledEvent[] = [];

  eventDate: Date | null = null; // Adicionado

  editForm!: FormGroup;
  showEditModal: boolean = false;
  showCreateModal: boolean = false;

  editScheduledEvent: ScheduledEvent = this.initializeScheduledEvent();
  newScheduledEvent: ScheduledEvent = this.initializeScheduledEvent();

  scheduledEventExists: boolean = false;
  scheduledEventErrorMessage: string = '';

  typeEvent: TypeEvent[] = [];
  statesDropdown: { label: string; value: State }[] = [];
  modalOptions: any[] = [
    { id: 'presencial', label: 'Presencial' },
    { id: 'online', label: 'Online' },
  ]; // Opções de modalidade

  constructor(
    private scheduledEventService: ScheduledEventService,
    private typeEventService: TypeEventService,
    private messageService: MessageService,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.loadScheduledEvents();
    this.loadStates();
  }

  navigateToCreateEvent() {
    this.router.navigate(['/cadastrar-evento']);
  }

  initializeState(): State {
    return { id: 0, name: '', abbreviation: '' };
  }

  initializeForm(): void {
    this.editForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      city: ['', Validators.required],
      neighborhood: ['', Validators.required],
      typeEventId: [null, Validators.required],
      state: [this.initializeState(), Validators.required],
      local: [null, Validators.required],
      linkEvent: ['', Validators.required],
      eventDate: [new Date(), Validators.required],
      occurred: [false],
      image: [''],
      slug: [''],
    });
  }

  initializeScheduledEvent(): ScheduledEvent {
    return {
      id: 0,
      title: '',
      description: '',
      local: 'Presencial',
      city: '',
      state: States[1],
      neighborhood: '',
      linkEvent: '',
      createdAt: new Date(),
      updateAt: new Date(),
      eventDate: new Date(),
      occurred: false,
      slug: '',
      typeEventId: 0,
    };
  }

  loadScheduledEvents(): void {
    this.isLoading = true;
    this.scheduledEventService.getScheduledEvent().subscribe(
      (response) => {
        this.scheduledEvents = response;
        this.isLoading = false;
        console.log('Evento carregado com sucesso', response);
      },
      (error) => {
        console.error('Erro ao carregar os eventos:', error);
        this.isLoading = false;
      }
    );
  }

  loadStates() {
    this.statesDropdown = States.map((state) => ({
      label: state.name,
      value: state,
    }));
  }

  // Utility function to generate slugs
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
      this.newScheduledEvent.image = uploadedFile.name; // Salva o nome do arquivo ou o link
      console.log('Arquivo carregado com sucesso:', uploadedFile);
    }
  }

  deleteScheduledEvent(id: number): void {
    if (confirm('Você tem certeza que deseja excluir este evento?')) {
      this.scheduledEventService.deleteScheduledEvent(id).subscribe(
        () => {
          this.scheduledEvents = this.scheduledEvents.filter(
            (scheduledEvents) => scheduledEvents.id !== id
          );
          this.showError();
        },
        (error) => {
          console.error('Erro ao excluir evento', error);
        }
      );
    }
  }

  editScheduledEventModal(scheduledEvent: ScheduledEvent): void {
    this.editScheduledEvent = { ...scheduledEvent };

    if (
      this.editScheduledEvent.eventDate &&
      typeof this.editScheduledEvent.eventDate === 'string'
    ) {
      this.editScheduledEvent.eventDate = new Date(
        this.editScheduledEvent.eventDate
      );
    }

    this.editForm.patchValue(this.editScheduledEvent);
    this.showEditModal = true;
    this.scheduledEventExists = false;
    this.scheduledEventErrorMessage = '';
  }

  closeModal(): void {
    this.showEditModal = false;
  }

  // Toast notification functions
  showSuccess() {
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Event updated successfully!',
    });
  }

  showError() {
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Error updating event!',
    });
  }

  truncateDescription(description?: string, maxLength: number = 120): string {
    if (!description) return ''; // Retorna uma string vazia se a descrição for undefined
    if (description.length > maxLength) {
      return description.substring(0, maxLength) + ' ...';
    }
    return description;
  }

  onEditSubmit(): void {
    if (this.editForm.valid) {
      let eventDateLocal = this.editForm.value.eventDate;

      if (!(eventDateLocal instanceof Date)) {
        eventDateLocal = new Date(eventDateLocal);
      }

      const eventDateUTC = new Date(
        eventDateLocal.getTime() - eventDateLocal.getTimezoneOffset() * 60000
      );

      this.editScheduledEvent = {
        ...this.editScheduledEvent,
        ...this.editForm.value,
        eventDate: eventDateUTC,
      };
      this.editScheduledEvent.slug = this.generateSlug(
        this.editScheduledEvent.title!
      );

      this.scheduledEventService
        .updateScheduledEvent(this.editScheduledEvent)
        .subscribe(
          () => {
            this.showEditModal = false;
            this.loadScheduledEvents();
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
    } else {
      // Find invalid controls
      const invalidFields: string[] = [];
      Object.keys(this.editForm.controls).forEach((field) => {
        const control = this.editForm.get(field);
        if (control && control.invalid) {
          invalidFields.push(field);
          console.log('Estado selecionado:', this.editForm.value.state);
        }
      });

      // Display missing or invalid fields
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: `Campos inválidos: ${invalidFields.join(', ')}`,
      });

      console.log('Invalid form fields:', invalidFields);
    }
  }
}
