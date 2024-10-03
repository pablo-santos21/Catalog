import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../core/services/user.service';
import { Router } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-forgotpassword',
  standalone: true,
  imports: [FormsModule, CommonModule, ToastModule],
  templateUrl: './forgotpassword.component.html',
  styleUrls: ['./forgotpassword.component.css'],
  providers: [MessageService],
})
export class ForgotpasswordComponent {
  email: string = '';
  loginError: boolean = false;
  loginErrorMessage: string = '';

  constructor(
    private userService: UserService,
    private messageService: MessageService,
    private router: Router
  ) {}

  forgot() {
    if (!this.email) {
      this.loginError = true;
      this.loginErrorMessage = 'Por favor, insira seu e-mail.';
      return;
    }

    // Chame o serviço de recuperação de senha
    this.userService.forgotPassword(this.email).subscribe(
      (response) => {
        // Mostra o Toast de sucesso
        this.messageService.add({
          severity: 'success',
          summary: 'E-mail Enviado',
          detail: 'Um link de recuperação foi enviado ao seu e-mail.',
        });

        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 4000);
      },
      (error) => {
        // Mostra o Toast de erro
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Não foi possível enviar o e-mail de recuperação.',
        });
        this.loginError = true;
        this.loginErrorMessage =
          'Erro ao recuperar a senha. Verifique o e-mail e tente novamente.';
      }
    );
  }
}
