import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { UserService } from '../../core/services/user.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  menuOpen = false;
  isLoggedIn = false;

  constructor(private userService: UserService) {}

  ngOnInit() {
    // Verifica se o usuário está autenticado ao inicializar o componente
    this.isLoggedIn = this.userService.isAuthenticated();
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  // Detecta se é um dispositivo móvel
  isMobile() {
    return window.innerWidth < 768;
  }

  // Atualiza o estado do menu ao redimensionar a tela
  @HostListener('window:resize', ['$event'])
  onResize() {
    if (!this.isMobile()) {
      this.menuOpen = false;
    }
  }

  logout() {
    this.userService.logout();
    this.isLoggedIn = false;
  }
}
