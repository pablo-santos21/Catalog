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
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputSwitchModule } from 'primeng/inputswitch';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { FileUploadModule } from 'primeng/fileupload';
import { ToastModule } from 'primeng/toast';
import { TypeEvent } from '../../../models/TypeEvent';
import { ScheduledEvent } from '../../../models/scheduled-event';
import { ScheduledEventService } from '../../../core/services/scheduled-event.service';
import { TypeEventService } from '../../../core/services/type-event.service';
import { CalendarModule } from 'primeng/calendar';
import { States, State } from '../../../models/Estates';

@Component({
  selector: 'app-cadastrar-evento',
  templateUrl: './cadastrar-evento.component.html',
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
    CalendarModule,
  ],
  standalone: true,
  styleUrl: './cadastrar-evento.component.css',
  providers: [MessageService],
})
export class CadastrarEventoComponent implements OnInit {
  typeEvent: TypeEvent[] = []; // Categorias carregadas
  selectedTypeEvent: TypeEvent | null = null; // Categoria selecionada
  userId: string = ''; // UserId obtido do usuário logado
  eventDate: Date[] | undefined;
  states: State[] = States;
  statesDropdown: { label: string; value: State }[] = [];

  modalOptions = [
    { label: 'Online', value: 'Online' },
    { label: 'Presencial', value: 'Presencial' },
  ];

  // FormGroup para controlar os valores do formulário
  formGroup: FormGroup = new FormGroup({
    title: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
    local: new FormControl('', Validators.required),
    city: new FormControl('', Validators.required),
    state: new FormControl(null, Validators.required),
    neighborhood: new FormControl('', Validators.required),
    linkEvent: new FormControl('', Validators.required),
    image: new FormControl(''),
    eventDate: new FormControl(null),
    occurred: new FormControl(true),
    slug: new FormControl(''),
    typeEventId: new FormControl(null, Validators.required),
  });

  newEvent: ScheduledEvent = this.initializeProduct();

  constructor(
    private messageService: MessageService,
    private scheduledEventService: ScheduledEventService,
    private typeEventService: TypeEventService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadStates();
    this.loadTypeEvent(); // Carregar as categorias
    // this.userId = this.authService.getLoggedUserId(); // Obtém o userId do usuário logado
  }

  initializeProduct(): ScheduledEvent {
    return {
      id: 0,
      title: '',
      description: '',
      slug: '',
      local: 'Presencial',
      city: '',
      state: States[23],
      neighborhood: '',
      linkEvent: '',
      image: '',
      occurred: false,
      createdAt: new Date(),
      updateAt: new Date(),
      eventDate: new Date(),
      typeEventId: 0,
    };
  }

  // Método para carregar as categorias
  loadTypeEvent(): void {
    this.typeEventService.getTypeEvent().subscribe(
      (response: TypeEvent[]) => {
        this.typeEvent = response;
      },
      (error) => {
        console.error('Erro ao carregar os tipos de eventos:', error);
      }
    );
  }

  loadStates() {
    this.statesDropdown = States.map((state) => ({
      label: state.name, // Usando `name` como rótulo
      value: state, // Passando o objeto `state` completo como valor
    }));
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
      this.newEvent.image = uploadedFile.name; // Salva o nome do arquivo ou o link
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

    const eventDate = new Date(formValues.eventDate);
    const localEventDate = new Date(
      eventDate.getTime() - eventDate.getTimezoneOffset() * 60000
    );

    this.newEvent = {
      ...this.newEvent,
      title: formValues.title,
      description: formValues.description,
      local: formValues.local.value,
      city: formValues.city,
      state: formValues.state.value.id,
      neighborhood: formValues.neighborhood,
      linkEvent: formValues.linkEvent,
      image: formValues.image,
      eventDate: localEventDate,
      occurred: formValues.occurred,
      slug: this.generateSlug(formValues.title),
      typeEventId: formValues.typeEventId.id,
    };

    this.scheduledEventService.addScheduledEvent(this.newEvent).subscribe(
      (response) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Evento cadastrado com sucesso!',
        });
        this.router.navigate(['/listar-eventos']);
      },
      (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Ocorreu um erro ao cadastrar o evento.',
        });
      }
    );
  }
}
