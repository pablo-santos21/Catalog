import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { UserService } from '../../../core/services/user.service';
import { CommonModule } from '@angular/common';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-trocar-senha',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ToastModule],
  templateUrl: './trocar-senha.component.html',
  styleUrl: './trocar-senha.component.css',
  providers: [MessageService],
})
export class TrocarSenhaComponent {
  changePasswordForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private messageService: MessageService
  ) {
    this.changePasswordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', Validators.required],
      confirmPassword: ['', Validators.required],
    });
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

  get formControls() {
    return this.changePasswordForm.controls;
  }

  onSubmit() {
    // Verifica se os campos do formulário são válidos
    if (this.changePasswordForm.invalid) {
      console.error('O formulário não é válido');
      return;
    }

    // Verifica se a nova senha e a confirmação são iguais
    if (
      this.formControls['newPassword'].value !==
      this.formControls['confirmPassword'].value
    ) {
      console.error('A nova senha e a confirmação da senha não coincidem');
      return;
    }

    const userId = this.userService.getUserIdFromToken(); // Obtendo o ID do usuário

    if (userId) {
      this.userService
        .changePassword(
          userId,
          this.formControls['currentPassword'].value,
          this.formControls['newPassword'].value
        )
        .subscribe(
          (response) => {
            console.log('Senha alterada com sucesso!', response);
            this.showSuccess();
          },
          (error) => {
            console.error('Erro ao mudar a senha:', error);
            this.showError();
          }
        );
    } else {
      console.error('ID do usuário não pode ser nulo');
    }
  }
}
