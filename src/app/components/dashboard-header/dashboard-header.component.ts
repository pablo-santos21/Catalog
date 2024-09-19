import { Component } from '@angular/core';
import { UserService } from '../../core/services/user.service';

@Component({
  selector: 'app-dashboard-header',
  standalone: true,
  imports: [],
  templateUrl: './dashboard-header.component.html',
  styleUrl: './dashboard-header.component.css',
})
export class DashboardHeaderComponent {
  isLoggedIn = false;

  constructor(private userService: UserService) {}

  logout() {
    this.userService.logout();
    this.isLoggedIn = false;
  }
}
