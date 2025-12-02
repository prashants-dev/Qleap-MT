import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ProfileComponent } from '../profile/profile';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, ProfileComponent],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent implements OnInit {
  isMenuOpen = false;
  isSidebarOpen = false;
  isLoggedIn = false;

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Check if user is logged in
    const user = localStorage.getItem('user');
    this.isLoggedIn = !!user;
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu() {
    this.isMenuOpen = false;
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  closeSidebar() {
    this.isSidebarOpen = false;
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }

  navigateToAdmin() {
    this.router.navigate(['/admin']);
  }

  navigateToStaffManagement() {
    this.closeSidebar();
    this.router.navigate(['/staffManagement']);
  }

  handleLogout(): void {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    this.isLoggedIn = false;
    this.closeSidebar();
    this.router.navigate(['/login']);
  }
}