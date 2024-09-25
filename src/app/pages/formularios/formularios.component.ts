import { Component, OnInit } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputSwitchModule } from 'primeng/inputswitch';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { FileUploadEvent, FileUploadModule } from 'primeng/fileupload';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

interface City {
  name: string;
  code: string;
}

@Component({
  selector: 'app-formularios',
  standalone: true,
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
  providers: [FormControl, MessageService],
  templateUrl: './formularios.component.html',
  styleUrl: './formularios.component.css',
})
export class FormulariosComponent implements OnInit {
  value: string | undefined;
  value1!: number;
  value2!: number;
  formGroup!: FormGroup;
  isActive: boolean = true;
  cities: City[] | undefined;

  constructor(private messageService: MessageService) {}

  onBasicUploadAuto(event: FileUploadEvent) {
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: 'O arquivo foi enviado com sucesso',
    });
  }

  ngOnInit() {
    this.cities = [
      { name: 'New York', code: 'NY' },
      { name: 'Rome', code: 'RM' },
      { name: 'London', code: 'LDN' },
      { name: 'Istanbul', code: 'IST' },
      { name: 'Paris', code: 'PRS' },
    ];

    this.formGroup = new FormGroup({
      name: new FormControl(''),
      slug: new FormControl({ value: '', disabled: true }),
      price: new FormControl(''),
      stock: new FormControl(''),
      image: new FormControl(''),
      selectedCity: new FormControl<City | null>(null),
      description: new FormControl(''),
      isActive: new FormControl(true),
      text: new FormControl(''),
    });
  }

  onSubmit() {}
}
