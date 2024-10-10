import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-fornecedor',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './fornecedor.component.html',
  styleUrl: './fornecedor.component.css',
  providers: [MessageService],
})
export class FornecedorComponent implements OnInit {
  companyForm: FormGroup = this.fb.group({
    companyName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    contactNumber: ['', Validators.required],
    aboutCompany: ['', Validators.required],
  });

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.companyForm = this.fb.group({
      companyName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      contactNumber: ['', Validators.required],
      aboutCompany: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.companyForm.valid) {
      const formData = this.companyForm.value;

      const emailData = {
        to: ['tesourosdaterraoficial@gmail.com'],
        subject: 'Informações da Empresa',
        body: `
          <h2>Pedido de Cadastro de Empresa</h2>
          <p><strong>Nome da Empresa:</strong> ${formData.companyName}</p>
          <p><strong>Email Cadastrado:</strong> ${formData.email}</p>
          <p><strong>Número de Contato:</strong> ${formData.contactNumber}</p>
          <p><strong>Sobre a Empresa:</strong> ${formData.aboutCompany}</p>
        `,
      };

      this.http.post('http://localhost:5062/v1/Email', emailData).subscribe(
        (response: any) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Sucesso',
            detail: 'Email enviado com sucesso!',
          });
          this.companyForm.reset();
        },
        (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Falha ao enviar o email. Tente novamente mais tarde.',
          });
        }
      );
    } else {
      this.messageService.add({
        severity: 'warn',
        summary: 'Formulário Inválido',
        detail: 'Por favor, preencha todos os campos obrigatórios.',
      });
    }
  }
}
