import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NotificationService } from '../../services/notifications.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule], //default imports for this component
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private readonly notification: NotificationService = inject(NotificationService);

  //1. Create an object that handles the form values for email and password.
  loginObj: any =
  {
  email: '',
  password: ''
    }
  //2. Create a function that handles the form submission when the user clicks the login button.
  router = inject(Router);

  onLogin(): void {
  // 1. Show Blue Loading Banner while validating
  this.notification.showLoading('Logging into Karura MIS...');

  // Simulate network request/delay
  setTimeout(() => {
    // 2. Validate credentials
   if (this.loginObj.email === 'ndiritupatience002@gmail.com' && this.loginObj.password === '123456abj') {
      // 3. Show Green Success Banner
      this.notification.showSuccess('Login successful! Redirecting...');

      // 4. Navigate to Dashboard
      this.router.navigate(['/dashboard']);
    } else {
      // 5. Show Red Error Banner (replaces alert)
      this.notification.showError('Invalid email or password. Please try again.');
    }
  }, 1000);
}

}
