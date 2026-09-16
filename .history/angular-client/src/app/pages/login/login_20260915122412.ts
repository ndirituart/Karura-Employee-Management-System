import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NotificationService } from '../../services/notifications.service';
//for dropdown menu
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown'; // Required dependency for dropdowns

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxIntlTelInputModule,BsDropdownModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private readonly notification = inject(NotificationService);
  private readonly router = inject(Router);
  private readonly http = inject(HttpClient);

  // --- API Endpoint Base URL ---
  private readonly apiUrl = 'https://localhost:7000/api/User';

  // --- Form View State ---
  activeTab: 'login' | 'register' = 'login';
  show2FA: boolean = false;
  isLoading: boolean = false;
  showPasswordText: boolean = false;

  // --- Form Models ---
  loginModel = {
    emailId: '',
    password: '',
    rememberMe: false,
  };

  registerModel = {
    fullName: '',
    emailId: '',
    password: '',
    confirmPassword: '',
    mobileNo: '', // Added field for registration payload
    role:''
  };

  twoFaModel = {
    code: '',
  };

  userPending2FA: string | null = null;
  passwordStrengthText: string = '';
  passwordStrengthColor: string = '';

  // --- Login Handler ---
  onLogin(): void {
    const error = this.validateLogin();
    if (error) {
      this.notification.showError(error);
      return;
    }

    this.isLoading = true;
    this.notification.showLoading('Logging in...');

    const payload = {
      emailIdId: this.loginModel.emailId,
      password: this.loginModel.password,
    };

    this.http.post<any>(`${this.apiUrl}/login`, payload).subscribe({
      next: (res: any) => {
        this.isLoading = false;

        // Check if 2FA response requirement is returned by backend
        if (res?.twofaEnabled) {
          this.userPending2FA = this.loginModel.emailId;
          this.show2FA = true;
          this.notification.showSuccess('Password verified. Please enter 2FA code.');
          return;
        }

        this.completeLogin(res);
      },
      error: (err: any) => {
        this.isLoading = false;
        if (err.status === 401) {
          this.notification.showError(err.error?.message || 'Invalid emailId or password.');
        } else {
          this.notification.showError('An error occurred during login. Please try again.');
        }
      },
    });
  }

  // --- Sign-Up / Register Handler ---
  onRegister(): void {
    const error = this.validateRegister();
    if (error) {
      this.notification.showError(error);
      return;
    }

    this.isLoading = true;
    this.notification.showLoading('Creating your account...');

    const payload = {
      userId: 0,
      fullName: this.registerModel.fullName,
      emailIdId: this.registerModel.emailId,
      password: this.registerModel.password,
      mobileNumber: this.registerModel.mobileNo || '0000000000',
      role: this.registerModel.role || 'User',
      createdDate: new Date().toISOString(),
    };

    this.http.post<any>(`${this.apiUrl}/create`, payload).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        this.notification.showSuccess('Registration successful! Logging you in...');
        this.completeLogin(res);
      },
      error: (err: any) => {
        this.isLoading = false;
        if (err.status === 500) {
          this.notification.showError(err.error || 'emailId ID already exists.');
        } else {
          this.notification.showError('Registration failed. Please check your details.');
        }
      },
    });
  }

  // --- 2FA Verification Handler ---
  onVerify2FA(): void {
    if (!/^\d{6}$/.test(this.twoFaModel.code)) {
      this.notification.showError('Code must be exactly 6 digits.');
      return;
    }

    this.isLoading = true;
    this.notification.showLoading('Verifying 2FA Code...');

    const payload = {
      emailId: this.userPending2FA,
      code: this.twoFaModel.code,
    };

    this.http.post<any>(`${this.apiUrl}/verify-2fa`, payload).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        this.completeLogin(res);
      },
      error: () => {
        this.isLoading = false;
        this.notification.showError('Invalid 2FA verification code.');
      },
    });
  }

  // --- Session Completion Helper ---
  private completeLogin(userData: any): void {
    const storage = this.loginModel.rememberMe ? localStorage : sessionStorage;
    storage.setItem('user_session', JSON.stringify(userData));

    this.isLoading = false;
    this.notification.showSuccess(`Welcome! Redirecting...`);
    this.router.navigate(['/dashboard']);
  }

  // --- UI & Validation Helpers ---
  switchTab(tab: 'login' | 'register'): void {
    this.activeTab = tab;
    this.show2FA = false;
  }

  togglePasswordVisibility(): void {
    this.showPasswordText = !this.showPasswordText;
  }

  private validateLogin(): string | null {
    if (!this.loginModel.emailId) return 'emailId is required.';
    if (!this.loginModel.password) return 'Password is required.';
    return null;
  }

  private validateRegister(): string | null {
    if (!this.registerModel.fullName || this.registerModel.fullName.length < 3) {
      return 'fullName must be at least 3 characters.';
    }
    if (!/\S+@\S+\.\S+/.test(this.registerModel.emailId)) {
      return 'Please enter a valid emailId address.';
    }
    if (this.registerModel.password.length < 8) {
      return 'Password must be at least 8 characters long.';
    }
    if (this.registerModel.password !== this.registerModel.confirmPassword) {
      return 'Passwords do not match.';
    }
    return null;
  }

  updatePasswordStrength(): void {
    const pwd = this.registerModel.password;
    let strength = 0;
    if (pwd.length >= 8) strength++;
    if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) strength++;
    if (/[0-9]/.test(pwd)) strength++;
    if (/[!@#$%^&*()]/.test(pwd)) strength++;

    switch (strength) {
      case 1:
        this.passwordStrengthText = 'Weak';
        this.passwordStrengthColor = '#ef4444';
        break;
      case 2:
        this.passwordStrengthText = 'Medium';
        this.passwordStrengthColor = '#f59e0b';
        break;
      case 3:
      case 4:
        this.passwordStrengthText = 'Strong';
        this.passwordStrengthColor = '#10b981';
        break;
      default:
        this.passwordStrengthText = '';
        this.passwordStrengthColor = '';
    }
  }
}