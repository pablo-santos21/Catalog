import { Component } from '@angular/core';
import { UserService } from '../../core/services/user.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  constructor(private userService: UserService) {}

  // Método que chama o refreshToken do serviço
  onRefreshToken(): void {
    this.userService.refreshToken().subscribe({
      next: (response) => {
        console.log('Token atualizado com sucesso!', response);
      },
      error: (error) => {
        console.error('Erro ao atualizar o token:', error);
      },
    });
  }
}
