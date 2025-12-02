import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { RoleService } from '../services/role.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register.html',
  styleUrls: ['./register.css'],
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  isSubmitting = false;
  message = '';
  error = '';
  roles: any[] = [];
  isLoadingRoles = true;
  showPassword = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private auth: AuthService,
    private roleService: RoleService
  ) {
    this.registerForm = this.fb.group(
      {
        username: ['', [Validators.required, Validators.minLength(3)]],

        email: [
          '',
          [
            Validators.required,
            Validators.email,
            Validators.pattern(/^[\w\-\.]+@([\w-]+\.)+[\w-]{2,}$/), // strong email validation
          ],
        ],

        password: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            Validators.pattern(/[A-Z]/), // at least 1 uppercase
            Validators.pattern(/[a-z]/), // at least 1 lowercase
            Validators.pattern(/[0-9]/), // at least 1 number
            Validators.pattern(/[@$!%*?&]/), // at least 1 special character
          ],
        ],

        confirmPassword: ['', Validators.required],
        role: ['', Validators.required],
      },
      { validators: this.passwordMatchValidator }
    );
  }

  ngOnInit(): void {
    this.loadRoles();
  }
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  // Load roles
 loadRoles() {
  this.isLoadingRoles = true;

  this.roleService.getAllRoles('register').subscribe({
    next: (response) => {
      this.roles = response.data || [];
      this.isLoadingRoles = false;
      console.log("Roles received:", this.roles);
    },
    error: (error) => {
      console.error("Error fetching roles:", error);
      this.isLoadingRoles = false;
    }
  });
}


  // Validate password matching
  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;

    if (password && confirmPassword && password !== confirmPassword) {
      return { mismatch: true };
    }
    return null;
  }

  // Getters
  get username() {
    return this.registerForm.get('username');
  }
  get email() {
    return this.registerForm.get('email');
  }
  get role() {
    return this.registerForm.get('role');
  }
  get password() {
    return this.registerForm.get('password');
  }
  get confirmPassword() {
    return this.registerForm.get('confirmPassword');
  }

  // Submit form
  onSubmit() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    const { username, email, password, role } = this.registerForm.value;

    this.auth.register({ username, email, password, role }).subscribe({
      next: (res) => {
        this.message = res.message;
        this.isSubmitting = false;
        alert('User registered successfully');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.error = err.error?.message || 'Registration failed';
        this.isSubmitting = false;
      },
    });
  }
}
