import { Component } from '@angular/core';
import { UserService } from '../../core/services/user.service';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-dashboard-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './dashboard-sidebar.component.html',
  styleUrl: './dashboard-sidebar.component.css',
})
export class DashboardSidebarComponent {
  isLoggedIn = false;

  constructor(private userService: UserService) {}

  logout() {
    this.userService.logout();
    this.isLoggedIn = false;
  }
}
