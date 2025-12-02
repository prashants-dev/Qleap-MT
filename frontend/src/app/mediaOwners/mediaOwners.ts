import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CreateStaffComponent } from '../dashboard/createStaff/createStaff';
import { StaffService } from '../services/staff.service';
import { ProfileComponent } from '../profile/profile'; // Import the profile component

@Component({
  selector: 'app-media-owners-dashboard',
  templateUrl: './mediaOwners.html',
  styleUrls: ['./mediaOwners.css'],
  standalone: true,
  imports: [CommonModule, CreateStaffComponent, ProfileComponent], // Add ProfileComponent
})
export class MediaOwnersDashboardComponent implements OnInit {
  stats = {
    totalScreens: 48,
    activeScreens: 42,
    totalRevenue: 285000,
    bookingRate: 87.5,
  };

  screenInventory = [
    {
      location: 'Times Square, NYC',
      type: 'Digital Billboard',
      status: 'Active',
      revenue: 45000,
    },
    {
      location: 'Downtown LA',
      type: 'LED Screen',
      status: 'Active',
      revenue: 38000,
    },
    {
      location: 'Chicago Loop',
      type: 'Digital Billboard',
      status: 'Maintenance',
      revenue: 32000,
    },
    {
      location: 'Miami Beach',
      type: 'Video Wall',
      status: 'Active',
      revenue: 28000,
    },
  ];

  menuOpen = false;
  showCreateStaffPopup = false;

  constructor(
    private router: Router,
    private staffService: StaffService
  ) {}

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }

  ngOnInit(): void {
    // Profile logic removed - now handled by ProfileComponent
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  goToStaffManagement() {
    this.router.navigate(['/staffManagement']);
  }

  addStaff(): void {
    this.showCreateStaffPopup = true;
  }

  closeStaffPopup(): void {
    this.showCreateStaffPopup = false;
  }

  onStaffCreated(event: any): void {
    console.log('Staff created successfully:', event);
    alert(`Staff "${event.staff_id}" created successfully!`);
  }

  viewScreen(screen: any): void {
    console.log('View screen:', screen);
  }

  handleLogout(): void {
    // Add your logout logic here
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }
}