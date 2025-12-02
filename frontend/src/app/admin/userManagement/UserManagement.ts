import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { RoleService } from '../../services/role.service';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './userManagement.html',
  styleUrls: ['./userManagement.css'],
})
export class UserManagementComponent implements OnInit {
  users: any[] = [];
  roles: any[] = [];
  loading = true;
  loadingRoles = false;
  error = '';

  showModal = false;
  showDeletePopup = false;

  // EDIT USER
  editData: any = {};
  selectedUserId: number | null = null;
  selectedUserName: string = '';
  selectedRoleIds: number[] = [];

  // CREATE USER
  showCreateModal = false;
  newUser: any = {
    username: '',
    email: '',
    password: '',
    status: 'active',
    role_ids: []
  };

  // Password visibility
  showPassword = false;
  showCreatePassword = false;

  // Validation
  createErrors: any = {};
  editErrors: any = {};

  constructor(
    private userService: UserService,
    private roleService: RoleService
  ) {}

  ngOnInit(): void {
    this.fetchUsers();
    this.fetchRoles();
  }

  fetchUsers() {
    this.loading = true;
    this.userService.getAllUsers().subscribe({
      next: (res: any) => {
        this.users = res.data || [];
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load users';
        this.loading = false;
      },
    });
  }

  fetchRoles() {
    this.loadingRoles = true;
    this.roleService.getAllRoles().subscribe({
      next: (res: any) => {
        this.roles = res.data || [];
        this.loadingRoles = false;
      },
      error: (err) => {
        console.error('Error fetching roles:', err);
        this.loadingRoles = false;
      },
    });
  }

  // ------------------ EDIT USER ------------------

  openModal(user: any) {
    this.editData = { ...user };
    this.editErrors = {};
    
    this.selectedRoleIds = [];
    if (user.roles && user.roles.length > 0) {
      user.roles.forEach((roleName: string) => {
        const role = this.roles.find(r => r.name === roleName);
        if (role) this.selectedRoleIds.push(role.id);
      });
    }
    
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.selectedRoleIds = [];
    this.editErrors = {};
  }

  toggleRole(roleId: number) {
    const index = this.selectedRoleIds.indexOf(roleId);
    if (index > -1) this.selectedRoleIds.splice(index, 1);
    else this.selectedRoleIds.push(roleId);
  }

  isRoleSelected(roleId: number): boolean {
    return this.selectedRoleIds.includes(roleId);
  }

  validateEditForm(): boolean {
    this.editErrors = {};
    let isValid = true;

    if (!this.editData.username || this.editData.username.trim().length < 3) {
      this.editErrors.username = 'Username must be at least 3 characters';
      isValid = false;
    }

    if (!this.editData.email || !this.isValidEmail(this.editData.email)) {
      this.editErrors.email = 'Please enter a valid email';
      isValid = false;
    }

    if (this.selectedRoleIds.length === 0) {
      this.editErrors.roles = 'Please select at least one role';
      isValid = false;
    }

    return isValid;
  }

  saveUser() {
    if (!this.validateEditForm()) {
      return;
    }

    const updateData = {
      username: this.editData.username,
      email: this.editData.email,
      status: this.editData.status,
      role_ids: this.selectedRoleIds
    };

    this.userService.updateUser(this.editData.id, updateData).subscribe({
      next: () => {
        alert('User updated successfully!');
        this.fetchUsers();
        this.showModal = false;
        this.selectedRoleIds = [];
      },
      error: (err) => {
        alert(err.error?.message || 'Update failed');
        console.error(err);
      },
    });
  }

  // ------------------ DELETE USER ------------------

  openDeletePopup(user: any) {
    this.selectedUserId = user.id;
    this.selectedUserName = user.username;
    this.showDeletePopup = true;
  }

  cancelDelete() {
    this.showDeletePopup = false;
    this.selectedUserId = null;
    this.selectedUserName = '';
  }

  confirmDelete() {
    if (!this.selectedUserId) return;

    this.userService.deleteUser(this.selectedUserId).subscribe({
      next: (res) => {
        alert(res.message || 'User deleted successfully!');
        this.fetchUsers();
        this.showDeletePopup = false;
        this.selectedUserId = null;
        this.selectedUserName = '';
      },
      error: (err) => {
        alert(err.error?.message || 'Failed to delete user');
        console.error(err);
        this.showDeletePopup = false;
      },
    });
  }

  // ------------------ CREATE USER ------------------

  openCreateModal() {
    this.newUser = {
      username: '',
      email: '',
      password: '',
      status: 'active',
      role_ids: []
    };
    this.createErrors = {};
    this.showCreatePassword = false;
    this.showCreateModal = true;
  }

  closeCreateModal() {
    this.showCreateModal = false;
    this.createErrors = {};
  }

  toggleCreateRole(roleId: number) {
    const index = this.newUser.role_ids.indexOf(roleId);
    if (index > -1) this.newUser.role_ids.splice(index, 1);
    else this.newUser.role_ids.push(roleId);
  }

  isCreateRoleSelected(roleId: number) {
    return this.newUser.role_ids.includes(roleId);
  }

  toggleCreatePasswordVisibility() {
    this.showCreatePassword = !this.showCreatePassword;
  }

  validateCreateForm(): boolean {
    this.createErrors = {};
    let isValid = true;

    if (!this.newUser.username || this.newUser.username.trim().length < 3) {
      this.createErrors.username = 'Username must be at least 3 characters';
      isValid = false;
    }

    if (!this.newUser.email || !this.isValidEmail(this.newUser.email)) {
      this.createErrors.email = 'Please enter a valid email';
      isValid = false;
    }

    if (!this.newUser.password || this.newUser.password.length < 6) {
      this.createErrors.password = 'Password must be at least 6 characters';
      isValid = false;
    }

    if (this.newUser.role_ids.length === 0) {
      this.createErrors.roles = 'Please select at least one role';
      isValid = false;
    }

    return isValid;
  }

  saveNewUser() {
    if (!this.validateCreateForm()) {
      return;
    }

    this.userService.createUser(this.newUser).subscribe({
      next: () => {
        alert("User created successfully!");
        this.fetchUsers();
        this.showCreateModal = false;
      },
      error: (err) => {
        alert(err.error?.message || "Failed to create user");
        console.error(err);
      }
    });
  }

  // ------------------ HELPERS ------------------

  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}