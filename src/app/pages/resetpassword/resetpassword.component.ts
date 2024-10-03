import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../core/services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-resetpassword',
  standalone: true,
  imports: [CommonModule, FormsModule, ToastModule],
  templateUrl: './resetpassword.component.html',
  styleUrl: './resetpassword.component.css',
  providers: [MessageService],
})
export class ResetpasswordComponent implements OnInit {
  private userUrl = 'http://localhost:5062/v1/Auth';

  password: string = '';
  confirmPassword: string = '';
  email: string | null = '';
  token: string | null = '';
  errorMessage: string = '';

  loginError: boolean = false;
  loginErrorMessage: string = '';
  passwordMismatch: boolean = false;
  passwordsMatch: boolean = true;
  passwordContainsLowercase: boolean = false;
  passwordContainsUppercase: boolean = false;
  passwordContainsNumber: boolean = false;
  passwordContainsSpecialChar: boolean = false;
  passwordMinLength: boolean = false;

  passwordTouched: boolean = false;
  passwordVisible: boolean = false;

  constructor(
    private userService: UserService,
    private messageService: MessageService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Obtém o token e email da URI
    this.email = this.route.snapshot.queryParamMap.get('email');
    this.token = this.route.snapshot.queryParamMap.get('token');

    console.log(this.email);
    console.log(this.token);
  }

  onSubmit(): void {
    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'As senhas não conferem!';
      return;
    }

    const resetPasswordData = {
      email: this.email,
      token: this.token,
      password: this.password,
      confirmPassword: this.confirmPassword,
    };

    this.userService.resetPassword(resetPasswordData).subscribe({
      next: (res) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Senha trocada',
          detail: 'Senha trocada com sucesso!',
        });
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 3000);
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Falha ao redefinir a senha.',
        });
      },
    });
  }

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
}
