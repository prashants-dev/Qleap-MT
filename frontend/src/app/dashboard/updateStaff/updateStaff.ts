import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { StaffService } from '../../services/staff.service';

@Component({
  selector: 'app-update-staff',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './updateStaff.html',
  styleUrls: ['./updateStaff.css']
})
export class UpdateStaffComponent implements OnInit {
  @Input() staffData: any;
  @Output() close = new EventEmitter<void>();
  @Output() staffUpdated = new EventEmitter<any>();

  staffForm: FormGroup;
  isSubmitting = false;
  errorMessage = '';
  successMessage = '';
  showPassword = false;
  showConfirmPassword = false;

  constructor(
    private fb: FormBuilder,
    private staffService: StaffService
  ) {
    this.staffForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.minLength(6)]],
      confirmPassword: ['']
    }, {
      validators: this.passwordMatchValidator
    });
  }

  ngOnInit(): void {
    if (this.staffData) {
      this.staffForm.patchValue({
        username: this.staffData.username,
        email: this.staffData.email
      });
    }
  }

  get username() { return this.staffForm.get('username'); }
  get email() { return this.staffForm.get('email'); }
  get password() { return this.staffForm.get('password'); }
  get confirmPassword() { return this.staffForm.get('confirmPassword'); }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');
    
    if (password && confirmPassword && password.value && confirmPassword.value) {
      if (password.value !== confirmPassword.value) {
        return { passwordMismatch: true };
      }
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

    const { username, email, password } = this.staffForm.value;
    
    const updateData: any = {
      user_id: this.staffData.user_id,
      username,
      email
    };

    // Only include password if it was provided
    if (password) {
      updateData.password = password;
    }

    this.staffService.updateStaff(updateData).subscribe({
      next: (response) => {
        this.successMessage = response.message || 'Staff updated successfully!';
        this.isSubmitting = false;
        
        // Emit success event
        this.staffUpdated.emit(response);

        // Close popup after 1.5 seconds
        setTimeout(() => {
          this.closePopup();
        }, 1500);
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Failed to update staff. Please try again.';
        this.isSubmitting = false;
      }
    });
  }
}