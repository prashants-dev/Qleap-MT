import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class LoginComponent {
  loginForm: FormGroup;
  isSubmitting = false;
  message = '';
  error = '';
  showPassword = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private auth: AuthService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false],
    });
  }

  get email() {
    return this.loginForm.get('email');
  }
  get password() {
    return this.loginForm.get('password');
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    localStorage.clear();
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.error = '';

    const { email, password } = this.loginForm.value;

    this.auth.login({ email, password }).subscribe({
      next: (res) => {
        console.log('Login successful:', res);

        // save user + token
        localStorage.setItem('user', JSON.stringify(res.user));
        localStorage.setItem('token', res.token);

        const role = res.user?.roles?.[0] || '';

        // role → route mapping
        const roleRouteMap: any = {
          ADMIN: '/admin',
          SUPER_ADMIN: '/admin',
          MEDIA_OWNER: '/mediaOwners',
          ADVERTISER: '/advertisers',
        };

        // compute final route
        const redirectRoute = roleRouteMap[role] || '/dashboard';

        this.router.navigate([redirectRoute]);

        this.isSubmitting = false;
      },
      error: (err) => {
        console.error('Login error:', err);
        this.error = err.error?.message || 'Invalid credentials';
        this.isSubmitting = false;
      },
    });
  }
}
