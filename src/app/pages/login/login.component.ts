import { Component, OnInit } from '@angular/core';
import { UserService } from '../../core/services/user.service';
import { MessageService } from '../../core/services/message.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  message: string | null = null;
  loginErrorMessage: string = '';

  email: string = '';
  password: string = '';
  passwordVisible: boolean = false;
  loginError: boolean = false;

  constructor(
    private userService: UserService,
    private router: Router,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.messageService.currentMessage.subscribe((message) => {
      this.message = message;
      if (message) {
        setTimeout(() => (this.message = null), 3000); // Remove a mensagem após 3 segundos
      }
    });
  }

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }

  login(): void {
    this.userService.login(this.email, this.password).subscribe({
      next: (response) => {
        const token = response.token;
        const payload = JSON.parse(atob(token.split('.')[1]));
        const role = payload.role;
        if (
          role === 'Admin' ||
          role === 'Seller' ||
          role === 'SuperUser' ||
          role === 'Customer'
        ) {
          this.router.navigate(['/dashboard']);
        } else {
          this.router.navigate(['/produtos']);
        }
        this.loginError = false;
      },
      error: (err) => {
        console.error('Login failed', err);

        if (
          err.status === 401 &&
          err.error === 'Usuário não confirmou o email!'
        ) {
          this.loginErrorMessage =
            'Você precisa confirmar seu email antes de fazer login!';
        } else {
          this.loginErrorMessage = 'Senha ou email inválido!';
        }

        this.loginError = true;
      },
    });
  }
}
