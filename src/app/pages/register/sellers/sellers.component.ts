import { Component } from '@angular/core';
import { UserService } from '../../../core/services/user.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PasswordModule } from 'primeng/password';
import { MessageService } from '../../../core/services/message.service';

@Component({
  selector: 'app-sellers',
  standalone: true,
  imports: [FormsModule, CommonModule, PasswordModule],
  templateUrl: './sellers.component.html',
  styleUrl: './sellers.component.css',
})
export class SellersComponent {
  userName: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  passwordMismatch: boolean = false;
  passwordsMatch: boolean = true;
  loginError: boolean = false;
  userExists: boolean = false;

  passwordContainsLowercase: boolean = false;
  passwordContainsUppercase: boolean = false;
  passwordContainsNumber: boolean = false;
  passwordContainsSpecialChar: boolean = false;
  passwordMinLength: boolean = false;

  passwordTouched: boolean = false;
  passwordVisible: boolean = false;

  constructor(
    private userService: UserService,
    private router: Router,
    private messageService: MessageService
  ) {}

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }

  checkPasswordsMatch() {
    this.passwordsMatch = this.password === this.confirmPassword;
  }

  hidePasswordValidations() {
    this.passwordTouched = false;
  }

  checkPasswordStrength(): void {
    this.passwordTouched = true;
    // Verifica se contém uma letra minúscula
    this.passwordContainsLowercase = /[a-z]/.test(this.password);

    // Verifica se contém uma letra maiúscula
    this.passwordContainsUppercase = /[A-Z]/.test(this.password);

    // Verifica se contém um número
    this.passwordContainsNumber = /\d/.test(this.password);

    // Verifica se contém um caractere alfanumérico (letra ou número)
    this.passwordContainsSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(
      this.password
    );

    // Verifica o comprimento mínimo de 8 caracteres
    this.passwordMinLength = this.password.length >= 8;
  }

  register(): void {
    this.userName = this.userName.trim().replace(/\s+/g, '-');

    if (this.password !== this.confirmPassword) {
      this.passwordMismatch = true;
      return;
    } else {
      this.passwordMismatch = false;
    }

    this.loginError = false;
    this.userExists = false;

    this.userService
      .register(this.userName, this.email, this.password, undefined, 'Vendedor')
      .subscribe({
        next: (response) => {
          console.log('User registered successfully', response);
          this.messageService.changeMessage('Vendedor cadastrado com sucesso!');
          this.router.navigate(['/login']);
          this.loginError = false;
        },
        error: (err) => {
          if (
            err.status === 409 ||
            (err.error && err.error.message === 'Vendedor ja existe')
          ) {
            this.userExists = true; // Sinaliza que o usuário já existe
          } else {
            this.loginError = true; // Caso seja outro erro
          }
          console.error('Registration failed', err);
        },
      });
  }
}
