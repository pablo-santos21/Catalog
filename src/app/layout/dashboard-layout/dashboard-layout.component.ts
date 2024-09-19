import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DashboardHeaderComponent } from '../../components/dashboard-header/dashboard-header.component';
import { DashboardFooterComponent } from '../../components/dashboard-footer/dashboard-footer.component';
import { DashboardSidebarComponent } from '../../components/dashboard-sidebar/dashboard-sidebar.component';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    DashboardHeaderComponent,
    DashboardFooterComponent,
    DashboardSidebarComponent,
  ],
  templateUrl: './dashboard-layout.component.html',
  styleUrl: './dashboard-layout.component.css',
})
export class DashboardLayoutComponent {}
