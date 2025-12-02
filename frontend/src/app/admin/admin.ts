import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserAccessPermissionComponent } from '../admin/userAccessPermission/userAccessPermission';
import { UserManagementComponent } from './userManagement/UserManagement';
import { RoleManagementComponent } from './roleManagement/roleManagement';
import { ProfileComponent } from '../profile/profile'; // Import the profile component

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    UserAccessPermissionComponent,
    UserManagementComponent,
    RoleManagementComponent,
    ProfileComponent, // Add ProfileComponent
  ],
  templateUrl: './admin.html',
  styleUrls: ['./admin.css'],
})
export class AdminComponent implements OnInit {
  showSidebar = false; // Changed from showSidebar to match media owners pattern
  showLogoutPopup = false;
  activeSection = 'dashboard';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  async ngOnInit(): Promise<void> {
    // Profile logic removed - now handled by ProfileComponent
  }

  toggleSidebar() {
    this.showSidebar = !this.showSidebar;
  }

  openSection(section: string) {
    this.activeSection = section;
    if (window.innerWidth < 768) this.showSidebar = false;
  }

  openLogoutPopup() {
    this.showLogoutPopup = true;
  }

  closeLogoutPopup() {
    this.showLogoutPopup = false;
  }

  confirmLogout() {
    this.authService.logout();
    this.showLogoutPopup = false;
    this.router.navigate(['/dashboard']);
  }

  handleLogout(): void {
    this.openLogoutPopup();
  }
}