import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { StaffService } from '../../services/staff.service';
import { RoleService } from '../../services/role.service'; // Import your role service

@Component({
  selector: 'app-create-staff',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './createStaff.html',
  styleUrls: ['./createStaff.css']
})
export class CreateStaffComponent implements OnInit {
  @Output() close = new EventEmitter<void>();
  @Output() staffCreated = new EventEmitter<any>();

  staffForm: FormGroup;
  isSubmitting = false;
  errorMessage = '';
  successMessage = '';
  showPassword = false;
  showConfirmPassword = false;
  
  // Role-related properties
  roles: any[] = [];
  isLoadingRoles = false;

  constructor(
    private fb: FormBuilder,
    private staffService: StaffService,
    private roleService: RoleService // Inject role service
  ) {
    this.staffForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      role: ['', Validators.required], // Will store role ID
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  ngOnInit() {
    this.loadRoles();
  }

  loadRoles() {
    this.isLoadingRoles = true;
    this.roleService.getAllRoles().subscribe({
      next: (response) => {
        // Handle both response formats
        this.roles = response.data || response;
        this.isLoadingRoles = false;
      },
      error: (error) => {
        console.error('Error fetching roles:', error);
        this.errorMessage = 'Failed to load roles. Using default options.';
        this.isLoadingRoles = false;
        
        // Fallback to static roles if API fails
        this.roles = [
          { id: 1, name: 'SUPER_ADMIN' },
          { id: 2, name: 'ADMIN' },
          { id: 3, name: 'MEDIA_OWNER' },
          { id: 4, name: 'ADVERTISER' },
          { id: 5, name: 'STAFF' },
        ];
      },
    });
  }

  get username() { return this.staffForm.get('username'); }
  get email() { return this.staffForm.get('email'); }
  get role() { return this.staffForm.get('role'); }
  get password() { return this.staffForm.get('password'); }
  get confirmPassword() { return this.staffForm.get('confirmPassword'); }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');
    
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      return { passwordMismatch: true };
    }
    return null;
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  closePopup() {
    this.close.emit();
  }

  onSubmit() {
    if (this.staffForm.invalid) {
      this.staffForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';
    this.successMessage = '';

    const { username, email, role, password } = this.staffForm.value;

    // Send role ID or name based on your API requirements
    this.staffService.createStaff({ username, email, role, password }).subscribe({
      next: (response) => {
        this.successMessage = response.message || 'Staff created successfully!';
        this.isSubmitting = false;
        
        // Emit success event
        this.staffCreated.emit(response);

        // Reset form
        this.staffForm.reset();

        // Close popup after 1.5 seconds
        setTimeout(() => {
          this.closePopup();
        }, 1500);
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Failed to create staff. Please try again.';
        this.isSubmitting = false;
      }
    });
  }
}