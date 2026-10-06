import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NotificationService } from '../../services/notifications.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  // Password Visibility State
  showLoginPasswordText: boolean = false;
  showRegisterPasswordText: boolean = false;
  showRegisterConfirmPasswordText: boolean = false;

  toggleLoginPasswordVisibility(): void {
    this.showLoginPasswordText = !this.showLoginPasswordText;
  }

  toggleRegisterPasswordVisibility(): void {
    this.showRegisterPasswordText = !this.showRegisterPasswordText;
  }

  toggleRegisterConfirmPasswordVisibility(): void {
    this.showRegisterConfirmPasswordText = !this.showRegisterConfirmPasswordText;
  }

  private readonly notification = inject(NotificationService);
  private readonly router = inject(Router);
  private readonly http = inject(HttpClient);

  // --- API Endpoint Base URL ---
  private readonly apiUrl = 'http://localhost:5215/api/User';

  // --- Form View State ---
  activeTab: 'login' | 'register' = 'login';
  show2FA: boolean = false;
  isLoading: boolean = false;

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
    mobileNo: '',
    role: ''
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
      emailId: this.loginModel.emailId,
      password: this.loginModel.password,
    };

    this.http.post<any>(`${this.apiUrl}/login`, payload).subscribe({
      next: (res: any) => {
        this.isLoading = false;

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
          this.notification.showError(err.error?.message || 'Invalid email or password.');
        } else {
          this.notification.showError('An error occurred during login. Please try again.');
        }
      },
    });
  }

 

  // --- Sign-Up / Register Handler ---
  onRegister(): void {

    //injecting the HTTP
    this.http.post<any>(`${this.apiUrl}/CreateNewUser`, {}).subscribe({
      next: (res: any) => {
        // Handle successful registration response
        console.log('Registration successful:', res);
      },
      error: (err: any) => {
        // Handle registration error
        console.error('Registration failed:', err);
      },
    });

    const error = this.validateRegister();
    if (error) {
      this.notification.showError(error);
      return;
    }

    this.isLoading = true;
    this.notification.showLoading('Creating your account...');

    //this is the object that registers the user(s)
    const payload = {
      userId: 0,
      fullName: this.registerModel.fullName,
      emailId: this.registerModel.emailId,
      password: this.registerModel.password,
      mobileNo: this.registerModel.mobileNo,
      role: this.registerModel.role || 'User',
      createdDate: new Date().toISOString(),
    };

    this.http.post<any>(`${this.apiUrl}/CreateNewUser`, payload).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        this.notification.showSuccess('Registration successful! Logging you in...');
        this.completeLogin(res);
      },
      error: (err: any) => {
        this.isLoading = false;
        if (err.status === 500) {
          this.notification.showError(err.error || 'Email ID already exists.');
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

  switchTab(tab: 'login' | 'register'): void {
    this.activeTab = tab;
    this.show2FA = false;
  }

  private validateLogin(): string | null {
    if (!this.loginModel.emailId) return 'Email is required.';
    if (!this.loginModel.password) return 'Password is required.';
    return null;
  }

  // --- Enforce Strict Registration Validation ---
  private validateRegister(): string | null {
    if (!this.registerModel.fullName || this.registerModel.fullName.length < 3) {
      return 'Full Name must be at least 3 characters.';
    }
    if (!/\S+@\S+\.\S+/.test(this.registerModel.emailId)) {
      return 'Please enter a valid email address.';
    }
    if (!this.registerModel.mobileNo) {
      return 'Mobile Number is required.';
    }
    if (!this.registerModel.role) {
      return 'Please select a role.';
    }

    // Password Enforcement: Minimum 8 chars, letters, numbers, special character
    const pwd = this.registerModel.password;
    if (pwd.length < 8) {
      return 'Password must be at least 8 characters long.';
    }
    if (!/[a-zA-Z]/.test(pwd)) {
      return 'Password must contain at least one letter.';
    }
    if (!/[0-9]/.test(pwd)) {
      return 'Password must contain at least one number.';
    }
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pwd)) {
      return 'Password must contain at least one special character.';
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
    if (/[a-zA-Z]/.test(pwd)) strength++;
    if (/[0-9]/.test(pwd)) strength++;
    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pwd)) strength++;

    switch (strength) {
      case 1:
      case 2:
        this.passwordStrengthText = 'Weak (Requires letters, numbers & special characters)';
        this.passwordStrengthColor = '#ef4444';
        break;
      case 3:
        this.passwordStrengthText = 'Medium (Add a special character or digit)';
        this.passwordStrengthColor = '#f59e0b';
        break;
      case 4:
        this.passwordStrengthText = 'Strong Password';
        this.passwordStrengthColor = '#10b981';
        break;
      default:
        this.passwordStrengthText = '';
        this.passwordStrengthColor = '';
    }
  }
}
