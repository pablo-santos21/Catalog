import { Component, OnInit } from '@angular/core';
import { UserService } from '../../core/services/user.service';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { User } from '../../models/user';

@Component({
  selector: 'app-dashboard-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './dashboard-sidebar.component.html',
  styleUrl: './dashboard-sidebar.component.css',
})
export class DashboardSidebarComponent implements OnInit {
  userName: string = '';
  userRole: string = '';

  constructor(private userService: UserService) {}

  ngOnInit() {
    const userDetails = this.userService.getUserDetailsFromToken();
    if (userDetails) {
      this.userName = userDetails.name;
      this.userRole = userDetails.role;
    }
  }

  // Toggle sidebar visibility
  toggleSidebar() {
    const sidebarMenu = document.querySelector('.sidebar-menu') as HTMLElement;
    const sidebarOverlay = document.querySelector(
      '.sidebar-overlay'
    ) as HTMLElement;
    sidebarMenu.classList.toggle('-translate-x-full');
    sidebarOverlay.classList.toggle('hidden');
  }

  // Toggle fullscreen
  toggleFullscreen() {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      document.documentElement.requestFullscreen();
    }
  }

  // Toggle dropdown visibility
  toggleDropdown(event: Event) {
    const menu = (event.currentTarget as HTMLElement)
      .nextElementSibling as HTMLElement;
    menu.classList.toggle('hidden');
  }

  isLoggedIn = false;

  logout() {
    this.userService.logout();
    this.isLoggedIn = false;
  }
}
