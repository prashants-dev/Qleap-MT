import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RoleService } from '../../services/role.service';

@Component({
  selector: 'app-role-management',
  standalone: true,
  imports: [CommonModule, FormsModule, DatePipe],
  templateUrl: './roleManagement.html',
  styleUrls: ['./roleManagement.css'],
})
export class RoleManagementComponent implements OnInit {
  
  roles: any[] = [];

  // Loading and error states
  isLoading = false;
  isSubmitting = false;
  error = '';
  successMessage = '';
  errorMessage = '';

  // Popup for Create/Edit
  popupOpen = false;
  isEdit = false;
  form = { id: '', name: '', description: '' };

  // Delete popup
  deletePopup = false;
  deleteRoleId: number | null = null;

  constructor(private roleService: RoleService) {}

  ngOnInit(): void {
    this.loadRoles();
  }

  loadRoles() {
    this.isLoading = true;
    this.error = '';
    
    this.roleService.getAllRoles().subscribe({
      next: (res: any) => {
        this.roles = res.data || res;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading roles', err);
        this.error = err.error?.message || 'Failed to load roles. Please try again.';
        this.isLoading = false;
      },
    });
  }

  openPopup() {
    this.popupOpen = true;
    this.isEdit = false;
    this.form = { id: '', name: '', description: '' };
    this.successMessage = '';
    this.errorMessage = '';
  }

  openEditPopup(role: any) {
    this.popupOpen = true;
    this.isEdit = true;
    this.successMessage = '';
    this.errorMessage = '';

    this.form = {
      id: role.id,
      name: role.name,
      description: role.description,
    };
  }

  closePopup() {
    this.popupOpen = false;
    this.successMessage = '';
    this.errorMessage = '';
    this.form = { id: '', name: '', description: '' };
  }

  createRole() {
    if (!this.form.name || !this.form.description) {
      this.errorMessage = 'All fields are required';
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.roleService.createRole({
      name: this.form.name,
      description: this.form.description,
    }).subscribe({
      next: (response: any) => {
        this.successMessage = response.message || 'Role created successfully!';
        this.isSubmitting = false;
        
        // Reload roles and close popup after short delay
        setTimeout(() => {
          this.loadRoles();
          this.closePopup();
        }, 1500);
      },
      error: (err) => {
        console.error('Create Role Error:', err);
        this.errorMessage = err.error?.message || 'Failed to create role. Please try again.';
        this.isSubmitting = false;
      },
    });
  }

  updateRole() {
    if (!this.form.name || !this.form.description) {
      this.errorMessage = 'All fields are required';
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.roleService.updateRole(this.form.id, {
      name: this.form.name,
      description: this.form.description,
    }).subscribe({
      next: (response: any) => {
        this.successMessage = response.message || 'Role updated successfully!';
        this.isSubmitting = false;
        
        // Reload roles and close popup after short delay
        setTimeout(() => {
          this.loadRoles();
          this.closePopup();
        }, 1500);
      },
      error: (err) => {
        console.error('Update Role Error:', err);
        this.errorMessage = err.error?.message || 'Failed to update role. Please try again.';
        this.isSubmitting = false;
      },
    });
  }

  confirmDelete(id: number) {
    this.deleteRoleId = id;
    this.deletePopup = true;
    this.errorMessage = '';
  }

  deleteRole() {
    if (!this.deleteRoleId) return;

    this.isSubmitting = true;
    this.errorMessage = '';

    this.roleService.deleteRole(this.deleteRoleId).subscribe({
      next: (response: any) => {
        this.isSubmitting = false;
        this.loadRoles();
        this.closeDeletePopup();
        
        // Optional: Show success message in main view
        this.successMessage = response.message || 'Role deleted successfully!';
        setTimeout(() => {
          this.successMessage = '';
        }, 3000);
      },
      error: (err) => {
        console.error('Delete Role Error:', err);
        this.errorMessage = err.error?.message || 'Failed to delete role. Please try again.';
        this.isSubmitting = false;
      },
    });
  }

  closeDeletePopup() {
    this.deletePopup = false;
    this.deleteRoleId = null;
    this.errorMessage = '';
  }
}