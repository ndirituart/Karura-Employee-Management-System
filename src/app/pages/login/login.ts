import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NotificationService } from '../../services/notifications.service';

interface UserRecord {
  username: string;
  passwordHash: string;
  twofaEnabled: boolean;
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private readonly notification = inject(NotificationService);
  private readonly router = inject(Router);

  // --- Form State ---
  show2FA: boolean = false;
  isLoading: boolean = false;
  showPasswordText: boolean = false;

  // --- Data Models ---
  loginModel = {
    email: '',
    password: '',
    rememberMe: false,
  };

  registerModel = {
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  };

  twoFaModel = {
    code: '',
  };

  // --- Simulated Database & In-Memory Session ---
  private users = new Map<string, UserRecord>([
    ['ndiritupatience002@gmail.com', { username: 'Admin', passwordHash: '123456abc', twofaEnabled: false }],
    ['buzzlit254@gmail.com', { username: 'Secretary', passwordHash: '98765xyz', twofaEnabled: true }]
  ]);

  userPending2FA: string | null = null;
  passwordStrengthText: string = '';
  passwordStrengthColor: string = '';

  // --- Auth Handlers ---

  async onLogin(): Promise<void> {
    const error = this.validateLogin();
    if (error) {
      this.notification.showError(error);
      return;
    }

    this.isLoading = true;
    this.notification.showLoading('Logging into Karura MIS...');

    await this.simulateDelay(1000);

    const user = this.users.get(this.loginModel.email);

    if (user && user.passwordHash === this.loginModel.password) {
      if (user.twofaEnabled) {
        this.userPending2FA = this.loginModel.email;
        this.show2FA = true;
        this.isLoading = false;
        this.notification.showSuccess('Password verified. Please enter 2FA code.');
      } else {
        this.completeLogin(this.loginModel.email, user.username);
      }
    } else {
      this.isLoading = false;
      this.notification.showError('Invalid email or password. Please try again.');
    }
  }

  async onRegister(): Promise<void> {
    const error = this.validateRegister();
    if (error) {
      this.notification.showError(error);
      return;
    }

    if (this.users.has(this.registerModel.email)) {
      this.notification.showError('This email is already registered.');
      return;
    }

    this.isLoading = true;
    this.notification.showLoading('Creating your account...');

    await this.simulateDelay(1000);

    const has2FA = Math.random() < 0.5;
    this.users.set(this.registerModel.email, {
      username: this.registerModel.username,
      passwordHash: this.registerModel.password,
      twofaEnabled: has2FA
    });

    this.isLoading = false;
    this.notification.showSuccess('Registration successful! Logging you in...');
    this.completeLogin(this.registerModel.email, this.registerModel.username);
  }

  async onVerify2FA(): Promise<void> {
    if (!/^\d{6}$/.test(this.twoFaModel.code)) {
      this.notification.showError('Code must be exactly 6 digits.');
      return;
    }

    this.isLoading = true;
    this.notification.showLoading('Verifying 2FA Code...');

    await this.simulateDelay(1000);

    if (this.twoFaModel.code === '123456' && this.userPending2FA) {
      const user = this.users.get(this.userPending2FA);
      this.completeLogin(this.userPending2FA, user?.username || 'User');
    } else {
      this.isLoading = false;
      this.notification.showError('Invalid 2FA verification code.');
    }
  }

  private completeLogin(email: string, username: string): void {
    if (this.loginModel.rememberMe) {
      localStorage.setItem('rememberedUserEmail', email);
    } else {
      sessionStorage.setItem('sessionUserEmail', email);
    }

    this.isLoading = false;
    this.notification.showSuccess(`Welcome, ${username}! Redirecting...`);
    this.router.navigate(['/dashboard']);
  }

  // --- Validation Logic ---

  private validateLogin(): string | null {
    if (!this.loginModel.email) return 'Email is required.';
    if (!this.loginModel.password) return 'Password is required.';
    return null;
  }

  private validateRegister(): string | null {
    if (!this.registerModel.username || this.registerModel.username.length < 3) {
      return 'Username must be at least 3 characters.';
    }
    if (!/\S+@\S+\.\S+/.test(this.registerModel.email)) {
      return 'Please enter a valid email address.';
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

  // 1. Declare the activeTab property (default to 'login')
  activeTab: 'login' | 'register' = 'login';

  // 2. Add the switchTab function
  switchTab(tab: 'login' | 'register'): void {
    this.activeTab = tab;
    this.show2FA = false; // Reset 2FA view if active
  }

  togglePasswordVisibility(): void {
    this.showPasswordText = !this.showPasswordText;
  }

  private simulateDelay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
