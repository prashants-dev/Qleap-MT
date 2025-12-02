import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.html',
  styleUrls: ['./profile.css'],
})
export class ProfileComponent implements OnInit {
  @Input() showInSidebar: boolean = false;
  @Input() showAsDropdown: boolean = false;
  @Output() logoutClick = new EventEmitter<void>();
  @Output() profileUpdated = new EventEmitter<any>();

  userProfile: any = {};
  showEditPopup: boolean = false;
  showLogoutPopup: boolean = false;
  editForm: any = {
    username: '',
    email: '',
  };
  isUpdating: boolean = false;
  updateError: string = '';
  updateSuccess: string = '';

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadUserProfile();
  }

  private loadUserProfile(): void {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      this.userProfile = JSON.parse(storedUser);
      console.log('Loaded user profile:', this.userProfile);
    }
  }

  getInitial(): string {
    return this.userProfile.username?.charAt(0)?.toUpperCase() || 'U';
  }

  getRolesDisplay(): string {
    if (this.userProfile.roles && Array.isArray(this.userProfile.roles)) {
      return this.userProfile.roles.join(', ');
    }
    return this.userProfile.role || 'N/A';
  }

  openLogoutPopup(): void {
    this.showLogoutPopup = true;
  }

  closeLogoutPopup(): void {
    this.showLogoutPopup = false;
  }

  confirmLogout(): void {
    // Clear localStorage completely
    localStorage.removeItem('token');
    localStorage.removeItem('user');

   
    // localStorage.clear();

    
    this.authService.logout();

    // Close popup
    this.showLogoutPopup = false;

    // Emit logout event to parent component
    this.logoutClick.emit();

    // Redirect to login page
    this.router.navigate(['/login']);

    console.log('Logout successful - localStorage cleared');
  }

  openEditProfile(): void {
    this.editForm = {
      username: this.userProfile.username || '',
      email: this.userProfile.email || '',
    };
    this.showEditPopup = true;
    this.updateError = '';
    this.updateSuccess = '';
  }

  closeEditPopup(): void {
    this.showEditPopup = false;
    this.updateError = '';
    this.updateSuccess = '';
  }

  updateProfile(): void {
    if (!this.editForm.username || !this.editForm.email) {
      this.updateError = 'Username and email are required';
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.editForm.email)) {
      this.updateError = 'Please enter a valid email address';
      return;
    }

    this.isUpdating = true;
    this.updateError = '';
    this.updateSuccess = '';

    const userId = this.userProfile.id;

    const updateData = {
      username: this.editForm.username,
      email: this.editForm.email,
      status: this.userProfile.status || 'active',
    };

    console.log('Updating user with data:', updateData);

    this.userService.updateUser(userId, updateData).subscribe({
      next: (response) => {
        this.isUpdating = false;
        this.updateSuccess = 'Profile updated successfully!';

        this.userProfile = {
          ...this.userProfile,
          username: this.editForm.username,
          email: this.editForm.email,
        };

        localStorage.setItem('user', JSON.stringify(this.userProfile));
        this.profileUpdated.emit(this.userProfile);

        setTimeout(() => {
          this.closeEditPopup();
        }, 1500);
      },
      error: (error) => {
        this.isUpdating = false;
        this.updateError =
          error.error?.message ||
          error.error?.error ||
          'Failed to update profile. Please try again.';
        console.error('Update profile error:', error);
      },
    });
  }
}
