import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../core/services/user.service';
import { PasswordModule } from 'primeng/password';
import { MessageService } from '../../core/services/message.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule, PasswordModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
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
    if (this.password !== this.confirmPassword) {
      this.passwordMismatch = true;
      return;
    } else {
      this.passwordMismatch = false;
    }

    this.loginError = false;
    this.userExists = false;

    this.userService
      .register(this.userName, this.email, this.password)
      .subscribe({
        next: (response) => {
          console.log('User registered successfully', response);
          this.messageService.changeMessage('Usuário cadastrado com sucesso!');
          this.router.navigate(['/login']);
          this.loginError = false;
        },
        error: (err) => {
          if (
            err.status === 409 ||
            (err.error && err.error.message === 'Usuário ja existe')
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
