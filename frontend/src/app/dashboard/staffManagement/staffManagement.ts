import { Component, OnInit } from '@angular/core';
import { StaffService } from '../../services/staff.service';
import { Router } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { CreateStaffComponent } from '../createStaff/createStaff';
import { UpdateStaffComponent } from '../updateStaff/updateStaff';

@Component({
  selector: 'app-staff-management',
  standalone: true,
  imports: [CommonModule, DatePipe, CreateStaffComponent, UpdateStaffComponent],
  templateUrl: './staffManagement.html',
  styleUrls: ['./staffManagement.css'],
})
export class StaffManagementComponent implements OnInit {
  staffList: any[] = [];
  showCreatePopup = false;
  showUpdatePopup = false;
  showDeletePopup = false;
  selectedUserId: number | null = null;
  selectedStaff: any = null;
  errorMessage = '';

  constructor(private staffService: StaffService, private router: Router) {}

  ngOnInit(): void {
    this.loadStaff();

    // Click anywhere → hide errorMessage
    document.addEventListener('click', () => {
      this.errorMessage = '';
    });
  }

  loadStaff() {
    this.staffService.getAllStaff().subscribe({
      next: (res: any) => {
        this.staffList = res.data;
      },
      error: (error) => {
        console.error('Error fetching staff', error);
      },
    });
  }

  openUpdateStaffPopup(staff: any) {
    this.selectedStaff = staff;
    this.showUpdatePopup = true;
  }

  closeUpdateStaffPopup() {
    this.showUpdatePopup = false;
    this.selectedStaff = null;
  }

  onStaffUpdated(staff: any) {
    this.loadStaff();
    this.closeUpdateStaffPopup();
  }

  deleteStaff(userId: number) {
    this.selectedUserId = userId;
    this.showDeletePopup = true;
  }

  confirmDelete() {
    if (!this.selectedUserId) return;

    this.staffService.deleteStaff(this.selectedUserId).subscribe({
      next: () => {
        this.loadStaff();
        this.errorMessage = '';
        this.showDeletePopup = false;
      },
      error: (error) => {
        this.errorMessage = error?.error?.message || "Something went wrong";
        this.showDeletePopup = false;
      },
    });
  }

  cancelDelete() {
    this.showDeletePopup = false;
    this.selectedUserId = null;
  }

  openCreateStaffPopup() {
    this.showCreatePopup = true;
  }

  closeCreateStaffPopup() {
    this.showCreatePopup = false;
  }

  onStaffCreated(staff: any) {
    this.loadStaff();
    this.closeCreateStaffPopup();
  }
}